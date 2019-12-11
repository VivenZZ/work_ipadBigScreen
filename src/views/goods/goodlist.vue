<template>
  <div class="hot">
    <scroller :on-refresh="refresh" :on-infinite="infinite" :noDataText="noDataText"  ref="my_scroller">
      <div class="ins_collo">
        <p class="top">
          <img @click="back()" src="/static/images/back.png" alt="">
          <swiper class="swiper1" :options="swiperOption_t" ref="mySwiper" v-if="topNav.length !== 0">
            <!-- slides -->
            <swiper-slide   v-for="(data, index) in topNav" :key="index" class="">
              <a :class="listId === data.id ? 'active' : ''" :href="'#/goods/goodlist/' + data.id" @click="localStorage(data.id, 1)">{{data.name}}</a>
            </swiper-slide>
          </swiper>
        </p>
        <swiper class="swiper2" :options="swiperOption" ref="mySwiper" v-if="navBar.length !== 0">
          <!-- slides -->
          <swiper-slide  v-for="(data, index) in navBar" :key="index">
            <a :href="'#/goods/goodlist/' + data.id" @click="localStorage(data.id, 2)">
              <img v-lazy="{src: data.image}" :key="data.image">
              <span>{{data.name}}</span>
            </a>
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
      </div>
      <ul class="goods_list" v-if="goods.length !== 0" @touchend="infiniteOne" ref='list'>
        <li v-for="(data, index) in goods" :key="index">
          <div class="goods_img">
            <p class="star" :class="data.ischoice === true ? 'current' : ''" @click="choice(data.productid, index)"></p>
            <a href="javascript:;" @click="showgDialog(data.productid, data.code)">
              <img v-lazy="{src: data.picture, error: '/static/images/onerror260.jpg'}" :key="data.picture">
            </a>
          </div>
          <p class="goods_name">{{data.productname}}</p>
          <p>
            <span class="goods_price color333">￥{{data.pricediscount}}</span>
          </p>
          <p class="choise">{{data.count}}款可选</p>
        </li>
      </ul>
    </scroller>
  </div>
