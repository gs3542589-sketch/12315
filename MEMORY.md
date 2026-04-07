# MEMORY.md - 长期高价值记忆（严格≤10KB）
## 核心系统规则（已固化）
1. 记忆分层架构：SOUL → USER → MEMORY → Daily日志 → TOOLS → AGENTS
2. 记忆入库标准：满足≥2条才允许写入（长期/复用/防坑/可验证）
3. QMD检索优先：检索召回替代全量历史加载，每次最多Top5片段
4. 配置文件上限：总大小严格≤10KB，冗余自动归档
5. **浏览器强制规则：仅允许使用 Microsoft Edge，禁止使用其他浏览器**

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
- seedance-shot-design：导演式分镜技能，6场景模板
- ai-novel-writer：雪花写作法10步创作流程
- viral-video-script：爆款短视频脚本，5大文案结构
- xhs-post-scheduler：小红书发布时间安排
- xhs-comment-designer：评论区金句引导回复
- viral-headline-writer：爆款标题15个公式
- niche-topic-generator：赛道选题助手
- prompt-optimizer：58种提示词优化技术
- creative-toolkit：5引擎图像路由（Nanobanana2/Seedream5/GPTImage/Midjourney/ComfyUI）
- summarize-pro：20功能摘要引擎
- clonev：声音克隆Coqui XTTS v2

### Seedance 2.0 文档体系（2026-04-07更新）
| 文档 | 用途 | 大小 |
|------|------|------|
| `aigc-lean-sop.md` | 精简SOP日常执行（4阶段12步） | 11KB |
| `seedance-prompt-formulas.md` | 提示词公式篇 | 4KB |
| `seedance-camera-movements.md` | 运镜词典篇（48组） | 4KB |
| `seedance-workflow-sop.md` | 分镜与工作流篇 | 3KB |
| `seedance-ultimate-dictionary.md` | 终极词典（已拆分为上述4文件） | 26KB→归档 |
| `memory/archive/` | 冗余文档归档目录 | - |

## Seedance 2.0 导演式分镜规范（2026-04-04）
### 核心原则
- 提示词 = 分镜单，非文学题
- 动作写「过程」，不写「结果」
- 镜头先稳后动，新手避用甩/摇/环绕
- 风格一个主风格+1-2质感词，不堆叠
- 约束必写：面部/手指/动作/闪烁/水印

### 万能公式
`主体 + 动作过程 + 场景 + 光线 + 镜头语言 + 风格质感 + 画质 + 约束`

### 稳定动作词
`缓慢、连贯、自然、慢动作、平稳跟拍`

### 稳定镜头词
`平稳跟拍、缓慢推进、固定机位、轻度环绕、中景→近景`

### 必写约束（7条）
1. 面部稳定不变形
2. 手指不畸形/不多指/不缺指
3. 动作流畅不抽搐
4. 画面稳定不闪烁
5. 不要字幕/文字水印/Logo
6. 无版权IP（迪士尼/漫威/星战）
7. 无名人脸（做「人设」不做「个人复刻」）

### 时长建议
- 新手：5-8秒
- 有经验：10-15秒
- 进阶：5秒×多段拼接

### 三种生成模式
1. 文生视频：提示词写细+约束写清楚
2. 图生视频：参考图定上限+提示词管动作运镜
3. 多模态：少喂喂准，禁止一次塞9图+3视频+3音频

## 重大教训（防踩坑）
- 汇报必须验证，禁止推测！Git推送后必须检查git log确认远程同步
- "命令返回ok" ≠ "功能正常"，必须实际验证效果
- 未验证的项不得标记完成，如实标注状态

## 环境修复记录（2026-04-05）
### 已完成
- [x] 显卡升级：RTX 4060 8GB → RTX 4070 12GB ✅ 2026-04-05
- [x] QMD向量嵌入：安装@node-llama-cpp/win-x64-cuda@3.18.1 → embed成功，89 chunks/38 docs ✅
- [x] QMD修复：qmd.cmd依赖/bin/sh不可用→创建qmd-wrapper.js(ESM)→路径用正斜杠→provider=qmd已生效
- [x] QMD wrapper路径：D:/OPENCLOW/QClaw/resources/openclaw/config/skills/qclaw-openclaw/scripts/qmd-wrapper.js
- [x] QMD collection过滤：wrapper自动忽略OpenClaw传的未知collection名(如memory-root-agent-xxx)
- [x] Git推送：gh auth refresh后权限恢复，私有仓库gs3542589-sketch/12315已正常同步
- [x] ffmpeg安装：v8.1，winget安装→复制到D:\OPENCLOW\QClaw\tools\绕过安全策略
- [x] Python 3.12安装：py -3.12可用，为PyTorch CUDA准备
- [x] 汇报验证规则已写入AGENTS.md：每项标注✅已验证/⚠️未验证
### 今日修复（2026-04-06）
- [x] PyTorch CUDA ✅：根因Python 3.14不在cu124索引，改用Python 3.12 → torch=2.6.0+cu124, CUDA=True, RTX 4070

### 待完成
- [~] QMD query/vsearch：node-llama-cpp挂起问题，尝试20+次修复未果。CUDA 12.8与node-llama-cpp不兼容。BM25 search正常
- [~] Brave Search API Key：未配置，web_search不可用

### 重要教训（2026-04-06）
- 未完成的工作不要问用户，必须继续解决或找到替代方案
- 遇到无法解决的问题必须上网搜索，不能放弃