

## 2026-04-08 图片提示词能力建设（部分成功）

### 成功点
- 安装了Tavily搜索技能（免费），替代了不可用的搜索方式
- 创建了aigc-prompt-factory技能（v3.0，580行）
- 建立了三重触发保障机制
- 整合了8个权威来源的研究成果

### 失败点
1. **搜索工具配置问题**：没有先检查已安装的Tavily，而是尝试了多种失败方案，浪费10分钟
2. **编码兼容性问题**：Windows GBK与Python UTF-8不一致，Tavily脚本报错
3. **触发机制缺失**：技能创建时没有同步建立触发规则
4. **搜索引擎选择不当**：Bing中文搜索编码乱码，FLUX被f.lux干扰

### 改进方案
1. **先检查再行动**：执行任务前先检查已安装的工具
2. **编码workaround**：在MEMORY.md记录 `PYTHONIOENCODING=utf-8`
3. **技能创建同步**：创建技能时同步建立触发机制（SKILL.md+MEMORY.md+AGENTS.md）
4. **搜索前测试**：使用搜索前先快速测试可用性

---

## 2026-04-08 Gemini 图像生成实战（重大突破）

### 成功点
1. ✅ **API端点搞对**：`/v1/chat/completions`（不是 `/v1/images/generations`）
2. ✅ **模型确定**：`gemini-2.5-flash-image-preview`，约15秒/张
3. ✅ **图生图打通**：参考图base64 + 提示词 → 一口气生成
4. ✅ **游戏质感提示词**：UE5/游戏CG/不是摄影
5. ✅ **参考图压缩流程**：PIL压缩到<200KB再发API
6. ✅ **识图闭环**：5维度评分，总分38/50

### 失败点
1. **参考图错误**：用了之前生成的图而不是用户原图 → 角色相似度只有6/10
2. **提示词方向错误**：一开始用"hyper-realistic photography" → 生出电影风格而非游戏风格
3. **API模型测试浪费**：测了多个模型（flux-schnell等）但用户只要Gemini
4. **Git push失败**：网络问题导致多次改动未同步

### 改进方案
1. **参考图必须用用户原图**：每次检查文件时间戳，确认是用户刚发的
2. **游戏内容专用词汇表**：见`Gemini图像生成指南.md`
3. **先问再测**：不确定用什么模型时先问用户，不要乱测
4. **Git push重试机制**：失败后自动重试3次

### 核心知识点
- **提示词6要素**：Subject + Composition + Action + Location + Style + Editing
- **游戏 vs 摄影**：游戏用UE5/game CG/game screenshot，摄影用photorealistic/cinematic
- **角色一致性**：图生图 > 文字描述，参考图压缩到150-200KB最佳