</template>
<script>
import Vue from 'vue'
import VueScroller from 'vue-scroller'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
Vue.use(VueScroller)
// let _this = this
// _this.api.post('/market/product/list', {cid: id, pageIndex: 1, pageSize: 10}, function (result) {
//   if (!result.IsError) {
//     console.log(result.Data)
//   }
// })
export default {
  name: 'Goodlist',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOption: {
        spaceBetween: 10,
        slidesPerView: 'auto',
        freeMode: true
      },
      swiperOption_t: {
        spaceBetween: 10,
        slidesPerView: 'auto',
        freeMode: true
      },
      goods: [],
      listId: '',
      topNav: [], // 不为空的时候显示顶部导航
      navBar: [],
      noDataText: '',
      index: 0,
      height: 0,
      position: 0,
      backNumber: [-1],
      floorNumber: 0
    }
  },
  created () {
    this.goods = []
    this.listId = this.$route.params.id // 传进来的动态id
  },
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      this.listId = this.$route.params.id // 传进来的动态id
      this.index = 1
      this.getDate('market/product/list', this.listId, 1)
    }
  },
  methods: {
    localStorage (id, floor) {
      let localStorageData = JSON.parse(window.localStorage.getItem('navData'))// 总数据
      let currentData = window.localStorage.getItem('currentNav') // 当前id
      let n = 0
      let currentName
      for (let index = 0; index < localStorageData.length; index++) {
        if (localStorageData[index].id === id) { // 点击id存在总数据内
          n = 1
          window.localStorage.setItem('currentNav', id) // 替换id
          this.sdk.bridge.saveTrace('allGoodsTouch' + localStorageData[index].name, 1)
        }
        if (localStorageData[index].id === currentData) {
          currentName = localStorageData[index].name
        }
      }
      if (n === 0) {
        this.sdk.bridge.saveTrace('allGoodsTouch' + currentName, 1)
      }
      // 分层，点击同层级的 递减
      if (floor === 1) {
        this.backNumber[this.floorNumber]--
      }
      // 点击下一层级的新增
      if (floor === 2) {
        this.floorNumber++
        this.backNumber[this.floorNumber] = -1
      }
    },
    infiniteOne (e) {
      this.height = this.$refs.list.offsetHeight
      console.log(this.height - this.position)
      if (this.height - this.position < 1400) {
        // 处理滚动过快会出现不执行infinite的情况。
        this.infinite()
      }
    },
    showgDialog (id, code) {
      // window.location.href = 'http://0.0.0.0:8081/#/goodsDetails/' + id + '/' + code
      this.sdk.bridge.showInDialog(this.common.url + '/#/goodsDetails/' + id + '/' + code)
    },
    choice (id, index) {
      if (this.goods[index].ischoice === true) {
        this.api.post('market/choice/cancel', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.goods[index].ischoice = false
      } else {
        this.api.post('market/choice', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.goods[index].ischoice = true
      }
    },
    back () { // 返回上一级路由
      this.$router.go(this.backNumber[this.floorNumber])
      this.backNumber[this.floorNumber] = 0
      this.floorNumber--
    },
    refresh () {
      this.index = 1
      this.listId = this.$route.params.id // 传进来的动态id
      this.getDate('market/product/list', this.listId, 1)
    },
    infinite () {
      let _this = this
      this.index++
      _this.api.post('market/product/list', {cid: this.listId, pageIndex: this.index, pageSize: 10}, function (result) {
        if (!result.IsError) {
          _this.navBar = result.Data.subcategorys
          _this.topNav = result.Data.categorys
          result.Data.goods.forEach(e => {
            _this.goods.push(e)
          })
          _this.position = _this.$refs.my_scroller.getPosition().top
          if (result.Data.goods.length < 10) { // 当数据小于10条的时候取消加载 显示nodatatext
            _this.$refs.my_scroller.finishInfinite(true)
          } else {
            console.log('还有加载')
            _this.$refs.my_scroller.finishInfinite(true)
          }
        }
      })
    },
    getDate (url, cid, pageIndex) {
      let _this = this
      _this.api.post('market/product/list', {cid: this.listId, pageIndex: 1, pageSize: 10}, function (result) {
        if (!result.IsError) {
          _this.goods = result.Data.goods
          _this.navBar = result.Data.subcategorys
          _this.topNav = result.Data.categorys
          _this.$refs.my_scroller.finishPullToRefresh()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.hot{
  height: 100%;
}
.swiper1{
  float: left;
  width: 94%;
  margin-left: -0.4rem;
  .swiper-slide{
    width: auto;
  }
}
.swiper2{
  .swiper-slide:nth-child(1){
    margin-left: .722656rem;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    width: 340/102.4rem;
    height: 2.636719rem;
    span{
      position: absolute;
      bottom: 0;
      left: 0;
      color: #333;
      font-size: .244141rem;
    }
    a{
      display: block;
      width: 340/102.4rem;
      height: 270/102.4rem;
    }
  }
  .swiper-slide img {
    width: auto;
    height: 214/102.4rem;
    max-width: 100%;
    max-height: 100%;
    border-radius: 4px;
  }
}
.ins_collo{
  width: 100%;
  .hide{
    opacity: 0;
  }
  .top{
    height: .957031rem;
    line-height: .957031rem;
    font-size: .234375rem;
    padding-left: 42/102.4rem;
    overflow: hidden;
    position: relative;
    box-shadow: 0 1px 8px rgba(0,0,0,.1);
    z-index: 999;
    img{
      margin-top: 9/102.4rem;
      width: .759375rem;
      vertical-align: middle;
      float: left;
      z-index: 99;
      position: relative;
    }
    a{
      display: inline-block;
      vertical-align: middle;
      color: #ccc;
      text-decoration: none;
      margin: 0 0.4rem;
    }
    .active{
      color: #333;
      &::after{
        content: '';
        border-bottom: 2px solid #000;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width:30px;
      }
    }
  }
  ul{
    overflow: hidden;
    li{
      float: left;
      text-align: center;
      span{
        display: inline-block;
        font-size: .253906rem;
        line-height: .253906rem;
        margin-bottom: .195313rem;
        color: #333;
        margin-right: .625rem;
      }
      span.line{
        display: inline-block;
        width: .615234rem;
        height: 2px;
      }
    }
    .active{
      span.line{
        background-color: #ED1C24;
      }
    }
  }
}
.goods_list{
  overflow: hidden;
  margin-top: 80/102.4rem;
    li{
      width: 4.277344rem;
      height: 5.957031rem;
      float: left;
      margin: .488281rem .117188rem 0;
      position: relative;
      text-align: center;
    .goods_img{
      width: 4.277344rem;
      position: relative;
      .star{
        position: absolute;
        width: 1.425781rem;
        height: .957031rem;
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
.h100{
  height: .976563rem;
}
</style>
