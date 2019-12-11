import axios from 'axios'
// let url = 'https://open.purmall.com/app/wxsdkconfig' // 正式
let url = 'https://open.yologoer.com/app/wxsdkconfig' // 集成
export default {
  wxShowMenu: function (share_title, share_img, share_desc) {
    axios.post(url, {
      url: location.href
    }).then(function (response) {
      var getMsg = response.data.Data
      wx.config({
        debug: false, //生产环境需要关闭debug模式
        appId: getMsg.appId, //appId通过微信服务号后台查看
        timestamp: getMsg.timestamp, //生成签名的时间戳
        nonceStr: getMsg.nonceStr, //生成签名的随机字符串
        signature: getMsg.signature, //签名
        jsApiList: [ //需要调用的JS接口列表
          'onMenuShareTimeline', //分享给好友
          'onMenuShareAppMessage' //分享到朋友圈
        ]
      })
      wx.ready(function () {
        // 分享到朋友圈
        wx.onMenuShareTimeline({
          title: share_title, // 分享标题
          link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: share_img, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        // 分享给朋友
        wx.onMenuShareAppMessage({
          title: share_title, // 分享标题
          desc: share_desc, // 分享描述
          link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: share_img, // 分享图标
          type: 'link',
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
      })
    })
  }
}
