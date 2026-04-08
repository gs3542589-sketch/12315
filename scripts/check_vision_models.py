import requests, json

resp = requests.get('https://yunwu.ai/api/pricing', timeout=15)
data = resp.json()

# Find all vision models (识图 tag)
vision_models = []
all_info = data['data']['model_info']
for key, info in all_info.items():
    tags = info.get('tags', [])
    if any(t in ['识图', '视觉', '图片'] for t in tags):
        vision_models.append({
            'id': key,
            'supplier': info.get('supplier', ''),
            'tags': tags,
            'desc': info.get('illustrate', '')[:100]
        })

print(f'Found {len(vision_models)} vision models:')
for m in vision_models:
    print(f"  [{m['supplier']}] {m['id']}")
    print(f"    Tags: {m['tags']}")
    print(f"    {m['desc']}")
    print()
