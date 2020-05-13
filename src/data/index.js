const user = { // 登录块
  userId: '',
  qq: 1,
  avatarAddress: '',
  sign: '这个人很懒...什么都没有设置',
  userName: '',
  currentWordId: 1, // 当前选中的词库
  countSize: 0, // 跟打字数
  twoWord: 'rgba(62, 0, 0, 0.96)',
  threeWord: 'rgba(62, 110, 0, 0.96)',
  fourWord: 'rgba(62, 0, 110, 0.96)',
  fourC: 'rgba(62, 110, 110, 0.96)'
}
const sszk = {
  start: 0,
  hg: 0,
  zjs: '',
  sd: 0,
  mc: 0,
  jj: 0,
  isChn: true,
  previousBm: '',
  wordStr: '',
  backSpace: 0
}
module.exports = {
  default: {
    user: {
      ...user
    },
    sszk: {
      ...sszk
    }
  },
  textJson: { // 渲染跟打窗内容所需数据
    dealWithText: '', // 需处理的字
    tR: '', // 已输入的文字
    tRLength: 0, // 已输入的文字的长度
    hintAry: { // 跟打dom渲染时所需的数组
      ckHintAry: [], // 最初词提的数组，此处必留，因需实现实时编码
      isCorrectAry: [], // 判断对错的数组
      yesHint: [], // 有词提
      noHint: [] // 无词提
    }
  },
  userInfo: { // 登录块
    ...user
  },
  gitTyping: {
    currentSeverNum: 1, // 当前段落
    currentText: '',
    currentMaxSize: 100,
  },
  gdqJson: { // 跟打器速度、文段等等所需数据
    llmc: 1, // 理论码长
    tempStartTime: null, // 临时的开始时长,用来计算暂停了多少时间
    pauseTime: 0, // 暂停跟打时长
    startTime: null, // 开始跟打时间
    endTime: null, // 结束跟打时间
    severnNum: 1, // 段落号
    withStr: `这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒这个人很懒`, // 文段内容
    currentWordHint: '' // 当前编码提示
  },
  currentPage: { // 当前页
    currentDaySize: 0, // 当天的打字字数
    startStrLength: 0, // 当前页跟打内容渲染开头的索引值
    currentPageNum: 0, // 当前跟打所属页数
    onePageSize: 200 // 当前每一页需加载多少个字
  },
  isState: { // 状态值
    isWordHint: false, // 是否显示词提
    isBlur: false, // 是否在跟打
    isSign: false, // 弹出绑定QQ的窗口
    isBindQQ: false, // 是否绑定了QQ
    isWordAnalysis: false, // 是否出现词提框
    isDrawer: false, //是否出现左侧抽屉
    isRegLoginDialog: false, //是否出现登录框,
    isReadTextWay: '2' // 是否自动读文
  },
  wordJson: { // 关于词提这块的数据
    optionAry: [],
    userAry: [],
    defaultAry: [],
    id: 0,
    analysisJson: {
      '全概': []
    }
  },
  style: { // 页面样式
    pageStyle: {
      backOption: 70, // 背景透明度
      top: 'rgba(255, 255, 255, 0.7)',
      bottom: 'rgba(222, 222, 255, 0.7)'
    }
  },
  sszk: {
    ...sszk
  }
}
