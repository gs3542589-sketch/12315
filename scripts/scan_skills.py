# -*- coding: utf-8 -*-
import os, glob, json

base = r'C:\Users\Administrator\.qclaw\workspace\skills'
skills = [d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d)) and not d.startswith('.') and not d.endswith('__pycache__')]

results = []
for skill in sorted(skills):
    skill_md = os.path.join(base, skill, 'SKILL.md')
    desc = ''
    if os.path.exists(skill_md):
        with open(skill_md, encoding='utf-8') as f:
            content = f.read(3000)
        for line in content.split('\n')[:20]:
            line = line.strip()
            if line.startswith('description:'):
                desc = line.replace('description:', '').strip().strip('"').strip("'")
                break
            if line.startswith('name:'):
                pass  # skip name
    results.append({'skill': skill, 'desc': desc[:200]})

print(json.dumps(results, ensure_ascii=False, indent=2))
