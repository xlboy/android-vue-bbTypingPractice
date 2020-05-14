<template>
  <div class="bb-content">
    <div class="sszk" style="width:100%">
      <el-tag>第{{$root.gdqJson.severnNum}}段</el-tag>
      <el-tag>{{$root.sszk.speed}}</el-tag>
      <el-tag>{{$root.sszk.keystroke}}</el-tag>
      <el-tag>{{$root.sszk.runningYard}}</el-tag>
      <el-switch v-model="$root.isState.isWordHint" active-color="#13ce66" inactive-color="#dd1b54"></el-switch>
    </div>
    <div class="sszk" style="width:100%">
      <el-tag v-if="$root.isState.isWordHint">理论码长：{{$root.gdqJson.llmc}}</el-tag>
      <el-tag v-if="$root.isState.isWordHint">{{$root.gdqJson.currentWordHint}}</el-tag>
      <el-tag
        style="margin:3px;"
        v-if="$root.userInfo.userId !== ''"
      >今:{{$root.currentPage.currentDaySize}}/总:{{$root.userInfo.countSize}}</el-tag>
      <el-button
        v-if="$root.isState.isDiyExercise"
        type="primary"
        id="anew"
        icon="el-icon-arrow-down"
        circle
        @click="$root.eventHub.$emit('sendDiyText')"
      ></el-button>
      <el-button
        type="primary"
        id="anew"
        icon="el-icon-s-data"
        circle
        v-if="$root.userInfo.userId !== ''"
        @click="$root.isState.isGradeList = true"
      ></el-button>
    </div>
    <div class="sszk" style="width:100%">
      <el-button
        type="primary"
        id="anew"
        icon="el-icon-s-operation"
        @click="$root.isState.isDrawer = true"
      ></el-button>
      <PostText/>
      <el-button type="primary" @click="typewriting(1)">开打</el-button>
      <el-button type="primary" @click="typewriting(2)">弃打</el-button>
      <el-button type="primary" id="anew" icon="el-icon-share" circle @click="share()"></el-button>
      <el-button type="primary" id="anew" icon="el-icon-refresh" circle @click="anew()"></el-button>
    </div>
    <el-progress
      style="margin-bottom:5px;"
      :percentage="($root.textJson.tR.length / $root.gdqJson.withStr.length) * 100"
      :show-text="false"
    ></el-progress>
    <!--    跟打框 -->
    <!--    .slice($root.currentPage.startStrLength, $root.currentPage.startStrLength + $root.currentPage.onePageSize)-->
    <div class="gdk" :class="[!$root.isState.isWordHint?'mention':'']" id="gdk">
      <span
        class="spanText"
        :id="'gd_'+($root.currentPage.startStrLength+i)"
        v-for="(item,i) in $root.textJson.hintAry[$root.isState.isWordHint?'yesHint':'noHint']"
        :key="i"
        :class="[ item.hasOwnProperty('ys') ? item.ys : '' ]"
        :style="[
								{color: item.length === 4 ? $root.userInfo.fourC :item.ys === 'bm4' ? $root.userInfo.fourWord : item.ys === 'bm3' ? $root.userInfo.threeWord : item.ys === 'bm2' ? $root.userInfo.twoWord : '#333'},
								{borderBottomColor: item.ys === 'bm4' ? 'rgba(62, 0, 0, 0)' : item.ys === 'bm3' ? $root.userInfo.threeWord : item.ys === 'bm2' ? $root.userInfo.twoWord : 'rgba(62, 0, 0, 0)'},
								{borderBottomStyle: item.ys === 'bm2' ? 'dotted' :  item.ys === 'bm3' ? 'double' : 'dashed'},
								{fontStyle: item.length >= 4 && $root.isState.isWordHint?'italic':''},
								{fontWeight: item.length === 4 && $root.isState.isWordHint ? 'blod':''},
								{marginLeft: item.hasOwnProperty('ys') && i!==0 && item.index !== $root.textJson.hintAry[$root.isState.isWordHint?'yesHint':'noHint'][item.i_-1].index?'4px':'0px'}
							]"
      >
        {{item.val}}
        <font
          style="font-style:normal;font-variant: initial;"
          v-show="
						(item.hasOwnProperty('option') && i !== 0 && item.index !== $root.textJson.hintAry[$root.isState.isWordHint?'yesHint':'noHint'][item.i_-1].index)
							   || (item.i_===0 && item.hasOwnProperty('option'))
					   "
        >{{item.option}}</font>
      </span>
    </div>
  </div>
