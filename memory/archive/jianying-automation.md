# 剪映自动化技能

## 核心能力
通过Python直接生成剪映草稿文件，无需手动操作剪映界面。

## 已安装工具

| 工具 | 用途 |
|------|------|
| pyJianYingDraft | 生成剪映草稿文件 |
| ffmpeg-python | 视频处理 |
| pysrt | 字幕编辑 |

## 使用流程

### 1. 找到剪映草稿文件夹
```
剪映设置 → 草稿位置 → 查看路径
一般类似：C:\Users\xxx\AppData\Local\JianyingPro\User Data\Projects\com.lveditor.draft
```

### 2. 创建草稿
```python
import pyJianYingDraft as draft

# 连接草稿文件夹
draft_folder = draft.DraftFolder("草稿文件夹路径")

# 新建草稿
script = draft_folder.new_script("我的视频")
```

### 3. 添加视频素材
```python
# 创建视频片段
video = draft.VideoSegment(
    material_path="视频文件路径.mp4",
    target_timerange=draft.Timerange(0, 10*SEC),  # 0-10秒
)

# 添加到轨道
script.add_segment(video)
```

### 4. 添加文本/字幕
```python
text = draft.TextSegment(
    content="字幕内容",
    target_timerange=draft.Timerange(0, 5*SEC),
    style=draft.TextStyle(
        font_size=60,
        color="#FFFFFF",
    )
)
script.add_segment(text)
```

### 5. 添加音频
```python
audio = draft.AudioSegment(
    material_path="音频文件.mp3",
    target_timerange=draft.Timerange(0, 10*SEC),
)
script.add_segment(audio)
```

### 6. 添加转场/特效
```python
# 添加转场
video.transition = draft.TransitionType.fade  # 淡入淡出

# 添加滤镜
video.filter = draft.FilterType.some_filter

# 添加动画
video.animation = draft.GroupAnimationType.fade_in
```

### 7. 保存草稿
```python
script.save()
```

### 8. 自动导出（需剪映运行）
```python
controller = draft.JianyingController()
controller.export_draft("我的视频", output_path="导出路径.mp4")
```

## 完整示例

```python
import pyJianYingDraft as draft
from pyJianYingDraft import SEC, trange

# 1. 连接草稿文件夹
draft_folder = draft.DraftFolder(r"C:\Users\Administrator\AppData\Local\JianyingPro\User Data\Projects\com.lveditor.draft")

# 2. 新建草稿
script = draft_folder.new_script("自动化测试")

# 3. 添加视频
video = draft.VideoSegment(
    material_path=r"C:\Videos\clip1.mp4",
    target_timerange=draft.Timerange(0, 15*SEC),
)
video.animation = draft.GroupAnimationType.fade_in
script.add_segment(video)

# 4. 添加字幕
text = draft.TextSegment(
    content="这是自动生成的字幕",
    target_timerange=draft.Timerange(2*SEC, 8*SEC),
)
script.add_segment(text)

# 5. 添加背景音乐
audio = draft.AudioSegment(
    material_path=r"C:\Music\bgm.mp3",
    target_timerange=draft.Timerange(0, 15*SEC),
)
# 音量淡入淡出
audio.fade_in_duration = 1*SEC
audio.fade_out_duration = 2*SEC
script.add_segment(audio)

# 6. 保存
script.save()
print("草稿已生成，请打开剪映查看")
```

## 进阶功能

### 素材截取与变速
```python
video = draft.VideoSegment(
    material_path="video.mp4",
    target_timerange=draft.Timerange(0, 10*SEC),  # 时间轴位置
    source_timerange=draft.Timerange(5*SEC, 20*SEC),  # 截取素材5-20秒
    speed=1.5,  # 1.5倍速
)
```

### 关键帧动画
```python
# 位置关键帧
video.keyframe_property = draft.KeyframeProperty.position
video.keyframes = [
    (0, (0, 0)),
    (5*SEC, (100, 50)),
    (10*SEC, (0, 0)),
]
```

### 滤镜和特效
```python
# 添加滤镜
video.filter = draft.FilterType.some_filter

# 添加片段特效
video.effect = draft.VideoSceneEffectType.some_effect

# 添加转场
video.transition = draft.TransitionType.fade
video.transition_duration = 0.5*SEC
```

### 文本高级样式
```python
text = draft.TextSegment(
    content="花字效果",
    target_timerange=draft.Timerange(0, 5*SEC),
    font_type=draft.FontType.some_font,
    text_style=draft.TextStyle(
        font_size=80,
        color="#FF0000",
        stroke_color="#000000",
        stroke_width=2,
    ),
    # 花字效果
    effect_id="some_effect_id",
)
```

### 导入SRT字幕
```python
import pysrt

subs = pysrt.open("字幕.srt")
for sub in subs:
    text = draft.TextSegment(
        content=sub.text,
        target_timerange=draft.Timerange(
            sub.start.ordinal / 1000,
            sub.end.ordinal / 1000
        ),
    )
    script.add_segment(text)
```

## 模板模式（批量生产）

```python
# 加载已有草稿作为模板
template = draft_folder.load_script("模板草稿")

# 复制为新草稿
new_script = draft_folder.duplicate_as_template("模板草稿", "新视频")

# 替换素材
new_script.replace_material_by_name("原素材名", "新素材路径.mp4")

# 替换文本
new_script.replace_text_content("原文本", "新文本")

new_script.save()
```

## 字幕生成（pysrt）

```python
import pysrt

# 读取srt文件
subs = pysrt.open("字幕.srt")

# 修改
subs[0].text = "修改后的字幕"

# 保存
subs.save("新字幕.srt")

# 导入到剪映草稿
for sub in subs:
    text = draft.TextSegment(
        content=sub.text,
        target_timerange=draft.Timerange(
            sub.start.ordinal / 1000,
            sub.end.ordinal / 1000
        ),
    )
    script.add_segment(text)
```

## 视频处理（ffmpeg-python）

```python
import ffmpeg

# 提取音频
ffmpeg.input("video.mp4").output("audio.mp3", acodec="mp3").run()

# 裁剪视频
ffmpeg.input("video.mp4").trim(start=0, duration=10).output("clip.mp4").run()

# 合并视频
ffmpeg.concat([ffmpeg.input("1.mp4"), ffmpeg.input("2.mp4")]).output("merged.mp4").run()
```

## 重要限制

1. **剪映版本限制**：
   - 草稿生成：支持剪映5+所有版本
   - 模板模式：仅支持剪映5.9及以下（6+加密了草稿文件）
   - 自动导出：仅支持剪映6及以下（7+隐藏了控件）

2. **自动导出前提**：
   - 剪映客户端必须正在运行
   - 需要有导出权限（非VIP可能有限制）

3. **素材要求**：
   - 视频格式：mp4, mov, avi等
   - 音频格式：mp3, wav等
   - 图片格式：jpg, png等

## 配合AI视频流水线

```
1. seedance-shot-design → 生成分镜提示词
2. jimeng-image-gen → 生成分镜图
3. seedance-video-generation → 生成视频片段
4. pysrt → 生成字幕
5. pyJianYingDraft → 组装剪映草稿
6. JianyingController → 自动导出成片
```

## 参考文档
- pyJianYingDraft: https://github.com/GuanYixuan/pyJianYingDraft
- pysrt: https://github.com/byroot/pysrt
- ffmpeg-python: https://github.com/kkroening/ffmpeg-python
