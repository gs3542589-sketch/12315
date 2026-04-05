import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect('38.165.43.138', port=22, username='root', password='pcqlJSDM0956', timeout=15)
    print('=== VPS 连接成功 ===')
    
    # 检查 Docker 容器
    print('\n=== Docker 容器 ===')
    stdin, stdout, stderr = client.exec_command('docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"')
    print(stdout.read().decode())
    if stderr.read().decode():
        print("STDERR:", stderr.read().decode())
    
    # 检查 OneAPI
    print('\n=== OneAPI/FlareLLM ===')
    stdin, stdout, stderr = client.exec_command('docker ps | grep -i oneapi')
    containers = stdout.read().decode()
    if containers:
        print(containers)
    else:
        print('OneAPI 容器未运行')
        # 列出所有容器
        stdin, stdout, stderr = client.exec_command('docker ps -a --format "{{.Names}}"')
        all_containers = stdout.read().decode()
        print('所有容器:', all_containers)
    
    # 检查监听端口
    print('\n=== 监听端口 ===')
    stdin, stdout, stderr = client.exec_command('ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null')
    print(stdout.read().decode()[:2000])
    
    # 检查 Nginx
    print('\n=== Nginx ===')
    stdin, stdout, stderr = client.exec_command('docker ps | grep nginx')
    nginx = stdout.read().decode()
    if nginx:
        print(nginx)
    else:
        print('Nginx 未运行')
    
    # 检查 docker-compose
    print('\n=== Docker Compose 文件 ===')
    stdin, stdout, stderr = client.exec_command('find /root -name "docker-compose*.yml" -o -name "*.yml" 2>/dev/null | head -10')
    print(stdout.read().decode())
    
    # 检查域名
    print('\n=== 域名/Nginx配置 ===')
    stdin, stdout, stderr = client.exec_command('ls -la /etc/nginx/sites-enabled/ 2>/dev/null || ls -la /etc/nginx/conf.d/ 2>/dev/null')
    print(stdout.read().decode())
    
    # 检查端口映射
    print('\n=== Docker 端口映射 ===')
    stdin, stdout, stderr = client.exec_command('docker ps --format "{{.Names}}: {{.Ports}}"')
    ports = stdout.read().decode()
    print(ports)
    
    client.close()
    print('\n=== 检查完成 ===')
    
except Exception as e:
    print(f'连接失败: {e}')
