<template>
  <div class="mine">
    <transition name="fade">
      <scroller :on-refresh="refresh" :on-infinite="infinite" :noDataText="noDataText"  ref="my_scroller">
        <div class="header">
          <div class="back" @click="back()">
            订单明细
          </div>
        </div>
        <ul class="goodsBox">
          <li class="list" v-for="goods in data" :data-code="goods.code" :key="goods.id">
            <div class="goodslist_show">
              <div class="middle goodsImg"><img :src="goods.GoodsCover" style="width: 100;height: 100%;"></div>
              <div class="top info">
                <h5>{{goods.GoodsName}}</h5>
                <p>{{goods.Material}}</p>
                <p>{{goods.Color}}</p>
                <p>{{goods.PSize}}</p>
              </div>
              <div class="top priceBox">
                <p class="price">{{goods.CashAmount}}</p>
                <p class="oldPrice"><del>{{goods.MarkedPrice}}</del></p>
                <p class="piece">x {{goods.Quantity}}</p>
              </div>
              <span class="top state">{{goods.Status}}</span>
            </div>
          </li>
        </ul>
        <div v-if="isShow">
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
  </div>
</template>

<script>
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
export default {
  name: 'OrderDetails',
  components: {
    FulfillingBouncingCircleSpinner
  },
  data () {
    return {
      data: [],
      msg: 'Inspiration',
      isShow: false,
      listId: '',
      sub: '',
      noDataText: ''
    }
  },
  created () {
    let _this = this
    this.listId = this.$route.params.id.substr(0, this.$route.params.id.length - 1)// 传进来的动态id
    this.sub = parseInt(this.$route.params.id.substr(this.$route.params.id.length - 1, this.$route.params.id.length)) // 判断是ipad还是第三方
    this.ShowNow()
    if (this.sub === 0) {
      console.log('调用pad')
      this.api.post('/market/order/orderdetail', { ordersn: this.listId }, function (result) {
        if (!result.IsError) {
          _this.data = result.Data
          _this.$refs.my_scroller.finishPullToRefresh()
        }
      })
    } else {
      console.log('调用第三方')
      this.api.post('/market/order/otherorderdetail', { ordersn: this.listId }, function (result) {
        if (!result.IsError) {
          _this.data = result.Data.OrdersList
          _this.$refs.my_scroller.finishPullToRefresh()
          _this.ShowNow()
        }
      })
    }
  },
  methods: {
    back () { // 返回上一级路由
      this.$router.back(-1)
    },
    ShowNow () {
      this.isShow = true
    },
    refresh () {
      let _this = this
      if (this.sub === 0) {
        console.log('调用pad')
        this.api.post('/market/order/orderdetail', { ordersn: this.listId }, function (result) {
          if (!result.IsError) {
            _this.data = result.Data
            _this.$refs.my_scroller.finishPullToRefresh()
          }
        })
      } else {
        console.log('调用第三方')
        this.api.post('/market/order/otherorderdetail', { ordersn: this.listId }, function (result) {
          if (!result.IsError) {
            _this.data = result.Data.OrdersList
            _this.$refs.my_scroller.finishPullToRefresh()
            _this.ShowNow()
          }
        })
      }
      _this.$refs.my_scroller.finishPullToRefresh()
    },
    infinite () {
      this.$refs.my_scroller.finishInfinite(true)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.header{
  margin: .390625rem 0 .78125rem;
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
  }
}
.goodsBox{
  padding: 0 .830078rem;
  .list{
    position: relative;
    padding: 30/102.4rem 0;
    border-bottom: 1px solid rgba(204,204,204,.5);
    .goodslist_show{
      display:table-cell;
      .middle,.top{
        display: inline-block;
        vertical-align: middle;
      }
      .top{
        vertical-align: top;
        margin-top: 30/102.4rem;
      }
      .goodsImg{
        width: 260/102.4rem;
        height: 260/102.4rem;
        margin: 0 100/102.4rem 0 30/102.4rem;
      }
      .info{
        width: 460/102.4rem;
        margin-right: 30/102.4rem;
        font-size: #999;
        h5{
          font-size: 26/102.4rem;
          line-height: 26/102.4rem;
          margin-bottom: 40/102.4rem;
          color: #333;
          font-weight: bold;
        }
        p{
          font-size: 20/102.4rem;
          color: #999;
          line-height: 20/102.4rem;
          margin-bottom: 20/102.4rem;
        }
      }
      .number{
        margin: 0 4/102.4rem;
        width: 130/102.4rem;
        height: 50/102.4rem;
        border: #999 1px solid;
      }
      .priceBox{
        margin-left: 200/102.4rem;
        width: 220/102.4rem;
        .price{
          font-size: 26/102.4rem;
          color: #333;
          font-weight: bold;
        }
        .oldPrice{
          font-size: 22/102.4rem;
          color: #CCC;
        }
        .piece{
          font-size: 20/102.4rem;
          color: #999;
        }
      }
      .state{
        position: absolute;
        right: 1.171875rem;
        top: .585938rem;
        font-size: .253906rem;
        color: #EB4D3D;
      }
    }
  }
  li:first-child{
    border-top: 1px solid rgba(204,204,204, .5);
  }
}
</style>
