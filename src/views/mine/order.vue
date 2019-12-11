<template>
  <div class="order">
    <transition name="fade">
      <scroller :on-refresh="refresh" :on-infinite="infinite" :noDataText="noDataText"  ref="my_scroller">
        <div class="header">
            <div class="back"  @click="back()">
              我的订单
            </div>
            <p>
              <span v-for="(data, index) in platform " :class="currentIndex === index ? 'current' : ''" :key="data.id"  @click="toogle(index)">{{data.name}}</span>
            </p>
        </div>
        <div class="content"  v-if="isShow">
          <div class="top">
            <div class="datatime">
              <span class="time">{{obj.btime}}</span>
              <datetime v-model="obj.btime" ></datetime>
            </div>
            <span> - </span>
            <div class="datatime">
              <span class="time">{{obj.etime}}</span>
              <datetime v-model="obj.etime" ></datetime>
            </div>
            <input type="text" placeholder="请输入姓名" v-model="obj.mname">
            <input type="mobile" placeholder="请输入手机号" v-model="obj.mobile">
            <button type="submit" @click="fiter(obj.btime, obj.etime, obj.mname, obj.mobile)">查询</button>
          </div>
        </div>
        <div class="list">
          <ul class="list_title">
            <li>客户姓名</li>
            <li>手机号</li>
            <li>订单号</li>
            <!-- <li>确认订单号</li> -->
            <li>销售日期</li>
            <li>销售金额</li>
          </ul>
          <ul class="list_content" v-for="data in list" :key="data.id">
            <li>{{data.UserName}}</li>
            <li>{{data.Mobile}}</li>
            <li v-if="currentIndex === 0"><a  class="bule" :href="'#/mine/orderDetails/' + data.OrderSN + currentIndex">{{data.ThirdOrderSN}}</a></li>
            <li v-if="currentIndex === 1">{{data.ThirdOrderSN}}</li>
            <!-- <li>{{data.OrderSure}}</li> -->
            <li>{{data.SubSapTime}}</li>
            <li>{{data.CashAmount}}</li>
          </ul>
        </div>
      </scroller>
    </transition>
    <div class="loading" v-if="!isShow">
      <fulfilling-bouncing-circle-spinner
        :animation-duration="4000"
        :size="60"
        color="#EB4D3D"
      />
    </div>
      <div class="bottom">
        <div class="box">
          <span class="text">总计</span>
          <span>&nbsp;</span>
          <span>&nbsp;</span>
          <span>&nbsp;</span>
          <span class="allPrice">{{allPrice}}</span>
        </div>
      </div>
  </div>
</template>

