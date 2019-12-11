<template>
  <div class="search_tag">
    <div class="box">
      <!-- <router-link v-for="data in tag" :key="data.id" :to="data.url + '/' + search_name">{{data.title}}</router-link> -->
      <span v-for="(data, index) in tag" :key="index"  @click="changeSG(data.type)" :class="index+1 === type ? 'current':''">{{data.title}}</span>
      <!-- <router-view @change-data="changeData"></router-view> -->
    </div>
    <div>
      <transition name="fade">
        <div class="all mt100" v-if="isShow && data.length !== 0">
          <scroller :on-refresh="refresh" :on-infinite="infinite" :noDataText="noDataText"  ref="my_scroller">
            <div class="fiter" v-if="fiterShow">
              <ul class="nav">
                <li v-for="(item,index) in tabs" :class="{active:index == num}" @click="tab(index)" :key="index">
                  {{item}}
                </li>
              </ul>
              <transition name="fade">
                <div class="tabCon" v-if="this.num != -1">
                  <div class="tabCon_nav" v-for='(itemCon,index) in tabContents' v-show=" index == num" :key="itemCon.id">
                    <p class="tabContents">
                      <span v-for="(item, index) in itemCon" @click="toggleIndex(index)" :class="fiter[num][index] === 1? 'active':''"  :key="item.id">{{item}}</span>
                    </p>
                    <p class="btn">
                      <span @click="reset" class="reset">重置</span>
                      <span @click="enter" class="enter">确认</span>
                    </p>
                  </div>
                </div>
              </transition>
              <div class="bg" v-for='(itemCon,index) in tabContents'  v-show="index == num" :key="itemCon.id" @click="close()"></div>
            </div>
            <ul @touchend="infiniteOne" ref='list'>
              <li v-for="(all, index) in data" :key="index">
                <div class="sele" v-if="all.type === 0">
                  <a class="img_box" href="javascript:;" @click="showlDialog(all.id)" v-if="all.id">
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
                <div class="alone" v-if="all.type === 1">
                  <div class="goods_img" v-if="all.code">
                    <p class="star" :class="all.ischoice === true ? 'current' : ''" @click="choice_goods(all.id, index, data)"></p>
                    <a href="javascript:;"  @click="showgDialog(all.id, all.code)">
                      <img v-lazy="{src: all.img, error: '/static/images/onerror260.jpg'}" :key="all.img">
                    </a>
                  </div>
                  <p v-if="all.code" class="goods_name">{{all.name}}</p>
                  <p v-if="all.pricediscount === all.price">
                    <span v-if="all.code" class="goods_price color333">￥{{all.pricediscount}}</span>
                  </p>
                  <p v-else>
                    <span v-if="all.code" class="goods_price ">￥{{all.pricediscount}}</span>
                    <del  v-if="all.code" class="goods_price_old">￥{{all.price}}</del>
                  </p>
                  <p v-if="all.code" class="choise">{{all.count}}款可选</p>
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
      search_name: '@$',
      // search_name: '1',
      tag: [
        {
          title: '软装方案',
          type: 1
        },
        {
          title: '热卖商品',
          type: 2
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
      noDataText: '',
      type: 0,
      tabs: ['户型', '价位', '分类'],
      tabContents: [
        ['0 ~ 80m²', '80 ~ 120m²', '120 ~ 150m²', '150 ~ 200m²', '200 ~ 300m²', '300m²以上'],
        ['0 ~ 5万', '5 ~ 10万', '10 ~ 15万', '15 ~ 20万', '20 ~ 25万', '25 ~ 30万', '30万以上'],
        ['品牌方案', '设计师方案']
      ],
      num: -1,
      fiter: [ // 创建一个二维数组，存放状态 0 否 1 是
        [], [], []
      ],
      fiterShow: false,
      fiterDown: false,
      HouseType: '',
      PriceArea: '',
      ptype: '',
      height: 0,
      position: 0
    }
  },
  created () {
    // 测试
    this.pageIndex = 1
    // this.searchFa(this.search_name)
  },
  methods: {
    infiniteOne (e) {
      this.position = this.$refs.my_scroller.getPosition().top
      this.height = this.$refs.list.offsetHeight
      console.log(this.position, this.height)
      if (this.height - this.position < 700) {
        // 处理滚动过快会出现不执行infinite的情况。
        this.infinite()
      }
    },
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
    backSearch () {
      this.data = []
      this.empty = 1
      this.isShow = true
      window.location.href = this.common.url + '/#/search'
    },
    refresh () {
      this.pageIndex = 1
      this.searchFa(this.search_name)
    },
    infinite () {
      let _this = this
      let data = {}
      _this.pageIndex++
      if (this.fiterDown) {
        data = {HouseType: this.HouseType, PriceArea: this.PriceArea, ptype: this.ptype, kw: this.search_name, type: 1, pageIndex: _this.pageIndex}
      } else {
        data = {kw: _this.search_name, type: _this.type, pageIndex: _this.pageIndex}
      }
      this.api.post('market/search', data, function (result) {
        if (!result.IsError) {
          if (_this.empty === 0) {
            let a = []
            let b = []
            if (result.Data.datas.length !== 0) {
              result.Data.datas.forEach(e => {
                if (e.type === 0) {
                  e.img = _this.sdk.bridge.resize(e.img, 480, 320)
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
    changeSG (i) {
      if (this.type === i) {
        this.type = 0
      } else {
        this.type = i
      }
      this.searchFa(this.search_name)
    },
    searchFa (name) {
      this.fiterDown = false
      this.data = []
      this.empty = 0
      this.isShow = false
      this.pageIndex = 1
      window.location.href = this.common.url + '/#/search'
      let _this = this
      if (!name) {
        name = '@$'
        alert('请输入搜索内容')
      }
      _this.search_name = name
      this.api.post('market/search', { kw: _this.search_name, type: _this.type, pageIndex: 1 }, function (result) {
        if (!result.IsError) {
          if (_this.empty === 0) {
            let a = []
            let b = []
            if (result.Data.datas.length !== 0) {
              result.Data.datas.forEach(e => {
                if (e.type === 0) {
                  e.img = _this.sdk.bridge.resize(e.img, 480, 320)
                  a.push(e)
                } else {
                  b.push(e)
                }
              })
              _this.data = _this.mergeDate(a, b, _this.data)
            }
            if (result.Data.tabs.length !== 0) {
              _this.tabContents[0] = result.Data.tabs[0].filters
              _this.tabContents[1] = result.Data.tabs[1].filters
              _this.fiterShow = true
            } else {
              _this.fiterShow = false
            }
            console.log(_this.data)
            _this.ShowNow()
          }
        }
      })
    },
    mergeDate (a, b, c) {
      // debugger
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
    },
    toggleIndex (index) { // 复选条件
      if (this.fiter[this.num][index] === 0 || typeof this.fiter[this.num][index] === 'undefined') {
        this.$set(this.fiter[this.num], index, 1)
      } else {
        this.$set(this.fiter[this.num], index, 0)
      }
    },
    reset () { // 重置
      this.fiter.forEach((e, i) => {
        e.forEach((el, j) => {
          if (el === 1) {
            this.$set(this.fiter[i], j, 0)
          }
        })
      })
    },
    enter () { // 确认筛选
      let ht = []
      let pa = []
      let ty = 0
      this.fiterDown = true
      const _this = this
      this.fiter.forEach((e, i) => {
        e.forEach((el, j) => {
          if (el === 1) {
            if (i === 0) {
              ht.push(this.tabContents[i][j])
            }
            if (i === 1) {
              pa.push(this.tabContents[i][j])
            }
            if (i === 2) {
              if (j === 0) {
                if (el === 1) {
                  ty = 1
                } else {
                  ty = 0
                }
              }
              if (j === 1) {
                if (el === 1 && ty === 1) {
                  ty = 0
                } else {
                  ty = 2
                }
              }
            }
          }
        })
      })
      this.HouseType = ht
      this.PriceArea = pa
      this.ptype = ty
      this.pageIndex = 1
      let data = {HouseType: ht, PriceArea: pa, ptype: ty, kw: this.search_name, type: 1, pageIndex: 1}
      this.api.post('market/search', data, function (result) {
        if (!result.IsError) {
          _this.data = result.Data.datas
          _this.data.forEach(e => {
            e.img = _this.sdk.bridge.resize(e.img, 480, 320)
          })
        }
      })
      _this.reset()
      _this.close()
    },
    // tab 切换
    tab (index) {
      this.num = index
    },
    // 关闭背景层
    close () {
      this.num = -1
    },
    searchF (name) {
      this.type = 0
      this.searchFa(name)
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
  padding-top: 0.78125rem;
  .box{
    span{
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
    span:first-child{
      margin-left: .878906rem;
    }
    .current{
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
  overflow: hidden;
  ._v-container{
    height: auto;
  }
  ul{
    overflow: hidden;
    li{
      float: left;
      margin:0 10/102.4rem 0;
      position: relative;
      text-align: center;
      .sele{
        width: 8.5rem;
        height: 7.080078rem;
        text-align: left;
        margin-bottom:  64/102.4rem;
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
          width: 8.5rem;
          height: 5.9375rem;
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
        margin-bottom:  64/102.4rem;
        img{
          margin: 0;
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
.fiter{
  width: 100%;
  position: relative;
  z-index: 999;
  .nav{
    width: 100%;
    margin: 0 auto 0;
    font-size: 24/102.4rem;
    box-shadow: 0 5px 8px rgba(183,183,183,.3);
      text-align: center;
    li{
      float: none;
      display: inline-block;
      width: 100/102.4rem;
      background: url('/static/images/fiter-off.png') no-repeat right center;
      background-size:30%;
      line-height: 100/102.4rem;
      height: 100/102.4rem;
      text-align: left;
      margin: 0 45/102.4rem;
    }
    .active{
      color: red;
      background: url('/static/images/fiter.png') no-repeat right center;
      background-size:30%;
    }
  }
  .tabCon{
    position: absolute;
    top: 100%;
    width: 100%;
    background-color: white;
    border-top: 1px solid rgba(204, 204, 204, .5);
    z-index: 999;
    .tabCon_nav{
      .tabContents{
        margin-left: 569/102.4rem;
        width: 900/102.4rem;
        span{
          margin-top: 70/102.4rem;
          font-size: 22/102.4rem;
          line-height: 22/102.4rem;
          width: 280/102.4rem;
          display: inline-block;
        }
        .active{
          color:#EB4D3D;
        }
        .nav_all{
          font-size: 26/102.4rem;
          line-height: 26/102.4rem;
        }
      }
      .tabContents:nth-child(2){
        margin-bottom: 70/102.4rem;
      }
    }
    .btn{
      display: flex;
      text-align: center;
      font-size: 24/102.4rem;
      margin-top: 66/102.4rem;
      span{
        flex: 1;
        line-height: 96/120.4rem;
        border-top: 1px solid #F4F4F4;
      }
      .enter{
        background-color: #F4F4F4;
      }
    }
  }
  .bg{
    height: calc(100vh);
    position: absolute;
    top: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 998
  }
}
</style>
