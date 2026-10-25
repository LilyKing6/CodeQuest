import type { Theme } from "../types";

export const networkTheme: Theme = {
  id: "network",
  title: "计算机网络",
  description:
    "从一根网线到整个互联网：握手、寻址、域名解析。亲手完成 TCP 握手与子网划分，网络不再是黑盒。",
  icon: "🌐",
  color: "#f472b6",
  levels: [
    {
      id: "network-1",
      type: "quiz",
      title: "信息的旅程",
      intro:
        "你按下回车，消息被切成小包、贴上地址、跨越山海再被拼回原文。先认识这场接力赛的基本规则。",
      questions: [
        {
          id: "network-1-q1",
          prompt: "网络分层模型（如 TCP/IP 四层）的核心价值是？",
          options: [
            "让网络更快",
            "各层各司其职、通过接口协作，便于设计与排错",
            "加密数据",
            "节省 IP 地址",
          ],
          answer: 1,
          explanation:
            "分层解耦：应用管内容、传输管可靠、网络管寻址、链路管传输。任何一层出问题都能定位到对应层——「哪一层的锅」。",
        },
        {
          id: "network-1-q2",
          prompt: "HTTP 协议工作在哪一层？",
          options: ["应用层", "传输层", "网络层", "链路层"],
          answer: 0,
          explanation:
            "HTTP 是应用层协议，负责「内容怎么表达」；它坐在传输层 TCP 之上，可靠传输由下层负责。",
        },
        {
          id: "network-1-q3",
          prompt: "IP 协议提供的传输保证是？",
          options: [
            "可靠、按序、不丢",
            "尽力而为（best-effort），不保证不丢不乱序",
            "加密",
            "压缩",
          ],
          answer: 1,
          explanation:
            "IP 只管「把包往目的地方向扔」，可能丢、可能乱序。可靠性由上层 TCP 补齐——各层职责的经典分工。",
        },
        {
          id: "network-1-q4",
          prompt: "「分组交换」相比早期电话网的「电路交换」优势是？",
          options: [
            "语音更清晰",
            "线路不必独占，多人共享、突发流量利用率高",
            "永远不丢包",
            "延迟恒定",
          ],
          answer: 1,
          explanation:
            "分组交换把数据切包排队转发，链路人人共享，成本低弹性大（代价：延迟抖动）。这是互联网胜出的关键。",
        },
        {
          id: "network-1-q5",
          prompt: "一个「包（packet）」通常包含？",
          options: [
            "只有数据",
            "头部（控制信息：地址等）+ 数据（载荷）",
            "只有地址",
            "整份文件",
          ],
          answer: 1,
          explanation:
            "像信封：信封（头部，写着收发地址）+ 信纸（数据）。每过一层还会再套一层「信封」——封装与解封装。",
        },
        {
          id: "network-1-q6",
          prompt: "Ping 命令使用的 ICMP 协议主要用来？",
          options: ["传输文件", "探测网络连通性与往返延迟", "分配 IP", "解析域名"],
          answer: 1,
          explanation:
            "ICMP 是网络层的「体检协议」，ping 通说明 IP 层可达；tracert 也靠它逐跳测量路径。",
        },
        {
          id: "network-1-q7",
          prompt: "带宽（bandwidth）与延迟（latency）的区别是？",
          options: [
            "一回事",
            "带宽是每秒能运多少数据，延迟是第一个字节到达要多久",
            "带宽决定距离",
            "延迟由运营商决定，带宽由网站决定",
          ],
          answer: 1,
          explanation:
            "水管比喻：带宽 = 管子粗细，延迟 = 水流过来要多久。游戏看延迟，下载看带宽——视频会议两个都要。",
        },
      ],
    },
    {
      id: "network-2",
      type: "minigame",
      title: "TCP 三次握手",
      intro:
        "建立可靠连接前，客户端与服务器要先「对暗号」。按正确顺序点击握手步骤，看连接如何从无到有。",
      game: "tcp-handshake",
      config: {
        steps: [
          "客户端 → 服务器：SYN（我想连接，我的序号是 x）",
          "服务器 → 客户端：SYN+ACK（收到！我也想连接，我的序号是 y，确认 x+1）",
          "客户端 → 服务器：ACK（收到你的！确认 y+1）",
          "连接建立，开始传输数据 🎉",
        ],
      },
    },
    {
      id: "network-3",
      type: "quiz",
      title: "给每台机器发地址",
      intro:
        "IP 地址是互联网的门牌号，DNS 是把域名翻译成门牌号的电话簿。这一关解决「你在哪」与「你是谁」。",
      questions: [
        {
          id: "network-3-q1",
          prompt: "IPv4 地址由多少位（bit）组成？",
          options: ["16 位", "32 位", "64 位", "128 位"],
          answer: 1,
          explanation:
            "IPv4 是 32 位，点分四组（每组 8 位，0~255），共约 43 亿个地址——2011 年已耗尽，所以有了 128 位的 IPv6。",
        },
        {
          id: "network-3-q2",
          prompt: "`192.168.1.100/24` 中的 `/24` 表示？",
          options: [
            "24 号端口",
            "前 24 位是网络号，其余 8 位是主机号",
            "速度 24 Mbps",
            "24 台设备",
          ],
          answer: 1,
          explanation:
            "子网掩码长度 24：前三组（192.168.1）是网络，最后一组是主机。这个网络最多容纳 254 台主机（0 是网络地址，255 是广播）。",
        },
        {
          id: "network-3-q3",
          prompt: "DNS 的作用是？",
          options: [
            "加密网页",
            "把域名（如 example.com）解析成 IP 地址",
            "分配 MAC 地址",
            "压缩网页",
          ],
          answer: 1,
          explanation:
            "人记域名，机器认 IP。DNS 是全球分布式「电话簿」，浏览器访问任何网站第一步几乎都是 DNS 查询。",
        },
        {
          id: "network-3-q4",
          prompt: "`127.0.0.1` 代表？",
          options: ["谷歌的地址", "本机回环地址（localhost）", "广播地址", "网关地址"],
          answer: 1,
          explanation:
            "127.0.0.0/8 是回环段，发给它的流量直接回到本机——本地开发调试 `localhost:3000` 就是它。",
        },
        {
          id: "network-3-q5",
          prompt: "私有地址段（内网专用，路由器不转发到公网）不包括？",
          options: [
            "10.0.0.0/8",
            "172.16.0.0/12",
            "192.168.0.0/16",
            "8.8.8.8",
          ],
          answer: 3,
          explanation:
            "8.8.8.8 是谷歌的公共 DNS 服务器（公网地址）。三大私有段用于家庭/公司内网，配合 NAT 上网。",
        },
        {
          id: "network-3-q6",
          prompt: "NAT（网络地址转换）让多台设备共享一个公网 IP 的方法是？",
          options: [
            "给每台设备发公网 IP",
            "路由器改写包的地址/端口并记录映射表",
            "压缩 IP 地址",
            "广播数据包",
          ],
          answer: 1,
          explanation:
            "内网设备用私有地址出门时，NAT 网关把源地址改写成自己的公网 IP+不同端口，回包按映射表转回。这也是 IPv4 续命术。",
        },
        {
          id: "network-3-q7",
          prompt: "MAC 地址与 IP 地址分别工作在？",
          options: [
            "都在网络层",
            "MAC 在链路层（标识网卡），IP 在网络层（标识位置）",
            "MAC 在应用层",
            "IP 在链路层",
          ],
          answer: 1,
          explanation:
            "MAC 像「身份证」（出厂固化、跟着设备走），IP 像「 postal 邮寄地址」（随网络变化）。逐跳转发靠 MAC，端到端靠 IP。",
        },
      ],
    },
    {
      id: "network-4",
      type: "minigame",
      title: "子网划分挑战",
      intro:
        "公司拿到一个 /24 网段，要分成两个部门子网，还有几个捣乱的地址想混进来。把每个地址拖进正确的子网！",
      game: "subnetting",
      config: {
        cidr: "192.168.8.0/24",
        groups: [
          { name: "研发部（前半段 .1~.127）", hostPart: "192.168.8.0/25" },
          { name: "市场部（后半段 .129~.254）", hostPart: "192.168.8.128/25" },
        ],
        decoys: ["192.168.9.37", "192.169.8.1"],
      },
    },
    {
      id: "network-5",
      type: "quiz",
      title: "HTTP 与安全",
      intro:
        "浏览器和服务器怎么「说话」？明信片为什么换成保险箱？最后一关看应用层协议与安全。",
      questions: [
        {
          id: "network-5-q1",
          prompt: "HTTP 响应码 `404` 表示？",
          options: ["服务器错误", "资源未找到", "请求成功", "需要认证"],
          answer: 1,
          explanation:
            "4xx 是客户端的错：404 未找到、403 禁止访问、401 未认证；200 成功、301 永久重定向、500 服务器内部错误。",
        },
        {
          id: "network-5-q2",
          prompt: "HTTP 与 HTTPS 的关键区别是？",
          options: [
            "HTTPS 用 443 端口且加了 TLS 加密与身份验证",
            "HTTPS 更快",
            "HTTP 不能传图片",
            "HTTPS 是另一种标记语言",
          ],
          answer: 0,
          explanation:
            "HTTP 明文传输（明信片），HTTPS 在 TCP 与 HTTP 之间加 TLS（保险箱）：防窃听、防篡改、防冒充——靠证书体系背书身份。",
        },
        {
          id: "network-5-q3",
          prompt: "TCP 与 UDP 的选择：直播弹幕更适合？",
          options: ["TCP（可靠）", "UDP（低延迟）", "ICMP", "ARP"],
          answer: 1,
          explanation:
            "弹幕丢一两条无所谓，卡顿不可忍——UDP 无连接、不重传、延迟低。文件下载则相反，必须 TCP 保证完整。",
        },
        {
          id: "network-5-q4",
          prompt: "「三次握手」后断开连接需要「四次挥手」，多一次是因为？",
          options: [
            "服务器偷懒",
            "被动关闭方收到 FIN 后可能还有数据没发完，ACK 和 FIN 要分开发",
            "协议写错了历史遗留",
            "为了对称美",
          ],
          answer: 1,
          explanation:
            "收到「我要走了」可以先回「知道了」再等手头数据发完才回「我也走了」——半关闭状态的存在使挥手多一步。",
        },
        {
          id: "network-5-q5",
          prompt: "Cookie 与 JWT 都用于「记住你」，主要区别是？",
          options: [
            "没有区别",
            "Cookie 由浏览器自动携带存储；JWT 是自包含的签名令牌，常用作无状态凭证",
            "Cookie 更安全",
            "JWT 只能用于游戏",
          ],
          answer: 1,
          explanation:
            "Cookie 是浏览器机制（可存 session id 或令牌），JWT 是令牌格式（服务端不存会话、验签名即可）。本站的会话 cookie 用的就是服务端会话方案。",
        },
        {
          id: "network-5-q6",
          prompt: "浏览器输入网址到页面显示的第一步通常是？",
          options: [
            "服务器渲染页面",
            "DNS 解析域名得到 IP",
            "TCP 三次握手",
            "下载图片",
          ],
          answer: 1,
          explanation:
            "先查 DNS（浏览器缓存→系统缓存→递归查询），拿到 IP 才能握手建连、发 HTTP 请求——后续关卡你会亲手玩这两个环节。",
        },
        {
          id: "network-5-q7",
          prompt: "CDN 加速网站的核心思路是？",
          options: [
            "提高服务器主频",
            "把内容缓存在离用户更近的边缘节点，缩短物理距离",
            "压缩 HTML",
            "限制用户数量",
          ],
          answer: 1,
          explanation:
            "光速有限，物理距离就是延迟下限。CDN 把静态资源复制到全球节点，用户就近取货——延迟与源站压力双降。",
        },
      ],
    },
    {
      id: "network-6",
      type: "quiz",
      title: "大陆结算 · 网络",
      intro: "分层、握手、寻址、加密——验收你对互联网的全链路理解。",
      questions: [
        {
          id: "network-6-q1",
          prompt: "网页加载慢，`ping` 正常但网页打不开，问题最可能在？",
          options: ["物理线路断了", "DNS 或应用层（Web 服务）故障", "键盘坏了", "显卡驱动"],
          answer: 1,
          explanation:
            "ping 走 ICMP 只证明网络层可达；DNS 挂了找不到门牌、Web 服务挂了没人应答，都会「ping 得通但打不开」——分层排错思路。",
        },
        {
          id: "network-6-q2",
          prompt: "视频通话卡顿但不断线，TCP 的哪种机制反而可能是「元凶」？",
          options: [
            "三次握手",
            "丢包重传（实时性让位于完整性）",
            "端口复用",
            "滑动窗口",
          ],
          answer: 1,
          explanation:
            "TCP 保证不丢不乱，代价是重传等待——实时音视频宁可丢帧也不等旧数据，所以底层用 UDP/RTP，在上层自己权衡。",
        },
        {
          id: "network-6-q3",
          prompt: "同一间宿舍两台电脑 IP 都是 `192.168.1.10`，会怎样？",
          options: [
            "没问题",
            "IP 冲突：通信混乱、时通时断",
            "自动变成 20",
            "只有先开机的能用",
          ],
          answer: 1,
          explanation:
            "同一二层网络内 IP 必须唯一，重复地址导致 ARP 表混乱、包送错人——所以需要 DHCP 自动分配避免手滑。",
        },
        {
          id: "network-6-q4",
          prompt: "HTTPS 能防住「中间人偷看内容」，靠的是？",
          options: [
            "密码复杂",
            "TLS 握手协商的对称密钥加密流量 + 证书验证服务器身份",
            "端口 443",
            "隐藏 IP",
          ],
          answer: 1,
          explanation:
            "非对称加密安全地交换对称密钥（握手），之后对称加密跑数据；证书链（CA 背书）防止「假服务器」骗走密钥。",
        },
        {
          id: "network-6-q5",
          prompt: "`traceroute` 能显示沿途每一跳，利用的机制是？",
          options: [
            "每一台路由器都会主动汇报",
            "发送 TTL 递增的探测包，路由器丢弃超时包时回送 ICMP 时间超时",
            "GPS 定位",
            "查询 DNS",
          ],
          answer: 1,
          explanation:
            "TTL=1 的包第一跳就「寿命耗尽」被丢弃并回报，TTL=2 第二跳回报……逐跳逼出整条路径——TTL 的巧妙用法。",
        },
        {
          id: "network-6-q6",
          prompt: "从输入网址到看到页面，按时间顺序排列正确的是？",
          options: [
            "DNS → TCP 握手 → TLS 握手 → HTTP 请求/响应 → 渲染",
            "TCP → DNS → HTTP → 渲染",
            "HTTP → DNS → 渲染",
            "渲染 → DNS → TCP",
          ],
          answer: 0,
          explanation:
            "先找地址（DNS）、再敲门（TCP 三次握手）、再上锁（TLS）、再递话（HTTP）、最后装修（渲染）。整条链路你已全部学过！",
        },
      ],
    },
  ],
};
