# AIGC Prompt Factory - 提示词工厂

## ⚠️ 强制触发规则（最高优先级）

**以下任一条件满足时，必须立即读取本技能完整内容，不得凭记忆生成：**

### 触发词清单（出现任一词即触发）
```
提示词、prompt、生图、画图、做图、出图、生成图片、生成视频
Midjourney、MJ、Stable Diffusion、SD、FLUX、DALL-E、Ideogram
**Gemini、Imagen、Google image、Gemini生图** ← 用户主力模型
文生图、文生视频、图生视频、image generation、video generation
运镜、分镜、光线描写、负面提示词、negative prompt
画质优化、提示词优化、prompt optimization
Seedance、可灵、Kling、MiniMax、Hailuo
```

### 触发场景（出现任一场景即触发）
- 用户要求生成/优化/写任何图片或视频提示词
- 用户提到任何图像生成模型名称
- 用户发送图片并要求生成相似图/变体/提示词
- 用户要求"帮我写个提示词"、"生成一张图"等

### 执行流程（触发后必须执行）
1. **先读取本技能完整SKILL.md**（不得跳过）
2. 应用图片公式或视频公式
3. 输出英文提示词
4. 提供2-3个变体版本

---

## 零、方法论优先（写提示词的核心思维）

**⚠️ 重要原则：方法论 > 模板积累**

写提示词不是堆砌词藻，而是有结构的思考过程。核心方法：

### 1. KERNEL框架（1000小时Prompt工程总结）
**6个关键模式决定提示词成功与否：**

| 要素 | 说明 | 效果 |
|------|------|------|
| **K - Goal Clarity** | 明确最终效果 | 85%成功率 vs 41% |
| **E - Examples** | 提供参考图/案例 | 提高一致性 |
| **R - Role/Constraints** | 指定角色/约束 | 减少随机性 |
| **N - Narrow Scope** | 限制范围 | 提高聚焦度 |
| **E - Evaluate** | 评估结果 | 迭代优化 |
| **L - Learn** | 从结果学习 | 持续改进 |

### 2. 反向工程法（最有效的学习方法）
```
图片 → 分析 → 提取提示词 → 学习 → 应用
```
- 看到好图时，分析"它好在哪里？用了什么元素？"
- 提取出能复现的提示词结构
- 学习优秀的元素组合

### 3. 三要素原则（所有模型通用）
```
Subject（主体）+ Context（场景）+ Style（风格）
```
无论哪个模型，都逃不开这三个核心要素。

---

## 二、审美能力模块（视觉艺术的元技能）

**审美决定了什么值得生成——没有审美，工具再好也是乱撞。**

### 2.1 视觉艺术四要素

| 要素 | 说明 | 在提示词中的体现 |
|------|------|-----------------|
| **构图** | 三分法/黄金比例/引导线/对称 | 镜头语言+构图描述 |
| **光线** | 明暗/方向/色温 | 光线描写（最影响氛围） |
| **色彩** | 对比/和谐/情绪 | 色调+配色方案 |
| **层次** | 前景/中景/背景 | 场景深度描写 |

### 2.2 构图法则（12条核心）

| 法则 | 效果 | 提示词示例 |
|------|------|-----------|
| 三分法 | 专业平衡 | `rule of thirds, subject at intersection` |
| 黄金比例 | 自然美感 | `golden ratio, Fibonacci spiral` |
| 引导线 | 引导视线 | `leading lines pointing to subject` |
| 对称 | 秩序/完美 | `symmetrical composition, centered` |
| 负空间 | 极简/呼吸 | `vast negative space, minimalism` |
| 框架内框架 | 深度创造 | `framing within frame` |
| 对角线 | 动感/张力 | `diagonal lines, Dutch angle` |
| 填满画面 | 强度/细节 | `fill the frame, close-up` |
| 奇数法则 | 动态愉悦 | `three elements, odd numbers` |
| 空间法则 | 方向感 | `looking space in front of subject` |
| 黄金三角 | 戏剧张力 | `golden triangle composition` |
| 中心眼 | 直接连接 | `center eye dominance, eye contact` |

### 2.3 光线六大类型

| 类型 | 效果 | 提示词示例 |
|------|------|-----------|
| 软光 | 柔和/均匀 | `soft diffused light, even exposure` |
| 硬光 | 戏剧/明暗 | `harsh shadows, high contrast` |
| 逆光 | 轮廓/剪影 | `backlit, rim light, silhouette` |
| 侧光 | 立体/戏剧 | `side lighting, Rembrandt` |
| 顶光 | 自然/温暖 | `overhead light, golden hour` |
| 霓虹 | 赛博/迷幻 | `neon glow, magenta cyan mix` |

