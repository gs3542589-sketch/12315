# AIGC Prompt Factory - 提示词工厂

## 技能定位
当用户需要生成**图片提示词**或**视频提示词**时，自动应用本技能内置的优化规则，确保输出质量。

---

## 🚨 强制执行规则

**每次生成提示词时，必须完整执行以下检查清单，不得跳过任何步骤。**

---

## 一、图片提示词公式（Image Prompt）

### 1.1 结构化模板

```
主体（具体描述）
+ 细节（表情/服装/动作/道具）
+ 场景（具体地点+环境元素）
+ 光线（方向+色温+氛围）
+ 风格（1个主风格+1-2个质感词）
+ 画质标签（5个增强词）
+ 负面约束（必写！）
```

### 1.2 质量增强词库（每次至少选5个）

```
masterpiece, best quality, high quality, 8k, 4k, ultra detailed,
professional, cinematic lighting, dramatic lighting, soft lighting,
sharp focus, detailed, intricate, elaborate, beautiful composition,
dynamic pose, realistic, photographic, concept art, studio quality
```

### 1.3 光线描写模板

| 类型 | 描写方式 |
|------|---------|
| 正面光 | soft frontal lighting, even illumination |
| 侧光 | dramatic side lighting, strong contrast shadows |
| 逆光 | backlit, rim light, silhouette |
| 顶光 | overhead lighting, golden hour sunlight |
| 戏剧光 | cinematic lighting, volumetric light rays |
| 霓虹光 | neon lighting, cyberpunk glow, colorful bokeh |
| 暗调 | dark moody atmosphere, chiaroscuro |

### 1.4 风格对照表

| 主风格 | 英文描述 | 适配场景 |
|--------|---------|---------|
| 游戏立绘 | game character artwork, official art style | 干员/角色图 |
| 赛博朋克 | cyberpunk, neon-noir, futuristic | 科幻/未来题材 |
| 写实摄影 | photorealistic, DSLR quality, detailed photography | 真实感需求 |
| 电影质感 | cinematic, film grain, movie still | 剧情/叙事内容 |
| 像素艺术 | pixel art, 16-bit, retro game style | 怀旧/复古内容 |
| 厚涂油画 | oil painting style, painterly, impasto | 艺术感内容 |
| 水彩插画 | watercolor illustration, soft edges | 柔和/女性向 |
| 动漫风格 | anime style, cel shading, vibrant colors | 二次元内容 |

### 1.5 负面提示词（必加！）

```
(normal hands:1.4), (natural fingers:1.3), (correct hands:1.3),
no deformity, no extra fingers, no missing fingers, no mutated hands,
no watermark, no text, no logo, no signature, no branding,
no blur, no motion blur, no gaussian blur,
no low quality, no worst quality, no jpeg artifacts,
no cropped, no frames, no border,
sharp focus, clear details
```

### 1.6 常见问题自检

- [ ] 主体描述是否具体？（避免"一个人"→要写"穿黑色战术背心的男特勤干员"）
- [ ] 是否有光线描写？（无光线=随机打光）
- [ ] 风格是否单一？（避免"赛博朋克+宫崎骏+写实"混用）
- [ ] 是否添加负面提示词？（防止手指畸形/水印/模糊）
- [ ] 是否输出英文？（图像模型训练数据以英文为主）

---

## 二、视频提示词公式（Video Prompt）

### 2.1 Seedance 2.0 核心公式

```
主体 + 动作过程 + 场景 + 光线 + 摄像机运镜 + 风格质感 + 画质约束
```

### 2.2 运镜词典（按场景选用）

| 运镜类型 | 英文描述 | 适用场景 |
|---------|---------|---------|
| 固定 | static shot, locked frame, stationary camera | 稳重型/对话 |
| 推进 | slow push-in, gradual zoom, tracking forward | 强调/紧张感 |
| 后拉 | pull-back, dolly out, revealing shot | 交代环境 |
| 横移 | smooth pan, lateral tracking, sweeping | 展示全貌 |
| 环绕 | slow orbit, 360° rotation, circling | 展示主体 |
| 俯冲 | dive & soar, top-down dynamic, aerial | 力量感/冲击 |
| 升格 | bullet time, slow-motion, high frame rate | 戏剧化瞬间 |
| 跟拍 | follow shot, tracking behind, POV-style | 沉浸感 |
| 摇镜 | gentle sway, handheld drift | 写实/记录感 |

### 2.3 动作描写原则

**核心：写「过程」不写「结果」**

| ❌ 错误（结果） | ✅ 正确（过程） |
|---------------|---------------|
| 威龙很帅 | 威龙从暗处走出，步伐稳健有节奏 |
| 蜂医在笑 | 蜂医双手叉腰，嘴角慢慢上扬露出得意笑容 |
| 爆炸很震撼 | 火光从爆炸中心向外扩散，烟尘翻涌升腾 |

### 2.4 稳定动作词（新手必用）

```
缓慢、连贯、自然、慢动作、平稳跟拍、逐渐、定格
```

### 2.5 必写约束（7条）

1. 面部稳定不变形 (faces stay consistent, no deformation)
2. 手指不畸形/不多指/不缺指 (natural hands, correct finger count)
3. 动作流畅不抽搐 (smooth motion, no stuttering)
4. 画面稳定不闪烁 (stable image, no flickering)
5. 不要字幕/文字水印/Logo (no text, no watermark, no subtitles)
6. 无版权IP（迪士尼/漫威/星战） (no copyrighted characters)
7. 无名人脸 (no celebrity faces, create characters not copies)

### 2.6 视频时长建议

| 经验等级 | 推荐时长 | 说明 |
|---------|---------|------|
| 新手 | 5-8秒 | 单镜头，易控制 |
| 有经验 | 10-15秒 | 可做简单转场 |
| 进阶 | 5秒×多段拼接 | 质量更稳定 |

---

## 三、抖音/小红书内容提示词模板

### 3.1 抖音爆款结构（15-60秒）

```
开场（前3秒）：[悬念/冲突/反转]
核心内容：[具体场景+动作描写]
结尾互动：[引导评论/转发的话]
```

### 3.2 B站剧情结构（5-20分钟）

```
主线叙事：[起承转合]
支线亮点：[可切入的梗/冷知识]
弹幕互动点：[预设1-2个弹幕梗]
节奏时间线：[各段落时长分配]
```

---

## 四、生成流程

当用户请求生成提示词时：

1. **识别类型**：图片？视频？哪个平台？
2. **应用公式**：根据类型选择图片公式或视频公式
3. **结构化输出**：分块呈现（主体/光线/风格/约束）
4. **输出英文**：最终提示词必须为英文
5. **提供变体**：生成2-3个不同版本供选择

---

## 五、快速参考卡

### 图片提示词速查

```
[主体具体描述]
[细节描写]
[场景+环境]
[光线描写]
[1个风格+1-2质感词]
[5个质量增强词]
负面：[手指/畸形/水印/模糊约束]
```

### 视频提示词速查

```
[主体] + [动作过程] + [场景] + [光线] + [运镜] + [风格] + [约束]
```

---

## 六、知识库关联

- 三角洲行动素材：`knowledge-base/delta-force/`
- 干员台词库：`delta-force-voice-library.md`
- 梗库/黑话：`delta-force-meme-library.md`
- 运镜词典：`delta-force-camera-movements skill`

---

## 版本记录

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2026-04-08 | v1.0 | 初版创建，整合图片/视频/抖音/B站提示词公式 |

