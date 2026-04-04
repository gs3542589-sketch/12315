# Ollama 安装与配置脚本（Windows）

## 步骤1：下载 Ollama
访问 https://ollama.com/download/windows 下载安装包

## 步骤2：安装后配置本地模型
```powershell
# 安装轻量化模型（推荐 llama3.2:1b）
ollama pull llama3.2:1b

# 或安装更小的模型
ollama pull llama3.2:latest
```

## 步骤3：验证安装
```powershell
ollama list
```

## 步骤4：配置 OpenClaw 使用本地模型
在 openclaw.json 中添加：
```json
{
  "heartbeat": {
    "model": "local:llama3.2"
  }
}
```

## 可用模型推荐（按大小）
- llama3.2:1b - 约 1.3GB，适合心跳任务
- llama3.2:3b - 约 2GB，性能更好
- qwen2.5:0.5b - 约 350MB，最轻量
- phi3:mini - 约 2.3GB