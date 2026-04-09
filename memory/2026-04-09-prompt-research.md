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

## 七、材质细节 - 质感描写技巧

### 7.1 材质对美感的影响

材质细节是区分"普通图片"和"高质量图片"的关键因素：
- **纹理密度**：粗糙/细腻程度影响触感联想
- **光泽特性**：哑光/缎面/高光表达材质等级
- **表面细节**：裂纹、毛孔、织物纹理增加真实感
- **反射/折射**：金属、玻璃、水滴的光学特性

### 7.2 常见材质关键词库

| 材质类型 | 关键词 | 适用场景 |
|----------|--------|----------|
| 金属 | brushed metal, polished chrome, oxidized copper, gold foil, matte black metal | 科技产品、奢侈品 |
| 皮革 | full-grain leather, patent leather, worn leather, suede | 时尚、配饰 |
| 织物 | silk fabric, cotton weave, velvet, lace, cashmere, denim texture | 服装、家居 |
| 石材 | marble veining, granite texture, concrete, slate, limestone | 建筑、室内 |
| 木材 | oak grain, walnut burl, bamboo texture, weathered wood | 家居、自然 |
| 皮肤 | poreless skin, dewy skin, matte skin, sun-kissed, porcelain | 人像、肖像 |
| 玻璃 | frosted glass, crystal clear, shattered glass, iridescent | 饮品、装饰 |
| 水 | liquid mercury, water droplets, ice crystals, oil slick | 创意、抽象 |

### 7.3 质感描写公式

```
[材质名称] + [处理工艺] + [表面状态] + [光泽特性]

示例：
"full-grain leather, hand-stitched, aged patina, subtle sheen"
"marble stone, white veining, polished surface, soft diffuse reflection"
```

### 7.4 光泽度层级

| 描述 | 关键词 | 视觉效果 |
|------|--------|----------|
| 极致哑光 | matte, flat, chalky | 无反光、高级感 |
| 缎面 | satin, silk, eggshell | 柔和光泽、优雅 |
| 半光 | semi-gloss, pearl, satin | 适度反光、丰富 |
| 高光 | glossy, polished, chrome | 强烈反光、奢华 |
| 镜面 | mirror-like, reflective, liquid | 完全反射、科幻 |

### 7.5 材质与光线交互

| 材质 | 光线表现 | 提示词示例 |
|------|----------|------------|
| 金属 | 高光锐利、反射环境 | "chrome surface reflecting sunset" |
| 丝绸 | 柔和散射、渐变光泽 | "silk fabric catching light" |
| 玉石 | 半透明、温润光泽 | "jade stone with subsurface scattering" |
| 水 | 折射、涟漪、焦散 | "water surface with caustics" |
| 毛皮 | 散射光晕、毛发高光 | "furry texture with rim lighting" |

### 7.6 整合到分层描述法

**第六层（材质）**：材质名称 + 处理工艺 + 表面细节 + 光泽度

```
完整示例：
"close-up perfume bottle, glass bottle with gold cap,
frosted glass texture, beveled edges, crystal clear liquid inside,
three-point lighting, rim light highlighting glass edges,
warm color palette, luxury brand aesthetic,
macro lens, extreme detail, 8K, photorealistic"
```

---

---

## 八、网上专业Prompt示例提取 - 材质关键词库（2026-04-09新增）

### 8.1 从实际Prompt案例提取的材质关键词

来源：mj02.com Midjourney中文网站实际案例

**面料/纺织类**：
```
做旧麂皮, aged suede
扎染棉布, tie-dyed cotton
丝绸, silk, 丝绸圆领
丝绒, velvet, 丝绒镶边, 丝绒披风
蕾丝, lace, 蕾丝衬衫
缎面, satin, 珍珠缎面, 缎面印花
亮片, sequin, 亮片身体链, 碎钻
麂皮, suede
纺织, fabric
棉布, cotton
```

