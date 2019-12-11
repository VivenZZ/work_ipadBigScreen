<template>
  <div class="problem">
    <div class="header">
      <div class="back" @click="back()">
        关于星e购
      </div>
    </div>
    <div class="content">
      <div class="qa" v-for="qa in data" :key="qa.id">
        <p class="a">
          {{qa.a}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Problem',
  data () {
    return {
      data: [
        {
          a: '星e购，是由星科月阳(浙江)科技有限公司，倾力打造的移动端智能营销用户体验平台。'
        },
        {
          a: '星科月阳的产品研发团队，长年服务于北美各大商超客户Macy’s、Walmart、Target等，积累了丰富的商品营销和供应链管理经验。自2007年起，我们积极参与国内著名零售品牌HarborHouse， TAO， Inkivy等的商务拓展和营销一体化建设，积累了丰富的电商和移动端营销经验。'
        },
        {
          a: '星科月阳致力研发移动端平台和大数据分析产品，为广大顾客提供更加贴心便捷的购物体验、同时也为各类商家提供更加智能灵活的营销辅助手段。'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    back () { // 返回上一级路由
      this.sdk.bridge.back()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.header{
  margin:130/102.4rem 0 .78125rem;
  text-align: center;
  position: relative;
  height: 1.09375rem;
  .back{
    width: 3.90625rem;
    text-align: left;
    position: absolute;
    top: 0;
    left: .878906rem;
    line-height: 1.09375rem;
    font-size: .439453rem;
    padding-left: .585938rem;
    color: #333;
    background: url('/static/images/back-order.png') 0 center no-repeat;
    background-size: .195313rem .351563rem;
    font-family: PingFangSC-Semibold, sans-serif;
  }
}
.problem{
  .content{
    margin: 0 .830078rem;
    padding-top: 80/102.4rem;
    border-top: 1px solid rgba(204, 204, 204, .5);
    font-size: .234375rem;
    line-height: .46875rem;
    .qa{
      margin-top: .332422rem;
    }
    .q{
      color: #EB4D3D;
    }
    .a{
      margin-top: .195313rem;
      color: #333;
    }
    .qa:last-child{
      margin-bottom: .732422rem;
    }
  }
}
</style>
