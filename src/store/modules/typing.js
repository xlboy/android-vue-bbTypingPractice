
const state = {
  style: { // 页面样式
    pageStyle: {
      backOption: 70, // 背景透明度
      top: 'rgba(255, 255, 255, 0.7)',
      bottom: 'rgba(222, 222, 255, 0.7)'
    }
  },
  isShow: {
    isWordHint: false, // 控制词提显示
    isBindQQ: false, // 控制绑定QQ的窗口
    isSign: false, // 更改个签的窗口
    rigDrawer: false, // 右边设置的弹框
    isWordAnalysis: false // 词提分析的窗口
  },
  articleAry: {
    ckAry: [], //
    textAry: [],
    textAry2: [] // 判断对错的
  }
}
export default {
  state
}