</template>

<script>
import wordCount from '@/utils/wordCount.js' // 封装的一个处理词提的方法
import PostText from '@/components/PostText.vue' // 发文模块

export default {
  name: 'Content',
  data() {
    return {}
  },
  components: {
    PostText
  },
  watch: {
    ['$root.sszk.speed'](){
      this.$root.sszk.speed = isNaN(this.$root.sszk.speed) || this.$root.sszk.speed === 'Infinity' ? 0 : this.$root.sszk.speed
      this.$root.sszk.keystroke = isNaN(this.$root.sszk.keystroke) || this.$root.sszk.keystroke === 'Infinity' ? 0 : this.$root.sszk.keystroke
      if(this.$root.sszk.speed > 1000) this.$root.sszk.speed = 1000
      if(this.$root.sszk.keystroke > 20) this.$root.sszk.keystroke = 20
    },
    ['$root.sszk.keystroke'](){
      this.$root.sszk.speed = isNaN(this.$root.sszk.speed) || this.$root.sszk.speed === 'Infinity' ? 0 : this.$root.sszk.speed
      this.$root.sszk.keystroke = isNaN(this.$root.sszk.keystroke) || this.$root.sszk.keystroke === 'Infinity' ? 0 : this.$root.sszk.keystroke
      if(this.$root.sszk.speed > 1000) this.$root.sszk.speed = 1000
      if(this.$root.sszk.keystroke > 20) this.$root.sszk.keystroke = 20
    },
    async ['$root.isState.isWordHint']() {
      await this.start()
      this.verifCurrentIsYes()
    },
    ['$root.gdqJson.withStr']() {
      this.$root.textJson.tR = ''
    },
    ['$root.currentPage.startStrLength']() {
      this.verifCurrentIsYes()
    },
    ['$root.textJson.dealWithText']() {
      // 做中间处理的，并且计算击键、打词率、退格
      this.$root.sszk.zjs += '-'
      const currentTextL = this.$root.textJson.tR.length - 1
      const ciLenth = this.$root.textJson.dealWithText.substr(currentTextL + 1) // 当前打出的字符
      if (
        this.$root.sszk.previousBm.length !== 0 &&
        ciLenth === this.$root.sszk.previousBm.substr(0, this.$root.sszk.previousBm.length - 1)
      )
        this.$root.sszk.backSpace += 1 // 计算退格
      if (/^[a-z]+$/g.test(ciLenth)) this.$root.sszk.previousBm = ciLenth // 计算退格,上一个打的abc，下一个打的ab，通过这规律判断
      if (this.$root.gdqJson.withStr[currentTextL + 1] === this.$root.textJson.dealWithText[currentTextL + 1]) {
        // 若打的字正确，直接射入
        if (ciLenth.length > 1) this.$root.sszk.wordStr += ciLenth // 计算打词率
        this.$root.textJson.tR = this.$root.textJson.dealWithText
        this.$root.sszk.previousBm = ''
      } else if (!/[a-z]/g.test(this.$root.textJson.dealWithText.substr(currentTextL)) || ciLenth.length > 4) {
        // 如果打的不正确，并且打的是英文以外的字符，就射入
        this.$root.textJson.tR = this.$root.textJson.dealWithText
        this.$root.sszk.previousBm = ''
      }
    },
    async ['$root.textJson.tR']() {
      this.$root.textJson.tR = this.$root.textJson.tR.substr(0, this.$root.gdqJson.withStr.length)
      this.changeScrollBar() // 控制下拉滚动条的
      {
        let sszkJson = {...this.$root.sszk}
        delete sszkJson.realTimeSpeed
        delete sszkJson.zjs
        sszkJson.date = new Date().getTime()
        this.$root.sszk.realTimeSpeed.push(sszkJson) // 把跟打的细节记录下来呗，亲
      }
      if (this.$root.textJson.tR.length < this.$root.textJson.tRLength) {
        // 回改了哦
        this.$root.sszk.backChange++
        const kt = this.$root.textJson.tR.length
        for (let i in '1'.repeat(10)) {
          // 这里也要修改下哈，泥马了个憋
          let dom = document.getElementById(`gd_${kt + parseInt(i)}`)
          if (dom !== undefined && dom !== null) {
            dom.classList.remove('zq')
            dom.classList.remove('cw')
          }
        }
      } else {
        const length = this.$root.textJson.tR.length - this.$root.textJson.tRLength
        this.$root.userInfo.countSize += length
        this.$root.currentPage.currentDaySize += length
        localStorage.setItem(new Date().toLocaleDateString(), this.$root.currentPage.currentDaySize) // 增加当天的打字数
      }

      this.$root.textJson.hintAry.isCorrectAry.forEach((e, i) => {
        // 将未输入的那部分转成黑色的字体
        if (i >= this.$root.textJson.tR.length) e.isCorret = null
      })
      let tRStartLength = this.$root.textJson.tR.length
      tRStartLength = tRStartLength <= 50 ? 0 : tRStartLength - 50 // 开始渲染时的位置
      this.$root.textJson.tR
        .slice(tRStartLength, tRStartLength + 50)
        .split('')
        .forEach((e, i) => {
          // 每改变一次文字，循环判断一遍是否输入正确
          const index = tRStartLength + i
          this.$root.textJson.hintAry.isCorrectAry[index].isCorret = this.$root.gdqJson.withStr[index] === e
          let isCorret = this.$root.textJson.hintAry.isCorrectAry[index].isCorret
          let dom = document.getElementById(`gd_${index}`)
          dom.classList.remove('zq')
          dom.classList.remove('cw')
          if (isCorret === null) return
          dom.classList.add(isCorret === true ? 'zq' : 'cw')
        })
      if (this.$root.textJson.tR.length === 0) {
        // 归零
        this.anew()
        this.countSd()
        this.toast('听说你是重打王？')
      }
      if (this.$root.gdqJson.startTime === null || this.$root.textJson.tRLength === 0) {
        // 判断是不是刚开始打
        this.addCountSize() // 每次重打时都上传一波数据,别问,问就是上传
        this.$root.gdqJson.pauseTime = 0 // 如果是刚开始打,将记录暂停时间的变量恢复默认
        this.$root.gdqJson.tempStartTime = null
        this.$root.gdqJson.startTime = new Date().getTime() // 记录刚开始打的时间
      }
      if (this.$root.textJson.tR.length > 0) {
        // 开始跟打
        this.$root.sszk.start =
          (new Date().getTime() - this.$root.gdqJson.startTime - this.$root.gdqJson.pauseTime) / 1000 // 当前所跟打了的时间 , 其中还减去了暂停的时间
        this.countSd()
      }

      if (
        this.$root.textJson.tR.length >= this.$root.gdqJson.withStr.length &&
        this.$root.textJson.tR[this.$root.gdqJson.withStr.length - 1] ===
          this.$root.gdqJson.withStr[this.$root.gdqJson.withStr.length - 1]
      ) {
        this.typingComplete()
      }

      this.hintWordMention() // 更新一遍词提渲染

      this.$root.textJson.tRLength = this.$root.textJson.tR.length // 用来记录是否回改了
    }
  },
  created() {
    this.initialization()
  },
  mounted() {
    let _this = this
    this.start()
    let currentDaySize = localStorage.getItem(new Date().toLocaleDateString()) // 拿到的当天打字总数
    this.$root.currentPage.currentDaySize = currentDaySize === null ? 0 : parseInt(currentDaySize) // 拿到后判断下

    window.setText = msg => {
      // 为了能让ANDROID调到VUE里的方法
      _this.setTextarea(msg)
    }
  },
  methods: {
    initialization() {
      this.$root.eventHub.$on('start', this.start)
      this.$root.eventHub.$on('share', this.share)
      this.$root.eventHub.$on('sendHit', this.sendHit)
      this.$root.eventHub.$on('sendArticle', this.sendArticle)
      this.$root.eventHub.$on('isDiyExercise', this.isDiyExercise)
    },
    async sendHit(title, serverNum, wordText, isShare, remainder) {
      // 设置文段的方法
      this.anew()
      this.$root.gdqJson.severnNum = serverNum
      this.$root.gdqJson.withStr = wordText
      await this.start()
      if (isShare === true) this.share(title, remainder)
    },
    changeScrollBar() {
      // 控制滚动条的高度
      var gdk = document.getElementById('gdk')
      if (this.$root.textJson.tR.length < 50) return
      let num = 0
      if (this.$root.textJson.tR.length < this.$root.gdqJson.withStr.length / 2) num = gdk.clientHeight * 2
      else num = gdk.clientHeight * 0.5
      gdk.scrollTop = ((gdk.scrollHeight - num) / this.$root.gdqJson.withStr.length) * this.$root.textJson.tR.length
    },
    addCountSize() {
      // 统计字数
      if (this.isNull(this.$root.userInfo.userId)) return
      this.$axios
        .post(`/savaCountSize`, {
          userId: this.$root.userInfo.userId,
          countSize: this.$root.userInfo.countSize
        })
        .then(response => {})
    },
    addGrade(gradeJson) { // 上传此局成绩
      if (this.isNull(this.$root.userInfo.userId)) return
      this.$axios
        .post(`/addUserGrade`, {
          userId: this.$root.userInfo.userId,
          dataStr: JSON.stringify(gradeJson),
          date: new Date().getTime()
        })
        .then(response => {})
    },
    typingComplete() {
      // 跟打完成的事件
      this.$root.currentPage.currentPageNum = 0
      this.$root.textJson.tR = this.$root.textJson.tR.substr(0, this.$root.gdqJson.withStr.length)
      this.$root.gdqJson.endTime = new Date().getTime()
      this.$root.sszk.start =
        (this.$root.gdqJson.endTime - this.$root.gdqJson.startTime - this.$root.gdqJson.pauseTime) / 1000
      this.countSd() // 计算速度
      this.addCountSize() // 触发上传当前字数的事件
      this.$root.gdqJson.startTime = null // 重头再来
      if (this.$root.sszk.speed === 'Infinity' || this.$root.sszk.speed === NaN || this.$root.sszk.speed > 1000) {
        androids.changeFlagBoce()
        androids.sendMsgQQ(`我跟你们说哦，我家主人刚刚打出了神一般的速度，哇塞，每毫秒${this.$root.sszk.speed}字呀！`)
        return this.toast('答应我，做个亻行吗，这特么光速都没这么快！')
      }
      const wordRate = ((this.$root.sszk.wordStr.length / this.$root.gdqJson.withStr.length) * 100).toFixed(2)
      const countTextSpeed = this.countErrorText()
      const keyAccurate =
        100 - this.$root.gdqJson.withStr.length / (this.$root.sszk.backSpace + this.$root.sszk.backChange)
      let str = ``
      let gradeJson = {
        severnNum: this.$root.gdqJson.severnNum,
        speed: countTextSpeed !== '错字0' ? countTextSpeed[1] : this.$root.sszk.speed,
        keystroke: this.$root.sszk.keystroke,
        runningYard: this.$root.sszk.runningYard,
        backChange: this.$root.sszk.backChange,
        backSpace: this.$root.sszk.backSpace,
        keyAccurate: keyAccurate === -Infinity ? 100.0 : keyAccurate.toFixed(2),
        wordRate,
        errorSize: {num: countTextSpeed[2], ary: countTextSpeed[3]},
        withStr: this.$root.gdqJson.withStr,
        elapsedTime: this.$root.sszk.start
      }
      gradeJson['realTimeSpeed'] = [...this.$root.sszk.realTimeSpeed]
      this.addGrade(gradeJson) // 触发上传当前成绩的事件
      if (countTextSpeed !== '错字0') {
        str = `第${gradeJson.gradeJson}段 速度${countTextSpeed[1]} 击键${gradeJson.keystroke} 码长${
          gradeJson.runningYard
        } 回改${gradeJson.backChange} 退格${this.$root.sszk.backSpace} 键准${gradeJson.keyAccurate}% ${
          this.$root.isState.isWordHint ? '理论码长' + this.$root.gdqJson.llmc : ''
        } 打词${wordRate}% ${countTextSpeed[0]}[错1罚5] 字数${this.$root.gdqJson.withStr.length} 耗时${
          this.$root.sszk.start
        }s 个签:${this.$root.userInfo.sign}   -BB打字机`
      } else {
        str = `第${gradeJson.severnNum}段 速度${gradeJson.speed} 击键${gradeJson.keystroke} 码长${
          gradeJson.runningYard
        } 回改${gradeJson.backChange} 退格${gradeJson.backSpace} 键准${gradeJson.keyAccurate}% ${
          this.$root.isState.isWordHint ? '理论码长' + this.$root.gdqJson.llmc : ''
        } 打词${wordRate}% 错字0 字数${this.$root.gdqJson.withStr.length} 耗时${this.$root.sszk.start}s 个签:${
          this.$root.userInfo.sign
        }   -BB打字机`
      }
      androids.setPasteText(str)
      this.toast(str)
      androids.changeFlagBoce()
      androids.sendMsgQQ(str)
    },
    share(title, remainder) {
      // 分享发文
      this.toast('分享成功')
      androids.changeFlagBoce()
      const withStr = this.$root.gdqJson.withStr === '' ? '啊哦..啥文都没,不知分享啥' : this.$root.gdqJson.withStr
      const str = `${
        title !== undefined
          ? `《${title}》\n`
          : this.$root.isState.isDiyExercise
          ? this.$root.diyWordJson.wordTitle
          : ''
      }${withStr}\n-----第${this.$root.gdqJson.severnNum}段-----${remainder !== undefined ? `余${remainder}字` : ''}`
      androids.setPasteText(str)
      androids.sendMsgQQ(str)
    },
    anew() {
      // 重打
      androids.textAnew()
      document.getElementById('gdk').scrollTop = 0
      this.$root.textJson.tR = ''
      this.$nextTick(() => {
        // 页面渲染完后，再做下面的步骤，别问为什么，问就是不告诉你
        this.$root.gdqJson.startTime = null
        this.$root.currentPage.startStrLength = 0
        this.$root.currentPage.currentPageNum = 0
        this.$root.sszk = {...this.$root.default.sszk}
        this.$root.gdqJson.withStr.split('').forEach((e, i) => {
          let dom = document.getElementById(`gd_${i}`)
          if (dom === null || dom === undefined) return
          dom.classList.remove('cw')
          dom.classList.remove('zq')
        })
      })
    },
    countErrorText() {
      // 返回错字及错字后的时速
      let errorNum = 0
      let errorAry = []
      let errorAryTow = []
      this.$root.textJson.tR.split('').forEach((e, i) => {
        // 每改变一次文字，循环判断一遍是否输入正确
        const ee = this.$root.gdqJson.withStr[i]
        if (e !== ee) {
          errorNum++
          errorAry.push(`✘${e}✓${ee}`)
          errorAryTow.push([e, ee])
        }
      })
      if (errorNum === 0) return '错字0'
      const countError = () => {
        // 计算出错字后的速度
        const withL = this.$root.gdqJson.withStr.length
        const succeddSpeed = this.$root.sszk.speed // 正确的速度
        const errorSpeed = (((withL - errorNum * 5) / this.$root.sszk.start) * 60).toFixed(2)
        return `${errorSpeed}/${succeddSpeed}`
      }
      return [`错字${errorNum}[${errorAry.join(',')}]`, countError(), errorNum, errorAryTow]
    },
    readWordHint(str) {
      // 拿词提
      let loading = this.getLoading()
      let wordHint = {}
      this.$root.wordJson.optionAry.some(e => {
        return e.options.some(ee => {
          if (ee.id === this.$root.userInfo.currentWordId) {
            wordHint = {...ee}
            return true
          } else return false
        })
      })
      return new Promise(resolve => {
        this.$axios
          .post(`/queryWordHint`, {
            wordId: wordHint.id,
            isDefaultWord: wordHint.userName,
            str
          })
          .then(resp => {
            loading.close()
            resolve(resp)
          })
      })
    },
    typewriting(i) {
      // 获取焦点了的事件
      if (i === 1) androids.changeFlagFocus()
      else androids.changeFlagBoce()
    },
    isDiyExercise() {
      // 判断是否处在自定义跟打模式中
      if (this.$root.isState.isDiyExercise === true) {
        this.$root.isState.isDiyExercise = false // 将自定义文章模式直接卡擦掉，不戳给他打了，马勒戈壁的
        this.toast('成功退出自定义文章模式,GetOut')
      }
    },
    wordAnalySort(e) {
      // 词提分析的
      const rule = [
        ['bm4', 4, '4码四字词'],
        ['bm2', 2, '二简词'],
        ['bm3', 3, '三简词'],
        ['bm4', 3, '4码三字词'],
        ['bm4', 2, '4码二字词'],
        ['bm3', 4, '3码四字词'],
        ['bm3', 2, '3码二字词'],
        ['bm2', 3, '2码三字词'],
        ['bm2', 4, '2码四字词']
      ]

      if (e.hasOwnProperty('ys')) {
        this.$root.wordJson.analysisJson['全概'].push(e.val)
        const bmLength = [4, 3, 2, 1]
        bmLength.forEach(ee => {
          if (e.ys === `bm${ee}` && e.val.length > 4) {
            if (!this.$root.wordJson.analysisJson.hasOwnProperty(`${ee}码长词`))
              this.$root.wordJson.analysisJson[`${ee}码长词`] = []
            this.$root.wordJson.analysisJson[`${ee}码长词`].push(e.val)
          }
          if (e.ys === `bm1` && e.val.length > 4) {
            if (!this.$root.wordJson.analysisJson.hasOwnProperty(`一简长词`))
              this.$root.wordJson.analysisJson[`一简长词`] = []
            this.$root.wordJson.analysisJson[`一简长词`].push(e.val)
          } else if (e.ys === `bm1` && e.val.length === ee) {
            if (!this.$root.wordJson.analysisJson.hasOwnProperty(`一简${ee}字词`))
              this.$root.wordJson.analysisJson[`一简${ee}字词`] = []
            this.$root.wordJson.analysisJson[`一简${ee}字词`].push(e.val)
          }
        })
        rule.forEach(ee => {
          if (e.ys === ee[0] && e.val.length === ee[1]) {
            if (!this.$root.wordJson.analysisJson.hasOwnProperty(ee[2])) this.$root.wordJson.analysisJson[ee[2]] = []
            this.$root.wordJson.analysisJson[ee[2]].push(e.val)
          }
        })
      } else if (/[\u4e00-\u9fa5]/g.test(e.val)) {
        if (!this.$root.wordJson.analysisJson.hasOwnProperty(`单字`)) this.$root.wordJson.analysisJson[`单字`] = []
        this.$root.wordJson.analysisJson[`单字`].push(e.val)
      } else {
        if (!this.$root.wordJson.analysisJson.hasOwnProperty(`符号`)) this.$root.wordJson.analysisJson[`符号`] = []
        this.$root.wordJson.analysisJson[`符号`].push(e.val)
      }
    },
    hintWordMention() {
      // 词提编码遍历显示
      if (!this.$root.isState.isWordHint) return // 如果没开启词提模式直接返回不让他执行下去
      this.$root.textJson.hintAry.ckHintAry.some(e => {
        const currentLength = this.$root.textJson.tR.length
        if (currentLength < e.jw && currentLength >= e.kt) {
          this.$root.gdqJson.currentWordHint = e.bm
          return true
        }
        return false
      })
    },
    countSd() {
      // 计算速度
      this.$root.sszk.speed = ((this.$root.textJson.tR.length / this.$root.sszk.start) * 60).toFixed(2) // 实时速度
      this.$root.sszk.runningYard = (this.$root.sszk.zjs.length / this.$root.textJson.tR.length).toFixed(2) // 实时码长
      this.$root.sszk.keystroke = (this.$root.sszk.zjs.length / this.$root.sszk.start).toFixed(2) // 实时击键
    },
    async sendArticle() {
      // 读文
      this.isDiyExercise()
      this.$root.textJson.tR = ''
      this.$root.gdqJson.startTime = null
      this.$root.currentPage.currentPageNum = 0
      let loading = this.getLoading()
      if (this.$root.isState.isReadTextWay === '1') {
        let pro = new Promise(async resolve => {
          this.$root.gdqJson.withStr = androids.readText()
          this.$root.gdqJson.withStr = this.$root.gdqJson.withStr.replace(/\n/g, '')
          this.$root.gdqJson.severnNum = androids.readNoom()
          if (this.$root.gdqJson.withStr === '') {
            // 拿不到文
            resolve('啊哦..没读到文章..请确保窗口可视区域有文段内容')
          } else {
            await this.start()
            resolve('读文成功')
          }
        })
        pro.then(str => {
          loading.close()
          this.toast(str)
        })
      } else {
        this.anew()
        const readText = async () => {
          const str = androids.readPasteText()
          let ary = str.split('-❤-❤-')
          if (ary.length === 1 || ary[0] === '') {
            loading.close()
            return this.toast('你复制的嘛玩意..!读取失败!')
          }
          loading.close()
          this.$root.gdqJson.severnNum = ary[0]
          this.$root.gdqJson.withStr = ary[1].replace(/\n/g, '')
          await this.start()
          this.toast('读文成功')
        }
        setTimeout(() => {
          readText()
        }, 600)
      }
    },
    setTextarea(str) {
      // 安卓打字数据传递到这里
      str = str.substr(0, this.$root.gdqJson.withStr.length)
      this.$root.textJson.dealWithText = str
    },
    async start() {
      // 读取一波词提
      return new Promise(async resolve => {
        this.$root.textJson.hintAry.isCorrectAry = []
        this.$root.textJson.hintAry.yesHint = []
        this.$root.textJson.hintAry.noHint = []
        this.$root.wordJson.analysisJson = {
          全概: []
        }
        this.$root.gdqJson.withStr.split('').forEach((e, i) => {
          this.$root.textJson.hintAry.isCorrectAry.push({
            val: e,
            isCorret: null // 为null则是未输入，为true则是输入正确，false则是输入不正确
          })
          this.$root.textJson.hintAry.noHint.push({
            // 不开词提的
            val: e,
            length: 1,
            index: 1,
            i_: i
          })
        })
        if (!this.$root.isState.isWordHint) return resolve('') // 如果没开启词提就不请求了，直接返回
        // 拿词提
        let data = await this.readWordHint(this.$root.gdqJson.withStr)
        this.$root.textJson.hintAry.ckHintAry = data.wordAry
        this.$root.gdqJson.llmc = data.llmc
        let i = 0
        this.$root.textJson.hintAry.ckHintAry.forEach((e, ii) => {
          // 来，泥马，跟哥横个看看？来啊，马勒戈壁
          wordCount.judegOption(e)
          this.wordAnalySort(e)
          for (let i2 = 0; i2 < e.val.length; i2++) {
            let json = {
              index: this.$root.textJson.hintAry.ckHintAry[ii].kt,
              length: e.val.length,
              i_: i,
              ...e
            }
            delete json.kt
            delete json.jw
            delete json.bm
            json.val = e.val[i2]
            this.$root.textJson.hintAry.yesHint.push(json)
            i++
          }
        })
        const wordAnaFun = () => {
          const wordSort = {
            二简词: 1,
            三简词: 2,
            '4码四字词': 3,
            '4码二字词': 4,
            一简长词: 5,
            一简2字词: 6,
            一简3字词: 7,
            一简4字词: 8,
            '4码长词': 9,
            '2码四字词': 10,
            '2码三字词': 11,
            '3码四字词': 12,
            '3码二字词': 13,
            '4码三字词': 14,
            单字: 15,
            符号: 16,
            全概: 17
          }
          let analyKeyAry = Object.keys(this.$root.wordJson.analysisJson)
          analyKeyAry.sort((e, i) => {
            return wordSort[e] - wordSort[i]
          })
          let lsAnaly = {...this.$root.wordJson.analysisJson}
          this.$root.wordJson.analysisJson = {}
          analyKeyAry.forEach(e => {
            this.$root.wordJson.analysisJson[e] = {...lsAnaly[e]}
          })
        }
        wordAnaFun() // 重新排序词提分析
        resolve('')
      })
    },
    verifCurrentIsYes() {
      // 验证本页的对错
      this.$nextTick(() => {
        this.$root.gdqJson.withStr.split('').forEach((e, i) => {
          // 每改变一次文字，循环判断一遍是否输入正确
          const index = this.$root.currentPage.startStrLength + i
          let dom = document.getElementById(`gd_${index}`)
          let isCorret = this.$root.textJson.hintAry.isCorrectAry[index].isCorret
          if (dom === null || dom === undefined) return
          dom.classList.remove('zq')
          dom.classList.remove('cw')
          if (isCorret === null) return
          dom.classList.add(isCorret === true ? 'zq' : 'cw')
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