### 2.4 审美分析方法（看图四步法）

看到一张好图时，按以下步骤分析：

```
1. 【构图】使用了什么构图法则？
   → 三分法？引导线？对称？

2. 【光线】主光源在哪里？软硬？色温？
   → 暖色调？冷色调？明暗对比？

3. 【色彩】主色调？对比色？和谐色？
   → 蓝橙对比？单色调？

4. 【层次】前景/中景/背景如何分布？
   → 浅景深？深景深？纵深感？
```

### 2.5 色彩理论体系

**色轮基础**：
```
三原色：红、黄、蓝
三间色：橙、绿、紫
六复色：红橙、黄绿、蓝绿、蓝紫、紫红、橙黄
```

**色彩三属性**：
| 属性 | 说明 | 在提示词中 |
|------|------|-----------|
| Hue（色相） | 基本的红/蓝/绿 | "blue hue", "warm tones" |
| Value（明度） | 颜色的明暗 | "high key", "dark shadows" |
| Saturation（饱和度） | 颜色的纯度/强度 | "vibrant", "muted", "desaturated" |

**七大配色方案**：
| 方案 | 说明 | 效果 | 提示词示例 |
|------|------|------|-----------|
| Monochromatic | 单色系 | 和谐统一 | "blue monochromatic palette" |
| Analogous | 相邻色 | 舒适宁静 | "blue-green analogous scheme" |
| Complementary | 互补色 | 强烈对比 | "blue and orange contrast" |
| Split Complementary | 分割互补 | 高对比低张力 | "blue with yellow-orange" |
| Triadic | 三色均分 | 活力平衡 | "red yellow blue triadic" |
| Square | 四色方形 | 丰富多样 | "red green blue orange" |
| Tetradic | 双互补 | 富于变化 | "warm and cool balance" |

**色彩心理学**：
| 色彩 | 情绪 | 适用场景 |
|------|------|---------|
| 暖色（红/橙/黄） | 温暖/活力/热情 | 积极/食物/日落 |
| 冷色（蓝/绿/紫） | 冷静/神秘/科技 | 夜景/科幻/冥想 |
| 高饱和 | 活力/年轻/大胆 | 广告/街头 |
| 低饱和 | 复古/电影/内敛 | 剧情/肖像/纪实 |

**暖进冷退原则**：
- 暖色前进，冷色后退
- 用于突出主体：暖色主体 + 冷色背景

### 2.6 电影光线技巧（三点布光法）

**三光源系统**：
| 光源 | 作用 | 提示词示例 |
|------|------|-----------|
| Key Light（主光） | 塑造主体形状，建立基调 | "key light at 45 degrees" |
| Fill Light（补光） | 柔化阴影，补充细节 | "soft fill light, low intensity" |
| Back Light（轮廓光） | 分离主体与背景，增加层次 | "strong backlight, rim glow" |

**高调 vs 低调**：
| 类型 | 说明 | 情绪 | 提示词示例 |
|------|------|------|-----------|
| High Key | 高曝光，少阴影 | 明亮/快乐/轻松 | "high key lighting, even exposure" |
| Low Key | 低曝光，强对比 | 神秘/戏剧/紧张 | "low key, deep shadows, high contrast" |

**光线质量**：
| 类型 | 效果 | 适用 |
|------|------|------|
| Soft Light（柔光） | 柔和渐变，少刺眼阴影 | 肖像/女性/温柔 |
| Hard Light（硬光） | 锐利边缘，强烈明暗 | 戏剧/男性/紧张 |

**色温与情绪**：
| 色温 | 效果 | 提示词示例 |
|------|------|-----------|
| 暖色（3200K-4500K） | 温馨/怀旧/舒适 | "warm tungsten lighting, golden tones" |
| 冷色（5600K+） | 冷酷/紧张/现代 | "cool blue daylight, desaturated" |
| 混合色温 | 电影感/复杂情绪 | "warm key light, cool fill, orange rim" |

### 2.7 Gestalt视觉原理（六原则）

| 原则 | 说明 | 在构图中的应用 |
|------|------|---------------|
| **邻近性** | 靠近的元素被认为相关 | 分组相关物体 |
| **相似性** | 相似的元素被认为相关 | 形状/颜色/大小统一 |
| **闭合性** | 大脑补全缺失的部分 | 框架/负空间 |
| **连续性** | 视线沿线条/曲线移动 | 引导线/道路 |
| **图形-背景** | 主体与背景分离 | 清晰的前景/背景 |
| **对称与秩序** | 对称产生稳定感 | 中心对称/镜像 |

