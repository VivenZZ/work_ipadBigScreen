<template>
  <div class="search_tag">
    <div class="box">
      <router-link v-for="data in tag" :key="data.id" :to="data.url + '/' + search_name">{{data.title}}</router-link>
      <span @click="select()">方案</span>
      <span @click="goods()">商品</span>
      <router-view @change-data="changeData"></router-view>
    </div>
    <div>
      <transition name="fade">
        <div class="all mt100" v-if="isShow && data.length !== 0">
          <scroller :on-refresh="refresh" :on-infinite="infinite" :noDataText="noDataText"  ref="my_scroller">
            <ul>
              <li v-for="(all, index) in data" :key="all.id">
                <div class="sele" v-if="all.type === 0">
                  <a class="img_box" href="javascript:;" @click="showlDialog(all.code)" v-if="all.id">
                    <img v-lazy="{src: all.img, error: '/static/images/onerrornone.jpg'}" :key="all.img">
                    <img class="tag_3d" v-if="all.tag == '3d'" src="/static/images/3D_tag.png" alt="">
                  </a>
                  <p>
                    <span class="speic">{{all.speic}}</span>
                    <span class="area" v-if="all.area">约{{all.number}}㎡</span>
                  </p>
                  <p>
                    <span class="name">{{all.name}}</span>
                    <span class="describe">{{all.describe}}</span>
                    <span v-if="all.label" class="label">{{all.label}}</span>
                  </p>
                  <div v-if="all.id"  class="ct" :class="all.ischoice === true ? 'current' : ''"  @click="choice(all.id, index)"></div>
                </div>
                <div class="alone" v-if="all.code">
                  <div class="goods_img">
                    <p v-if="all.code" class="star" :class="all.ischoice === true ? 'current' : ''" @click="choice_goods(all.id, index, data)"></p>
                    <a href="javascript:;"  @click="showgDialog(all.id, all.code)">
                      <img v-lazy="{src: all.img, error: '/static/images/onerror260.jpg'}" :key="all.img">
                    </a>
                  </div>
                  <p class="goods_name">{{all.name}}</p>
                  <p v-if="all.pricediscount === all.price">
                    <span class="goods_price color333">￥{{all.pricediscount}}</span>
                  </p>
                  <p v-else>
                    <span class="goods_price ">￥{{all.pricediscount}}</span>
                    <del class="goods_price_old">￥{{all.price}}</del>
                  </p>
                  <p class="choise">{{all.count}}款可选</p>
                </div>
              </li>
            </ul>
          </scroller>
        </div>
        <div v-if="isShow && data.length === 0 && empty === 0" class="empty">
          <img src="/static/images/search_empty.png" alt="">
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
  </div>
