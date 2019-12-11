<template>
  <div>
    <transition name="fade">
      <div class="all" v-if="isShow">
        <ul>
          <li v-for="(all, index) in data" :key="all.id">
            <div class="sele">
              <a  href="javascript:;" @click="showlDialog(all.id)">
                <img v-lazy="{src: all.img, error: '/static/images/onerrornone.jpg'}" :key="all.img">
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
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
export default {
  name: 'Panoranma',
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
    _this.sdk.bridge.saveTrace('choice360Project', 0)
    // this.common.getAjaxData('/all.com/', this.data, this.ShowNow)
    this.api.post('market/programme/choice', {type: 1}, function (result) {
      if (!result.IsError) {
        _this.data = result.Data
        _this.data.forEach(e => {
          e.img = _this.sdk.bridge.resize(e.img, 460, 320)
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
    // 显示隐藏切换
    showlDialog (id) {
      // window.location.href = 'http://0.0.0.0:8081/#/collectDetails/' + id
      this.sdk.bridge.showInDialog(this.common.url + '/#/collectDetails/' + id)
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
    ul{
      overflow: hidden;
      li{
        float: left;
        margin:0 10/102.4rem  64/102.4rem;
        .sele{
          position: relative;
          width: 8.5rem;
          height: 7.080078rem;
          a{
            display: block;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
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
