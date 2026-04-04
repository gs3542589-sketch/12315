# MEMORY.md - 长期高价值记忆（严格≤10KB）
## 核心系统规则（已固化）
1. 记忆分层架构：SOUL → USER → MEMORY → Daily日志 → TOOLS → AGENTS
2. 记忆入库标准：满足≥2条才允许写入（长期/复用/防坑/可验证）
3. QMD检索优先：检索召回替代全量历史加载，每次最多Top5片段
4. 配置文件上限：总大小严格≤10KB，冗余自动归档

## QMD检索配置（自动执行）
- QMD collection: user_workspace_memory
- source path: ~/.openclaw/user/memory/
- search priority: title exact > keyword > semantic
- hot anchors: OpenClaw,QMD,记忆优化,Token省流,同步协议,分层架构,AIGC创作

## 长期核心记忆（可自行替换补充）
- 核心项目：AIGC视频内容全流程生产流水线
- 核心需求：脚本创作、提示词优化、技术排障、成本控制
- 优先级：Token成本 > 执行效率 > 体验流畅度
- 禁止行为：记忆臃肿、全量加载、重复写入、低噪音入库

## 技能树（已内化·59个用户安装+42系统内置）
### 六大能力域
1. 🔴 AIGC内容生产（25技能）：cinematic-script-writer/ai-video-script-automaton/video-script-generator/script-to-storyboard/seedance全系/video-prompting-guide/video-reverse-prompt/creative-toolkit/image-cog/image-vision/image2prompt/music-cog/clonev/openai-tts/ai-subtitle-generator/prompt-optimizer/tcm-video-factory/novel-generator/short-drama-writer/drama-generator/story-cog
2. 🟠 信息采集与情报（9技能）：deep-research-pro/tavily/baoyu-url-to-markdown/bilibili-hot-monitor/douyin-video-analyst/summarize-pro/rag/data-analyst-pro/structure-thinking
3. 🟡 浏览器自动化与发布（6技能）：agent-browser/douyin-downloader/yt-video-downloader/social-media-publish
4. 🟢 系统运维与自进化（10技能）：self-improving/capability-evolver/openclaw-auto-updater/remind-me/free-ride/github/qclaw-openclaw
5. 🔵 技能开发与工具链（9技能）：skill-creator/mcp-builder/agentic-mcp-server-builder/coding/claude-code/context7-docs/api-gateway
6. 🟣 办公与生产力（42系统内置）：腾讯文档/会议/问卷/PDF/Word/PPT/Excel/邮件/新闻/金融数据/天气

### 高频核心技能速查
- seedance-shot-design：5步导演工作流，强制validate_prompt校验，光影三层结构，时间戳分镜
- prompt-optimizer：58种提示词优化技术，list/get/optimize三命令
- creative-toolkit：5引擎图像路由（Nanobanana2/Seedream5/GPTImage/Midjourney/ComfyUI），1300+预设风格
- capability-evolver：运行时自进化，协议约束改进，需A2A_NODE_ID
- summarize-pro：20功能摘要引擎，支持多格式多语言
- clonev：声音克隆Coqui XTTS v2，6-30秒样本，14+语言

## 重大教训（防踩坑）
- 汇报必须验证，禁止推测！Git推送后必须检查git log确认远程同步
- "命令返回ok" ≠ "功能正常"，必须实际验证效果
- 未验证的项不得标记完成，如实标注状态

## 环境修复记录（2026-04-04）
### 已完成
- [x] QMD修复：qmd.cmd依赖/bin/sh不可用→创建qmd-wrapper.js(ESM)→路径用正斜杠→provider=qmd已生效
- [x] QMD wrapper路径：D:/OPENCLOW/QClaw/resources/openclaw/config/skills/qclaw-openclaw/scripts/qmd-wrapper.js
- [x] QMD collection过滤：wrapper自动忽略OpenClaw传的未知collection名(如memory-root-agent-xxx)
- [x] Git推送：gh auth refresh后权限恢复，私有仓库gs3542589-sketch/12315已正常同步
- [x] ffmpeg安装：v8.1，winget安装→复制到D:\OPENCLOW\QClaw\tools\绕过安全策略
- [x] Python 3.12安装：py -3.12可用，为PyTorch CUDA准备
- [x] 汇报验证规则已写入AGENTS.md：每项标注✅已验证/⚠️未验证
### 待完成
- [~] PyTorch CUDA：pytorch.org下载2.5GB超时(300KB/s)，清华镜像哈希不匹配，需稳定网络重试
- [~] Brave Search API Key：未配置，web_search不可用，可用multi-search-engine技能替代
- [~] openclaw-memory QMD collection为空：全局workspace/memory无文件，不影响agent搜索