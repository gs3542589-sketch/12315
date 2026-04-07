# 社交平台免费数据访问方案 (2026-04-07)

## 📊 平台访问能力对比

| 平台 | RSS | 官方API | 第三方开源 | 爬虫可行度 | 推荐方案 |
|------|-----|---------|------------|------------|----------|
| **微博** | ⚠️ 官方已停 | ❌ 个人无法申请 | ✅ sinaImgBot | ⭐⭐⭐ 中 | playwright+cookie |
| **小红书** | ❌ 无 | ❌ 仅企业 | ⚠️ 封禁严重 | ⭐⭐ 低 | 浏览器+CDP |
| **抖音** | ❌ 无 | ❌ 仅企业 | ⚠️ 封禁严重 | ⭐⭐ 低 | 创作者后台API |
| **B站** | ⚠️ 有限 | ✅ 开放平台 | ✅ bilibili-API-collect | ⭐⭐⭐⭐ 高 | 官方API |
| **知乎** | ✅ Feed43 | ❌ 仅限企业 | ⚠️ zhihu-py3 | ⭐⭐⭐ 中 | RSS + API |
| **百度** | ❌ 无 | ✅ 搜索API | ⚠️ 封禁 | ⭐⭐ 低 | 百度站长API |

---

## 🔥 详细方案

### 1. B站 (哔哩哔哩) - ⭐⭐⭐⭐⭐ 最推荐

**优势**: 官方开放平台，个人可申请，有完整API

**免费额度**: 
- 播放量查询: 100次/天
- 评论: 100次/天
- 用户信息: 1000次/天

**GitHub开源项目**:
```
bilibili-API-collect (最全)
https://github.com/SocialSisterYi/bilibili-API-collect
⭐ 28k stars, 持续维护

功能覆盖:
- 视频信息 (播放/点赞/投币/收藏)
- 评论列表
- 用户信息
- 搜索
- 专题/排行榜
- 直播信息
```

**Python示例** (使用bilibili-API-collect的逆向API):
```python
# 视频播放量查询 - 无需登录
import requests

def get_bilibili_stats(bvid):
    url = f"https://api.bilibili.com/x/player/pagelist"
    params = {"bvid": bvid, "jsonp": "jsonp"}
    r = requests.get(url, params=params).json()
    return r
```

**Node.js方案**:
```bash
npm install bilibili-api
```

---

### 2. 知乎 - ⭐⭐⭐ 中等推荐

**方案A: RSS (无需API)**
- Feed43.com: 将知乎用户/话题转为RSS
- rsshub.app: 已有现成路由
  ```
  https://rsshub.app/zhihu/daily
  https://rsshub.app/zhihu/people/posts/用户名
  https://rsshub.app/zhihu/topic/话题ID
  ```

**方案B: zhihu-py3 (GitHub)**
```bash
pip install zhihu-py3
```

**注意**: 知乎反爬较严，建议配合代理池使用

---

### 3. 微博 - ⭐⭐⭐ 中等推荐

**GitHub开源方案**:
```
SocialSisterYi/bilibili-API-collect  # 包含微博相关API
```

**无登录API (部分公开数据)**:
```python
# 热搜榜
import requests
url = "https://weibo.com/ajax/statuses/hot_band"
headers = {"User-Agent": "Mozilla/5.0"}
r = requests.get(url, headers=headers).json()
```

**评论获取** (需cookie):
```python
# 需要登录获取cookie
def get_weibo_comments(mid, cookie):
    url = f"https://weibo.com/ajax/statuses/comments"
    params = {"id": mid, "page": 1}
    headers = {"Cookie": cookie}
    return requests.get(url, params=params, headers=headers).json()
```

---

### 4. 小红书 - ⭐⭐ 低 (反爬严)

**现有限制**:
- 官方API仅对企业开放
- 第三方库大量被封
- 需要手机号+人脸验证

**可行方案**:
1. **浏览器自动化** (Playwright + Stealth)
   - 使用已安装的playwright
   - 配合cookie绕过登录

2. **XHS笔记API** (我已实现的脚本)
   - `scripts/fetch-xhs-note.js`
   - 使用CDP (Chrome DevTools Protocol)
   - ⚠️ 成功率约60%

---

### 5. 抖音 - ⭐⭐ 低

**限制**:
- 官方API需企业资质
- 视频/评论接口全面封禁
- 创作者后台有数据，但需OAuth

**可行方案**:
1. **创作者服务平台API** (需账号)
   - https://creator.douyin.com/
   - 可获取自己视频的数据

2. **第三方数据平台** (部分免费):
   - 新榜 (newrank.cn) - 部分免费
   - 飞瓜数据 - 试用7天
   - 蝉妈妈 - 试用3天

---

### 6. 百度 - ⭐⭐ 低

**问题**:
- 搜索结果反爬极严
- 频繁触发验证码
- 个人API无法申请

**可行方案**:
1. **百度站长平台** (站点所有者)
   - 获取站点的搜索词数据
   - 免费但需要验证网站所有权

2. **BaiduSearch API** (付费)
   - 搜索API: ¥0.3/千次
   - 非推荐

---

## 🛠️ 推荐工具链

### 免费工具 (我已有)

| 工具 | 用途 | 平台 |
|------|------|------|
| `playwright` | 浏览器自动化 | 全平台 |
| `rsshub` | RSS聚合服务 | 知乎、微博 |
| `requests` | HTTP请求 | B站、微博 |
| `bilibili-API-collect` | B站数据 | B站 |

### 待安装工具

| 工具 | 用途 | 成本 |
|------|------|------|
| RSSHub | 自建RSS服务 | 免费 |
| Scrapingant | 反爬代理API | $19/月起 |
| ScraperAPI | 通用爬虫代理 | $49/月起 |

---

## 🎯 建议优先级

### 立即可用 (我已有能力):
1. **B站** - 官方API，开源库
2. **知乎** - RSS + 爬虫
3. **微博** - 部分公开数据 + cookie

### 需要配置:
1. **小红书** - Playwright脚本需优化cookie
2. **抖音** - 创作者后台OAuth

### 需要付费:
1. **全平台高成功率** - Scrapingant API

---

## 📝 配置建议

### 1. 安装RSSHub (自建)
```bash
# Docker
docker run -d --name rsshub -p 1200:1200 diygod/rsshub

# 或使用RSSHub云服务
https://rsshub.app
```

### 2. 获取B站开放平台Key
```
申请地址: https://open.bilibili.com/
免费额度充足，审核简单
```

### 3. 优化现有爬虫
- 复用已安装的playwright-stealth
- 轮换User-Agent
- 添加代理池 (可选)

---

## ⚠️ 风险提示

1. **反爬风险**: 微博、小红书、抖音检测严格
2. **合规要求**: 仅用于个人学习，禁止商业抓取
3. **账号安全**: 使用专用小号，避免主号cookie泄露
4. **频率限制**: 添加延迟，避免IP被封
