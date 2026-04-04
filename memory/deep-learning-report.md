# 深度学习总结报告 - 2026-04-04

> 本报告整合了2026-04-02至04-04期间所有喂养的提示词、学习文章、安装的skill，形成完整的知识体系。

---

## 一、已安装 Skill 总览（42个）

### 1. AIGC内容生产（10个核心）
| Skill | 用途 |
|-------|------|
| `seedance-shot-design` | 导演式分镜，6场景模板，validate_prompt.js校验 |
| `viral-video-script` | 短视频脚本，5大结构（PREP/对比/FIRE/RIDE/强化IP） |
| `ai-novel-writer` | 雪花写作法10步小说创作，15000字引导 |
| `xhs-post-scheduler` | 小红书发布时间安排，4时段文案 |
| `xhs-comment-designer` | 评论区金句引导，5大人性公式 |
| `viral-headline-writer` | 爆款标题，15个公式+二极管法 |
| `niche-topic-generator` | 赛道选题，8大赛道关键词库 |
| `content-factory` | 多代理内容生产线 |
| `prompt-optimizer` | 58种提示词优化技术 |
| `creative-toolkit` | 5引擎图像路由，1300+预设风格 |

### 2. 图像/视频生成（8个）
| Skill | 用途 |
|-------|------|
| `image-cog` | CellCog图片生成，Nanobanana2/GPTImage/Recraft |
| `image-vision` | 图片视觉分析，OCR，多模态问答 |
| `image2prompt` | 图片反推提示词 |
| `video-reverse-prompt` | 视频反向提示词 |
| `clonev` | 声音克隆，Coqui XTTS v2 |
| `openai-tts` | TTS语音合成 |
| `ai-subtitle-generator` | 字幕生成，98%+准确率 |
| `music-cog` | AI音乐生成 |

### 3. 素材采集与分析（5个）
| Skill | 用途 |
|-------|------|
| `douyin-video-analyst` | 抖音视频分析，批量采集+文案提取 |
| `bilibili-hot-monitor` | B站热门监控，邮件日报 |
| `xhs-video-finder` | 小红书视频查找 |
| `douyin-downloader` | 抖音视频无水印下载 |
| `yt-video-downloader` | YouTube视频下载 |

### 4. 浏览器自动化（3个）
| Skill | 用途 |
|-------|------|
| `agent-browser` | 通用浏览器自动化 |
| `douyin-downloader` | 抖音下载+发布 |
| `social-media-publish` | 社媒平台发布 |

### 5. 视频剪辑（3个）
| Skill | 用途 |
|-------|------|
| `jianying-automation` | pyJianYingDraft剪映草稿Python库 |
| `ffmpeg` | 视频处理（已安装v8.1） |
| `pysrt` | SRT字幕编辑 |

### 6. 信息搜索（6个）
| Skill | 用途 |
|-------|------|
| `multi-search-engine` | 17引擎聚合搜索 |
| `online-search` | 元宝联网搜索 |
| `deep-research-pro` | 深度研究 |
| `tavily` | AI搜索 |
| `baoyu-url-to-markdown` | 网页转Markdown |
| `summarize-pro` | 20功能摘要引擎 |

### 7. 系统运维（6个）
| Skill | 用途 |
|-------|------|
| `self-improving` | 自我进化，corrections追踪 |
| `qclaw-openclaw` | OpenClaw CLI封装 |
| `openclaw-auto-updater` | 自动更新 |
| `free-ride` | GitHub PR克隆 |
| `github` | GitHub CLI操作 |
| `api-gateway` | API网关管理 |

### 8. 技能开发（3个）
| Skill | 用途 |
|-------|------|
| `skill-creator` | Skill创建引导 |
| `mcp-builder` | MCP服务器构建 |
| `coding` | 编程风格记忆 |

### 9. 办公生产力（42个系统内置）
腾讯文档/会议/问卷、PDF/Word/PPT/Excel、邮件、新闻、金融数据、天气

---

## 二、核心提示词体系

### 1. Seedance 2.0 导演式分镜
**万能公式**：`主体 + 动作过程 + 场景 + 光线 + 镜头语言 + 风格质感 + 画质 + 约束`

**7条必写约束**：面部不崩坏、手指不畸形、动作不抽搐、画面不闪、无水印、无版权IP、无名人脸

**3种生成模式**：文生视频、图生视频、多模态参考

