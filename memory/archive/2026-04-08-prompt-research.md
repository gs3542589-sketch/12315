# 图片提示词优化 - 研究成果汇总
## 更新日期：2026-04-08（第二波）
## 来源：Tavily Search + 多站点深度抓取

---

## 一、新增学习内容（第二波）

### 1.1 质量增强词库（扩展版）

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
good lighting, clear, complementary colors
```

### 1.1 通用结构（适用于所有模型）
```
主体（具体描述） + 细节（表情/服装/动作/道具） + 场景（地点+环境） + 光线（方向+色温+氛围） + 风格（1主风格+1-2质感词） + 画质标签（5个增强词） + 负面约束
```

### 1.2 一行式模板（快速使用）
```
"Subject, medium, style, lighting, framing, mood, palette"
示例："Portrait of a barista, film photo, soft rim light, 50mm close-up, warm mood, teal-orange palette"
```

---

## 二、模型特定技巧

### 2.1 Midjourney V7
- **短短语优于长描述**：写短、高信息量短语（主体、媒介、情绪）
- **权重语法**：`::` 增强权重（如 `blue sky::2`）
- **一致性控制**：`--oref` 参考图 + `--ow` 控制相似度（200-300）
- **快速迭代**：先用 `--draft` 快速测试，再全质量生成
- **参数**：`--ar` 比例，`--stylize` 创意偏移，`--seed` 固定随机

### 2.2 Stable Diffusion 3.5 / SDXL
- **权重语法**：`(term:1.2)` 增强，`[term]` 减弱
- **负面提示词**：`--neg blurry, low quality, deformed`
- **采样器推荐**：DPM++ 2M Karras
- **支持长描述**：可处理复杂指令
- **ControlNet**：精确控制构图和姿态

### 2.3 FLUX
- **双模式支持**：关键词式 + 自然语言描述都能处理
- **长提示词友好**：最多支持500 tokens
- **技术细节有效**：相机设置、光圈、ISO等会被理解
- **避免技术术语堆砌**：不要用过多 `shallow depth of field` 等专业术语

### 2.4 ChatGPT (GPT-5 / 4o) 图像
- **段落式描述**：清晰段落，然后逐步迭代
- **空间理解强**：复杂场景、文字生成能力好
- **引用图编辑**：上传参考图 + 说明保留vs修改
- **多轮对话调整**："Make the sofa navy", "Zoom out 20%"

### 2.5 ByteDance Seedream 4.0
- **简洁优于冗长**：短、精准提示词效果更好
- **文字引用**：用双引号 `"..."` 包裹要显示的文字
- **编辑指针**：画箭头/方框指示修改位置
- **一致性参考**：上传参考图 + 明确"复制什么"/"修改什么"

---

## 三、负面提示词完全指南

### 3.1 通用质量负面词
```
blurry, low resolution, pixelated, grainy, distorted,
noise, compression artifacts, jpeg artifacts, glitches,
watermark, text, logo, signature, copyright
```

### 3.2 风格排除负面词
```
# 生成写实图时
cartoon, anime, illustration, painting, sketch, watercolor

# 生成现代风格时
vintage, retro, grunge, aged, weathered

