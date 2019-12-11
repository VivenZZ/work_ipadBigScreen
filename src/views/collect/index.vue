<template>
  <div>
    <div class="fiter">
      <ul class="nav">
        <li v-for="(item,index) in tabs" :class="{active:index == num}" @click="tab(index)" :key="item.id">
          {{item}}
        </li>
      </ul>
      <transition name="fade">
        <div class="tabCon" v-if="this.num != -1">
          <div class="tabCon_nav" v-for='(itemCon,index) in tabContents' v-show=" index == num" :key="index">
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
      <div class="bg" v-for='(itemCon,index) in tabContents'  v-show="index == num" :key="index" @click="close()"></div>
    </div>
    <transition name="fade">
      <div class="all" v-if="isShow">
        <scroller :on-infinite="infinite" :noDataText="noDataText"  ref="my_scroller">
          <ul>
            <li v-for="(all, index) in data" :key="index" :class="index%2 === 0 ? 'l': 'r'">
              <a href="javascript:;" @click="showlDialog(all.id)">
                <img v-lazy="{src: all.img, error: '/static/images/onerrornone.jpg'}" :alt="all.name" :key="all.img">
                <img class="tag_3d" v-if="all.tag == '3d'" src="/static/images/3D_tag.png" alt="">
              </a>
              <p>
                <span class="speic">{{all.speic}}</span>
                <span class="area">约{{all.number}}㎡</span>
              </p>
              <p>
                <span class="name">{{all.name}}</span>
                <span class="describe">{{all.describe}}</span>
                <span class="label" v-if="all.label">{{all.label}}</span>
              </p>
              <div class="ct" :class="all.ischoice === true ? 'current' : ''"  @click="choice(all.id, index)"></div>
              <img v-if="index < 3" class="new" src="/static/images/new.png" alt="" srcset="">
            </li>
          </ul>
        </scroller>
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
import Vue from 'vue'
import VueScroller from 'vue-scroller'
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
Vue.use(VueScroller)
export default {
  name: 'Collect',
  components: {
    FulfillingBouncingCircleSpinner
  },
  data () {
    return {
      data: [],
      isShow: false,
      isShowing: false, // 详情的显示隐藏
      detailedDatas: {}, // 传递的数据
      noDataText: '-- 已经没有更多方案了 --',
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
      pageIndex: 0,
      pageData: {}, // api参数
      offset: 0
    }
  },
  created () {
    // this.common.getAjaxData('/all.com/', this.data, this.ShowNow)
    // 方案页面接口参数配置
    /**
     * /market/programme/list 请求地址
     * HouseType 户型多选 array => string
     * PriceArea 价格多选 array => string
     * type 类型 0.全部 1.灵感居室 2.创意方案
     * pageIndex 分页
     * pageSize 个数
     */
    // {HouseType:["",""],PriceArea:["","",""],type:0,pageIndex:1,pageSize:10}
    let _this = this
    _this.sdk.bridge.saveTrace('projectManageMain', 0)
    _this.pageIndex = 1
    _this.pageData = { pageIndex: _this.pageIndex, pageSize: 10, type: 0 }
    this.api.post('market/programme/list', _this.pageData, function (result) {
      if (!result.IsError) {
        _this.tabContents[0] = result.Data.tabs[0].filters
        _this.tabContents[1] = result.Data.tabs[1].filters
        _this.data = result.Data.data
        _this.data.forEach(e => {
          if (e.img.indexOf('jiaeda') === -1) {
            e.img = _this.sdk.bridge.resize(e.img, 480, 320)
          }
        })
        _this.ShowNow()
      }
    })
  },
  methods: {
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
      _this.pageIndex = 1
      _this.pageData = { HouseType: ht, PriceArea: pa, pageIndex: _this.pageIndex, pageSize: 10, type: ty }
      this.api.post('market/programme/list', _this.pageData, function (result) {
        if (!result.IsError) {
          _this.data = result.Data.data
          _this.data.forEach(e => {
            if (e.img.indexOf('jiaeda') === -1) {
              e.img = _this.sdk.bridge.resize(e.img, 480, 320)
            }
          })
        }
      })
      _this.reset()
      _this.close()
    },
    ShowNow () {
      this.isShow = true
    },
    // 下拉刷新
    // refresh (done) {
    //   let _this = this
    //   this.api.post('/market/programme/list', { pageIndex: 1, pageSize: 10, type: 1 }, function (result) {
    //     if (!result.IsError) {
    //       _this.data = result.Data.data
    //       _this.$refs.my_scroller.finishPullToRefresh()
    //       _this.ShowNow()
    //     }
    //   })
    // },
    // 上拉加载
    infinite () {
      let _this = this
      _this.pageIndex++
      _this.pageData.pageIndex = _this.pageIndex
      this.api.post('market/programme/list', _this.pageData, function (result) {
        if (!result.IsError) {
          result.Data.data.forEach(e => {
            e.img = _this.sdk.bridge.resize(e.img, 480, 320)
            _this.data.push(e)
          })
          if (result.Data.data.length === 0) { // 当数据小于10条的时候取消加载 显示nodatatext
            _this.$refs.my_scroller.finishInfinite(true)
          } else {
            _this.$refs.my_scroller.finishInfinite(false)
          }
        }
      })
    },
    // tab 切换
    tab (index) {
      this.num = index
    },
    // 关闭背景层
    close () {
      this.num = -1
    },
    // 显示隐藏切换
    showlDialog (id) {
      // window.location.href = 'http://localhost:8081/#/collectDetails/' + id
      this.sdk.bridge.saveTrace('pojectManageProject', 0)
      this.sdk.bridge.showInDialog(this.common.url + '/#/collectDetails/' + id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .fiter{
    width: 100%;
    position: relative;
    z-index: 999;
    .nav{
      width: 100%;
      padding-top: 0.68359375rem;
      font-size: 24/102.4rem;
      box-shadow: 0 5px 8px rgba(183,183,183,.3);
        text-align: center;
      li{
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
  .all{
    width:96%;
    margin: 0 auto;
    position: relative;
    height: calc(100vh - 90px);
    ._v-container{
      height: auto;
    }
    ul{
      overflow: hidden;
      .l{
        float: left;
      }
      .r{
        float: right;
      }
      li{
        margin:0 0  64/102.4rem;
        width: 912/102.4rem;
        height: 790/102.4rem;
        position: relative;
        a{
          display: block;
          position: relative;
          overflow: hidden;
          width: 912/102.4rem;
          height: 608/102.4rem;
          img{
            width: 912/102.4rem;
            height: 608/102.4rem;
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
    }
    .ct{
      background: url('/static/images/star1.png') no-repeat center center;
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
    .new{
      position: absolute;
      top: 0;
      left: 0;
      width: .664063rem;
      height: .664063rem;
    }
  }
</style>
