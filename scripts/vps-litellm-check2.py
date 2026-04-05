import urllib.request
import json
import time

# VPS litellm 配置
VPS_HOST = "38.165.43.138"
VPS_PORT = 4000
LITELLM_KEY = "sk-litellm-2026"
BASE_URL = f"http://{VPS_HOST}:{VPS_PORT}"

def test_litellm():
    print('=== 测试 VPS litellm 各模型 ===\n')
    
    # 测试模型列表
    print('1. 获取模型列表...')
    req = urllib.request.Request(
        f'{BASE_URL}/v1/models',
        headers={'Authorization': f'Bearer {LITELLM_KEY}'}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            print('可用模型:')
            if 'data' in data:
                for model in data['data']:
                    print(f'  - {model.get("id", "unknown")}')
            else:
                print(json.dumps(data, indent=2)[:1000])
    except Exception as e:
        print(f'错误: {e}')
    
    # 测试各个模型
    models = ['glm-5.0', 'gpt-4o-mini', 'claude-3-haiku', 'gemini-pro']
    
    for model in models:
        print(f'\n2. 测试模型: {model}')
        data = json.dumps({
            "model": model,
            "messages": [{"role": "user", "content": "说 hello"}],
            "max_tokens": 30
        }).encode()
        
        req = urllib.request.Request(
            f'{BASE_URL}/v1/chat/completions',
            data=data,
            headers={
                'Authorization': f'Bearer {LITELLM_KEY}',
                'Content-Type': 'application/json'
            }
        )
        
        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                result = json.loads(response.read().decode())
                if 'choices' in result and len(result['choices']) > 0:
                    content = result['choices'][0]['message'].get('content', '')
                    print(f'  响应: {content[:200] if content else "(空内容)"}')
                else:
                    print(f'  响应: {json.dumps(result, indent=2)[:300]}')
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f'  HTTP错误 {e.code}: {error_body[:300]}')
        except Exception as e:
            print(f'  错误: {e}')

test_litellm()
