# LEARNINGS.md - 错误教训记录

## 记录规则
- 每次错误后立即记录
- 包含：错误现象、根因、解决方案

## 2026-04-08 QMD query/vsearch 修复（node-llama-cpp + Qwen3 兼容性问题）

### 问题
- `qmd query` 和 `qmd vsearch` 执行时均挂起
- 症状：在 "Expanding query..." 或 "Gathering information" 阶段无限等待，exit code 1
- 受影响模型：Qwen3-Reranker-0.6B-Q8_0（0.60 GB）+ qmd-query-expansion-1.7B-q4_k_m（1.19 GB）
- 未受影响模型：embeddinggemma-300M-Q8_0（0.31 GB）— GPU 加速正常，1秒完成
- 尝试过的 GPU 模式：vulkan（挂）、cuda（挂）、cpu（也挂）
- 根因：node-llama-cpp 3.18.1 与 Qwen3 架构 GGUF 模型推理不兼容（所有规模均挂，显存/CPU 均非根因）
- node-llama-cpp 最新版本 = 3.18.1，无更高版本可升级

### 解决方案（Patch 源码）

**文件路径**：`C:\Users\Administrator\.bun\install\cache\@tobilu\qmd@2.0.1@@registry.npmmirror.com@@@1\dist\store.js`

**Patch 1**：强制跳过 reranking（第 2752 行）
```javascript
// 修改前：
const skipRerank = options?.skipRerank ?? false;
// 修改后：
const skipRerank = options?.skipRerank ?? true; // Force skip reranking — Qwen3 model hangs during inference on this system
```

**Patch 2**：强制跳过 expansion（第 2766 行）
```javascript
// 修改前：
const hasStrongSignal = !intent && initialFts.length > 0
    && topScore >= STRONG_SIGNAL_MIN_SCORE
    && (topScore - secondScore) >= STRONG_SIGNAL_MIN_GAP;
// 修改后：
const hasStrongSignal = true; // Force skip expansion — Qwen3 generator model hangs during inference on this system
```

**Patch 3**：structuredSearch 的 skipRerank 默认值（第 3075 行）
```javascript
// 修改前：
const skipRerank = options?.skipRerank ?? false;
// 修改后：
const skipRerank = options?.skipRerank ?? true; // Force skip reranking — Qwen3 model hangs during inference on this system
```

### 效果
- `qmd query` → BM25 + 向量嵌入（GPU 1.5s）+ RRF 融合，**无需 generator/reranker**
- `qmd search` → 纯 BM25，**不受影响**
- 质量轻微下降（无 reranking 重排），速度大幅提升（1.5-2s vs 无限挂起）

### 注意事项
- Patch 位于 bun 缓存目录，`bun cache clean` 会清除，需重新应用
- wrapper 已切回 `NODE_LLAMA_CPP_GPU=vulkan`（embed 模型正常）
﻿
## 2026-04-08 QMD query/vsearch 修复（node-llama-cpp + Qwen3 兼容性问题）

### 问题
- qmd query 和 qmd vsearch 执行时均挂起，exit code 1
- 症状：在 "Expanding query..." 或 "Gathering information" 阶段无限等待
- 受影响模型：Qwen3-Reranker-0.6B（0.60 GB）+ qmd-query-expansion-1.7B（1.19 GB）
- 未受影响：embeddinggemma-300M（0.31 GB）— GPU 加速正常，1秒完成
- vulkan/cuda/cpu 全部挂，根因是 node-llama-cpp 3.18.1 与 Qwen3 GGUF 推理不兼容
- node-llama-cpp 最新版 = 3.18.1，无法升级

### 解决方案（Patch bun 缓存 store.js）

文件：C:\Users\Administrator\.bun\install\cache\@tobilu\qmd@2.0.1@@registry.npmmirror.com@@@1\dist\store.js

**Patch 1（第 2752 行）**：强制 skipRerank 默认 = true
`javascript
const skipRerank = options?.skipRerank ?? true;
`

**Patch 2（第 2766 行）**：强制 hasStrongSignal = true，跳过所有 expansion
`javascript
const hasStrongSignal = true;
`

**Patch 3（第 3075 行）**：structuredSearch 的 skipRerank 默认值
`javascript
const skipRerank = options?.skipRerank ?? true;
`

### 效果
- qmd query → BM25 + 向量嵌入（GPU 1.5s）+ RRF，无 generator/reranker
- 质量轻微下降（无 reranking），速度大幅提升（1.5-2s vs 无限挂起）
- Patch 位于 bun 缓存，un cache clean 后需重新应用
