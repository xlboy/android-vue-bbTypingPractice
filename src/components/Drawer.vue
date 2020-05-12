<template>
  <div class="bb-drawer">
    <el-drawer class="gdq-drawer" :show-close="false" :visible.sync="$root.isState.isDrawer" direction="rtl"
               style="transition: all 0s ease 0s;overflow: auto">
      <el-button type="primary" id="anew" icon="el-icon-refresh" circle onclick="androids.webViewReload()"
                 style="position: absolute;right: 10px;top: 10px;"></el-button>
      <div class="head-box">
        <el-avatar :src="'http://q1.qlogo.cn/g?b=qq&nk=' + $root.userInfo.qq + '&s=640'"></el-avatar>
        <div class="jz">
          <el-link type="primary" class="login-text" @click="$root.isState.isRegLoginDialog = true"
                   v-if="$root.userInfo.userId === ''">注册/登陆..
          </el-link>
          <!-- {{$root.userInfo}} -->
          <el-link type="primary" class="login-text" @click="logout()" v-if="$root.userInfo.userId !== ''">
            {{$root.userInfo.username}}
          </el-link>
          <el-link type="danger" style="margin-left:3px" class="login-text" @click="$root.isState.isBindQQ = true"
                   v-if="$root.userInfo.qq === '' || $root.userInfo.qq === null ">
            绑定QQ
          </el-link>
        </div>
      </div>
      <div class="jz word-box">
        <el-tag type="success" style="width: 100%;" @click="$root.isState.isSign = true">
          {{$root.userInfo.sign}}
        </el-tag>
      </div>
      <div class="jz word-box">
        <el-button type="primary" id="anew" icon="el-icon-s-data" circle @click="$root.isState.isWordAnalysis = true">
        </el-button>
        <el-select v-model="$root.userInfo.currentWordId" @change="wordUpdate" no-data-text="无词库数据.."
                   placeholder="选择词库" style="margin:0px 10px">
          <el-option-group
            v-for="(item,index) in $root.wordJson.optionAry"
            :key="index"
            :label="item.label">
            <el-option v-for="(item_,index_) in item.options" :key="index_" :label="item_.preceptName"
                       :value="item_.id">
            </el-option>
          </el-option-group>

        </el-select>
        <el-button type="primary" id="anew" icon="el-icon-refresh-right" circle
                   @click="$root.eventHub.$emit('readWordList')">
        </el-button>
      </div>
      <div class="jz readTextWay">
        <span class="title">读文方式:</span>
        <el-radio v-model="$root.isState.isReadTextWay" label="1">自动</el-radio>
        <el-radio v-model="$root.isState.isReadTextWay" label="2">手动</el-radio>
      </div>
      <div class="jz readTextWay" style="justify-content: space-between;">
        <el-color-picker v-model="$root.style.pageStyle.top" show-alpha></el-color-picker>
        <el-color-picker v-model="$root.style.pageStyle.bottom" show-alpha></el-color-picker>
      </div>
      <div class="jz colorWord">
        <el-link class="flex" :style="{color : $root.userInfo.twoWord}" href="#">二码
          <el-color-picker size="mini" color-format="rgb" :show-alpha="true"
                           v-model="$root.userInfo.twoWord"></el-color-picker>
        </el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link class="flex" :style="{color : $root.userInfo.threeWord}" href="#">三码
          <el-color-picker size="mini"
                           color-format="rgb" :show-alpha="true" v-model="$root.userInfo.threeWord"></el-color-picker>
        </el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link class="flex" :style="{color : $root.userInfo.fourWord}" href="#">四码
          <el-color-picker size="mini"
                           color-format="rgb" :show-alpha="true" v-model="$root.userInfo.fourWord"></el-color-picker>
        </el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link class="flex" :style="{color : $root.userInfo.fourC}" href="#">>=四字词
          <el-color-picker size="mini"
                           color-format="rgb" :show-alpha="true" v-model="$root.userInfo.fourC"></el-color-picker>
        </el-link>
      </div>
    </el-drawer>
  </div>
</template>

<script>

  export default {
    name: 'Drawer',
    data() {
      return {}
    },
    created() {
      this.readDefaultWord()
    },
    watch: {
      ['$root.userInfo.twoWord']() { // 颜色改变
        this.updateWordColor()
      },
      ['$root.userInfo.threeWord']() { // 颜色改变
        this.updateWordColor()
      },
      ['$root.userInfo.fourWord']() { // 颜色改变
        this.updateWordColor()
      },
      ['$root.userInfo.fourC']() { // 颜色改变
        this.updateWordColor()
      },
      ['$root.style.pageStyle.top']() {
        localStorage.setItem('pageTop', this.$root.style.pageStyle.top)
      },
      ['$root.style.pageStyle.bottom']() {
        localStorage.setItem('pageBottom', this.$root.style.pageStyle.bottom)
      }
    },
    methods: {
      logout() { // 注销
        this.$confirm('确认要注销吗..人家不想离开你?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // 重置一波信息
          localStorage.setItem('userId', '')
          this.$root.userInfo = {...this.$root.default.user}
          this.toast('行,你无情,你冷漠,你抛弃我,我记住你了')
          this.$root.wordJson.optionAry = [...this.$root.wordJson.defaultAry]
        }).catch(() => {
          this.toast('哼,人家就知道你不会离开我,哼唧唧')
        })
      },
      updateWordColor() { // 更新用户的词提颜色
        if (this.isNull(this.$root.userInfo.userId)) return
        this.$axios.post(`/savaColorWord`, {
          userId: this.$root.userInfo.userId,
          twoWord: this.$root.userInfo.twoWord,
          threeWord: this.$root.userInfo.threeWord,
          fourWord: this.$root.userInfo.fourWord,
          fourC: this.$root.userInfo.fourC
        }).then((response) => {})
      },
      readDefaultWord() { // 获取系统默认词库
        return new Promise(resolve => {
          this.$axios.post(`/getDefaultWord`, {}).then((response) => {
            this.$root.wordJson.defaultAry = {label: '公共词库', options: [...response]}
            this.$root.wordJson.optionAry = this.$root.wordJson.optionAry.concat(this.$root.wordJson.defaultAry)
          })
        })
      },
      wordUpdate(e) { // 修改用户词库
        this.$root.userInfo.currentWordId = e
        this.$root.eventHub.$emit('start')
        this.$axios.post(`/setUserWord`, {
          userId: this.$root.userInfo.userId,
          wordId: e
        }).then((response) => {
          if (response === '更换词库成功') {
            this.toast('更换词库成功')
            this.$root.isState.isRegLoginDialog = false
          } else {
            this.toast('更换失败')
          }
        })
      }

    }
  }
</script>

<style scoped>
</style>
