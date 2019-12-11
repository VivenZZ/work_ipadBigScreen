<template>
  <div class="problem">
    <div class="header">
      <div class="back" @click="back()">
        使用帮助
      </div>
    </div>
    <div class="content">
      <div class="help" v-for="(item, index) in data" :key="index">
        <img class="help_item" :src="item.img" @click="showVideo(index)" alt="">
      </div>
    </div>
    <div class="hlep_bg" v-if="show">
      <div class="video_box">
        <video width="100%" height="100%" :src="data[i].video"  controls="controls" autoplay="autoplay">
        </video>
        <img class="help_icon" @click="hideVideo()" src="/static/images/closed.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Help',
  data () {
    return {
      i: 4,
      show: false,
      data: [
        {
          img: '/static/images/help/1.jpg',
          video: '/static/images/help/1.mp4'
        },
        {
          img: '/static/images/help/2.jpg',
          video: '/static/images/help/2.mp4'
        },
        {
          img: '/static/images/help/3.jpg',
          video: '/static/images/help/3.mp4'
        },
        {
          img: '/static/images/help/6.jpg',
          video: '/static/images/help/6.mp4'
        },
        {
          img: '/static/images/help/4.jpg',
          video: '/static/images/help/4.mp4'
        },
        {
          img: '/static/images/help/5.jpg',
          video: '/static/images/help/5.mp4'
        }
      ]
    }
  },
  created () {
    this.sdk.bridge.saveTrace('memberQuestion', 0)
  },
  methods: {
    back () { // 返回上一级路由
      this.sdk.bridge.back()
    },
    showVideo (i) {
      this.i = i
      this.show = true
    },
    hideVideo () {
      this.show = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.header{
  margin:130/102.4rem 0 .78125rem;
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
    font-family: PingFangSC-Semibold, sans-serif;
  }
}
.hlep_bg{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  .video_box{
    position: absolute;
    width: 90%;
    height: 70%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: black;
    .help_icon{
      position: absolute;
      width: .666667rem;
      height: .666667rem;
      top: .266667rem;
      right: .266667rem;
    }
  }
}
.problem{
  .content{
    margin: 0 .830078rem;
    border-top: 1px solid rgba(204, 204, 204, .5);
    font-size: .234375rem;
    line-height: .351563rem;
    .help{
      .help_item{
        width: 100%;
        margin-bottom: .306667rem;
      }
    }
  }
}
</style>
