# 新技能深度学习成果

## 一、视频分析工具

### 1. douyin-video-analyst（抖音视频分析）
**核心能力**：
- 批量采集抖音账号主页视频链接
- 提取视频语音文案（需要douyin-mcp）
- 去除口语化，输出精简文案
- 综合总结分析

**前置依赖**：
- browser工具（必须用，抖音是JS渲染）
- mcporter CLI
- douyin-mcp server

**版本对应**：
- v1.1.0：硅基流动 API → 需 `DOUYIN_API_KEY`
- v1.2.0+：阿里云百炼 → 需 `DASHSCOPE_API_KEY`

**工作流**：
```
browser抓取视频列表 → 提取/video/链接 → 并发提取文案 → 总结
```

---

### 2. bilibili-hot-monitor（B站热门监控）
**核心能力**：
- 生成B站热门视频日报
- 自动发送邮件
- 支持AI总结和点评

**配置需要**：
- B站 Cookies
- OpenRouter API Key（可选，用于AI总结）
- Gmail发件邮箱 + 应用密码

**执行方式**：分步询问用户配置

---

### 3. xhs-video-finder（小红书视频查找）
**核心能力**：
- 搜索小红书最新热门视频
- 筛选：最新/视频/一周内
- 提取带xsec_token的视频URL

**工作流**：
```
1. 打开xiaohongshu.com（需登录）
2. 搜索关键词
3. 应用筛选：最新、视频、一周内
4. 选取1000+点赞、6分钟内、无水印的视频
5. 获取完整URL（含xsec_token）
```

**用途**：适合YouTube Shorts二创、获取素材

---

## 二、图片反推提示词

### 4. image2prompt（图片转提示词）
**核心能力**：
- 分析图片生成可复现的AI提示词
- 支持多类别：人像/风景/产品/动物/插画

**类别分析维度**：
- 人像：模特风格、主体特征、面部、服装、环境、灯光、相机
- 风景：地形、天空、构图、色彩、摄影风格
- 产品：产品特性、设计元素、场景布置
- 动物：种类、姿态、环境
- 插画：图表类型、设计元素

**输出格式**：
- 自然语言描述（600-1000字）
- 结构化JSON

**需要**：`OPENAI_API_KEY`

---

### 5. image-vision（图片视觉分析）
**核心能力**：
- 多模态视觉模型分析图片
- OCR文字提取
- 图片比较
- 视觉问答

**使用场景**：
- 描述图片内容
- 从图片提取文字（OCR）
- 比较两张图片
- 基于图片回答问题

---

## 三、视频反推提示词

### 6. video-reverse-prompt（视频反向提示词）
**核心能力**：
- 分析视频提取反向提示词
- 分镜 breakdowns
- AI-ready视觉描述

**支持输入**：
- YouTube链接
- 直接.mp4 URL
- 本地.mp4文件（最大30MB）

**需要**：`NANOPHOTO_API_KEY`（https://nanophoto.ai获取）

**工作流**：
```
用户给视频 → 判断类型 → 编码（如本地） → 调用API → 返回分镜+提示词
```

**输出**：每个镜头的详细描述，可用于生成类似风格的AI视频

---

## 完整工具链

```
素材获取：
  - yt-video-downloader → YouTube视频
  - douyin-video-analyst → 抖音分析
  - bilibili-hot-monitor → B站热门
  - xhs-video-finder → 小红书视频

反推提示词：
  - image2prompt → 图片反推
  - image-vision → 图片分析
  - video-reverse-prompt → 视频反推

生成内容：
  - jimeng-image-gen / image-cog → 图片生成
  - seedance-video-generation → 视频生成
  - novel-generator / short-drama-writer → 脚本创作
```

---

## 配置需求汇总

| 技能 | 需要配置的Key |
|------|---------------|
| douyin-video-analyst | DOUYIN_API_KEY 或 DASHSCOPE_API_KEY |
| bilibili-hot-monitor | B站Cookies + OpenRouter Key + Gmail |
| image2prompt | OPENAI_API_KEY |
| video-reverse-prompt | NANOPHOTO_API_KEY |

---

## 使用建议

1. **分析竞品**：用douyin-video-analyst分析同类账号
2. **学习热门**：用bilibili-hot-monitor跟踪B站热门
3. **反推提示词**：给喜欢的图片/视频反推提示词
4. **为己所用**：用反推的提示词生成自己的内容