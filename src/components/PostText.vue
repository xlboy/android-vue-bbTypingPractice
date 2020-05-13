<template>
  <div class="postText">
    <el-dialog
      class="u-dialog"
      :title="'字数设置'"
      :visible.sync="display"
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

    <el-popover placement="bottom-start" trigger="click" style="min-width:100px">
      <ul class="pro-ul">
        <li>
          <el-link
            :underline="false"
            @click.stop="$root.eventHub.$emit('sendArticle')"
          >智能读文</el-link>
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
        <!-- <li>
          <el-link :underline="false" @click.stop="sendWordText('自定义文章')">自定义文章</el-link>
        </li> -->
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
      display: false,
      currentMode: '',
      sendLength: 100
    }
  },
  watch: {
    currentMode() {}
  },
  methods: {
    ensureSendText() {
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
      this.display = false
    },
    sendWordText(val) {
      this.currentMode = val
      this.display = true
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
