// const state = {
//   ckAry: [],
//   textAry: [],
//   textAry2: [], // 判断对错的
//   sendText: {
//     yesHint: [],
//     noHint: [],
//     domAry: []
//   },
//   dealWithText: '',
//   textarea: '', // 输入框
//   startStrLength: 0,
//   currentPageNum: 0, // 当前页
//   onePageSize: 100, // 一页加载多少个字
//   textareaLength: 0, // 上一段的长度，判断回改用
//   isBlur: false, // 是否获取了焦点
//   llmc: '', //  理论码长
//   tempStartTime: null, // 临时的开始时长,用来计算暂停了多少时间
//   pauseTime: 0, // 暂停时长
//   startTime: null, // 跟打开始的时间戳
//   endTime: null, // 跟打结束的时间戳
//   textNoom: '10', // 当前段数
//   withStr: `BB哒哒哒哒哒哒字机`,
//   currentWordHint: '', // 当前编码提示
//   sszk: { // 实时速度
//     start: 0,
//     hg: 0,
//     zjs: '',
//     sd: 0,
//     mc: 0,
//     jj: 0,
//     previousBm: '',
//     backSpace: 0,
//     wordStr: ''
//   },
//   wordOptions: [], // 用户的词库
//   userInfo: { // 用户所有信息
//     qq: 1,
//     sign: '这个人很懒...什么都没有设置',
//     userName: '',
//     userId: '', // 用户的id
//     currentWordId: '' // 当前选中的词库
//   },
//   regLoginDialog: false, // 注册登录的框
//   regLoginForm: { // 登录时的框
//     username: '',
//     password: ''
//   },
//   wordAnalysisJson: {
//     '全概': []
//   },
//   isShow: {
//     isWordHint: false, // 控制词提显示
//     isBindQQ: false, // 控制绑定QQ的窗口
//     isSign: false, // 控制个签的窗口
//     rigDrawer: false, // 右边设置的弹框
//     isWordAnalysis: false
//   },
//
//   loading: null, // 加载框
//   isReadTextWay: '2', // 读文方式,1为自动读，2为手动读
//   bindQQStr: '', // 当前输入的QQ值
//   signStr: '', //当前输入的个签
//   pageStyle: {
//     backOption: 70, // 背景透明度
//     top: 'rgba(255, 255, 255, 0.7)',
//     bottom: 'rgba(222, 222, 255, 0.7)'
//   },
//   avatarAddress: 'http://q1.qlogo.cn/g?b=qq&nk=52852983&s=640', // QQ头像接口
//   ip: `http://xlboy.cn:8988` // 服务器的地址
// }
const state = { // 用户所有信息
  qq: 1,
  sign: '这个人很懒...什么都没有设置', // 用户的个签
  userName: '', // 用户的名称
  userId: '', // 用户的id
  currentWordId: '' , // 当前选中的词库
  wordOptions: []
}
export default {
  state
}
