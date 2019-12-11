<template>
  <div class="inspir">
    <transition name="fade">
      <div class="inspir_box" v-if="isShow && empty === 0">
        <p class="clearAll" @click="clearAll">清空购物车</p>
        <ul class="goodsBox">
          <li class="list" v-for="(goods, index) in data" :data-code="goods.code" :key="goods.id">
            <div class="goodslist_show" v-if="goods.show">
              <div class="middle">
                <img class="checkImg" v-if="goods.IsChecked === 0" src="../../../static/images/checked.png" alt="" @click="checking(index)">
                <img class="checkImg" v-else src="../../../static/images/check.png" alt="" @click="checking(index)">
              </div>
              <div class="middle goodsImg"><img v-lazy="{src: goods.ImgUrl, error: '/static/images/onerror260.jpg'}" :key="goods.ImgUrl" style="width: 100%;height: 100%;"></div>
              <div class="middle info" :class="goods.UpDownStatus === 1 && (goods.HasGoodsStock === true || goods.NeedCheckStock === false) ? '' : 'galy'">
                <h5>{{goods.Title}}</h5>
                <p>{{goods.PSize}}</p>
                <p>{{goods.Color}}</p>
              </div>
              <div class="top">
                <div class="ov">
                  <a class="btn fl"  @click="reduce(index)"><img :src="goods.UpDownStatus === 1 && (goods.HasGoodsStock === true || goods.NeedCheckStock === false)   ? '../../../static/images/reduce.png': '../../../static/images/reduce1.png'" alt=""></a>
                  <input type="text" class="number fl"  :class="goods.UpDownStatus === 1 && (goods.HasGoodsStock === true || goods.NeedCheckStock === false)  ? '' : 'galy'" style="text-align: center;"  readonly unselectable="on"  :value="goods.Quantity"/>
                  <a class="btn fl" @click="add(index)"><img  :src="goods.UpDownStatus === 1 && (goods.HasGoodsStock === true || goods.NeedCheckStock === false)   ? '../../../static/images/add.png': '../../../static/images/add1.png'" alt=""></a>
                </div>
                <div v-if="goods.Stock === 0 && goods.HasGoodsStock === true && goods.NeedCheckStock" class="tips">{{tips}}</div>
                <div v-if="0 < goods.Stock && goods.Stock < goods.Quantity && goods.HasGoodsStock === true && goods.NeedCheckStock" class="tips1">{{tips1}}</div>
                <div v-if="!goods.HasGoodsStock && goods.NeedCheckStock" class="tips2">{{tips2}}</div>
              </div>
              <div class="top priceBox"  :class="goods.UpDownStatus === 1 && (goods.HasGoodsStock === true || goods.NeedCheckStock === false)  ? '' : 'galy'">
                <p class="price">{{goods.ActivityPrice}}</p>
                <p class="oldPrice" v-if="goods.Price !== goods.ActivityPrice"><del>{{goods.Price}}</del></p>
                <p class="piece">x {{goods.Quantity}}</p>
              </div>
              <span class="top edit" @click="edit(goods.GoodsID,index)" v-if="goods.HasGoodsStock">编辑</span>
            </div>
            <!-- 编辑页面 -->
            <div class="goodslist_show" v-else>
              <div class="middle">
                <img class="checkImg" v-if="goods.IsChecked === 0" src="../../../static/images/checked.png" alt="" @click="checking(index)">
                <img class="checkImg" v-else src="../../../static/images/check.png" alt="" @click="checking(index)">
              </div>
              <div class="middle goodsImg"><img v-lazy="{src: goods.ImgUrl, error: '/static/images/onerror260.jpg'}" :key="goods.ImgUrl" style="width: 100;height: 100%;"></div>
              <div class="middle info changeInfo">
                <h5>{{goods.Title}}</h5>
                <ul>
                  <li class="mr25">规格</li>
                  <li>
                    <span v-for="(data, index) in Attrs.PSize" :class="editData.pNumber === index ? 'current': ''" @click="pcurrent(index)"  :key="data.id">{{data}}</span>
                  </li>
                </ul>
                <ul>
                  <li class="mr25">色款</li>
                  <li>
                    <span class="maxw" v-for="(data, index) in Attrs.Color" :class="editData.cNumber === index ? 'current': ''" @click="ccurrent(index)"  :key="data.id">{{data}}</span>
                  </li>
                </ul>
              </div>
              <div class="top mt0">
                <img class="delete" @click="clearAlone(goods.CartsGoodID)" src="../../../static/images/delete.png" alt="">
              </div>
              <span class="top confirm" @click="confirm(index)">确认</span>
              <span class="top cancel" @click="cancel(index)">取消</span>
            </div>
          </li>
          <li class="list">
            <div class="hei88"></div>
          </li>
        </ul>
        <div class="bottom">
          <div class="fl">
            <img class="checkImg" v-if="allChecked" src="../../../static/images/checked.png" alt="" @click="checkingAll">
            <img class="checkImg" v-else src="../../../static/images/check.png" alt="" @click="checkingAll">全选
          </div>
          <!-- <div class="fr market market_t" @click="checkOut">
            门店支付 ({{total.allnum}})
          </div> -->
          <!-- <div class="fr market" @click="checkOut_t">
            在线支付 ({{total.allnum}})
          </div> -->
          <div class="fl mt60">
            <p class="weight">
              <span class="allPrice" v-if="total.allPrice !== total.allActivePrice">总价：<i>￥{{total.allPrice}}</i></span>
              <span class="allActivePrice">合计（不含运费）：<i>￥{{total.allActivePrice}}</i></span>
            </p>
          </div>
          <div class="fl" style="width:3rem;margin-left: 0.2rem;margin-top: 0.11rem;z-index:999;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
            <x-button  @click.native="showPopupPicker = true" type="warn">{{value1[0]}}</x-button>
            <group>
              <popup-picker :show.sync="showPopupPicker" :show-cell="false" :title="title1" :data="list1" v-model="value1" @on-show="onShow" @on-hide="onHide" @on-change="onChange" ></popup-picker>
            </group>
          </div>
          <div class="fl" style="width:3rem;margin-left: 0.2rem;margin-top: 0.11rem;z-index:999;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
            <x-button :disabled="dsip"  @click.native="showPopupPickers = true" type="warn">{{value2[0]}}</x-button>
            <group>
              <popup-picker :show.sync="showPopupPickers" :show-cell="false" :title="title2" :data="list2" v-model="value2" @on-change="onChangeDesigner" ></popup-picker>
            </group>
          </div>
          <div class="fr market" style="margin-right:20px;width:4.125rem;" @click="checkOut">
            扫码结算 ({{total.allnum}})
          </div>
        </div>
        <div @click="hideQ" v-if="qrcode" class="qrcode">
          <div class="cart_qrcode_box">
            <img :src="qrcode" :key="qrcode" alt="">
            <p>{{qrcode_title}}</p>
          </div>
        </div>
        <div v-if="deleteAll" class="qrcode">
          <div class="confirm">
            <p class="title">确认清空购物车</p>
            <p class="btn_box">
              <span class="oncancel" @click="onCancel">取消</span>
              <span class="onconfirm" @click="onConfirm">确认</span>
            </p>
          </div>
        </div>
      </div>
      <div v-if="empty === 1" class="empty">
        <img src="/static/images/empty.png" alt="">
        <p class="text">您的购物车还是空的，马上去看看吧 ~</p>
        <a class="btn" @click="back">立即选购</a>
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
<style lang="less">
  .weui-btn_warn{
    overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
  }
