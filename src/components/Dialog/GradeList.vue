<template>
  <el-dialog
    class="gradeList"
    :fullscreen="true"
    title="跟打记录"
    v-loading="loading"
    :visible.sync="$root.isState.isGradeList"
    width="95%"
    center
    style="transition: all 0s;margin-top:0px;"
  >
    <el-table
      :data="gradeDataList.slice(page.currentPage * page.oneSize - page.oneSize,page.currentPage * page.oneSize)"
      style="width: 100%"
    >
      <el-table-column fixed="left" label="操作" width="60">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">View</el-button>
        </template>
      </el-table-column>
      <el-table-column label="段落" width="120">
        <template slot-scope="scope">
          <el-tag size="medium" type="success">第{{scope.row.dataStr.severnNum}}段</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="速度" width="140">
        <template slot-scope="scope">
          <el-tag size="medium">{{scope.row.dataStr.speed}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="击键"  width="100">
        <template slot-scope="scope">
          <el-tag size="medium">{{scope.row.dataStr.keystroke}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="码长">
        <template slot-scope="scope">
          <el-tag size="medium">{{scope.row.dataStr.runningYard}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="回改">
        <template slot-scope="scope">
          <el-tag size="medium" type="success">{{scope.row.dataStr.backChange}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="退格">
        <template slot-scope="scope">
          <el-tag size="medium" type="success">{{scope.row.dataStr.backSpace}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="词率" width="100">
        <template slot-scope="scope">
          <el-tag size="medium" type="success">{{scope.row.dataStr.wordRate}}%</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="耗时" width="120">
        <template slot-scope="scope">
          <el-tag size="medium">{{scope.row.dataStr.elapsedTime}}s</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="错字">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <el-row
              v-for="(item,i) in scope.row.dataStr.errorSize.ary"
              style="margin-top:5px;display: flex;justify-content: space-between;"
              :key="i"
            >
              <el-tag size="medium" type="danger" style="width:40%;text-align:center;">{{item[0]}}</el-tag>
              <el-tag size="medium" type="success" style="width:40%;text-align:center;">{{item[1]}}</el-tag>
            </el-row>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" :type="scope.row.dataStr.errorSize.num === '0' ? 'success' : 'danger'">{{scope.row.dataStr.errorSize.num}}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="跟打内容" width="120">
        <template slot-scope="scope">
          <el-popover trigger="hover" width="200" placement="top">
            <el-row
              style="margin-top:5px;display: flex;justify-content: space-between;"
            >{{scope.row.dataStr.withStr}}</el-row>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">查看</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      class="flex"
      layout="prev, pager, next"
      :page-size="page.oneSize"
      :pager-count="5"
      :current-page.sync="page.currentPage"
      :total="gradeDataList.length"
    ></el-pagination>
    <keep-alive>
      <GradeCharts ref="GradeCharts"/>
    </keep-alive>
  </el-dialog>
</template>

<script>
import GradeCharts from './GradeCharts'
import {setInterval} from 'timers'
export default {
  name: 'GradeList',
  components: {
    GradeCharts
  },
  data() {
    return {
      loading: true,
      page: {
        oneSize: 5,
        currentPage: 1
      },
      gradeDataList: []
    }
  },
  created() {
    this.getUserGradeList()
  },
  methods: {
    handleClick(row) {
      var realTimeSpeed = row.dataStr.realTimeSpeed
      this.$refs['GradeCharts'].loadGrade(row, [...realTimeSpeed])
    },
    getUserGradeList() {
      this.$axios
        .post(`/getUserGrade`, {
          userId: this.$root.userInfo.userId
        })
        .then(resp => {
          resp.forEach(e => {
            e.dataStr = JSON.parse(e.dataStr)
          })
          this.gradeDataList = resp.reverse()
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.gradeList {
  .el-dialog__body {
    padding: 0px;
  }
}
</style>
