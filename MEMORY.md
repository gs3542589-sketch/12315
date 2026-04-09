# MEMORY.md - 长期高价值记忆（严格≤10KB）

---

## 🏛️ 四层记忆架构（2026-04-09·借鉴MemPalace）

**借鉴MemPalace设计，分层加载降低Token开销**

| 层级 | 名称 | 内容 | 触发时机 |
|------|------|------|----------|
| **L0** | 身份层 | SOUL.md + USER.md（角色+用户画像） | 始终加载 |
| **L1** | 核心层 | MEMORY.md核心规则（≤10KB） | 始终加载 |
| **L2** | 近期层 | memory/YYYY-MM-DD.md + QMD检索 | 每日启动 |
| **L3** | 存档层 | memory/conversations/存档原文 | 按需查询 |

**启动时只加载L0+L1，L2按需，L3按需检索** — 不全量加载历史

---

## 对话原文归档规则（2026-04-09·新增强制）

**核心原则：原文优先于摘要**

### 归档触发条件（满足任一即归档）
1. 完成重要测试/调试后
2. 完成多轮讨论形成决策后
3. 用户明确要求"存档这个对话"
4. 单日对话超过50轮时

### 归档执行
```bash
python scripts/archive_conversation.py "话题标签" < messages.json
```

### 归档位置
```
memory/conversations/YYYY-MM-DD/
├── 话题标签_HHMMSS.json    # 原文存档
└── index.json              # 索引
```

### 归档内容
- 原文verbatim（非摘要）
- 元数据：topic/archived_at/messages
- 自动去重：同topic只保留最新

---

## 知识图谱规则（2026-04-09·新增强制）

**追踪实体、关系、时序事实**

### 实体类型
- `person:姓名` - 人物
- `project:名称` - 项目
- `tool:名称` - 工具/API
- `decision:内容` - 决策

### 添加时机
1. 新发现用户偏好时
2. 重要决策形成时
3. 团队/项目信息变化时
4. 工具选型确定时

### 命令
```bash
# 查询实体
python scripts/kg_query.py entity "关键词"

# 查询关系
python scripts/kg_query.py relations <实体ID>

# 查询时序
python scripts/kg_query.py timeline <实体名>
```

### 数据格式
```json
{
  "entities": {"person:张三": {...}},
  "relations": [{"from": "person:张三", "relation": "uses", "to": "tool:Seedance"}],
  "facts": [{"entity": "person:张三", "fact": "偏好竖版视频"}]
}
```

---

## 核心系统规则（已固化）
1. 记忆分层架构：SOUL → USER → MEMORY → Daily日志 → TOOLS → AGENTS
2. 记忆入库标准：满足≥2条才允许写入（长期/复用/防坑/可验证）
3. QMD检索优先：检索召回替代全量历史加载，每次最多Top5片段
4. 配置文件上限：总大小严格≤10KB，冗余自动归档
5. **浏览器强制规则：仅允许使用 Microsoft Edge，禁止使用其他浏览器**
6. **测试后必须固化：任何测试/调试完成后，必须提炼N步标准流程写入MEMORY.md对应章节；测试文件归档，但流程要点必须进核心记忆**

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

## 技能树（已内化·59用户+41系统）
### 六大能力域
1. 🔴 AIGC内容生产（25技能）：seedance全系/creative-toolkit/image-cog/clonev/openai-tts/prompt-optimizer等
2. 🟠 信息采集（9技能）：tavily/summarize-pro/deep-research-pro等
3. 🟡 浏览器自动化（6技能）：agent-browser/douyin-downloader等
4. 🟢 系统运维（10技能）：self-improving/openclaw-auto-updater等
5. 🔵 技能开发（9技能）：skill-creator/mcp-builder/coding等
6. 🟣 办公生产力（41系统内置）：腾讯文档/会议/问卷/PDF/Word/Excel/邮件等

### 高频核心技能
seedance-shot-design/aigc-prompt-factory/viral-video-script/viral-headline-writer/xhs-post-scheduler/clonev/summarize-pro/creative-toolkit

