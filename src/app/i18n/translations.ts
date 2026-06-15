export type Lang = 'de' | 'en' | 'zh';

export interface Dict {
  // ── Navigation ──────────────────────────────────────────
  navMenu: string;
  navOrders: string;
  navTakeaway: string;
  navAnfahrt: string;
  navLogin: string;
  navLogout: string;
  navOpen: string;
  // ── Sprachen ────────────────────────────────────────────
  langDe: string;
  langEn: string;
  langZh: string;
  // ── Hero ────────────────────────────────────────────────
  heroEyebrow: string;
  heroTagline: string;
  heroDesc: string;
  heroOrder: string;
  heroReserve: string;
  heroOpen: string;
  ruhetagTitle: string;
  ruhetagBody: string;
  ruhetagLink: string;
  empTitle: string;
  empSubtitle: string;
  empToday: string;
  empFullMenu: string;
  // ── Footer ──────────────────────────────────────────────
  footerImprint: string;
  footerContact: string;
  footerPrivacy: string;
  // ── Orders ──────────────────────────────────────────────
  ordersTitle: string;
  ordersTable: string;
  ordersTables: string;
  ordersInProgress: string;
  ordersNewBtn: string;
  ordersEmptyTitle: string;
  ordersEmptyText: string;
  ordersFirstBtn: string;
  ordersCompletedBadge: string;
  ordersInProgressBadge: string;
  ordersDrinks: string;
  ordersService: string;
  ordersAdults: string;
  ordersChildren: string;
  ordersDuplicate: string;    // enthält {n}
  deleteTitle: string;        // enthält {n}
  deleteMsg: string;
  deleteCancelBtn: string;
  deleteConfirmBtn: string;
  // ── Add-Order Modal ─────────────────────────────────────
  modalBadge: string;
  modalNewTitle: string;
  modalEditTitle: string;
  modalSubtitle: string;
  modalSec1: string;
  modalSelectTable: string;
  modalTableOption: string;   // enthält {n}
  modalSec2: string;
  modalSec3: string;
  modalBuffetTitle: string;
  modalBuffetDesc: string;
  modalCarteTitle: string;
  modalCarteDesc: string;
  modalAdults: string;
  modalChildren: string;
  modalTotal: string;
  modalPersons: string;
  modalPersonCount: string;
  modalComment: string;
  modalCommentPh: string;
  modalCancelBtn: string;
  modalSaveBtn: string;
  modalNoDrinks: string;
  modalDrinkItems: string;    // enthält {n}
  modalTableLabel: string;    // enthält {n}
  // Drink-Kategorien
  catSoftdrinks: string;
  catBier: string;
  catSaefte: string;
  catWasser: string;
  catWein: string;
  catWarm: string;
  // ── Login Modal ─────────────────────────────────────────
  loginBadge: string;
  loginTitle: string;
  loginSubtitle: string;
  loginUsername: string;
  loginUsernamePh: string;
  loginPassword: string;
  loginPasswordPh: string;
  loginShowPass: string;
  loginHidePass: string;
  loginInvalid: string;
  loginLocked: string;        // enthält {n}
  loginCancelBtn: string;
  loginSubmitBtn: string;
  // ── Anfahrt ─────────────────────────────────────────────
  anfahrtEyebrow: string;
  anfahrtAddress: string;
  anfahrtHours: string;
  anfahrtDaysRegular: string;
  anfahrtTuesday: string;
  anfahrtClosed: string;
  anfahrtPhone: string;
  anfahrtNote: string;
  anfahrtDirections: string;
  anfahrtCall: string;
  anfahrtMaps: string;
  anfahrtMapTitle: string;
  // ── Takeaway ────────────────────────────────────────────
  takeawayEyebrow: string;
  takeawayTitle: string;
  takeawaySub: string;
  takeawayStep1: string;
  takeawayStep1Desc: string;
  takeawayStep2: string;
  takeawayStep2Desc: string;
  takeawayStep3: string;
  takeawayStep3Desc: string;
  takeawayHours: string;
  takeawayLunch: string;
  takeawayDinner: string;
  takeawayTuesdayClosed: string;
  takeawayPickup: string;
  takeawayOrderPhone: string;
  takeawayCallUs: string;
  // ── Speisekarte ─────────────────────────────────────────
  menuTitle: string;
  menuResultSg: string;
  menuResultPl: string;
  menuFor: string;
  menuDishes: string;
  menuCategories: string;
  menuOpen: string;
  menuPrint: string;
  menuSearchPh: string;
  menuClear: string;
  menuNoResults: string;
  menuNoResultsHint: string;
}