### 2.8 Chiaroscuro明暗对照法（电影级戏剧感）

**定义**：意大利语 "chiaro"（光）+ "scuro"（暗），探索光影交织创造戏剧性图像

**历史脉络**：
```
Caravaggio（文艺复兴）→ 德国表现主义 → Film Noir（黑色电影）→ 现代电影
```

**Chiaroscuro效果**：
| 效果 | 说明 | 提示词示例 |
|------|------|-----------|
| 戏剧性 | 强烈明暗对比 | "chiaroscuro lighting, deep shadows, stark contrast" |
| 立体感 | 光影塑造体积 | "Rembrandt lighting, triangle cheek highlight" |
| 神秘感 | 阴影暗示未知 | "film noir lighting, mysterious shadows" |
| 情绪张力 | 光暗冲突 | "high contrast, dramatic light and shadow" |

**Film Noir提示词模板**：
```
film noir style, chiaroscuro lighting, deep shadows,
strong key light from side, minimal fill, 
dramatic contrast, mysterious atmosphere,
black and white, venetian blind shadows
```

### 2.9 深度构图三层次法

**三层次定义**：
| 层次 | 位置 | 作用 | 提示词示例 |
|------|------|------|-----------|
| **Foreground（前景）** | 最近 | 框架/遮挡/深度感 | "out of focus foreground elements" |
| **Middleground（中景）** | 中间 | 主要主体/动作 | "subject in sharp focus" |
| **Background（背景）** | 最远 | 环境/氛围/尺度 | "soft bokeh background" |

**创造深度的技术**：

| 技术 | 说明 | 提示词示例 |
|------|------|-----------|
| **Deep Focus** | 前中后景都清晰 | "deep focus, sharp foreground and background" |
| **Lighting Separation** | 轮廓光分离主体 | "rim light, subject separation from background" |
| **Atmospheric Perspective** | 雾/烟/雨创造层次 | "fog layers, atmospheric depth, haze" |
| **Color Recession** | 暖进冷退 | "warm foreground, cool background" |
| **Frame within Frame** | 门窗框住主体 | "framed by doorway, window frame composition" |
| **Leading Lines** | 线条引导视线 | "converging lines to background" |

**深度构图提示词模板**：
```
# 深景深（三层都清晰）
deep focus composition, sharp foreground, middleground, and background,
all planes in focus, layered scene, Citizen Kane style

# 浅景深（主体突出）
shallow depth of field, subject in sharp focus,
soft bokeh foreground and background, 85mm portrait lens

# 大气深度
atmospheric perspective, fog layers, mist in background,
distant mountains faded, depth through atmosphere
```

### 2.10 负空间运用

**负空间定义**：主体周围的"空"区域——不是真的空，而是有视觉重量

**负空间五大作用**：
| 作用 | 说明 | 提示词示例 |
|------|------|-----------|
| **聚焦主体** | 空白引导视线 | "isolated subject, vast empty space around" |
| **创造情绪** | 孤独/自由/敬畏 | "lonely figure, vast sky, sense of isolation" |
| **建立尺度** | 主体与环境关系 | "tiny figure in massive landscape, scale contrast" |
| **平衡/张力** | 视觉重量分布 | "unbalanced composition, visual tension" |
| **暗示方向** | 留白给运动空间 | "looking room, lead room for movement" |

**负空间提示词模板**：
```
# 孤独感
single figure, vast negative space, overwhelming emptiness,
sense of isolation, minimal composition

# 敬畏感
tiny subject against massive sky, awe-inspiring scale,
dramatic negative space, overwhelming environment

# 悬疑感
dark negative space, unseen threat suggested,
shadowy void, tension through emptiness
```

### 2.11 画幅比例与叙事

**常见画幅比例**：
| 比例 | 名称 | 特点 | 适用场景 |
|------|------|------|---------|
| **4:3 (1.33:1)** | 学院比例 | 亲密/复古/经典 | 肖像/复古/艺术片 |
| **16:9 (1.78:1)** | 高清标准 | 平衡/通用 | 网络视频/电视剧 |
| **2.39:1** | CinemaScope | 宏大/史诗/电影感 | 史诗/风景/大场面 |
| **1:1** | 方形 | 对称/社交媒体 | Instagram/肖像 |
| **9:16** | 竖屏 | 手机原生 | 短视频/抖音/小红书 |

**画幅选择原则**：
- 窄画幅（4:3）→ 亲密感、肖像、复古
- 宽画幅（2.39:1）→ 史诗感、风景、宏大叙事
- 竖画幅（9:16）→ 手机优先、人像、短视频