</style>
<script>
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'
import { PopupPicker, Group, XButton } from 'vux'
import Tips from '@/components/tips'
export default {
  inject: ['reload'],
  name: 'Cart',
  components: {
    FulfillingBouncingCircleSpinner,
    Tips,
    PopupPicker,
    Group,
    XButton
  },
  data () {
    return {
      dsip: true,
      shopAddress: [],
      shopDesigner: [],
      showPopupPicker: false,
      showPopupPickers: false,
      title1: '',
      list1: [[]],
      value1: ['请选择门店'],
      title2: '',
      list2: [[]],
      value2: ['请选择设计顾问'],
      degsiner: { UserName: '', LoginID: '' },
      tipsShow: false,
      tipsData: '不能再减少了',
      data: [],
      tips: '请重新选择商品规格',
      tips1: '请重新选择商品规格',
      tips2: '商品失效已不能购买 ',
      isShow: false,
      allChecked: true,
      cartGoodId: 0,
      newCode: 0,
      SPU: [],
      Attrs: {
        PSize: [],
        Color: []
      },
      editData: {
        pNumber: -1,
        cNumber: -1,
        activeP: '',
        activeC: '',
        oldPic: '',
        pic: ''
      },
      qrcode: '',
      empty: 0,
      deleteAll: false,
      qrcode_title: '微信扫一扫 在线支付'
    }
  },
  created () {
    let _this = this
    this.sdk.bridge.saveTrace('shoppingCartMain', 0)
    // 获取所有门店
    _this.api.post('/market/cart/GetStores', {}, function (result) {
      _this.list1[0].splice(0, _this.list1[0].length)
      if (!result.IsError) {
        _this.shopAddress = result.Data
        result.Data.forEach((item, index) => {
          _this.list1[0].push(item.name)
        })
        _this.list1[0].unshift('请选择门店')
        _this.shopAddress.unshift({code: 0, name: '请选择门店'})
      }
    })
    // 测试
    // let dataObject = {dispos: '1'}
    // _this.api.post('Cart/GetPageMyCarts', dataObject, function (result) {
    //   if (!result.IsError) {
    //     if (result.Data.length !== 0) {
    //       _this.data = result.Data[0].CartsGoods
    //       _this.init()
    //       _this.ShowNow()
    //     } else {
    //       _this.empty = 1
    //       _this.ShowNow()
    //     }
    //   }
    // })
    this.sdk.bridge.getLocation(function (res) {
      let dataObject = {prov: res.prov, city: res.city, county: res.country, dispos: '1'}
      _this.api.post('Cart/GetPageMyCarts', dataObject, function (result) {
        if (!result.IsError) {
          if (result.Data.length !== 0) {
            _this.data = result.Data[0].CartsGoods
            _this.init()
            _this.ShowNow()
          } else {
            _this.empty = 1
            _this.ShowNow()
          }
        }
      })
    }, function (res) {
      alert('获取地址失败')
    })
  },
  methods: {
    onChange (val) {
      let _this = this
      this.dsip = true
      _this.shopAddress.forEach((item, index) => {
        if (item.name === val[0]) {
          _this.list2[0].splice(0, _this.list2[0].length)
          _this.api.post('/market/cart/GetAdvisers', {shopNo: item.code}, function (result) {
            if (!result.IsError) {
              _this.dsip = false
              _this.shopDesigner = result.Data
              _this.value2[0] = result.Data[0].UserName
              _this.degsiner.UserName = result.Data[0].UserName
              _this.degsiner.LoginID = result.Data[0].LoginId
              result.Data.forEach((item, index) => {
                if (Number(item.IsDefault) === 1) {
                  _this.value2[0] = item.UserName
                  _this.degsiner.UserName = item.UserName
                  _this.degsiner.LoginID = item.LoginId
                }
                _this.list2[0].push(item.UserName)
              })
            }
          }, function () {
            _this.value2 = ['请选择设计顾问']
            _this.degsiner = { UserName: '', LoginID: '' }
          })
        }
      })
    },
    onChangeDesigner (val) {
      console.log('val change', val)
      let _this = this
      _this.shopDesigner.forEach((item, index) => {
        if (item.UserName === val[0]) {
          _this.degsiner.UserName = item.UserName
          _this.degsiner.LoginID = item.LoginId
        }
      })
    },
    onShow () {
      // this.dsip = true
    },
    onHide (type) {
      console.log('on hide', type)
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
    back () {
      console.log(1111)
      this.sdk.bridge.backProduct()
    },
    onCancel () {
      this.deleteAll = false
    },
    onConfirm () {
      let delGoods = []
      this.data.forEach(e => {
        delGoods.push(e.CartsGoodID)
      })
      this.data = []
      this.empty = 1
      this.deleteGoods(delGoods)
    },
    hideQ () {
      this.qrcode = ''
      this.reload()
    },
    // checkOut () { // 美国测试用
    //   alert('在线支付暂不支持非中国地区 Online payment does not support non-Chinese')
    // },
    checkOut () {
      let _this = this
      this.sdk.bridge.saveTrace('shoppingCartStroePay', 0)
      let cartid = _this.data[0].CartID
      let checkedSkus = _this.total.checkedSkus
      if (checkedSkus.length !== 0) {
        console.log(this.degsiner)
        this.qrcode = '1'
        this.api.post('market/cart/PadCartQRCode', {cartid: cartid, checkedskus: checkedSkus, consultant: escape(JSON.stringify(_this.degsiner))}, function (result) {
          if (!result.IsError) {
            _this.qrcode = result.Data.qrcode
            _this.qrcode_title = '微信扫一扫 立即支付' // 门店支付
          }
        }, function (res) {
          alert(res)
        })
      } else {
        alert('请选择需要结算商品')
      }
    },
    checkOut_t () {
      let _this = this
      this.sdk.bridge.saveTrace('shoppingCartOnlinePay', 0)
      let cartid = _this.data[0].CartID
      let checkedSkus = _this.total.checkedSkus
      if (checkedSkus.length !== 0) {
        this.qrcode = '1'
        this.api.post('market/cart/GetPadOnlinePayQRCode', {cartid: cartid, checkedskus: checkedSkus}, function (result) {
          if (!result.IsError) {
            _this.qrcode = result.Data.qrcode
            _this.qrcode_title = '微信扫一扫 在线支付'
          }
        }, function (res) {
          alert(res)
        })
      } else {
        alert('请选择需要结算商品')
      }
    },
    ShowNow () {
      this.isShow = true
    },
    pcurrent (i) { // 选规格
      this.editData.pNumber = i
      this.editData.cNumber = -1
      this.editData.activeC = ''
      this.editData.activeP = this.Attrs.PSize[i]
      this.Attrs.Color = []
      this.SPU.forEach(r => {
        if (r.Attrs.PSize === this.editData.activeP) {
          this.Attrs.Color.push(r.Attrs.Material + '/' + r.Attrs.Color)
        }
      })
      this.Attrs.Color = Array.from(new Set(this.Attrs.Color)) // 去重
    },
    ccurrent (i) { // 选色款
      this.editData.cNumber = i
      this.editData.activeC = this.Attrs.Color[i]
      if (this.editData.pNumber !== -1) {
        this.SPU.forEach((e, i) => {
          if (e.Attrs.PSize === this.editData.activeP && (e.Attrs.Material + '/' + e.Attrs.Color) === this.editData.activeC) {
            this.newCode = e.Code
            this.editData.pic = e.Gallerys[0].Img_Url
          }
        })
        this.data.forEach(e => {
          if (this.cartGoodId === e.CartsGoodID) {
            e.ImgUrl = this.editData.pic
          }
        })
      }
    },
    edit (goodsId, index) { // 编辑
      // 替换掉原来的图片
      if (this.editData.oldPic !== '') {
        this.data.forEach(e => {
          if (this.cartGoodId === e.CartsGoodID) {
            e.ImgUrl = this.editData.oldPic
          }
        })
      }
      // 根据goodsid获取spu
      let _this = this
      _this.editData.oldPic = this.data[index].ImgUrl
      _this.cartGoodId = this.data[index].CartsGoodID
      _this.newCode = ''
      _this.Attrs.PSize = [] // 清空数组
      _this.Attrs.Color = [] // 清空数组
      _this.editData.pNumber = -1
      _this.editData.cNumber = -1
      _this.editData.activeP = ''
      _this.editData.activeC = ''
      _this.api.post('market/product/detail', {goodsId: goodsId}, function (result) {
        if (!result.IsError) {
          console.log(result.Data)
          _this.SPU = result.Data.SKUList
          _this.SPU.forEach(r => {
            _this.Attrs.PSize.push(r.Attrs.PSize)
            _this.Attrs.Color.push(r.Attrs.Material + '/' + r.Attrs.Color)
          })
          _this.Attrs.PSize = Array.from(new Set(_this.Attrs.PSize)) // 去重
          _this.Attrs.Color = Array.from(new Set(_this.Attrs.Color)) // 去重
        }
      })
      _this.data.forEach((r, i) => {
        if (i === index) {
          r.show = false
        } else {
          r.show = true
        }
      })
    },
    confirm (index) { // 确认修改
      let _this = this
      if (this.editData.activeP === '') {
        alert('请选择规格')
      } else if (this.editData.activeC === '') {
        alert('请选择色款')
      } else {
        this.sdk.bridge.getLocation(function (res) {
          let dataObject = {prov: res.prov, city: res.city, county: res.country, cartsgoodid: _this.cartGoodId, newsku: _this.newCode, dispos: '1'}
          if (_this.newCode !== '') {
            _this.api.service('cart/UpdateCartGoods', dataObject, function (result) {
              if (!result.IsError) {
                let newData = JSON.parse(result.Data.result)
                _this.editData.oldPic = ''
                _this.data.forEach((e, i) => {
                  if (e.CartsGoodID === newData.CartsGoodID) {
                    _this.data.splice(i, 1, newData)
                    _this.init()
                  }
                })
              }
            }, function (result) {
              _this.showTips('加入失败，库存不足')
              _this.cancel(index)
            })
          } else {
            _this.cancel(index)
          }
        })
      }
    },
    cancel (index) { // 取消修改
      // 替换掉原来的图片
      if (this.editData.oldPic !== '') {
        this.data.forEach(e => {
          if (this.cartGoodId === e.CartsGoodID) {
            e.ImgUrl = this.editData.oldPic
          }
        })
      }
      this.data[index].show = true
    },
    add (index) { // 增加商品个数
      if (this.data[index].Quantity < 999) {
        if (this.data[index].NeedCheckStock) {
          if (this.data[index].HasGoodsStock) {
            if (this.data[index].Quantity < this.data[index].Stock) {
              this.data[index].Quantity++
              this.changeNumber(this.data[index].CartsGoodID, this.data[index].Quantity)
            } else {
              this.showTips('超出库存了')
            }
          }
        } else {
          this.data[index].Quantity++
          this.changeNumber(this.data[index].CartsGoodID, this.data[index].Quantity)
        }
      }
    },
    reduce (index) { // 减少商品个数
      if (this.data[index].HasGoodsStock || !this.data[index].NeedCheckStock) {
        if (this.data[index].Quantity > 1) {
          this.data[index].Quantity--
          this.changeNumber(this.data[index].CartsGoodID, this.data[index].Quantity)
        } else {
          this.showTips('不能再少了')
        }
      }
    },
    changeNumber (cartsgoodid, quantity) { // 修改商品数量方法this.sdk.bridge.getLocation(function (res) {
      let _this = this
      this.sdk.bridge.getLocation(function (res) {
        let dataObject = {prov: res.prov, city: res.city, county: res.country, cartsgoodid: cartsgoodid, quantity: quantity}
        _this.api.service('cart/EditCartsGoodsQuantity', dataObject, function (result) {
          if (!result.IsError) {
            console.log('修改成功' + result.IsError)
          } else {
            console.log('修改失败' + result.IsError)
          }
        })
      })
    },
    clearAll () { // 删除所有
      this.deleteAll = true
    },
    clearAlone (cartgoodsid) { // 删除单个
      let delGoods = []
      delGoods.push(cartgoodsid)
      this.data.forEach((e, i) => {
        if (e.CartsGoodID === cartgoodsid) {
          this.data.splice(i, 1)
        }
      })
      this.deleteGoods(delGoods)
    },
    deleteGoods (arr) {
      this.api.service('cart/BatchDeleteCartsGoods', {cartsgoodsids: arr}, function (result) {
        if (!result.IsError) {
          console.log(arr)
          console.log('删除成功')
        } else {
          console.log('删除失败' + result.IsError)
        }
      })
    },
    checking (index) { // 单选
      if (this.data[index].IsChecked === 0) {
        this.data[index].IsChecked = 1
      } else if (this.data[index].UpDownStatus === 1 && ((this.data[index].IsChecked === 1 && this.data[index].Stock >= this.data[index].Quantity) || !this.data[index].NeedCheckStock)) {
        this.data[index].IsChecked = 0
      }
    },
    checkingAll () { // 全选
      this.allChecked = !this.allChecked
      if (this.allChecked === true) {
        this.data.forEach(e => {
          if (e.UpDownStatus === 1 && (e.Stock >= e.Quantity || !e.NeedCheckStock)) {
            e.IsChecked = 0
          }
        })
      } else {
        this.data.forEach(e => {
          e.IsChecked = 1
        })
      }
    },
    init () { // 判断当前库存为o时是否选中
      this.data.forEach(e => {
        if (e.UpDownStatus === 1 && (e.Stock >= e.Quantity || !e.NeedCheckStock)) {
          e.IsChecked = 0
        } else {
          e.IsChecked = 1
        }
      })
    }
  },
  computed: {
    // 总计合集
    total: function () {
      let allnum = 0
      let allPrice = 0
      let allActivePrice = 0
      let checkedSkus = []
      this.data.forEach((el, index) => {
        if (el.IsChecked === 0) {
          allnum += el.Quantity
          allPrice += el.Quantity * el.Price
          allActivePrice += el.Quantity * el.ActivityPrice
          checkedSkus.push(el.CartsGoodID)
        }
      })
      allPrice = Math.floor(allPrice * 10) / 10
      allActivePrice = Math.floor(allActivePrice * 10) / 10
      return {
        allnum, // 总件
        allPrice, // 总价格
        allActivePrice, // 总优惠后价格
        checkedSkus // 选中的商品goodsid
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.empty{
  width: 100%;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  img{
    width: 452/102.4rem;
  }
  .text{
    margin-top: .678906rem;
    font-size: 26/102.4rem;
    color: #CCC;
  }
  .btn{
    display: block;
    margin: 0.964844rem auto 0;
    width: 2.392578rem;
    height: .927734rem;
    line-height: .927734rem;
    border: 1px solid #EB4D3D;
    color: #EB4D3D;
    font-size: 26/102.4rem;
    border-radius: 3px;
  }
}
.inspir{
  .qrcode{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    z-index: 9999;
    .confirm{
      width: 4.726563rem;
      height: 2.34375rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -1.171875rem;
      margin-left: -2.363281rem;
      background-color: white;
      font-size: .234375rem;
      color: #333;
      border-radius: 10px;
      text-align: center;
      line-height: .78125rem;
      p.title{
        margin-top: .488281rem;
      }
      p.btn_box{
        position: absolute;
        bottom: 0;
        display: flex;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        width: 100%;
        span{
          flex: 1;
        }
        .oncancel{
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        }
        .onconfirm{
          color: #EB4D3D;
        }
      }
    }
    img{
      display: block;
      width: 410/102.4rem;
      height: 410/102.4rem;
      margin: 30/102.4rem auto;
    }
    .cart_qrcode_box{
      width: 470/102.4rem;
      height: 470/102.4rem;
      background: url('../../../static/images/qrcode_border.png') center center no-repeat;
      background-size: cover;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -2.246094rem;
      margin-left: -2.246094rem;
      color: #fff;
      font-size: 42/102.4rem;
      letter-spacing: 3px;
      text-align: center;
      line-height: 70/102.4rem;
    }
  }
  .clearAll{
    color: #EB4D3D;
    text-align: right;
    margin-right: 38/102.4rem;
  }
  .inspir_box{
    position: relative;
    height: 1178/102.4rem;
    padding: 70/102.4rem 90/102.4rem 0;
    .bottom{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 98/102.4rem;
      line-height: 88/102.4rem;
      background-color: #fff;
      z-index: 8;
      box-shadow: 0 0 6px rgba(183,183,183,.3);
      padding: .146484rem 0;
      .weight{
        font-family: PingFangSC-Semibold, sans-serif;
      }
      .allPrice{
        font-size: .214844rem;
        color: #333;
        margin-right: 30/102.4rem;
        i{
          font-style: normal;
        }
      }
      .allActivePrice{
        font-size: .214844rem;
        color: #EB4D3D;
        i{
          font-size: .292969rem;
          font-style: normal;
        }
      }
      .fl{
        margin-left: 30/102.4rem;
      }
      .fr{
        margin-right: 30/102.4rem;
      }
      .mt60{
        margin-left: 44/102.4rem;
      }
      .market{
        width: 3.125rem;
        height: .957031rem;
        background-color: #EB4D3D;
        color: #fff;
        font-size: .332031rem;
        line-height: .957031rem;
        text-align: center;
        margin-right: 0;
        box-shadow: 1px 2px 6px rgba(235, 77, 61, 0.3);
        border-radius: 5px;
      }
      .market_t{
        background-color: white;
        color: #333;
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        margin-right: 44/102.4rem;
      }
    }
    .goodsBox{
      .list{
        padding: 30/102.4rem 0;
        border-bottom: 1px solid rgba(204,204,204,.5);
        .goodslist_show{
          display:table-cell;
          .middle,.top{
            display: inline-block;
            vertical-align: middle;
          }
          .top{
            vertical-align: top;
            margin-top: 30/102.4rem;
            input{
              color: #333;
            }
            .galy{
              color: #ccc;
            }
          }
          .goodsImg{
            width: 260/102.4rem;
            height: 260/102.4rem;
            margin: 0 100/102.4rem 0 30/102.4rem;
            position: relative;
          }
          .info{
            width: 460/102.4rem;
            margin-right: 30/102.4rem;
            font-size: #999;
            h5{
              font-size: 28/102.4rem;
              line-height: 28/102.4rem;
              margin-bottom: 40/102.4rem;
              color: #333;
              font-weight: bold;
            }
            p{
              font-size: 22/102.4rem;
              margin-bottom: 22/102.4rem;
              color: #999;
            }
          }
          .galy{
            h5, p{
              color: #ccc;
            }
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
          .changeInfo{
            width: 800/102.4rem;
            ul{
              overflow: hidden;
              // margin-bottom: 40/102.4rem;
              li{
                font-size: 24/102.4rem;
                color: #999;
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
                  margin: 0 15/102.4rem 15/102.4rem 0;
                }
                .maxw{
                  max-width: 1.953125rem;
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
          }
          .number{
            margin: 0 4/102.4rem;
            width: 130/102.4rem;
            height: 50/102.4rem;
            border: #999 1px solid;
          }
          .priceBox{
            margin-left: 200/102.4rem;
            width: 220/102.4rem;
            .price{
              font-size: 36/102.4rem;
              color: #EB4D3D;
              font-weight: bold;
            }
            .oldPrice{
              font-size: 28/102.4rem;
              color: #CCC;
            }
            .piece{
              font-size: 28/102.4rem;
              color: #999;
              margin-top: 40/102.4rem;
            }
          }
          .galy{
            .price, .oldPrice, .piece{
              color: #ccc;
            }
          }
          .delete{
            width: 90/102.4rem;
            height: 90/102.4rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .confirm{
            margin: .292969rem 60/102.4rem 0 130/102.4rem;
            font-size: 24/102.4rem;
            color: #EB4D3D;
          }
          .cancel,.edit{
            font-size: 24/102.4rem;
            color: #999;
          }
          .mt0{
            margin-top: 0;
          }
        }
      }
      li:last-child{
        padding: 0;
        border: none;
      }
    }
    .hei88{
      width: 100%;
      height: 188/102.4rem;
    }
    .checkImg{
      width: 90/102.4rem;
      height: 90/102.4rem;
      vertical-align: middle;
    }
    .tips{
      margin-top: .146484rem;
      padding: 0 .15625rem;
      height: .390625rem;
      line-height: .390625rem;
      text-align: center;
      color: #EB4D3D;
      background-color: rgba(235, 77, 21, 0.15);
      border-radius: 5px;
    }
    .tips1{
      margin-top: .146484rem;
      padding: 0 .15625rem;
      height: .390625rem;
      line-height: .390625rem;
      text-align: center;
      color: #EB4D3D;
      background-color: rgba(235, 77, 21, 0.15);
      border-radius: 5px;
    }
    .tips2{
      margin-top: .146484rem;
      padding: 0 .15625rem;
      height: .390625rem;
      line-height: .390625rem;
      text-align: center;
      color: #EB4D3D;
      background-color: rgba(235, 77, 21, 0.15);
      border-radius: 5px;
    }
    .ov{
      overflow: hidden;
    }
    input{
      -moz-user-select: none;
      -webkit-user-select: none;
    }
  }
}
</style>
