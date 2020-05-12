<template>
  <div class="bb-dialog">
    <el-dialog class="u-dialog" title="词提分析" :visible.sync="$root.isState.isWordAnalysis" width="70%" center
               style="transition: all 0s;">
      <el-collapse>
        <el-collapse-item v-for="(item,i) in Object.keys($root.wordJson.analysisJson)" :key="i"
                          :title="item + '　　　' + Object.keys($root.wordJson.analysisJson[item]).length + '个'" :name="i">
          <el-tag v-for="(it2,ii) in $root.wordJson.analysisJson[item]" :key="ii" style="margin:3px;">{{it2}}</el-tag>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <!-- 绑定QQ的dialog -->
    <el-dialog class="u-dialog" title="我表妹要你你扣扣" :visible.sync="$root.isState.isBindQQ" width="70%" center
               style="transition: all 0s;">
      <el-input class="e-ipt" @blur="loginIptBlur(1)" @focus="loginIptBlur(2)" maxlength="20"
                v-model="bindQQStr" placeholder="QQ号"></el-input>
      <el-button type="primary" class="gdq-btn" style="width: 73px;margin-top:10px" @click="bindQQ()">确定</el-button>
    </el-dialog>

    <!-- 设置个签的dialog -->
    <el-dialog class="u-dialog" title="个签,有趣的灵魂" :visible.sync="$root.isState.isSign" width="70%" center
               style="transition: all 0s;">
      <el-input class="e-ipt" @blur="loginIptBlur(1)" @focus="loginIptBlur(2)" maxlength="30"
                v-model="signStr" placeholder="个签内容"></el-input>
      <el-button type="primary" class="gdq-btn" style="width: 73px;margin-top:10px" @click="signSave()">确定</el-button>
    </el-dialog>

    <!-- 注册登录的dialog -->
    <el-dialog class="u-dialog" title="注册登录..." :visible.sync="$root.isState.isRegLoginDialog" width="70%" center
               style="transition: all 0s;">
      <el-input class="e-ipt" @blur="loginIptBlur(1)" @focus="loginIptBlur(2)" maxlength="20"
                v-model="regLoginForm.username" placeholder="用户名"></el-input>
      <el-input class="e-ipt" @blur="loginIptBlur(1)" @focus="loginIptBlur(2)" maxlength="20"
                v-model="regLoginForm.password" placeholder="密码">
      </el-input>
      <el-button type="primary" plain class="gdq-btn" @click="regLogin">
        注册并登录
      </el-button>
      <el-button type="primary" style="margin-left:0px;" plain class="gdq-btn" @click="login">
        纯天然登录
      </el-button>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: 'Dialog',
    data() {
      return {
        bindQQStr:'',
        signStr:'', // 个签内容
        regLoginForm: { // 注册登录内容
          username: '',
          password: ''
        }
      }
    },
    methods: {
      async bindQQ() { // 绑定QQ
        this.$axios.post(`/savaQQ`, {
          userId: this.$root.userInfo.userId,
          qq: this.bindQQStr
        }).then(() => {
          this.bindQQStr = ''
          this.$root.isState.isBindQQ = false
          this.$root.eventHub.$emit('readUserInfo') // 重新读一波用户的数据
        })
      },
      async signSave() { // 个性签名设置
        if (this.isNull(this.$root.userInfo.userId)) return this.toast('亲,这边建议您先出门右转登陆哦')
        this.$axios.post(`/savaSign`, {
          userId: this.$root.userInfo.userId,
          sign: this.signStr
        }).then(() => {
          this.toast('个签更改成功')
          this.$root.isState.isSign = false
          this.$root.eventHub.$emit('readUserInfo') // 重新读一波用户的数据
        })
      },
      regLogin() {
        if (this.regLoginForm.username === '' || this.regLoginForm.password === '') return this.toast('不可为空啊，你妹的')
        this.$axios.post(`/reg`, {
          ...this.regLoginForm
        }).then((response) => {
          if (response !== '存在此账号') {
            this.toast('注册成功')
            this.regLoginForm = { // 值给撸掉，一毛都不留，知道没
              username: '',
              password: ''
            }
            localStorage.setItem('userId', response)
            this.$root.eventHub.$emit('readStorageUserId') // 重新读一波用户的数据
            this.$root.isState.isRegLoginDialog = false
          } else this.toast('账户已存在')
        })
      },
      login() {
        if (this.regLoginForm.username === '' || this.regLoginForm.password === '') return this.toast('不可为空啊，你妹的')

        this.$axios.post(`/login`, {
          ...this.regLoginForm
        }).then((response) => {
          const data = response
          if (data !== '账号密码有误') {
            this.toast('登录成功')
            localStorage.setItem('userId', data.id)
            this.$root.userInfo.username = data.username
            this.$root.userInfo.currentWordId = data.currentWordId
            this.$root.userInfo.userId = data.id
            this.regLoginForm = { // 值给撸掉，一毛都不留，知道没
              username: '',
              password: ''
            }
            this.$root.eventHub.$emit('readStorageUserId') // 重新读一波用户的数据
            this.$root.isState.isRegLoginDialog = false
          } else {
            this.toast('账号密码有误')
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
