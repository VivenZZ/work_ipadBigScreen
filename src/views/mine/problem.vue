<template>
  <div class="problem">
    <div class="header">
      <div class="back" @click="back()">
        常见问题
      </div>
    </div>
    <div class="content">
      <div class="qa" v-for="qa in data" :key="qa.id">
        <p class="q">
          Q: {{qa.q}}
        </p>
        <p class="a">
          A: {{qa.a}}
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
          q: '如何成为加盟商？需要提交哪些资料？',
          a: '通过线下渠道申请，提交相关资料并签订《加盟商协议》，审核通过后成为加盟商。    全部资质资料：合法的身份验证资料，包括但不限于本人身份证复印件、本人名片及复印件或合作公司营业执照复印件和业务联系人身份证复印件，业务联系人名片，如业务联系人非合作公司法人需提供书面法人授权书。'
        },
        {
          q: '加盟商如何进行识别？',
          a: '加盟商在审核通过之后都会获得唯一加盟商卡，卡号是唯一识别号。'
        },
        {
          q: '账号使用的年限？',
          a: '在签约的时间内可以使用。'
        },
        {
          q: '如何查看推广费？',
          a: '在后台“提成订单明细”中查看，可以查看PAD中所有的订单，该订单是已发货过账的订单。'
        },
        {
          q: '如何查看销售订单？',
          a: '在后台“销售订单明细”中查看，可以查看PAD中所有的订单。'
        },
        {
          q: '商品的价格是否可以修改调整？',
          a: '不可以，为了维护品牌的统一和标准，所有商品价格都是根据品牌营销策略定价，不可以随意调整价格。'
        },
        {
          q: '顾客支付的方式有哪些？',
          a: '微信支付或者到门店支付。顾客在星e购小程序提交订单后选择线上微信支付，或者在星e购小程序确认商品后选择线下门店根据自己需要的方式进行支付。'
        },
        {
          q: '顾客如何查询已支付订单？',
          a: '手机微信小程序星e购中可以查看订单的信息。'
        },
        {
          q: '密码忘记怎么办？',
          a: '手机号码为注册号码。在登录页面中点击“忘记密码”，利用手机验证码进行修改。'
        },
        {
          q: '手机号码更换怎么办？',
          a: '请登录“PC设计台”->“个人信息管理”中进行修改。'
        },
        {
          q: '顾客如何进行退换货？',
          a: '分两种情况：1）线下门店购买付款的订单，在门店退换货；2）线上手机微信小程序星易购支付的订单，请联系全国客服热线400-888-1916进行退换货。'
        }
      ]
    }
  },
  created () {
    this.sdk.bridge.saveTrace('memberQuestion', 0)
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
    border-top: 1px solid rgba(204, 204, 204, .5);
    font-size: .234375rem;
    line-height: .351563rem;
    .qa{
      margin-top: .732422rem;
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
