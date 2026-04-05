import urllib.request, json

# Test available API endpoints
apis = [
    ('北极API无KEY', 'https://bapi.outaucer.me/v1/models', None),
]

for name, url, key in apis:
    try:
        req = urllib.request.Request(url)
        if key:
            req.add_header('Authorization', f'Bearer {key}')
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            print(f'{name}: OK')
            if 'data' in data:
                models = [m.get('id', 'unknown') for m in data['data'][:10]]
                print(f'  Models: {models}')
            elif 'error' in data:
                print(f'  Error: {data["error"]}')
    except Exception as e:
        print(f'{name}: ERROR - {str(e)[:100]}')
