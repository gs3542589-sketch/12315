# 提示词方法论 + 审美法则 - 研究汇总
## 更新日期：2026-04-09
## 来源：ProSearch 联网搜索
---

## 一、提示词方法论新发现

### 1.1 Prompt 框架核心要素（来自搜索结果）

**五大构成要素**：
1. **Instruction（指令）**：明确告诉模型执行什么任务
2. **Capacity and Role（角色）**：设定模型扮演的专业身份
3. **Context（上下文）**：提供背景信息引导模型理解
4. **Personality（人格）**：指定回答风格/语气/方式
5. **Input Data（输入数据）**：需要处理的具体内容
6. **Output Indicator（输出指示）**：期望的输出格式/类型

### 1.2 提示词工程的核心思维

**从搜索结果提取的关键洞见**：

1. **方法论 > 模板**：真正有效的是思维方式，不是死板模板
2. **迭代优于一次完美**：分步骤添加描述，对比改进
3. **角色设定有奇效**：明确角色（如"专业摄影师"）能显著提升输出质量
4. **few-shot 优于说教**：提供1-3个示例比解释规则更有效
5. **约束条件要具体**："不要做什么"比"做什么"更重要

### 1.3 提示词工程架构模式

从搜索结果总结的 "LLM-Centric" 架构：
- 以大语言模型为核心
- 通过精心设计的 Prompt 作为"控制器"
- 引导模型产出准确、深入、相关的结果

---

## 二、审美法则 - 电影级灯光

### 2.1 电影灯光基础原理

**核心概念**（来自 GPU Gems 影视级照明）：
- **直接照明模式**：艺术家控制灯光的选择、颜色、形状、阴影和纹理
- **阴影颜色变化**：不同光源下阴影会泛不同颜色（如晴天下阴影会泛蓝）
- **反射控制**：避免阴影区域出现高光
- **投影纹理（Cookies）**：实现假阴影或特殊形状灯光效果

### 2.2 摄影用光核心要素

**六大知识点**：
1. 什么是光 - 基础光学理解
2. 自然光 - 日光、月光、天光
3. 有效光 - 如何利用现有光线
4. 摄影光线 - 人造光源
5. 控制光线 - 控光设备
6. 使用光线 - 实践技巧

### 2.3 电影灯光技巧词典

| 类型 | 描述 | 提示词应用 |
|------|------|-----------|
| Key Light（主光） | 最强光源，确定画面基调 | "key light from above left" |
| Fill Light（补光） | 填充阴影，降低对比 | "soft fill light" |
| Rim Light（轮廓光） | 勾勒边缘，与主体分离 | "rim lighting, golden hour" |
| Practical（实用光） | 场景内实际光源 | "practical lamps, warm glow" |
| Volumetric（体积光） | 空气中的光束效果 | "volumetric rays, god rays" |
| Low-key（低调光） | 大量阴影，高对比 | "dark moody atmosphere" |
| High-key（高调光） | 明亮均匀，低对比 | "bright evenly lit scene" |

---

## 三、色彩理论与构图

### 3.1 色彩三要素

**HSV/HSB 模型**：
- **Hue（色相）**：颜色的基本属性，红/黄/蓝/绿等
- **Saturation（饱和度）**：颜色的纯度/鲜艳程度
- **Value/Brightness（明度）**：颜色的明暗程度

### 3.2 色彩心理学基础

**情绪映射**：
- 红色：热情、危险、活力、紧急
- 蓝色：冷静、信任、专业、悲伤
- 黄色：快乐、警告、温暖、创意
- 绿色：自然、成长、安全、平静
- 紫色：神秘、奢华、浪漫、智慧
- 橙色：温暖、活力、友好、实惠

### 3.3 配色方案

| 类型 | 描述 | 示例 |
|------|------|------|
| 单色 | 同色相不同明度 | 蓝色+浅蓝+深蓝 |
| 相似色 | 相邻色相 | 蓝+绿 或 红+橙 |
| 互补色 | 对角位置 | 蓝+橙、红+绿 |
| 分裂互补 | 互补色相邻 | 红+蓝绿+黄绿 |
| 三色组 | 等距三角 | 红+黄+蓝 |

### 3.4 构图原则

**核心法则**：
1. **三分法则**：将画面分成9宫格，主体放在交叉点
2. **引导线**：利用线条引导视线至主体
3. **框架构图**：利用门窗等自然框
4. **层次感**：前中后景营造深度
5. **留白**： Negative space 强调主体
6. **对称与平衡**：中心构图或视觉平衡

---

## 四、提示词 + 审美整合公式

### 4.1 电影感图像提示词模板

```
[主体描述] + [场景环境] + [电影灯光设置] + [色彩调性] + [摄影机位] + [画质增强]

示例：
"close-up portrait of warrior, dramatic battlefield fog,
three-point lighting setup, rim light golden hour,
complementary teal-orange color grade, shallow depth of field,
35mm cinema lens, film grain, cinemascope aspect ratio,
masterpiece, 8K, photorealistic"
```

### 4.2 分层描述法

**第一层（基础）**：主体 + 动作 + 核心特征
**第二层（环境）**：场景 + 背景 + 氛围
**第三层（光线）**：光源类型 + 方向 + 色温 + 阴影
**第四层（色彩）**：主色调 + 配色方案 + 情绪
**第五层（风格）**：摄影师风格 + 时代感 + 质感

### 4.3 审美关键词库

**灯光类**：
```
cinematic lighting, three-point lighting, Rembrandt lighting,
softbox, beauty dish, golden hour, blue hour, twilight,
volumetric rays, god rays, lens flare, bokeh
```

**色彩类**：
```
complementary colors, color grading, teal orange,
desaturated, high contrast, warm tones, cool tones,
split-toning, color palette, cinematic color
```

**构图类**：
```
rule of thirds, leading lines, symmetry, framing,
negative space, depth of field, shallow focus,
wide angle, telephoto compression, Dutch angle
```

**质感类**：
```
film grain, texture, weathered, cinematic,
photorealistic, hyper-realistic, detailed,
sharp focus, soft focus, matte painting
```

---

## 五、今天发现总结

### 新方法论（3个）
1. **五大要素框架**：Instruction/Role/Context/Personality/Output Indicator
2. **角色设定法**：明确专业角色提升输出质量
3. **few-shot 优于说教**：示例引导比规则解释更有效

### 审美法则（4类）
1. **电影灯光**：Key/Fill/Rim/Practical + Volumetric
2. **色彩心理学**：HSV三要素 + 情绪映射 + 配色方案
3. **构图原则**：三分法/引导线/框架/层次/留白
4. **整合公式**：分层描述法（基础→环境→光线→色彩→风格）

---

## 六、技能更新建议

建议创建/更新 `aigc-prompt-factory` 技能，整合以下模块：

1. **方法论模块**：五大要素框架、角色设定法、few-shot技巧
2. **灯光模块**：电影灯光词典、光线描写公式
3. **色彩模块**：色彩心理学、配色方案库
4. **构图模块**：构图原则、相机术语
5. **整合模板**：分层描述法、电影感模板

---

## 数据来源
- 搜索时间：2026-04-09
- 搜索关键词：prompt engineering framework, cinematic lighting techniques photography, color theory photography visual composition, reverse prompt engineering
