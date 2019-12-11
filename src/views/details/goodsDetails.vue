<template>
  <div>
    <transition name="fade">
      <div class="goodsDetails" v-if="isShow">
        <div class="top">
          <!-- <span class="back"></span> -->
          <span @click="share()" class="share"></span>
        </div>
        <div class="h100"></div>
        <div class="banner">
          <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide  v-for="(pic, index) in data[i].Gallerys" :key="index">
                <img  v-lazy="{src: pic.Img_Url, error: '/static/images/onerror480.jpg'}" @click="enlarge()" :key="pic.Img_Url">
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
        </div>
        <div class="content">
          <div class="info">
            <div class="left">
              <p class="name">{{data[i].Title}}</p>
              <p class="mt20">
                <span class="price" v-if="data[i].activity.IsActivity === 0">￥{{data[i].Price}} </span>
                <span class="price" v-if="data[i].activity.IsActivity === 1">￥{{data[i].activity.ActivityPrice}}</span>
                <del class="oldPrice" v-if="data[i].activity.IsActivity === 1">￥{{data[i].Price}}</del>
              </p>
            </div>
            <div class="right">
              <div class="text-r">
                <span class="stock mr8">编号{{data[i].Code}}</span>
                <!-- <span class="stock">库存{{data[i].stock}}</span> -->
              </div>
              <div class="mt20 posR_x dsf">
                <span class="psz">配送至</span>
                <group>
                  <x-address title=""   @on-hide="logHide" @on-show="logShow" v-model="value" :list="addressData" :placeholder="defultAddress"></x-address>
                </group>
              </div>
            </div>
          </div>
          <ul class="mt40 mb20">
            <li class="mr25">数量</li>
            <li>
              <div class="ov">
                <a class="btn fl" @click="reduce()"><img src="/static/images/reduce.png" alt=""></a>
                <input type="text" readonly unselectable="on"  class="number fl" :value="quantity"/>
                <a class="btn fl" @click="add()"><img  src="/static/images/add.png" alt=""></a>
              </div>
            </li>
          </ul>
          <ul>
            <li class="mr25">规格</li>
            <li>
              <span v-for="(data, index) in Attrs.PSize" :class="info.pNumber === index ? 'current': ''"  @click="pcurrent(index)"  :key="data.id">{{data}}</span>
            </li>
          </ul>
          <ul>
            <li class="mr25">色款</li>
            <li class="maxw">
              <!-- <span class="maxw" v-for="(data, index) in Attrs.Color" :class="info.cNumber === index ? 'current': ''"  @click="ccurrent(index)"  :key="data.id">{{data}}</span> -->
              <img  v-for="(data, index) in Attrs.Color" :class="info.cNumber === index ? 'current': ''"  @click="ccurrent(index, codes[index])"  :key="index" :src="data" alt="">
            </li>
          </ul>
        </div>
        <div class="details_img" v-html="description">
        </div>
        <div class="h"></div>
        <p :class="btnshow ? '':'btnHide'" class="jion" @click="joinCart(data[i].Code)">{{enterMsg}}</p>
      </div>
    </transition>
    <div class="loading" v-if="!isShow">
      <fulfilling-bouncing-circle-spinner
        :animation-duration="4000"
        :size="60"
        color="#EB4D3D"
      />
    </div>
    <tips v-if="tipsShow" :msg="tipsData" />
  </div>
