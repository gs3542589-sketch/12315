# -*- coding: utf-8 -*-
"""
KG自动入库脚本 - 从对话文本中自动抽取知识
功能：从对话中自动识别实体、关系、事实，入库到知识图谱
用法：
  echo "对话文本" | python scripts/kg_auto_extract.py [--dry-run]
  python scripts/kg_auto_extract.py --text "对话文本"
"""

import json
import sys
import io
import re
from datetime import datetime
from pathlib import Path

# Windows UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

KG_FILE = Path(__file__).parent.parent / "memory" / "knowledge-graph.json"

# ============================================================
# 抽取规则（借鉴MemPalace的marker检测思路）
# ============================================================
EXTRACTION_RULES = [
    # 决策类：决定/decided/决策/选择/采用/启用
    {
        "pattern": re.compile(
            r'(?:决定|decided|决策|选择|采用|启用|放弃|停用|取消)[了是]?\s*(.+?)(?=(?:，|。)|$)',
            re.IGNORECASE
        ),
        "entity_type": "decision",
        "id_prefix": "decision",
        "label": "决策"
    },
    # 偏好类：喜欢/prefer/倾向/偏好/更想要
    {
        "pattern": re.compile(
            r'(?:喜欢|prefer|倾向|偏好|更想要|宁愿|选用)[了是]?\s*(.+?)(?=(?:，|。)|$)',
            re.IGNORECASE
        ),
        "entity_type": "preference",
        "id_prefix": "pref",
        "label": "偏好"
    },
    # 工具/技术类：用了/使用/采用/基于/依赖
    {
        "pattern": re.compile(
            r'(?:用了|使用|采用|基于|依赖|借助|通过)[了]?\s*(.+?)(?=(?:，|。)|$)',
            re.IGNORECASE
        ),
        "entity_type": "tool",
        "id_prefix": "tool",
        "label": "工具"
    },
    # 项目类：新建/创建/开始/完成/项目中
    {
        "pattern": re.compile(
            r'(?:新建|创建|开始|启动|完成|进行|实现了|完成了|项目中)[了]?\s*(.+?)(?=(?:，|。)|$)',
            re.IGNORECASE
        ),
        "entity_type": "project",
        "id_prefix": "project",
        "label": "项目"
    },
    # 规则/约束类：必须/不能/需要/要求/应该
    {
        "pattern": re.compile(
            r'(?:必须|不能|需要|要求|应该|应当)\s*(.+?)(?=(?:，|。)|$)',
            re.IGNORECASE
        ),
        "entity_type": "rule",
        "id_prefix": "rule",
        "label": "规则"
    },
    # 问题/异常类：错误/失败/报错/异常/问题
    {
        "pattern": re.compile(
            r'(?:错误|失败|报错|异常|问题|bug)[：:]\s*(.+?)(?=(?:，|。)|$)',
            re.IGNORECASE
        ),
        "entity_type": "issue",
        "id_prefix": "issue",
        "label": "问题"
    },
]

# 关系提取：主语 + 动词 + 宾语
RELATION_RULES = [
    re.compile(r'(.+?)使用了(.+?)(?:，|。|$)'),
    re.compile(r'(.+?)依赖(.+?)(?:，|。|$)'),
    re.compile(r'(.+?)包含(.+?)(?:，|。|$)'),
    re.compile(r'(.+?)包括(.+?)(?:，|。|$)'),
    re.compile(r'(.+?)优于(.+?)(?:，|。|$)'),
]


