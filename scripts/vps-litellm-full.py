import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect('38.165.43.138', port=22, username='root', password='pcqlJSDM0956', timeout=15)
    
    print('=== litellm config.yaml ===')
    stdin, stdout, stderr = client.exec_command('cat /root/litellm/config.yaml')
    print(stdout.read().decode())
    
    print('\n=== litellm 模型列表 ===')
    stdin, stdout, stderr = client.exec_command('curl -s -H "Authorization: Bearer sk-key" http://localhost:4000/v1/model_list 2>&1')
    print(stdout.read().decode())
    
    print('\n=== 检查公网 4000 端口 ===')
    stdin, stdout, stderr = client.exec_command('curl -s --max-time 5 http://38.165.43.138:4000/health 2>&1')
    print(stdout.read().decode())
    
    print('\n=== litellm 环境变量 (API Keys) ===')
    stdin, stdout, stderr = client.exec_command('docker exec litellm-proxy env 2>/dev/null | grep -i "key\|token\|secret" | grep -v "PATH\|HOME"')
    print(stdout.read().decode())
    
    client.close()
    
except Exception as e:
    print(f'Error: {e}')