</template>
<script>
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Tips from '@/components/tips'
import {Group, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name} from 'vux'
export default{
  name: 'goodsDetails',
  components: {
    FulfillingBouncingCircleSpinner,
    swiper,
    swiperSlide,
    Tips,
    XAddress,
    Group
  },
  data () {
    return {
      tipsShow: false,
      tipsData: '不能再减少了',
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      description: '',
      enterMsg: '加入购物车',
      data: [
        {
          Gallerys: []
        }
      ],
      id: '',
      i: 0, // 当前选中第一个
      quantity: 1,
      Attrs: {
        PSize: [],
        Color: []
      },
      codes: [],
      info: {
        pNumber: -1,
        cNumber: -1,
        activeP: '',
        activeC: ''
      },
      UnionID: '',
      code: -1,
      isShow: false,
      city: '',
      addressData: ChinaAddressV4Data,
      value: [],
      defultAddress: '',
      btnshow: true
    }
  },
  watch: {
    '$route' (to, from) {
    }
  },
  methods: {
    getName (value) {
      return value2name(value, ChinaAddressV4Data)
    },
    getStock () {
      let _this = this
      let dataObject = {prov: this.value[0], city: this.value[1], county: this.value[2], items: [{sku: _this.code, bcid: _this.UnionID, quantity: _this.quantity}]}
      _this.api.post('Cart/CheckStockForPad', dataObject, function (res) {
        _this.btnshow = true
      }, function (res) {
        _this.btnshow = false
      })
    },
    logHide (str) {
      let _this = this
      let dataObject = {prov: this.value[0], city: this.value[1], county: this.value[2], goodsId: _this.id}
      _this.getGoodsSku(dataObject, _this)
    },
    logShow (str) {
      console.log('on-show')
    },
    showTips (m) {
      let _this = this
      if (!this.tipsShow) {
        this.tipsData = m
        this.tipsShow = true
        setTimeout(function () {
          _this.tipsShow = false
        }, 2000)
      }
    },
    enlarge () {
      // window.location.href = 'http://0.0.0.0:8081/#/goodsImage/' + this.id
      this.sdk.bridge.openNewPage(this.common.url + '/#/goodsImage/' + this.id, 'nobar', '1111')
    },
    share () {
      // let details = this.data[this.i]
      // let url = ''
      // let qrcodeUrl = ''
      // let _this = this
      // this.api.post('market/share/goods', {bcid: this.UnionID, sku: details.Code}, function (result) {
      //   if (!result.IsError) {
      //     url = result.Data
      //     qrcodeUrl = _this.api.qrcode(url)
      //     _this.sdk.bridge.shareData(details.Title, details.Title, details.Gallerys[0].Img_Url, url, qrcodeUrl)
      //   }
      // })
      // mp分享
      let details = this.data[this.i]
      let qrcodeUrl = ''
      let _this = this
      this.api.shareUrl(details.GoodsID, details.Code, function (url) {
        qrcodeUrl = _this.api.qrcode(url)
        _this.sdk.bridge.shareData(details.Title, details.Title, details.Gallerys[0].Img_Url, url, qrcodeUrl)
      })
    },
    joinCart (id) {
      let _this = this
      _this.enterMsg = '正在加入购物车...'
      let dataObject = {prov: this.value[0], city: this.value[1], county: this.value[2], items: [{sku: id, bcid: _this.UnionID, quantity: _this.quantity}]}
      _this.api.post('Cart/CheckStockForPad', dataObject, function (res) {
        _this.api.service('mktcart/AddCarts', {skus: [{Sku: id, Quantity: _this.quantity}], displayPos: 1}, function (result) {
          if (!result.IsError) {
            _this.enterMsg = '加入购物车成功'
            _this.sdk.bridge.notifCartNumChange()
            setTimeout(function () {
              _this.enterMsg = '加入购物车'
              _this.sdk.bridge.closeDialog(window.location.href)
            }, 1000)
          }
        }, function (res) {
          _this.showTips('加入购物车失败')
          _this.enterMsg = '加入购物车'
        })
      }, function (res) {
        _this.showTips('库存不足')
        _this.enterMsg = '加入购物车'
      })
    },
    pcurrent (i) {
      if (this.info.pNumber === i) {
        this.info.pNumber = -1
        this.info.cNumber = -1
        this.code = -1
        this.info.activeC = ''
        this.info.activeP = ''
      } else {
        this.info.pNumber = i
        this.info.cNumber = -1
        this.code = 0
        this.info.activeC = ''
        this.info.activeP = this.Attrs.PSize[i]
        this.Attrs.Color = []
        this.codes = []
        this.data.forEach(r => {
          if (r.Attrs.PSize === this.info.activeP) {
            this.Attrs.Color.push(r.Gallerys[0].Img_Url)
            this.codes.push(r.Code)
          }
        })
      }
    },
    ccurrent (i, code) {
      if (this.info.cNumber === i) {
        this.info.cNumber = -1
        this.code = 0
        this.info.activeC = ''
      } else {
        this.info.cNumber = i
        this.info.activeC = this.Attrs.Color[i]
        // if (this.info.pNumber !== -1) {
        //   this.data.forEach((e, i) => {
        //     if (e.Attrs.PSize === this.info.activeP && e.Gallerys[0].Img_Url === this.info.activeC) {
        //       this.i = i
        //       this.code = this.data[i].Code
        //     }
        //   })
        // }
        if (this.info.pNumber !== -1) {
          this.data.forEach((e, i) => {
            console.log(e.Code)
            if (e.Code === code) {
              this.i = i
              this.code = code
            }
          })
        }
      }
    },
    reduce () {
      if (this.quantity > 1) {
        this.quantity--
      } else {
        this.showTips('不能减少了')
      }
    },
    add () {
      if (this.quantity < 999) {
        if (this.data[this.i].isStock === 1) {
          if (this.data[this.i].stock > this.quantity) {
            this.quantity++
          } else {
            this.showTips('库存不足了')
          }
        }
        if (this.data[this.i].isStock === 2) {
          this.quantity++
        }
      }
    },
    getGoodsSku (obj, _this) {
      _this.Attrs.Color = []
      _this.Attrs.PSize = []
      _this.api.post('market/product/detail', obj, function (result) {
        if (!result.IsError) {
          _this.UnionID = result.Data.Goods.UnionID
          _this.data = result.Data.SKUList
          _this.description = result.Data.Goods.Description
          _this.data.forEach(r => {
            _this.Attrs.PSize.push(r.Attrs.PSize)
            // _this.Attrs.Color.push(r.Attrs.Material + '/' + r.Attrs.Color)
            if (r.Code === _this.code) {
              _this.info.activeP = r.Attrs.PSize
              _this.info.activeC = r.Gallerys[0].Img_Url
            }
          })
          _this.Attrs.PSize = Array.from(new Set(_this.Attrs.PSize)) // 去重
          _this.data.forEach(r => {
            if (r.Attrs.PSize === _this.info.activeP) {
              _this.Attrs.Color.push(r.Gallerys[0].Img_Url)
              _this.codes.push(r.Code)
            }
          })
          _this.Attrs.PSize.forEach((e, i) => {
            if (_this.info.activeP === e) {
              _this.info.pNumber = i
            }
          })
          _this.Attrs.Color.forEach((e, i) => {
            if (_this.info.activeC === e) {
              _this.info.cNumber = i
            }
          })
          _this.data.forEach((e, i) => {
            if (e.Attrs.PSize === _this.info.activeP && e.Gallerys[0].Img_Url === _this.info.activeC) {
              _this.i = i
              _this.code = _this.data[i].Code
            }
          })
          _this.isShow = true
          _this.getStock()
        }
      })
    }
  },
  created () {
    let _this = this
    this.id = this.$route.params.id
    this.code = this.$route.params.code
    // 测试
    // let obj = {goodsid: this.id}
    // let defaultCode = ['330000', '330100', '330106']
    // this.defultAddress = this.getName(defaultCode)
    // this.getGoodsSku(obj, _this)
    this.sdk.bridge.getLocation(function (res) {
      let defaultCode = [String(res.prov), String(res.city), String(res.country)]
      _this.value = [res.prov, res.city, res.country]
      _this.defultAddress = _this.getName(defaultCode)
      let dataObject = {prov: res.prov, city: res.city, county: res.country, goodsId: _this.id}
      _this.getGoodsSku(dataObject, _this)
    })
  }
}
</script>
<style lang="less">
  .details_img{
    line-height: .533333rem;
    padding:  .533333rem;
    box-sizing: border-box;
    text-align: justify;
    img{
      width: 100%;
    }
  }
