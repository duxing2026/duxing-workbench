/**
 * 独行工作台 - SVG 图标库
 * 内联 SVG，避免依赖外部字体显示 emoji
 * 所有图标采用 24x24 视图，使用 currentColor 继承颜色
 */

const ICONS = {
  // 每日计划 - 笔记本图标
  plan: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2"/>
    <line x1="8" y1="8" x2="16" y2="8"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="8" y1="16" x2="13" y2="16"/>
    <path d="M4 8 L8 8 M4 14 L8 14" stroke-width="2.5"/>
  </svg>`,

  // 新闻 - 电视图标
  news: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="5" width="20" height="13" rx="2"/>
    <path d="M8 21 L16 21"/>
    <path d="M12 18 L12 21"/>
    <path d="M7 9 L10 12 L13 9 L17 13" stroke-width="1.5"/>
  </svg>`,

  // 时政常识 - 书本图标
  book: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4 L11 4 Q12 4 12 5 L12 20 Q12 19 11 19 L4 19 Z"/>
    <path d="M20 4 L13 4 Q12 4 12 5 L12 20 Q12 19 13 19 L20 19 Z"/>
    <line x1="6" y1="8" x2="9" y2="8"/>
    <line x1="6" y1="11" x2="9" y2="11"/>
    <line x1="15" y1="8" x2="18" y2="8"/>
    <line x1="15" y1="11" x2="18" y2="11"/>
  </svg>`,

  // 申论素材 - 钢笔图标
  pen: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 19 L7 22 L7 17 L17 7 L22 12 Z" fill="currentColor" fill-opacity="0.15"/>
    <line x1="14" y1="9" x2="20" y2="15"/>
    <path d="M4 19 L6 21 L8 19" stroke-width="1.5"/>
  </svg>`,

  // 公考必背 - 公式/计算器图标
  formula: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2"/>
    <text x="12" y="10" text-anchor="middle" font-size="8" fill="currentColor" stroke="none" font-weight="bold">∑</text>
    <line x1="7" y1="13" x2="17" y2="13"/>
    <line x1="7" y1="17" x2="11" y2="17"/>
    <line x1="13" y1="17" x2="17" y2="17"/>
  </svg>`,

  // 成语背诵 - 靶心图标
  target: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    <line x1="12" y1="3" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="21"/>
    <line x1="3" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="21" y2="12"/>
  </svg>`,

  // 高频成语 - 书签/字典图标
  highidiom: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 3 L18 3 L18 21 L12 17 L6 21 Z" fill="currentColor" fill-opacity="0.12"/>
    <line x1="9" y1="8" x2="15" y2="8"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="12" y2="16"/>
  </svg>`,

  // 英语 - 地球图标
  globe: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <ellipse cx="12" cy="12" rx="4" ry="9"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <path d="M5 7 Q12 9 19 7" stroke-width="1.5"/>
    <path d="M5 17 Q12 15 19 17" stroke-width="1.5"/>
  </svg>`,

  // 阅读 - 书本图标
  reading: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 5 L11 4 L11 20 L3 19 Z"/>
    <path d="M21 5 L13 4 L13 20 L21 19 Z"/>
    <line x1="6" y1="9" x2="9" y2="9"/>
    <line x1="6" y1="13" x2="9" y2="13"/>
    <line x1="15" y1="9" x2="18" y2="9"/>
    <line x1="15" y1="13" x2="18" y2="13"/>
  </svg>`,

  // 锻炼 - 哑铃图标
  dumbbell: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="12" x2="3" y2="12" stroke-width="3"/>
    <rect x="2" y="8" width="3" height="8" rx="1" fill="currentColor" fill-opacity="0.15"/>
    <rect x="5" y="10" width="3" height="4" rx="1" fill="currentColor" fill-opacity="0.15"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <rect x="16" y="10" width="3" height="4" rx="1" fill="currentColor" fill-opacity="0.15"/>
    <rect x="19" y="8" width="3" height="8" rx="1" fill="currentColor" fill-opacity="0.15"/>
  </svg>`,

  // 火焰 - 连续打卡
  flame: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2 C12 6 8 7 8 11 C8 14 9 16 12 18 C15 16 16 14 16 11 C16 9 15 8 14 8 C14 9 13 10 13 10 C13 7 12 5 12 2 Z"/>
  </svg>`,

  // 火焰（别名 fire）
  fire: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2 C12 6 8 7 8 11 C8 14 9 16 12 18 C15 16 16 14 16 11 C16 9 15 8 14 8 C14 9 13 10 13 10 C13 7 12 5 12 2 Z"/>
  </svg>`,

  // 时钟 - 计时
  clock: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="12 7 12 12 16 14"/>
  </svg>`,

  // 播放/开始
  play: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M8 5 L19 12 L8 19 Z"/>
  </svg>`,

  // 柱状图 - 数据统计
  barChart: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="12" width="4" height="8" rx="0.5" fill="currentColor" fill-opacity="0.15"/>
    <rect x="10" y="8" width="4" height="12" rx="0.5" fill="currentColor" fill-opacity="0.15"/>
    <rect x="16" y="5" width="4" height="15" rx="0.5" fill="currentColor" fill-opacity="0.15"/>
    <line x1="3" y1="20" x2="21" y2="20"/>
  </svg>`,

  // 重置 - 刷新图标
  refresh: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 12 A9 9 0 0 1 18 5 L21 8 M21 3 L21 8 L16 8"/>
    <path d="M21 12 A9 9 0 0 1 6 19 L3 16 M3 21 L3 16 L8 16"/>
  </svg>`,

  // 添加 +
  plus: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>`,

  // 删除 ×
  close: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <line x1="6" y1="6" x2="18" y2="18"/>
    <line x1="6" y1="18" x2="18" y2="6"/>
  </svg>`,

  // 星标 - 已收藏
  star: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z"/>
  </svg>`,

  // 星标 - 未收藏
  starOutline: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z"/>
  </svg>`,

  // 箭头 - 向下
  arrowDown: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>`,

  // 箭头 - 左右
  arrowLeft: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`,

  // 笑脸 - 庆祝
  celebration: `<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 14 Q12 18 16 14"/>
    <circle cx="9" cy="10" r="0.5" fill="currentColor"/>
    <circle cx="15" cy="10" r="0.5" fill="currentColor"/>
  </svg>`,

  // 搜索
  search: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="7"/>
    <line x1="20" y1="20" x2="16" y2="16"/>
  </svg>`,

  // 笔记图标
  note: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 3 L21 3 L21 10"/>
    <path d="M14 3 L21 10 L8 23 L1 23 L1 16 Z"/>
    <line x1="5" y1="13" x2="9" y2="17"/>
  </svg>`,

  // 选中图标
  check: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="5 12 10 17 19 7"/>
  </svg>`,

  // 外链图标
  externalLink: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 4 L20 4 L20 10"/>
    <line x1="20" y1="4" x2="11" y2="13"/>
    <path d="M19 14 L19 19 L5 19 L5 5 L10 5"/>
  </svg>`,

  // 笔记/写字
  write: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 20 L4 20 L4 4 L11 4"/>
    <path d="M18 5 L20 7 L11 16 L9 16 L9 14 L18 5 Z" fill="currentColor" fill-opacity="0.15"/>
  </svg>`,

  // 派对/庆祝
  party: `<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5.8 11.3 L2 22 L12.7 18.2 L11.5 12.5 Z" fill="currentColor" fill-opacity="0.1"/>
    <path d="M4 4 L7 7"/>
    <path d="M9 3 L10 6"/>
    <path d="M3 9 L6 10"/>
    <circle cx="17" cy="7" r="2" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="19" cy="13" r="1.5" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="14" cy="15" r="1" fill="currentColor" fill-opacity="0.2"/>
  </svg>`,

  // 完成奖杯
  trophy: `<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 4 L17 4 L17 10 Q17 14 12 14 Q7 14 7 10 Z" fill="currentColor" fill-opacity="0.1"/>
    <path d="M7 6 L4 6 L4 9 Q4 11 7 11"/>
    <path d="M17 6 L20 6 L20 9 Q20 11 17 11"/>
    <path d="M9 14 L9 17 L15 17 L15 14"/>
    <line x1="7" y1="20" x2="17" y2="20"/>
    <line x1="12" y1="17" x2="12" y2="20"/>
  </svg>`,

  // 对勾圆圈
  checkCircle: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="8 12 11 15 16 9"/>
  </svg>`,

  // 圆圈（未完成）
  circle: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="9"/>
  </svg>`,

  // 指南针（信息练习）
  compass: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7 L14 12 L12 17 L10 12 Z" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
  </svg>`,

  // 心形
  heart: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" fill-opacity="0.85">
    <path d="M12 21 C7 17 3 13 3 9 C3 6 5 4 8 4 C10 4 11 5 12 7 C13 5 14 4 16 4 C19 4 21 6 21 9 C21 13 17 17 12 21 Z"/>
  </svg>`,

  // 健身/锻炼（抽象人形）
  workout: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="4" r="2.2" fill="currentColor" fill-opacity="0.25"/>
    <line x1="12" y1="6.5" x2="12" y2="14"/>
    <line x1="12" y1="9" x2="8" y2="11"/>
    <line x1="12" y1="9" x2="16" y2="11"/>
    <line x1="12" y1="14" x2="9" y2="21"/>
    <line x1="12" y1="14" x2="15" y2="21"/>
  </svg>`,

  // 胸部图标
  chest: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 10 Q5 7 8 7 Q10 7 12 9 Q14 7 16 7 Q19 7 19 10 Q19 13 12 18 Q5 13 5 10 Z" fill="currentColor" fill-opacity="0.2"/>
  </svg>`,

  // 背部图标
  back: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 4 L8 9 L6 13 L9 21 L11 21 L11 14 L13 14 L13 21 L15 21 L18 13 L16 9 L16 4" fill="currentColor" fill-opacity="0.18"/>
  </svg>`,

  // 腿部图标
  leg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="9" y1="3" x2="9" y2="13"/>
    <line x1="15" y1="3" x2="15" y2="13"/>
    <circle cx="9" cy="5" r="2" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="15" cy="5" r="2" fill="currentColor" fill-opacity="0.2"/>
    <line x1="9" y1="13" x2="8" y2="21"/>
    <line x1="15" y1="13" x2="16" y2="21"/>
  </svg>`,

  // 肩部图标
  shoulder: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="6" r="3" fill="currentColor" fill-opacity="0.2"/>
    <path d="M6 13 Q9 9 12 9 Q15 9 18 13 L17 19 Q12 21 7 19 Z" fill="currentColor" fill-opacity="0.15"/>
  </svg>`,

  // 手臂图标
  arm: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="17" cy="5" r="2.5" fill="currentColor" fill-opacity="0.25"/>
    <path d="M15 7 L11 11 L13 14 L9 18 L7 16 L11 12 L9 9 L13 5 Z" fill="currentColor" fill-opacity="0.2"/>
  </svg>`,

  // 核心（腹部）图标
  core: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="7" y="5" width="10" height="14" rx="3" fill="currentColor" fill-opacity="0.18"/>
    <line x1="9" y1="10" x2="15" y2="10"/>
    <line x1="9" y1="14" x2="15" y2="14"/>
    <line x1="12" y1="5" x2="12" y2="19"/>
  </svg>`,

  // 臀部图标
  hip: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="14" r="4" fill="currentColor" fill-opacity="0.22"/>
    <circle cx="16" cy="14" r="4" fill="currentColor" fill-opacity="0.22"/>
    <line x1="8" y1="5" x2="16" y2="5"/>
    <line x1="9" y1="18" x2="9" y2="21"/>
    <line x1="15" y1="18" x2="15" y2="21"/>
  </svg>`,

  // 全身图标
  full: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="4" r="2.2" fill="currentColor" fill-opacity="0.25"/>
    <line x1="12" y1="6.5" x2="12" y2="15"/>
    <line x1="12" y1="9" x2="6" y2="11"/>
    <line x1="12" y1="9" x2="18" y2="11"/>
    <line x1="12" y1="15" x2="7" y2="22"/>
    <line x1="12" y1="15" x2="17" y2="22"/>
  </svg>`,

  // 有氧图标
  cardio: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 12 L5 12 L7 8 L10 16 L13 9 L16 14 L19 12 L22 12" fill="currentColor" fill-opacity="0.15"/>
  </svg>`,

  // 团队/合影
  team: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="8" r="3" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="17" cy="9" r="2.5" fill="currentColor" fill-opacity="0.2"/>
    <path d="M3 19 Q3 14 9 14 Q15 14 15 19"/>
    <path d="M15 19 Q15 16 17 16 Q21 16 21 19"/>
  </svg>`,

  // 日历
  calendar: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="8" y1="3" x2="8" y2="7"/>
    <line x1="16" y1="3" x2="16" y2="7"/>
    <circle cx="8" cy="14" r="0.8" fill="currentColor"/>
    <circle cx="12" cy="14" r="0.8" fill="currentColor"/>
    <circle cx="16" cy="14" r="0.8" fill="currentColor"/>
  </svg>`,

  // 数据库/存储
  database: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" fill="currentColor" fill-opacity="0.15"/>
    <path d="M3 5 L3 12 Q3 15 12 15 Q21 15 21 12 L21 5"/>
    <path d="M3 12 L3 19 Q3 22 12 22 Q21 22 21 19 L21 12"/>
  </svg>`,

  // 面试专区 - 对话气泡 + 人物剪影
  interview: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="6" r="2.5" fill="currentColor" fill-opacity="0.15"/>
    <path d="M7 14 Q7 10 12 10 Q17 10 17 14 L17 15.5 L7 15.5 Z" fill="currentColor" fill-opacity="0.1"/>
    <path d="M3 3 L3 8 L5 8 L5 10 L7 8 L10 8" stroke-width="1.5" opacity="0.6"/>
    <path d="M21 9 L21 14 L19 14 L19 16 L17 14 L14 14" stroke-width="1.5" opacity="0.6"/>
  </svg>`,
};

// 获取图标的辅助函数
function getIcon(name) {
  return ICONS[name] || '';
}

// 导出到全局
if (typeof window !== 'undefined') {
  window.ICONS = ICONS;
  window.getIcon = getIcon;
}