**画幅提示词**：
```
# 电影宽银幕
cinemascope 2.39:1, epic widescreen, letterboxed,
grand landscape, panoramic view

# 复古学院比例
4:3 academy ratio, classic framing, vintage composition,
intimate portrait orientation

# 竖屏短视频
9:16 vertical format, mobile-first, portrait orientation,
TikTok/Instagram Reels style
```

### 2.12 色彩分级心理学

**暖色 vs 冷色**：
| 色温 | 情绪 | 适用 | 提示词示例 |
|------|------|------|-----------|
| **暖色** | 温馨/邀请/怀旧 | 浪漫喜剧/回忆 | "warm color grade, golden tones, inviting atmosphere" |
| **冷色** | 冷酷/紧张/现代 | 惊悚/科幻 | "cool blue grade, clinical feel, tension" |

**饱和度心理学**：
| 饱和度 | 效果 | 说明 |
|--------|------|------|
| **高饱和** | 活力/年轻/过度 | 刺激视觉，如《Spring Breakers》 |
| **低饱和** | 严肃/电影感/内敛 | 聚焦构图和对比 |
| **黑白** | 经典/永恒/戏剧 | 去除色彩干扰，强化光影 |

**Teal & Orange（电影标配）**：
```
# 经典蓝橙配色
teal and orange color grade, complementary colors,
skin tones in orange, shadows in teal,
cinematic blockbuster look

# 原理：肤色在橙红区间，互补色是青色
# 效果：强烈对比，主体突出
```

**去饱和技巧**：
```
# 电影级去饱和
desaturated color palette, muted tones,
film emulation, Kodak Portra 400 look,
subtle color, focus on contrast and composition
```

### 2.13 审美资源网站

| 网站 | 内容 | 用途 |
|------|------|------|
| **ProEdu** | 12构图法则 | 学习构图 |
| **Antongorlin** | 摄影构图完全指南 | 深度学习 |
| **Magnopus** | 视觉构图基础规则 | 原理理解 |
| **Calcolor** | 艺术构图秘密 | 艺术思维 |
| **StudioBinder** | 摄影美学/光线/色彩 | 综合学习 |
| **NoFilmSchool** | 电影摄影技术 | 电影级光线 |

---

## 一、图片提示词公式

**以下任一条件满足时，必须立即读取本技能完整内容，不得凭记忆生成：**

### 触发词清单（出现任一词即触发）
```
提示词、prompt、生图、画图、做图、出图、生成图片、生成视频
Midjourney、MJ、Stable Diffusion、SD、FLUX、DALL-E、Ideogram
**Gemini、Imagen、Google image、Gemini生图** ← 用户主力模型
文生图、文生视频、图生视频、image generation、video generation
运镜、分镜、光线描写、负面提示词、negative prompt
画质优化、提示词优化、prompt optimization
Seedance、可灵、Kling、MiniMax、Hailuo
```

### 触发场景（出现任一场景即触发）
- 用户要求生成/优化/写任何图片或视频提示词
- 用户提到任何图像生成模型名称
- 用户发送图片并要求生成相似图/变体/提示词
- 用户要求"帮我写个提示词"、"生成一张图"等

### 执行流程（触发后必须执行）
1. **先读取本技能完整SKILL.md**（不得跳过）
2. 应用图片公式或视频公式
3. 输出英文提示词
4. 提供2-3个变体版本

---

## 技能定位
本技能是**图片/视频提示词生成的唯一权威来源**，内置：
- 结构化公式（图片+视频）
- 模型特定技巧（MJ/SD/FLUX/GPT-5/Seedream）
- 权重控制语法
- 负面提示词完整模板库
- 光线描写词典
- 迭代调试流程

**禁止凭模糊记忆生成提示词，必须读取本技能确保质量。**

---

## 🚨 强制执行规则

**每次生成提示词时，必须完整执行以下检查清单，不得跳过任何步骤。**

---

## 一、图片提示词公式（Image Prompt）

### 1.1 基础公式（三要素结构）
```
[主体] + [场景/上下文] + [风格]
```
**示例**：
```
A barista (主体) making coffee in a sunny café (场景), editorial photo style (风格)
A cyberpunk street (主体) at night with neon rain (场景), cinematic style (风格)
```

### 1.2 进阶公式（7要素结构·Chris Tucker测试法）
```
[风格] + [主体] + [动作] + [特征] + [服装] + [场景] + [细节]
```