</style>
<style lang="less">
.dsf{
  display: flex;
  align-items: center;
}
.dsf>div{
  flex: auto;
}
.psz{
  flex: 1;
  text-align: right;
  color: #999;
  font-size: 24/102.4rem  !important;
}
.weui-cell__hd{
  text-align: right;
}
.vux-cell-placeholder{
  color: #333 !important;
}
.vux-popup-mask{
  background: rgba(0,0,0,.7) !important;
  // border: 3px solid white;
  box-sizing: border-box;
}
.weui-cells{
  margin-top: 0 !important;
  font-size: 24/102.4rem  !important;
  width: 100%;
}
.weui-cells:before,.weui-cells:after{
  border: none  !important;
}
.vux-cell-value{
  color: #333 !important;
}
.posR_x{
  position: relative;
  padding-right: 10px;
  box-sizing: border-box;
}
.weui-cell_access .weui-cell__ft:after{
  display: none !important;
}
.posR_x:after {
    content: " ";
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 2px
}
</style>

<style lang="less" scoped>
.goodsDetails{
  .h{
    width: 100%;
    height: 0.957031rem;
  }
  .jion{
    font-size: .332031rem;
    height: .957031rem;
    line-height: .957031rem;
    color: #fff;
    background-color: #333;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
  }
  .btnHide{
    pointer-events: none;
    background-color: #ccc;
    color: rgba(255,255,255,.5);
  }
  .content{
    width: 8.789063rem;
    margin: .488281rem auto 0;
    .ov{
      overflow: hidden;
    }
    input{
      color: #333;
      text-align: center;
    }
    .number{
      margin: 0 4/102.4rem;
      width: 130/102.4rem;
      height: 50/102.4rem;
      border: #999 1px solid;
      -moz-user-select: none;
      -webkit-user-select: none;
    }
    .btn{
      display: inline-block;
      width: 50/102.4rem;
      height: 50/102.4rem;
      border: #999 1px solid;
      border-radius: 5px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .mt40{
      margin-top: 40/102.4rem;
    }
    ul{
      overflow: hidden;
      li{
        font-size: 24/102.4rem;
        color: #333;
        line-height: 42/102.4rem;
        max-width: 600/102.4rem;
        float: left;
        span{
          overflow: hidden;
          text-overflow:ellipsis; // 文本溢出显示省略号
          white-space:nowrap; // 文本不会换行（单行文本溢出）
          display: inline-block;
          padding: 0 5/102.4rem;
          border: 1px solid #999;
          border-radius: 3px;
          max-width: 100%;
          margin: 0 15/102.4rem 15/102.4rem 0;
        }
        .maxw{
          max-width: 1.953125rem;
        }
        img{
          width: 100/102.4rem;
          height: 100/102.4rem;
          border: 1px solid rgba(0, 0, 0, 0);
          margin: 0 15/102.4rem 15/102.4rem 0;
        }
        .current{
          color: #EB4D3D;
          border-color: #EB4D3D;
        }
      }
      .mr25{
        margin-right: 25/102.4rem;
      }
    }
    .info{
      overflow: hidden;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .mt20{
      margin-top: .195313rem;
      margin-bottom: .195313rem;
    }
    .left{
      width: 40%;
      float: left;
      color: #333;
      font-size: .195313rem;
    }
    .right{
      width: 60%;
      float: right;
      line-height: 24/102.4rem;
      .text-r{
        text-align: right;
      }
    }
    .name{
      font-size: .332031rem;
      line-height: .390625rem;
      color: #333;
      font-weight: bold;
    }
    .price{
      color: #CF4D3D;
      font-size: 28/102.4rem;
      font-family: PingFangSC-Semibold, sans-serif;
    }
    .stock{
      display: inline-block;
      color: #999;
      font-size: 20/102.4rem;
    }
    .oldPrice{
      color: #B0B0B0;
      font-size: 22/102.4rem;
    }
  }
  .banner{
    width: 4.492188rem;
    height: 4.492188rem;
    margin: 0 auto;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    width: 100%;
    height: 100%;
  }
  .swiper-slide img {
    width: 100%;
    height: 100%;
  }
  html,body{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .h100{
    height: .976563rem;
  }
  .top{
    position: fixed;
    top: 0;
    left: 0;
    height: .859375rem;
    width: 100%;
    background-color: #fff;
    line-height: .957031rem;
    overflow: hidden;
    border-radius: 3px 3px 0 0;
    .back{
      float: left;
      width: .859375rem;
      height: .859375rem;
      background:url('/static/images/back.png') center center no-repeat;
      background-size: 100%;
      margin-left: .292969rem;
    }
    .share{
      float: right;
      width: .859375rem;
      height: .859375rem;
      background:url('/static/images/share.png') center center no-repeat;
      background-size: 100%;
      margin-right: .292969rem;
    }
  }
  .current{
    color: #EB4D3D;
    border-color: #EB4D3D;
  }
  .mr8{
    margin-right: 8/102.4rem;
  }
  .mb20{
    margin-bottom: 20/102.4rem;
  }
}
</style>
