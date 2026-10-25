import type { Theme } from "../types";

export const securityTheme: Theme = {
  id: "security",
  title: "信息安全",
  description:
    "攻与防的博弈：理解密码背后的数学，识破常见的 Web 攻击，建立自己的威胁模型与日常安全习惯。",
  icon: "🛡️",
  color: "#ef4444",
  levels: [
    {
      id: "sec-1",
      type: "quiz",
      title: "安全思维",
      intro:
        "安全不是「有防火墙就安全」，而是三方权衡：想让谁看不懂（机密性）、谁改不了（完整性）、随时能用（可用性）。先学会像攻击者一样思考。",
      questions: [
        {
          id: "sec-1-q1",
          prompt: "安全三要素 CIA 指的是？",
          options: [
            "机密性、完整性、可用性",
            "加密、隔离、审计",
            "证书、IP、鉴权",
            "控制、输入、攻击",
          ],
          answer: 0,
          explanation:
            "Confidentiality 不该看的看不到、Integrity 数据不被篡改、Availability 服务随时可用。三者互相制约——断网最安全但可用性为零。",
        },
        {
          id: "sec-1-q2",
          prompt: "「威胁模型」要回答的核心问题是？",
          options: [
            "防火墙买哪个牌子",
            "谁会攻击你、为了什么、有什么能力、你防什么",
            "密码设多少位",
            "服务器放哪个机房",
          ],
          answer: 1,
          explanation:
            "安全是相对的：个人博客和银行系统面对的威胁完全不同。没有威胁模型的安全措施只是花钱买安心。",
        },
        {
          id: "sec-1-q3",
          prompt: "「攻击面（Attack Surface）」指的是？",
          options: [
            "服务器机房面积",
            "攻击者可能利用的所有入口总和（端口、表单、API、人）",
            "防火墙的数量",
            "网站的页面数",
          ],
          answer: 1,
          explanation:
            "每个对外开放的功能都是潜在入口。减少攻击面（关掉不用的服务、少收集数据）是性价比最高的安全投资。",
        },
        {
          id: "sec-1-q4",
          prompt: "最常见的攻击入口其实是？",
          options: ["0day 漏洞", "人（钓鱼/社会工程学）", "量子计算机", "断电"],
          answer: 1,
          explanation:
            "绝大多数真实入侵从「骗人」开始：假登录页、冒充 IT 的电话、带毒附件。技术防线再强，人被钓走密码全白搭。",
        },
        {
          id: "sec-1-q5",
          prompt: "「纵深防御（Defense in Depth）」的意思是？",
          options: [
            "把防火墙买厚一点",
            "设置多层互相独立的防线，单层失守不致全盘崩溃",
            "只防外部攻击",
            "密码越长越好",
          ],
          answer: 1,
          explanation:
            "前端校验+服务端校验、密码+2FA、备份+权限控制——任何一层失效都有下一层兜底。单一防线等于没有防线。",
        },
        {
          id: "sec-1-q6",
          prompt: "「最小权限原则」指？",
          options: [
            "给每个用户最高权限方便干活",
            "只授予完成任务所必需的最小权限",
            "权限越小服务器越快",
            "只允许一个人用系统",
          ],
          answer: 1,
          explanation:
            "数据库账号只需要读就别给写权限、部署服务不用 root 跑。权限被攻破时，损失被锁死在最小范围内。",
        },
        {
          id: "sec-1-q7",
          prompt: "「白名单」与「黑名单」哪个通常更安全？",
          options: [
            "黑名单，因为更全面",
            "白名单：默认拒绝一切，只放行已知安全的项",
            "一样",
            "都过时了",
          ],
          answer: 1,
          explanation:
            "黑名单永远追不完新花样（忘一个就漏）；白名单默认拒绝未知项。输入校验、防火墙规则同理。",
        },
      ],
    },
    {
      id: "sec-2",
      type: "quiz",
      title: "密码与认证",
      intro:
        "你的密码在数据库里不应该是「密码」，而应该是一团加了盐的哈希。这一关讲清楚认证系统的正确姿势。",
      questions: [
        {
          id: "sec-2-q1",
          prompt: "存储用户密码的正确方式是？",
          options: [
            "明文存，方便找回",
            "用 bcrypt/argon2 等专用算法加 salt 哈希后存",
            "MD5 一下就行",
            "Base64 编码后存",
          ],
          answer: 1,
          explanation:
            "专用慢哈希（bcrypt/argon2）+ 每用户随机盐，让拖库后的破解成本极高。MD5/SHA256 太快（GPU 每秒几十亿次），明文/Base64 等于裸奔。",
        },
        {
          id: "sec-2-q2",
          prompt: "为什么要给每个用户的密码加不同的随机盐（salt）？",
          options: [
            "让密码变长",
            "相同密码哈希结果不同，彩虹表/批量破解失效",
            "加快登录速度",
            "方便管理员查看",
          ],
          answer: 1,
          explanation:
            "没有盐时，攻击者预计算「常见密码→哈希」表一查一个准。盐让每条记录都要单独算，预计算白费。",
        },
        {
          id: "sec-2-q3",
          prompt: "「忘记密码」功能应该怎么实现？",
          options: [
            "把原密码邮件发给用户",
            "发一次性的、短时效的重置链接（凭哈希存储，谁也不知道原密码）",
            "让用户回答安全问题即可重置",
            "管理员手动改",
          ],
          answer: 1,
          explanation:
            "服务端根本不该知道原密码（只存哈希）。重置链接一次性、几分钟过期——「找回密码」实为「重置密码」。",
        },
        {
          id: "sec-2-q4",
          prompt: "2FA（两步验证）中「第二步」最常见的形态是？",
          options: [
            "再输一遍密码",
            "一次性验证码（TOTP 应用/短信）或硬件钥匙",
            "密保问题",
            "填验证图片",
          ],
          answer: 1,
          explanation:
            "知识因素（密码）+ 持有因素（手机/钥匙）双因子。密码泄露只丢了一半钥匙。短信验证码优于没有，但 TOTP/硬件钥匙更抗 SIM 卡劫持。",
        },
        {
          id: "sec-2-q5",
          prompt: "会话 Cookie 的安全属性中，`HttpOnly` 的作用是？",
          options: [
            "禁止通过 JavaScript 读取（防 XSS 偷 Cookie）",
            "只能用 HTTP 不能用 HTTPS",
            "让 Cookie 更小",
            "禁止浏览器缓存",
          ],
          answer: 0,
          explanation:
            "配合 `Secure`（仅 HTTPS 发送）与 `SameSite`（限制跨站携带），是 Cookie 安全三件套。本站的会话 Cookie 就带这些属性。",
        },
        {
          id: "sec-2-q6",
          prompt: "「撞库攻击」利用的是用户的什么弱点？",
          options: [
            "密码太短",
            "多站点复用同一套密码，一处泄露处处沦陷",
            "不装杀毒软件",
            "用公共 WiFi",
          ],
          answer: 1,
          explanation:
            "别处泄露的「邮箱+密码」被批量尝试登录你的站。防御靠用户侧独一无二密码（密码管理器）+ 站点侧泄露库比对与异常登录检测。",
        },
        {
          id: "sec-2-q7",
          prompt: "指纹/人脸识别属于哪类认证因素？",
          options: ["知识因素（你知道的）", "生物特征（你本身的样子）", "持有因素（你拥有的）", "位置因素"],
          answer: 1,
          explanation:
            "三因素：知道的（密码）、拥有的（手机/硬件钥匙）、本身的（生物特征）。生物特征泄露无法重置，通常与设备绑用而非云端存储。",
        },
      ],
    },
    {
      id: "sec-3",
      type: "minigame",
      title: "密码强度实验室",
      intro:
        "输入框里构造密码，所有计算都在你本地完成（不上传一个字节）。逐关达成条件，亲眼看着熵和破解时间暴涨。",
      game: "password-lab",
      config: {
        challenges: [
          { name: "入门：6 位以上", minLength: 6 },
          { name: "混合字符：包含小写+大写+数字，且长度 ≥ 8", minLength: 8, requireClasses: ["lower", "upper", "digit"] },
          { name: "强密码：熵 ≥ 60 bit（如 10 位混合字符）", minEntropy: 60 },
          { name: "堡垒：破解时间 ≥ 1000 年", minCrackYears: 1000 },
        ],
      },
    },
    {
      id: "sec-4",
      type: "quiz",
      title: "Web 攻击与防御",
      intro:
        "你在数据库大陆写的 SQL、在 Web 大陆写的表单，都可能成为攻击者的武器。三大经典攻击：注入、XSS、CSRF。",
      questions: [
        {
          id: "sec-4-q1",
          prompt: "SQL 注入攻击的原理是？",
          options: [
            "猜中数据库密码",
            "把 SQL 语法拼进用户输入，让数据库把恶意输入当命令执行",
            "黑进路由器",
            "把数据库文件下载走",
          ],
          answer: 1,
          explanation:
            "如把 `' OR '1'='1` 填进登录框拼进查询，条件恒真绕过验证。你在 db-2 学的 LIKE 通配符在此成了武器。",
        },
        {
          id: "sec-4-q2",
          prompt: "防 SQL 注入的标准做法是？",
          options: [
            "前端限制输入长度",
            "参数化查询/预编译语句，让用户输入永远只是「数据」不是「代码」",
            "把数据库藏起来",
            "过滤单引号",
          ],
          answer: 1,
          explanation:
            "参数化把 SQL 结构与数据彻底分离，输入里的引号只是普通字符。Drizzle 等参数化 ORM 天然免疫；手动拼字符串才是灾难源头。",
        },
        {
          id: "sec-4-q3",
          prompt: "XSS（跨站脚本）攻击的是谁？",
          options: [
            "服务器数据库",
            "浏览页面的其他用户（恶意脚本在受害者浏览器里执行）",
            "运营商",
            "域名注册商",
          ],
          answer: 1,
          explanation:
            "攻击者把 `<script>` 藏进评论区，其他用户浏览时代码在他们浏览器里跑：偷 Cookie、伪造操作。受骗的是「你」。",
        },
        {
          id: "sec-4-q4",
          prompt: "防 XSS 的核心思路是？",
          options: [
            "禁止用户输入任何文字",
            "输出时按上下文转义（把 `<` 变成 `&lt;` 等），让数据永远不被当代码执行",
            "用更复杂的密码",
            "关闭浏览器 JS",
          ],
          answer: 1,
          explanation:
            "React/Vue 默认转义插值，`dangerouslySetInnerHTML` 这个名字就是在警告你。富文本要经白名单净化（如 DOMPurify）。",
        },
        {
          id: "sec-4-q5",
          prompt: "CSRF（跨站请求伪造）的攻击场景是？",
          options: [
            "你已登录 A 站，访问恶意 B 站时它偷偷以你的身份向 A 站发请求",
            "攻击者猜出了你的密码",
            "服务器宕机",
            "数据库被拖库",
          ],
          answer: 0,
          explanation:
            "浏览器会自动带上 A 站的 Cookie——B 站借刀杀人。防御：SameSite Cookie + CSRF Token（服务端校验请求确实发自本站页面）。",
        },
        {
          id: "sec-4-q6",
          prompt: "为什么「前端校验」不能替代「服务端校验」？",
          options: [
            "前端校验会拖慢页面",
            "前端代码在用户手里，可被绕过（直接调 API），服务端才是最后防线",
            "两者作用相同",
            "服务端没有能力校验",
          ],
          answer: 1,
          explanation:
            "前端校验只为体验（即时反馈），安全判定必须在服务端重做一遍——你无法信任任何来自客户端的数据。纵深防御的教科书案例。",
        },
        {
          id: "sec-4-q7",
          prompt: "「安全响应头」中防点击劫持的是？",
          options: [
            "`Content-Type`",
            "`X-Frame-Options: DENY`（禁止被 iframe 嵌套）",
            "`Cache-Control`",
            "`Accept-Encoding`",
          ],
          answer: 1,
          explanation:
            "点击劫持=把你的页面透明嵌进恶意页骗点击。类似的还有 CSP（限制脚本来源， XSS 纵深防御）和 HSTS（强制 HTTPS）。",
        },
      ],
    },
    {
      id: "sec-5",
      type: "minigame",
      title: "攻防配对",
      intro:
        "把左列的攻击手段与右列的防御方案正确配对。攻与防是一一对应的矛与盾——理解了矛，才知道盾为什么长这样。",
      game: "matching",
      config: {
        accent: "#ef4444",
        pairs: [
          { left: "SQL 注入", right: "参数化查询，SQL 与数据分离" },
          { left: "XSS 跨站脚本", right: "输出转义 + CSP 内容安全策略" },
          { left: "CSRF 跨站伪造", right: "SameSite Cookie + CSRF Token" },
          { left: "密码拖库", right: "bcrypt/argon2 加盐慢哈希" },
          { left: "钓鱼邮件", right: "核对发件人与链接，2FA 兜底" },
          { left: "暴力破解密码", right: "限速 + 账号锁定 + 强密码策略" },
        ],
      },
    },
    {
      id: "sec-6",
      type: "quiz",
      title: "大陆结算 · 日常安全实践",
      intro: "最后一关：把攻防知识落成每天的习惯，并完成整个知识版图的最终验收。",
      questions: [
        {
          id: "sec-6-q1",
          prompt: "收到「银行」短信说账户异常，附了链接。正确的第一步是？",
          options: [
            "立刻点链接登录查看",
            "不点链接，通过官方 App/客服电话自行核实",
            "转发给朋友帮忙判断",
            "回复短信询问",
          ],
          answer: 1,
          explanation:
            "钓鱼的核心是制造紧迫感。永远走自己书签里的官方渠道核实——链接背后的域名可能是 `bank-cf.cn` 这种高仿。",
        },
        {
          id: "sec-6-q2",
          prompt: "密码管理器解决的核心问题是？",
          options: [
            "让密码更复杂就不用改了",
            "每个站点唯一随机强密码 + 你只需记住一个主密码",
            "防止电脑中毒",
            "替代 2FA",
          ],
          answer: 1,
          explanation:
            "它直接消灭撞库的土壤：所有站点密码不同且你背不下来也无所谓。配合 2FA 是当前个人安全的最佳实践。",
        },
        {
          id: "sec-6-q3",
          prompt: "为什么软件更新（包括系统、依赖库）是安全必修课？",
          options: [
            "新版本界面更好看",
            "已知漏洞的补丁在里面——拖着不更等于大门挂着「此处可入」",
            "不更新会收费",
            "更新能让电脑变快",
          ],
          answer: 1,
          explanation:
            "绝大多数攻击利用的是已公开、已有补丁的漏洞。`pnpm audit`、 Dependabot 这类工具就是帮你盯着依赖里的 CVE。",
        },
        {
          id: "sec-6-q4",
          prompt: "公共 WiFi 下最大的风险与对策是？",
          options: [
            "网速慢；多等一会",
            "中间人窃听；只访问 HTTPS 站点、敏感操作用自家网络/手机热点",
            "耗电；带充电宝",
            "没有风险，现在都光纤了",
          ],
          answer: 1,
          explanation:
            "同网络的攻击者可做 ARP 欺骗窃听/劫持。HTTPS 端到端加密让你基本免疫窃听（注意证书告警千万别点继续）。",
        },
        {
          id: "sec-6-q5",
          prompt: "本站（CodeQuest）把成绩计算放在服务端，用纯函数 + 参数化 ORM + 自动迁移。这套架构体现的安全原则不包括？",
          options: [
            "不信任客户端输入（服务端权威计分）",
            "参数化查询防注入（Drizzle ORM）",
            "最小权限（非 root 容器运行）",
            "绝对无法被攻击",
          ],
          answer: 3,
          explanation:
            "安全是持续过程不是终点状态：没有「绝对安全」，只有「不断提高攻击成本」。能说出系统还有哪里弱（比如本站还没做接口限流）才是真正的安全思维。",
        },
        {
          id: "sec-6-q6",
          prompt: "八片大陆全部通关！接下来最该做的是？",
          options: [
            "把知识封存，从此不再复习",
            "动手实践：写 SQL、改页面、配一个 HTTPS 服务，在真实错误里长出肌肉记忆",
            "把分数截图发朋友圈",
            "删除浏览器历史",
          ],
          answer: 1,
          explanation:
            "从二进制的 0/1 到安全的三要素，你已拥有完整的计算机基础地图。地图只是地图——走出去了才算数。冒险愉快，冒险者！🎉",
        },
      ],
    },
  ],
};