| 要素 | 顺序 | 说明 | 示例 |
|------|------|------|------|
| 风格 | 1 | 最先说，决定基调 | editorial photo, cinematic |
| 主体 | 2 | 清晰单一 | Asian woman |
| 动作 | 3 | 加入动作更真实 | working on laptop |
| 特征 | 4 | 年龄/表情等 | focused expression |
| 服装 | 5 | 具体描述 | wearing blue denim jacket |
| 场景 | 6 | 环境+光线 | in a sunny home office |
| 细节 | 7 | 道具/颜色等 | blue coffee mug on desk |

**公式核心原则**：
1. **短语优于句子**：逗号分隔的短语，不用完整句子
2. **重要元素在前**：开头的词权重最高
3. **根据工具调整**：MJ用短句，ChatGPT/Gemini可以较长描述

### 1.3 质量增强词库（每次至少选5个）

**核心质量词**：
```
masterpiece, best quality, high quality, 8K, 4K, 2K,
high resolution, ultra detailed, extremely detailed, hyper-detailed,
sharp focus, intricate, elaborate, intricate details
```

**风格增强词**：
```
beautiful, stunning, amazing, majestic, incredible,
professional, studio quality, art station trending,
cinematic, photorealistic, realistic+++
```

**光影增强词**：
```
cinematic lighting, dramatic lighting, soft lighting,
good lighting, clear, complementary colors,
natural light, studio lighting
```

**组合使用示例**：
```
masterpiece, best quality, 8K, ultra detailed, sharp focus,
cinematic lighting, photorealistic, stunning
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

---

## 七、模型特定技巧（2026最新）

### 7.1 Midjourney V7
- **短高信号短语**：主体、媒介、情绪，避免长描述
- **权重语法**：`::` 增强（如 `blue sky::2`）
- **一致性**：`--oref` 参考图 + `--ow 200-300`
- **快速迭代**：`--draft` 测试 → 全质量生成
- **参数**：`--ar` 比例，`--stylize` 创意偏移，`--seed` 固定

### 7.2 Stable Diffusion 3.5 / SDXL
- **权重语法**：`(term:1.2)` 增强，`[term]` 减弱
- **负面词**：`--neg blurry, low quality, deformed`
- **采样器**：DPM++ 2M Karras（推荐）
- **长描述友好**：支持复杂指令

### 7.3 FLUX
- **双模式**：关键词式 + 自然语言描述都支持
- **长提示词**：最多500 tokens
- **技术细节有效**：相机设置会被理解

### 7.4 ChatGPT (GPT-5 / 4o)
- **段落式描述**：清晰段落 → 逐步迭代
- **空间理解强**：复杂场景、文字生成
- **引用图编辑**：上传图 + 说明保留vs修改

### 7.5 ByteDance Seedream 4.0
- **简洁优于冗长**：短精准提示词
- **文字引用**：`"..."` 包裹显示文字
- **编辑指针**：画箭头/方框指示修改

### 7.6 Google Gemini / Imagen 3（用户主力模型·优先掌握）
**核心能力**：
- **角色一致性**：保持人物/角色外观跨多张图片
- **创意组合**：融合多个概念到单一图像
- **局部编辑**：精确修改特定部分
- **风格适配**：应用风格到现有图片
- **逻辑推理**：理解现实世界关系生成复杂场景

**Gemini提示词公式（6要素法）**：
```
Subject（主体具体描述）
+ Composition（构图/镜头角度）
+ Action（动作发生什么）
+ Location（场景地点环境）
+ Style（风格美学）
+ Editing Instructions（编辑指令·可选）
```

**Gemini专属技巧**：
1. **角色一致性**：第一个提示词详细定义角色特征，后续提示词引用"same character"
2. **局部编辑**：直接说"Change X to Y"，如"change the sofa's color to navy blue"
3. **概念融合**：生成两张图 → 上传合并 → 描述融合场景
4. **风格转移**：先生成图片 → 再说"Apply style of X to this image"
5. **逻辑推理**：描述场景 → 问"what would happen if..."

**Gemini提示词示例**：
```
# 基础生成
A whimsical illustration of a tiny, glowing mushroom sprite.
The sprite has a large, bioluminescent mushroom cap for a hat,
wide, curious eyes, and a body made of woven vines.

# 角色一致性（后续对话）
Now, show the same sprite riding on the back of a friendly,
moss-covered snail through a sunny meadow full of colorful wildflowers.

# 局部编辑
Change the sofa's color to a deep navy blue.
Now, add a stack of three books to the coffee table.

