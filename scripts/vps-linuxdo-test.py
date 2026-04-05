import paramiko
import urllib.request
import json

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect('38.165.43.138', port=22, username='root', password='pcqlJSDM0956', timeout=15)
    
    print('=== 测试 VPS 访问 linux.do ===')
    stdin, stdout, stderr = client.exec_command('curl -s --max-time 10 -I https://linux.do 2>&1 | head -10')
    print(stdout.read().decode())
    
    print('\n=== VPS 本地访问 linux.do ===')
    stdin, stdout, stderr = client.exec_command('curl -s --max-time 10 https://linux.do 2>&1 | head -20')
    result = stdout.read().decode()
    print(result[:1000] if result else '无法访问')
    
    print('\n=== 测试 litellm API ===')
    # Test with the master key
    data = json.dumps({
        "model": "glm-5.0",
        "messages": [{"role": "user", "content": "Say hello"}],
        "max_tokens": 10
    }).encode()
    
    req = urllib.request.Request(
        'http://38.165.43.138:4000/v1/chat/completions',
        data=data,
        headers={
            'Authorization': 'Bearer sk-litellm-2026',
            'Content-Type': 'application/json'
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            result = response.read().decode()
            print('litellm API 响应:', result[:500])
    except Exception as e:
        print('litellm API 错误:', str(e))
    
    client.close()
    
except Exception as e:
    print(f'Error: {e}')
