import type { Theme } from "../types";

export const webdevTheme: Theme = {
  id: "webdev",
  title: "Web 开发",
  description:
    "网页三件套是怎么协作的？HTML 搭骨架、CSS 上妆、JavaScript 给生命——再亲手调一次盒模型。",
  icon: "🎨",
  color: "#f97316",
  levels: [
    {
      id: "web-1",
      type: "quiz",
      title: "HTML：网页的骨架",
      intro:
        "HTML 不是编程语言，是标记语言——它描述「这段内容是什么」。语义正确，浏览器、搜索引擎和无障碍工具才能读懂你的页面。",
      questions: [
        {
          id: "web-1-q1",
          prompt: "HTML 的中文含义是？",
          options: [
            "超文本标记语言",
            "高级文本处理语言",
            "超链接传输协议",
            "主页制作语言",
          ],
          answer: 0,
          explanation:
            "HyperText Markup Language。用尖括号「标记」内容的结构与含义，浏览器负责把它渲染成页面。",
        },
        {
          id: "web-1-q2",
          prompt: "`<a>` 标签跳转目标地址由哪个属性指定？",
          options: ["`link`", "`href`", "`src`", "`to`"],
          answer: 1,
          explanation:
            "`<a href=\"https://...\">`。`src` 是给 img/script 这类「嵌入资源」用的——两者别混。",
        },
        {
          id: "web-1-q3",
          prompt: "页面主标题应该用哪个标签？",
          options: ["`<title>`", "`<h1>`", "`<header>`", "`<p class=\"title\">`"],
          answer: 1,
          explanation:
            "`<h1>`~`<h6>` 是标题层级，`<h1>` 每页最好只有一个；`<title>` 是浏览器标签页上的文字，不在页面内容里。",
        },
        {
          id: "web-1-q4",
          prompt: "「语义化标签」的好处不包括？",
          options: [
            "屏幕阅读器能更好理解页面结构（无障碍）",
            "搜索引擎更准确抓取内容（SEO）",
            "代码可读性更好",
            "页面加载速度一定翻倍",
          ],
          answer: 3,
          explanation:
            "语义化（如 `<nav>` `<article>` `<footer>`）换的是结构与可理解性，不是性能魔法——速度主要由资源大小和网络决定。",
        },
        {
          id: "web-1-q5",
          prompt: "`<img>` 的 `alt` 属性是干什么的？",
          options: [
            "图片加载失败/读屏时的替代文本",
            "图片的文件名",
            "鼠标悬停的广告",
            "图片的透明度",
          ],
          answer: 0,
          explanation:
            "alt 是图片的文字替身：网差、图挂了、以及视障用户的读屏都靠它。写 alt 也是 SEO 基本功。",
        },
        {
          id: "web-1-q6",
          prompt: "div 和 span 最核心的区别是？",
          options: [
            "div 是行内元素，span 是块级",
            "div 是块级（独占一行），span 是行内（随内容排列）",
            "span 只能放文字",
            "没有区别",
          ],
          answer: 1,
          explanation:
            "块级元素横向占满一行、可设宽高；行内元素排在一行里、宽高由内容决定。div/span 本身无语义，只是「通用容器」。",
        },
        {
          id: "web-1-q7",
          prompt: "表单里用户输入和提交要靠哪对要素？",
          options: [
            "`<form>` 容器 + `<input>/<button>` 等控件",
            "`<table>` + `<td>`",
            "`<div>` + `<p>`",
            "`<head>` + `<body>`",
          ],
          answer: 0,
          explanation:
            "`<form>` 定义提交到哪（action）与怎么提交（method），内部控件带 `name`，提交时名字=值 组成请求体。",
        },
      ],
    },
    {
      id: "web-2",
      type: "quiz",
      title: "CSS：外观与布局",
      intro:
        "CSS 用「选择器找到元素，声明改它的样子」。盒模型与选择器优先级是 CSS 的两大基石，也是样式「不生效」的元凶。",
      questions: [
        {
          id: "web-2-q1",
          prompt: "CSS 规则「给 class 为 btn 的元素上色」正确写法是？",
          options: ["`btn { color: red }`", "`.btn { color: red }`", "`#btn { color: red }`", "`<btn> color: red`"],
          answer: 1,
          explanation: "`.` 选 class、`#` 选 id、无前缀选标签。忘了点是 CSS 新手第一常见错误。",
        },
        {
          id: "web-2-q2",
          prompt: "盒模型从内到外的顺序是？",
          options: [
            "margin → border → padding → content",
            "content → padding → border → margin",
            "content → border → padding → margin",
            "padding → content → margin → border",
          ],
          answer: 1,
          explanation:
            "内容(content) → 内边距(padding) → 边框(border) → 外边距(margin)。下个游戏的滑块会让你亲手感受它。",
        },
        {
          id: "web-2-q3",
          prompt: "默认 `box-sizing: content-box` 时，width 指的是？",
          options: [
            "元素总宽（含 padding/border）",
            "仅内容区宽度，padding/border 另外往外加",
            "含 margin 的占位宽",
            "浏览器窗口宽度",
          ],
          answer: 1,
          explanation:
            "这就是「设了 width:100px 却变成 140px」的经典困惑。现代项目普遍用 `box-sizing: border-box` 让 width 直接等于总宽。",
        },
        {
          id: "web-2-q4",
          prompt: "选择器优先级（特异性）从高到低，正确的是？",
          options: [
            "行内 style > id > class > 标签",
            "标签 > class > id",
            "class > 行内 style > id",
            "都一样，看谁写在后面",
          ],
          answer: 0,
          explanation:
            "行内样式 > id（百位） > class/属性/伪类（十位） > 标签/伪元素（个位）；同级才按出现顺序后者胜。`!important` 能强提优先级但要慎用。",
        },
        {
          id: "web-2-q5",
          prompt: "让元素水平居中，`margin: 0 auto` 生效的前提是？",
          options: [
            "元素是块级且有确定宽度",
            "元素必须是行内元素",
            "父元素必须有背景色",
            "任何时候都行",
          ],
          answer: 0,
          explanation:
            "`auto` 把两侧剩余空间平分——块级元素没有确定宽度时它就占满一行，没有「剩余空间」可分。Flex 布局里则用 `justify-content`。",
        },
        {
          id: "web-2-q6",
          prompt: "Flex 布局中「主轴方向」由哪个属性决定？",
          options: ["`flex-wrap`", "`flex-direction`", "`justify-content`", "`align-items`"],
          answer: 1,
          explanation:
            "`flex-direction: row/column` 定主轴；`justify-content` 管主轴对齐、`align-items` 管交叉轴对齐。",
        },
        {
          id: "web-2-q7",
          prompt: "「手机上一列、桌面两列」的响应式效果，最合适的工具是？",
          options: [
            "媒体查询（`@media (min-width: 768px)`）或 Grid 的 auto-fit",
            "用 JS 检测屏幕后改 HTML",
            "给每个设备写一个独立网站",
            "把字体缩小",
          ],
          answer: 0,
          explanation:
            "媒体查询让同一份 HTML 按视口宽度套用不同样式；Grid/Flex 的自适应能力常能少写甚至不写断点。",
        },
      ],
    },
    {
      id: "web-3",
      type: "minigame",
      title: "盒模型挑战",
      intro:
        "内容宽度固定，用滑块调 padding 和 border，让元素总宽精确命中目标。亲手摸一遍盒模型，它就再也骗不到你。",
      game: "css-box",
      config: {
        contentWidth: 120,
        targets: [
          { total: 140, hint: "只加一点点内边距" },
          { total: 180, hint: "考虑 padding 会乘 2" },
          { total: 172, hint: "border 和 padding 组合拳" },
          { total: 200, hint: "最宽的方案不止一种，但都遵循同一个公式" },
        ],
      },
    },
    {
      id: "web-4",
      type: "quiz",
      title: "JavaScript 与 DOM",
      intro:
        "JavaScript 是浏览器里唯一的编程语言。它通过 DOM（文档对象模型）读写页面——「点一下按钮就变化」的本质是监听事件、修改 DOM。",
      questions: [
        {
          id: "web-4-q1",
          prompt: "`const` 声明的变量和 `let` 的关键区别是？",
          options: [
            "const 的值永远不能变",
            "const 绑定不可重新赋值（对象内容仍可修改）",
            "let 只能在浏览器用",
            "没有区别",
          ],
          answer: 1,
          explanation:
            "`const arr = []; arr.push(1)` 合法——const 锁的是「绑定」不是「内容」。需要真正不可变要另想办法（如 Object.freeze）。",
        },
        {
          id: "web-4-q2",
          prompt: "`===` 与 `==` 的区别是？",
          options: [
            "完全一样",
            "`===` 不做类型转换，类型不同直接 false；`==` 会先隐式转换再比",
            "`==` 更严格",
            "`===` 只能比较数字",
          ],
          answer: 1,
          explanation:
            "`1 == '1'` 是 true（转换后比），`1 === '1'` 是 false。现代规范一律推荐 `===`。",
        },
        {
          id: "web-4-q3",
          prompt: "`document.querySelector('.item')` 的作用是？",
          options: [
            "创建一个新元素",
            "按 CSS 选择器查找第一个匹配的元素",
            "删除元素",
            "修改样式",
          ],
          answer: 1,
          explanation:
            "返回第一个匹配 `.item` 的元素（没有则 null）；`querySelectorAll` 返回全部。拿到引用后才能读改它。",
        },
        {
          id: "web-4-q4",
          prompt: "「点击按钮时执行函数」的正确机制是？",
          options: [
            "给按钮元素加事件监听 `addEventListener('click', fn)`",
            "在 CSS 里写 click 事件",
            "函数名和按钮 id 相同就会自动执行",
            "刷新页面",
          ],
          answer: 0,
          explanation:
            "事件监听是浏览器编程的基本模型：注册「发生了什么 → 执行什么」。这也是本站小游戏交互的实现方式。",
        },
        {
          id: "web-4-q5",
          prompt: "下面哪段代码会阻塞页面渲染？",
          options: [
            "`setTimeout(fn, 0)`",
            "在 `<head>` 里放一个不带 defer/async 的重型 `<script src>`",
            "`fetch('/api/data')`",
            "`console.log('hi')`",
          ],
          answer: 1,
          explanation:
            "同步脚本会暂停 HTML 解析直到下载执行完（所以有了 defer/async）；fetch 和 setTimeout 都是异步的，不阻塞。",
        },
        {
          id: "web-4-q6",
          prompt: "JavaScript 是单线程的，它靠什么处理网络请求这类耗时操作而不卡死页面？",
          options: [
            "开了多个浏览器窗口",
            "事件循环（Event Loop）+ 异步回调/Promise",
            "让用户等待",
            "把请求转给显卡",
          ],
          answer: 1,
          explanation:
            "耗时任务交给浏览器的其他线程，完成后回调进入任务队列，事件循环在主线程空闲时执行——这就是 async/await 的底层舞台。",
        },
        {
          id: "web-4-q7",
          prompt: "`JSON.parse(JSON.stringify(obj))` 常被用来？",
          options: [
            "加密对象",
            "对纯数据对象做一次「深拷贝」（有局限：函数/undefined 会丢）",
            "压缩对象体积",
            "校验对象类型",
          ],
          answer: 1,
          explanation:
            "老派的深拷贝技巧，捷径必有代价：丢函数、丢 undefined、日期变字符串。新标准里 `structuredClone()` 更可靠。",
        },
      ],
    },
    {
      id: "web-5",
      type: "minigame",
      title: "标签语义配对",
      intro:
        "每个 HTML 标签都有自己的语义岗位。把左列的标签和右列「它该装什么内容」正确配对——语义化是写给浏览器和搜索引擎看的自我介绍。",
      game: "matching",
      config: {
        accent: "#f97316",
        pairs: [
          { left: "<a href>", right: "链接：跳到另一个页面或位置" },
          { left: "<img alt>", right: "图片，alt 是它的文字替身" },
          { left: "<nav>", right: "导航区：一组站点链接" },
          { left: "<form>", right: "表单：收集用户输入并提交" },
          { left: "<button>", right: "按钮：触发页面上的动作" },
          { left: "<table>", right: "二维数据：行列结构的表格" },
        ],
      },
    },
    {
      id: "web-6",
      type: "quiz",
      title: "前后端协作",
      intro:
        "浏览器与服务器靠 HTTP+JSON 交换数据。这一关把你在大陆 4 学到的网络知识接到代码上：fetch、状态码、渲染。",
      questions: [
        {
          id: "web-6-q1",
          prompt: "前端向后端请求数据的现代标准组合是？",
          options: [
            "FTP + XML",
            "HTTP(S) + JSON",
            "SMTP + CSV",
            "WebSocket + 纯文本",
          ],
          answer: 1,
          explanation:
            "fetch/axios 发 HTTP 请求，JSON 是事实上的数据交换格式（轻、可读、语言无关）。",
        },
        {
          id: "web-6-q2",
          prompt: "`fetch('/api/progress')` 默认发起的是？",
          options: ["GET 请求", "POST 请求", "PUT 请求", "OPTIONS 请求"],
          answer: 0,
          explanation:
            "fetch 默认 GET；要 POST 需显式传 `{ method: 'POST', body: JSON.stringify(...) }`——本站成绩上报就是这么做的。",
        },
        {
          id: "web-6-q3",
          prompt: "收到响应后第一件事通常是？",
          options: [
            "直接当 JSON 用",
            "检查 `res.ok`/状态码，再做 `res.json()` 解析",
            "重新加载页面",
            "把响应打印给用户",
          ],
          answer: 1,
          explanation:
            "fetch 对 404/500 不会抛错（只对网络错误抛）——不检查 ok 就解析，错误页的 HTML 会被当成数据。",
        },
        {
          id: "web-6-q4",
          prompt: "为什么网站登录后，刷新页面还是登录态？",
          options: [
            "浏览器记住了密码",
            "会话凭证（Cookie/Token）随每个请求自动携带，服务端据此识别你",
            "页面缓存了所有数据",
            "HTML 里有你的账号",
          ],
          answer: 1,
          explanation:
            "本站用 better-auth 签发的会话 Cookie。Token 方案（JWT）则由前端显式带上——两种「记住你」的方式。",
        },
        {
          id: "web-6-q5",
          prompt: "SPA（单页应用）与传统多页网站最大的区别是？",
          options: [
            "SPA 不用 JavaScript",
            "SPA 由 JS 在客户端切换「页面」，只按需取数据，不整页刷新",
            "SPA 不能联网",
            "SPA 一定更快",
          ],
          answer: 1,
          explanation:
            "SPA 首载一个「空壳+JS」，之后路由切换靠 JS 渲染。代价是首屏与 SEO 要额外优化——这正是 Next.js 这类框架要解决的（本站就是）。",
        },
        {
          id: "web-6-q6",
          prompt: "「加载中…」转圈的正确打开方式是？",
          options: [
            "请求发出前显示 loading，收到响应后隐藏（无论成败都要隐藏）",
            "永远显示 loading",
            "用 alert 弹窗代替",
            "不需要 loading，用户会等",
          ],
          answer: 0,
          explanation:
            "乐观 UI 与加载态是体验的基本盘；本站结算「已保存/保存失败」就是请求结果的两种 UI 反馈。",
        },
        {
          id: "web-6-q7",
          prompt: "CORS 报错时，问题出在哪一侧的配置？",
          options: [
            "浏览器坏了",
            "服务端没有允许该来源的跨域响应头",
            "前端代码写错了变量名",
            "JSON 格式不对",
          ],
          answer: 1,
          explanation:
            "浏览器执行「同源策略」，跨域请求需要服务端返回 `Access-Control-Allow-Origin` 等头放行。CORS 报错=服务端配置问题，不是前端 bug。",
        },
      ],
    },
  ],
};
