# -*- coding: utf-8 -*-
"""
对话原文归档脚本
功能：将对话存档到 memory/conversations/YYYY-MM-DD/ 目录
用法：python scripts/archive_conversation.py "话题标签" < messages.json
"""

import json
import sys
import os
import io
from datetime import datetime
from pathlib import Path

# Windows UTF-8输出
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def get_archive_dir():
    """获取归档目录"""
    today = datetime.now().strftime("%Y-%m-%d")
    base = Path(__file__).parent.parent / "memory" / "conversations" / today
    base.mkdir(parents=True, exist_ok=True)
    return base

def update_index(archive_path, topic):
    """更新索引文件"""
    index_file = Path(__file__).parent.parent / "memory" / "conversations" / "index.json"
    
    with open(index_file, 'r', encoding='utf-8') as f:
        index = json.load(f)
    
    archive_entry = {
        "path": str(archive_path),
        "topic": topic,
        "archived_at": datetime.now().isoformat(),
        "size_bytes": archive_path.stat().st_size
    }
    
    # 去重：同一topic只保留最新
    existing = [i for i in index["archives"] if i["topic"] != topic]
    index["archives"] = existing + [archive_entry]
    
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

def add_to_kg(text, entity_type, relation, target=None):
    """添加到知识图谱"""
    kg_file = Path(__file__).parent.parent / "memory" / "knowledge-graph.json"
    
    with open(kg_file, 'r', encoding='utf-8') as f:
        kg = json.load(f)
    
    entity_id = f"{entity_type}:{text}"
    
    # 添加实体
    if entity_id not in kg["entities"]:
        kg["entities"][entity_id] = {
            "name": text,
            "type": entity_type,
            "first_seen": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        }
    
    # 添加关系
    if target:
        relation_entry = {
            "from": entity_id,
            "relation": relation,
            "to": f"{relation.split('_')[0]}:{target}" if ':' not in target else target,
            "valid_from": datetime.now().isoformat()
        }
        # 去重
        existing = [r for r in kg["relations"] 
                   if not (r["from"] == relation_entry["from"] and 
                          r["relation"] == relation_entry["relation"])]
        kg["relations"] = existing + [relation_entry]
    
    # 添加事实
    fact = {
        "entity": entity_id,
        "fact": text,
        "valid_from": datetime.now().isoformat()
    }
    kg["facts"].append(fact)
    
    with open(kg_file, 'w', encoding='utf-8') as f:
        json.dump(kg, f, ensure_ascii=False, indent=2)

def main():
    if len(sys.argv) < 2:
        print("用法: python archive_conversation.py <话题标签>")
        sys.exit(1)
    
    topic = sys.argv[1]
    
    # 读取stdin
    try:
        messages = json.load(sys.stdin)
    except:
        messages = sys.stdin.read()
    
    # 生成文件名
    timestamp = datetime.now().strftime("%H%M%S")
    archive_file = get_archive_dir() / f"{topic}_{timestamp}.json"
    
    # 写入存档
    with open(archive_file, 'w', encoding='utf-8') as f:
        json.dump({
            "topic": topic,
            "archived_at": datetime.now().isoformat(),
            "messages": messages if isinstance(messages, list) else [{"text": messages}]
        }, f, ensure_ascii=False, indent=2)
    
    # 更新索引
    update_index(archive_file, topic)
    
    print(f"✅ 归档完成: {archive_file}")
    print(f"✅ 索引已更新: {topic} -> {archive_file.name}")

if __name__ == "__main__":
    main()
