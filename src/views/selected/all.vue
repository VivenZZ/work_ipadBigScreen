<template>
  <div>
    <transition name="fade">
      <div class="all" v-if="isShow">
        <ul>
          <li v-for="(all, index) in data" :key="all.s">
            <div class="sele" v-if="all.type === 0">
              <a href="javascript:;" @click="showlDialog(all.id)" v-if="all.img">
                <img v-lazy="all.img" :alt="all.name">
                <img class="tag_3d" v-if="all.tag == '3d'" src="/static/images/3D_tag.png" alt="">
              </a>
              <p>
                <span class="speic">{{all.speic}}</span>
                <span class="area" v-if="all.area">约{{all.number}}㎡</span>
              </p>
              <p>
                <span class="name">{{all.name}}</span>
                <span class="describe">{{all.describe}}</span>
                <span class="label" v-if="all.label">{{all.label}}</span>
              </p>
              <div v-if="all.ischoice !== undefined" class="ct" :class="all.ischoice === true ? 'current' : ''"  @click="choice(all.id, index)"></div>
            </div>
            <div class="alone" v-else>
              <p v-if="all.ischoice !== undefined" class="star" :class="all.ischoice === true ? 'current' : ''" @click="choice_goods(all.id, index, data)"></p>
              <img v-if="all.img" @click="showgDialog(all.id)" v-lazy="all.img" :alt="all.name">
            </div>
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
// import Vue from 'vue'
// import VueScroller from 'vue-scroller'
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
// import Alert from '@/components/alertModule'
// import axios from 'axios'
// import common from '../../../static/js/commonFun'
// Vue.use(VueScroller)
export default {
  name: 'All',
  components: {
    FulfillingBouncingCircleSpinner
    // Alert
  },
  data () {
    return {
      data: [],
      template: {
        code: '',
        name: '',
        tag: '',
        speic: '',
        describe: '',
        lable: '',
        type: 0
      },
      template1: {
        code: '',
        name: '',
        tag: '',
        speic: '',
        describe: '',
        lable: '',
        type: 1
      },
      isShow: false,
      isShowing: false,
      // 详情数据
      code: '',
      detailedDatas: {}
    }
  },
  created () {
    let _this = this
    _this.sdk.bridge.saveTrace('choiceGoods', 0)
    // this.common.getAjaxData('/all.com/', this.data, this.ShowNow)
    this.api.post('market/programme/choice', {type: 0}, function (result) {
      console.log(111)
      if (!result.IsError) {
        let a = []
        let b = []
        result.Data.forEach(e => {
          if (e.type === 0) {
            a.push(e)
          } else {
            b.push(e)
          }
        })
        _this.data = _this.mergeDate(a, b, _this.data)
        _this.ShowNow()
      }
    })
  },
  methods: {
    choice_goods (id, index, data) {
      if (data[index].ischoice === true) {
        this.api.post('market/choice/cancel', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
            console.log(1111)
          }
        })
        data[index].ischoice = false
      } else {
        this.api.post('market/choice', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
            console.log(2222)
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
    },
    alertModule (id) {
      this.common.alertModule(id)
    },
    // 显示隐藏切换
    showgDialog (id) {
      // window.location.href = 'http://0.0.0.0:8081/#/goodsDetails/' + id
      this.sdk.bridge.showInDialog(this.common.url + '/#/goodsDetails/' + id)
    },
    showlDialog (id) {
      // window.location.href = 'http://0.0.0.0:8081/#/collectDetails/' + id
      this.sdk.bridge.showInDialog(this.common.url + '/#/collectDetails/' + id)
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
    ul{
      overflow: hidden;
      li{
        float: left;
        margin: 0 10/102.4rem;
        .sele{
          position: relative;
          width: 8.5rem;
          height: 7.080078rem;
          a{
            display: block;
            position: relative;
            img{
              width: 8.5rem;
              height: 5.9375rem;
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
              font-size: 24/102.4rem;
              line-height: 24/102.4rem;
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
              font-size: 20/102.4rem;
              color: #333;
              margin-top: 20/102.4rem;
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
          height: 5.46875rem;
          position: relative;
          img{
            margin: .976563rem .292969rem;
            width: 3.515625rem;
            height: 3.515625rem;
          }
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
</style>
