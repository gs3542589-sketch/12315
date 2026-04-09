# -*- coding: utf-8 -*-
"""
知识图谱查询脚本
功能：查询实体、关系、时序事实
用法：
  python scripts/kg_query.py entity <名称>
  python scripts/kg_query.py relations <实体ID>
  python scripts/kg_query.py timeline <实体>
"""

import json
import sys
import io
from pathlib import Path

# Windows UTF-8输出
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

KG_FILE = Path(__file__).parent.parent / "memory" / "knowledge-graph.json"

def load_kg():
    with open(KG_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def query_entity(name):
    """查询实体"""
    kg = load_kg()
    results = []
    
    for entity_id, entity in kg["entities"].items():
        if name.lower() in entity["name"].lower():
            results.append(entity)
    
    return results

def query_relations(entity_id):
    """查询实体的关系"""
    kg = load_kg()
    return [r for r in kg["relations"] if r["from"] == entity_id]

def query_timeline(entity_name):
    """查询实体的时序事实"""
    kg = load_kg()
    entity_id = None
    
    for eid, entity in kg["entities"].items():
        if entity_name.lower() == entity["name"].lower():
            entity_id = eid
            break
    
    if not entity_id:
        return []
    
    facts = [f for f in kg["facts"] if f["entity"] == entity_id]
    relations = [r for r in kg["relations"] 
                 if r["from"] == entity_id or r["to"] == entity_id]
    
    return {"entity": entity_id, "facts": facts, "relations": relations}

def main():
    if len(sys.argv) < 2:
        print("用法:")
        print("  python kg_query.py entity <名称>")
        print("  python kg_query.py relations <实体ID>")
        print("  python kg_query.py timeline <实体名>")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "entity":
        results = query_entity(sys.argv[2] if len(sys.argv) > 2 else "")
        print(json.dumps(results, ensure_ascii=False, indent=2))
    elif cmd == "relations":
        results = query_relations(sys.argv[2] if len(sys.argv) > 2 else "")
        print(json.dumps(results, ensure_ascii=False, indent=2))
    elif cmd == "timeline":
        results = query_timeline(sys.argv[2] if len(sys.argv) > 2 else "")
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        print(f"未知命令: {cmd}")
        sys.exit(1)

if __name__ == "__main__":
    main()
