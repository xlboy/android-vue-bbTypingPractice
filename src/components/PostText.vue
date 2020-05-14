<template>
  <div class="postText">
    <el-dialog
      class="u-dialog"
      :title="'字数设置'"
      :visible.sync="display.textSize"
      width="70%"
      center
      style="transition: all 0s;"
    >
      <el-input-number
        v-model="sendLength"
        :step="20"
        :min="10"
        :max="4000"
        @blur="loginIptBlur(1)"
        @focus="loginIptBlur(2)"
      ></el-input-number>
      <el-button
        type="primary"
        @click="ensureSendText()"
        class="gdq-btn"
        style="width: 73px;margin-top:10px"
      >确定</el-button>
    </el-dialog>
    <el-dialog
      class="u-dialog"
      :title="'自定义文章'"
      :visible.sync="display.diyWord"
      width="70%"
      center
      style="transition: all 0s;"
    >
      <el-input style="margin-bottom:10px;" v-model.number="$root.diyWordJson.wordTitle" @blur="loginIptBlur(1)"
        @focus="loginIptBlur(2)" clearable>
        <template slot="prepend">文章标题</template>
      </el-input>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入文章内容"
        @blur="loginIptBlur(1)"
        @focus="loginIptBlur(2)"
        v-model="$root.diyWordJson.wordText"
        style="margin-bottom:10px;"
      ></el-input>
      <el-input
        style="margin-bottom:10px;"
        @blur="loginIptBlur(1)"
        @focus="loginIptBlur(2)"
        v-model.number="$root.diyWordJson.lastTextLength"
        clearable
      >
        <template slot="prepend">当前跟打长度</template>
      </el-input>

      <el-input-number
        v-model="sendLength"
        :step="20"
        :min="10"
        :max="4000"
        @blur="loginIptBlur(1)"
        @focus="loginIptBlur(2)"
      ></el-input-number>
      <el-button
        type="primary"
        @click="diyWordSendText()"
        class="gdq-btn"
        style="width: 73px;margin-top:10px"
      >确定</el-button>
    </el-dialog>
    <el-popover placement="bottom-start" trigger="click" style="min-width:100px;height:50vh">
      <ul class="pro-ul">
        <li>
          <el-link :underline="false" @click.stop="$root.eventHub.$emit('sendArticle')">智能读文</el-link>
        </li>
        <li>
          <el-link :underline="false" @click.stop="sendWordText('常单前五百')">常单前五百</el-link>
        </li>
        <li>
          <el-link :underline="false" @click.stop="sendWordText('常单中五百')">常单中五百</el-link>
        </li>
        <li>
          <el-link :underline="false" @click.stop="sendWordText('常单后五百')">常单后五百</el-link>
        </li>
        <li>
          <el-link :underline="false" @click.stop="sendWordText('常单前千五')">常单前千五</el-link>
        </li>
        <li>
          <el-link :underline="false" @click.stop="display.diyWord = true">自定义文章</el-link>
        </li>
      </ul>
      <el-button type="primary" slot="reference" style="margin:0px auto;">发文</el-button>
    </el-popover>
  </div>
</template>

<script>
import wordTextData from '@/data/wordTextData.js'
export default {
  name: 'PostText',
  data() {
    return {
      display: {
        textSize: false, // 显示设置字数的框
        diyWord: false // 显示设置自定义文章的框
      },
      currentMode: '', // 当前状态
      sendLength: 100 // 每段字数
    }
  },
  mounted() {
    this.initialization()
    this.readDiyWord()
  },
  watch: {
    currentMode() {},
    ['$root.diyWordJson.wordText'](){
      this.$root.diyWordJson.wordText = this.$root.diyWordJson.wordText.replace(/\s/g,'')
    }
  },
  methods: {
    initialization() {
      this.$root.eventHub.$on('sendDiyText', this.sendDiyText)
    },
    readDiyWord() {
      // 读取一波用户的自定义文章
      let wordTitle = localStorage.getItem('diy-wordTitle')
      let wordText = localStorage.getItem('diy-wordText')
      let lastTextLength = localStorage.getItem('diy-lastTextLength')
      wordTitle = wordTitle === null ? '' : wordTitle
      wordText = wordText === null ? '' : wordText
      lastTextLength = lastTextLength === null ? 0 : parseInt(lastTextLength)
      this.$root.diyWordJson.wordTitle = wordTitle
      this.$root.diyWordJson.wordText = wordText
      this.$root.diyWordJson.lastTextLength = lastTextLength
    },
    sendDiyText() {
      const lastTextLength = this.$root.diyWordJson.lastTextLength
      let wordText = this.$root.diyWordJson.wordText.substr(lastTextLength, this.sendLength)
      let remainder = this.$root.diyWordJson.wordText.length - lastTextLength - this.sendLength
      remainder = remainder < 0 ? 0 : remainder
      if(wordText.length === 0) return this.toast('等等,等等等等,那个好像文已发空了是吗')
      this.$root.gitTyping.currentSeverNum++
      this.$root.diyWordJson.lastTextLength +=this.sendLength
      localStorage.setItem('diy-wordTitle', this.$root.diyWordJson.wordTitle)
      localStorage.setItem('diy-wordText', this.$root.diyWordJson.wordText)
      localStorage.setItem('diy-lastTextLength', this.$root.diyWordJson.lastTextLength)
      // console.log(this.$root.diyWordJson.wordTitle, this.$root.gitTyping.currentSeverNum, wordText, true , remainder)
      this.$root.eventHub.$emit('sendHit', this.$root.diyWordJson.wordTitle, this.$root.gitTyping.currentSeverNum, wordText, true , remainder)
    },
    diyWordSendText() {
      this.$root.gitTyping.currentSeverNum = 0
      this.$root.isState.isDiyExercise = true
      this.sendDiyText()
      this.display.diyWord = false
    },
    ensureSendText() {
      this.$root.eventHub.$emit('isDiyExercise') // 判断下是否处于跟打模式中
      const wordJson = {
        常单前五百: wordTextData.before500,
        常单中五百: wordTextData.intermediate500,
        常单后五百: wordTextData.rear500,
        常单前千五: wordTextData.total1500
      }
      let wordText = wordJson[this.currentMode]
      if (wordText.length < this.sendLength)
        wordText += wordText.repeat((this.sendLength - wordText.length) / wordText.length + 1)
      wordText = this.shuffle(wordText.split(''))
        .join('')
        .substr(0, this.sendLength)
      this.$root.eventHub.$emit('sendHit', this.currentMode, this.$root.gitTyping.currentSeverNum, wordText, true)
      this.$root.gitTyping.currentSeverNum++
      this.display.textSize = false
    },
    sendWordText(val) {
      this.currentMode = val
      this.display.textSize = true
    }
  }
}
</script>

<style lang="scss">
.pro-ul {
  .li {
    display: flex;
    justify-content: center;
    .el-link {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