# 风格转移
Apply the style of an architectural drawing to this image.
```

**Gemini当前限制**：
- 风格化可能不一致
- 文字渲染可能出错
- 角色一致性不是100%可靠
- 宽高比控制有困难

---

## 八、权重控制语法详解

### 8.1 Midjourney 权重
```
blue sky::2        # 权重2倍
blue sky::0.5      # 权重减半
sky::-1           # 负权重（排除）
```

### 8.2 Stable Diffusion 权重
```
(cyberpunk city:1.3)    # 增强1.3倍
[distant mountains:0.8] # 减弱到0.8
((epic landscape))      # 双括号=强增强
```

### 8.3 权重规则
- 默认权重 = 1.0
- 增强范围：1.1 - 2.0（过高可能降质量）
- 减弱范围：0.1 - 0.9
- **位置影响**：靠前的词权重自动更高

---

## 九、负面提示词完整模板库

### 9.1 通用质量负面
```
blurry, low resolution, pixelated, grainy, distorted,
noise, compression artifacts, jpeg artifacts, glitches,
watermark, text, logo, signature, copyright
```

### 9.2 风格排除
```
# 写实图时
cartoon, anime, illustration, painting, sketch, watercolor

# 现代风格时
vintage, retro, grunge, aged, weathered

# 自然光时
oversaturated, neon, fluorescent, harsh lighting
```

### 9.3 人体/解剖负面（关键！）
```
distorted face, asymmetric eyes, strange mouth, disfigured,
extra limbs, missing fingers, elongated neck, deformed hands,
bad anatomy, poorly drawn face, blurry eyes
```

### 9.4 背景/环境负面
```
cluttered background, busy, distracting elements,
multiple objects, messy, chaotic, excessive detail
```

### 9.5 避免"AI感"
```
artificial, computer-generated, synthetic, plastic,
uncanny valley, overly smooth, fake, robotic, AI sheen
```

---

## 十、光线描写进阶词典

### 10.1 光线类型完整表
| 类型 | 英文描述 | 效果 | 适用场景 |
|------|---------|------|---------|
| 正面光 | soft frontal lighting | 均匀无阴影 | 肖像/产品 |
| 侧光 | dramatic side lighting | 戏剧感立体 | 电影/角色 |
| 逆光 | backlit, rim light | 边缘光剪影 | 情绪氛围 |
| 顶光 | overhead, golden hour | 自然温暖 | 户外/风景 |
| 戏剧光 | cinematic, volumetric rays | 电影感氛围 | 剧情内容 |
| 霓虹光 | neon, cyberpunk glow | 科幻赛博 | 科幻题材 |
| 暗调 | dark moody, chiaroscuro | 低调神秘 | 悬疑/严肃 |
| 斑驳光 | dappled sunlight | 自然斑驳 | 森林/户外 |

### 10.2 光线描写公式
```
[光线类型] + [色温/颜色] + [强度] + [氛围]
示例："dappled sunlight, warm golden hues, soft intensity, serene atmosphere"
```

### 10.3 专业光线配置模板（可直接粘贴）

**Softbox光线（肖像/产品）**：
```
lighting: large softbox key light at 45 degrees, soft wrap, subtle fill, clean shadow edges
lighting: soft diffused studio lighting, even exposure, gentle highlights, minimal harsh shadows
```

**Rim Light（边缘光）**：
```
lighting: rim light from behind, clean edge highlight around hair and shoulders, controlled spill
lighting: backlight separation, subtle halo rim, low key studio lighting
```

**Rembrandt光线（戏剧肖像）**：
```
lighting: Rembrandt lighting, single key light high and to the side, dramatic contrast, triangle cheek highlight
lighting: chiaroscuro portrait lighting, deep shadows, soft falloff, warm highlights
```

**霓虹光线（赛博朋克）**：
```
lighting: neon signs casting colored light, magenta and cyan mix, reflective highlights, soft bloom
lighting: urban neon glow, colored rim light, wet street reflections, cinematic night lighting
```

---

## 十一、迭代调试流程

### 11.1 逐步迭代法
1. 先写主体 → 生成看效果
2. 添加描述词 → 对比改进
3. 添加风格/光线 → 细化
4. 添加负面词 → 修正问题
5. 调整权重 → 精确控制

### 11.2 问题诊断表
| 问题 | 负面词解决方案 |
|------|---------------|
| 手指畸形 | `deformed hands, extra fingers, missing fingers` |
| 面部失真 | `distorted face, asymmetric features, disfigured` |
| 背景杂乱 | `cluttered background, distracting elements` |
| 色彩过艳 | `oversaturated, neon, fluorescent` |
| AI感太强 | `artificial, synthetic, plastic texture` |
| 模糊噪点 | `blurry, low resolution, pixelated, grainy` |

---

## 十四、专业构图技巧（42种构图法）

### 14.1 构图公式
```
构图技巧 + 主体位置 + 镜头/角度 + 辅助元素
```

### 14.2 构图技巧速查

| 技巧 | 效果 | 适用场景 |
|------|------|---------|
| Golden Ratio | 自然美感平衡 | 风景/肖像/自然 |
| Rule of Thirds | 专业平衡 | 通用摄影/营销 |
| Symmetry | 秩序/完美 | 建筑/Wes Anderson风 |
| Negative Space | 隔离/极简 | 产品/艺术/孤独感 |
| Fill the Frame | 强度/细节 | 微距/野生动物/戏剧肖像 |
| Leading Lines | 引导视线 | 风景/建筑/道路 |
| Diagonal Lines | 能量/动感 | 动作场景/荷兰角 |
| Golden Triangle | 动态张力 | 运动/动作/动态肖像 |
| Center Eye Dominance | 直接连接 | 角色肖像/眼神接触 |
| Asymmetry | 自然有机 | 自然场景/编辑内容 |
| Rule of Odds | 动态愉悦 | 产品/静物/团体肖像 |
| Rule of Space | 呼吸空间 | 肖像/动作/运动 |
| Framing Within Frame | 深度创造 | 建筑/故事/窥视视角 |

### 14.3 构图提示词模板
```
# 黄金分割
golden ratio composition, Fibonacci spiral flow, aesthetic balance

