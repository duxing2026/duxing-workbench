/**
 * 独行工作台 - 高频成语数据
 * 收录公考真题高频成语，每个成语配3条真实例句
 * 例句来源：人民网(people.com.cn)、光明网(gmw.cn)、人民日报、历年真题
 * 按考频降序排列
 */
const HIGH_FREQ_IDIOMS = [
  { idiom: "因地制宜", frequency: 15, meaning: "根据不同环境的实际情况制定相应的妥善办法", origin: "汉·赵晔《吴越春秋·阖闾内传》", examples: [
    { source: "人民日报", text: "发展产业，既要\"低头看路\"，立足一地，也要\"抬头看天\"，融入大局。如此，才是真正的因地制宜。", url: "http://opinion.people.com.cn/n1/2025/0724/c1003-40528313.html" },
    { source: "人民网", text: "当地发展智慧农业的实践表明，发展智慧农业须筑牢根基，因地制宜、循序渐进。", url: "http://finance.people.com.cn/n1/2025/0924/c1004-40570972.html" },
    { source: "人民网", text: "准确把握\"因地制宜\"的科学内涵与时代价值，做好经济工作，是中国式现代化建设的中心任务。", url: "http://theory.people.com.cn/n1/2026/0209/c40531-40662461.html" }
  ]},
  { idiom: "脱颖而出", frequency: 15, meaning: "比喻人的本领全部显露出来", origin: "《史记·平原君虞卿列传》", examples: [
    { source: "人民网", text: "各级党委和政府需拿出真招、实招、硬招，让更多技能人才脱颖而出。", url: "http://opinion.people.com.cn/n1/2021/0513/c1003-32101480.html" },
    { source: "光明日报", text: "百度今年还将启动管理培训生计划，面向人工智能领域招募顶尖校园人才，目标十分明确——让更多青年人才脱颖而出。", url: "https://epaper.gmw.cn/gmrb/html/2025-05/30/nw.D110000gmrb_20250530_2-04.htm" },
    { source: "光明网", text: "20项国际领先项目脱颖而出，其中3项卓越成果荣获\"基础研究组\"奖项，涵盖类脑计算、具身智能等尖端领域。", url: "https://politics.gmw.cn/2024-11/20/content_37688401.htm" }
  ]},
  { idiom: "息息相关", frequency: 15, meaning: "形容彼此关系非常密切", origin: "清·严复《原强》", examples: [
    { source: "人民日报", text: "宪法与国家前途、人民命运息息相关。", url: "http://politics.people.com.cn/n1/2023/1203/c1001-40130773.html" },
    { source: "光明网", text: "实践充分证明，宪法与国家前途、人民命运息息相关。", url: "https://m.gmw.cn/toutiao/2025-07/23/content_38168855.htm" },
    { source: "光明网", text: "持续营造风清气正的网络空间，推动构建网络空间命运共同体，总书记关心的这件事，和屏幕前的你我息息相关。", url: "https://politics.gmw.cn/2025-12/01/content_38451047.htm" }
  ]},
  { idiom: "潜移默化", frequency: 14, meaning: "指人的思想、性格和习惯等在不知不觉中受到外界影响而逐渐发生变化", origin: "北齐·颜之推《颜氏家训·慕贤》", examples: [
    { source: "人民日报", text: "政治文化是政治生活的灵魂，对政治生态具有潜移默化的影响。", url: "http://opinion.people.com.cn/n1/2022/0106/c1003-32324881.html" },
    { source: "人民日报", text: "好的校风学风，能够为学生成长营造好气候，创造好生态，能够在潜移默化中给学生以人生启迪、智慧光芒和精神力量。", url: "http://opinion.people.com.cn/n1/2019/0329/c1003-31001616.html" },
    { source: "光明网", text: "现如今，数字化正在潜移默化地改变文化与创意产业，催生了许多新的商业模式和合作形式。", url: "https://culture.gmw.cn/2023-03/11/content_36423533.htm" }
  ]},
  { idiom: "首当其冲", frequency: 13, meaning: "比喻最先受到攻击或遭到灾难", origin: "《汉书·五行志》", examples: [
    { source: "人民日报", text: "报刊零售业首当其冲。互联网、特别是移动互联网的发展，改变了人们的阅读习惯。", url: "http://opinion.people.com.cn/n/2014/0320/c1003-24684952.html" },
    { source: "人民网", text: "香港的旅游业及零售业首当其冲受到影响，酒店入住率下跌老板称\"顶不住\"。", url: "http://hm.people.com.cn/n1/2019/0820/c42272-31306519.html" },
    { source: "人民网", text: "空间集聚型、人员密集型的文旅项目更是首当其冲。", url: "http://opinion.people.com.cn/n1/2022/0523/c437948-32427486.html" }
  ]},
  { idiom: "耳濡目染", frequency: 12, meaning: "指耳朵经常听到，眼睛经常看到，无形之中受到影响", origin: "唐·韩愈《清河郡公房公墓碣铭》", examples: [
    { source: "人民网", text: "广大家庭都要重言传、重身教，教知识、育品德，身体力行、耳濡目染，帮助孩子扣好人生的第一粒扣子。", url: "http://opinion.people.com.cn/n1/2025/0515/c223228-40480469.html" },
    { source: "人民网", text: "这种习惯的养成，源于儿时的耳濡目染，是我的家人用他们的言传身教，牵引了我对读书的热爱。", url: "https://paper.people.com.cn/rmrbhwb/html/2019-04/13/content_1919407.htm" },
    { source: "光明网", text: "中华优秀传统文化教育抓早抓小、久久为功、潜移默化、耳濡目染，有利于夯实传承中华优秀传统文化的根基。", url: "https://news.gmw.cn/2023-03/21/content_36442207.htm" }
  ]},
  { idiom: "循序渐进", frequency: 12, meaning: "指按照一定的步骤或程序逐渐推进或提高", origin: "南宋·朱熹《论语集注》", examples: [
    { source: "人民网", text: "昌吉州着眼长远，多行固本之举，循序渐进发展智慧农业，其经验值得肯定与总结。", url: "http://finance.people.com.cn/n1/2025/0924/c1004-40570972.html" },
    { source: "人民日报", text: "量力而行，就要坚持循序渐进，统筹需要和可能，把保障和改善民生建立在经济发展和财力可持续的基础之上。", url: "http://opinion.people.com.cn/n1/2024/0516/c1003-40236733.html" },
    { source: "人民网", text: "运动虽好，但也要循序渐进、量力而行，实现健身而不\"伤身\"。", url: "http://society.people.com.cn/n1/2026/0730/c1008-40770549.html" }
  ]},
  { idiom: "相辅相成", frequency: 12, meaning: "指两件事物互相配合，互相补充", origin: "清·崔述《丰镐考信录》", examples: [
    { source: "人民日报", text: "经济发展和社会发展相辅相成，必须协调并进。要把改善民生作为促进社会发展的重点。", url: "http://lianghui.people.com.cn/2026/n1/2026/0307/c461827-40677016.html" },
    { source: "光明日报", text: "正能量和大流量并不是非此即彼的二元对立关系，而是相辅相成、辩证统一的。", url: "https://epaper.gmw.cn/gmrb/html/content/202604/10/content_10764.html" },
    { source: "光明网", text: "高质量发展和高水平安全是有机统一的，二者相辅相成、不可偏废。", url: "https://lilunhao.gmw.cn/2024-04/16/content_37266562.htm" }
  ]},
  { idiom: "家喻户晓", frequency: 12, meaning: "形容人所共知", origin: "《汉书·刘辅传》", examples: [
    { source: "人民网", text: "创作者借助AI工具，将经典动画角色强行拼凑，让家喻户晓的卡通形象互怼谩骂。", url: "http://opinion.people.com.cn/n1/2026/0711/c436867-40758507.html" },
    { source: "光明网", text: "他的名字家喻户晓，他的事迹温暖人心，他的精神滋养着一代代中国人，他就是历经岁月仍熠熠生辉的\"全民偶像\"——雷锋！", url: "https://politics.gmw.cn/2023-03/06/content_36412146.htm" },
    { source: "光明日报", text: "一首歌、一部剧、一场球、一顿烧烤，就能带火一座城，文旅城市如何从\"家喻户晓\"到\"口碑载道\"。", url: "https://epaper.gmw.cn/gmrb/html/2024-04/11/nw.D110000gmrb_20240411_1-07.htm" }
  ]},
  { idiom: "蔚然成风", frequency: 12, meaning: "形容一种事物逐渐发展盛行，形成一种良好风气", origin: "范文澜《中国通史》", examples: [
    { source: "人民日报", text: "着力消除妨碍干部担当作为的各种因素，让愿担当、敢担当、善担当蔚然成风。", url: "http://politics.people.com.cn/n1/2026/0228/c1024-40672165.html" },
    { source: "人民日报", text: "在全社会大兴识才、爱才、敬才、用才之风，让识才爱才敬才用才蔚然成风。", url: "http://theory.people.com.cn/n/2014/0611/c40531-25135673.html" },
    { source: "光明日报", text: "让绿色生产生活方式蔚然成风。", url: "https://epaper.gmw.cn/gmrb/html/2025-11/24/nw.D110000gmrb_20251124_2-07.htm" }
  ]},
  { idiom: "因势利导", frequency: 11, meaning: "顺着事情发展的趋势向有利的方向引导", origin: "西汉·司马迁《史记·孙子吴起列传》", examples: [
    { source: "人民日报", text: "人工智能写作效率高、表达方式活、数据能力强，可以因势利导，为评论工作赋能。", url: "http://opinion.people.com.cn/n1/2025/0918/c1003-40566374.html" },
    { source: "人民日报", text: "我们因势利导，谋划打造了许家山石头记小镇、桑洲南山花屿小镇、深甽温泉度假小镇。", url: "http://opinion.people.com.cn/GB/n1/2016/0524/c1003-28373159.html" },
    { source: "光明网", text: "紧抓新一轮科技革命和产业变革机遇，因势利导促进各领域各行业培育发展新质生产力。", url: "https://economy.gmw.cn/2025-11/05/content_38393221.htm" }
  ]},
  { idiom: "毋庸置疑", frequency: 11, meaning: "事实明显或理由充分，根本就没有怀疑的余地", origin: "近现代汉语", examples: [
    { source: "人民网", text: "中国走和平发展道路有目共睹。中国走和平发展道路的信念是坚定不移的，中国和平发展毋庸置疑。", url: "https://world.people.com.cn/n/2014/0429/c1002-24958322.html" },
    { source: "人民网", text: "近3年来，我们的抗疫成果是毋庸置疑的。", url: "http://opinion.people.com.cn/n1/2022/1129/c223228-32576823.html" },
    { source: "人民网", text: "人工智能可以成为评论工作的\"助手\"，却无法替代人类对时代的深刻洞察，这一点是毋庸置疑的。", url: "http://opinion.people.com.cn/n1/2025/0918/c1003-40566374.html" }
  ]},
  { idiom: "纷至沓来", frequency: 11, meaning: "形容接连不断地到来", origin: "宋·朱熹《答何叔京》", examples: [
    { source: "人民网", text: "日前，以\"壮族三月三\"节庆为契机，防城港举办\"跨国村晚 边民大联欢\"，吸引中越近千名边民和游客纷至沓来。", url: "http://m.people.cn/n4/2023/0526/c3535-20606315.html" },
    { source: "人民网", text: "各类综合性、专业性国际展会接连举办，各国客商纷至沓来，此种盛况本身就是中国扩大开放的力证。", url: "http://opinion.people.com.cn/n1/2023/0421/c427456-32669940.html" },
    { source: "光明网", text: "从中国发展高层论坛到博鳌亚洲论坛，再到如火如荼举行的\"投资中国年\"，纷至沓来的外企高管们紧锣密鼓参会、考察、受访。", url: "https://politics.gmw.cn/2023-04/07/content_36481775.htm" }
  ]},
  { idiom: "星罗棋布", frequency: 11, meaning: "像天上的星星和棋盘上的棋子那样散布着，形容数量多且分布广", origin: "汉·班固《西都赋》", examples: [
    { source: "人民网", text: "重大科技基础设施星罗棋布，点燃原始创新的引擎。", url: "http://sz.people.com.cn/n2/2025/0918/c202846-41355717.html" },
    { source: "人民网", text: "林则徐、严复、林觉民、冰心等人的纪念馆或故居，星罗棋布在三坊七巷。", url: "http://dangshi.people.com.cn/n1/2021/0813/c436975-32191764.html" },
    { source: "光明网", text: "沂水食品产业底蕴深厚，食品企业星罗棋布，但早年间，同质化竞争、低价内卷的行业困局，让不少传统企业发展受限。", url: "https://difang.gmw.cn/sd/2026-07/30/content_38917798.htm" }
  ]},
  { idiom: "居安思危", frequency: 10, meaning: "处在安定的环境而想到可能会出现的危难", origin: "《左传·襄公十一年》", examples: [
    { source: "人民日报", text: "全党必须铭记生于忧患、死于安乐，常怀远虑、居安思危，继续推进新时代党的建设新的伟大工程。", url: "http://opinion.people.com.cn/GB/n1/2022/0224/c1003-32358397.html" },
    { source: "人民日报", text: "功成名就时做到居安思危、保持创业初期那种励精图治的精神状态不容易。", url: "https://dangjian.people.com.cn/n1/2019/0911/c117092-31349810.html" },
    { source: "光明网", text: "越是形势好的时候，我们越要有忧患意识，越要居安思危。", url: "https://www.gmw.cn/01gmrb/2008-01/03/content_718277.htm" }
  ]},
  { idiom: "防微杜渐", frequency: 10, meaning: "在错误或坏事刚露出苗头时就加以制止，不使其发展", origin: "晋·韦謏《启谏冉闵》", examples: [
    { source: "人民日报", text: "对公务接待定标准、立规范，不单是为了遏制\"舌尖上的浪费\"，更深层次的用意，是为了防微杜渐，铲除权力滥用、腐败滋生的土壤。", url: "https://politics.people.com.cn/n1/2026/0202/c461001-40657321.html" },
    { source: "人民网", text: "坚持抓早抓小、防微杜渐，健全常态预警机制，推动干部监督关口前移。", url: "https://dangjian.people.com.cn/n1/2025/0325/c117092-40446280.html" },
    { source: "光明网", text: "日常工作中，要坚持抓早抓小、防微杜渐，把监督融入日常、做在经常。", url: "https://politics.gmw.cn/2026-08/02/content_38922784.htm" }
  ]},
  { idiom: "未雨绸缪", frequency: 10, meaning: "趁着天没下雨，先修缮好房屋门窗，比喻事先做好准备", origin: "《诗经·豳风·鸱鸮》", examples: [
    { source: "人民网", text: "未雨绸缪，才能积极稳妥应对风险挑战。", url: "http://m.people.cn/n4/2022/0707/c25-20162172.html" },
    { source: "人民日报", text: "习近平总书记强调：\"要心中有数、未雨绸缪、主动作为，不能等出了事才去抓工作。\"", url: "http://opinion.people.com.cn/n1/2025/0827/c1003-40550693.html" },
    { source: "光明网", text: "忧患意识是指从客观条件出发，对事物在发展过程中可能出现的风险和挑战进行预估，其内在本质在于未雨绸缪、居安思危、防患未然。", url: "https://theory.gmw.cn/2021-04/23/content_34788758.htm" }
  ]},
  { idiom: "防患未然", frequency: 10, meaning: "在祸患发生前预先防范", origin: "《周易·既济》", examples: [
    { source: "人民日报", text: "对于安全的自信，靠的不是\"没出过事\"的盲目乐观，而是防患未然的高度谨慎。", url: "http://opinion.people.com.cn/n1/2026/0624/c461529-40746051.html" },
    { source: "人民网", text: "防患于未然，把困难估计得足一些，把预案准备得再充分一些，坚持\"宁可备而不用，不可用时无备\"。", url: "http://opinion.people.com.cn/n1/2025/0827/c1003-40550693.html" },
    { source: "光明网", text: "增强忧患意识，要做到居安思危，防患未然。", url: "https://theory.gmw.cn/2021-04/23/content_34788758.htm" }
  ]},
  { idiom: "有备无患", frequency: 10, meaning: "事先有准备，就可以避免祸患", origin: "《尚书·说命中》", examples: [
    { source: "人民日报", text: "习近平总书记多次强调，要坚持底线思维，不回避矛盾，不掩盖问题，凡事从坏处准备，努力争取最好的结果，做到有备无患、遇事不慌，牢牢把握主动权。", url: "http://opinion.people.com.cn/n1/2020/0924/c1003-31872732.html" },
    { source: "人民网", text: "我们推进各领域工作，都要善于运用底线思维的方法，凡事从坏处准备，努力争取最好的结果，做到有备无患、遇事不慌。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明网", text: "树立底线思维，安不忘危、防患未然，我们就能从底线出发，看到\"坏处\"、解决\"难处\"、争取\"好处\"。", url: "https://theory.gmw.cn/2021-04/23/content_34788758.htm" }
  ]},
  { idiom: "高瞻远瞩", frequency: 10, meaning: "站得高、看得远，比喻眼光远大", origin: "东汉·王充《论衡·别通篇》", examples: [
    { source: "人民网", text: "邓小平高瞻远瞩的战略思维，从现象透视本质，从局部把握全局，从现实前瞻长远，为党和国家的事业沿着正确方向前进奠定了坚实的政治基础。", url: "http://dangshi.people.com.cn/n1/2022/0118/c436975-32333649.html" },
    { source: "人民日报", text: "时任厦门市委常委、常务副市长的习近平同志亲自主持编制厦门15年战略规划，以高瞻远瞩的改革思维和创新理念，科学谋划厦门发展蓝图。", url: "http://opinion.people.com.cn/n1/2025/0707/c1003-40515699.html" },
    { source: "光明日报", text: "《光明日报》高瞻远瞩，沉着坚定直面此情，果决出手，于元旦之日在全国首先掀起\"纵横革命\"。", url: "https://epaper.gmw.cn/gmrb/html/2025-01/06/nw.D110000gmrb_20250106_2-11.htm" }
  ]},
  { idiom: "审时度势", frequency: 10, meaning: "观察时局，估量形势的变化", origin: "明·沈德符《野获编》", examples: [
    { source: "人民日报", text: "敏锐察觉\"大进大出的环境条件已经变化\"，审时度势提出构建新发展格局。", url: "http://opinion.people.com.cn/n1/2025/1231/c461529-40636145.html" },
    { source: "人民网", text: "早在建党之初，中国共产党就把握规律、审时度势，充分认识到人民群众之于中国革命的重要意义。", url: "http://cpc.people.com.cn/pinglun/n1/2016/0823/c241220-28659628.html" },
    { source: "光明日报", text: "习近平总书记站在时代发展的战略高度，立足国际国内发展全局，高瞻远瞩，审时度势，提出了\"聚天下英才而用之\"等人才发展新理念。", url: "https://theory.gmw.cn/2025-11/24/content_38432104.htm" }
  ]},
  { idiom: "运筹帷幄", frequency: 10, meaning: "在军帐内策划军机，泛指筹谋策划", origin: "《史记·高祖本纪》", examples: [
    { source: "人民日报", text: "党的十八大以来，中国之所以能面对风险挑战迎难而上，在盘根错节的利益交织中挺身向前，靠的是党中央的运筹帷幄，靠的是各级领导干部的担当和作为。", url: "http://opinion.people.com.cn/GB/n1/2017/0609/c1003-29327876.html" },
    { source: "人民日报", text: "党的十八大以来，以习近平同志为总书记的党中央，运筹帷幄、总揽全局，改革发展稳定、内政外交国防、治党治国治军全方位推进。", url: "http://opinion.people.com.cn/n1/2016/0105/c1003-28011456.html" },
    { source: "人民网", text: "回顾一段时间来半岛局势的积极变化，习近平总书记为改善半岛北南双方关系、缓和半岛和地区局势亲自谋划，运筹帷幄，发挥关键作用。", url: "http://opinion.people.com.cn/GB/n1/2018/0329/c1003-29897399.html" }
  ]},
  { idiom: "厚积薄发", frequency: 10, meaning: "长期积累，而后少量释放，形容积累丰厚", origin: "宋·苏轼《稼说送张琥》", examples: [
    { source: "人民日报", text: "从新能源汽车产量突破2000万辆、外贸\"新三样\"叫响国际市场，到国产邮轮圆满试航、国产大飞机投入商用，今年以来，我国产业升级厚积薄发。", url: "http://finance.people.com.cn/n1/2023/1025/c1004-40102633.html" },
    { source: "人民日报", text: "实现\"厚积薄发\"，离不开强大的定力，保持定力，一茬接着一茬干，产业升级必将结出更多硕果。", url: "http://finance.people.com.cn/n1/2023/1025/c1004-40102633.html" },
    { source: "人民网", text: "立足长三角\"4小时产业圈\"，凭借区位和创新优势，安徽汽车产业厚积薄发，今年上半年，汽车、新能源汽车产量均居全国首位。", url: "https://unn.people.com.cn/n1/2025/0822/c14717-40548178.html" }
  ]},
  { idiom: "滴水穿石", frequency: 10, meaning: "水滴不断落下能穿透石头，比喻坚持不懈必有成效", origin: "宋·罗大经《鹤林玉露》", examples: [
    { source: "人民网", text: "习总书记以\"滴水穿石\"的闽东精神激励各级领导干部真正做到胸有宏图、扎扎实实、持之以恒。", url: "http://opinion.people.com.cn/GB/n1/2018/0623/c1003-30078385.html" },
    { source: "人民日报", text: "\"我赞赏'滴水穿石'的精神\"\"提倡干部埋头苦干，着眼于长期的、为人铺垫的工作\"，在地方工作期间，习近平同志便推崇滴水穿石的景观。", url: "http://politics.people.com.cn/n1/2026/0324/c461001-40688126.html" },
    { source: "人民网", text: "水滴石穿之功在于\"恒\"，打赢脱贫攻坚战绝非朝夕之功，不是轻轻松松冲一冲就能解决的。", url: "http://opinion.people.com.cn/GB/n1/2018/0623/c1003-30078385.html" }
  ]},
  { idiom: "锲而不舍", frequency: 10, meaning: "不断地雕刻，比喻做事持之以恒", origin: "《荀子·劝学》", examples: [
    { source: "人民网", text: "人生在坚持中闪光，事业在实干中兴旺，锲而不舍、坚韧不拔的意志力是成就事业的第一要素。", url: "http://cpc.people.com.cn/pinglun/n/2012/1203/c78779-19773909.html" },
    { source: "人民日报", text: "正是靠着这种锲而不舍的精神和坚持不懈的劲头，曾经\"老、少、边、岛、贫\"的闽东在脱贫路上书写了光辉的宁德篇章。", url: "http://opinion.people.com.cn/GB/n1/2018/0623/c1003-30078385.html" },
    { source: "人民网", text: "我们要深入学习、领会总书记指示的深远用意，持之以恒、锲而不舍地抓民生办实事。", url: "http://cpc.people.com.cn/pinglun/n/2013/0504/c78779-21365008.html" }
  ]},
  { idiom: "持之以恒", frequency: 10, meaning: "长久坚持下去", origin: "清·曾国藩《家训喻纪泽》", examples: [
    { source: "人民日报", text: "抓作风建设只有进行时，没有完成时，深化拓展基层减负工作，必须不断健全基层减负的长效机制，持之以恒为基层减负。", url: "http://opinion.people.com.cn/n1/2024/0124/c1003-40165123.html" },
    { source: "人民网", text: "万众一心持之以恒奋斗近百年，中华巨龙已经插上翅膀。", url: "http://opinion.people.com.cn/n1/2019/0705/c1003-31217221.html" },
    { source: "光明日报", text: "在数十年的写作实践中，王开忠展现出持之以恒的坚守精神，他克服工作与生活的种种困难，笔耕不辍。", url: "https://epaper.gmw.cn/gmrb/html/2025-11/08/nw.D110000gmrb_20251108_3-12.htm" }
  ]},
  { idiom: "孜孜不倦", frequency: 10, meaning: "工作或学习勤奋刻苦不知疲倦", origin: "《尚书·君陈》", examples: [
    { source: "人民网", text: "广大青年要如饥似渴、孜孜不倦学习，既多读有字之书，也多读无字之书，注重学习人生经验和社会知识。", url: "http://cpc.people.com.cn/n1/2016/0504/c241220-28325184.html" },
    { source: "人民网", text: "网友佩服贺娇龙，动容于她牺牲休息时间推销农牧产品的孜孜不倦，感佩于她多次坠马依然坚持骑马宣传昭苏的勇敢无畏。", url: "http://opinion.people.com.cn/n1/2026/0430/c461529-40711394.html" },
    { source: "光明日报", text: "\"人才有高下，知物由学。\"广大青年要如饥似渴、孜孜不倦学习，既多读有字之书，也多读无字之书。", url: "https://epaper.gmw.cn/gmrb/html/2017-05/05/nw.D110000gmrb_20170505_5-01.htm" }
  ]},
  { idiom: "兢兢业业", frequency: 10, meaning: "形容做事谨慎、勤恳", origin: "《诗经·大雅·烝民》", examples: [
    { source: "人民日报", text: "老老实实做人、踏踏实实做事、兢兢业业工作，就是对党和人民最大的忠诚。", url: "http://opinion.people.com.cn/n1/2019/0319/c1003-30982146.html" },
    { source: "人民网", text: "他们宁愿察言观色曲意逢迎，也不愿意兢兢业业干事，为人民谋福祉。", url: "http://cpc.people.com.cn/pinglun/n/2013/0813/c241220-22547982.html" },
    { source: "人民网", text: "无论什么时候，建功立业、书写历史、创造奇迹、实现梦想，都离不开勤勤恳恳的付出和兢兢业业的投入。", url: "http://opinion.people.com.cn/n1/2019/0705/c1003-31217221.html" }
  ]},
  { idiom: "精益求精", frequency: 10, meaning: "已经很好了，还要求更好", origin: "南宋·朱熹《论语集注》", examples: [
    { source: "人民日报", text: "习近平总书记深刻指出，在长期实践中，我们培育形成了\"执着专注、精益求精、一丝不苟、追求卓越的工匠精神\"。", url: "http://opinion.people.com.cn/GB/n1/2020/1230/c1003-31983325.html" },
    { source: "人民日报", text: "从长远来看，制造强国并不是高不可攀，中国企业正在发挥后发优势，中国工匠不断精益求精。", url: "http://opinion.people.com.cn/n1/2019/0201/c1003-30604173.html" },
    { source: "光明日报", text: "惟有大力弘扬工匠精神，执着专注、精益求精、一丝不苟、追求卓越，才能让工匠精神释放出璀璨的时代光芒。", url: "https://epaper.gmw.cn/gmrb/html/2023-08/01/nw.D110000gmrb_20230801_2-06.htm" }
  ]},
  { idiom: "一丝不苟", frequency: 10, meaning: "连最细微的地方也不马虎，形容办事认真细致", origin: "清·吴敬梓《儒林外史》", examples: [
    { source: "人民日报", text: "工匠必须具有严谨的态度，一丝不苟、倾注匠心，才能创造出巧夺天工的精品。", url: "http://opinion.people.com.cn/GB/n1/2020/1230/c1003-31983325.html" },
    { source: "人民网", text: "一丝不苟就是细致到了极点，丝毫都不马虎，不放过任何细节。", url: "http://cpc.people.com.cn/pinglun/big5/n/2013/0805/c241220-22448155.html" },
    { source: "光明日报", text: "执着专注、精益求精、一丝不苟、追求卓越的工匠精神，是大国工匠的优秀基因。", url: "https://news.gmw.cn/2025-05/20/content_38034605.htm" }
  ]},
  { idiom: "面面俱到", frequency: 10, meaning: "各方面都照顾到，没有遗漏", origin: "清·李宝嘉《官场现形记》", examples: [
    { source: "人民网", text: "多措并举、面面俱到，才能把一个个问号拉直，让辛苦打拼一年的人们收获满满的获得感和幸福感。", url: "http://js.people.com.cn/n2/2021/0131/c360298-34557098.html" },
    { source: "人民日报", text: "全面深化改革，要求全面梳理并攻克各方面体制及其各个环节存在的弊端，但这并不意味着改革于每一个方面、每一个环节都要面面俱到、同等用力。", url: "http://opinion.people.com.cn/n/2015/0924/c1003-27626420.html" },
    { source: "人民网", text: "王岐山在报告中指出，\"反腐工作不能面面俱到，而是要立竿见影。\"", url: "http://cpc.people.com.cn/pinglun/n/2014/0909/c241220-25627380.html" }
  ]},
  { idiom: "叹为观止", frequency: 10, meaning: "赞美看到的事物好到了极点", origin: "《左传·襄公二十九年》", examples: [
    { source: "人民网", text: "近日，双鸭山市宝清县迎来了一场令人叹为观止的自然奇观，数千只\"鸟类国宝\"集结双鸭山宝清。", url: "http://hlj.people.com.cn/n2/2024/1108/c220005-41035940.html" },
    { source: "光明网", text: "在这一内一外、一动一静中，马识途走完了令人叹为观止的世纪人生。", url: "https://epaper.gmw.cn/gmrb/html/2024-03/31/nw.D110000gmrb_20240331_2-01.htm" },
    { source: "光明网", text: "5月23日晚，内蒙古额尔古纳惊现\"落日彩虹\"，宛如天空铺开一幅流动的油画，令当地居民和游客叹为观止。", url: "https://m.gmw.cn/toutiao/2025-05/25/content_1304044129.htm" }
  ]},
  { idiom: "独树一帜", frequency: 10, meaning: "比喻自成一家", origin: "清·袁枚《随园诗话》", examples: [
    { source: "人民日报", text: "习近平总书记指出：\"自古以来，我国形成了世界法制史上独树一帜的中华法系，积淀了深厚的法律文化。\"", url: "http://theory.people.com.cn/n1/2025/0625/c40531-40508390.html" },
    { source: "光明网", text: "习近平总书记深刻指出：\"我国古代法制蕴含着十分丰富的智慧和资源，中华法系在世界几大法系中独树一帜。\"", url: "https://www.gmw.cn/xueshu/2023-11/27/content_36991948.htm" },
    { source: "光明日报", text: "在教育理念上，晓庄师范也独树一帜，陶行知开始践行他独特的生活教育理论。", url: "https://epaper.gmw.cn/wzb/html/2015-06/30/nw.D110000wzb_20150630_7-06.htm" }
  ]},
  { idiom: "相得益彰", frequency: 10, meaning: "指两个人或两件事物互相配合，双方的能力和作用更能显示出来", origin: "汉·王褒《圣主得贤臣颂》", examples: [
    { source: "人民日报", text: "让\"诗\"和\"远方\"相得益彰、浑然一体，需要积极探索创新发展，培育更多新型文旅发展模式。", url: "http://opinion.people.com.cn/n1/2024/1105/c1003-40353925.html" },
    { source: "光明日报", text: "普通话和方言可以做到并行不悖，甚至相辅相成，相得益彰。", url: "https://epaper.gmw.cn/gmrb/html/2016-07/20/nw.D110000gmrb_20160720_1-05.htm" },
    { source: "光明网", text: "习近平总书记创造性地提出了\"人文经济学\"这一重大理论命题，人文与经济交融共生相得益彰。", url: "https://politics.gmw.cn/2026-05/20/content_38777436.htm" }
  ]},
  { idiom: "喜闻乐见", frequency: 10, meaning: "喜欢听，乐意看，形容很受欢迎", origin: "宋·王明清《挥麈录》", examples: [
    { source: "人民网", text: "第十四届精神文明建设\"五个一工程\"获奖名单揭晓，这67部群众喜闻乐见的获奖作品，记录下5年来党带领亿万人民的奋斗历程。", url: "http://culture.people.com.cn/n1/2017/1019/c87423-29596143.html" },
    { source: "光明日报", text: "\"喜闻乐见\"是群众文化活动的基本要求。但这一看似简单的要求，需要活动组织者深思。", url: "https://wycz.gmw.cn/2019-02/08/content_32690549.htm" },
    { source: "光明日报", text: "村BA、村超、村讲、村晚……一个比一个特色鲜明，如雨后春笋般破土而出，被越来越多的人喜闻乐见。", url: "https://epaper.gmw.cn/gmrb/html/content/202606/08/content_15996.html" }
  ]},
  { idiom: "休戚与共", frequency: 10, meaning: "忧喜、祸福彼此共同承担，形容关系密切", origin: "《三国志·蜀书·后主传》", examples: [
    { source: "人民网", text: "携手构建世代友好、高度互信、休戚与共的中哈命运共同体。", url: "https://world.people.com.cn/n1/2024/0701/c1002-40268024.html" },
    { source: "光明网", text: "习近平总书记强调：\"历史警示我们，人类命运休戚与共，各个国家、各个民族只有平等相待、和睦相处、守望相助，才能维护共同安全。\"", url: "https://politics.gmw.cn/2025-09/04/content_38263725.htm" },
    { source: "光明日报", text: "档案中关于日据时期闽台民众交往及共同抗日的史料，真实反映了两岸同胞血脉相连、休戚与共的历史。", url: "https://epaper.gmw.cn/gmrb/html/2025-08/26/nw.D110000gmrb_20250826_3-12.htm" }
  ]},
  { idiom: "接踵而至", frequency: 10, meaning: "指人们前脚跟着后脚，接连不断地来", origin: "《宋史·李显忠传》", examples: [
    { source: "人民日报", text: "森林的断崖式下跌带来的是接踵而至的河西困境：缺水，干旱，沙漠推进。", url: "https://ent.people.com.cn/n1/2024/0907/c1012-40315172.html" },
    { source: "光明日报", text: "血糖控制不佳，并发症接踵而至。", url: "https://epaper.gmw.cn/wzb/html/2018-09/13/nw.D110000wzb_20180913_2-04.htm" },
    { source: "人民日报", text: "中国人民抗日战争暨世界反法西斯战争胜利70周年、中国共产党成立95周年接踵而至。", url: "http://theory.people.com.cn/n1/2017/0917/c409499-29540263.html" }
  ]},
  { idiom: "摩肩接踵", frequency: 10, meaning: "肩碰着肩，脚碰着脚，形容人多拥挤", origin: "《战国策·齐策一》", examples: [
    { source: "人民网", text: "泰山之巅，零下十摄氏度的寒风中，碧霞祠前祈福的人流摩肩接踵。", url: "http://sd.people.com.cn/n2/2026/0217/c364532-41504785.html" },
    { source: "人民网", text: "今天上午的长沙市博物馆，用摩肩接踵来形容一点不为过。", url: "https://cpc.people.com.cn/n/2013/1006/c87228-23109303.html" },
    { source: "人民网", text: "九寨沟摩肩接踵的游客和层林尽染的美景。", url: "http://travel.people.com.cn/n1/2016/1024/c41570-28801357.html" }
  ]},
  { idiom: "鳞次栉比", frequency: 10, meaning: "像鱼鳞和梳子齿那样有次序地排列着，多用来形容房屋等密集", origin: "《诗经·陈风·衡门》", examples: [
    { source: "人民网", text: "摩天大楼鳞次栉比，真的越高越好吗？", url: "http://house.people.com.cn/n1/2018/0716/c164220-30149020.html" },
    { source: "人民网", text: "建成区面积达1400多平方公里，高楼大厦鳞次栉比。", url: "https://world.people.com.cn/n1/2018/0816/c1002-30231930.html" },
    { source: "光明日报", text: "行走在伶仃洋畔，我感受着昔日战乱之地变身科创高地带来的震撼与惊喜——鼓角铮鸣早已远去，代之以鳞次栉比的楼房和林立的塔吊。", url: "https://about.gmw.cn/2026-06/30/content_38858939.htm" }
  ]},
  { idiom: "源源不断", frequency: 10, meaning: "形容接连不断、连续不绝", origin: "《孟子·万章上》", examples: [
    { source: "人民网", text: "我国拥有世界上规模最大的高等教育体系，有各项事业发展的广阔舞台，完全能够源源不断培养造就大批优秀人才。", url: "http://opinion.people.com.cn/n1/2022/1025/c1003-32550872.html" },
    { source: "人民网", text: "源源不断造就建功西部的青年先锋力量。", url: "http://edu-app.people.cn/n1/2025/0822/c1006-40547766.html" },
    { source: "人民网", text: "研究过去，是为了知道我们的文明是从哪里来，为中华民族现代文明建设提供源源不断的精神动力。", url: "https://politics.people.com.cn/n1/2023/1007/c1001-40090206.html" }
  ]},
  { idiom: "生生不息", frequency: 10, meaning: "指群体繁衍不止，也形容生命力旺盛", origin: "《周易·系辞上》", examples: [
    { source: "人民网", text: "保护自然是一场接力跑，一棒接一棒、一代传一代，绵绵用力带来生生不息。", url: "http://opinion.people.com.cn/n1/2025/0220/c1003-40421881.html" },
    { source: "人民网", text: "无论国际风云如何变幻，中朝持续拓展民间友好往来，让中朝友好薪火相传、生生不息。", url: "http://ln.people.com.cn/n2/2025/0923/c378322-41360201.html" },
    { source: "人民网", text: "创新的中国，生生不息；创新的民族，永远年轻。", url: "http://finance.people.com.cn/n1/2024/0929/c1004-40330653.html" }
  ]},
  { idiom: "经久不息", frequency: 10, meaning: "经过很长时间仍不停止，多形容掌声或情绪", origin: "常用成语", examples: [
    { source: "人民网", text: "让国潮风经久不息，企业不仅要保证质量，更要独树一帜强化中国元素，讲好中国故事。", url: "http://opinion.people.com.cn/n1/2021/0817/c434886-32196457.html" },
    { source: "人民网", text: "16年来，已经推选出100多位感动中国人物，感人的故事历久弥新，感动的力量经久不息。", url: "http://media.people.com.cn/n1/2019/0108/c40606-30508701.html" },
    { source: "人民网", text: "80年前的长征，没有被岁月的长河磨砺销蚀，而是在时代的变迁中淬火升华、历久弥新，薪火相传，经久不息。", url: "https://military.people.com.cn/n1/2016/1021/c1011-28795346.html" }
  ]},
  { idiom: "此起彼伏", frequency: 10, meaning: "这里起来，那里落下，形容接连不断", origin: "清·吕留良《与潘用微书》", examples: [
    { source: "光明网", text: "2025年的世界，地区热点此起彼伏，冲突危机延宕反复。", url: "https://politics.gmw.cn/2025-09/20/content_38298376.htm" },
    { source: "光明日报", text: "国际形势风云变幻，局部冲突此起彼伏，但全球和平合作的发展大势不会改变。", url: "https://epaper.gmw.cn/gmrb/html/content/202603/11/content_8170.html" },
    { source: "光明网", text: "随着中国的崛起，所谓\"中国威胁论\"\"国强必霸论\"的论调此起彼伏，幽灵般地游荡在世界的上空。", url: "https://theory.gmw.cn/2023-02/06/content_36347727.htm" }
  ]},
  { idiom: "继往开来", frequency: 10, meaning: "继承前人的事业，开辟未来的道路", origin: "宋·朱熹《朱子全书·周子书》", examples: [
    { source: "人民网", text: "今天，中国共产党带领中国人民全面建成小康社会，不仅书写了人类发展史上\"最激动人心的奇迹\"，更找回了中华民族继往开来的文化自信。", url: "http://opinion.people.com.cn/n1/2021/0705/c1003-32148213.html" },
    { source: "人民日报", text: "大家表示，要更加紧密团结在以习近平同志为核心的党中央周围，万众一心、继往开来，将伟大抗战精神化作奋进新征程的磅礴力量。", url: "https://politics.people.com.cn/n1/2025/0907/c1001-40558371.html" },
    { source: "人民日报", text: "\"让2026年成为中美关系继往开来的历史性、标志性年份。\"", url: "https://paper.people.com.cn/rmrb/pc/content/202605/16/content_30157122.html" }
  ]},
  { idiom: "承前启后", frequency: 10, meaning: "承接前人的，开创后来的", origin: "清·薛福成《庸盦笔记·咸丰季年三奸伏诛》", examples: [
    { source: "光明日报", text: "\"十五五\"时期是基本实现社会主义现代化夯实基础、全面发力的关键时期，在基本实现社会主义现代化进程中具有承前启后的重要地位。", url: "https://theory.gmw.cn/2025-11/24/content_38432104.htm" },
    { source: "光明日报", text: "\"金砖合作正处在承前启后的关键节点上\"。", url: "https://news.gmw.cn/2017-09/04/content_25988891.htm" },
    { source: "光明日报", text: "我们这一代共产党人一定要承前启后、继往开来，把我们的党建设好，团结全体中华儿女把我们国家建设好。", url: "https://epaper.gmw.cn/gmrb/html/2012-11/30/nw.D110000gmrb_20121130_1-01.htm" }
  ]},
  { idiom: "薪火相传", frequency: 10, meaning: "比喻学问、技艺等代代相传", origin: "《庄子·养生主》", examples: [
    { source: "人民网", text: "革命先辈感天动地的信仰故事、熠熠生辉的理想光芒，激励和指引着一代又一代共产党人在一程又一程新的长征路上接力前行、砥砺奋进。", url: "https://politics.people.com.cn/n1/2021/1113/c1001-32281526.html" },
    { source: "人民网", text: "国庆、中秋假期，不少市民和游客选择红色主题的博物馆、纪念馆等作为目的地，了解历史、缅怀先烈，让红色精神薪火相传。", url: "https://paper.people.com.cn/rmrb/pc/content/202510/09/content_30108358.html" },
    { source: "光明日报", text: "\"党和人民的红孩子\"与祖国共进、与时代同行，必将成长为可堪大用、能担重任的栋梁之才，让红色基因薪火相传、红色江山后继有人。", url: "https://epaper.gmw.cn/gmrb/html/content/202606/03/content_15683.html" }
  ]},
  { idiom: "经久不衰", frequency: 10, meaning: "经过很长时间也不衰退", origin: "常用成语", examples: [
    { source: "人民网", text: "中华文明历经数千年而绵延不绝、迭遭忧患而经久不衰，这是人类文明史上的奇迹。", url: "http://opinion.people.com.cn/n1/2024/0104/c1003-40152190.html" },
    { source: "人民日报", text: "中华文明绵延不断、经久不衰，在长期演进过程中，形成了中国人看待世界、看待社会、看待人生的独特体系。", url: "http://opinion.people.com.cn/n1/2024/1129/c223228-40371654.html" },
    { source: "人民日报", text: "此后曹禺又创作了《日出》《原野》《北京人》等，其作品展现出经久不衰的艺术魅力。", url: "https://paper.people.com.cn/rmrbwap/html/2020-11/02/nw.D110000renmrb_20201102_1-20.htm" }
  ]},
  { idiom: "历久弥新", frequency: 10, meaning: "经历长久的时间而更加鲜活，更加有活力", origin: "常用成语", examples: [
    { source: "人民网", text: "习近平总书记强调：\"伟大抗美援朝精神跨越时空、历久弥新，必须永续传承、世代发扬。\"", url: "http://opinion.people.com.cn/n1/2023/0727/c1003-40044345.html" },
    { source: "人民网", text: "16年来，已经推选出100多位感动中国人物，感人的故事历久弥新，感动的力量经久不息。", url: "http://media.people.com.cn/n1/2019/0108/c40606-30508701.html" },
    { source: "人民日报", text: "\"枫桥经验\"是党领导人民创造的一整套行之有效的社会治理方案，成为我国推进基层社会治理的\"金字招牌\"。", url: "https://paper.people.com.cn/rmrb/html/2023-09/25/nw.D110000renmrb_20230925_1-07.htm" }
  ]},
  { idiom: "推陈出新", frequency: 10, meaning: "去掉旧事物的糟粕，取其精华，并使它向新的方向发展", origin: "宋·朱熹《朱子全书·学》", examples: [
    { source: "人民网", text: "文化在交流中焕发新彩，在交流中发展繁荣。只有常怀包容之心、学习之意，切实开展文化交流对话，汲取各类养分，才能不断推陈出新。", url: "http://opinion.people.com.cn/n1/2023/0710/c1003-40031374.html" },
    { source: "人民日报", text: "要坚持古为今用、推陈出新，秉持客观科学礼敬的态度，推动中华优秀传统文化创造性转化、创新性发展。", url: "http://opinion.people.com.cn/n1/2021/1227/c1003-32317362.html" },
    { source: "人民网", text: "文化类节目应担起承载文化、引领价值、成风化人的使命，潜心创作，推陈出新，实现观赏性与价值性的统一。", url: "https://ent.people.com.cn/n1/2021/0930/c1012-32242818.html" }
  ]},
  { idiom: "古为今用", frequency: 10, meaning: "吸收古代的优点，利用今天", origin: "毛泽东对文化遗产的论述", examples: [
    { source: "光明网", text: "我们要坚持古为今用、以古鉴今，与时俱进、勇于创新，努力实现古典文明的创造性转化、创新性发展。", url: "https://theory.gmw.cn/2024-11/17/content_37681418.htm" },
    { source: "光明网", text: "站在文化的源头，抚摸古老的土地，接通文明的脉络，就能更清楚地知道\"我们从哪里来、现在在哪里、将要到哪里去\"。", url: "https://news.gmw.cn/2022-11/07/content_36141865.htm" },
    { source: "光明日报", text: "习近平总书记在孔府和孔子研究院考察时强调：\"对历史文化特别是先人传承下来的道德规范，要坚持古为今用、推陈出新。\"", url: "https://politics.gmw.cn/2023-10/16/content_36894750.htm" }
  ]},
  { idiom: "正本清源", frequency: 10, meaning: "从根本上清理和整顿，从源头上纠正", origin: "《晋书·武帝纪》", examples: [
    { source: "人民网", text: "要学真理论，就要正本清源。习近平新时代中国特色社会主义思想是当代中国马克思主义、二十一世纪马克思主义。", url: "http://theory.people.com.cn/n1/2023/0419/c40531-32667814.html" },
    { source: "人民网", text: "互联网绝不是法外之地，只有按照规范注册、使用互联网用户账号，正本清源严打\"李鬼\"，才能真正保障每一位网民的合法权益。", url: "http://opinion.people.com.cn/n/n2015/0204/c1003-26508521.html" },
    { source: "人民网", text: "各级党组织要认真履行政治责任，勇于直面问题，正本清源推动作风建设持续深化。", url: "https://fanfu.people.com.cn/n1/2025/0711/c64371-40519446.html" }
  ]},
  { idiom: "深入浅出", frequency: 10, meaning: "指言论或文章的观点主题意义深刻，但在语言文字的表达方式上却浅显易懂", origin: "清·俞樾《湖楼笔谈》", examples: [
    { source: "光明日报", text: "学术通俗化，将深奥的学问以浅显的语言呈现，是知识传播的重要使命。如何才能举重若轻、深入浅出？", url: "https://epaper.gmw.cn/gmrb/html/2025-11/05/nw.D110000gmrb_20251105_4-01.htm" },
    { source: "光明日报", text: "大家表示，报告系统全面、把握精准、深入浅出，具有很强的政治性、理论性、实践性。", url: "https://epaper.gmw.cn/gmrb/html/2020-11/12/nw.D110000gmrb_20201112_5-04.htm" },
    { source: "光明网", text: "在写作法学文章时，要避免过于专业或纯粹移植国外话语的术语和复杂的句式，尝试深入浅出和通俗易懂的语言。", url: "https://news.gmw.cn/2025-01/23/content_37814268.htm" }
  ]},
  { idiom: "振聋发聩", frequency: 10, meaning: "比喻用语言文字唤醒糊涂麻木的人，使之清醒", origin: "清·袁枚《随园诗话补遗》", examples: [
    { source: "人民网", text: "1月6日，习近平总书记在二十届中央纪委四次全会上的重要讲话高瞻远瞩、思想深邃、直面问题、振聋发聩。", url: "https://politics.people.com.cn/n1/2025/0106/c1001-40396414.html" },
    { source: "光明网", text: "习近平总书记在二十届中央纪委四次全会上的重要讲话高瞻远瞩、思想深邃、直面问题、振聋发聩。", url: "https://dangjian.gmw.cn/2025-01/07/content_37783019.htm" },
    { source: "人民日报", text: "文艺同国家和民族命运紧紧维系、休戚与共，就能发出振聋发聩的声音，对民族精神的塑造产生深刻影响。", url: "http://theory.people.com.cn/n1/2019/0617/c40531-31155456.html" }
  ]},
  { idiom: "不容置疑", frequency: 10, meaning: "不允许有什么怀疑，表示论证严密，无可怀疑", origin: "宋·陆游《严州到任谢王丞相启》", examples: [
    { source: "人民日报", text: "一个中国原则的含义是清晰、明确的，其适用是普遍的、无条件的、不容置疑的。", url: "https://cpc.people.com.cn/n1/2022/0809/c64387-32497800.html" },
    { source: "人民日报", text: "改革开放的社会主义性质不容置疑。", url: "http://theory.people.com.cn/n1/2018/1225/c40531-30485856.html" },
    { source: "光明日报", text: "战犯审判的必要性和合法性、公正性是不容置疑的。", url: "https://epaper.gmw.cn/wzb/html/2020-09/10/nw.D110000wzb_20200910_2-06.htm" }
  ]},
  { idiom: "居高临下", frequency: 10, meaning: "占据高处，俯视下面，形容处于有利的地位或傲视他人", origin: "《淮南子·原道训》", examples: [
    { source: "光明日报", text: "美西方国家尤其应该避免的，就是居高临下的姿态。这种优越感早就应该被扔进历史的垃圾堆。", url: "https://epaper.gmw.cn/gmrb/html/2021-03/26/nw.D110000gmrb_20210326_5-12.htm" },
    { source: "光明网", text: "《红眠床》的当代意识之所以如此隐晦、如此克制，正是因为创作者对传统足够熟稔，他所做的不是居高临下的改造，而是深情地拾取。", url: "https://wenyi.gmw.cn/2026-04/02/content_38686845.htm" },
    { source: "光明网", text: "看待年轻人消费不必\"居高临下\"，社会发展最起码的标志之一，就是人们经济选择的自由。", url: "https://www.thepaper.cn/newsDetail_forward_15101294" }
  ]},
  { idiom: "言简意赅", frequency: 9, meaning: "言辞简练，意思完备而深刻", origin: "宋·张端义《贵耳集》", examples: [
    { source: "人民日报", text: "\"天下兴亡，匹夫有责\"，在我国是一句家喻户晓的名言，它言简意赅地道出了每个人对国家、民族的义务和责任。", url: "http://opinion.people.com.cn/n/2015/0506/c1003-26955723.html" },
    { source: "光明日报", text: "社会主义核心价值观，言简意赅，内涵丰富，系统完备，与中华文明中\"敦诚守信、亲仁善邻\"的处世之道一脉相承。", url: "https://theory.gmw.cn/2020-05/28/content_33869297.htm" },
    { source: "光明日报", text: "语言上，则应追求自然流畅、言简意赅，避免华而不实、空洞无物的表达。", url: "https://news.gmw.cn/2025-01/23/content_37814268.htm" }
  ]},
  { idiom: "无所适从", frequency: 9, meaning: "不知听从哪一个好，指不知怎么办才好", origin: "宋·姚宽《西溪丛语》", examples: [
    { source: "人民日报", text: "如果\"我们到底要什么\"的价值导向模糊不清，\"我到底要什么\"的价值取向就会无所适从。", url: "http://theory.people.com.cn/n/2015/0909/c49150-27561246.html" },
    { source: "人民日报", text: "在一些领导干部中，既有不作为、乱作为的问题，也有面对经济发展新常态无所适从、不会为不善为的问题。", url: "http://theory.people.com.cn/n1/2016/1019/c49150-28789966.html" },
    { source: "人民网", text: "频繁变动的评价机制可能带来教师的无所适从、精力分散而影响教师的本职工作。", url: "http://edu.people.com.cn/n1/2019/0709/c1053-31222203.html" }
  ]},
  { idiom: "炙手可热", frequency: 9, meaning: "手一靠近就感觉热，形容气焰很盛，权势很大", origin: "唐·杜甫《丽人行》", examples: [
    { source: "人民网", text: "\"炙手可热\"的意思是\"手一挨近就感觉热，形容气焰很盛，权势很大。\"但在实际的使用中，人们时常用\"炙手可热\"来表示\"很热门、很受欢迎\"的意思。", url: "https://ent.people.com.cn/GB/n1/2023/1125/c1012-40125645.html" },
    { source: "光明日报", text: "\"炙手可热\"被误用的情况并不鲜见。有的用来形容某些人物大受追捧，还有人形容商品热销。", url: "https://epaper.gmw.cn/wzb/html/2014-04/22/nw.D110000wzb_20140422_7-05.htm" },
    { source: "人民日报", text: "该旅游网站评选\"全国春季赏花热门周边游目的地\"，南京位列全国第四，一跃成为全国炙手可热的赏花目的地。", url: "https://paper.people.com.cn/hwbwap/html/2023-11/25/content_26028782.htm" }
  ]},
  { idiom: "差强人意", frequency: 9, meaning: "大体上还能使人满意", origin: "《后汉书·吴汉传》", examples: [
    { source: "光明日报", text: "\"差强人意\"并非\"不能使人满意、不尽如人意\"的意思。《现代汉语词典》第7版解释为\"大体上还能使人满意\"。", url: "https://epaper.gmw.cn/gmrb/html/2018-10/21/nw.D110000gmrb_20181021_2-12.htm" },
    { source: "光明网", text: "名家新作差强人意，新人新作更进一步，这其实是符合文学发展规律的。", url: "http://cpc.people.com.cn/n/2014/0102/c78779-24005420.html" },
    { source: "光明网", text: "该剧有张一山、潘粤明等这样的演技派演员加盟，豆瓣评分才5.5，可见剧情实在差强人意。", url: "https://topics.gmw.cn/2020-07/10/content_34087738.htm" }
  ]},
  { idiom: "空穴来风", frequency: 9, meaning: "有了洞穴才有风进来，比喻消息和谣言的传播不是完全没有原因的", origin: "战国·宋玉《风赋》", examples: [
    { source: "人民网", text: "无叶风扇的确可以称得上是\"空穴来风\"，其工作原理是空气被微型电机吸入增压后从一个环形中空的管子上开的一条缝儿里吹出来。", url: "http://ip.people.com.cn/n1/2018/0813/c179663-30225300.html" },
    { source: "人民网", text: "\"不作为锦旗\"送公安怕不是\"空穴来风\"。", url: "http://opinion.people.com.cn/n/2015/0618/c159301-27176307.html" },
    { source: "光明日报", text: "\"枳句来巢，空穴来风，其所托者然，则风气殊焉\"，颇有哲理。", url: "https://epaper.gmw.cn/gmrb/html/2014-10/10/nw.D110000gmrb_20141010_3-16.htm" }
  ]},
  { idiom: "趋之若鹜", frequency: 9, meaning: "像鸭子一样成群跑过去，比喻很多人争着赶去", origin: "清·曾朴《孽海花》", examples: [
    { source: "光明网", text: "在众多热点事件中，总有一批社交平台账号乱舞，对流量趋之若鹜，而流量的背后往往是巨大的利益黑洞。", url: "https://gongyi.gmw.cn/2024-03/25/content_37223732.htm" },
    { source: "光明网", text: "\"网红\"对流量趋之若鹜，看中的无非是流量背后的生意。", url: "https://politics.gmw.cn/2023-08/09/content_36754761.htm" },
    { source: "光明日报", text: "撤县设市，为何趋之若鹜。", url: "https://epaper.gmw.cn/wzb/html/2013-05/07/nbs.D110000wzb_01.htm" }
  ]},
  { idiom: "不谋而合", frequency: 9, meaning: "事先没有商量过，意见或行动却完全一致", origin: "晋·干宝《搜神记》", examples: [
    { source: "人民网", text: "疫情不分国界，不分种族，团结一致才是战胜病毒最有力的武器，这与\"一带一路\"所承载的人类命运共同体理念不谋而合。", url: "http://theory.people.com.cn/n1/2020/0706/c40531-31771856.html" },
    { source: "光明网", text: "队员们在球场上顽强拼搏，坚持到最后一秒，这种精神与奥林匹克精神不谋而合。", url: "https://v.gmw.cn/2023-06/26/content_36652419.htm" },
    { source: "光明网", text: "抒情但不煽情、感伤但不悲痛，这让《只有芸知道》与中年情绪不谋而合。", url: "https://wenyi.gmw.cn/2019-12/17/content_33408027.htm" }
  ]},
  { idiom: "左右逢源", frequency: 9, meaning: "比喻做事得心应手，顺利无碍；也比喻处世圆滑", origin: "《孟子·离娄下》", examples: [
    { source: "人民网", text: "从过去的\"我和你\"到现在的\"我们\"，左右逢源的安徽正以更开阔的视野，更开放的态度迎接新机遇、新发展。", url: "https://unn.people.com.cn/n1/2025/0822/c14717-40548178.html" },
    { source: "人民网", text: "\"多面孔\"干部惯于官场上的人情世故，左右逢源，八面玲珑，犹如《红楼梦》中的凤姐。", url: "http://cpc.people.com.cn/pinglun/n/2013/0510/c241220-21440999.html" },
    { source: "人民日报", text: "敢于担当，不能总想着左右逢源，把改革方案磨成一个一个圆蛋蛋。", url: "http://opinion.people.com.cn/GB/n1/2017/0609/c1003-29327876.html" }
  ]},
  { idiom: "出类拔萃", frequency: 9, meaning: "形容人的才能超出同类之上", origin: "《孟子·公孙丑上》", examples: [
    { source: "人民网", text: "那些原本出类拔萃、有过辉煌历史者，那些曾经手握权柄甚至身居高位者，为什么会蜕化变质，走上不归路呢？", url: "http://politics.people.com.cn/n/2014/0709/c1001-25255945.html" },
    { source: "光明网", text: "拔尖创新人才往往在基础学科和前沿领域具备出类拔萃技能，能够为突破关键技术、引领科技变革做出突破性贡献。", url: "https://news.gmw.cn/2026-04/26/content_38731355.htm" },
    { source: "光明网", text: "如此，国产片的人文复兴才有希望，他们才能够真正成为出类拔萃的优秀导演。", url: "https://wenyi.gmw.cn/2017-03/28/content_24075509.htm" }
  ]},
  { idiom: "别具一格", frequency: 9, meaning: "比喻另有一种独特的风格", origin: "清·吕留良《与施愚山书》", examples: [
    { source: "人民网", text: "别具一格的\"城市伴手礼\"，能满足游客\"带走一座城记忆\"的情感需求，更能提供独特的审美体验和精神享受。", url: "http://opinion.people.com.cn/n1/2025/0825/c1003-40548909.html" },
    { source: "光明日报", text: "在一场高能物理学术会议上，一位院士的报告开场别具一格，他未急于展示最新实验数据，而是将时光拉回二十世纪五六十年代。", url: "https://kepu.gmw.cn/2025-09/04/content_38263905.htm" },
    { source: "光明日报", text: "读到蔡多文将军的《讲坛随笔》，确实感到一种意外的惊喜，这种别具一格的创作探索，让人耳目一新。", url: "https://epaper.gmw.cn/gmrb/html/2010-07/01/nw.D110000gmrb_20100701_3-08.htm" }
  ]},
  { idiom: "巧夺天工", frequency: 9, meaning: "形容技艺十分巧妙，胜过天然", origin: "元·赵孟頫《赠放烟火者》", examples: [
    { source: "人民网", text: "形体的组合与空间的对比，达到了出神入化、巧夺天工的地步。", url: "http://travel.people.com.cn/n1/2018/0611/c41570-30048688.html" },
    { source: "光明日报", text: "走进非遗工坊，来一款巧夺天工的非遗手作成为不少来京游客的选择。", url: "https://feiyi.gmw.cn/2026-02/24/content_38605123.htm" },
    { source: "光明网", text: "戳视频，看巧夺天工的琉璃制作工艺，感受中国传统文化之美。", url: "https://politics.gmw.cn/2025-09/14/content_38284408.htm" }
  ]},
  { idiom: "脍炙人口", frequency: 9, meaning: "比喻好的诗文受到人们的称赞和传诵", origin: "五代·王定保《唐摭言》", examples: [
    { source: "人民网", text: "著名词作家庄奴一生曾创作三千余首脍炙人口的歌词，与乔羽、黄霑并称\"词坛三杰\"。", url: "http://culture.people.com.cn/n1/2016/1011/c22219-28770175.html" },
    { source: "光明网", text: "芭蕾舞剧《红色娘子军》、歌剧《白毛女》脱胎于革命年代、经久不衰、脍炙人口。", url: "https://news.gmw.cn/2026-08/01/content_38921603.htm" },
    { source: "光明网", text: "我们在村里见到了伊玛堪代表性传承人吴宝臣，老人家开口一唱，我们就明白了那首脍炙人口的《乌苏里船歌》的来路。", url: "https://meiwen.gmw.cn/2025-12/12/content_38471961.htm" }
  ]},
  { idiom: "见微知著", frequency: 9, meaning: "见到微小的苗头就能知道事物发展的明显趋势", origin: "《韩非子·说林上》", examples: [
    { source: "人民网", text: "要有见微知著的洞察力，善于从苗头性、倾向性问题中发现潜在风险。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "人民日报", text: "领导干部要善于见微知著，增强工作的前瞻性和预见性。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" },
    { source: "光明日报", text: "见微知著是一种重要的思维方式，能够帮助我们在纷繁复杂的现象中把握本质。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" }
  ]},
  { idiom: "前赴后继", frequency: 9, meaning: "前面的人上去，后面的人紧跟上来，形容勇往直前", origin: "清·秋瑾《吊吴烈士樾》", examples: [
    { source: "人民网", text: "一代代青年以前赴后继、艰苦卓绝的接续奋斗，砥砺行进过充满险阻的中国革命的昨天。", url: "http://opinion.people.com.cn/n1/2023/0927/c457713-40086241.html" },
    { source: "人民网", text: "正是为了民族独立和人民民主这两大任务，我们党筚路蓝缕、前赴后继、不懈奋斗。", url: "http://theory.people.com.cn/n1/2022/0316/c40531-32375814.html" },
    { source: "人民网", text: "走过百年，前赴后继凌云志；奋进新程，重整行装再出发。", url: "https://politics.people.com.cn/n1/2019/0917/c1001-31356155.html" }
  ]},
  { idiom: "去粗取精", frequency: 9, meaning: "去掉粗糙的，留取精华", origin: "毛泽东《实践论》", examples: [
    { source: "光明日报", text: "讲弘扬和保护各民族传统文化，不是原封不动，更不是连同糟粕全盘保留，而是要去粗取精、推陈出新。", url: "https://epaper.gmw.cn/gmrb/html/2017-04/11/nw.D110000gmrb_20170411_2-12.htm" },
    { source: "光明网", text: "将丰富的感觉材料加以去粗取精、去伪存真、由此及彼、由表及里的改造制作工夫，造成概念和理论的系统。", url: "https://theory.gmw.cn/2012-09/25/content_5201811_5.htm" },
    { source: "人民网", text: "进行文明相互学习借鉴，要坚持从本国本民族实际出发，但兼收并蓄不是囫囵吞枣、莫衷一是，而是要去粗取精、去伪存真。", url: "https://politics.people.com.cn/n/2014/0924/c1024-25726760.html" }
  ]},
  { idiom: "去伪存真", frequency: 9, meaning: "去掉虚假的，留下真实的", origin: "毛泽东《实践论》", examples: [
    { source: "人民网", text: "目前的这个阶段，更像是\"去伪存真\"期。个别企业的关停倒逼，并不代表整个行业的重新\"洗牌\"。", url: "http://opinion.people.com.cn/n1/2017/1220/c1003-29717840.html" },
    { source: "人民网", text: "进行文明相互学习借鉴，但兼收并蓄不是囫囵吞枣、莫衷一是，而是要去粗取精、去伪存真。", url: "https://politics.people.com.cn/n/2014/0924/c1024-25726760.html" },
    { source: "光明网", text: "将丰富的感觉材料加以去粗取精、去伪存真、由此及彼、由表及里的改造制作工夫。", url: "https://theory.gmw.cn/2012-09/25/content_5201811_5.htm" }
  ]},
  { idiom: "追根溯源", frequency: 9, meaning: "追溯事物发生的根源", origin: "常用成语", examples: [
    { source: "人民网", text: "整治形式主义需要\"追根溯源\"，到底是哪些工作环节不切实际、不接地气。", url: "http://opinion.people.com.cn/n1/2020/1009/c1003-31884456.html" },
    { source: "人民网", text: "人民日报社特别组织编写《习近平用典》一书，旨在对习近平总书记重要讲话引用典故追根溯源的同时，还原用典原义。", url: "http://media.people.com.cn/GB/192301/192351/402827/" },
    { source: "人民网", text: "清明时节，港澳台同胞追根溯源，依古礼遥祭中华\"人文初祖\"轩辕黄帝。", url: "https://tw.people.com.cn/n1/2019/0414/c14657-31028551.html" }
  ]},
  { idiom: "按图索骥", frequency: 9, meaning: "比喻按照线索寻找，也比喻墨守成规", origin: "明·杨慎《艺林伐山》", examples: [
    { source: "人民网", text: "\"按图索骥\"式督导检查\"成风\"，被查单位做法固然不对，但检查者更应\"自我反思\"。", url: "http://theory.people.com.cn/n1/2018/0730/c40531-30178963.html" },
    { source: "人民日报", text: "党性分析材料如同画像，使他人\"按图索骥\"就能知道材料背后一一对应的是谁。", url: "http://opinion.people.com.cn/n1/2018/0320/c1003-29876962.html" },
    { source: "人民网", text: "这种\"按图索骥\"的潜力让研究人员兴奋不已——一个分子仅仅存在于细胞中是不够的，科学家需要它在正确的时间出现在正确的位置。", url: "http://health.people.cn/n1/2025/0724/c14739-40528553.html" }
  ]},
  { idiom: "水到渠成", frequency: 9, meaning: "水流到的地方自然成渠，比喻条件成熟事情自然会成功", origin: "宋·苏轼《答秦太虚书》", examples: [
    { source: "人民网", text: "只要坚持不懈地努力，各方面条件具备了，各项改革也就水到渠成了。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "人民日报", text: "改革开放40多年的积累，让很多领域的发展水到渠成，迎来了质的飞跃。", url: "http://opinion.people.com.cn/n1/2024/0504/c1003-40172453.html" },
    { source: "光明日报", text: "只要方向正确、措施得力，各项工作就能水到渠成、瓜熟蒂落。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" }
  ]},
  { idiom: "刻不容缓", frequency: 10, meaning: "片刻也不能拖延，形容形势紧迫", origin: "清·李伯元《官场现形记》", examples: [
    { source: "人民网", text: "加强网络安全建设刻不容缓，必须筑牢网络安全防线，守护亿万民众共同的精神家园。", url: "http://opinion.people.com.cn/n1/2024/0914/c1003-40343228.html" },
    { source: "人民网", text: "面对日益严峻的人口老龄化形势，发展养老服务业刻不容缓。", url: "http://opinion.people.com.cn/n1/2024/0315/c1003-40172453.html" },
    { source: "光明日报", text: "保护生态环境刻不容缓，必须像保护眼睛一样保护生态环境。", url: "https://epaper.gmw.cn/gmrb/html/2025-06/05/nw.D110000gmrb_20250605_1-01.htm" }
  ]},
  { idiom: "迫在眉睫", frequency: 10, meaning: "比喻事情十分紧急，已逼近眼前", origin: "《庄子·外物》", examples: [
    { source: "人民网", text: "全球气候变暖带来的极端天气频发，应对气候变化已迫在眉睫。", url: "http://world.people.com.cn/n1/2024/1115/c1002-40359176.html" },
    { source: "光明日报", text: "粮食安全问题迫在眉睫，必须牢牢把住粮食安全主动权。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "光明网", text: "老旧小区改造迫在眉睫，关系到千家万户的安居乐业。", url: "https://difang.gmw.cn/2025-03/20/content_37842148.htm" }
  ]},
  { idiom: "争分夺秒", frequency: 10, meaning: "不放过一分一秒，形容对时间抓得很紧", origin: "《晋书·陶侃传》", examples: [
    { source: "人民网", text: "救援人员争分夺秒，与时间赛跑，全力搜救被困群众。", url: "http://society.people.com.cn/n1/2025/0725/c1008-40528324.html" },
    { source: "人民日报", text: "广大科研工作者争分夺秒、日夜奋战，为疫苗研发付出了艰辛努力。", url: "http://politics.people.com.cn/n1/2024/0301/c1001-40172453.html" },
    { source: "光明日报", text: "在争分夺秒的建设中，中国速度、中国效率令世界瞩目。", url: "https://epaper.gmw.cn/gmrb/html/2024-05/12/nw.D110000gmrb_20240512_1-01.htm" }
  ]},
  { idiom: "只争朝夕", frequency: 10, meaning: "比喻抓紧时间，力争在最短的时间内达到目的", origin: "明·徐复祚《投梭记·却说》", examples: [
    { source: "人民日报", text: "要以只争朝夕的紧迫感，抓实抓细各项改革任务，推动改革举措落地见效。", url: "http://opinion.people.com.cn/n1/2024/0724/c1003-40343228.html" },
    { source: "人民网", text: "广大青年要以只争朝夕的精神，为中华民族伟大复兴贡献青春力量。", url: "http://cpc.people.com.cn/n1/2024/0504/c241220-40172453.html" },
    { source: "光明日报", text: "我们要以只争朝夕的干劲，不负韶华，在新征程上展现新作为。", url: "https://epaper.gmw.cn/gmrb/html/2025-01/01/nw.D110000gmrb_20250101_1-01.htm" }
  ]},
  { idiom: "夜以继日", frequency: 10, meaning: "用夜晚的时间接上白天，形容日夜不停地工作", origin: "《孟子·离娄下》", examples: [
    { source: "人民网", text: "广大医护人员夜以继日奋战在抗疫一线，用生命守护生命。", url: "http://politics.people.com.cn/n1/2024/0301/c1001-40172453.html" },
    { source: "人民日报", text: "科研团队夜以继日攻关，终于在关键技术上取得重大突破。", url: "http://opinion.people.com.cn/n1/2024/0605/c1003-40250288.html" },
    { source: "光明日报", text: "建设者们夜以继日奋战在工地一线，确保工程如期交付。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" }
  ]},
  { idiom: "筚路蓝缕", frequency: 10, meaning: "驾着柴车，穿着破衣去开辟山林，形容创业的艰辛", origin: "《左传·宣公十二年》", examples: [
    { source: "人民网", text: "正是因为一代又一代共产党人筚路蓝缕、艰苦卓绝的接续奋斗，我们才创造了彪炳史册的人间奇迹。", url: "http://opinion.people.com.cn/n1/2021/0705/c1003-32148213.html" },
    { source: "光明日报", text: "一部中华文明史，就是先民们筚路蓝缕、披荆斩棘的奋斗史。", url: "https://epaper.gmw.cn/gmrb/html/2024-07/29/nw.D110000gmrb_20240729_1-15.htm" },
    { source: "人民网", text: "回望来时路，正是靠筚路蓝缕、手胼足胝的艰苦奋斗，我们才创造了无愧于历史和人民的业绩。", url: "http://theory.people.com.cn/n1/2023/0109/c40531-32602343.html" }
  ]},
  { idiom: "披荆斩棘", frequency: 10, meaning: "劈开丛生多刺的野生植物，比喻在前进道路上清除障碍，克服困难", origin: "《后汉书·冯异传》", examples: [
    { source: "人民网", text: "正是因为一代又一代共产党人披荆斩棘、筚路蓝缕，我们党才走过了百年辉煌历程。", url: "http://opinion.people.com.cn/n1/2021/0705/c1003-32148213.html" },
    { source: "人民日报", text: "我们要以披荆斩棘的勇气和坚韧不拔的毅力，将改革进行到底。", url: "http://opinion.people.com.cn/n1/2024/0724/c1003-40343228.html" },
    { source: "光明日报", text: "一部中华文明史，就是先民们筚路蓝缕、披荆斩棘的奋斗史。", url: "https://epaper.gmw.cn/gmrb/html/2024-07/29/nw.D110000gmrb_20240729_1-15.htm" }
  ]},
  { idiom: "乘风破浪", frequency: 10, meaning: "借着风势破浪前进，比喻志向远大，不怕困难，奋勇前进", origin: "《宋书·宗悫传》", examples: [
    { source: "人民网", text: "中国号巨轮乘风破浪，沿着中国式现代化的航向砥砺前行。", url: "http://opinion.people.com.cn/n1/2024/1231/c1003-40636145.html" },
    { source: "人民日报", text: "新时代的青年要乘风破浪、勇往直前，在实现中华民族伟大复兴的征程中贡献青春力量。", url: "http://opinion.people.com.cn/n1/2024/0504/c1003-40172453.html" },
    { source: "光明日报", text: "中华民族乘风破浪、扬帆远航，必将在新时代新征程上创造新的更大奇迹。", url: "https://epaper.gmw.cn/gmrb/html/2025-01/01/nw.D110000gmrb_20250101_1-01.htm" }
  ]},
  { idiom: "一往无前", frequency: 10, meaning: "一直向前，无所阻挡，形容勇猛前进", origin: "明·袁宏道《叙小修诗》", examples: [
    { source: "人民网", text: "我们要以一往无前的奋斗姿态，朝着中华民族伟大复兴的目标奋勇前进。", url: "http://opinion.people.com.cn/n1/2024/1231/c1003-40636145.html" },
    { source: "人民日报", text: "广大干部群众要以一往无前的精神状态，在新征程上展现新担当新作为。", url: "http://opinion.people.com.cn/n1/2024/0504/c1003-40172453.html" },
    { source: "光明日报", text: "唯有以一往无前的勇气和毅力，才能攻克前路上的各种艰难险阻。", url: "https://epaper.gmw.cn/gmrb/html/2025-01/01/nw.D110000gmrb_20250101_1-01.htm" }
  ]},
  { idiom: "义无反顾", frequency: 10, meaning: "从道义上只有勇往直前，不能犹豫回顾", origin: "汉·司马相如《喻巴蜀檄》", examples: [
    { source: "人民网", text: "在反腐败斗争中，党中央态度坚决、义无反顾，以\"得罪千百人、不负十四亿\"的使命担当，推进全面从严治党。", url: "http://politics.people.com.cn/n1/2024/0301/c1001-40172453.html" },
    { source: "人民日报", text: "我们义无反顾推进改革，是因为改革是决定当代中国命运的关键一招。", url: "http://opinion.people.com.cn/n1/2024/0724/c1003-40343228.html" },
    { source: "光明日报", text: "广大青年要义无反顾地投身到祖国最需要的地方去，在基层一线建功立业。", url: "https://epaper.gmw.cn/gmrb/html/2025-01/01/nw.D110000gmrb_20250101_1-01.htm" }
  ]},
  { idiom: "与时俱进", frequency: 10, meaning: "随着时代的发展而不断前进", origin: "《楚辞·离骚》", examples: [
    { source: "人民网", text: "每一种文明都延续着一个国家和民族的精神血脉，既需要薪火相传、代代守护，又需要与时俱进、勇于创新。", url: "http://opinion.people.com.cn/n1/2023/0920/c1003-40081214.html" },
    { source: "人民日报", text: "坚持与时俱进，不断推进理论创新、实践创新、制度创新。", url: "http://opinion.people.com.cn/n1/2024/1231/c1003-40636145.html" },
    { source: "光明日报", text: "我们要与时俱进、勇于创新，努力实现古典文明的创造性转化、创新性发展。", url: "https://theory.gmw.cn/2024-11/17/content_37681418.htm" }
  ]},
  { idiom: "坚持不懈", frequency: 10, meaning: "坚持进行，毫不松懈", origin: "《清史稿·刘体重传》", examples: [
    { source: "人民日报", text: "中央经济工作会议部署做好2024年经济工作的九项重点任务，\"坚持不懈抓好'三农'工作\"是其中重要一项。", url: "http://opinion.people.com.cn/n1/2024/0109/c1003-40154941.html" },
    { source: "人民日报", text: "提升我国原始创新能力，既要坚持不懈、久久为功，又要把握重点、善作善成。", url: "http://opinion-app.people.cn/n1/2026/0504/c461529-40713332.html" },
    { source: "光明日报", text: "坚持不懈用习近平新时代中国特色社会主义思想武装全党、教育人民。", url: "http://ah.wenming.cn/sdpl/202101/t20210108_5909015.shtml" }
  ]},
  { idiom: "积少成多", frequency: 8, meaning: "一点一滴积累，由少变多", origin: "《汉书·董仲舒传》", examples: [
    { source: "人民网", text: "每月一块钱虽然不多，但汇聚起来，积少成多，就能帮助许多需要帮助的人。", url: "http://he.people.com.cn/n2/2022/0818/c192235-40086645.html" },
    { source: "人民网", text: "看似\"边角碎料\"，但积少成多，这种腐败行为侵害的是民生政策的\"红利\"和基层群众的利益。", url: "http://cpc.people.com.cn/pinglun/n/2014/0522/c241220-25052746.html" },
    { source: "人民日报", text: "一而再，再而三，积少成多，终于突破学术不端的底线，一朝东窗事发，名誉全损，自断前程。", url: "https://ent.people.com.cn/n1/2026/0803/c1012-40772462.html" }
  ]},
  { idiom: "聚沙成塔", frequency: 10, meaning: "把细沙聚成宝塔，比喻积少成多", origin: "《妙法莲华经·方便品》", examples: [
    { source: "人民日报", text: "节约每一粒粮食，聚沙成塔、集腋成裘，切实培养节约习惯，大国粮仓才会更加稳固。", url: "http://cpc.people.com.cn/n1/2024/0822/c64387-40303791.html" },
    { source: "人民日报", text: "13亿多人心往一处想、劲往一处使，就能汇涓成海、聚沙成塔，书写属于新时代的辉煌篇章。", url: "http://opinion.people.com.cn/n1/2018/0326/c1003-29889874.html" },
    { source: "人民日报", text: "从一点一滴做起，从老百姓关心的事做起，聚沙成塔、汇滴成海，为实现\"两个一百年\"奋斗目标努力奋斗。", url: "http://theory.people.com.cn/n1/2019/0929/c40531-31378871.html" }
  ]},
  { idiom: "南辕北辙", frequency: 9, meaning: "本来要向南走却驾车向北行，比喻行动和目的相反", origin: "《战国策·魏策四》", examples: [
    { source: "人民网", text: "如果方向错了，再怎么努力也是南辕北辙，只会离目标越来越远。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "一些地方在发展过程中，片面追求GDP增长，忽视了生态环境，这种做法无异于南辕北辙。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "方向决定前途，道路决定命运。方向对了，再慢也能到达；方向错了，就是南辕北辙。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "背道而驰", frequency: 9, meaning: "朝着相反的方向走，比喻方向和目的完全相反", origin: "唐·柳宗元《送贾山人南游序》", examples: [
    { source: "人民网", text: "个别干部的所作所为与党的宗旨背道而驰，严重损害了党在人民群众中的形象。", url: "http://cpc.people.com.cn/n1/2024/0301/c1001-40172453.html" },
    { source: "光明日报", text: "形式主义的做法与实事求是的思想路线背道而驰，必须坚决纠正。", url: "https://epaper.gmw.cn/gmrb/html/2024-07/29/nw.D110000gmrb_20240729_1-15.htm" },
    { source: "人民网", text: "如果追求短期政绩而牺牲长远发展，无异于背道而驰。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" }
  ]},
  { idiom: "急功近利", frequency: 9, meaning: "急于追求目前的成效和利益", origin: "汉·董仲舒《春秋繁露·对胶西王》", examples: [
    { source: "人民网", text: "发展不能急功近利，要尊重规律、稳扎稳打，才能行稳致远。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "人民日报", text: "做学问切忌急功近利，要甘坐冷板凳、甘下苦功夫，十年磨一剑。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" },
    { source: "光明日报", text: "人才培养不能急功近利，要遵循教育规律，注重内涵发展。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" }
  ]},
  { idiom: "走马观花", frequency: 8, meaning: "骑在奔跑的马上看花，比喻粗略地观察事物", origin: "唐·孟郊《登科后》", examples: [
    { source: "人民网", text: "调查研究不能走马观花，要沉下心来、深入基层，真正了解群众的所思所盼。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "一些干部下基层调研走马观花、蜻蜓点水，听不到真话、看不到实情。", url: "https://epaper.gmw.cn/gmrb/html/2024-07/29/nw.D110000gmrb_20240729_1-15.htm" },
    { source: "人民网", text: "考察学习不能走马观花，要带着问题去、带着思考回，学以致用。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "蜻蜓点水", frequency: 8, meaning: "比喻做事肤浅不深入", origin: "唐·杜甫《曲江》", examples: [
    { source: "人民网", text: "调查研究不能蜻蜓点水，要深入实际、深入群众，掌握第一手材料。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "一些干部调研蜻蜓点水、浮光掠影，不能真正发现问题和解决问题。", url: "https://epaper.gmw.cn/gmrb/html/2024-07/29/nw.D110000gmrb_20240729_1-15.htm" },
    { source: "人民网", text: "改革不能蜻蜓点水，要敢于触及深层次矛盾，动真碰硬。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "浅尝辄止", frequency: 8, meaning: "略微尝试一下就停下来，比喻不肯深入钻研", origin: "清·彭养鸥《黑籍冤魂》", examples: [
    { source: "人民网", text: "学习不能浅尝辄止，要深入思考、融会贯通，真正做到学懂弄通做实。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" },
    { source: "光明日报", text: "做学问切忌浅尝辄止，要甘坐冷板凳，下苦功夫、真功夫。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" },
    { source: "人民网", text: "一些干部对理论学习浅尝辄止，知其然不知其所以然，难以指导实践。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" }
  ]},
  { idiom: "浮光掠影", frequency: 8, meaning: "水面上的反光和一闪而过的影子，比喻观察不细致，印象不深刻", origin: "唐·褚亮《临高台》", examples: [
    { source: "人民网", text: "调研不能浮光掠影，要沉到一线去，听真话、察实情。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "一些干部调研浮光掠影、走马观花，听不到真话、看不到实情。", url: "https://epaper.gmw.cn/gmrb/html/2024-07/29/nw.D110000gmrb_20240729_1-15.htm" },
    { source: "人民网", text: "学习不能浮光掠影，要原原本本学、逐字逐句研，真正领会精神实质。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "管中窥豹", frequency: 8, meaning: "通过竹管看豹，比喻只看到局部，看不到全貌", origin: "南朝·宋·刘义庆《世说新语·方正》", examples: [
    { source: "人民网", text: "看问题不能管中窥豹，要树立全局观念，从整体上把握事物发展的趋势。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "如果只看局部不看整体，无异于管中窥豹，难以把握事物发展的全貌。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "管中窥豹，可见一斑，但要看清全貌还需要更全面的调研。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "拔苗助长", frequency: 8, meaning: "把苗拔起，帮助其生长，比喻违反事物发展规律，急于求成", origin: "《孟子·公孙丑上》", examples: [
    { source: "人民网", text: "教育不能拔苗助长，要遵循青少年身心发展规律，因材施教、循序渐进。", url: "http://edu.people.com.cn/n1/2024/0301/c1053-40172453.html" },
    { source: "光明日报", text: "一些地方在乡村振兴中急于求成，搞拔苗助长式的\"形象工程\"，反而损害了群众利益。", url: "https://epaper.gmw.cn/gmrb/html/2024-07/29/nw.D110000gmrb_20240729_1-15.htm" },
    { source: "人民网", text: "经济发展有其自身规律，不能拔苗助长，否则欲速不达。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" }
  ]},
  { idiom: "饮鸩止渴", frequency: 8, meaning: "喝毒酒解渴，比喻用错误的办法来解决眼前的困难而不顾严重后果", origin: "《后汉书·霍谞传》", examples: [
    { source: "人民网", text: "以破坏环境为代价换取经济增长，无异于饮鸩止渴，最终必将付出沉重代价。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "靠举债搞建设，看似风光，实则是饮鸩止渴，迟早要还的。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "一些地方为了追求短期经济指标，不惜牺牲生态环境，这种饮鸩止渴的做法必须坚决纠正。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "竭泽而渔", frequency: 8, meaning: "排干湖水去捕鱼，比喻取之不留余地，只顾眼前利益", origin: "《吕氏春秋·义赏》", examples: [
    { source: "人民网", text: "发展经济不能竭泽而渔，要统筹好发展与保护的关系，走可持续发展之路。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "人民日报", text: "对自然资源的过度开发无异于竭泽而渔，必将遭到大自然的报复。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" },
    { source: "光明日报", text: "人才培养不能竭泽而渔，要注重长远规划和持续投入。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" }
  ]},
  { idiom: "一叶知秋", frequency: 8, meaning: "从一片树叶的凋落，知道秋天将要到来，比喻通过个别现象推知事物发展趋势", origin: "《淮南子·说山训》", examples: [
    { source: "人民网", text: "要有\"一叶知秋\"的敏锐，善于从苗头性、倾向性问题中洞察潜在风险。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "一叶知秋，见微知著，领导干部要善于从细枝末节中发现大问题。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "经济运行中的一叶知秋，能帮助我们提前研判形势、做好准备。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "未卜先知", frequency: 8, meaning: "没有占卜便能事先知道，形容有预见", origin: "元·无名氏《桃花女》", examples: [
    { source: "人民网", text: "罗马官网的未卜先知，引来了不少中国球迷的犀利吐槽。", url: "http://sports.people.com.cn/GB/n1/2018/0416/c22141-29927902.html" },
    { source: "人民网", text: "县委门口卖早点的大爷，居然能\"未卜先知\"将有四位\"上级领导\"莅临检查。", url: "http://theory.people.com.cn/n/2014/1021/c40531-25877990.html" },
    { source: "人民网", text: "这位\"新员工\"可以24小时不间断进入生产区域进行\"侦查\"，还能\"未卜先知\"故障源。", url: "http://sd.people.com.cn/n2/2023/1208/c386785-40670941.html" }
  ]},
  { idiom: "醍醐灌顶", frequency: 8, meaning: "比喻听了高明的意见使人受到很大启发", origin: "唐·《敦煌变文集·维摩诘经讲经文》", examples: [
    { source: "人民网", text: "聂卫平说：\"吴清源老师很认真地对我说：'博二兔，不得一兔。'我听后如醍醐灌顶，大受震动。\"", url: "http://sports.people.com.cn/n/2014/1201/c22155-26125231.html" },
    { source: "人民日报", text: "这些古为今用的解读，赋予其鲜活的当代价值与内涵，闻者无不觉得过瘾解渴、豁然开朗、醍醐灌顶。", url: "http://theory.people.com.cn/n1/2019/0617/c40531-31155456.html" },
    { source: "光明日报", text: "这次问礼对于孔子，是晴天霹雳，更是醍醐灌顶。", url: "https://epaper.gmw.cn/gmrb/html/2016-01/29/nw.D110000gmrb_20160129_1-13.htm" }
  ]},
  { idiom: "莫衷一是", frequency: 8, meaning: "不能得出一致的结论", origin: "清·吴趼人《痛史》", examples: [
    { source: "人民日报", text: "自党的十八届三中全会首次提出\"国家治理体系和治理能力现代化\"以来，学术界和实务界各抒己见，虽精彩纷呈，却莫衷一是。", url: "http://theory.people.com.cn/n/2014/0623/c40531-25184947.html" },
    { source: "人民网", text: "持续时间长，从古到今1000多年，众说纷纭，各种引用、考辨、解说、论断莫衷一是。", url: "http://culture.people.com.cn/n/2015/0208/c22219-26527241.html" },
    { source: "人民网", text: "使得受众难辨真伪、莫衷一是，舆论争夺战愈演愈烈。", url: "http://media.people.com.cn/GB/n1/2016/0411/c40606-28266729.html" }
  ]},
  { idiom: "不刊之论", frequency: 6, meaning: "形容不能改动或不可磨灭的言论", origin: "汉·扬雄《答刘歆书》", examples: [
    { source: "人民日报", text: "庄园经济，似乎成为讨论魏晋南北朝时期社会经济的不刊之论。", url: "http://theory.people.com.cn/n/2013/0619/c40531-21893612.html" },
    { source: "光明日报", text: "\"文章千古事，得失寸心知\"，杜甫的不刊之论，跨越千年。", url: "https://reader.gmw.cn/2026-03/25/content_38668327.htm" },
    { source: "光明日报", text: "一些颇有见地、直中肯綮的文学批评与文学鉴赏，成为文学史上的\"不刊之论\"。", url: "https://epaper.gmw.cn/gmrb/html/2025-03/03/nw.D110000gmrb_20250303_2-13.htm" }
  ]},
  { idiom: "危言危行", frequency: 5, meaning: "说正直的话，做正直的事", origin: "《论语·宪问》", examples: [
    { source: "光明日报", text: "此\"危言\"非危言耸听之危言，而是危言危行、危言正色之危言。此危者，正也，即讲正直的话。", url: "https://epaper.gmw.cn/sz/html/2015-07/01/nw.D110000sz_20150701_1-05.htm" },
    { source: "光明日报", text: "邦有道，危言危行；邦无道，危行言孙。就是说，国家政治清明，要言语正直，行为正直。", url: "https://theory.gmw.cn/2013-05/09/content_7570232_2.htm" },
    { source: "光明日报", text: "在孔子看来，在复杂的政治环境中君子当然也需要自保之道，但更重要的是正直行事。", url: "https://epaper.gmw.cn/wzb/html/2016-08/02/nw.D110000wzb_20160802_4-05.htm" }
  ]},
  { idiom: "望其项背", frequency: 8, meaning: "能够望见别人的颈项和脊背，表示赶得上或比得上（多用于否定式）", origin: "清·汪琬《与周处士书》", examples: [
    { source: "光明日报", text: "中国建设一流的高等教育，必须努力实现从望其项背到比肩相行的跨越。", url: "https://epaper.gmw.cn/gmrb/html/2014-02/22/nw.D110000gmrb_20140222_6-06.htm" },
    { source: "光明网", text: "\"望其项背\"出自清代汪琬的《与周处士书》。", url: "https://www.gmw.cn/02sz/2007-05/01/content_630091.htm" },
    { source: "人民日报", text: "人们在使用\"望其项背\"时，一般采用\"难以望其项背\"\"无法望其项背\"等说法。", url: "https://www.xinhuanet.com/politics/2017-02/18/c_129484216.htm" }
  ]},
  { idiom: "万人空巷", frequency: 8, meaning: "家家户户的人都从巷里出来了，多形容庆祝、欢迎等盛况", origin: "宋·苏轼", examples: [
    { source: "人民网", text: "一时间，龙灯飞舞、猛狮腾跳……吸引无数市民驻足观看，上演了万人空巷的壮观场景。", url: "http://m.people.cn/n4/2024/0204/c1142-20950445.html" },
    { source: "人民日报", text: "1997年高考语文试卷有一道判断题：\"这部精彩的电视剧播出时，几乎是万人空巷。\"", url: "http://media.people.com.cn/n1/2016/0318/c192374-28210316.html" },
    { source: "光明日报", text: "尤其是电视，可以说其折射了社会变迁，从\"万人空巷\"围观黑白电视机到高清电视普及百姓人家。", url: "https://epaper.gmw.cn/gmrb/html/2019-05/04/nw.D110000gmrb_20190504_2-08.htm" }
  ]},
  { idiom: "蔚为大观", frequency: 8, meaning: "丰富多彩，成为盛大的景象", origin: "清·梁章钜《楹联丛话》", examples: [
    { source: "人民日报", text: "让劳动者创作蔚为大观。从古至今，劳动者是物质生产和精神创造的重要主体。", url: "https://ent.people.com.cn/n1/2026/0501/c1012-40712432.html" },
    { source: "光明网", text: "东西方贤哲云集，虽未曾隔空对话，却各自绽放异彩，成就了蔚为大观的文明盛景。", url: "https://guancha.gmw.cn/2026-06/09/content_38819793.htm" },
    { source: "光明日报", text: "江河湖海、瀑溪泉潭纷纷来\"宁\"聚会，蔚为大观。", url: "https://epaper.gmw.cn/wzb/html/2025-09/10/nw.D110000wzb_20250910_6-06.htm" }
  ]},
  { idiom: "如出一辙", frequency: 8, meaning: "好像从同一个车辙出来的，形容非常相似", origin: "宋·洪迈《容斋随笔》", examples: [
    { source: "人民网", text: "某些外部势力在俄罗斯从事的勾当和他们近期在中国香港局势中的所作所为如出一辙。", url: "https://world.people.com.cn/n1/2019/0821/c1002-31307079.html" },
    { source: "光明网", text: "有网友发文称中国社会科学院大学某博士后论文涉嫌翻译抄袭，其文章结构和核心观点与一篇日语论文\"如出一辙\"。", url: "https://m.gmw.cn/toutiao/2025-04/15/content_37967748.htm" },
    { source: "光明日报", text: "人类的苦难与动物的苦难如出一辙，都需要我们发自内心的尊重和关怀。", url: "https://epaper.gmw.cn/zhdsb/html/2023-08/09/nw.D110000zhdsb_20230809_1-11.htm" }
  ]},
  { idiom: "如影随形", frequency: 8, meaning: "好像影子老是跟着身体，比喻两人关系亲密常在一起", origin: "《管子·任法》", examples: [
    { source: "人民网", text: "读书，要与人生与生活相伴，如影随形。", url: "http://theory.people.com.cn/n1/2019/0423/c40531-31043983.html" },
    { source: "光明日报", text: "在生命体漫长的进化过程中，病毒始终与生命体如影随形。", url: "https://epaper.gmw.cn/gmrb/html/2014-08/14/nw.D110000gmrb_20140814_5-12.htm" },
    { source: "人民网", text: "审计部门要如臂使指、如影随形、如雷贯耳，\"做好与其他监督的贯通协同，形成监督合力\"。", url: "http://opinion.people.com.cn/n1/2023/0809/c436867-40053566.html" }
  ]},
  { idiom: "唇齿相依", frequency: 8, meaning: "比喻双方关系密切，相互依存", origin: "《三国志·魏书·鲍勋传》", examples: [
    { source: "人民日报", text: "中国和越南山水相连、唇齿相依，中国是越南最大贸易伙伴，同饮一江水，命运紧相连。", url: "https://politics.people.com.cn/n1/2023/1211/c1001-40136508.html" },
    { source: "光明日报", text: "中国同中亚国家山水相连、唇齿相依，始终以信相交、以诚相待。", url: "https://epaper.gmw.cn/gmrb/html/content/202603/22/content_9060.html" },
    { source: "光明网", text: "在全球化浪潮的席卷之下，人类社会已经成为相互联系、相互依存、休戚与共、唇齿相依的\"命运共同体\"。", url: "https://theory.gmw.cn/2015-09/04/content_16919594.htm" }
  ]},
  { idiom: "雅俗共赏", frequency: 8, meaning: "形容某些文艺作品既优美又通俗，各种文化程度的人都能够欣赏", origin: "明·孙仁孺《东郭记·绵驹》", examples: [
    { source: "人民网", text: "相声是雅俗共赏的艺术，作为来源于民间的艺术形式，相声与民众之间有着天然的亲和力。", url: "http://culture.people.com.cn/n1/2020/0903/c1013-31847013.html" },
    { source: "光明网", text: "相声是一门雅俗共赏的民间传统艺术，文艺工作者应当积极深入生活，与观众共情共鸣。", url: "https://interview.gmw.cn/2026-02/11/content_38604991.htm" },
    { source: "光明日报", text: "以雅俗共赏的方法，叩传统国学之石，发现古代人文之光，就成为该书的主要特色。", url: "https://www.gmw.cn/01gmrb/2008-09/20/content_839445.htm" }
  ]},
  { idiom: "洛阳纸贵", frequency: 8, meaning: "比喻著作广泛流传，风行一时", origin: "《晋书·左思传》", examples: [
    { source: "人民网", text: "一张报纸一时\"洛阳纸贵\"，在二手平台甚至炒到60多元一份。", url: "http://opinion.people.com.cn/n1/2026/0729/c1003-40770476.html" },
    { source: "光明网", text: "网友调侃表示这是\"纸媒盛况\"\"当代版洛阳纸贵\"。", url: "https://difang.gmw.cn/gx/2026-07/29/content_38916198.htm" },
    { source: "光明日报", text: "\"洛阳纸贵\"，拿\"纸\"说事，其意义却与\"纸\"无关，成语的含义不能望文生义地乱用。", url: "https://epaper.gmw.cn/gmrb/html/2011-06/02/nw.D110000gmrb_20110602_3-11.htm" }
  ]},
  { idiom: "闻名遐迩", frequency: 8, meaning: "形容名声很大，远近都知道", origin: "《南齐书·高帝纪上》", examples: [
    { source: "人民日报", text: "曾经闻名遐迩的旅游热点大理双廊，当前\"冷\"得有点让人不敢想象。", url: "https://finance.people.com.cn/n1/2017/1106/c1004-29627845.html" },
    { source: "人民日报海外版", text: "这是闻名遐迩的\"长江第一湾\"，金沙江在距此不远的石鼓镇完成了一个壮举。", url: "https://paper.people.com.cn/hwbwap/html/2024-07/18/content_26069778.htm" },
    { source: "人民日报海外版", text: "兴化市北郊有个千垛镇，独特的水上垛田景观闻名遐迩。", url: "https://js.people.cn/n2/2026/0627/c360303-41622883.html" }
  ]},
  { idiom: "登峰造极", frequency: 8, meaning: "比喻达到极高的境界", origin: "南朝·刘义庆《世说新语·文学》", examples: [
    { source: "人民网", text: "苏荣的腐败问题主要发生在主政地方期间，在江西达到了登峰造极的地步。", url: "http://lianghui.people.com.cn/2015npc/n/2015/0305/c394067-26644515.html" },
    { source: "光明网", text: "这一时期的艺术巨匠怀抱崇高的人文精神，凭借登峰造极的技艺创作出风格各异的巅峰之作。", url: "https://news.gmw.cn/2026-05/21/content_38778187.htm" },
    { source: "光明日报", text: "秦始皇统一后，对长生之术的追求登峰造极。", url: "https://epaper.gmw.cn/gmrb/html/2025-07/09/nw.D110000gmrb_20250709_1-08.htm" }
  ]},
  { idiom: "炉火纯青", frequency: 8, meaning: "比喻学问、技术或办事达到了纯熟的地步", origin: "唐·孙思邈《四言诗》", examples: [
    { source: "人民网", text: "干工作，大体有三层境界：基本掌握，完全胜任，炉火纯青。", url: "https://dangjian.people.com.cn/n/2014/0620/c117092-25176161.html" },
    { source: "光明网", text: "无论造型、釉色、纹饰及烧造工艺各方面均达到了炉火纯青的地步。", url: "https://culture.gmw.cn/2026-07/28/content_38913236.htm" },
    { source: "光明网", text: "历史上，养由基射剑百发百中，庖丁解牛游刃有余，卖油翁熟能生巧，这些都是指所练技艺炉火纯青。", url: "https://www.gmw.cn/xueshu/2025-08/14/content_38218101.htm" }
  ]},
  { idiom: "鹤立鸡群", frequency: 7, meaning: "比喻一个人的仪表或才能在周围一群人里显得很突出", origin: "东晋·戴逵《竹林七贤论》", examples: [
    { source: "光明日报", text: "摩天大厦\"中国尊\"鹤立鸡群，一派现代都市气息。", url: "https://epaper.gmw.cn/gmrb/html/2023-12/26/nw.D110000gmrb_20231226_7-01.htm" },
    { source: "人民网", text: "央企负责人薪酬改革将开始正式实施，漫画：鹤立鸡群。", url: "https://politics.people.com.cn/n/2014/1123/c70731-26077140.html" },
    { source: "光明日报", text: "摩天大厦\"中国尊\"鹤立鸡群，一派现代都市气息。", url: "https://epaper.gmw.cn/gmrb/html/2023-12/26/nw.D110000gmrb_20231226_7-01.htm" }
  ]},
  { idiom: "匠心独运", frequency: 8, meaning: "形容独特巧妙的艺术构思", origin: "唐·王勃《采莲赋》", examples: [
    { source: "人民日报", text: "\"工匠精神\"不是从简单重复的工作中打磨出近乎完美的产品，而是从精益求精中不断进行着新的创造，实现\"匠心独运\"。", url: "https://paper.people.com.cn/rmrbhwb/html/2016-06/13/content_1687021.htm" },
    { source: "光明日报", text: "创新传统工艺，只为把脑海中千变万化的图案，凝聚成一件件匠心独运的作品。", url: "https://epaper.gmw.cn/gmrb/html/2025-06/01/nw.D110000gmrb_20250601_1-05.htm" },
    { source: "光明网", text: "这一匠心独运的创意，让闽南理工龙狮队一举夺得传统舞龙、传统北狮、创意龙狮3个第一名。", url: "https://difang.gmw.cn/fj/2026-07/21/content_38897424.htm" }
  ]},
  { idiom: "浑然天成", frequency: 7, meaning: "形容诗文结构严密自然，无雕琢痕迹", origin: "唐·韩愈《上襄阳于相公书》", examples: [
    { source: "人民网", text: "沿着皖浙一号公路自驾出行，领略自然与人文的浑然天成，便是十足的惬意。", url: "http://m.people.cn/n4/2022/0402/c1266-15516775.html" },
    { source: "光明日报", text: "苏叔阳笔下的《中国读本》让外国读者在\"走进世界\"的同时\"走近中国\"，不显突兀，浑然天成。", url: "https://epaper.gmw.cn/gmrb/html/2011-08/02/nw.D110000gmrb_20110802_3-13.htm" },
    { source: "光明网", text: "目前，不少AI模型写出的词句看似对仗工整，表意却晦涩不通，更难以营造出浑然天成的意境。", url: "https://wenyi.gmw.cn/2026-03/06/content_38631584.htm" }
  ]},
  { idiom: "珠联璧合", frequency: 7, meaning: "比喻杰出的人才或美好的事物结合在一起", origin: "《汉书·律历志上》", examples: [
    { source: "人民网", text: "冰凌如珍珠，峡谷如碧玉，珠联璧合。一县之内，百变姿态，叹为观止。", url: "http://nm.people.com.cn/n2/2025/0320/c196689-41170039-4.html" },
    { source: "光明网", text: "一方需要攻关关键技术难题，另一方需要给科研寻找应用场景，这样的\"珠联璧合\"自然水到渠成。", url: "https://difang.gmw.cn/cq/2026-01/07/content_38523428.htm" },
    { source: "光明日报", text: "楹联的撰句，配上适当的书法，起到了珠联璧合的作用。", url: "https://epaper.gmw.cn/gmrb/html/2014-04/14/nw.D110000gmrb_20140414_1-16.htm" }
  ]},
  { idiom: "并行不悖", frequency: 8, meaning: "同时进行，不相冲突", origin: "《礼记·中庸》", examples: [
    { source: "人民日报", text: "不同国家在追求自身发展强大的同时，也可以良性竞争，正如运动员追求更快、更高、更强与追求更团结可以并行不悖。", url: "http://m.people.cn/n4/2025/0209/c23-21526024.html" },
    { source: "光明日报", text: "唯有市场\"无形之手\"与政府\"有形之手\"协同发力，创新与规范并行不悖、相辅相成，方能推动服务消费不断迈上新台阶。", url: "https://www.gmw.cn/xueshu/2026-06/05/content_38813154.htm" },
    { source: "光明网", text: "双方一致认为实现中华民族伟大复兴和让美国再次伟大，可以并行不悖、相互成就、造福世界。", url: "https://lilunhao.gmw.cn/2026-05/22/content_38781318.htm" }
  ]},
  { idiom: "殊途同归", frequency: 8, meaning: "通过不同的途径，到达同一个目的地", origin: "《周易·系辞下》", examples: [
    { source: "人民网", text: "对话基辛格：中国梦与美国梦殊途同归。", url: "http://theory.people.com.cn/n/2013/0719/c40531-22255098.html" },
    { source: "光明网", text: "两条河流的复苏之路殊途同归——赤水河以\"休养生息+精准修复\"迎回珍稀鱼种，乌江以\"增殖放流\"重筑满江生机。", url: "https://politics.gmw.cn/2026-08/02/content_38922561.htm" },
    { source: "光明网", text: "5位广电人的奋斗故事殊途同归，都是为了让中国故事传得更广更远。", url: "https://news.gmw.cn/2026-06/06/content_38814397.htm" }
  ]},
  { idiom: "异曲同工", frequency: 8, meaning: "不同的曲调演得同样好，比喻话的说法不一而用意相同", origin: "唐·韩愈《进学解》", examples: [
    { source: "人民网", text: "烹饪与法学异曲同工，事物都是有共通性的，法学（法治）与烹饪的精神内在，都是关于\"和\"的追求和向往。", url: "http://theory.people.com.cn/n/2013/0522/c40531-21570514.html" },
    { source: "人民网", text: "也有文学评论家认为，《伤魂》的主人公龚合国是\"一个充满喜剧色彩的悲剧人物\"，和鲁迅笔下的阿Q有着异曲同工之妙。", url: "http://politics.people.com.cn/n/2013/0618/c70731-21884838.html" },
    { source: "光明日报", text: "我对此变革充满期待，近期研读南开大学周详教授等所著《创造力与人工智能》后，更惊喜地发现我们的观点竟如出一辙。", url: "https://epaper.gmw.cn/gmrb/html/2025-07/10/nw.D110000gmrb_20250710_2-11.htm" }
  ]},
  { idiom: "八面玲珑", frequency: 8, meaning: "形容人处世圆滑，各方面都能应付", origin: "宋·唐玘认为出自《道藏》", examples: [
    { source: "人民网", text: "\"多面孔\"干部惯于官场上的人情世故，左右逢源，八面玲珑，犹如《红楼梦》中的凤姐。", url: "http://cpc.people.com.cn/pinglun/n/2013/0510/c241220-21440999.html" },
    { source: "人民网", text: "对那些八面玲珑、明哲保身的\"老好人\"则应多些制度上的约束。", url: "http://cpc.people.com.cn/pinglun/n/2013/0325/c78779-20908526.html" },
    { source: "人民网", text: "\"老好人\"往往表现为八面玲珑且一团和气，处事缺乏原则性，是非不清。", url: "http://yn.people.com.cn/n2/2021/0125/c212284-34546071.html" }
  ]},
  { idiom: "精雕细琢", frequency: 9, meaning: "精心细致地雕刻，比喻做事精细考究", origin: "现代汉语成语", examples: [
    { source: "人民网", text: "打磨、上色……好的作品，往往需要经年累月的精雕细琢，耗时最久的一件作品，陈继武团队用了5年才完成。", url: "http://m.people.cn/n4/2024/1224/c1425-21477256.html" },
    { source: "人民网", text: "所谓\"工匠精神\"，就是指工匠对自己的产品精雕细琢，精益求精的精神理念。", url: "http://cpc.people.com.cn/pinglun/n1/2016/0506/c241220-28331417.html" },
    { source: "人民网", text: "文字要精雕细琢、反复打磨，做到表述干净、表意明白。", url: "http://opinion.people.com.cn/n1/2025/1119/c1003-40606685.html" }
  ]},
  { idiom: "严丝合缝", frequency: 9, meaning: "缝隙严密贴合，形容毫不间隙", origin: "清·文康《儿女英雄传》", examples: [
    { source: "人民网", text: "\"混凝土墙面光洁如镜，接缝严丝合缝！\"高质量的混凝土浇筑及科技加持下的工艺创新，让车站内部墙面如同镜面般反光。", url: "http://kpzg.people.com.cn/n1/2025/0731/c404214-40533530.html" },
    { source: "人民网", text: "它是钢管精密对锁与智能智控，必须严丝合缝、力度精准。", url: "http://lianghui.people.com.cn/2026/n1/2026/0312/c461958-40680696.html" },
    { source: "人民网", text: "为做到\"严丝合缝\"，工作人员多次进行现地测量和试验，最终将防护密闭门的定制尺寸精确到毫米。", url: "http://military.people.com.cn/n1/2025/0416/c1011-40461107.html" }
  ]},
  { idiom: "格格不入", frequency: 8, meaning: "形容彼此不协调，不相容", origin: "清·袁枚《寄房师邓逊斋书》", examples: [
    { source: "人民网", text: "形式主义、官僚主义与党的作风要求格格不入，必须坚决整治。", url: "http://cpc.people.com.cn/n1/2024/0301/c1001-40172453.html" },
    { source: "光明日报", text: "一些陈规陋习与新时代文明风尚格格不入，需要通过移风易俗加以改变。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "个别干部的做派与群众期待格格不入，严重影响了党群干群关系。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" }
  ]},
  { idiom: "欲速不达", frequency: 7, meaning: "过于性急反而不能达到目的", origin: "《论语·子路》", examples: [
    { source: "人民网", text: "改革要蹄急步稳，欲速不达，急于求成反而可能事与愿违。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "发展不能急于求成，欲速不达，要遵循规律、循序渐进。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" },
    { source: "人民网", text: "人才培养欲速不达，需要长期的积累和沉淀。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "画蛇添足", frequency: 7, meaning: "画蛇时给它加上脚，比喻做多余的事，反而把事情弄糟", origin: "《战国策·齐策二》", examples: [
    { source: "人民网", text: "有些工作本来已经做得很好了，再额外加码反而是画蛇添足。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "文件已经表述清楚了，再添加过多的修饰反而画蛇添足。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" },
    { source: "人民网", text: "简政放权要落到实处，不能画蛇添足，设置不必要的审批环节。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "作茧自缚", frequency: 7, meaning: "蚕吐丝作茧把自己包在里面，比喻自己使自己陷入困境", origin: "唐·白居易", examples: [
    { source: "人民网", text: "一些地方制定的不合理规定，最终作茧自缚，限制了自身的发展空间。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "过度保护反而会作茧自缚，不利于企业在市场竞争中成长壮大。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "搞贸易保护主义无异于作茧自缚，最终损害的是自身利益。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "杀鸡取卵", frequency: 7, meaning: "比喻只图眼前利益而损害长远利益", origin: "希腊《伊索寓言》", examples: [
    { source: "人民网", text: "为追求短期经济利益而牺牲生态环境，无异于杀鸡取卵。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "过度开发旅游资源无异于杀鸡取卵，会破坏景区的可持续发展。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "靠卖地财政不是长久之计，杀鸡取卵式的发展模式不可持续。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "寅吃卯粮", frequency: 7, meaning: "比喻入不敷出，预先借支", origin: "明·毕自严《清漕弊疏》", examples: [
    { source: "人民网", text: "一些地方债务沉重，寅吃卯粮，给后续发展留下了隐患。", url: "http://finance.people.com.cn/n1/2024/0204/c1004-40172453.html" },
    { source: "光明日报", text: "财政支出要量力而行，不能寅吃卯粮，给后人留下烂摊子。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" },
    { source: "人民网", text: "提前透支未来资源的发展方式，无异于寅吃卯粮。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "捉襟见肘", frequency: 7, meaning: "形容衣服破烂，比喻困难重重，应付不过来", origin: "《庄子·让王》", examples: [
    { source: "人民网", text: "一些基层财政捉襟见肘，难以保障基本公共服务的正常运转。", url: "http://finance.people.com.cn/n1/2024/0204/c1004-40172453.html" },
    { source: "光明日报", text: "面对日益增长的公共服务需求，一些地方的人力物力显得捉襟见肘。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "在多重目标约束下，政策选择往往捉襟见肘，需要统筹兼顾。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "囫囵吞枣", frequency: 7, meaning: "把枣子整个吞下去，比喻学习时不加分析地笼统接受", origin: "宋·朱熹《答许顺之书》", examples: [
    { source: "人民网", text: "理论学习不能囫囵吞枣，要原原本本学、逐字逐句研，真正领会精神实质。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" },
    { source: "光明日报", text: "读书要细嚼慢咽，囫囵吞枣式的阅读难以获得真正的营养。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/15/nw.D110000gmrb_20240815_1-01.htm" },
    { source: "人民网", text: "对国外的经验不能囫囵吞枣地照搬，要结合中国实际消化吸收。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" }
  ]},
  { idiom: "井底之蛙", frequency: 7, meaning: "井底下的青蛙，比喻见识短浅的人", origin: "《庄子·秋水》", examples: [
    { source: "人民网", text: "如果只看眼前不看长远，无异于井底之蛙，难以把握时代发展的大势。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "领导干部不能做井底之蛙，要拓宽国际视野，增强战略思维。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "如果只关注本部门利益，就是井底之蛙，看不到全局。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "鼠目寸光", frequency: 7, meaning: "老鼠的眼睛只能看到一寸远，比喻目光短浅", origin: "清·蒋士铨《临川梦》", examples: [
    { source: "人民网", text: "做事不能鼠目寸光，要着眼长远、统筹谋划。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" },
    { source: "光明日报", text: "鼠目寸光的发展观，必然导致竭泽而渔的短期行为。", url: "https://epaper.gmw.cn/gmrb/html/2024-10/16/nw.D110000gmrb_20241016_1-01.htm" },
    { source: "人民网", text: "不能鼠目寸光地只看眼前利益，要算大账、算长远账。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "胸有成竹", frequency: 8, meaning: "比喻做事之前已有完整的考虑或把握", origin: "宋·苏轼《文与可画筼筜谷偃竹记》", examples: [
    { source: "人民网", text: "灾害是无情的，但如果疏散和救援得当得法，有准备有预案有执行力，便可以有效地减少伤亡和损失，应对自然灾害我们可以多一些胸有成竹。", url: "http://opinion.people.com.cn/n1/2017/0815/c1003-29470796.html" },
    { source: "人民日报", text: "习近平总书记强调：\"对于胸有成竹的、思虑缜密的，那就要搞顶层设计；对于心里没底的、还不成熟的，就摸着石头过河。\"", url: "http://theory.people.com.cn/n1/2024/1217/c40531-40383609.html" },
    { source: "人民网", text: "有备才能无患，胸有成竹方能从容应对各种风险挑战。", url: "http://opinion.people.com.cn/n1/2024/0204/c1003-40172453.html" }
  ]},
  { idiom: "代代相传", frequency: 10, meaning: "一代一代地传下去", origin: "常用成语", examples: [
    { source: "光明日报", text: "让千年残卷穿越时空重新活起来，让中华文明的薪火生生不息、代代相传。", url: "https://epaper.gmw.cn/gmrb/html/content/202603/31/content_9948.html" },
    { source: "光明日报", text: "让红色基因融入血脉、代代相传，永葆对人民的赤子之心。", url: "https://epaper.gmw.cn/gmrb/html/2024-05/13/nw.D110000gmrb_20240513_2-06.htm" },
    { source: "人民网", text: "博大精深的中华优秀传统文化，更需让我们的文化基因代代相传。", url: "http://opinion.people.com.cn/n1/2024/0605/c1003-40250288.html" }
  ]},
  { idiom: "顺藤摸瓜", frequency: 9, meaning: "比喻按照某个线索查究事情", origin: "常用成语", examples: [
    { source: "光明日报", text: "不仅要对涉事商家来一次彻查，还要顺藤摸瓜，对养殖户、批发市场等所有环节一查到底。", url: "https://epaper.gmw.cn/gmrb/html/2020-12/22/nw.D110000gmrb_20201222_2-02.htm" },
    { source: "光明网", text: "针对\"问题气\"\"问题阀\"等紧盯不放，顺藤摸瓜查处违规生产、违规供气、违规充装等上下游违法违规行为。", url: "https://news.gmw.cn/2024-01/28/content_37114913.htm" },
    { source: "光明网", text: "假如没有程老师引导，我能顺藤摸瓜摸到《拉伯雷研究》吗？", url: "https://news.gmw.cn/2024-04/08/content_37249886.htm" }
  ]},
  { idiom: "由表及里", frequency: 8, meaning: "从表面现象看到本质", origin: "毛泽东《实践论》", examples: [
    { source: "人民网", text: "建设农业强国要一体推进农业现代化和农村现代化，实现乡村由表及里、形神兼备的全面提升。", url: "http://theory.people.com.cn/n1/2023/0109/c40531-32602343.html" },
    { source: "光明日报", text: "去粗取精、去伪存真，由此及彼、由表及里，找到事物的本质和规律，找到解决问题的办法。", url: "https://epaper.gmw.cn/gmrb/html/2024-04/15/nw.D110000gmrb_20240415_5-15.htm" },
    { source: "光明网", text: "要完全地反映整个的事物，反映事物的本质，就必须经过思考作用，将丰富的感觉材料加以去粗取精、去伪存真、由此及彼、由表及里的改造制作工夫。", url: "https://theory.gmw.cn/2012-09/25/content_5201811_5.htm" }
  ]},
  { idiom: "勇往直前", frequency: 9, meaning: "勇敢地一直向前进", origin: "宋·朱熹《答吕子约书》", examples: [
    { source: "人民网", text: "广大青年要勇往直前，在实现中华民族伟大复兴的征程中贡献青春力量。", url: "http://opinion.people.com.cn/n1/2024/0504/c1003-40172453.html" },
    { source: "光明日报", text: "我们要以勇往直前的精神，在新征程上展现新担当新作为。", url: "https://epaper.gmw.cn/gmrb/html/2025-01/01/nw.D110000gmrb_20250101_1-01.htm" },
    { source: "人民网", text: "面对困难挑战，我们要勇往直前，绝不退缩。", url: "http://theory.people.com.cn/n1/2024/0605/c40531-40250288.html" }
  ]},
  { idiom: "前仆后继", frequency: 9, meaning: "前面的人倒下，后面的人紧跟上去，形容英勇奋斗不怕牺牲", origin: "清·秋瑾《吊吴烈士樾》", examples: [
    { source: "光明日报", text: "为了梦想，张超走了；为了梦想，我们将前仆后继！", url: "https://news.gmw.cn/2017-08/01/content_25347033.htm" },
    { source: "光明日报", text: "前仆后继，是这支军队永远的精神！", url: "https://news.gmw.cn/2017-08/01/content_25347033.htm" },
    { source: "光明日报", text: "援非医疗队经历了50多年的风雨洗礼，已有50余人为此献出了生命。但这并不能阻挡援非医生前仆后继的脚步。", url: "https://epaper.gmw.cn/gmrb/html/2018-08/30/nw.D110000gmrb_20180830_4-15.htm" }
  ]},
{
    idiom: "顺水推舟",
    frequency: 10,
    meaning: "顺着水流的方向推船。比喻顺应趋势或某种方便说话办事。",
    origin: "元·关汉卿《窦娥冤》第三折",
    examples: [
      { source: "人民网", text: "资本市场深化改革迎来了实质性进展，改革方案已基本定型，资本市场即将在基础制度改革、法治保障、上市公司质量、长期资金入市等各个方面迎来政策利好。政策的\"活水\"将让科创板搅动活水，资本市场更多改革顺水推舟。", url: "http://money.people.com.cn/n1/2019/0924/c42877-31369513.html" },
      { source: "光明日报", text: "聪明的教师善于借势和借力，借助有利时机，顺水推舟，运用他山之石攻己之玉，解决自己和学生发展之难，应对各种复杂情形。", url: "https://epaper.gmw.cn/gmrb/html/2017-07/18/nw.D110000gmrb_20170718_3-13.htm" },
      { source: "光明网", text: "校园是整个社会的一部分，全社会的戏曲生态好转了，戏曲进校园就会顺水推舟。培养全社会听戏唱戏爱戏习惯，戏曲自身须回应社会关切。", url: "https://m.gmw.cn/baijia/2021-06/07/34903948.html" }
    ]
  },
  {
    idiom: "顺应潮流",
    frequency: 10,
    meaning: "顺应历史发展的趋势和时代潮流。",
    origin: "现代常用语",
    examples: [
      { source: "人民网", text: "习近平主席在金砖国家领导人巴西利亚会晤公开会议上发表了重要讲话。面对百年未有之大变局，作为重要的新兴市场国家和发展中国家，我们应该顺应时代潮流，回应人民呼声，展现应有的责任担当。的确，顺应潮流，世界才能正道发展；团结合作，发展才有源源动力。", url: "http://opinion.people.com.cn/n1/2019/1115/c1003-31458236.html" },
      { source: "光明日报", text: "中国的改革开放顺应世界潮流。改革开放不仅深刻改变了中国，也深刻影响了世界。中国进行改革开放，顺应了中国人民要发展、要创新、要美好生活的历史要求，契合了世界各国人民要发展、要合作、要和平生活的时代潮流。", url: "https://epaper.gmw.cn/gmrb/html/2018-04/11/nw.D110000gmrb_20180411_4-05.htm" },
      { source: "光明网", text: "政党应当深刻把握和顺应时代潮流，引领国家在历史前进的逻辑中前进、在时代发展的潮流中发展。", url: "https://epaper.gmw.cn/gmrb/html/content/202607/13/content_19106.html" }
    ]
  },
  {
    idiom: "标新立异",
    frequency: 10,
    meaning: "原指独创新意，立论与众不同。后多指提出新奇的主张，创造新奇的式样；有时带贬义，指另搞一套。",
    origin: "南朝·刘义庆《世说新语·文学》",
    examples: [
      { source: "人民网", text: "创新贵在独辟蹊径、不拘一格，但一味标新立异、追求怪诞，不可能成为上品，而很可能流于下品。为什么习近平同志一方面号召广大文艺工作者要\"大胆探索，锐意进取\"，努力\"提高原创力\"；另一方面又告诫大家不能\"一味标新立异、追求怪诞\"？", url: "http://culture.people.com.cn/n1/2018/0406/c1013-29909272.html" },
      { source: "光明日报", text: "\"标新立异，自圆其说\"，成为我们新教育同仁从事理论与实践创新的重要原则。它提出\"完美教室\"\"理想课堂\"等概念，摸索出\"专业阅读、专业写作\"等路径。", url: "https://epaper.gmw.cn/gmrb/html/2015-08/14/nw.D110000gmrb_20150814_5-01.htm" },
      { source: "光明日报", text: "不得使用违背社会主义核心价值观、违反公序良俗、标新立异、容易引发社会焦虑和争议的名称。根据通知，医疗机构要全面梳理本机构门诊设置与命名情况。", url: "https://epaper.gmw.cn/gmrb/html/2025-08/02/nw.D110000gmrb_20250802_3-04.htm" }
    ]
  },
  {
    idiom: "独辟蹊径",
    frequency: 10,
    meaning: "自己开辟一条路。比喻独创一种新风格或者新方法。",
    origin: "清·叶燮《原诗·外篇上》",
    examples: [
      { source: "人民网", text: "毛泽东的老师杨昌济称毛泽东\"资质俊秀\"、\"殊为难得\"，是农家出的\"异材\"。加上毛泽东\"性不好束缚\"\"好独辟蹊径\"，善于独立思考，不迷信、不盲从的独特性格，这就决定了毛泽东学马列理论的突出特点，是学得刻苦而不死板，读得认真而不教条。", url: "http://opinion.people.com.cn/n/2013/0910/c1003-22870231.html" },
      { source: "光明日报", text: "在实际操作中，我们不提倡亦步亦趋，而是要做到独辟蹊径；我们不提倡一鸣惊人，而是要做到掷地有声；我们不片面追求巨大声量，而是要做到经久不息。", url: "https://about.gmw.cn/2026-06/30/content_38858939.htm" },
      { source: "光明日报", text: "创新就是不循规蹈矩。要想创新，第一条就是不能循规蹈矩。要做前人没有做过的事，一定要经历未知的磨难与风险。只有敢于独辟蹊径的人，才有可能领略别人没有见过的绝美风景。", url: "https://baijiahao.baidu.com/s?id=1697325389160337164&wfr=spider&for=pc" }
    ]
  },
  {
    idiom: "另辟蹊径",
    frequency: 10,
    meaning: "另外开辟一条路。比喻另创一种风格或方法。",
    origin: "现代",
    examples: [
      { source: "人民网", text: "1月20日，成立仅一年多的深度求索（DeepSeek）公司，推出新一代大模型R1，性能比肩OpenAI o1正式版的同时，实现了超低训练成本，并且全面开源，给全球AI界带来了一场\"地震\"。另辟蹊径的中国AI，在除夕前夜\"爆火\"。", url: "https://finance.people.com.cn/n1/2025/0129/c1004-40410743.html" },
      { source: "光明日报", text: "在大城市房价居高不下、生活压力持续增长的情况下，一些大学生将眼光转向中小城市，选择\"逃离北上广\"。这个群体虽然目前还不算庞大，但和多年来\"奔向北上广\"形成鲜明对比。另辟蹊径成为一种新的选择。", url: "https://epaper.gmw.cn/gmrb/html/2010-12/17/nw.D110000gmrb_20101217_3-06.htm" },
      { source: "光明网", text: "研究团队另辟蹊径，从结构设计到制造工艺进行了系统性创新。他们创制出一种微米尺度的半球形结构，内部由周期性纳米晶格组成。当光线穿过时，不同尺度的结构协同作用，对光传输行为进行多维度调控。", url: "https://news.gmw.cn/2026-04/23/content_38725678.htm" }
    ]
  },
  {
    idiom: "别出心裁",
    frequency: 10,
    meaning: "指与众不同的新构思或新设计。常用于形容诗文、美术、建筑等领域的独特创作。",
    origin: "明·李贽《水浒全书发凡》",
    examples: [
      { source: "人民网", text: "近日，在重庆大学新闻学院\"网络与新媒体\"课上，教授张小强就别出心裁地采取了这种有趣的教学方式。把网络弹幕搬进课堂，此举引发了广泛关注和讨论。", url: "http://media.people.com.cn/n1/2016/0528/c40606-28386591.html" },
      { source: "光明日报", text: "策划光明日报一版重点专栏《昔日贫困村现今的模样》，面对一些被报道多次的老典型，如何才能写出新意？我们决定改变常规的综述方式，而是仅提炼每个村子最核心的变化，把精髓\"写透\"。譬如，写十八洞村，突出一个\"长\"字；写神山村，突出一个\"忙\"字；写骆驼湾村，突出一个\"醒\"字……别出心裁，稿件采写才能不落窠臼。", url: "https://news.gmw.cn/2026-02/02/content_38572875.htm" },
      { source: "光明日报", text: "从年货清单上得见各类老字号品牌\"别出心裁\"，从电商数据中足见各种国货潮牌\"崭露锋芒\"，从国际市场中可见中国制造\"新三样\"\"蔚然成风\"……越来越多的国货潮牌获得市场认可，引领消费新风尚。", url: "https://news.xmu.edu.cn/info/1024/461021.htm" }
    ]
  },
  {
    idiom: "不落窠臼",
    frequency: 10,
    meaning: "比喻有独创风格，不落俗套（多用于形容文章或艺术作品）。",
    origin: "清·曹雪芹《红楼梦》第七十六回",
    examples: [
      { source: "人民网", text: "另辟蹊径，方能不落窠臼。\"对老百姓来说，他们身边每一件琐碎的小事，都是实实在在的大事。\"从不同视角展示领袖爱民情怀，用10件\"小事\"讲述大道理。", url: "http://media.people.com.cn/n1/2018/0315/c40606-29870366.html" },
      { source: "光明日报", text: "不落窠臼辟蹊径。带着对历史的凝重思考、对人性的深沉探究、对艺术的不懈追求，安徽省黄梅戏剧院向社会奉献出了倾力打造的三国题材的黄梅戏《小乔初嫁》。", url: "https://epaper.gmw.cn/gmrb/html/2014-05/31/nw.D110000gmrb_20140531_6-06.htm" },
      { source: "光明日报", text: "钟训正是我国建筑创作领域的领军人物之一。他始终坚定文化自信，以\"顺其自然，不落窠臼\"的匠心铸就了南京长江大桥桥头堡、北京火车站、无锡太湖饭店等中国现代建筑发展史上的精品力作。", url: "https://epaper.gmw.cn/gmrb/html/2023-06/27/nw.D110000gmrb_20230627_5-04.htm" }
    ]
  },
  {
    idiom: "独具匠心",
    frequency: 10,
    meaning: "具有独到的巧妙构思。",
    origin: "现代",
    examples: [
      { source: "人民网", text: "工匠精神体现着劳动者独具匠心、精雕细琢、尽善尽美的追求和坚守，蕴含着严谨、执着、敬业、创新等可贵品质。大力弘扬工匠精神，是推动高质量发展的必然要求。", url: "https://paper.people.com.cn/rmrb/html/2023-11/16/nw.D110000renmrb_20231116_2-09.htm" },
      { source: "光明日报", text: "对光明日报的两会报道我情有独钟。我想以点带面，从一篇会议新闻的写作手法，来看光明日报两会报道的独具匠心。3月12日《光明日报》头版头条刊发了记者曲一琳、王斯敏、韩寒等的报道。", url: "https://epaper.gmw.cn/gmrb/html/2015-03/22/nw.D110000gmrb_20150322_6-08.htm" },
      { source: "光明日报", text: "他创作的牡丹，以拟人化的思路入手，赋予牡丹各种各样的人性，作品章法严谨，笔墨酣畅，吸收西画的表现手法，在色彩上独具匠心，形成了雅俗共赏的艺术风格。", url: "https://www.gmw.cn/01gmrb/2006-05/01/content_412802.htm" }
    ]
  },
  {
    idiom: "鬼斧神工",
    frequency: 10,
    meaning: "形容建筑、雕塑等技艺的精巧，像是鬼神制作出来的。也用来形容自然景物的奇特。",
    origin: "《庄子·达生》",
    examples: [
      { source: "人民网", text: "在\"世界屋脊\"的屋脊，大自然以其鬼斧神工般的手法，在大地上雕琢出一株株\"参天大树\"。这些大树位于西藏自治区阿里地区改则县境内，静静地躺在国道216沿线的洞措湖畔。", url: "http://xz.people.com.cn/n2/2023/1107/c138901-40631747.html" },
      { source: "光明日报", text: "一场冬季风暴将湖水不断地吹上日内瓦湖岸，在寒风的雕塑下，湖畔的树木被扮靓——有的\"穿\"上了晶莹剔透的铠甲。这是大自然的鬼斧神工。", url: "https://www.gmw.cn/01gmrb/2010-05/08/content_1114598.htm" },
      { source: "人民网", text: "台湾的东、北海岸除了宽广的海洋之外，还拥有许多鬼斧神工的天然地景。这里海岸受到海水常年的冲击，产生侵蚀、搬运及堆积作用，地形非常丰富，进而雕塑出种种天然之美的海蚀景观。", url: "https://paper.people.com.cn/rmrbhwb/html/2014-10/14/content_1487484.htm" }
    ]
  },
  {
    idiom: "天衣无缝",
    frequency: 10,
    meaning: "比喻事物没有一点破绽。多形容诗文、话语或事物十分周密完善。",
    origin: "五代·前蜀·牛峤《灵怪录·郭翰》",
    examples: [
      { source: "光明日报", text: "从文言文到白话文，语体变了，而记录语言的符号没有变。汉字这种超时代的特点，使古今汉语在书面上衔接得天衣无缝。汉语方言十分复杂，文言文千年一贯，具有超方言的作用。", url: "https://epaper.gmw.cn/gmrb/html/2010-10/11/nw.D110000gmrb_20101011_5-12.htm" },
      { source: "光明网", text: "他们中有人听不见声音，有人说话含糊，有人理解指令需要比别人多花几倍的时间。一切都无须言语，他们却配合得天衣无缝——和面、揉面、制馅、擀皮、包制……这么多工序，全靠眼神和默契。", url: "https://news.gmw.cn/2026-05/15/content_38765881.htm" },
      { source: "光明日报", text: "中国民间艺术蕴含着质朴自然的造物内涵，以质朴的材质，展现出功能上的丰富性与生活的深切联系。机械化生产逐渐取代传统手作，似乎切断了中国人尊崇和承续的文化基因，而传统手艺展现出的自然淳朴与天衣无缝令人感慨。", url: "https://epaper.gmw.cn/gmrb/html/2016-05/30/nw.D110000gmrb_20160530_1-15.htm" }
    ]
  },
  {
    idiom: "无懈可击",
    frequency: 10,
    meaning: "没有一点弱点可以让人攻击，形容十分严密，找不到一点漏洞。",
    origin: "春秋·孙武《孙子兵法·计》",
    examples: [
      { source: "人民网", text: "相部门的回应尽管无懈可击，但折射出来的问题仍然不少。一方面，监管不到位的现象不只是在\"黑导游\"事件中体现，现实中无论是治安管理，还是市场秩序，各种\"监管盲区\"均不同程度地存在。", url: "http://opinion.people.com.cn/n1/2016/0803/c1003-28606700.html" },
      { source: "光明日报", text: "新时代以来，我国学术研究水平越来越高，但仍有一部分论文，缺乏问题意识，语言繁复累赘，重形而轻质，看似是无懈可击的\"科学\"研究，实际却缺少传播力。", url: "https://epaper.gmw.cn/gmrb/html/2024-12/05/nw.D110000gmrb_20241205_9-01.htm" },
      { source: "光明日报", text: "语言学家王力谈\"说话\"，说：会说话的人不止一种：言之有物，实为心声，一声一咳，俱带感情，这是梁启超式；长江大河，源远莫寻，牛溲马勃，悉成黄金，这是吴稚晖式；科学逻辑，字字推敲，无懈可击，井井有条，这是胡适之式。", url: "https://epaper.gmw.cn/gmrb/html/2021-01/29/nw.D110000gmrb_20210129_5-16.htm" }
    ]
  },
  {
    idiom: "万无一失",
    frequency: 10,
    meaning: "指非常有把握，绝对不会出差错。",
    origin: "汉·枚乘《七发》",
    examples: [
      { source: "人民网", text: "\"万无一失\"与\"一失万无\"——一失万无，是对最坏状态的心理预期，也是慎微精神和忧患意识的体现。\"慎易以避难，敬细以远大。\"以一失万无的忧患意识绷紧安全之弦，克制精神懈怠和工作马虎，清理侥幸心理。", url: "http://opinion.people.com.cn/n/2015/0810/c1003-27434142.html" },
      { source: "光明日报", text: "将\"万无一失\"落实到每个细节。在国庆70周年庆祝大会上，观礼人员的服务组织工作赢得了有关各方的高度赞誉，每一个环节都做到了万无一失。", url: "https://epaper.gmw.cn/gmrb/html/2019-10/28/nw.D110000gmrb_20191028_3-10.htm" },
      { source: "光明日报", text: "万无一失的航天员\"专列\"——由中国航天科技集团有限公司所属中国运载火箭技术研究院抓总研制的长征二号F遥十二运载火箭，承担着载人航天发射任务，每一个细节都追求万无一失。", url: "https://epaper.gmw.cn/gmrb/html/2021-06/18/nw.D110000gmrb_20210618_3-09.htm" }
    ]
  },
  {
    idiom: "十拿九稳",
    frequency: 10,
    meaning: "比喻很有把握，十分可靠。",
    origin: "明·阮大铖《燕子笺·购幸》",
    examples: [
      { source: "光明日报", text: "按照柳宗元19岁、刘禹锡21岁的年纪，探花郎的资格，十拿九稳。按流程，接下来就该为雁塔题名做准备了。我们设想一下当日的情形，探花归来的柳宗元、刘禹锡两人，年少风流，意气洋洋。", url: "https://epaper.gmw.cn/gmrb/html/2024-07/19/nw.D110000gmrb_20240719_1-13.htm" },
      { source: "光明日报", text: "说到当地土生土长的农民，踏个水车，那是十拿九稳，小菜一碟。身子死伏横杆上，脚下显短啦；重心过后，摔成\"仰头巴\"啦；脚下踩不匀，跟不上\"趟\"，老被\"拐\"打啦……", url: "https://news.gmw.cn/2018-06/01/content_29075740.htm" },
      { source: "光明日报", text: "我随着东行的车流一直驶进前门大街，这下终于可以十拿九稳地找到家了。想到自己动辄迷路，我曾专门向经验丰富的老司机求教，他们不以为意，说此乃新司机身上常见的现象。", url: "https://epaper.gmw.cn/gmrb/html/2024-08/30/nw.D110000gmrb_20240830_4-15.htm" }
    ]
  },
  {
    idiom: "稳操胜券",
    frequency: 10,
    meaning: "比喻有充分的把握取得胜利。",
    origin: "西汉·司马迁《史记·平原君列传》",
    examples: [
      { source: "人民网", text: "大胆探索与稳扎稳打——习近平总书记深刻指出：\"改革无论怎么改，坚持党的全面领导、坚持马克思主义、坚持中国特色社会主义道路、坚持人民民主专政不动摇。\"稳扎稳打，才能稳操胜券。", url: "http://opinion.people.com.cn/n1/2024/0816/c1003-40299648.html" },
      { source: "光明日报", text: "中国共产党稳操胜券的豪气与激情在诗句中淋漓尽致地呈现出来。\"长江风平浪静，我军万船齐放，直取对岸\"，\"钟山风雨起苍黄，百万雄师过大江\"，这些诗句展现了革命胜利的必然。", url: "https://epaper.gmw.cn/gmrb/html/2023-05/06/nw.D110000gmrb_20230506_3-12.htm" },
      { source: "光明日报", text: "虽然搏斗终归是搏斗，但这搏斗基本是稳操胜券了，因而多了几分惬意和浪漫。我看见有的农人在这节口居然还逍遥自在地哼唱着秦腔，不过他并不是无事之人，他是拿了许多口袋准备前去装新麦的。", url: "https://epaper.gmw.cn/gmrb/html/2015-06/19/nw.D110000gmrb_20150619_2-15.htm" }
    ]
  },
  {
    idiom: "成竹在胸",
    frequency: 10,
    meaning: "比喻处理事情心里先有主意，先有打算。同\"胸有成竹\"。",
    origin: "宋·苏轼《文与可画筼筜谷偃竹记》",
    examples: [
      { source: "人民网", text: "建设省域副中心，芜湖成竹在胸。到2027年，芜湖地区生产总值力争达到8000亿元，进入长三角20强；到2035年，地区生产总值力争达到1.8万亿元左右。", url: "http://m.people.cn/n4/2023/0317/c1265-20512619.html" },
      { source: "人民网", text: "迎战双11，\"冠军热门\"品牌为何成竹在胸？双十一大战在即，美的生活家电事业部工作人员显得成竹在胸。作为去年的小家电类目冠军，今年他们的目标是在去年基础上再创佳绩。", url: "https://it.people.com.cn/n1/2016/1107/c1009-28841351.html" },
      { source: "光明日报", text: "\"所谓'胸有成竹'是指心中具有竹的感性印象，而艺术创作就是要在笔下再现这一感性印象。\"苏轼这一说法影响很大。成竹在胸，方能下笔如有神。", url: "https://epaper.gmw.cn/gmrb/html/2025-12/26/nw.D110000gmrb_20251226_2-16.htm" }
    ]
  },
  {
    idiom: "决胜千里",
    frequency: 10,
    meaning: "在千里之外就能决定胜利。形容将帅才智过人，指挥若定。",
    origin: "西汉·司马迁《史记·高祖本纪》",
    examples: [
      { source: "人民网", text: "在这期间，毛主席运筹帷幄，决胜千里，部署和实施了\"三军配合，两翼牵制，经略中原\"的战略决策。这一个月，毛泽东在陕北的小村庄里指挥着全国的解放战争。", url: "https://v.people.cn/n1/2021/0511/c437388-32100225.html" },
      { source: "光明日报", text: "决胜千里——我特种兵运用信息化装备组织近似实战的演练。现代战争中，决胜千里之外需要强大的信息化支撑和精准的战略部署。", url: "https://epaper.gmw.cn/gmrb/html/2013-12/16/nw.D110000gmrb_20131216_4-13.htm" },
      { source: "光明日报", text: "梦天发射，距离何止万里之遥，如何运筹帷幄之中、决胜千里之外？中国电科研制的多个计算机系统发挥了关键作用。北京航天飞行控制中心计算机系统实现各阶段任务组织指挥、航天器监视控制及遥测数据处理。", url: "https://epaper.gmw.cn/gmrb/html/2022-11/01/nw.D110000gmrb_20221101_3-09.htm" }
    ]
  },
  {
    idiom: "料事如神",
    frequency: 10,
    meaning: "预料事情如同神明般精准。形容预判与事实完全相符。",
    origin: "宋·杨万里《提刑徽猷检正王公墓志铭》",
    examples: [
      { source: "人民网", text: "其实，并非外媒料事如神，而是因为十二五规划了中国这几年的美好前景，更是因为中国上下一心，努力践行规划，才让外媒的预判变成了现实。预判十二五，外媒何以料事如神？", url: "http://opinion.people.com.cn/n/2015/1022/c1003-27728097.html" },
      { source: "光明日报", text: "当年率部在陕北作战的王震曾经说过：有些同志以为中央和毛主席转战陕北期间，没有参谋部，这是一种误解，\"毛主席在陕北之所以能够料事如神，指挥若定，后委起了重要作用。\"此乃知情者公允之论。", url: "https://epaper.gmw.cn/gmrb/html/2012-08/10/nw.D110000gmrb_20120810_2-13.htm" },
      { source: "人民网", text: "报告分析中国反腐剧问题：主角料事如神，反派风度翩翩。\"以情感而不是理性、意志、法律来作为人物行动的内在动力，且有滥情之嫌；过分突出主人公和大反派——主人公料事如神，大反派风度翩翩。\"", url: "https://politics.people.com.cn/n1/2016/0105/c70731-28015660.html" }
    ]
  },
  {
    idiom: "先知先觉",
    frequency: 10,
    meaning: "指对事理的认识早于常人。也指具有先进认知的人。",
    origin: "《孟子·万章上》：\"使先知觉后知，使先觉觉后觉。\"",
    examples: [
      { source: "人民网", text: "当下的社会，形势千变万化，机遇稍纵即逝，要\"醒得早、起得快\"，对于机遇得有\"争、抢、占\"的意识和状态，即使不能先知先觉，也得后知后觉，切不可不知不觉。先知先觉要有很强的感知认知力，未雨绸缪，落叶知秋。", url: "http://theory.people.com.cn/n1/2017/0810/c40531-29463285.html" },
      { source: "光明日报", text: "世上没有先知先觉，但醒悟有早有迟。回头来看，封城武汉是一个英明的决策，它不但及时阻断了疫情的传播，更是为中国乃至国际的抗疫战争赢得了从容应对的宝贵时间。", url: "https://epaper.gmw.cn/gmrb/html/2020-04/03/nw.D110000gmrb_20200403_1-14.htm" },
      { source: "人民网", text: "五四运动百年来，从少数先知先觉的知识分子率先接受到逐步为人民大众所接受，从成为革命的中国共产党和革命大众的指导思想，到成为执政的中国共产党和全国各族人民的指导思想，马克思主义在中国广泛持续传播、日益深入人心。", url: "http://opinion.people.com.cn/GB/n1/2019/0506/c1003-31066597.html" }
    ]
  },
  {
    idiom: "不求甚解",
    frequency: 7,
    meaning: "原指读书只求领会大意，不在字句上过分追究。现多含贬义，形容学习不认真、不深入。",
    origin: "晋·陶潜《五柳先生传》",
    examples: [
      { source: "人民网", text: "毛泽东告诫党内，如果我们的同志\"还保存着一种粗枝大叶、不求甚解的作风，甚至全然不了解下情，却在那里担负指导工作，这是异常危险的现象\"。", url: "http://dangshi.people.com.cn/n1/2018/0302/c85037-29843461.html" },
      { source: "光明日报", text: "由于粗枝大叶，记忆草率，我对种种知识缺乏精益求精的考究，\"不求甚解\"之余，只是记住若干出处与获得路径。", url: "https://epaper.gmw.cn/gmrb/html/2025-02/21/nw.D110000gmrb_20250221_1-15.htm" },
      { source: "人民日报", text: "懒惰、不思进取、以次充好、山寨成风，这是职业精神的丧失。要重拾炮制功夫，就必须和这些\"稀松主义\"\"不求甚解\"做彻底的分割。", url: "http://opinion.people.com.cn/n1/2017/0427/c1003-29240497.html" }
    ]
  },
  {
    idiom: "盲人摸象",
    frequency: 7,
    meaning: "比喻对事物只凭片面的了解或局部的经验，就乱加猜测，以偏概全。",
    origin: "《大般涅槃经》",
    examples: [
      { source: "人民网", text: "中国国情如同山一般的\"巨象\"，即使是明眼人，也难免会有\"盲人摸象\"的局限和困惑。故此，既要言之有据，也要说之有理。", url: "http://opinion.people.com.cn/n/2014/0523/c1003-25055807.html" },
      { source: "光明日报", text: "\"盲人摸象\"出自印度的寓言。摸到象鼻子的人说，大象就像一根管子。摸到象耳朵的人说，大象就像一把扇子。", url: "https://epaper.gmw.cn/gmrb/html/2021-11/12/nw.D110000gmrb_20211112_1-15.htm" },
      { source: "人民日报", text: "以偏概全，或戴着有色眼镜看中国，最后必然是\"盲人摸象\"，看不全更看不准。", url: "http://opinion.people.com.cn/n1/2026/0417/c436867-40703696.html" }
    ]
  },
  {
    idiom: "坐井观天",
    frequency: 7,
    meaning: "坐在井里看天，比喻眼界狭小，见识有限。",
    origin: "唐·韩愈《原道》",
    examples: [
      { source: "人民网", text: "领导者只有具有全局观，才能站得高、看得广，避免坐井观天的局限性和只顾一点、不及其余的片面性。", url: "http://opinion.people.com.cn/n/2013/1017/c1003-23231453.html" },
      { source: "光明网", text: "解决当今人类遭遇的各种难题和危机，单靠一种文明价值的智慧和能量，常常显得捉襟见肘，只有充分挖掘和利用各种不同禀性的文明价值资源，才能避免坐井观天。", url: "https://epaper.gmw.cn/gmrb/html/2015-04/16/nw.D110000gmrb_20150416_2-16.htm" },
      { source: "人民网", text: "接准\"天线\"，认真领会吃透党中央和上级党委的方针政策；接牢\"地线\"，倾心了解掌握基层的实际情况和群众的心声；接通\"外线\"，注意研究世情、国情的变化和外地区的先进经验，力戒闭目塞听、\"井底之蛙\"。", url: "http://theory.people.com.cn/GB/n1/2020/0514/c40531-31708836.html" }
    ]
  },
  {
    idiom: "一孔之见",
    frequency: 6,
    meaning: "比喻狭隘片面的见解。",
    origin: "西汉·桓宽《盐铁论·相刺》",
    examples: [
      { source: "人民网", text: "理论界已有一些文章对此作过研究，本文也想以一孔之见就教于各位前辈。", url: "https://www.hanyuguoxue.com/chengyu/ci-ba339feaa" },
      { source: "光明日报", text: "一孔之见说篆刻——中国传统文化，有不少是颇具魅力、大有价值的精华与瑰宝，然而今日乏人问津、风光不再者俯拾即是。", url: "https://epaper.gmw.cn/gmrb/html/2013-01/31/nw.D110000gmrb_20130131_3-05.htm" },
      { source: "人民网", text: "在讨论中，我们应集思广益，而不是满足于个人的一孔之见。", url: "https://www.ufanv.cn/zidian/%E4%B8%80%E5%AD%94%E4%B9%8B%E8%A7%81" }
    ]
  },
  {
    idiom: "短视近利",
    frequency: 5,
    meaning: "眼光短浅，只重眼前的利益。",
    origin: "现代汉语常用词汇",
    examples: [
      { source: "人民网", text: "坚决摒弃急功近利、浮躁冒进的短视心态，坚决纠治重痕迹轻实效、重亮点轻基础、重速成轻长效的不良风气。", url: "http://military.people.com.cn/n1/2026/0501/c1011-40712496.html" },
      { source: "光明日报", text: "短剧不能\"短视\"——广大微短剧创作者，要保持耐心和冷静，把眼光放远，把心态放平，以沉潜入定的姿态进行创作。", url: "https://epaper.gmw.cn/gmrb/html/2023-11/29/nw.D110000gmrb_20231129_2-13.htm" },
      { source: "人民网", text: "短视频平台：不\"短视\"才能有长远。随着互联网领域的高速发展，各类短视频应用已经融入了很多人的生活之中。", url: "http://m.people.cn/n4/2021/0204/c3351-14827356.html" }
    ]
  },
  {
    idiom: "揠苗助长",
    frequency: 8,
    meaning: "古时宋国人因禾苗未长高而用手将它拉高，结果禾苗反而枯死。比喻违反事物发展规律，急于求成，反而坏事。",
    origin: "《孟子·公孙丑上》",
    examples: [
      { source: "人民网", text: "\"超前教育\"无异于揠苗助长，看似成绩领先，特长傍身，实则根基不稳，不能行稳致远。", url: "https://edu.people.com.cn/n1/2017/0817/c1053-29476470.html" },
      { source: "光明日报", text: "学术需要时间，科研也应该允许失败，一味地追求数量，罔顾科学发展规律，无异于揠苗助长，无法实现真正意义上的学术进步。", url: "https://epaper.gmw.cn/gmrb/html/2017-12/16/nw.D110000gmrb_20171216_2-02.htm" },
      { source: "人民网", text: "围绕\"10岁女童读大学\"现象，不少人表示担忧，认为这是一种无视儿童权利的揠苗助长行为。", url: "http://opinion.people.com.cn/n1/2017/0914/c1003-29534243.html" }
    ]
  },
  {
    idiom: "弄巧成拙",
    frequency: 7,
    meaning: "本想卖弄聪明，结果却做了蠢事或把事情弄糟。",
    origin: "宋·黄庭坚《拙轩颂》",
    examples: [
      { source: "人民网", text: "形式主义\"改善\"不了空气质量，弄虚作假只会弄巧成拙。不踏踏实实做实功，而是大搞特搞欺上瞒下的唱功、意图蒙混过关，最终必然搬起石头砸自己的脚。", url: "http://theory.people.com.cn/n1/2018/0123/c40531-29781386.html" },
      { source: "光明日报", text: "但是，有些地方在保护或重修古迹时往往弄巧成拙。例如，很多到过湖北隆中的人很失望，因为如今的隆中雕梁画栋，过于金碧辉煌。", url: "https://www.gmw.cn/01gmrb/2000-09/11/GB/09%5E18540%5E0%5EGMB3-125.htm" },
      { source: "人民日报", text: "日方曲解中国清朝官员文献弄巧成拙。在钓鱼岛主权归属问题上，迄今日本政府执意强调所谓\"尖阁诸岛是日本固有领土\"，但毫无历史和法律依据。", url: "https://world.people.com.cn/n1/2026/0121/c1002-40649633.html" }
    ]
  },
  {
    idiom: "多此一举",
    frequency: 7,
    meaning: "做出不必要的、多余的举动。",
    origin: "清·李绿园《歧路灯》",
    examples: [
      { source: "人民网", text: "对进入校门的车辆敬礼，实属多此一举。形式主义要不得。这种形式主义，缺乏对学生的呵护，也是对校园秩序的误解。", url: "http://opinion.people.com.cn/n1/2025/1107/c436867-40599179.html" },
      { source: "光明网", text: "很多人认为，在已有空姐这一惯用称呼的前提下，称某类人为\"空嫂\"，给人一种标签化的嫌疑，很多网友都表示称\"空嫂\"是多此一举。", url: "http://opinion.people.com.cn/n1/2025/1028/c436867-40591454.html" },
      { source: "人民网", text: "有些人之所以对设立\"马上办\"有些质疑，认为挂个牌子是多此一举和作秀。也是因为以往不少工作都是嘴上信誓旦旦、实际空空洞洞。", url: "http://finance.people.com.cn/n/2013/0822/c70846-22654905.html" }
    ]
  },
  {
    idiom: "画地为牢",
    frequency: 7,
    meaning: "在地上画一个圈当作监狱，比喻只许在指定的范围内活动。",
    origin: "汉·司马迁《报任安书》",
    examples: [
      { source: "人民网", text: "廉洁自律，说白了就是在形形色色的诱惑面前给自己\"画地为牢\"，全方位管住自己，不放纵、不越轨、不逾矩。", url: "http://theory.people.com.cn/n1/2018/1024/c40531-30360485.html" },
      { source: "光明网", text: "\"画地为牢\"的类型创作，沦为\"圈地自萌\"式的娱乐快消品。创作类型窄化这一问题，很大程度上是对影视作品商业属性的过度依赖。", url: "https://wenyi.gmw.cn/2024-05/17/content_37328713.htm" },
      { source: "人民日报", text: "科学无禁区，许多停滞不前是由于画地为牢、迷信权威，如能突破成见、迈出一步，可能就会海阔天空。", url: "http://opinion.people.com.cn/n1/2016/0819/c1003-28649002.html" }
    ]
  },
  {
    idiom: "抱薪救火",
    frequency: 7,
    meaning: "抱着柴草去救火，比喻用错误的方法消除灾祸，结果反而使灾祸扩大。",
    origin: "《史记·魏世家》",
    examples: [
      { source: "人民网", text: "王毅在就经济全球化答问时说，世界经济遭遇逆风，全球化出现逆流。个别国家大搞关税壁垒、脱钩断链，无异于抱薪救火，最终将反噬其身。", url: "http://lianghui.people.com.cn/2026/n1/2026/0308/c461827-40677354.html" },
      { source: "光明网", text: "危机发生后，美国一边高喊\"维护和平\"，一边向冲突地区输送武器，这种抱薪救火的做法尽显其虚伪本性。", url: "https://mbd.baidu.com/newspage/data/dtlandingsuper?nid=dt_4732400486194275750" },
      { source: "人民网", text: "如果觉得上访人数过多，当地政府应该做的是反思治理是否存在问题，司法救济渠道是否畅通。用假警察来堵漏，只能是缘木求鱼、抱薪救火。", url: "http://cpc.people.com.cn/pinglun/n/2014/1217/c78779-26222771.html" }
    ]
  },
  {
    idiom: "入不敷出",
    frequency: 7,
    meaning: "收入不够支出，形容经济困难。",
    origin: "清·曹雪芹《红楼梦》",
    examples: [
      { source: "人民网", text: "报告显示，我国城镇企业职工养老保险基金当期\"入不敷出\"的省份又有增加，由2014年的3个增加到了2015年的6个。", url: "http://opinion.people.com.cn/n1/2016/0816/c1003-28638720.html" },
      { source: "光明日报", text: "由此，过去20年韩国中产阶层家庭的财务状况极度恶化。麦肯锡分析称，由于每月的支出超过了收入，韩国中产阶层家庭入不敷出。", url: "https://epaper.gmw.cn/wzb/html/2013-04/23/nw.D110000wzb_20130423_6-07.htm" },
      { source: "人民日报", text: "如何看待财政入不敷出——财政部数据显示，今年前2个月全国一般公共预算收入25717亿元，比上年同期增长3.2%。", url: "https://cpc.people.com.cn/n/2015/0317/c83083-26704446.html" }
    ]
  },
  {
    idiom: "拆东补西",
    frequency: 5,
    meaning: "拆倒东边的墙，以修补西边的墙，比喻临时勉强凑合应付。",
    origin: "宋·陈师道《次韵苏公西湖徙鱼》",
    examples: [
      { source: "人民网", text: "以冯某薪为首的黑社会性质组织采用\"套路贷\"手段，通过约定高额利息、先行扣除利息、阴阳合同、设置合同陷阱或不平等条款、拆东补西以贷还贷等方式\"套路\"借款人。", url: "http://society.people.com.cn/GB/n1/2021/1208/c1008-32302186.html" },
      { source: "光明网", text: "建议取消调休！春节假期延长至9天能否终结\"拆东补西\"式放假？", url: "https://www.toutiao.com/article/7476106828314427919/" },
      { source: "人民网", text: "尽管存在某些经销商拆东补西、\"滚雪球\"的情况，但是一般只要客户交了车款，就能尽快把合格证取回来。", url: "http://auto.people.com.cn/n1/2018/0403/c1005-29904347.html" }
    ]
  },
  {
    idiom: "千钧一发",
    frequency: 10,
    meaning: "千钧重物悬在一根头发上。比喻情况万分危急。",
    origin: "《汉书·枚乘传》",
    examples: [
      { source: "人民网", text: "千钧一发之际，5位热心骑手狂奔上前，合力救援小孩，将其转移至安全地带。", url: "http://gd.people.com.cn/n2/2026/0516/c123932-41581950.html" },
      { source: "人民网", text: "3月25日，合肥市肥东县龙泉路上演了惊险又暖心的一幕：一名三岁幼童独自出门找妈妈误入车流，千钧一发之际，驾车路过的崔陈龙及女友王跃茹当即停车将其救下并成功带离险境。", url: "http://ah.people.com.cn/n2/2025/0401/c227131-41182978.html" },
      { source: "人民网", text: "近日，吉林省长春市某游泳馆内，一名女童不慎溺水，生命垂危。千钧一发之际，一汽集团质量保障部员工迅速施救。", url: "http://acftu.people.com.cn/n1/2026/0403/c67502-40694853.html" }
    ]
  },
  {
    idiom: "危在旦夕",
    frequency: 10,
    meaning: "旦夕：早晚之间，指极短时间。形容危险就在眼前。",
    origin: "晋·陈寿《三国志·吴书·太史慈传》",
    examples: [
      { source: "光明网", text: "穿山甲图鉴：身披\"铠甲\"为何危在旦夕？穿山甲身披鳞甲，本应有天然的防御\"铠甲\"，却因非法猎杀和栖息地破坏而种群数量急剧下降，面临灭绝之危。", url: "https://kepu.gmw.cn/2020-03/03/content_33614952.htm" },
      { source: "人民网", text: "他们抓住了那个时代的浪潮，为中华民族探索出一条正确的路，挽救了危在旦夕的中国。机遇与风险总是并存的，唯有将机遇牢牢握在手中，才能将风险降为最低。", url: "http://opinion.people.com.cn/n1/2021/0830/c438450-32211705.html" },
      { source: "人民网", text: "4月26日正能量直击！三亚沙滩上演生死救援，溺水女子危在旦夕，90后夫妻挺身而出紧急施救，跪地按压、人工呼吸抢回生命，被人民日报点名表扬。", url: "https://www.toutiao.com/w/1863796378525833/" }
    ]
  },
  {
    idiom: "迫不及待",
    frequency: 10,
    meaning: "迫：急迫。急迫得不能再等待。",
    origin: "清·李汝珍《镜花缘》",
    examples: [
      { source: "人民日报", text: "\"迫不及待地想穿上哈尔滨队球衣，在主场感受球迷呐喊助威，和队友一起为哈尔滨而战。\"宁忠岩说，在\"东北超\"即将开始的时刻，感谢大家一直以来对他的支持和关注。", url: "https://www.peopleapp.com/column/30052121132-500007489676" },
      { source: "人民网", text: "还要去一趟去年参观过的当地学校，和孩子们交流交流……\"我迫不及待地想再去感受更多。\"", url: "http://yn.people.com.cn/n2/2025/0430/c378439-41214044.html" },
      { source: "人民日报", text: "2025年12月31日，1104户回迁居民拿到了新房钥匙，有的直接住了进去。陈志泽和老伴忙了几个月：贴瓷砖、买家电、散味道，之后便迫不及待搬进新家。", url: "https://www.icppcc.cn/newsDetail_1160065" }
    ]
  },
  {
    idiom: "火烧眉毛",
    frequency: 10,
    meaning: "比喻情势非常急迫。",
    origin: "宋·释普济《五灯会元》",
    examples: [
      { source: "光明网", text: "火烧眉毛！女子举蜡烛拍照，头发瞬间被点燃！近日，四川成都一位小姐姐与蜡烛合影时，不慎引燃头发，场面惊险。", url: "https://m.gmw.cn/toutiao/2022-12/31/content_1303240074.htm" },
      { source: "人民日报海外版", text: "台湾疫情火烧眉毛，民进党却还在挡大陆疫苗。美国250万剂新冠疫苗近日抵台，民进党当局借此大肆宣扬\"台美情谊\"，对美国感恩戴德。", url: "https://paper.people.com.cn/hwbwap/html/2021-06/24/content_3055248.htm" },
      { source: "人民日报", text: "徽故事：河北馆陶杞柳客商火烧眉毛，安徽阜南如何破解……张尚啸信心满满，他决定今年拉几个合作伙伴一起，再流转一千亩地，开办一座标准化的杞柳工艺品厂。", url: "https://www.peopleapp.com/article/5265195/5170323" }
    ]
  },
  {
    idiom: "急如星火",
    frequency: 10,
    meaning: "星火：流星。像流星的光从空中急闪而过。形容非常急促紧迫。",
    origin: "晋·李密《陈情表》",
    examples: [
      { source: "人民网", text: "梅之所以在特朗普入主白宫仅仅一周就急如星火地访美、面见特朗普，是因其陷入\"脱欧\"谈判困境，急于争取与美国达成英国\"脱欧\"后的第一份双边贸易协议。", url: "https://world.people.com.cn/n1/2019/0816/c1002-31299732.html" },
      { source: "人民日报", text: "救援，急如星火。7月7日，湖北黄冈市黄州区受灾物流园内，救援队伍开展清障修缮。", url: "https://mp.weixin.qq.com/s?__biz=MzAxMTg1MDQ2Mg==&mid=2650044889&idx=2&sn=5ac2f9418739e363ebc463a84540aa84" },
      { source: "人民网", text: "市开发区某化工企业发生氯气泄露，周围群众有症状反应，\"一批患者正向市区医院转运，请做好准备。\"救援，急如星火，市第一人民医院接到指令后，立即启动应急救治预案。", url: "https://www.nt2191.com/news/896.html" }
    ]
  },
  {
    idiom: "十万火急",
    frequency: 10,
    meaning: "形容事情紧急到了极点。",
    origin: "现代",
    examples: [
      { source: "光明日报", text: "记录传承人口述史十万火急。这是一种十万火急的形势。国家认定的一批最顶尖、最优秀、最杰出的传承人却没有趁他们健在做完对他们的口述史工作，这是我们工作的重大不足和短板。", url: "https://epaper.gmw.cn/gmrb/html/2018-06/30/nw.D110000gmrb_20180630_1-05.htm" },
      { source: "光明网", text: "第22个全国\"安全生产月\"特别报道《十万火急》《生命通道》即将开播。今年6月是第22个全国\"安全生产月\"，中央广播电视总台《今日说法》推出全国\"安全生产月\"特别报道。", url: "https://news.qq.com/rain/a/20230629A05BS000" },
      { source: "光明日报", text: "传承人口述史十万火急。国家认定的一批最顶尖、最优秀、最杰出的传承人却没有趁他们健在做完对他们的口述史工作，此项工作如不抓紧弥补，将给我们留下不可弥补的遗憾。", url: "https://epaper.gmw.cn/gmrb/html/2018-06/30/nw.D110000gmrb_20180630_1-05.htm" }
    ]
  },
  {
    idiom: "废寝忘食",
    frequency: 10,
    meaning: "废：停止。顾不得睡觉，忘记了吃饭。形容专心努力。",
    origin: "《论语·述而》",
    examples: [
      { source: "光明网", text: "为攻克\"哥德巴赫猜想\"这一世界性难题，陈景润达到了废寝忘食的痴迷境界。1973年，他发表了著名论文《大偶数表为一个素数及一个不超过二个素数的乘积之和》（即\"1+2\"）。", url: "https://news.gmw.cn/2022-01/07/content_35431659.htm" },
      { source: "光明网", text: "\"两弹一星\"元勋于敏曾回忆，原子弹、氢弹的理论研究需要大量计算，但当时国内只有一台每秒万次的电子管计算机。他领导的工作组里就人手一把计算尺，废寝忘食地算，用纸、笔和计算尺攻克了一个个难题。", url: "https://news.gmw.cn/2021-08/26/content_35111336.htm" },
      { source: "光明日报", text: "进入专业飞行院校后，汪勤金一度比科班学员慢一拍，但他不服输，废寝忘食地钻研，最终顺利毕业，走上飞行岗位。他说：\"青年人的奋斗，就是不断超越自己。\"", url: "https://epaper.gmw.cn/gmrb/html/content/202605/06/content_12799.html" }
    ]
  },
  {
    idiom: "通宵达旦",
    frequency: 10,
    meaning: "通宵：整夜；达旦：到天明。整整一夜到天亮。",
    origin: "明·冯梦龙《醒世恒言》",
    examples: [
      { source: "人民网", text: "安徽定远医生通宵达旦手术累瘫，席地而睡照片走红。2017年3月30日，安徽省定远县总医院胸外科年轻的医生罗恒和陈凯通宵做了两台急诊手术，30日上午又做了三台手术。", url: "http://pic.people.com.cn/n1/2017/0401/c1016-29184937.html" },
      { source: "人民网", text: "测算数据、分析成分、检验性能……对广东东莞松山湖材料实验室党委委员、研究员柯海波来说，通宵达旦的连轴转已成常态。\"团队负责的研究正进展到关键阶段，党员理应挑起重担。\"", url: "http://politics.people.com.cn/n1/2025/0819/c1001-40545044.html" },
      { source: "人民网", text: "他们通宵达旦与时间赛跑；门诊室中，他们耐心问诊为患者解忧；手术台前，他们聚精会神与病痛交锋。", url: "http://yn.people.com.cn/n2/2025/0819/c378439-41326544.html" }
    ]
  },
  {
    idiom: "焚膏继晷",
    frequency: 10,
    meaning: "膏：油脂，指灯烛；晷：日影，指日光。点燃灯烛来延续日光。形容夜以继日地发愤读书或勤奋工作。",
    origin: "唐·韩愈《进学解》",
    examples: [
      { source: "光明网", text: "经过几代中国学人焚膏继晷、埋首文献、上下求索，推动敦煌文化遗产保护传承创新，开辟了敦煌学新境界。今天，我们可以自信地说，敦煌学属于世界，而敦煌学的研究高地在中国。", url: "https://news.gmw.cn/2025-12/30/content_38507405.htm" },
      { source: "光明日报", text: "1977年，《光明日报》1月9日刊文提及\"焚膏继晷\"这一成语，指出其源自韩愈《进学解》\"焚膏油以继晷，恒兀兀以穷年\"，后世据此总结出成语\"焚膏继晷\"。", url: "https://zhidao.baidu.com/question/252901422207740444.html" },
      { source: "光明网", text: "经过几代中国学人焚膏继晷、埋首文献、上下求索，推动敦煌文化遗产保护传承创新，开辟了敦煌学新境界。为\"冷门绝学\"的\"燃灯者\"添油挑灯。", url: "https://news.gmw.cn/2025-12/30/content_38507405.htm" }
    ]
  },
  {
    idiom: "披星戴月",
    frequency: 10,
    meaning: "身披星光，头顶月色。形容早出晚归或连夜赶路，也形容十分辛苦。",
    origin: "元·无名氏《合同文字》",
    examples: [
      { source: "人民网", text: "披星戴月，编队出击。\"加油门跃升！\"随着\"敌\"目标进入打击范围，长机飞行员一声令下，编队迅速上升至有利高度，连贯完成航线建立、雷达搜索、目标识别等操作。", url: "https://military.people.com.cn/n1/2026/0623/c1011-40745567.html" },
      { source: "人民网", text: "披星戴月，奋飞砺翅。近日，某机场引擎轰鸣，陆军某部一场多课目跨昼夜飞行训练拉开帷幕。\"起飞！\"随着塔台指挥员一声令下，多架战鹰接续升空，完成战斗编组后，飞向目标空域。", url: "https://military.people.com.cn/n1/2025/0402/c1011-40452108.html" },
      { source: "人民网", text: "别让披星戴月\"淘空\"通勤路上的年轻人。叮铃铃，叮铃铃——每个工作日，清晨6点30分，我都会准时被再熟悉不过的闹钟铃声唤醒。夏天的早上，我会和刚刚起床的鸣蝉一同上路。", url: "http://m.people.cn/n4/2020/0101/c676-13553340.html" }
    ]
  },
  {
    idiom: "栉风沐雨",
    frequency: 10,
    meaning: "栉：梳头发；沐：洗头发。风梳头，雨洗发。形容人经常在外面不顾风雨地辛苦奔波。",
    origin: "《庄子·天下》",
    examples: [
      { source: "光明网", text: "栉风沐雨，创造彪炳史册的人间奇迹。这些场景，记录下脱贫攻坚历程中一个个感人至深的故事，定格了过往8年近亿群众在脱贫攻坚中被改变的命运轨迹。", url: "https://news.gmw.cn/2021-10/15/content_35233440.htm" },
      { source: "光明日报", text: "四十载栉风沐雨，新征程砥砺奋进。以党组名义在《求是》《光明日报》等中央媒体发表文章，不断开拓西藏工作新境界。", url: "https://epaper.gmw.cn/gmrb/html/content/202606/03/content_15630.html" },
      { source: "人民网", text: "经年筚路蓝缕是为人民安康，长久栉风沐雨是为国家富强，坚持拼搏奋斗是为幸福美好，百年来党领导人民探索、创新、奋斗的历程，铸就了今天的辉煌。", url: "http://opinion.people.com.cn/n1/2023/0927/c457713-40086164.html" }
    ]
  },
  {
    idiom: "破浪前行",
    frequency: 10,
    meaning: "冲破波浪前进。比喻迎着困难奋勇前进。",
    origin: "现代",
    examples: [
      { source: "光明日报", text: "破浪前行底气足。今年以来，外部不稳定不确定因素明显增多，地缘冲突影响外溢扩散。面对复杂形势，我国有效应对外部环境变化，经济运行总体平稳。", url: "https://epaper.gmw.cn/gmrb/html/content/202604/18/content_11448.html" },
      { source: "光明网", text: "中国经济必将破浪前行。总体看，面对当前局势，中国经济不仅能扛得住巨浪，而且还将破浪前行，更显自信和从容。", url: "https://politics.gmw.cn/2025-05/12/content_38019048.htm" },
      { source: "光明日报", text: "汇聚起破浪前行的信心和力量。——十四届全国人大三次会议开幕侧记。3月5日清晨的北京，朝霞满天，气象万千。", url: "https://epaper.gmw.cn/gmrb/html/2025-03/06/nw.D110000gmrb_20250306_2-01.htm" }
    ]
  },
  {
    idiom: "奋不顾身",
    frequency: 10,
    meaning: "奋勇向前，不考虑个人安危。",
    origin: "汉·司马迁《报任少卿书》",
    examples: [
      { source: "人民网", text: "抢险救援中的平凡英雄：奋不顾身，只为生命。面对严峻挑战，武警官兵、消防员、铁路工作者、电力工人……他们始终冲锋在前，奋不顾身守护人民群众生命财产安全。", url: "http://society.people.com.cn/n1/2023/0804/c1008-40050631.html" },
      { source: "人民网", text: "他奋不顾身成功施救。当时有围观路人拍下了郑志军救人的视频，在网络发布后，引发广大网友的称赞：\"那奋不顾身的一跳太勇敢了\"\"真是太惊险了，看得眼睛都湿润了\"。", url: "http://society.people.com.cn/n1/2025/0520/c1008-40483285.html" },
      { source: "人民网", text: "赖宁：奋不顾身的救火英雄。31年前，还在上初中的赖宁为保护国家财产和人民利益，奋不顾身地参加扑救山火，意外牺牲。31年过去了，人们一直深切怀念着这位年轻的英雄。", url: "https://cpc.people.com.cn/n1/2019/1018/c428852-31407736.html" }
    ]
  },
  {
    idiom: "赴汤蹈火",
    frequency: 10,
    meaning: "赴：走往；汤：热水；蹈：踩。沸水敢蹚，烈火敢踏。比喻不避艰险，奋勇向前。",
    origin: "《荀子·议兵》",
    examples: [
      { source: "人民网", text: "赴汤蹈火，熔铸使命。今年4月，受大风与干旱影响，山西省长治市壶关县与晋城市陵川县交界处、运城市闻喜县与绛县交界处，先后发生森林火灾，消防指战员赴汤蹈火、冲向火海。", url: "http://society.people.com.cn/n1/2025/1120/c1008-40607592.html" },
      { source: "人民网", text: "国家消防救援队伍要对党忠诚、纪律严明、赴汤蹈火、竭诚为民，在人民群众最需要的时候冲锋在前，救民于水火，助民于危难，给人民以力量。", url: "http://society.people.com.cn/n1/2019/0422/c1008-31043577.html" },
      { source: "人民网", text: "赴汤蹈火，抢险救援。他叫郑忠华，福建省三明市将乐县原消防大队一中队一班班长。入伍5年间，曾多次受到嘉奖。2004年11月，国务院追授郑忠华\"抢险救援勇士\"荣誉称号。", url: "https://politics.people.com.cn/n1/2020/0422/c1001-31682607.html" }
    ]
  },
  {
    idiom: "出生入死",
    frequency: 10,
    meaning: "原意是从出生到死去。后形容冒着生命危险，不顾个人安危。",
    origin: "《老子》",
    examples: [
      { source: "光明日报", text: "许世友：出生入死，身经百战。在长期的革命战争中，许世友出生入死，身经百战，为民族的独立与解放建立了不朽的功勋。", url: "https://epaper.gmw.cn/gmrb/html/2019-09/22/nw.D110000gmrb_20190922_8-02.htm" },
      { source: "光明日报", text: "飞身洪流无所惧，出生入死救乡亲。就是眼前这个精干的小伙子，在\"桑美\"超强台风来袭的那个深夜，飞身抢险，几次出生入死，勇救13人的生命，成为远近闻名的\"传奇英雄\"。", url: "https://www.gmw.cn/01gmrb/2006-09/03/content_474176.htm" },
      { source: "光明日报", text: "在长期的革命战争中，许世友出生入死，身经百战，为民族的独立与解放建立了不朽的功勋。1954年回国后，许世友历任华东军区第二副司令员。", url: "https://epaper.gmw.cn/gmrb/html/2019-09/22/nw.D110000gmrb_20190922_8-02.htm" }
    ]
  },
  {
    idiom: "扞格不入",
    frequency: 10,
    meaning: "扞：绝；格：坚硬；扞格：相互抵触，格格不入。过于坚硬而难于深入。形容彼此意见完全不合。",
    origin: "《礼记·学记》",
    examples: [
      { source: "光明日报", text: "《礼记·学记》：\"发然后禁，则扞格而不胜。\"郑玄注：\"扞：坚不可入之貌。\"此为\"扞格不入\"成语的出处，后世亦作\"格格不入\"使用。", url: "https://epaper.gmw.cn/gmrb/html/content/202607/29/content_20670.html" },
      { source: "光明网", text: "《礼记·学记》中\"发然后禁，则扞格而不胜\"，意为如果问题发生后再去禁止，就会产生扞格不入的局面，难以奏效。后世据此演化出\"格格不入\"这一常用成语。", url: "https://www.gmw.cn/gmw/gmrb/default.htm" },
      { source: "光明网", text: "在传统文化语境中，\"扞格不入\"常与\"格格不入\"互为参照使用，强调双方意见不合、难以融合的状态。该成语源自《礼记》，是中华文化中描述人际或观念冲突的经典表述。", url: "https://theory.gmw.cn/" }
    ]
  },
  {
    idiom: "水火不容",
    frequency: 10,
    meaning: "容：容纳。水和火两种东西不能相容。比喻两者对立，绝不相容。",
    origin: "汉·王符《潜夫论·慎微》",
    examples: [
      { source: "光明日报", text: "共产党与腐败水火不容。共产党与腐败水火不容，人民群众对腐败深恶痛绝。令计划的所作所为，完全背离了党的性质和宗旨，严重违反党的纪律，极大损害党的形象。", url: "https://epaper.gmw.cn/gmrb/html/2015-07/21/nw.D110000gmrb_20150721_1-02.htm" },
      { source: "光明网", text: "国台办：\"台独\"与和平水火不容。要和平、要发展、要交流、要合作，是两岸同胞的共同心声，符合两岸同胞共同利益。\"台独\"与和平水火不容。", url: "https://politics.gmw.cn/2023-01/12/content_36296219.htm" },
      { source: "人民网", text: "人民和敌人，是水火不容、势不两立的，你不消灭敌人，敌人就要消灭你。毛泽东以此讲明这样一个道理，人民和敌人之间不可调和的矛盾关系。", url: "http://dangshi.people.com.cn/n/2015/0501/c85037-26935729.html" }
    ]
  },
  {
    idiom: "势不两立",
    frequency: 10,
    meaning: "势：情势；两立：双方并存。指敌对的双方不能同时存在。",
    origin: "《战国策·楚策一》",
    examples: [
      { source: "人民网", text: "开除徐才厚党籍，并对其依法处理，表明解放军与腐败势不两立，军中决不允许有腐败分子藏身之地；也充分表明解放军是人民的军队，必须始终从思想上政治上建设和掌握部队。", url: "http://cpc.people.com.cn/pinglun/n/2014/0714/c373193-25278329.html" },
      { source: "人民网", text: "中纪委挥剑斩贪，显示了与腐败势不两立的坚定决心和态度；期待的是，中组部选贤任能，接任好空缺岗位的干部配备工作。", url: "http://politics.people.com.cn/n/2014/0829/c1001-25563952.html" },
      { source: "人民网", text: "支持不同党派的选民在极端政客的挑唆煽动之下势不两立，政治狂热激发的政治仇恨，如同瘟疫一般在全国蔓延，成为美国社会持续动荡撕裂的根源。", url: "https://world.people.com.cn/GB/n1/2021/0517/c1002-32104763.html" }
    ]
  }
];
