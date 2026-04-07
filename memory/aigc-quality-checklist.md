# AIGC创作检查点脚本
> 用途：一键验证质量，确保每个阶段都达标
> 更新：2026-04-07

---

## 一、定版检查点（阶段1结束）

### 检查命令
```powershell
# 检查定版素材是否存在
$files = @(
  "人物三视图_正面.png",
  "人物三视图_侧面.png",
  "人物三视图_背面.png",
  "关键道具.png",
  "核心场景.png"
)
foreach ($f in $files) {
  if (Test-Path $f) { Write-Host "✅ $f" -ForegroundColor Green }
  else { Write-Host "❌ $f 不存在" -ForegroundColor Red }
}
```

### 检查清单
- [ ] 人物三视图已生成且满意
- [ ] 关键道具定版图已生成
- [ ] 核心场景定版图已生成
- [ ] 提示词包含7大模块
- [ ] 一致性锁定已写入

---

## 二、生成检查点（阶段2结束）

### 逐帧检查清单
- [ ] 五官无变形
- [ ] 手指无畸形/多指/缺指
- [ ] 服饰无跑偏
- [ ] 动作符合分镜设定
- [ ] 场景与定版一致
- [ ] 画面无闪烁/卡顿
- [ ] 无字幕/水印/Logo

### 质量评分标准
| 项目 | 权重 | 评分 |
|------|------|------|
| 人物一致性 | 30% | 1-10分 |
| 动作流畅度 | 25% | 1-10分 |
| 画质清晰度 | 20% | 1-10分 |
| 场景一致性 | 15% | 1-10分 |
| 整体氛围感 | 10% | 1-10分 |

**总分计算**：各项分数 × 权重，总分≥7分合格

---

## 三、合规检查点（阶段3结束）

### 检查清单
- [ ] 肖像权（人物脸/身体）
- [ ] 音乐版权
- [ ] 字体版权
- [ ] 违禁词检测
- [ ] 事实核查

### 违禁词检测命令
```powershell
# 检测常见违禁词
$违禁词 = @("绝对", "第一", "最好", "顶级", "完美", "保证", "一定")
$content = Get-Content "文案.txt" -Raw
foreach ($词 in $违禁词) {
  if ($content -match $词) {
    Write-Host "⚠️ 发现违禁词: $词" -ForegroundColor Yellow
  }
}
```

---

## 四、发布检查点（阶段4结束）

### 平台适配检查
- [ ] 标题字数符合平台要求
- [ ] 封面比例正确
- [ ] 标签数量合适
- [ ] 话题已添加

### 数据埋点检查
- [ ] 发布成功
- [ ] 播放量开始增长
- [ ] 互动数据正常

---

## 五、一键检查脚本

```powershell
# AIGC创作质量检查脚本
function Check-AIGCQuality {
  param(
    [string]$Stage = "all"
  )
  
  Write-Host "=== AIGC创作质量检查 ===" -ForegroundColor Cyan
  
  # 阶段1：定版检查
  if ($Stage -eq "1" -or $Stage -eq "all") {
    Write-Host "`n[阶段1] 定版素材检查" -ForegroundColor Yellow
    $checks = @(
      "人物三视图是否存在？",
      "关键道具是否存在？",
      "核心场景是否存在？",
      "提示词是否包含7大模块？",
      "一致性锁定是否写入？"
    )
    foreach ($c in $checks) {
      $answer = Read-Host "$c (y/n)"
      if ($answer -eq "y") { Write-Host "  ✅ 通过" -ForegroundColor Green }
      else { Write-Host "  ❌ 未通过" -ForegroundColor Red }
    }
  }
  
  # 阶段2：生成检查
  if ($Stage -eq "2" -or $Stage -eq "all") {
    Write-Host "`n[阶段2] 生成质量检查" -ForegroundColor Yellow
    $checks = @(
      "五官无变形？",
      "手指无畸形？",
      "服饰无跑偏？",
      "动作符合分镜？",
      "场景一致？",
      "画面无闪烁？",
      "无水印Logo？"
    )
    foreach ($c in $checks) {
      $answer = Read-Host "$c (y/n)"
      if ($answer -eq "y") { Write-Host "  ✅ 通过" -ForegroundColor Green }
      else { Write-Host "  ❌ 未通过" -ForegroundColor Red }
    }
  }
  
  # 阶段3：合规检查
  if ($Stage -eq "3" -or $Stage -eq "all") {
    Write-Host "`n[阶段3] 合规检查" -ForegroundColor Yellow
    $checks = @(
      "肖像权已确认？",
      "音乐版权已确认？",
      "字体版权已确认？",
      "违禁词已检测？",
      "事实已核查？"
    )
    foreach ($c in $checks) {
      $answer = Read-Host "$c (y/n)"
      if ($answer -eq "y") { Write-Host "  ✅ 通过" -ForegroundColor Green }
      else { Write-Host "  ❌ 未通过" -ForegroundColor Red }
    }
  }
  
  Write-Host "`n=== 检查完成 ===" -ForegroundColor Cyan
}

# 使用方法
# Check-AIGCQuality -Stage "1"  # 只检查阶段1
# Check-AIGCQuality -Stage "all"  # 检查所有阶段
```

---

## 标签
#AIGC #检查点 #质量把控 #自动化 #脚本
