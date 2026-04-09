# AIGC创作技能库 - 完整学习成果

## 一、小说/剧本创作

### 1. novel-generator（中文爽文小说生成器）
**核心能力**：
- 一句话方向 → 自动完善提示词（世界观、人设、冲突、爽点）
- 分章节创作：每章2000-3000字，层层递进
- 记忆系统：维护角色/地点/情节一致性
- 情节图解：自动生成Mermaid关系图
- 多题材支持：都市、修仙、玄幻、重生、系统流、末世

**工作流**：
```
方向 → 提示词完善 → 大纲规划 → 逐章生成 → 输出md
```

**使用**：
```bash
# 用户给方向，如"写一个都市重生爽文"
# 自动补全提示词，产出完善的创作提示词
```

---

### 2. story-cog（CellCog创意写作）
**核心能力**：
- 短篇小说（500-3000字）
- 长篇小说（大纲+章节）
- 剧本/电影脚本
- 世界观构建、角色设计、叙事设计
- 支持：奇幻、科幻、悬疑、爱情、恐怖

**前提**：需要先安装cellcog skill

---

### 3. short-drama-writer（短剧编剧）
**核心能力**：
- 竖屏短剧/微短剧创作
- 角色设计、情节设计、对白设计
- 钩子设计（前3秒抓住用户）
- 节奏控制（每30秒反转）
- 热门题材：总裁/穿越/复仇/甜宠/重生

**命令**：
```bash
short-drama-writer write      # 写剧本
short-drama-writer character # 角色设计
short-drama-writer plot      # 情节设计
short-drama-writer dialogue # 对白设计
```

---

## 二、视频脚本

### 4. video-script-generator（短视频脚本生成器）
**输入参数**：
- topic: 产品/主题
- audience: 目标受众
- duration: 15s/30s/60s/90s
- template: pain-solution/before-after/plot-twist

**输出**：
```yaml
meta:
  title: "标题"
  duration: 30s
  platform: douyin
script:
  hook: "开场钩子"
  scenes:
    - id: 1
      type: hook/pain/solution/demo/cta
      duration: 3s
      narration: "旁白"
      shot_description: "镜头描述"
```

---

### 5. ai-video-script-automaton（AI视频脚本自动化）
**核心能力**：自动化生成视频脚本

---

### 6. drama-generator（短剧生成器）
**核心能力**：
- 剧本解析 → 多角色配音视频
- 支持6种TTS声音
- 场景切换动画
- 对话框样式
- 旁白支持
- 完整自动化流水线

**剧本格式**：
```
[场景1 - 办公室 - 早晨]
角色名: 对话内容
旁白: 旁白内容
```

---

## 三、分镜转换

### 7. script-to-storyboard（脚本转分镜）
**输入**：剧本文本（场景、人物动作、对白、镜头指示）

**输出字段**：
- 镜号：01, 02, 03...
- 景别/拍摄角度：远景/全景/中景/近景/特写
- 画面内容：视觉元素描述
- 出场人物：角色
- 场景：地点+环境
- 音效：背景音乐/环境音

**用法**：
```bash
python3 scripts/convert.py <input.txt> [output.csv]
```

---

## 四、图像生成

### 8. image-cog（CellCog图片生成）
**模型**：
- Nano Banana 2（默认）：写实场景、复杂构图、文字渲染
- GPT Image 1.5：透明背景图片（logo、贴纸）
- Recraft：矢量插画、图标

**能力**：
- 文本生成图片
- 图片编辑/风格迁移
- 一致性角色生成（多场景同一角色）
- 产品摄影

**前提**：需要先安装cellcog skill

---

### 9. script-to-storyboard分镜到图
配合使用：
1. script-to-storyboard 生成表格
2. jimeng-image-gen 或 image-cog 生成每镜图片

---

## 五、音频/配音

### 10. music-cog（CellCog AI音乐）
**能力**：
- 5秒-10分钟任何时长
- 纯音乐：电影配乐、背景音乐、播客开场、游戏音乐
- 人声歌曲：AI生成完整歌词和演唱
- 风格：任何流派、混搭

**前提**：需要先安装cellcog skill

---

## 六、字幕

### 11. ai-subtitle-generator（NemoVideo字幕）
**能力**：
- 98%+准确率，接近人工
- 词级时间戳
- 多说话人区分
- 50+语言翻译
- 定制样式（字体、颜色、位置）
- 输出：SRT/VTT/嵌入式视频

**参数**：
- prompt: 生成需求描述
- source_language: 源语言
- style: {font, color, background, position}
- languages: 目标语言数组
- timing: word-level/phrase-level/sentence-level

---

## 七、发布

### 12. social-media-publish（社交媒体发布）
**支持平台**：
- 微信公众号
- 百度百家号
- 小红书

**流程**：
1. 打开对应平台后台
2. 登录账号（用户手动）
3. 新建图文/文章
4. 填写标题、正文、封面
5. 保存草稿或发布

---

## 八、剪映（已有Python库）

### pyJianYingDraft
- 草稿生成：全版本支持
- 模板模式：仅5.9及以下
- 自动导出：仅6及以下

**使用**：
```python
import pyJianYingDraft as draft

draft_folder = draft.DraftFolder("草稿文件夹")
script = draft_folder.new_script("新视频")
# 添加视频/音频/文本
script.save()
```

---

## 完整工作流

```
1. 选题 → tcm-video-factory / content-factory
2. 小说/剧本 → novel-generator / short-drama-writer
3. 视频脚本 → video-script-generator
4. 脚本→分镜 → script-to-storyboard
5. 分镜图 → jimeng-image-gen / image-cog
6. 视频生成 → seedance-video-generation
7. 配音 → voice-wake-say / openai-tts
8. 字幕 → ai-subtitle-generator
9. BGM → music-cog
10. 剪映组装 → pyJianYingDraft
11. 发布 → social-media-publish
```

---

## 技能依赖

需要额外安装的依赖skill：
- cellcog（story-cog、image-cog、music-cog需要）

## 版本与评分

| 技能 | 版本 | 评分 |
|------|------|------|
| novel-generator | 1.0.0 | 0.953 |
| story-cog | 1.0.1 | 3.526 |
| short-drama-writer | 2.0.0 | 0.988 |
| video-script-generator | - | 3.518 |
| script-to-storyboard | - | 3.489 |
| music-cog | - | 0.986 |
| ai-subtitle-generator | 10.0.1 | 0.915 |
| image-cog | - | 1.203 |
| social-media-publish | - | 1.147 |