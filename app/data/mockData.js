const unifiedMockData = [
  {
      id: 1,
      name: "Somchai Mhaiprong",
      avatar: "S",
      imgUrl: "https://ui-avatars.com/api/?name=Somchai+Mhaiprong&background=random", 
      channel: "Line",
      platform: "line",
      columnId: "col-1",
      email: "somchai@example.com",
      phone: "0812345678",
      company: "Siam Trading Co., Ltd.",
      country: "Thailand",
      time: "10:30 AM",
      tags: [],
      status: "Pending",
      lastMessage: "โอนเงินเรียบร้อยแล้วครับ เช็คยอดให้หน่อย",
      messages: [
          { from: "customer", text: "โอนเงินเรียบร้อยแล้วครับ เช็คยอดให้หน่อย", timestamp: "10:30 AM" }
      ]
  },

  {
      id: 2,
      name: "Jinju Jingjang",
      avatar: "J",
      imgUrl: "https://ui-avatars.com/api/?name=Jinju+Jingjang&background=random",
      channel: "Facebook",
      platform: "facebook",
      columnId: "col-1",
      email: null,
      time: "08:30 AM",
      tags: [],
      status: "New Chat",
      lastMessage: "สนใจสินค้าสีชมพูค่ะ มีของพร้อมส่งมั้ยคะ?",
      messages: [
          { from: "customer", text: "สนใจสินค้าสีชมพูค่ะ มีของพร้อมส่งมั้ยคะ?", timestamp: "08:30 AM" }
      ]
  },

  {
      id: 3,
      name: "Jane Doe",
      avatar: "J",
      imgUrl: "https://ui-avatars.com/api/?name=Jane+Doe&background=random",
      channel: "Line",
      platform: "line",
      columnId: "col-3", 
      email: "jane.doe@example.com",
      phone: "0800000000",
      company: "Global Corp",
      country: "Thailand",
      time: "09:00 AM",
      tags: [],
      status: "Closed",
      lastMessage: "ได้รับสินค้าเคลมแล้วค่ะ ขอบคุณมากนะคะ",
      messages: [
          { from: "customer", text: "ได้รับสินค้าเคลมแล้วค่ะ ขอบคุณมากนะคะ", timestamp: "09:00 AM" }
      ]
  },

  {
      id: 4,
      name: "Robert Brown",
      avatar: "R",
      imgUrl: "https://ui-avatars.com/api/?name=Robert+Brown&background=random",
      channel: "Facebook",
      platform: "facebook",
      columnId: "col-1",
      email: "robert.b@techhub.com",
      phone: "2025550101",
      company: "TechHub Solutions",
      country: "USA",
      time: "09:15 AM",
      tags: [],
      status: "Open",
      lastMessage: "รบกวนขอใบเสนอราคาสำหรับ 50 เครื่องครับ",
      messages: [
          { from: "customer", text: "รบกวนขอใบเสนอราคาสำหรับ 50 เครื่องครับ", timestamp: "09:15 AM" }
      ]
  },

  {
      id: 5,
      name: "Emily Chen",
      avatar: "E",
      imgUrl: "https://ui-avatars.com/api/?name=Emily+Chen&background=random",
      channel: "Line",
      platform: "line",
      columnId: "col-2",
      email: "emily.c@design.co.jp",
      phone: "9011223344",
      company: "Sakura Design",
      country: "Japan",
      time: "11:20 AM",
      tags: [],
      status: "Open",
      lastMessage: "แบบร่างที่ส่งมาสวยมากค่ะ ชอบสีนี้เลย",
      messages: [
          { from: "customer", text: "แบบร่างที่ส่งมาสวยมากค่ะ ชอบสีนี้เลย", timestamp: "11:20 AM" }
      ]
  },

  {
      id: 6,
      name: "Michael Wilson",
      avatar: "M",
      imgUrl: "https://ui-avatars.com/api/?name=Michael+Wilson&background=random",
      channel: "Line",
      platform: "line",
      columnId: "col-3",
      email: null,
      phone: "0899988877",
      company: "Siam Trading Co., Ltd.",
      country: "Thailand",
      time: "Monday",
      tags: [],
      status: "Closed",
      lastMessage: "ได้รับของแล้วครับ บริการรวดเร็วมาก",
      messages: [
          { from: "customer", text: "ได้รับของแล้วครับ บริการรวดเร็วมาก", timestamp: "Monday" }
      ]
  },

  {
      id: 7,
      name: "Sarah O'Connor",
      avatar: "S",
      imgUrl: "https://ui-avatars.com/api/?name=Sarah+Connor&background=random",
      channel: "Facebook",
      platform: "facebook",
      columnId: "col-1",
      email: "sarah@skynet.com",
      phone: "3105550199",
      company: "Cyberdyne Systems",
      country: "USA",
      time: "11:55 AM",
      tags: [],
      status: "Open",
      lastMessage: "ระบบหลังบ้านเข้าไม่ได้ค่ะ ช่วยเช็คด่วนเลย!",
      messages: [
          { from: "customer", text: "ระบบหลังบ้านเข้าไม่ได้ค่ะ ช่วยเช็คด่วนเลย!", timestamp: "11:55 AM" }
      ]
  },

  {
      id: 8,
      name: "David Kim",
      avatar: "D",
      imgUrl: "https://ui-avatars.com/api/?name=David+Kim&background=random",
      channel: "Line",
      platform: "line",
      columnId: "col-1",
      email: "david.kim@seoulfood.kr",
      phone: null,
      company: "Seoul Food Co., Ltd.",
      country: "Other",
      time: "09:45 AM",
      tags: [],
      status: "Open",
      lastMessage: "สินค้าล็อตใหม่จะส่งออกจากเกาหลีคืนนี้ครับ",
      messages: [
          { from: "customer", text: "สินค้าล็อตใหม่จะส่งออกจากเกาหลีคืนนี้ครับ", timestamp: "09:45 AM" }
      ]
  },

  {
      id: 9,
      name: "Jessica Jones",
      avatar: "J",
      imgUrl: "https://ui-avatars.com/api/?name=Jessica+Jones&background=random",
      channel: "Line",
      platform: "line",
      columnId: "col-3",
      email: "jessica@alias.com",
      phone: "9175550123",
      company: null,
      country: "USA",
      time: "Sunday",
      tags: [],
      status: "Closed",
      lastMessage: "สวัสดีครับ มีสินค้าอะไรใหม่แนะนำบ้างครับ?",
      messages: [
          { from: "customer", text: "สวัสดีครับ มีสินค้าอะไรใหม่แนะนำบ้างครับ?", timestamp: "Sunday" }
      ]
  },

  {
      id: 10,
      name: "William Davis",
      avatar: "W",
      imgUrl: "https://ui-avatars.com/api/?name=William+Davis&background=random",
      channel: "Facebook",
      platform: "facebook",
      columnId: "col-1",
      email: "william.d@globalcorp.com",
      phone: "2125550188",
      company: "Global Corp",
      country: "USA",
      time: "11:00 AM",
      tags: [],
      status: "Open",
      lastMessage: "สนใจดีลที่เสนอมาครับ สะดวกนัดคุยอาทิตย์หน้ามั้ย",
      messages: [
          { from: "customer", text: "สนใจดีลที่เสนอมาครับ สะดวกนัดคุยอาทิตย์หน้ามั้ย", timestamp: "11:00 AM" }
      ]
  },

  {
      id: 11, 
      name: "OH HO",
      avatar: "O",
      imgUrl: "https://ui-avatars.com/api/?name=OH+HO&background=random",
      channel: "Line",
      platform: "line",
      columnId: "col-1",
      email: null,
      phone: null,
      company: null,
      country: null,
      time: "08:00 AM",
      tags: [],
      status: "New Chat",
      lastMessage: "สอบถามครับ ร้านเปิดกี่โมงครับ",
      messages: [
          { from: "customer", text: "สอบถามครับ ร้านเปิดกี่โมงครับ", timestamp: "08:00 AM" }
      ]
  },
  
  {
      id: 12,
      name: "Linda Garcia",
      avatar: "L",
      imgUrl: "https://ui-avatars.com/api/?name=Linda+Garcia&background=random",
      channel: "Line",
      platform: "line",
      columnId: "col-1",
      email: null,
      phone: null,
      company: "Freelance",
      country: "Thailand",
      time: "12:05 PM",
      tags: [],
      status: "Open",
      lastMessage: "สวัสดีค่ะ ทางร้านรับกราฟิกเพิ่มมั้ยคะ?",
      messages: [
          { from: "customer", text: "สวัสดีค่ะ ทางร้านรับกราฟิกเพิ่มมั้ยคะ?", timestamp: "12:05 PM" }
      ]
  },

  {
      id: 13,
      name: "Thomas Anderson",
      avatar: "T",
      imgUrl: "https://ui-avatars.com/api/?name=Thomas+Anderson&background=random",
      channel: "Facebook",
      platform: "facebook",
      columnId: "col-1",
      email: "neo@matrix.com",
      phone: null,
      company: "Metaverse",
      country: "USA",
      time: "1:00 PM",
      tags: [],
      status: "Open",
      lastMessage: "ผมต้องการอาวุธ... จำนวนมาก",
      messages: [
          { from: "customer", text: "ผมต้องการอาวุธ... จำนวนมาก", timestamp: "1:00 PM" }
      ]
  },

  {
      id: 14,
      name: "Nancy Drew",
      avatar: "N",
      imgUrl: "https://ui-avatars.com/api/?name=Nancy+Drew&background=random",
      channel: "Facebook",
      platform: "facebook",
      columnId: "col-3",
      email: "nancy@detective.com",
      phone: "3125550144",
      company: "Private Detective",
      country: "USA",
      time: "Yesterday",
      tags: [],
      status: "Closed",
      lastMessage: "สวัสดีค่ะ",
      messages: [
          { from: "customer", text: "สวัสดีค่ะ", timestamp: "Yesterday" }
      ]
  }
];

export { unifiedMockData };
export default unifiedMockData;