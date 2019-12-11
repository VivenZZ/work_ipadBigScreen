let crypto = require('crypto')
// IOS 桥接器
var setupWebViewJavascriptBridge = function (callback) {
  if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge) }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'https://__bridge_loaded__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}
function md5 (text) {
  return crypto.createHash('md5').update(text).digest('hex')
}
var JSBridge = {
  option: {
    appid: 'IXoeCqSS',
    securitykey: 'afbd8bd799674a00933a0487c2301b0bf8d95dca3283490bb06db854beebfe66',
    os: 'ios',
    debug: true // 发布的时候改成false
  },
  onBridgeReady: null,
  BridgeReady: function () {
    var ua = navigator.userAgent.toLowerCase()
    // IOS身份验证
    if (/iphone|ipad|ipod/.test(ua)) {
      this.option.os = 'ios'
    } else if (/android/.test(ua)) {
      // 安卓身份验证
      this.option.os = 'android'
    }
    if (this.onBridgeReady != null) this.onBridgeReady()
  },
  call: function (action, callback) {
    if (this.option.os === 'ios') {
      setupWebViewJavascriptBridge(function (bridge) {
        // 获取token
        bridge.callHandler(action, '', callback)
      })
    } else {
      // var r = android[action]()
      // if (r&&(r.startsWith('[') || r.startsWith('{'))) r = JSON.parse(r)
      // if (callback != null)
      //   callback(r)
      // return r
    }
  },
  invoke: function (action, data, callback) {
    if (this.option.os === 'ios') {
      setupWebViewJavascriptBridge(function (bridge) {
        // 获取token
        bridge.callHandler(action, data, callback)
      })
    } else {
      setupWebViewJavascriptBridge(function (bridge) {
        // 获取token
        bridge.callHandler(action, data, callback)
      })
    }
  },
  openWeb: function (data, callback) {
    // 网页调用该方法打开需要授权访问的网页
    return this.invoke('openWeb', data, callback)
  },
  auth: function (callback) {
    // debugger
    // 网页调用该方法获取授权信息
    if (this.option.debug) {
      var timestamp = Math.round(new Date().getTime() / 1000)
      var auth = {
        appid: this.option.appid,
        timestamp: timestamp,
        md5: md5(timestamp + '@' + this.option.securitykey + '$' + this.option.appid),
        IdentityType: 'Member',
        // 测试
        token: '9c429c09008e4adc909345f4e654bbb6', // localStorage.token,
        deviceCode: '10986',
        mid: '4e8a4a9a-3067-4d06-a2a6-75e76d0da809',
        bcid: '82045d2e-b713-4b00-88e3-cbde94338376',
        sid: '262cf2e2-84aa-4772-b441-fa84d3e73be1',
        userId: 'd064e2ad-161a-4ec1-9de5-48cf49054f56' // localStorage.userId
        // 集成
        // deviceCode: '10986',
        // token: '40132fe212424013b5dd4781affb03e2', // localStorage.token,
        // mid: '34e9c455-f47d-40be-8865-fddbd1f07a94',
        // bcid: 'bb243cb8-87c5-4418-8b07-245bd8cd3a4b',
        // sid: '4853e7f3-af60-497d-80aa-08c341ff8ce7',
        // userId: '9d9c732e-15db-4c78-94c4-2c39943bf5f0' // localStorage.userId
        // 正式
        // mid: '34e9c455-f47d-40be-8865-fddbd1f07a94',
        // bcid: '61f1aa48-6e88-471e-a423-599e4672566d',
        // sid: '4853e7f3-af60-497d-80aa-08c341ff8ce7',
        // userid: '1691641f-00da-465d-bbac-f62df9e6cc98',
        // token: 'b2a62e842dc3413788e41dd3cc29a658',
        // deviceCode: '10319'
        // 美国
        // mid: '34e9c455-f47d-40be-8865-fddbd1f07a94',
        // bcid: '61f1aa48-6e88-471e-a423-599e4672566d',
        // sid: '4853e7f3-af60-497d-80aa-08c341ff8ce7',
        // userid: '1691641f-00da-465d-bbac-f62df9e6cc98',
        // token: 'a0a10dbecae644f9b4fbe1ed08fa3253',
        // deviceCode: '10319'
      }
      if (callback && typeof callback === 'function') {
        callback(auth)
      }
      return auth
    } else {
      return this.call('getUserAuth', callback)
    }
  },
  // 统计点击数据
  saveTrace: function (trace, traceType) {
    return this.invoke('saveTrace', {trace: trace, traceType: traceType})
  },
  // 缩略图尺寸定制
  resize: function (url, width, height) {
    return (url || '').replace(/.((jpg)|(png)|(gif)|(jpeg))/g, '.' + width + 'x' + height + '.$1')
  },
  modifyPwd: function (callback) {
    // 网页调用该方法调用密码修改功能
    return this.call('modifyPwd', callback)
  },
  notDisturb: function (callback) {
    // 网页调用该方法打开勿扰设置
    return this.call('getNotDisturb', callback)
  },
  motion: function (data, callback) {
    // 网页调用该方法调用app中动画效果
    return this.invoke('callMotion', data, callback)
  },
  camera: function (callback) {
    // 网页调用该方法打开相机
    return this.call('getCamera', callback)
  },
  microphone: function (callback) {
    // 网页调用该方法打开麦克风
    return this.call('getMicrophone', callback)
  },
  deliveryAddress: function (callback) {
    // 网页调用该方法打开收货地址管理
    return this.call('getDeliveryAddress', callback)
  },
  payment: function (channel, amount, title, ordersn, tradesn, balance, score, callback) {
    // 网页调用该方法打开支付界面 channel:alipay wxpay
    // callback  {success:true,code:'cancel/timeout/payerror',message:''}
    return this.invoke('pay', { channel: channel, amount: amount, title: title, ordersn: ordersn, tradesn: tradesn, balance: balance, score: score }, callback)
  },
  // callback({"prov": "省", "city": "市", "county": "区", "lat": "纬度", "lng": "经度"})
  getLocation: function (callback) {
    // 网页调用该方法打开gps
    return this.call('getLocation', callback)
  },
  openRecordLock: function (callback) {
    // 网页调用该方法打开gps
    return this.call('openRecordLock', callback)
  },
  doShare: function (imgUrl, title, link, desc, callback) {
    return this.invoke('doShare', { imgUrl: imgUrl, title: title, desc: desc, link: link }, callback)
  },
  upLoadFile: function (data, callback) {
    return this.invoke('upLoadFile', data, callback)
  },
  barcodeScan: function (callback) {
    return this.call('barcodeScan', callback)
  },
  closeDialog: function (url, callback) {
    return this.invoke('closeDialog', { url: url }, callback)
  },
  showInDialog: function (url, callback) {
    return this.invoke('showInDialog', { url: url }, callback)
  },
  fullScreen: function (url, callback) {
    return this.invoke('fullScreen', { url: url }, callback)
  },
  dialogScreen: function (url, callback) {
    return this.invoke('dialogScreen', { url: url }, callback)
  },
  back: function (callback) {
    return this.call('back', callback)
  },
  getHelpShowState: function (callback) {
    return this.call('getHelpShowState', callback)
  },
  setHelpShowed: function () {
    return this.call('setHelpShowed', null)
  },
  // topBarType：
  // barWithBrandSearchShop      // 带品牌列表头部效果的（tabbar一级）
  // barWithSearchShop           // 不带品牌列表头部效果的（tabbar一级）
  // search                      // 带 search bar 的
  // normal                      // 常规样式的 top bar
  // nobar                       // 没有 top bar
  openNewPage: function (url, topBarType, title, callback) {
    return this.invoke('openNewPage', { url: url, topBarType: topBarType, title: title }, callback)
  },
  setTitle: function (title, callback) {
    return this.invoke('setTitle', { title: title }, callback)
  },
  shareData: function (title, desc, imgUrl, contentUrl, barcodeUrl, callback) {
    return this.invoke('shareData', { title: title, desc: desc, imgUrl: imgUrl, contentUrl: contentUrl, barcodeUrl: barcodeUrl }, callback)
  },
  getSearchTxt: function (callback) {
    return this.call('getSearchTxt', callback)
  },
  backProduct: function (callback) {
    return this.call('backProduct', callback)
  },
  prelogin: function () {
    if (this.option.debug) {
      window.location.href = '/login'
    } else {
      return this.call('prelogin', null)
    }
  },
  logout: function () {
    return this.call('loginout', null)
  },
  close: function () {
    return this.call('close', null)
  },
  notifCartNumChange: function () {
    return this.call('notifCartNumChange', null)
  }
}

JSBridge.BridgeReady()

export default {
  bridge: JSBridge
}