### 技能强制触发铁律（2026-04-08）
| 触发词 | 技能 |
|--------|------|
| 生图/画图/MJ/SD | aigc-prompt-factory |
| 分镜/运镜 | seedance-shot-design |
| 短视频脚本 | viral-video-script |
| 爆款标题 | viral-headline-writer |
| 小红书发布 | xhs-post-scheduler |
| 小说写作 | ai-novel-writer |
| 声音克隆 | clonev |

**触发后执行流程：读取SKILL.md → 应用公式 → 输出结果 → 提供变体**

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

### 必写约束（7条）
面部不变形、手指不畸形、动作流畅、画面稳定、无水印、无版权IP、无名人脸

### 时长建议
新手5-8秒，有经验10-15秒，进阶5秒×多段拼接。三种模式：文生视频/图生视频/多模态（少喂喂准）

## 三角洲行动知识库（2026-04-07）
- 位置：`knowledge-base/delta-force/`
- 主文件：`README.md`（完整知识库，6.5KB）
- 速查表：`quick-ref.md`（快速查阅，1.9KB）
- 内容：爆梗/黑话/干员/创作方案/B站分析/创作者策略
- 源数据：抖音/B站/小红书调研 + B站热门视频分析

## ⚠️ 核心流程固化：生图→发图闭环（2026-04-09）
**执行任何生图/发图任务前，必须先读本节，不允许凭记忆试**

### 一、生图标准流程（云雾API + Gemini）
**触发条件**：用户要求生图、生成图片、画图
**第一步**：读取 `aigc-prompt-factory` SKILL.md，应用结构化公式
**第二步**：调用云雾API生成图片

**命令格式**：
```
python scripts/yunwu_image.py "提示词内容" [输出文件名]
```

**配置位置**：`scripts/yunwu_config.json`
- API Key: sk-EasUTnaXh0JzQEqYIbrtnuIfWl2nD28xZPw6QhMx9ykNWwqL
- Base URL: https://api.yunwu.ai/v1
- 默认Model: gpt-image-1.5-all
- 默认Size: 1024x1024

**默认输出目录**：`output/images/`
**禁止调用YUNWU_VISION_KEY做生图**，识图用另一套API

### 二、发图标准流程（按目标渠道选一）

| 渠道 | 工具 | 参数 |
|------|------|------|
| **webchat** | `read`工具 | 直接读本地图片路径，自动渲染 |
| **微信** | `message`工具 | channel=wechat-access, target=1334770905, filePath=本地路径 |
| **飞书** | `message`工具 | **不填channel参数！** filePath=本地路径（自动路由到当前feishu会话） |

**⚠️ 飞书发图铁律：禁止指定channel=feishu，会报Unknown channel错误**

### 三、执行前必检清单
1. QMD检索"生图 发图"关键词，确认本流程已加载
2. 生图前先读aigc-prompt-factory技能
3. 发图前确认目标渠道，按上表选正确工具和参数
4. 发图后验证是否成功（飞书返回messageId=成功）
5. 失败立即查MEMORY.md或问用户，不准凭记忆乱试

### 四、失败应急处理（优先级顺序）
1. 报错 → 先查MEMORY.md/QMD，不准立刻试其他工具
2. MEMORY.md无解 → 上网搜索（ Tavily/multi-search-engine）
3. 搜索无解 → 如实告知用户，不编造

---

## 重大教训（防踩坑）
- 汇报必须验证，禁止推测！Git推送后必须检查git log确认远程同步
- "命令返回ok" ≠ "功能正常"，必须实际验证效果
- 未验证的项不得标记完成，如实标注状态
- **提示词质量决定图片质量**：结构化公式+光线描写+负面约束缺一不可（2026-04-08）
- **参考图必须用用户原图**：检查时间戳，确认是用户刚发的，不是之前生成的图
- **游戏内容用游戏词汇**：UE5/game CG/game screenshot，禁用 photorealistic/cinematic photography
- **⚠️ 执行前必须先查MEMORY.md**：不允许凭记忆试，试错后及时补录方法（2026-04-09）