# 生成自然光时
oversaturated, neon, fluorescent, harsh lighting
```

### 3.3 人体/解剖负面词（重要！）
```
distorted face, asymmetric eyes, strange mouth, disfigured,
extra limbs, missing fingers, elongated neck, deformed hands,
bad anatomy, poorly drawn face, blurry eyes
```

### 3.4 背景/环境负面词
```
cluttered background, busy, distracting elements, 
multiple objects, messy, chaotic, excessive detail, noise
```

### 3.5 避免"AI感"负面词
```
artificial, computer-generated, synthetic, plastic,
uncanny valley, overly smooth, fake, robotic, AI sheen
```

---

## 四、光线描写进阶技巧

### 4.1 光线类型词典
| 类型 | 英文描述 | 效果 |
|------|---------|------|
| 正面光 | soft frontal lighting, even illumination | 均匀、无阴影 |
| 侧光 | dramatic side lighting, strong contrast | 戏剧感、立体 |
| 逆光 | backlit, rim light, silhouette | 边缘光、剪影 |
| 顶光 | overhead lighting, golden hour | 自然、温暖 |
| 戏剧光 | cinematic lighting, volumetric rays | 电影感、氛围 |
| 霓虹光 | neon lighting, cyberpunk glow | 科幻、赛博朋克 |
| 暗调 | dark moody atmosphere, chiaroscuro | 低调、神秘 |

### 4.2 光线描写公式
```
[光线类型] + [色温/颜色] + [强度] + [氛围]
示例："dappled sunlight filtering through canopy, warm golden hues, soft intensity, serene atmosphere"
```

---

## 五、权重控制语法

### 5.1 Midjourney 权重
```
blue sky::2        # 权重2倍
blue sky::0.5      # 权重减半
sky::-1           # 负权重（排除）
```

### 5.2 Stable Diffusion 权重
```
(cyberpunk city:1.3)    # 增强1.3倍
[distant mountains:0.8] # 减弱到0.8
((epic landscape))      # 双括号=强增强
```

### 5.3 权重规则
- 默认权重 = 1.0
- 增强范围：1.1 - 2.0（过高可能导致质量下降）
- 减弱范围：0.1 - 0.9
- 位置影响：靠前的词权重自动更高

---

## 六、迭代与调试技巧

### 6.1 逐步迭代法
1. 先写主体，生成看效果
2. 添加描述词，对比改进
3. 添加风格/光线，细化
4. 添加负面词，修正问题
5. 调整权重，精确控制

### 6.2 调试问题诊断
| 问题 | 解决方案 |
|------|---------|
| 手指畸形 | 添加负面词 `deformed hands, extra fingers, missing fingers` |
| 面部失真 | 添加 `distorted face, asymmetric features, disfigured` |
| 背景杂乱 | 添加 `cluttered background, distracting elements` |
| 色彩过艳 | 添加 `oversaturated, neon, fluorescent` |
| AI感太强 | 添加 `artificial, synthetic, plastic texture` |
| 模糊/噪点 | 添加 `blurry, low resolution, pixelated, grainy` |

### 6.3 保持一致性技巧
- 使用固定 `--seed` 值
- 同系列作品使用相同负面提示词模板
- 保存有效的提示词组合到文档

---

## 七、高质量提示词模板库

### 7.1 写实肖像
```
(masterpiece, best quality), professional portrait of [subject], 
natural lighting, soft rim light, detailed skin texture,
8K resolution, photorealistic, DSLR quality, 85mm lens,
shallow depth of field, warm color palette
--neg blurry, low quality, distorted face, deformed hands, 
cartoon, anime, illustration, watermark, oversaturated
```

### 7.2 产品摄影
```
(masterpiece, best quality), [product] on clean surface,
studio lighting, soft shadows, professional product photography,
high detail, 4K, commercial quality, minimal composition
--neg shadows, reflections, watermark, text, cluttered background,
low quality, busy, distracting elements
```

### 7.3 赛博朋克场景
```
(masterpiece, best quality), (cyberpunk city:1.3), 
neon-lit streets, holographic billboards, flying cars,
volumetric lighting, rain reflections, dramatic atmosphere,
futuristic architecture, blade runner aesthetic
--neg blurry, low quality, cartoon, anime, oversaturated,
watermark, text, signature
```

### 7.4 游戏角色
```
(masterpiece, best quality), game character artwork,
official art style, detailed character design, [description],
dynamic pose, intricate armor/clothing, concept art quality,
ArtStation trending, Unreal Engine render style
--neg blurry, low quality, deformed, extra limbs, watermark,
text, signature, distorted face
```

---

## 八、工具与资源

### 8.1 提示词生成器
| 工具 | 地址 | 特点 |
|------|------|------|
| AI灵创提词器 | frozenland.cc/teleprompter | 免费、中文→英文 |
| MidJourney Prompt生成器 | ai.sppinfo.cn | 中文翻译+命令 |
| OPS提示词工具 | moonvy.com/apps/ops/ | 可视化分类 |
| LetsEnhance | letsenhance.io | 生成+放大一体化 |

### 8.2 社区资源
- Reddit r/midjourney, r/StableDiffusion
- Civitai 模型社区
- HuggingFace 模型库
- ArtStation 参考图

---

## 九、关键结论

1. **提示词质量决定图像质量**：结构化+光线+负面约束缺一不可
2. **模型差异显著**：MJ短短语、SD权重语法、FLUX长描述友好
3. **负面提示词是神器**：防止手指畸形、面部失真、AI感
4. **权重控制精细调整**：`(term:1.2)` 和 `::` 语法
5. **迭代优于一次完美**：逐步添加、对比调试
6. **一致性靠seed+模板**：同系列使用相同配置

---

## 十、更新建议

建议将以上内容整合到 `aigc-prompt-factory` 技能中，增强以下模块：
1. 模型特定技巧（区分MJ/SD/FLUX/ChatGPT）
2. 权重控制语法详解
3. 负面提示词完整模板库
4. 光线描写进阶词典
5. 迭代调试流程图