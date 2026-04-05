import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect('38.165.43.138', port=22, username='root', password='pcqlJSDM0956', timeout=15)
    
    print('=== VPS litellm 添加更多模型 ===\n')
    
    # 新增的模型配置（基于已知可用的免费/低成本API）
    new_config = """model_list:
  - model_name: glm-5.0
    litellm_params:
      model: glm-5.0
      api_base: https://api.nextapi.store/v1
      api_key: sk-cupM21MpyB7fHvcJbA8ju2pC6voA7pLvOnKhCXPVIrAOwQEf
      custom_llm_provider: openai

  - model_name: gpt-4o-mini
    litellm_params:
      model: gpt-4o-mini
      api_base: https://openai.aiassist.top/v1
      api_key: EMPTY_KEY
      custom_llm_provider: openai

  - model_name: claude-3-haiku
    litellm_params:
      model: anthropic/claude-3-haiku-20240307
      api_base: https://openai.aiassist.top/v1
      api_key: EMPTY_KEY
      custom_llm_provider: openai

  - model_name: gemini-pro
    litellm_params:
      model: gemini/gemini-pro
      api_base: https://openai.aiassist.top/v1
      api_key: EMPTY_KEY
      custom_llm_provider: openai

litellm_settings:
  drop_params: true
  set_verbose: false

general_settings:
  master_key: sk-litellm-2026
  port: 4000
  host: 0.0.0.0
"""
    
    print('新的 litellm 配置：')
    print(new_config)
    
    # 备份当前配置
    print('\n=== 备份当前配置 ===')
    stdin, stdout, stderr = client.exec_command('cp /root/litellm/config.yaml /root/litellm/config.yaml.backup')
    stdout.channel.recv_exit_status()
    print('已备份到 /root/litellm/config.yaml.backup')
    
    # 写入新配置
    print('\n=== 更新 litellm 配置 ===')
    sftp = client.open_sftp()
    with sftp.open('/root/litellm/config.yaml', 'w') as f:
        f.write(new_config)
    sftp.close()
    print('配置已写入')
    
    # 重启 litellm 容器
    print('\n=== 重启 litellm 容器 ===')
    stdin, stdout, stderr = client.exec_command('cd /root/litellm && docker compose restart')
    stdout.channel.recv_exit_status()
    print('litellm 已重启')
    
    # 等待服务启动
    print('\n等待服务启动...')
    import time
    time.sleep(10)
    
    # 检查状态
    print('\n=== 检查 litellm 状态 ===')
    stdin, stdout, stderr = client.exec_command('docker ps | grep litellm')
    print(stdout.read().decode())
    
    # 检查日志
    print('\n=== litellm 日志 ===')
    stdin, stdout, stderr = client.exec_command('docker logs litellm-proxy --tail 20 2>&1')
    print(stdout.read().decode()[:1000])
    
    client.close()
    print('\n=== 完成 ===')
    
except Exception as e:
    print(f'Error: {e}')
