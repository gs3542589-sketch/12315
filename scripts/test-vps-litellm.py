import urllib.request
import json

# VPS litellm 配置
VPS_HOST = "38.165.43.138"
VPS_PORT = 4000
LITELLM_KEY = "sk-litellm-2026"
BASE_URL = f"http://{VPS_HOST}:{VPS_PORT}"

def test_litellm():
    print('=== 测试 VPS litellm API ===\n')
    
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
                print(json.dumps(data, indent=2)[:500])
    except Exception as e:
        print(f'错误: {e}')
    
    # 测试对话
    print('\n2. 测试对话...')
    data = json.dumps({
        "model": "glm-5.0",
        "messages": [{"role": "user", "content": "你好，测试一下"}],
        "max_tokens": 50
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
            print('响应:')
            if 'choices' in result and len(result['choices']) > 0:
                print(result['choices'][0]['message'].get('content', ''))
            else:
                print(json.dumps(result, indent=2)[:500])
    except Exception as e:
        print(f'错误: {e}')
    
    # 测试 embedding
    print('\n3. 测试 embedding...')
    data = json.dumps({
        "model": "glm-5.0",
        "input": "测试文本"
    }).encode()
    
    req = urllib.request.Request(
        f'{BASE_URL}/v1/embeddings',
        data=data,
        headers={
            'Authorization': f'Bearer {LITELLM_KEY}',
            'Content-Type': 'application/json'
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode())
            print('Embedding 响应: success' if 'data' in result else json.dumps(result, indent=2)[:500])
    except Exception as e:
        print(f'Embedding 错误: {e}')

test_litellm()
