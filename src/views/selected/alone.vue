<template>
  <div>
    <transition name="fade">
      <div class="all" v-if="isShow">
        <ul class="goods_list">
          <li v-for="(data, index) in data" :key="index">
            <div class="goods_img">
              <p class="star" :class="data.ischoice === true ? 'current' : ''" @click="choice(data.id, index)"></p>
              <a href="javascript:;" @click="showgDialog(data.id, data.code)">
                <img v-lazy="{src: data.img, error: '/static/images/onerror260.jpg'}" :src="data.img">
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
        </ul>
      </div>
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
  name: 'Alone',
  components: {
    FulfillingBouncingCircleSpinner
  },
  data () {
    return {
      data: [],
      isShow: false
    }
  },
  created () {
    let _this = this
    _this.sdk.bridge.saveTrace('choiceGoods', 0)
    // this.common.getAjaxData('/all.com/', this.data, this.ShowNow)
    this.api.post('market/programme/choice', {type: 3}, function (result) {
      if (!result.IsError) {
        _this.data = result.Data
        _this.ShowNow()
      }
    })
  },
  methods: {
    choice (id, index) {
      if (this.data[index].ischoice === true) {
        this.api.post('market/choice/cancel', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.data[index].ischoice = false
      } else {
        this.api.post('market/choice', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.data[index].ischoice = true
      }
    },
    showgDialog (id, code) {
      // window.location.href = 'http://0.0.0.0:8081/#/goodsDetails/' + id + '/' + code
      this.sdk.bridge.showInDialog(this.common.url + '/#/goodsDetails/' + id + '/' + code)
    },
    ShowNow: function () {
      this.isShow = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .all{
    padding-bottom: 90/102.4rem;
    position: relative;
    height: calc(100vh - 180px);
    ._v-container{
      height: auto;
    }
    .goods_list{
      overflow: hidden;
      li{
        width: 4.077344rem;
        height: 5.957031rem;
        float: left;
        margin: .488281rem .117188rem 0;
        position: relative;
        text-align: center;
      .goods_img{
        width: 4.077344rem;
        position: relative;
        .star{
          position: absolute;
          width: 1.425781rem;
          height: .957031rem;
          background: url('/static/images/star.png') no-repeat right center;
          background-size:100%;
          top: -0.32rem;
          right: -0.6rem;
        }
        .current{
          background: url('/static/images/star_current.png') no-repeat right center;
          background-size:100%;
        }
        a{
          display: block;
          width: 3.515625rem;
          height: 3.515625rem;
          margin: 0 auto .585938rem;
          img{
            display: block;
            width: 3.515625rem;
            height: 3.515625rem;
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
      width: 1.025391rem;
      height: .234375rem;
      line-height: .234375rem;
      margin-top: .292969rem;
      border: 1px solid #808080;
      border-radius: 3px;
      color: #808080;
      font-size: .195313rem;
    }
  }
}
}
</style>