### 2. 短视频脚本5大结构
| 结构 | 公式 |
|------|------|
| PREP | 观点→理由→案例→结论 |
| 对比 | 错误操作+负面结果+正确方法+正向结果 |
| FIRE | 事实→解读→反应→结果 |
| RIDE | 风险→利益→差异→影响 |
| 强化IP | 痛点+获得感+信任感+解决方案 |

### 3. 爆款标题15公式
`XX都可怕 / 说出来你可能不信 / 我XX岁 / 救命 / 逼自己看完 / 真心建议 / 很变态但 / 谁懂啊 / 听我一句劝 / 被问爆了 / 手把手 / 新手抄作业 / 太好做了 / 后悔没早 / 倒计时`

### 4. 雪花写作法10步
一句话概括→五句段落→人物介绍→一页大纲→人物背景→四页大纲→人物宝典→场景清单→场景规划→生成全文

---

## 三、Token节省方案

| 规则 | 状态 |
|------|------|
| 配置文件≤10KB | ✅ 全部达标（最高8.6KB） |
| memory_search每次≤5条 | ✅ 已固化 |
| QMD maxResults=3 | ✅ 已配置 |
| 预留Token≥40000 | ✅ 已配置 |
| 无全量加载历史 | ✅ 规则已固化 |
| 会话Compaction触发 | ✅ 已建立（>50条提醒） |

---

## 四、自我进化系统

### 目录结构
```
~/self-improving/
├── memory.md          # HOT: ≤100行，确认模式
├── corrections.md     # 最近50条纠正记录
├── heartbeat-state.md # 心跳状态追踪
├── index.md          # 文件索引
├── projects/         # 项目级 learnings
├── domains/         # 领域级 learnings
└── archive/         # 归档
```

### 模式提升规则
- 同一pattern出现3次 → 自动提升到 memory.md (HOT)
- 30天不用 → 降级到 projects/
- 90天不用 → 归档到 archive/

---

## 五、定时任务体系（5个cron）

| ID | 任务 | 频率 |
|----|------|------|
| 6d14a319 | 工作区备份 | 每12小时 |
| 8fefaa16 | 每日学习计划 | 每天08:00 |
| 0c8db5cd | 每日成长总结 | 每天21:00 |
| 5cb21b9d | QMD索引重建 | 每5分钟 |
| af76b388 | 每周系统自查 | 周日02:00 |

---

## 六、工具链完整图谱

```
选题 → content-factory / niche-topic-generator
  ↓
脚本 → viral-video-script / ai-novel-writer
  ↓
分镜 → seedance-shot-design
  ↓
图片 → creative-toolkit / image-cog / image2prompt
  ↓
视频 → seedance / video-reverse-prompt
  ↓
配音 → clonev / openai-tts
  ↓
字幕 → ai-subtitle-generator
  ↓
剪辑 → pyJianYingDraft / ffmpeg
  ↓
发布 → social-media-publish / 腾讯文档
```

---

## 七、已学习的领域知识

### 三角洲行动二创（delta-force-master.md）
- 热门梗：刘涛/六套、威虫、鼠鼠我啊、声纹已锁定
- 热门CP：威虫×麦小鼠
- 爆款方案：声纹整活/萌系CP/鼠鼠扛包
- 预估首月播放：1000万+

### RAG系统设计（supplement-skills.md）
- 永远不要跳过访问控制
- 始终重叠分块10-20%
- 先评估再优化
- 同一嵌入模型
- 监控相似度分数

### 剪映自动化（jianying-automation.md）
- pyJianYingDraft生成草稿
- pysrt处理字幕
- ffmpeg视频处理
- 限制：模板模式仅支持5.9及以下

---

## 八、自查机制（每周日02:00执行）

**8项检查清单**：
1. 配置文件≤10KB
2. cron任务≥5个
3. Git无pending
4. MEMORY.md+日志
5. corrections.md新条目
6. 会话长度>50条？
7. QMD检索≤5条
8. 重复错误预防

---

## 九、根因教训（LEARNINGS.md已记录）

1. **plan写了≠自动执行** → 必须同时注册cron
2. **skill装了≠功能有了** → 必须初始化目录
3. **错误必须立即记录** → 不能等用户提醒
4. **每次任务结束必须反思** → 输出错误教训
5. **Git push失败必须重试** → 不能等用户发现
6. **汇报必须验证** → 不能推测性汇报
7. **技能使用前必须读取SKILL.md** → 宁可慢不要错
