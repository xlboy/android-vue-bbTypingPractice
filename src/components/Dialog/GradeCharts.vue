<template>
  <el-dialog
    class="gradeCharts"
    :fullscreen="true"
    :title="new Date(parseInt(gradeData.date)).toLocaleString()"
    :modal="false"
    v-if="$root.isState.isRradeCharts"
    :visible.sync="$root.isState.isRradeCharts"
    width="90%"
    center
    style="transition: all 0s;"
  >
    <el-button circle icon="el-icon-printer" class="imgCnavasDown" round @click="imgCnavasDown"></el-button>
    <ve-line
      :extend="options"
      id="v-grade-charts"
      :data="chartData"
      :settings="chartSettings"
    ></ve-line>
  </el-dialog>
</template>

<script>
export default {
  name: 'GradeCharts',
  data() {
    this.chartSettings = {
      axisSite: {right: ['击键']},
      yAxisType: ['normal', 'normal'],
      yAxisName: ['速度', '击键']
    }
    return {
      gradeData: {},
      options: {
        title: {
          text: '',
          bottom: '0%',
          left: '50%',
          textAlign:'center',
          textStyle: {
            color: '#5AB1EF',
            fontSize: 15,
            fontFamily:'sans-serif',
            rich: {
              numStyle:{
                color:'#19D4AE',
                padding:2,
                fontSize:18,
                fontFamily:'Microsoft YaHei',
                fontWeight:'600'
              }
            }
          }
        },

        backgroundColor: '#FFF'
      },
      chartData: {
        columns: ['date', '速度', '击键'],
        rows: []
      },
      imgSrc: ''
    }
  },
  methods: {
    imgCnavasDown() {
      let dom = document.querySelector('#v-grade-charts canvas')
      androids.saveImg(this.convertCanvasToImage(dom))
    },
    loadGrade(data, realTimeSpeed) {
      let gradeListAry = []
      this.gradeData = {...data}
      console.log(this.gradeData)
      this.options.title.text = `也就{numStyle|${data.dataStr.severnNum}}段时速{numStyle|${data.dataStr.speed}}击键{numStyle|${data.dataStr.keystroke}}\n码长{numStyle|${data.dataStr.runningYard}}回改{numStyle|${data.dataStr.backChange}}而已，你们站着干啥`

      let startDate = 0,
        isTurnUp = false
      realTimeSpeed.forEach((e, i) => {
        let json = {...e}
        json['速度'] = parseInt(json.speed)
        json['回改'] = parseInt(json.runningYard)
        json['击键'] = parseInt(json.keystroke)
        if (json.date !== 0 && isTurnUp === false) {
          isTurnUp = true
          startDate = json.date
        }
        json.date = ((json.date - startDate) / 1000).toFixed(2) + 's'
        gradeListAry.push(json)
        console.log('开头',{...e},'\n结束',json)
      })
      this.chartData.rows = gradeListAry
      this.$root.isState.isRradeCharts = true
    }
  }
}
</script>

<style lang="scss" >
.gradeCharts {
  .el-dialog__body {
    padding: 0px !important;
  }
}
#imgSrc {
  width: 100vw;
}
.imgCnavasDown {
  position: absolute;
  z-index: 999;
  left: 10px;
  top: 10px;
}
</style>
