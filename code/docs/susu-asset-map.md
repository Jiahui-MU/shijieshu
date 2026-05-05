# SUSU / World Tree 素材槽位与章节映射

当前原则：

- 先不删除旧的 Shopify 复刻结构，保留为 fallback。
- 页面当前优先读取 `components/shopify-winter2026/world-tree-content.ts`。
- 动效素材未恢复前，只定义槽位、章节关系和接入规则，不硬凑最终画面。
- 后续拿到 Lovart 恢复素材后，按本表逐个替换占位。

## 章节映射

| 页面位置 | 当前章节 | 对应原站交互壳 | 你的内容用途 | 当前状态 |
| --- | --- | --- | --- | --- |
| 首屏 Hero | The World Tree | 原站首屏长滚动溶解动效 | SUSU 跑球、出现、重建隧道、钻进隧道、房间恢复 | 等分层素材 |
| 首屏下方小框 | World Tree / I | 原站首图下方小视频框 | SUSU 在隧道里奔跑，世界树远景和近景切换 | 文字占位已放 |
| 世界观介绍 | World Tree / I | 原站 Sidekick 文本区 | “There are two worlds” 和 World Tree anchor | 文字已放 |
| SUSU 章节开场 | SUSU / II | 原站章节转场动效 | SUSU 出生、落叶、纸箱、跨越世界 | 等素材 |
| SUSU 长文 | SUSU Story / III | 原站可放长文的浅色内容区 | SUSU's Perspective 原文，不强拆 | 文字已放 |
| 姐姐视觉动效 | Her Vision / IV | 原站 Mini Mac 这类长滚动互动区 | 姐姐故事的视频和照片序列 | 等素材 |
| 姐姐长文 | Her Story / V | 原站可放长文的浅色内容区 | Her Perspective 原文，不强拆 | 文字已放 |
| 守护者开场 | Guardians / VI | 原站章节转场动效 | 十只守护者围绕世界树出现 | 等素材 |
| 守护者资料 | The Ten / VII | 原站卡片/产品更新区 | 十个守护者和晶石信息卡 | 文字已放 |
| 结尾 | Crystals / VIII | 原站收束区 | 从情绪世界回到水晶产品 | 文字已放 |

## 素材槽位

| Slot ID | 章节 | 需要的素材 | 推荐格式 | 作用 |
| --- | --- | --- | --- | --- |
| `hero-room-clean` | Hero | 房间初始背景 | 16:9 或更宽 still/video | 首屏第一层 |
| `hero-susu-ball` | Hero | SUSU 跑球前景层 | 透明 PNG 序列 / ProRes 4444 / WebM alpha | 可独立滚动和溶解 |
| `hero-tunnel-build` | Hero | 隧道生成层 | 透明 PNG 层 / alpha video | 首屏转场核心 |
| `hero-room-restored` | Hero | 房间恢复后的状态 | still/video，机位尽量匹配初始背景 | 首屏结束状态 |
| `worldtree-small-video-tunnel-run` | World Tree | SUSU 隧道奔跑 | MP4/WebM 短循环 | 首图下方小视频框第一段 |
| `worldtree-small-video-far` | World Tree | 世界树远景 | MP4/WebM 或 still | 小视频框第二段 |
| `worldtree-small-video-close` | World Tree | 世界树近景/树根/晶石/叶子 | MP4/WebM 或 still | 小视频框第三段 |
| `susu-chapter-transition` | SUSU | SUSU 章节开场动效 | 分层图 / PNG 序列 / scroll-scrub video | SUSU 长文前的沉浸过渡 |
| `susu-article-illustrations` | SUSU Story | Lore、落叶、纸箱、灰转金等插图 | JPG/PNG | 长文中间穿插 |
| `sister-minimac-sequence` | Her Vision | 姐姐故事视频/照片序列 | MP4/WebM scroll-scrub 或 10fps 序列 | 对应 Mini Mac 长交互板块 |
| `sister-article-illustrations` | Her Story | 哭泣夜晚、旁观、晶石入手等插图 | JPG/PNG | 姐姐长文穿插 |
| `guardians-transition` | Guardians | 守护者集体出现 | 分层图 / PNG 序列 / 短循环 | 守护者章节开场 |
| `guardian-card-portraits` | The Ten | 每只猫和对应晶石 | 透明 PNG 优先，1:1 或 4:5 | 卡片系统 |
| `crystals-closing` | Crystals | 晶石产品/情绪能量收束图 | still/video | 结尾从故事转向产品 |

## 文件命名建议

建议后续素材按这个结构放：

```text
public/assets/world-tree/
  hero/
    hero-room-clean.*
    hero-susu-ball-0001.png
    hero-tunnel-build.*
    hero-room-restored.*
  world-tree/
    tunnel-run.*
    tree-far.*
    tree-close.*
  susu-story/
    lore-root.*
    falling-leaf.*
    cardboard-box.*
    grey-to-gold.*
  her-story/
    crying-night.*
    invisible-witness.*
    crystals-in-hand.*
  guardians/
    group-transition.*
    susu.*
    oren.*
    vera.*
    aldric.*
    pip.*
    cael.*
    mira.*
    frost.*
    ashen.*
    lore.*
  crystals/
    closing.*
```

## 接入规则

- 首屏和章节转场优先用分层素材，不要把所有内容烘焙成一张图。
- 需要和滚动精确绑定的段落，优先考虑 scroll-scrub video 或 10fps 以上图片序列。
- 只是文章中间的插图，用 JPG/PNG 就够，不需要做成视频。
- 透明前景层优先交付 PNG 序列、ProRes 4444 或 WebM alpha。
- 所有图像不要自带文字，页面文字由代码渲染，后面方便调版。
- 每个素材先放低清也可以，但比例、分层关系要对，最终再替换高清。

## 当前代码入口

- 主内容源：`components/shopify-winter2026/world-tree-content.ts`
- 页面壳：`components/shopify-winter2026/shopify-winter2026-page.tsx`
- 样式：`components/shopify-winter2026/shopify-winter2026.module.css`

