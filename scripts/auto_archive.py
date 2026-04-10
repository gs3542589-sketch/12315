# -*- coding: utf-8 -*-
"""
归档触发自动化脚本
功能：归档决策 + 执行归档，支持两种触发方式：
  1. cron触发（推荐）：通过sessions_list工具获取会话列表，自动归档达标准会话
  2. 手动触发：python auto_archive.py --dry-run
用法：
  # 审计模式（不实际归档）
  python scripts/auto_archive.py --dry-run

  # 手动归档指定会话（通过sessions_list获取key后）
  python scripts/auto_archive.py --session SESSION_KEY --archive

  # cron模式（由AI Agent调用sessions_list后传入消息）
  python scripts/auto_archive.py --check-session SESSION_KEY --message-count N --has-keywords

Cron推荐配置：
  - 每2小时扫描一次
  - 触发条件：对话轮次>30 或 命中关键词
  - 自动调用 archive_conversation.py 完成归档
"""

import json
import sys
import io
import re
from datetime import datetime, timedelta
from pathlib import Path

# Windows UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ========== 配置 ==========
CONFIG = {
    "min_turns": 30,          # 归档最低轮次
    "archive_keywords": [
        "测试", "test", "决策", "决定", "项目",
        "完成", "成功", "失败", "报错",
        "方案", "优化", "改进", "新增",
        "git", "commit", "push", "归档", "脚本"
    ],
    "cooldown_hours": 12,      # 同话题归档冷却
    "max_archive_messages": 200,
}

WORKSPACE = Path(__file__).parent.parent
ARCHIVE_SCRIPT = WORKSPACE / "scripts" / "archive_conversation.py"
ARCHIVE_DIR = WORKSPACE / "memory" / "conversations"
INDEX_FILE = ARCHIVE_DIR / "index.json"
STATE_FILE = WORKSPACE / "memory" / "archive_state.json"


def load_state():
    if STATE_FILE.exists():
        with open(STATE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"last_archives": {}, "total_archived": 0}


def save_state(state):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def extract_topic(messages, default=None):
    """从消息中提取归档话题"""
    if not messages:
        return default or f"archive_{datetime.now().strftime('%H%M%S')}"

    keywords_found = []

    for msg in messages[-50:]:
        content = ""
        if isinstance(msg, dict):
            content = msg.get("text", "") or msg.get("content", "") or msg.get("message", "")
        else:
            content = str(msg)

        for kw in CONFIG["archive_keywords"]:
            if kw.lower() in content.lower():
                idx = content.lower().find(kw.lower())
                start = max(0, idx - 5)
                end = min(len(content), idx + len(kw) + 15)
                snippet = content[start:end].strip()
                if 3 < len(snippet) < 40:
                    keywords_found.append(snippet)

    if keywords_found:
        # 返回最常见的片段
        from collections import Counter
        counter = Counter(keywords_found)
        return counter.most_common(1)[0][0][:30]

    # 回退：从第一条用户消息提取
    for msg in messages:
        if isinstance(msg, dict) and msg.get("role") == "user":
            content = msg.get("text", "") or msg.get("content", "") or ""
            if content and len(content) > 5:
                return content[:30]

    return default or f"session_{datetime.now().strftime('%H%M%S')}"


def call_archive(messages, topic):
    """调用archive_conversation.py归档"""
    import subprocess

    # 只取最近N条消息
    msgs = messages[-CONFIG["max_archive_messages"]:] if isinstance(messages, list) else [{"text": str(messages)}]

    proc = subprocess.Popen(
        [sys.executable, str(ARCHIVE_SCRIPT), topic],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=str(WORKSPACE)
    )
    out, err = proc.communicate(
        input=json.dumps(msgs, ensure_ascii=False).encode('utf-8'),
        timeout=30
    )
    return out.decode('utf-8', errors='replace'), err.decode('utf-8', errors='replace')


def check_cooldown(topic):
    """检查冷却期"""
    state = load_state()
    last = state.get("last_archives", {}).get(topic)
    if not last:
        return True, "从未归档"
    elapsed = datetime.now() - datetime.fromisoformat(last)
    if elapsed < timedelta(hours=CONFIG["cooldown_hours"]):
        remaining = CONFIG["cooldown_hours"] - elapsed.total_seconds() / 3600
        return False, f"冷却中，还剩{remaining:.1f}h"
    return True, "冷却已过"


def should_archive(turn_count, has_keywords):
    """判断是否应该归档"""
    if has_keywords:
        return True, "✅ 命中关键词"
    if turn_count >= CONFIG["min_turns"] * 2:
        return True, f"✅ 轮次{turn_count}>={CONFIG['min_turns']*2}"
    if turn_count >= CONFIG["min_turns"]:
        return True, f"✅ 轮次{turn_count}>={CONFIG['min_turns']}"
    return False, f"⏭️  轮次{turn_count}<{CONFIG['min_turns']}"