**金属/珠宝类**：
```
亮面刺绣, glossy embroidery
金属肩甲, metal shoulder armor
银质雕花, silver engraved
精致金属, exquisite metal
宝石, gemstone, 镶嵌宝石
钻石, diamond, 钻石光泽
串珠链, bead chain
流苏, tassel, 流苏肩带链
```

**光泽度层级（网络提取版）**：
```
亮面, glossy, 亮面刺绣
磨砂, frosted, 磨砂玻璃
流光溢彩, iridescence
璀璨晶莹, sparkling crystal
通透, transparent, 通透光影
斑驳, mottled, 斑驳光影
柔和, soft, 柔和均匀
```

**质感描写补充**：
```
CG质感, CG texture
超写实CG质感, hyper-realistic CG
电影级光影, cinematic lighting
高细节渲染, high detail rendering
精致细节, exquisite detail
细腻, delicate, 细腻质感
线条流畅, smooth lines
```

**材质+光线组合**：
```
丝绸面料捕捉光线, silk fabric catching light
磨砂玻璃水蒸气, frosted glass with steam
金属反射夕阳, metal reflecting sunset
流水水晶光泽, water with crystal shine
```

---

## 九、完整材质关键词速查表

### 9.1 材质分类速查

| 类别 | 中文关键词 | 英文关键词 |
|------|------------|------------|
| **金属** | 拉丝金属,抛光镀铬,氧化铜,金箔,哑光黑金 | brushed metal, polished chrome, oxidized copper, gold foil, matte black metal |
| **皮革** | 全粒面皮革,漆皮,做旧皮革,麂皮绒 | full-grain leather, patent leather, worn leather, suede |
| **丝绸织物** | 真丝面料,棉质编织,天鹅绒,蕾丝,羊绒 | silk fabric, cotton weave, velvet, lace, cashmere |
| **石材** | 大理石纹,花岗岩,混凝土,板岩,石灰岩 | marble veining, granite texture, concrete, slate, limestone |
| **木材** | 橡木纹,胡桃木瘿,竹子,风化木 | oak grain, walnut burl, bamboo texture, weathered wood |
| **玻璃** | 磨砂玻璃,水晶透明,碎玻璃,彩虹色玻璃 | frosted glass, crystal clear, shattered glass, iridescent |
| **珠宝** | 钻石,珍珠,红宝石,蓝宝石,翡翠 | diamond, pearl, ruby, sapphire, jade |
| **毛皮/毛发** | 皮毛,貂皮,狐狸毛,羊毛 | fur, mink, fox fur, wool |

### 9.2 光泽度速查

| 程度 | 中文 | 英文 | 视觉效果 |
|------|------|------|----------|
| 最强哑光 | 哑光,平光,粉笔质 | matte, flat, chalky | 无反光,高级感 |
| 缎面 | 缎面,丝绸,蛋壳纹 | satin, silk, eggshell | 柔和光泽,优雅 |
| 半光 | 半光,珍珠光,绸缎光 | semi-gloss, pearl, satin | 适度反光,丰富层次 |
| 高光 | 高光,抛光,镀铬 | glossy, polished, chrome | 强烈反光,奢华 |
| 镜面 | 镜面般,液态金属 | mirror-like, reflective, liquid | 完全反射,科幻 |

### 9.3 材质+光线万能组合

```
# 金属质感
[金属类型] + [光泽] + [反射环境]
示例：polished chrome reflecting neon lights, oxidized copper catching sunset

# 丝绸/织物
[织物类型] + [光线描述] + [动态]
示例：silk fabric catching golden hour light, velvet draping naturally

# 玻璃/透明
[玻璃类型] + [光线效果] + [状态]
示例：frosted glass with soft light transmission, crystal clear with caustics

# 玉石/半透明
[材质] + [散射效果] + [光泽]
示例：jade with subsurface scattering, amber with warm glow
```

---

## 数据来源
- 搜索时间：2026-04-09
- 搜索关键词：prompt engineering framework, cinematic lighting techniques photography, color theory photography visual composition, reverse prompt engineering
- 补充来源：mj02.com Midjourney中文网站实际Prompt案例