## 用户当前工作流（2026-04-09更新）

### 核心配置
- **主力生图模型：Gemini（Google Imagen）** ← 日常使用
- 主力对话模型：MiniMax M2.7（hytriu/MiniMax-M2.7-highspeed）
- 内容平台：抖音 + B站
- 显卡：RTX 4070 12GB

### 当前项目：图片提示词质量优化（2026-04-08启动）
**问题**：用户生成的图片质量差强人意
**根因**：提示词结构不完整、缺光线描写、缺负面约束

**已完成工作**：
1. ✅ 创建 `aigc-prompt-factory` 技能（位置：`skills/aigc-prompt-factory/`）
2. ✅ 完成提示词研究成果汇总（26KB，存于`memory/2026-04-08-prompt-research.md`）
3. ✅ 内置公式：图片提示词结构化公式 + Seedance 2.0视频公式
4. ✅ 质量增强词库 + 负面提示词模板 + 光线描写模板

**提示词万能公式**：
```
主体 + 动作过程 + 场景 + 光线 + 镜头语言 + 风格质感 + 画质标签 + 负面约束
```

**待完成**：
- [ ] 使用 aigc-prompt-factory 为用户生成第一批优化提示词
- [ ] 测试提示词效果，根据反馈迭代

### 记忆系统改进（2026-04-09）
**问题**：跨天对话时"忘记"昨天的工作
**根因**：启动流程只读取今天的Daily日志，昨天的不会自动加载

**解决方案**：
1. 核心工作流程写入MEMORY.md（长期记忆）← 当前操作
2. 启动时主动QMD检索"最近工作"关键词

## 环境配置速查（详细记录见memory/archive/）
- 显卡：RTX 4070 12GB ✅
- QMD：GPU加速已启用（QMD_GPU=auto）✅
- ffmpeg：v8.1 ✅
- Python：3.12 ✅
- Git：已授权 ✅

### API Key 配置管理（2026-04-08·铁律）
**云雾API硬分离：YUNWU_IMAGE_KEY=生图用，YUNWU_VISION_KEY=识图用，禁止混用**
- 触发条件：必须同时满足"生图 OR 识图" + "用户发送了图片/截图"
- 违规：立即停止并告知用户

**已安装API：**
- TAVILY_API_KEY（tvly-dev-3Qw7Ce...）：搜索/采集，无限制 ✅
- YUNWU_IMAGE_KEY（sk-EasUTnaX...）：仅生图
- YUNWU_VISION_KEY（sk-VHBxt0yX...）：仅识图

### 搜索工具说明（2026-04-08·更新）
| 工具 | 类型 | 状态 |
|------|------|------|
| **Tavily Search** | 免费搜索API | ✅ 主用 |
| ~~Brave Search~~ | ~~收费~~ | ❌ 已禁用/删除 |
| multi-search-engine | 无需API | ✅ 备选（17引擎聚合）|
| web_fetch | 网页抓取 | ✅ 备用 |

**执行搜索任务时：**
1. 优先使用 Tavily Search（`python .../tavily_search.py --query "..."`）
2. 设置编码：`$env:PYTHONIOENCODING='utf-8'`
3. Tavily不可用时，使用 multi-search-engine（web_fetch）

### 重要教训（2026-04-06）
- 未完成的工作不要问用户，必须继续解决或找到替代方案
- 遇到无法解决的问题必须上网搜索，不能放弃

## 知识文档索引（2026-04-09）
| 文档 | 路径 | 内容 |
|------|------|------|
| **Gemini图像生成指南** | `Gemini图像生成指南.md` | API配置+提示词框架+游戏词汇+工作流 |
| 三角洲知识库 | `knowledge-base/delta-force/` | 干员/地图/创作方案 |
| Seedance文档 | `aigc-lean-sop.md` 等 | 分镜/运镜/工作流 |