def decide_archive(turn_count, has_keywords):
    """归档决策"""
    should, reason = should_archive(turn_count, has_keywords)
    return should  # 实际归档还需要额外check冷却


# ==================================================================
# 入口
# ==================================================================

def main():
    args = sys.argv[1:]

    # -------- 审计模式 --------
    if "--dry-run" in args or "-n" in args:
        state = load_state()
        print(f"\n{'='*50}")
        print(f"📋  归档审计报告")
        print(f"{'='*50}")
        print(f"  配置: 最低{CONFIG['min_turns']}轮, 冷却{CONFIG['cooldown_hours']}h")
        print(f"  累计归档: {state.get('total_archived', 0)} 次")
        print(f"  最近归档: {list(state.get('last_archives', {}).keys())[-3:]}")
        print(f"\n  💡  使用 --check-session <key> --message-count N [--has-keywords]")
        print(f"     测试指定会话是否应归档")
        print(f"{'='*50}")
        return

    # -------- 单会话检查模式 --------
    if "--check-session" in args:
        idx = args.index("--check-session")
        session_key = args[idx + 1] if idx + 1 < len(args) else ""

        msg_count_idx = next((i for i, a in enumerate(args) if a == "--message-count"), -1)
        turn_count = int(args[msg_count_idx + 1]) if msg_count_idx >= 0 else 0

        has_keywords = "--has-keywords" in args

        # 从topics文件获取topic
        topic_idx = next((i for i, a in enumerate(args) if a == "--topic"), -1)
        topic = args[topic_idx + 1] if topic_idx >= 0 else extract_topic([], default="session")

        # 冷却检查
        can_archive, cooldown_reason = check_cooldown(topic)

        # 归档判断
        should, reason = should_archive(turn_count, has_keywords)

        print(f"\n{'='*50}")
        print(f"🔍  会话归档检查")
        print(f"{'='*50}")
        print(f"  会话:   {session_key[:20]}...")
        print(f"  话题:   {topic}")
        print(f"  轮次:   {turn_count}")
        print(f"  关键词: {'是' if has_keywords else '否'}")
        print(f"  冷却:   {cooldown_reason}")
        print(f"  归档:   {reason}")
        print(f"  最终:   {'✅ 可以归档' if (should and can_archive) else '❌ 不归档'}")

        if should and can_archive:
            print(f"\n  💡 执行归档: python auto_archive.py --do-archive --session {session_key}")
        print(f"{'='*50}")
        return

    # -------- 归档执行模式 --------
    if "--do-archive" in args or "--archive" in args:
        session_key_idx = next((i for i, a in enumerate(args) if a == "--session"), -1)
        session_key = args[session_key_idx + 1] if session_key_idx >= 0 else "unknown"

        topic_idx = next((i for i, a in enumerate(args) if a == "--topic"), -1)
        topic = args[topic_idx + 1] if topic_idx >= 0 else f"session_{datetime.now().strftime('%H%M%S')}"

        # 冷却检查
        can_archive, reason = check_cooldown(topic)
        if not can_archive:
            print(f"❌  冷却中，无法归档: {reason}")
            sys.exit(0)

        # 从文件或stdin读取消息
        messages = []
        file_idx = next((i for i, a in enumerate(args) if a == "--file"), -1)
        if file_idx >= 0 and file_idx + 1 < len(args):
            msg_file = Path(args[file_idx + 1])
            if msg_file.exists():
                with open(msg_file, 'r', encoding='utf-8') as f:
                    messages = json.load(f)
        elif not sys.stdin.isatty():
            try:
                messages = json.load(sys.stdin)
            except:
                raw = sys.stdin.read()
                messages = [{"text": raw}] if raw.strip() else []

        if not messages:
            print("❌  没有消息可归档（请用 --file path.json 或 stdin 传入消息JSON）")
            sys.exit(1)

        topic = extract_topic(messages, default=topic)
        out, err = call_archive(messages, topic)

        if err:
            print(f"⚠️  {err[:200]}")

        # 更新状态
        state = load_state()
        state["last_archives"][topic] = datetime.now().isoformat()
        state["total_archived"] = state.get("total_archived", 0) + 1
        save_state(state)

        print(f"\n{'='*50}")
        print(f"✅  归档完成")
        print(f"{'='*50}")
        print(f"  会话: {session_key[:30]}")
        print(f"  话题: {topic}")
        print(f"  消息数: {len(messages)}")
        print(f"  累计归档: {state['total_archived']} 次")
        print(f"{'='*50}")
        return

    # -------- 默认 --------
    print("用法：")
    print("  python auto_archive.py --dry-run                              # 审计")
    print("  python auto_archive.py --check-session KEY --message-count N    # 检查会话")
    print("  python auto_archive.py --do-archive --session KEY < msgs.json  # 执行归档")


if __name__ == "__main__":
    main()
