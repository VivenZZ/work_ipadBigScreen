<template>
  <div class="result_goods">
    <scroller :on-infinite="infinite" :noDataText="noDataText"  ref="my_scroller">
      <div class="h100"></div>
      <transition name="fade">
        <ul class="goods_list" v-if="isShow">
          <li v-for="(data, index) in hotgoods" :key="index">
            <div class="goods_img">
              <p class="star" :class="data.ischoice === true ? 'current' : ''" @click="choice(data.id, index)"></p>
              <a href="javascript:;"  @click="showgDialog(data.id, data.code)">
                <img v-lazy="{src: data.img, error: '/static/images/onerror260.jpg'}" :key="data.img">
              </a>
            </div>
            <p class="goods_name">{{data.name}}</p>
            <p v-if="data.pricediscount === data.price">
              <span class="goods_price color333">￥{{data.pricediscount}}</span>
            </p>
            <p v-else>
              <span class="goods_price ">￥{{data.pricediscount}}</span>
              <del class="goods_price_old">￥{{data.price}}</del>
            </p>
            <p class="choise">{{data.count}}款可选</p>
          </li>
          <li v-if="isShow && hotgoods.length === 0" class="empty">
            <img src="/static/images/search_empty.png" alt="">
          </li>
        </ul>
      </transition>
    </scroller>
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
import Vue from 'vue'
import VueScroller from 'vue-scroller'
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
Vue.use(VueScroller)
export default {
  name: 'SelectG',
  components: {
    FulfillingBouncingCircleSpinner
  },
  data () {
    return {
      hotgoods: [],
      isShow: false,
      pageIndex: 1,
      noDataText: '',
      key: ''
    }
  },
  created () {
    this.changeData()
    let _this = this
    if (this.$route.params.id === '@$') {
      _this.key = ''
    } else {
      _this.key = this.$route.params.id
    }
    _this.hotgoods = []
    // _this.api.post('market/search', {kw: _this.key, type: 2, pageIndex: _this.pageIndex}, function (result) {
    //   if (!result.IsError) {
    //     _this.pageIndex++
    //     _this.changeData()
    //     _this.hotgoods = result.Data.datas
    //     _this.isShow = true
    //   }
    // })
  },
  methods: {
    showgDialog (id, code) {
      // window.location.href = 'http://0.0.0.0:8081/#/goodsDetails/' + id + '/' + code
      this.sdk.bridge.showInDialog(this.common.url + '/#/goodsDetails/' + id + '/' + code)
    },
    changeData () {
      this.$emit('change-data', [])
    },
    choice (id, index) {
      if (this.hotgoods[index].ischoice === true) {
        this.api.post('market/choice/cancel', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.hotgoods[index].ischoice = false
      } else {
        this.api.post('market/choice', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.hotgoods[index].ischoice = true
      }
    },
    refresh () {
      let _this = this
      _this.pageIndex = 1
      _this.hotgoods = []
      _this.isShow = false
      _this.pageIndex++
      _this.api.post('market/search', {kw: _this.key, type: 2, pageIndex: 1}, function (result) {
        if (!result.IsError) {
          _this.hotgoods = result.Data.datas
          _this.isShow = true
        }
      })
    },
    infinite () {
      let _this = this
      this.api.post('market/search', {kw: _this.key, type: 2, pageIndex: _this.pageIndex}, function (result) {
        if (!result.IsError) {
          _this.pageIndex++
          result.Data.datas.forEach(e => {
            _this.hotgoods.push(e)
          })
          _this.isShow = true
          if (result.Data.datas.length === 0) { // 当数据小于10条的时候取消加载 显示nodatatext
            _this.$refs.my_scroller.finishInfinite(true)
          } else {
            console.log('还有加载')
            _this.$refs.my_scroller.finishInfinite(true)
          }
        }
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.result_goods{
  position: relative;
  width: 100%;
  height: calc(100vh - 140px);
}
.goods_list{
  overflow: hidden;
    li{
      width: 438/102.4rem;
      height: 610/102.4rem;
      float: left;
      margin: 0 12/102.4rem 0;
      position: relative;
      text-align: center;
    .goods_img{
      width: 438/102.4rem;
      position: relative;
      .star{
        position: absolute;
        width: 146/102.4rem;
        height: 98/102.4rem;
        background: url('/static/images/star.png') no-repeat right center;
        background-size:100%;
        top: -0.32rem;
        right: -0.5rem;
      }
      .current{
        background: url('/static/images/star_current.png') no-repeat right center;
        background-size:100%;
      }
      a{
        display: block;
        width: 360/102.4rem;
        height: 360/102.4rem;
        margin: 0 auto 60/102.4rem;
        img{
          display: block;
          width: 360/102.4rem;
          height: 360/102.4rem;
        }
      }
    }
        .goods_name{
          font-size: 20/102.4rem;
          color: #333;
          line-height: 20/102.4rem;
          font-family: PingFangSC-Medium, sans-serif;
          margin: 0 0 13/102.4rem 0;
        }
        .goods_price{
          font-size: 28/102.4rem;
          color: #D34D3D;
          line-height: 28/102.4rem;
          font-weight: bold;
        }
        .goods_price_old{
          font-size: 22/102.4rem;
          color: #B4B4B4;
          line-height: 22/102.4rem;
          font-weight: bold;
        }
    .color333{
      color: #333;
    }
    .choise{
      display: inline-block;
      width: 105/102.4rem;
      height: 24/102.4rem;
      line-height: 24/102.4rem;
      margin-top: 30/102.4rem;
      border: 1px solid #808080;
      border-radius: 3px;
      color: #808080;
      font-size: 20/102.4rem;
    }
  }
}
.h100{
  height: 100/102.4rem;
}
.goods_list{
  .empty{
    width: 100%;
    height: 70vh;
    position: relative;
    img{
      width: 7.304688rem;
      height: 5rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%)
    }
  }
}
</style>
