<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.homeSwiper,.mask{
  width:100%;
  height: 100vh;
}
.homeSwiper{
  position:relative;
}
.mask{
  background:rgba(26,26,26,.6);
  position:absolute;
  left:0;
  top:0;
  z-index:2;
  padding:100/102.4rem 80/102.4rem;
  box-sizing:border-box;
}
.homeTips{
  color:#fff;
  text-decoration: none;
  p{
    font-size:56/102.4rem;
    margin-bottom:15/102.4rem;
    span{margin-right:10/102.4rem;}
  }
  p:first-child{
    &::before{
      content:'';
      display:block;
      width:80/102.4rem;
      height:6/102.4rem;
      background:#fff;
      margin-bottom:50/102.4rem;
    }
  }
  .maskBtn{
    width:245/102.4rem;
    height:95/102.4rem;
    line-height:95/102.4rem;
    font-size:28/102.4rem;
    display:inline-block;
    border-radius:4px;
    border:1px solid #fff;
    background:rgba(255,255,255,.1);
  }
  .useImg,.maskTxt{
    text-align:center;
  }
  .useImg{
    transform: scale(0.6);
    margin-bottom:40/102.4rem;
  }
  .maskTxt{
    font-size:36/102.4rem;
  }
  .fullScreenSecond{
    z-index:3;
  }
  .fullScreenThree{
    z-index:4;
  }
}
.mask{
  .maskTool{
    text-align:center;
    margin-top:350/102.4rem;
  }
}
.fullScreen{
  .useImg{
    height:300/102.4rem;
  }
  .maskTool{
    margin-top:0
  }
  .maskTxt{
    margin:60/102.4rem auto 120/102.4rem;
  }
  .homeTips{
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>

<template>
  <div>
    <div class="homeSwiper">
      <div class="mask" v-if="isShowFirst">
        <div class="homeTips" @click="showFirstBtn()">
          <p>巍联集团旗下</p>
          <p><span>HarborHouse</span><span>Tao</span><span>INK+IVY</span><span>MADISONPARK</span></p>
          <p>全球线上线下同步有售</p>
          <div class="maskTool">
            <span class="maskBtn">立即体验</span>
          </div>
        </div>
      </div>
      <div class='mask fullScreen fullScreenSecond' v-if="isShowSecond">
        <div class="homeTips" @click="showSecondBtn()">
          <div class="useImg">
            <img src="/static/images/usetip.png" />
          </div>
          <div class="maskTxt">滑动图片查看更多灵感居室内容</div>
          <div class="maskTool">
            <span class="maskBtn">我知道了</span>
          </div>
        </div>
      </div>
      <div class='mask fullScreen fullScreenThree' v-if="isShowThree">
        <div class="homeTips" @click="showThreeBtn()">
          <div class="useImg">
            <img src="/static/images/use.png" />
          </div>
          <div class="maskTxt">点击图片查看灵感居室对应商品</div>
          <div class="maskTool">
            <span class="maskBtn">我知道了</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../../js/bus.js'
export default {
  name: 'tipLayer',
  components: {
  },
  data () {
    return {
      playFlag: false,
      isShowFirst: true,
      isShowSecond: false,
      isShowThree: false,
      swiperMessage: ''
    }
  },
  created () {
    let _this = this
    eventBus.$on('todo', function (params) {
      _this.swiperMessage = params
    })
  },
  beforeDestroy () {
    eventBus.$off('todo')
  },
  methods: {
    showFirstBtn () {
      this.isShowFirst = false
      this.isShowSecond = true
    },
    showSecondBtn () {
      this.isShowSecond = false
      this.isShowThree = true
    },
    showThreeBtn () {
      let _this = this
      this.isShowThree = false
      this.playFlag = true
      eventBus.$emit('playFlagVal', true)
      if (_this.swiperMessage) {
        _this.swiperMessage.init()
      }
    }
  }
}
</script>