def load_kg():
    """加载知识图谱"""
    if not KG_FILE.exists():
        return {
            "schema": "kg-v1",
            "description": "知识图谱 - 自动抽取版",
            "entities": {},
            "relations": [],
            "facts": []
        }
    with open(KG_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_kg(kg):
    """保存知识图谱"""
    KG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(KG_FILE, 'w', encoding='utf-8') as f:
        json.dump(kg, f, ensure_ascii=False, indent=2)


def make_entity_id(prefix, name):
    """生成实体ID"""
    # 清理名称
    clean = re.sub(r'[^\w\u4e00-\u9fff]', '_', name.strip())[:30]
    return f"{prefix}:{clean}"


def is_meaningful(text):
    """判断抽取的文本是否有意义（去噪）"""
    if len(text) < 2:
        return False
    # 过滤纯标点、数字、太短的
    if re.match(r'^[\d\W]+$', text):
        return False
    if len(text) < 3:
        return False
    # 过滤常见无意义词
    noise = ['的', '了', '是', '一个', '一些', '这个', '那个', '什么', '怎么']
    if text in noise:
        return False
    return True


def extract_from_text(text):
    """从文本中抽取知识"""
    extracted = {
        "entities": [],  # [{id, name, type}]
        "relations": [],  # [{from, relation, to}]
        "facts": []       # [{entity, fact}]
    }

    lines = text.split('\n')

    for line in lines:
        # 跳过太短的行
        if len(line) < 5:
            continue

        # 应用每条规则
        for rule in EXTRACTION_RULES:
            matches = rule["pattern"].findall(line)
            for match in matches:
                raw = match.strip() if isinstance(match, str) else str(match).strip()

                # 噪音过滤
                if not is_meaningful(raw):
                    continue

                entity_id = make_entity_id(rule["id_prefix"], raw)
                entity = {
                    "id": entity_id,
                    "name": raw,
                    "type": rule["entity_type"],
                    "label": rule["label"],
                    "extracted_from": "auto"
                }

                # 去重
                if entity not in extracted["entities"]:
                    extracted["entities"].append(entity)

                # 生成事实
                fact = {
                    "entity": entity_id,
                    "fact": f"[自动抽取] {rule['label']}：{raw}",
                    "source_text": line[:100],
                    "valid_from": datetime.now().isoformat()
                }
                extracted["facts"].append(fact)

        # 关系提取
        for rel_rule in RELATION_RULES:
            matches = rel_rule.findall(line)
            for match in matches:
                if len(match) == 2:
                    from_entity = match[0].strip()
                    to_entity = match[1].strip()
                    if is_meaningful(from_entity) and is_meaningful(to_entity):
                        rel = {
                            "from": make_entity_id("entity", from_entity),
                            "relation": "relates_to",
                            "to": make_entity_id("entity", to_entity),
                            "valid_from": datetime.now().isoformat()
                        }
                        if rel not in extracted["relations"]:
                            extracted["relations"].append(rel)

    return extracted


def merge_to_kg(extracted, dry_run=False):
    """合并抽取结果到知识图谱"""
    kg = load_kg()

    results = {
        "entities_added": 0,
        "entities_skipped": 0,
        "relations_added": 0,
        "facts_added": 0
    }

    now = datetime.now().isoformat()

    for entity in extracted["entities"]:
        eid = entity["id"]
        if eid not in kg["entities"]:
            kg["entities"][eid] = {
                "name": entity["name"],
                "type": entity["type"],
                "first_seen": now,
                "last_updated": now,
                "label": entity.get("label", entity["type"]),
                "source": "auto_extract"
            }
            results["entities_added"] += 1
        else:
            # 更新last_updated
            kg["entities"][eid]["last_updated"] = now
            results["entities_skipped"] += 1

    for relation in extracted["relations"]:
        # 去重
        exists = any(
            r["from"] == relation["from"] and
            r["relation"] == relation["relation"] and
            r["to"] == relation["to"]
            for r in kg["relations"]
        )
        if not exists:
            kg["relations"].append(relation)
            results["relations_added"] += 1

    for fact in extracted["facts"]:
        # 去重（同实体同事实内容不重复）
        exists = any(
            f["entity"] == fact["entity"] and
            f["fact"] == fact["fact"]
            for f in kg["facts"]
        )
        if not exists:
            kg["facts"].append(fact)
            results["facts_added"] += 1

    if not dry_run:
        save_kg(kg)

    return results


def main():
    dry_run = "--dry-run" in sys.argv or "-n" in sys.argv

    # 从stdin读取
    text = ""
    if "--file" in sys.argv:
        idx = sys.argv.index("--file")
        file_path = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else ""
        if file_path:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
    elif "--text" in sys.argv:
        idx = sys.argv.index("--text")
        # Windows PowerShell中文编码问题：直接从argv读取
        text = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else ""
    elif not sys.stdin.isatty():
        text = sys.stdin.read()
    else:
        print("用法：")
        print("  echo '对话文本' | python kg_auto_extract.py [--dry-run]")
        print("  python kg_auto_extract.py --text '对话文本' [--dry-run]")
        sys.exit(1)

    if not text.strip():
        print("⚠️  输入为空，无内容可抽取")
        sys.exit(0)

    # 抽取
    extracted = extract_from_text(text)

    if not extracted["entities"]:
        print("🔍  未检测到可抽取的知识（规则未命中）")
        sys.exit(0)

    # 合并到KG
    results = merge_to_kg(extracted, dry_run=dry_run)

    # 输出结果
    mode = "[dry-run] " if dry_run else ""
    print(f"\n{'='*50}")
    print(f"{mode}KG自动抽取报告")
    print(f"{'='*50}")
    print(f"  📦 实体新增:  {results['entities_added']}")
    print(f"  ⏭️  实体跳过:  {results['entities_skipped']} (已存在)")
    print(f"  🔗 关系新增:  {results['relations_added']}")
    print(f"  📝 事实新增:  {results['facts_added']}")
    print(f"\n  抽取的实体：")
    for e in extracted["entities"]:
        print(f"    · [{e['type']}] {e['name']}")
    print(f"{'='*50}")

    if dry_run:
        print(f"\n💡  添加 --dry-run 参数仅预览，实际不会写入KG")
    else:
        print(f"\n✅  已写入: {KG_FILE}")


if __name__ == "__main__":
    main()