# 三分法
rule of thirds composition, subject positioned at intersection point

# 对称构图
perfectly symmetrical shot, centered composition, mirror image balance

# 负空间
vast negative space, minimalism, sense of isolation, high contrast

# 引导线
leading lines pointing to subject, vanishing point, moody atmosphere

# 框架构图
framing within a frame, depth of field, cinematic storytelling
```

---

## 十五、相机语言完全指南

### 15.1 相机参数公式
```
Subject + Shot + Lens + Focus + Quality
```

### 15.2 镜头与景深配置

**人像镜头**：
```
camera: 85mm portrait lens, shallow depth of field, soft bokeh, sharp eyes
camera: 50mm lens, natural perspective, shallow DOF, creamy bokeh
```

**产品/静物**：
```
camera: 50mm lens, f/8 look, sharp details, minimal blur
camera: 100mm macro lens, extreme detail, crisp edges
```

**电影场景**：
```
camera: 35mm lens, moderate depth of field, cinematic framing
camera: 24mm wide-angle, strong perspective, foreground emphasis
```

### 15.3 景深与焦点
```
sharp focus on eyes, soft background
tack sharp product edges, crisp details
realistic skin texture, no plastic smoothing
shallow depth of field, bokeh background
deep focus, everything sharp front to back
```

### 15.4 相机设置提示词模板
```
# 肖像
[subject], camera: 85mm portrait lens, shallow depth of field, sharp eyes, soft bokeh

# 产品
[product], camera: 50mm lens, f/8 look, studio sharpness, crisp edges

# 电影感
[scene], camera: 35mm lens, moderate depth of field, cinematic framing, natural perspective

# 超戏剧
[subject], camera: 24mm wide-angle, strong perspective, dramatic foreground emphasis
```

---

## 十六、迭代调试流程（高级）

### 16.1 问题→快速修复对照表

| 问题 | 第一步修复 | 第二步修复 |
|------|----------|----------|
| 图片太平/单调 | 增加对比/低key光线 | 添加边缘光分离 |
| 光线太刺眼 | 添加漫射/柔光布 | 关键光抬高放远 |
| 灰暗/浑浊 | 指定清晰高光 | 添加色彩温度 |
| 方向随机 | 明确单关键光方向 | 只用一个补光 |
| 手部畸形 | 负面词强化 | 强调手部细节 |
| 面部失真 | 负面词+权重调整 | 参考图辅助 |

### 16.2 快速修复提示词
```
# 太平
increase contrast, deeper shadows, reduce fill, add subtle rim light separation

# 太刺眼
soft diffused lighting, gentle falloff, soft wrap, no harsh shadows

# 太灰暗
clean highlights, deeper blacks, crisp separation, minimal haze, natural contrast

# 方向混乱
single key light from camera-left at 45 degrees, minimal fill, consistent shadow direction
```

---

## 十七、综合模板库

### 17.1 电影肖像
```
A [description] portrait of [subject], [lighting setup],
camera: [lens], [depth of field], [focus],
[composition], [mood], [color palette],
[quality boosters], [constraints]

