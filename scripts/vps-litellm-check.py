import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect('38.165.43.138', port=22, username='root', password='pcqlJSDM0956', timeout=15)
    print('=== VPS litellm-proxy 详细检查 ===')
    
    # 检查 litellm 配置
    print('\n=== litellm 配置目录 ===')
    stdin, stdout, stderr = client.exec_command('ls -la /root/litellm/')
    print(stdout.read().decode())
    
    # 检查 docker-compose.yml
    print('\n=== docker-compose.yml ===')
    stdin, stdout, stderr = client.exec_command('cat /root/litellm/docker-compose.yml')
    print(stdout.read().decode())
    
    # 检查 litellm 日志
    print('\n=== litellm 日志 (最近50行) ===')
    stdin, stdout, stderr = client.exec_command('docker logs litellm-proxy --tail 50 2>&1')
    print(stdout.read().decode()[:3000])
    
    # 检查环境变量
    print('\n=== litellm 环境变量 ===')
    stdin, stdout, stderr = client.exec_command('docker exec litellm-proxy env | grep -E "LITELLM|OPENAI|ANTHROPIC|API_KEY|VERTEX|GOOGLE"')
    print(stdout.read().decode())
    
    # 检查 models 配置
    print('\n=== litellm models config ===')
    stdin, stdout, stderr = client.exec_command('docker exec litellm-proxy cat /app/proxy_server.log 2>/dev/null | tail -30 || docker logs litellm-proxy --tail 100 2>&1 | grep -i "model\|config\|error\|started\|loaded" | tail -30')
    print(stdout.read().decode()[:2000])
    
    # 测试 API 连接
    print('\n=== 测试 litellm API ===')
    stdin, stdout, stderr = client.exec_command('curl -s http://localhost:4000/health 2>&1 || curl -s http://localhost:4000/ 2>&1')
    print(stdout.read().decode()[:1000])
    
    # 检查 litellm 版本
    print('\n=== litellm 版本 ===')
    stdin, stdout, stderr = client.exec_command('docker exec litellm-proxy litellm --version 2>/dev/null || docker exec litellm-proxy pip show litellm 2>/dev/null | grep Version')
    print(stdout.read().decode())
    
    # 检查公网访问
    print('\n=== 检查公网可访问性 ===')
    stdin, stdout, stderr = client.exec_command('curl -s --max-time 5 http://38.165.43.138:4000/health 2>&1')
    print(stdout.read().decode()[:500])
    
    # 检查防火墙
    print('\n=== 防火墙状态 ===')
    stdin, stdout, stderr = client.exec_command('ufw status 2>/dev/null || iptables -L -n 2>/dev/null | head -30')
    print(stdout.read().decode())
    
    client.close()
    print('\n=== 检查完成 ===')
    
except Exception as e:
    print(f'Error: {e}')