</template>
<script>
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
export default{
  name: 'Search',
  components: {
    FulfillingBouncingCircleSpinner
  },
  data () {
    return {
      // search_name: '@$',
      search_name: '沙发',
      tag: [
        {
          title: '软装方案',
          url: '/search/result_select'
        },
        {
          title: '热卖商品',
          url: '/search/result_goods'
        }
      ],
      data: [],
      empty: 1,
      template: {
        id: '',
        name: '',
        tag: '',
        speic: '',
        describe: '',
        lable: [],
        type: 0
      },
      template1: {
        code: '',
        name: '',
        tag: '',
        speic: '',
        describe: '',
        lable: [],
        type: 1
      },
      isShow: true,
      pageIndex: 1,
      noDataText: ''
    }
  },
  created () {
    // 测试
    this.pageIndex = 1
    console.log(111)
    this.searchF(this.search_name)
  },
  methods: {
    choice_goods (id, index, data) {
      if (data[index].ischoice === true) {
        this.api.post('market/choice/cancel', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        data[index].ischoice = false
      } else {
        this.api.post('market/choice', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        data[index].ischoice = true
      }
    },
    choice (id, index) {
      if (this.data[index].ischoice === true) {
        this.api.post('market/choice/cancel', {type: 0, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.data[index].ischoice = false
      } else {
        this.api.post('market/choice', {type: 0, id: id}, function (result) {
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
    showlDialog (id) {
      // window.location.href = 'http://0.0.0.0:8081/#/collectDetails/' + id
      this.sdk.bridge.showInDialog(this.common.url + '/#/collectDetails/' + id)
    },
    changeData () {
      this.data = []
      this.empty = 1
      this.isShow = true
    },
    backSearch () {
      this.data = []
      this.empty = 1
      this.isShow = true
      window.location.href = this.common.url + '/#/search'
    },
    refresh () {
      this.pageIndex = 1
      this.pageIndex++
      this.searchF(this.search_name)
    },
    infinite () {
      let _this = this
      this.api.post('market/search', { kw: _this.search_name, type: 0, pageIndex: _this.pageIndex }, function (result) {
        if (!result.IsError) {
          _this.pageIndex++
          if (_this.empty === 0) {
            let a = []
            let b = []
            if (result.Data.datas.length !== 0) {
              result.Data.datas.forEach(e => {
                if (e.type === 0) {
                  a.push(e)
                } else {
                  b.push(e)
                }
              })
              _this.data = _this.mergeDate(a, b, _this.data)
            }
            _this.ShowNow()
            if (result.Data.datas.length === 0) { // 当数据小于10条的时候取消加载 显示nodatatext
              _this.$refs.my_scroller.finishInfinite(true)
            } else {
              console.log('还有加载')
              _this.$refs.my_scroller.finishInfinite(true)
            }
          }
        }
      })
    },
    select () {
      // let selectGoods = []
      console.log(1111)
      this.data.forEach(e => {
        console.log(e.type)
      })
    },
    searchF (name) {
      this.data = []
      this.empty = 0
      this.isShow = false
      this.pageIndex = 1
      this.pageIndex++
      // window.location.href = this.common.url + '/#/search'
      let _this = this
      if (!name) {
        name = '@$'
        alert('请输入搜索内容')
      }
      _this.search_name = name
      this.api.post('market/search', { kw: _this.search_name, pageIndex: 1 }, function (result) {
        if (!result.IsError) {
          if (_this.empty === 0) {
            let a = []
            let b = []
            if (result.Data.datas.length !== 0) {
              result.Data.datas.forEach(e => {
                if (e.type === 0) {
                  a.push(e)
                } else {
                  b.push(e)
                }
              })
              _this.data = _this.mergeDate(a, b, _this.data)
            }
            _this.ShowNow()
          }
        }
      })
    },
    mergeDate (a, b, c) {
      if (a.length > 4) {
        c = c.concat(a.slice(0, 4))
        a.splice(0, 4)
      } else if (a.length % 2 === 1) {
        a.push(this.template)
        c = c.concat(a)
        a = []
      } else {
        c = c.concat(a)
        a = []
      }
      if (b.length > 4) {
        c = c.concat(b.slice(0, 4))
        b.splice(0, 4)
      } else if (b.length % 4 === 1) {
        b.push(this.template1)
        b.push(this.template1)
        b.push(this.template1)
        c = c.concat(b)
        b = []
      } else if (b.length % 4 === 2) {
        b.push(this.template1)
        b.push(this.template1)
        c = c.concat(b)
        b = []
      } else if (b.length % 4 === 3) {
        b.push(this.template1)
        c = c.concat(b)
        b = []
      } else {
        c = c.concat(b)
        b = []
      }
      if (a.length === 0 && b.length === 0) {
        return c
      } else {
        return this.mergeDate(a, b, c)
      }
    },
    ShowNow: function () {
      this.isShow = true
    }
  },
  mounted () {
    window.searchF = this.searchF
    window.backSearch = this.backSearch
  }
}
</script>
<style lang="less" scoped>
.search_tag{
  .box{
    margin-top: 0.78125rem;
    a{
      display: inline-block;
      width: 1.445313rem;
      height: .585938rem;
      line-height: .585938rem;
      text-align: center;
      color: #ccc;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: .488281rem;
      text-decoration: none;
    }
    a:first-child{
      margin-left: .878906rem;
    }
    .router-link-active{
      color: #EB4D3D;
      border-color: #EB4D3D;
    }
  }
}
.all{
  width: 92.7734375%;
  margin: 0 auto 0;
  padding-bottom: 90/102.4rem;
  position: relative;
  height: calc(100vh - 180px);
  ._v-container{
    height: auto;
  }
  ul{
    overflow: hidden;
    li{
      float: left;
      margin:0 10/102.4rem  64/102.4rem;
      position: relative;
      text-align: center;
      .sele{
        width: 8.5rem;
        height: 7.080078rem;
        text-align: left;
        .ct{
          background: url('/static/images/star.png') no-repeat center center;
          background-size: 100%;
          width: 146/102.4rem;
          height: 98/102.4rem;
          position: absolute;
          right: -0.195313rem;
          top: 0;
        }
        .current{
          background: url('/static/images/star_current1.png') no-repeat center center;
          background-size: 100%;
        }
        a{
          display: block;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          img{
            width: 8.5rem;
            height: 5.9375rem;
            border-radius: 4px;
          }
          .tag_3d{
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -40/102.4rem 0 0 -40/102.4rem;
            width: 80/102.4rem;
            height: 80/102.4rem;
          }
        }
        p{
          .speic{
            display: inline-block;
            font-size: 28/102.4rem;
            line-height: 28/102.4rem;
            color: #EB4D3D;
            font-weight: bold;
            margin-top: 22/102.4rem
          }
          .area{
            display: inline-block;
            font-size: 24/102.4rem;
            line-height: 24/102.4rem;
            color: #EB4D3D;
            font-weight: bold;
            margin-top: 22/102.4rem
          }
          .name{
            display: inline-block;
            font-size: 22/102.4rem;
            color: #333;
            margin-top: 16/102.4rem;
            margin-bottom: 30/102.4rem;
          }
          .describe{
            display: inline-block;
            font-size: 20/102.4rem;
            line-height: 20/102.4rem;
            color: #333;
            margin-left: 12/102.4rem;
          }
          .label{
            font-size: 18/102.4rem;
            color: #F15A24;
            display: inline-block;
            border: 1px solid #F15A24;
            border-radius: 3px;
            margin-left: 12/102.4rem;
            padding: 0 12/102.4rem;
          }
        }
      }
      .alone{
        width: 4.101563rem;
        height: 5.5rem;
        margin-bottom: .292969rem;
        img{
          margin: .976563rem 0;
          width: 3.515625rem;
          height: 3.515625rem;
        }
        .goods_img{
          width: 4.101563rem;
          position: relative;
          .star{
            position: absolute;
            width: 1.42578125rem;
            height: 0.95703125rem;
            background: url(/static/images/star.png) no-repeat right center;
            background-size: 100%;
            top: -0.32rem;
            right: -0.6rem;
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
  }
}
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
.mt100{
  margin-top: 100/102.4rem;
}
</style>