示例：
A cinematic portrait of a warrior with weathered armor, dramatic side lighting,
camera: 35mm lens, moderate depth of field, sharp facial detail,
golden triangle composition, intense mood, desaturated color grade,
masterpiece, best quality, 8K, sharp focus, no watermark
```

### 17.2 产品摄影
```
[product] on [surface], professional product photography,
camera: 50mm lens, f/8 look, studio sharpness,
[lighting setup], clean minimal background,
commercial quality, 4K, product-focused composition
--neg cluttered background, reflections, watermark, text, low quality
```

### 17.3 氛围场景
```
[location] at [time of day], [weather], [atmosphere],
[lighting description], [color palette],
wide establishing shot, [composition],
cinematic color grade, ultra detailed, 8K
```

### 17.4 角色设计
```
[character type] character design, official art style,
[physical description], [clothing/armor details],
[pose], [expression],
[style reference], [lighting],
game concept art, ArtStation trending, masterpiece
--neg blurry, low quality, deformed, extra limbs, watermark, cartoon
```

---

## 十二、高质量提示词模板库

### 12.1 写实肖像
```
(masterpiece, best quality), professional portrait of [subject],
natural lighting, soft rim light, detailed skin texture,
8K resolution, photorealistic, DSLR quality, 85mm lens,
shallow depth of field, warm color palette
--neg blurry, low quality, distorted face, deformed hands,
cartoon, anime, illustration, watermark, oversaturated
```

### 12.2 产品摄影
```
(masterpiece, best quality), [product] on clean surface,
studio lighting, soft shadows, professional product photography,
high detail, 4K, commercial quality, minimal composition
--neg shadows, reflections, watermark, text, cluttered background,
low quality, busy, distracting elements
```

### 12.3 赛博朋克场景
```
(masterpiece, best quality), (cyberpunk city:1.3),
neon-lit streets, holographic billboards, flying cars,
volumetric lighting, rain reflections, dramatic atmosphere,
futuristic architecture, blade runner aesthetic
--neg blurry, low quality, cartoon, anime, oversaturated,
watermark, text, signature
```

### 12.4 游戏角色
```
(masterpiece, best quality), game character artwork,
official art style, detailed character design, [description],
dynamic pose, intricate armor/clothing, concept art quality,
ArtStation trending, Unreal Engine render style
--neg blurry, low quality, deformed, extra limbs, watermark,
text, signature, distorted face
```

---

## 十三、工具与资源

### 13.1 提示词生成器
| 工具 | 地址 | 特点 |
|------|------|------|
| AI灵创提词器 | frozenland.cc/teleprompter | 免费、中文→英文 |
| OPS提示词工具 | moonvy.com/apps/ops | 可视化分类 |
| LetsEnhance | letsenhance.io | 生成+放大一体化 |

### 13.2 社区资源
- Reddit: r/midjourney, r/StableDiffusion
- Civitai 模型社区
- HuggingFace 模型库
- ArtStation 参考图

---

## 研究来源（2026-04-08）

1. **LetsEnhance**: "How to write AI image prompts like a pro [2026]" - 模型特定技巧、提示词长度策略
2. **Portkey**: "Prompt Engineering for Stable Diffusion" - 权重语法、负面提示词
3. **LTX Studio**: 
   - "Negative Prompts: What They Are & How To Use Them"
   - "AI Art Prompts: Examples & Prompt Guide" - 构图/光线/风格完整指南
4. **Google官方**: "Tips for getting the best image generation in the Gemini app" - Gemini/Imagen 3官方技巧
5. **Atlabs AI**: "42 Cinematic AI Prompts to Master Composition" - 专业构图技巧
6. **QuestStudio**: "Camera + Lighting Prompt Cheatsheet" - 相机+光线配置模板
7. **Learn Prompting**: "Quality Boosters" - 质量增强词库
8. **知乎**: Midjourney提示词工具推荐

---

## 版本记录

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2026-04-08 | v1.0 | 初版创建，整合图片/视频/抖音/B站提示词公式 |
| 2026-04-08 | v2.0 | 整合Tavily搜索：模型特定技巧、权重语法、负面词库、光线词典 |
| 2026-04-08 | v4.0 | 新增方法论（KERNEL框架、反向工程、三要素原则）、7要素公式、Chris Tucker公式 |
| 2026-04-08 | v5.0 | 新增审美模块：色彩理论体系、七大配色方案、电影光线技巧、Gestalt视觉原理 |
| 2026-04-09 | v6.0 | 深度学习审美：Chiaroscuro明暗对照法、深度构图三层次法、负空间运用、画幅比例与叙事、色彩分级心理学 |