<script>
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
import Vue from 'vue'
import VueScroller from 'vue-scroller'
import { Datetime } from 'vux'
Vue.use(VueScroller)
export default {
  name: 'Order',
  components: {
    FulfillingBouncingCircleSpinner,
    Datetime
  },
  data () {
    return {
      data: [],
      msg: 'Inspiration',
      noDataText: '',
      isShow: false,
      platform: [
        {
          id: 0,
          name: 'ipad平台'
        },
        {
          id: 1,
          name: '其他平台'
        }
      ],
      list: [],
      currentIndex: 0,
      obj: {
        btime: '请选择日期',
        etime: '请选择日期',
        pageIndex: 0,
        pageSize: 10,
        mname: '',
        mobile: ''
      }
    }
  },
  created () {
    this.sdk.bridge.saveTrace('memberOrder', 0)
  },
  methods: {
    back () { // 返回上一级路由
      this.sdk.bridge.back()
    },
    fiter (s, e, n, t) {
      if (s === '请选择日期') {
        this.obj.btime = ''
      }
      if (e === '请选择日期') {
        this.obj.etime = ''
      }
      this.obj.pageIndex = 1
      this.obj.mname = n
      this.obj.mobile = t
      this.isShow = false
      let _this = this
      if (this.currentIndex === 0) {
        this.api.post('/market/order/orderlist', this.obj, function (result) {
          if (!result.IsError) {
            console.log(result)
            _this.list = result.Data.OrdersList
            _this.ShowNow()
            if (_this.obj.btime === '') {
              _this.obj.btime = '请选择日期'
            }
            if (_this.obj.etime === '') {
              _this.obj.etime = '请选择日期'
            }
          }
        })
      } else {
        this.api.post('/market/order/otherorderlist', this.obj, function (result) {
          if (!result.IsError) {
            _this.list = result.Data.OrdersList
            _this.ShowNow()
            if (_this.obj.btime === '') {
              _this.obj.btime = '请选择日期'
            }
            if (_this.obj.etime === '') {
              _this.obj.etime = '请选择日期'
            }
          }
        })
      }
    },
    toogle (index) {
      let _this = this
      this.currentIndex = index
      this.list = []
      this.obj.pageIndex = 1
      this.obj.btime = ''
      this.obj.etime = ''
      this.isShow = false
      if (this.currentIndex === 0) {
        this.api.post('/market/order/orderlist', this.obj, function (result) {
          if (!result.IsError) {
            _this.list = result.Data.OrdersList
            _this.ShowNow()
            _this.obj.btime = '请选择日期'
            _this.obj.etime = '请选择日期'
          }
        })
      } else {
        this.api.post('/market/order/otherorderlist', this.obj, function (result) {
          if (!result.IsError) {
            _this.list = result.Data.OrdersList
            _this.ShowNow()
            _this.obj.btime = '请选择日期'
            _this.obj.etime = '请选择日期'
          }
        })
      }
    },
    ShowNow () {
      this.isShow = true
    },
    refresh () {
      let _this = this
      this.obj.pageIndex = 1
      this.obj.btime = ''
      this.obj.etime = ''
      this.obj.mname = ''
      this.obj.mobile = ''
      if (this.currentIndex === 0) {
        this.api.post('/market/order/orderlist', this.obj, function (result) {
          if (!result.IsError) {
            _this.list = result.Data.OrdersList
            _this.$refs.my_scroller.finishPullToRefresh()
            _this.obj.btime = '请选择日期'
            _this.obj.etime = '请选择日期'
          }
        })
      } else {
        this.api.post('/market/order/otherorderlist', this.obj, function (result) {
          if (!result.IsError) {
            _this.list = result.Data.OrdersList
            _this.$refs.my_scroller.finishPullToRefresh()
            _this.obj.btime = '请选择日期'
            _this.obj.etime = '请选择日期'
          }
        })
      }
    },
    infinite () {
      let _this = this
      this.obj.pageIndex++
      if (this.currentIndex === 0) {
        this.api.post('/market/order/orderlist', this.obj, function (result) {
          if (!result.IsError) {
            result.Data.OrdersList.forEach(e => {
              _this.list.push(e)
            })
          }
        })
      } else {
        this.api.post('/market/order/otherorderlist', this.obj, function (result) {
          if (!result.IsError) {
            result.Data.OrdersList.forEach(e => {
              _this.list.push(e)
            })
          }
        })
      }
      _this.ShowNow()
      this.$refs.my_scroller.finishInfinite(true)
    }
  },
  computed: {
    allPrice: function () {
      let a = 0
      if (this.list.length !== 0) {
        this.list.forEach(e => {
          a += e.CashAmount
        })
      }
      a = Math.floor(a * 10) / 10
      return a
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.order{
  .header{
    margin:130/102.4rem 0 .78125rem;
    text-align: center;
    position: relative;
    height: 1.09375rem;
    .full-jcalendar .input__inner{
      border-color: red;
    }
    p{
      display: block;
      overflow: hidden;
      margin: 0 auto;
      width: 5.46875rem;
    }
    span{
      float: left;
      box-sizing: border-box;
      width: 49%;
      height: .546875rem;
      line-height: .546875rem;
      color: #E44D3D;
      border: 1px solid #E44D3D;
      font-size: .234375rem;
    }
    span:nth-child(1){
      margin-left: 0 -1px;
      border-radius: .097656rem 0 0 .097656rem;
    }
    span:nth-child(2){
      border-radius: 0 .097656rem .097656rem 0;
    }
    .current{
      background-color: #E44D3D;
      color: white;
      border: 1px solid #E44D3D;
    }
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
  .content{
    padding: 0 .878906rem;
    position: relative;
    overflow: hidden;
    .datatime{
      float: left;
      width: 2.929688rem;
      border-radius: 5px;
      border: 1px solid #ccc;
      height: 36px;
      line-height: 36px;
      box-sizing: border-box;
      text-indent: 10px;
      overflow: hidden;
      background: url('/static/images/data.png') 90% center no-repeat;
      background-size:16%;
      .vux-datetime{
        display: block;
        width: 100%;
        height: 36px;
        position: relative;
        color:#999;
        text-decoration: none;
        line-height: 36px;
        text-align: left;
        opacity: 0;
      }
      .time{
        color:#999;
      }
    }
    span{
      line-height: 36px;
      float: left;
      margin: 0 5px;
    }
    input{
      float: left;
      width: 3.125rem;
      border-radius: 5px;
      border: 1px solid #ccc;
      height: 36px;
      box-sizing: border-box;
      text-indent: 10px;
      margin-left: .585938rem;
    }
    button{
      width: 2.636719rem;
      border-radius: 5px;
      border: 1px solid #E44D3D;
      background-color: white;
      font-size: .234375rem;
      color: #E44D3D;
      height: 36px;
      box-sizing: border-box;
      position: absolute;
      right: .878906rem;
    }
  }
  .list{
    padding: 0 .878906rem;
    ul{
      display: flex;
      color: #333;
      li{
        flex: 1;
        text-indent: .878906rem;
      }
      .bule{
        color: #29ABE2;
      }
    }
    .list_title{
      line-height: 1.757813rem;
      font-size: .292969rem;
      margin-top: .976563rem;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    .list_content{
      line-height: 1.074219rem;
      font-size: .253906rem;
      border-bottom: 1px solid #ccc;
    }
  }
  .bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    height: .957031rem;
    font-size: .292969rem;
    line-height: .957031rem;
    color: #333;
    font-weight: bold;
    width: 100%;
    z-index: 999;
    background-color: white;
    .box{
      margin: 0 0.878906rem;
      display: flex;
      text-indent: .878906rem;
    }
    span{
      flex: 1;
    }
  }
}
</style>