export const translations: Record<Lang, Dict> = {

  // ════════════════════════════════════════════════════════
  // DEUTSCH
  // ════════════════════════════════════════════════════════
  de: {
    navMenu: 'SPEISEKARTE',
    navOrders: 'BESTELLUNGEN',
    navTakeaway: 'TAKE AWAY',
    navAnfahrt: 'ANFAHRT',
    navLogin: 'Anmelden',
    navLogout: 'Abmelden',
    navOpen: 'Navigation öffnen',

    langDe: 'Deutsch',
    langEn: 'English',
    langZh: '中文简体',

    heroEyebrow: 'CHINESISCHE SPEZIALITÄTEN · BOCHUM',
    heroTagline: 'frisch aus dem Wok',
    heroDesc: 'Authentische Ente und feine Wok-Küche — seit über zwanzig Jahren im Herzen von Bochum, zubereitet mit Sorgfalt und serviert mit Wärme.',
    heroOrder: 'Jetzt bestellen  →',
    heroReserve: 'Tisch reservieren',
    heroOpen: 'GEÖFFNET BIS 22:00',

    ruhetagTitle: 'Heute Ruhetag –',
    ruhetagBody: 'Das Duck House hat dienstags geschlossen. Wir freuen uns, Sie ab Mittwoch wieder begrüßen zu dürfen.',
    ruhetagLink: 'Reservierungen',

    empTitle: 'Empfehlungen',
    empSubtitle: 'AUS DER KÜCHE DES HAUSES',
    empToday: 'Heute',
    empFullMenu: 'Ganze Karte →',

    footerImprint: 'Impressum',
    footerContact: 'Kontakt',
    footerPrivacy: 'Datenschutz',

    ordersTitle: 'Bestellungen',
    ordersTable: 'Tisch',
    ordersTables: 'Tische',
    ordersInProgress: 'in Bearbeitung',
    ordersNewBtn: 'Neue Bestellung',
    ordersEmptyTitle: 'Noch keine Bestellungen',
    ordersEmptyText: 'Erfasse den ersten Tisch für diesen Service.',
    ordersFirstBtn: 'Erste Bestellung anlegen',
    ordersCompletedBadge: 'Abgeschlossen',
    ordersInProgressBadge: 'In Bearbeitung',
    ordersDrinks: 'Getränke',
    ordersService: 'Service',
    ordersAdults: 'Erw.',
    ordersChildren: 'Kind.',
    ordersDuplicate: 'Tisch {n} ist bereits belegt — Bestellung wurde nicht gespeichert.',
    deleteTitle: 'Tisch {n} löschen?',
    deleteMsg: 'Diese Bestellung wird endgültig entfernt und kann nicht wiederhergestellt werden.',
    deleteCancelBtn: 'Abbrechen',
    deleteConfirmBtn: 'Löschen',

    modalBadge: 'BESTELLUNG ERFASSEN',
    modalNewTitle: 'Neue Bestellung',
    modalEditTitle: 'Bestellung bearbeiten',
    modalSubtitle: 'Tisch wählen, Getränke erfassen und festlegen, ob am Buffet oder à la carte serviert wird.',
    modalSec1: 'TISCHNUMMER',
    modalSelectTable: 'Tisch auswählen',
    modalTableOption: 'Tisch {n}',
    modalSec2: 'GETRÄNKE',
    modalSec3: 'SERVIERART',
    modalBuffetTitle: 'Buffet',
    modalBuffetDesc: 'All-you-can-eat — Gäste bedienen sich am Buffet.',
    modalCarteTitle: 'À la carte',
    modalCarteDesc: 'Bestellung direkt von der Speisekarte.',
    modalAdults: 'Erwachsene',
    modalChildren: 'Kinder',
    modalTotal: 'Gesamt:',
    modalPersons: 'Personen',
    modalPersonCount: 'Anzahl Personen',
    modalComment: 'Kommentar',
    modalCommentPh: 'Was wurde aus der Karte bestellt?',
    modalCancelBtn: 'Abbrechen',
    modalSaveBtn: 'Bestellung anlegen',
    modalNoDrinks: 'Noch keine Getränke gewählt',
    modalDrinkItems: '{n} Positionen ausgewählt',
    modalTableLabel: 'Tisch {n}',
    catSoftdrinks: 'Softdrinks',
    catBier: 'Bier',
    catSaefte: 'Säfte',
    catWasser: 'Wasser',
    catWein: 'Wein & Schnaps',
    catWarm: 'Kaffee und Tee',

    loginBadge: 'ZUGANG GESICHERT',
    loginTitle: 'Anmelden',
    loginSubtitle: 'Bitte melden Sie sich an, um auf den Bestellbereich zuzugreifen.',
    loginUsername: 'Benutzername',
    loginUsernamePh: 'Benutzername eingeben',
    loginPassword: 'Passwort',
    loginPasswordPh: 'Passwort eingeben',
    loginShowPass: 'Passwort anzeigen',
    loginHidePass: 'Passwort verbergen',
    loginInvalid: 'Benutzername oder Passwort falsch.',
    loginLocked: 'Zu viele Fehlversuche — bitte {n} Sekunden warten.',
    loginCancelBtn: 'Abbrechen',
    loginSubmitBtn: 'Anmelden',

    anfahrtEyebrow: 'RESTAURANT & ANFAHRT',
    anfahrtAddress: 'Adresse',
    anfahrtHours: 'Öffnungszeiten',
    anfahrtDaysRegular: 'Mo – Sa & So',
    anfahrtTuesday: 'Dienstag',
    anfahrtClosed: 'Ruhetag',
    anfahrtPhone: 'Telefon & Reservierung',
    anfahrtNote: 'Reservierungen jederzeit telefonisch möglich.',
    anfahrtDirections: 'Route planen',
    anfahrtCall: 'Anrufen',
    anfahrtMaps: 'In Google Maps öffnen',
    anfahrtMapTitle: 'Duck House — Standort auf Google Maps',

    takeawayEyebrow: 'TAKE AWAY',
    takeawayTitle: 'Essen zum Mitnehmen',
    takeawaySub: 'Bestellen Sie telefonisch vor — wir bereiten alles frisch zu und Sie holen direkt ab, ohne Wartezeit.',
    takeawayStep1: 'Anrufen',
    takeawayStep1Desc: 'Rufen Sie uns zu unseren Öffnungszeiten an und geben Sie Ihre Wünsche durch.',
    takeawayStep2: 'Warten',
    takeawayStep2Desc: 'Wir bereiten Ihre Bestellung frisch und sorgfältig zur abgestimmten Uhrzeit vor.',
    takeawayStep3: 'Abholen',
    takeawayStep3Desc: 'Kommen Sie zur vereinbarten Zeit vorbei und nehmen Sie Ihr Essen frisch mit.',
    takeawayHours: 'Öffnungszeiten',
    takeawayLunch: 'Mo, Mi–So: 12:00– 15:00 Uhr',
    takeawayDinner: 'Mo, Mi–So: 17:30– 22:00 Uhr',
    takeawayTuesdayClosed: 'Dienstag: Ruhetag',
    takeawayPickup: 'Abholadresse',
    takeawayOrderPhone: 'Bestelltelefon',
    takeawayCallUs: 'Wir freuen uns auf Ihren Anruf!',

    menuTitle: 'Speisekarte',
    menuResultSg: 'Ergebnis',
    menuResultPl: 'Ergebnisse',
    menuFor: 'für',
    menuDishes: 'Gerichte',
    menuCategories: 'Kategorien',
    menuOpen: 'Öffnen',
    menuPrint: 'Drucken',
    menuSearchPh: 'Gerichte oder Zutaten suchen…',
    menuClear: 'Suche zurücksetzen',
    menuNoResults: 'Keine Gerichte gefunden',
    menuNoResultsHint: 'Versuche einen anderen Suchbegriff.',
  },

  // ════════════════════════════════════════════════════════
  // ENGLISH
  // ════════════════════════════════════════════════════════
  en: {
    navMenu: 'MENU',
    navOrders: 'ORDERS',
    navTakeaway: 'TAKE AWAY',
    navAnfahrt: 'DIRECTIONS',
    navLogin: 'Sign In',
    navLogout: 'Sign Out',
    navOpen: 'Open navigation',

    langDe: 'Deutsch',
    langEn: 'English',
    langZh: '中文简体',

    heroEyebrow: 'CHINESE SPECIALTIES · BOCHUM',
    heroTagline: 'fresh from the Wok',
    heroDesc: 'Authentic duck and fine wok cuisine — for over twenty years in the heart of Bochum, prepared with care and served with warmth.',
    heroOrder: 'Order Now  →',
    heroReserve: 'Reserve Table',
    heroOpen: 'OPEN UNTIL 22:00',

    ruhetagTitle: 'Closed Today –',
    ruhetagBody: 'Duck House is closed on Tuesdays. We look forward to welcoming you back from Wednesday.',
    ruhetagLink: 'Reservations',

    empTitle: 'Recommendations',
    empSubtitle: "FROM THE HOUSE KITCHEN",
    empToday: 'Today',
    empFullMenu: 'Full Menu →',

    footerImprint: 'Imprint',
    footerContact: 'Contact',
    footerPrivacy: 'Privacy',

    ordersTitle: 'Orders',
    ordersTable: 'table',
    ordersTables: 'tables',
    ordersInProgress: 'in progress',
    ordersNewBtn: 'New Order',
    ordersEmptyTitle: 'No orders yet',
    ordersEmptyText: 'Record the first table for this service.',
    ordersFirstBtn: 'Create first order',
    ordersCompletedBadge: 'Completed',
    ordersInProgressBadge: 'In Progress',
    ordersDrinks: 'Drinks',
    ordersService: 'Service',
    ordersAdults: 'Adults',
    ordersChildren: 'Children',
    ordersDuplicate: 'Table {n} is already occupied — order was not saved.',
    deleteTitle: 'Delete Table {n}?',
    deleteMsg: 'This order will be permanently removed and cannot be restored.',
    deleteCancelBtn: 'Cancel',
    deleteConfirmBtn: 'Delete',

    modalBadge: 'RECORD ORDER',
    modalNewTitle: 'New Order',
    modalEditTitle: 'Edit Order',
    modalSubtitle: 'Select a table, record drinks and define whether buffet or à la carte service.',
    modalSec1: 'TABLE NUMBER',
    modalSelectTable: 'Select table',
    modalTableOption: 'Table {n}',
    modalSec2: 'DRINKS',
    modalSec3: 'SERVICE TYPE',
    modalBuffetTitle: 'Buffet',
    modalBuffetDesc: 'All-you-can-eat — guests help themselves at the buffet.',
    modalCarteTitle: 'À la carte',
    modalCarteDesc: 'Order directly from the menu.',
    modalAdults: 'Adults',
    modalChildren: 'Children',
    modalTotal: 'Total:',
    modalPersons: 'persons',
    modalPersonCount: 'Number of persons',
    modalComment: 'Comment',
    modalCommentPh: 'What was ordered from the menu?',
    modalCancelBtn: 'Cancel',
    modalSaveBtn: 'Create Order',
    modalNoDrinks: 'No drinks selected yet',
    modalDrinkItems: '{n} items selected',
    modalTableLabel: 'Table {n}',
    catSoftdrinks: 'Soft Drinks',
    catBier: 'Beer',
    catSaefte: 'Juices',
    catWasser: 'Water',
    catWein: 'Wine & Spirits',
    catWarm: 'Coffee & Tea',

    loginBadge: 'SECURE ACCESS',
    loginTitle: 'Sign In',
    loginSubtitle: 'Please sign in to access the orders area.',
    loginUsername: 'Username',
    loginUsernamePh: 'Enter username',
    loginPassword: 'Password',
    loginPasswordPh: 'Enter password',
    loginShowPass: 'Show password',
    loginHidePass: 'Hide password',
    loginInvalid: 'Username or password is incorrect.',
    loginLocked: 'Too many failed attempts — please wait {n} seconds.',
    loginCancelBtn: 'Cancel',
    loginSubmitBtn: 'Sign In',

    anfahrtEyebrow: 'RESTAURANT & DIRECTIONS',
    anfahrtAddress: 'Address',
    anfahrtHours: 'Opening Hours',
    anfahrtDaysRegular: 'Mon–Sat & Sun',
    anfahrtTuesday: 'Tuesday',
    anfahrtClosed: 'Closed',
    anfahrtPhone: 'Phone & Reservations',
    anfahrtNote: 'Reservations can be made by phone at any time.',
    anfahrtDirections: 'Get Directions',
    anfahrtCall: 'Call',
    anfahrtMaps: 'Open in Google Maps',
    anfahrtMapTitle: 'Duck House — Location on Google Maps',

    takeawayEyebrow: 'TAKE AWAY',
    takeawayTitle: 'Food to Go',
    takeawaySub: 'Order ahead by phone — we prepare everything fresh and you can pick it up directly, with no waiting.',
    takeawayStep1: 'Call',
    takeawayStep1Desc: 'Call us during opening hours and let us know what you would like to order.',
    takeawayStep2: 'Wait',
    takeawayStep2Desc: 'We prepare your order fresh and with care at the agreed time.',
    takeawayStep3: 'Pick Up',
    takeawayStep3Desc: 'Come by at the agreed time and take your freshly prepared food with you.',
    takeawayHours: 'Opening Hours',
    takeawayLunch: 'Mon, Wed–Sun: 12:00– 15:00',
    takeawayDinner: 'Mon, Wed–Sun: 17:30– 22:00',
    takeawayTuesdayClosed: 'Tuesday: Closed',
    takeawayPickup: 'Pickup Address',
    takeawayOrderPhone: 'Order Phone',
    takeawayCallUs: 'We look forward to your call!',

    menuTitle: 'Menu',
    menuResultSg: 'result',
    menuResultPl: 'results',
    menuFor: 'for',
    menuDishes: 'dishes',
    menuCategories: 'categories',
    menuOpen: 'Open',
    menuPrint: 'Print',
    menuSearchPh: 'Search dishes or ingredients…',
    menuClear: 'Clear search',
    menuNoResults: 'No dishes found',
    menuNoResultsHint: 'Try a different search term.',
  },

  // ════════════════════════════════════════════════════════
  // 中文简体
  // ════════════════════════════════════════════════════════
  zh: {
    navMenu: '菜单',
    navOrders: '订单',
    navTakeaway: '外带',
    navAnfahrt: '路线',
    navLogin: '登录',
    navLogout: '退出',
    navOpen: '打开导航',

    langDe: 'Deutsch',
    langEn: 'English',
    langZh: '中文简体',

    heroEyebrow: '中国特色美食 · 波鸿',
    heroTagline: '新鲜出锅',
    heroDesc: '正宗烤鸭与精制锅料理 — 二十余年深耕波鸿，精心烹制，热情待客。',
    heroOrder: '立即点餐  →',
    heroReserve: '预订餐位',
    heroOpen: '营业至22:00',

    ruhetagTitle: '今日休息 —',
    ruhetagBody: 'Duck House 每周二休息。欢迎您周三起再度光临。',
    ruhetagLink: '如需预订，请随时来电',

    empTitle: '今日推荐',
    empSubtitle: '来自厨师的推荐',
    empToday: '今日',
    empFullMenu: '查看完整菜单 →',

    footerImprint: '版权声明',
    footerContact: '联系我们',
    footerPrivacy: '隐私政策',

    ordersTitle: '订单管理',
    ordersTable: '桌',
    ordersTables: '桌',
    ordersInProgress: '处理中',
    ordersNewBtn: '新建订单',
    ordersEmptyTitle: '暂无订单',
    ordersEmptyText: '请添加当次服务的第一张桌的订单。',
    ordersFirstBtn: '创建首个订单',
    ordersCompletedBadge: '已完成',
    ordersInProgressBadge: '处理中',
    ordersDrinks: '饮料',
    ordersService: '服务',
    ordersAdults: '成人',
    ordersChildren: '儿童',
    ordersDuplicate: '第 {n} 桌已有订单 — 订单未保存。',
    deleteTitle: '确认删除第 {n} 桌？',
    deleteMsg: '此订单将被永久删除，无法恢复。',
    deleteCancelBtn: '取消',
    deleteConfirmBtn: '删除',

    modalBadge: '录入订单',
    modalNewTitle: '新建订单',
    modalEditTitle: '编辑订单',
    modalSubtitle: '选择桌号，录入饮料及服务方式。',
    modalSec1: '桌号',
    modalSelectTable: '选择桌号',
    modalTableOption: '第 {n} 桌',
    modalSec2: '饮料',
    modalSec3: '服务方式',
    modalBuffetTitle: '自助餐',
    modalBuffetDesc: '自助取用 — 宾客自行选取菜品。',
    modalCarteTitle: '单点',
    modalCarteDesc: '按菜单单独点餐。',
    modalAdults: '成人',
    modalChildren: '儿童',
    modalTotal: '共：',
    modalPersons: '人',
    modalPersonCount: '人数',
    modalComment: '备注',
    modalCommentPh: '请输入点餐内容',
    modalCancelBtn: '取消',
    modalSaveBtn: '创建订单',
    modalNoDrinks: '暂未选择饮料',
    modalDrinkItems: '已选 {n} 项',
    modalTableLabel: '第 {n} 桌',
    catSoftdrinks: '软饮',
    catBier: '啤酒',
    catSaefte: '果汁',
    catWasser: '水',
    catWein: '酒水',
    catWarm: '咖啡与茶',

    loginBadge: '安全访问',
    loginTitle: '登录',
    loginSubtitle: '请登录以访问订单管理区域。',
    loginUsername: '用户名',
    loginUsernamePh: '请输入用户名',
    loginPassword: '密码',
    loginPasswordPh: '请输入密码',
    loginShowPass: '显示密码',
    loginHidePass: '隐藏密码',
    loginInvalid: '用户名或密码错误。',
    loginLocked: '尝试次数过多，请等待 {n} 秒。',
    loginCancelBtn: '取消',
    loginSubmitBtn: '登录',

    anfahrtEyebrow: '餐厅 & 路线',
    anfahrtAddress: '地址',
    anfahrtHours: '营业时间',
    anfahrtDaysRegular: '周一至周六及周日',
    anfahrtTuesday: '周二',
    anfahrtClosed: '休息日',
    anfahrtPhone: '电话 & 预订',
    anfahrtNote: '欢迎随时致电预订。',
    anfahrtDirections: '规划路线',
    anfahrtCall: '致电',
    anfahrtMaps: '在谷歌地图中打开',
    anfahrtMapTitle: 'Duck House — Google Maps 位置',

    takeawayEyebrow: '外带',
    takeawayTitle: '外带餐食',
    takeawaySub: '提前来电预订，我们现做现出，即取即走，无需等待。',
    takeawayStep1: '致电',
    takeawayStep1Desc: '在营业时间内来电，告知您所需的菜品。',
    takeawayStep2: '等候',
    takeawayStep2Desc: '我们将在约定时间精心为您新鲜烹制。',
    takeawayStep3: '取餐',
    takeawayStep3Desc: '按时到店，取走新鲜热腾的餐食。',
    takeawayHours: '营业时间',
    takeawayLunch: '周一、周三至周日：12:00–15:00',
    takeawayDinner: '周一、周三至周日：17:30–22:00',
    takeawayTuesdayClosed: '周二：休息',
    takeawayPickup: '取餐地址',
    takeawayOrderPhone: '订餐电话',
    takeawayCallUs: '期待您的来电！',

    menuTitle: '菜单',
    menuResultSg: '个结果',
    menuResultPl: '个结果',
    menuFor: '关于',
    menuDishes: '道菜',
    menuCategories: '个分类',
    menuOpen: '打开',
    menuPrint: '打印',
    menuSearchPh: '搜索菜品或食材…',
    menuClear: '清除搜索',
    menuNoResults: '未找到相关菜品',
    menuNoResultsHint: '请尝试其他关键词。',
  },
};
