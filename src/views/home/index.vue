<template>
  <div class="c-box"
       :style="{background:'linear-gradient('+$root.style.pageStyle.top+' 0%, ' + $root.style.pageStyle.bottom +' 100%)'}">
    <Content/>
    <Drawer/>
    <Dialog/>
    <div class="cover" v-show="isCover"></div>
    <!--    <div class="srk" style="position: absolute;bottom: 10px;left:0px">-->
    <!--      <textarea autosize v-model="$root.textJson.tR" id="textarea"></textarea>-->
    <!--    </div>-->
  </div>
</template>

<script>
  import Content from '@/components/Content.vue'
  import Drawer from '@/components/Drawer.vue'
  import Dialog from '@/components/Dialog/Index.vue'

  export default {
    components: {
      Content,
      Drawer,
      Dialog
    },
    data() {
      return {
        isCover: false
      }
    },

    computed: {},
    created() {
      this.initialization()
    },
    mounted() {
      this.readStorageUserId() // 读一波用户信息
      this.readStronData() // 读一波本地的样式数据
      {
        (function(_this) {
          window.onresize = () => {
            _this.isCover = true
            const laoding = _this.getLoading()
            setTimeout(() => {
              laoding.close()
              _this.isCover = false
            }, 200)
          }
        })(this)
      }
    },
    methods: {
      readStronData() { // 读取一波本地的样式数据
        const backOption = localStorage.getItem('backOption') // 读透明度
        const pageTop = localStorage.getItem('pageTop') // 读透明度
        const pageBottom = localStorage.getItem('pageBottom') // 读透明度
        this.$root.style.pageStyle.backOption = backOption !== null && backOption !== '' ? parseInt(backOption) : 70
        this.$root.style.pageStyle.top = pageTop !== null && pageTop !== '' ? pageTop : 'rgba(255, 255, 255, 0.7)'
        this.$root.style.pageStyle.bottom = pageBottom !== null && pageBottom !== '' ? pageBottom : 'rgba(222, 222, 255, 0.7)'
      },
      readWordList() { // 读取词库
        let loading = this.getLoading()
        this.$axios.post(`/readWord`, {
          userId: this.$root.userInfo.userId
        }).then((response) => {
          loading.close()
          this.$root.wordJson.optionAry = [this.$root.wordJson.defaultAry, {label: '私人词库', options: response}]
          // this.$root.wordJson.optionAry = [...this.$root.wordJson.defaultAry, {label: '私人词库', options: response}]
        })
      },
      readUserInfo() { // 读取用户信息
        this.$axios.post(`/readUserInfo`, {
          userId: this.$root.userInfo.userId
        }).then((response) => {
          const data = response
          this.$root.userInfo = {...data}
          this.$root.userInfo.userId = data.id
          this.$root.userInfo.sign = data.sign === null || data.sign === '' ? '这个人很懒..什么都没有设置' : data.sign
        })

      },
      readStorageUserId() { // 读取用户的数据
        const userId = localStorage.getItem('userId') // 读取当前登录的用户名
        if (userId !== null && userId !== undefined && userId !== '' && userId !== 'undefined') { // 当拿到值，确认不是空先
          this.$root.userInfo.userId = parseInt(userId)
          this.readUserInfo() // 读取用户的基础信息 // 这里面读到用户的信息后，还读了一遍载文
          this.readWordList() // 读取一波用户的词库
        }
      },
      initialization() {
        this.$root.eventHub.$on('getLoading', this.getLoading)
        this.$root.eventHub.$on('readStorageUserId', this.readStorageUserId)
        this.$root.eventHub.$on('readWordList', this.readWordList)
        this.$root.eventHub.$on('readUserInfo', this.readUserInfo)
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
