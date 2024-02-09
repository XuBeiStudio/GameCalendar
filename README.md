# 游历年轴 `GamingEpochs`

[by 序碑工作室 Refillsoft](https://github.com/XuBeiStudio)

本项目是用于展示与订阅各平台游戏的发售时间以及日程更新，也可以用于查看近期发售的游戏详情如`发行商`、`开发商`、`会员免费信息`等。

## 本项目的参与者

- 维护者： [liziyi0914](https://github.com/liziyi0914) [Definer_Sy](https://github.com/DefinerSy)
- 贡献者： [liziyi0914](https://github.com/liziyi0914) [Definer_Sy](https://github.com/DefinerSy)

注：名单不分排名，不定期补充更新

# 项目基本信息

## 数据格式
游戏信息 data/data.json
```typescript
// 发行平台
export type PlatformType =
  | 'Steam'
  | 'Epic'
  | 'Xbox'
  | 'Switch'
  | 'PlayStation'
  | 'Android'
  | 'Apple';

// 会员免费类型
export type FreeType = 'XGP' | 'PSPlus';

// 徽章类型
export type BadgeTypes =
  | 'store.steam'
  | 'store.epic'
  | 'video.bilibili'
  | 'video.youtube'
  | 'music.spotify.playlist'
  | 'music.spotify.track';

// 游戏信息
export type GameDataType = {
  // 游戏 ID
  id?: string;
  // 卡片标题
  title?: string;
  // 卡片副标题（最多两项）
  subtitle?: string[];
  // 游戏名称
  name?: {
    // 语言（zh_CN、en_US、ja_JP等）
    lang: string;
    // 游戏名称
    content: string;
  }[];
  // 发行日期
  releaseDate?: string;
  // 发行平台
  platforms?: PlatformType[];
  // 背景图URL
  bg?: string;
  // Logo URL
  logo?: string;
  // 卡片左侧颜色（CSS颜色）
  leftColor?: string;
  // 卡片右侧颜色（CSS颜色）
  rightColor?: string;
  // 卡片背景颜色（CSS颜色）
  bgColor?: string;
  // 会员免费
  free?: FreeType[];
  // 徽章
  badges?: {
    // 徽章类型
    type: BadgeTypes;
    // 值
    value: string;
  }[];
  // 开发商
  developer?: {
    name: string;
  }[];
  // 发行商
  publisher?: {
    name: string;
  }[];
  // 游戏简介（Markdown格式）
  markdown?: string;
};
```

| 徽章 | 类型 | 值 |
| - | - | - |
| store.steam | Steam商城中的游戏id | - |
| store.epic| Epic商城中的游戏id | - |
| video.bilibili | 哔哩哔哩av号/BV号 | - |
| video.youtube | Youtube视频id | - |
| music.spotify.playlist | Spotify专辑id | - |
| music.spotify.track | Spotify歌曲id | - |


# 开发构建
```bash
# 下载游戏图像资源、构建数据
java -jar ./GameCalendarVerifier-1.0-SNAPSHOT-all.jar noCheckOnly


cd font_builder
# 安装依赖
yarn
# 构建字体
node ./build_fonts.js
cd ..


# 安装依赖
yarn


# 构建日历
node ./build_ics.js


# 启动开发服务器
yarn dev
```

TODO
- [ ] 页面切换动效
- [ ] 游戏详情页，增加组件类型
- [ ] 游戏详情页，优化Markdown适配
- [ ] 爬虫，爬取Steam等网站游戏信息
- [x] Safari适配，列表排序
- [ ] 接入WebPush，推送消息
- [ ] games.json按月分包
- [ ] 优化侧边导航栏
