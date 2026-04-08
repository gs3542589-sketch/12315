# Gemini 图像生成完整指南

> 整理时间：2026-04-09
> 来源：Google 官方博客 + Yunwu API 实测

---

## 一、API 技术配置

### 1.1 云雾 API 端点

| 功能 | 端点 | 模型 |
|------|------|------|
| **生图** | `/v1/chat/completions` | `gemini-2.5-flash-image-preview` |
| **识图** | `/v1/chat/completions` | `gpt-4o-mini` |

**注意**：生图用的是 chat/completions 端点，不是 images/generations！

### 1.2 API Keys 使用规则（铁律）

| Key | 用途 | 触发条件 |
|-----|------|---------|
| `YUNWU_IMAGE_KEY` | 生图 | 用户要求生成图片 |
| `YUNWU_VISION_KEY` | 识图 | 用户发送图片/截图给我分析 |
| `TAVILY_API_KEY` | 搜索 | 任何搜索场景 |

**禁止**：任何其他场景调用云雾 API（对话/写作/分析等）

### 1.3 参考图处理流程

```
原图（可能 7MB+）→ PIL 压缩到 <200KB → base64 编码 → 发送 API
```

压缩代码：
```python
from PIL import Image
img = Image.open(src_path)
img = img.resize((1024, int(img.height * 1024 / img.width)), Image.LANCZOS)
img.save(dst_path, 'JPEG', quality=85)
```

---

## 二、提示词工程框架

### 2.1 六大构成要素（Google 官方方法论）

| 要素 | 含义 | 示例 |
|------|------|------|
| **Subject** | 主体是谁/什么 | 威龙，精英战士，穿着灰色战斗服 |
| **Composition** | 镜头构图 | 中景、低角度、宽镜头、特写 |
| **Action** | 正在做什么 | 冲锋、射击、持枪站立、奔跑 |
| **Location** | 场景在哪里 | 西普坝废墟战场、夜间城市街道 |
| **Style** | 什么风格 | UE5 游戏CG、虚幻引擎渲染、游戏截图 |
| **Editing** | 特殊要求 | 无文字、无水印、保持角色一致性 |

### 2.2 角色一致性技巧

**方法一：图生图**
```
参考图 base64 + 提示词 = 保持角色 + 新场景
```

**方法二：多轮对话**
```
第一轮：建立角色定义（详细描述外观）
第二轮：请求放置到新场景（"same character as above"）
```

### 2.3 场景描述模板

**西普坝（Xp9）**：大规模战争、开阔地形、建筑废墟、坦克残骸、烟雾弥漫
**凛冽峡谷（Battle0ne）**：雪地山区、峡谷战斗、狙击点位、白色基调
**工业园（M64）**：工业区、工厂、集装箱、管道、烟雾缭绕

---

## 三、游戏内容 vs 摄影内容

### 3.1 关键区别

| 维度 | 游戏内容 | 摄影内容 |
|------|---------|---------|
| **风格词** | UE5、游戏CG、虚幻引擎渲染 | 照片级真实、电影质感、8K摄影 |
| **画质描述** | 游戏截图质量、高画质渲染 | 照片级细节、真实纹理 |
| **光线** | 游戏引擎光源、环境光遮蔽 | 自然光、电影灯光 |
| **氛围** | 游戏场景氛围、战术风格 | 电影氛围、真实战场 |

### 3.2 游戏提示词示例

```
Good: "Delta Force video game screenshot, UE5 Unreal Engine 5 rendered, 
      tactical shooter game aesthetic, in-game cinematic quality"

Bad: "hyper-realistic photography, cinematic lighting, 8K photo quality"
```

### 3.3 禁用词汇（游戏内容）

❌ hyper-realistic, photorealistic, photography, film grain, cinematic photography
✅ UE5 rendered, game CG, video game screenshot, in-game cinematic

---

## 四、完整工作流

### 4.1 标准生图流程

```
1. 接收需求（角色 + 场景 + 动作 + 氛围）
2. 压缩参考图（如需要）
3. 构建6要素提示词
4. 调用 API 生成
5. 识图分析评分
6. 优化迭代
```

### 4.2 识图闭环

```
生成图片 → 调用 gpt-4o-mini 分析 → 5维度评分：
- 角色相似度（vs 参考图）
- 场景氛围
- 游戏质感
- 光线效果
- 整体质量

总分 = 5项相加（满分50）
```

### 4.3 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 角色不像 | 参考图压缩太狠/描述不够 | 用原图、压缩到150-200KB、强化特征描述 |
| 场景不对 | 地图特征描述模糊 | 查游戏资料、用具体地图名+特征词 |
| 风格不对 | 提示词用了摄影词汇 | 换成游戏词汇（UE5/游戏CG） |
| API 返回空 | 图片太大/格式问题 | 压缩到 <200KB，用 JPEG |
| 识图被拒 | 触发内容审核 | 简化提示词、避免敏感词 |

---

## 五、三角洲行动专属知识

### 5.1 干员特征速查

**威龙（Warlord）**
- 浅灰+红金装饰高科技战斗服
- 肩部防护装置
- 未来科技感武器
- 战术背包

### 5.2 地图场景速查

| 地图 | 关键词 | 氛围 |
|------|--------|------|
| 西普坝 | 大规模战争、废墟、坦克残骸 | 战争大片 |
| 凛冽峡谷 | 雪地、峡谷、狙击 | 冷酷狙击 |
| 工业园 | 工厂、集装箱、管道 | 工业战术 |

---

## 六、文件路径索引

| 文件 | 路径 | 用途 |
|------|------|------|
| 参考原图 | `~/.qclaw/workspace-agent-1f90a168/威龙_参考原图.jpg` | 威龙角色参考 |
| 压缩版 | `~/.qclaw/workspace-agent-1f90a168/威龙_参考原图_压缩.jpg` | API调用版 |
| 生成图 | `~/.qclaw/workspace-agent-1f90a168/xp9_night_v2.png` | 西普坝夜间 |

---

*本文档随实践持续更新*
