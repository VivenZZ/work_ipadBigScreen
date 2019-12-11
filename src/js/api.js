import $sdk from './sdk/market.1.0.js'
// 配置API接口地址
// var root = 'https://open.purmall.com' // 正式
// var root = 'http://open.yologoer.com' // 集成
var root = 'http://192.168.20.27:9003' // 测试
// var root = 'http://Usertestapi.harborhouse.cn' // 美国
// 配置分享地址
// var share = 'https://share.purmall.com' // 正式
// var share = 'http://share.yologoer.com' // 集成
var share = 'http://192.168.20.27:9008' // 测试

// 引用superagent
let axios = require('axios')
// 自定义判断元素类型的JS
// function toType (obj) {
//   return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
// }

// 参数过滤函数
// function filternull (o) {
//   for (var key in o) {
//     if (o[key] === null) {
//       delete o[key]
//     }
//     if (toType(o[key] === 'string')) {
//       o[key] = o[key].trim()
//       if (o[key].length === 0) {
//         delete o[key]
//       }
//     }
//   }
//   return o
// }
// 接口处理函数
function apibase (method, url, params, success, failure, contentType) {
  $sdk.bridge.auth(function (auth) {
    // debugger
    var data = params || {}
    data.mid = auth.mid
    data.bcid = data.bcid || auth.bcid
    data.sid = auth.sid
    data.deviceCode = auth.deviceCode
    var opt = {
      url: url,
      method: method,
      responseType: 'json',
      headers: auth,
      data: data
    }
    if (contentType) {
      axios.defaults.headers.post['Content-Type'] = contentType
    }
    axios(opt).then(function (res) {
      // debugger
      if (res.data.IsError === false) {
        if (success && typeof (success) === 'function') {
          success(res.data)
        }
      } else {
        if (failure && typeof (failure) === 'function') {
          failure(res.data)
        } else {
          console.log('error:' + JSON.stringify(res.data))
        }
      }
    }, function (err) {
      if (err.response.status === 401) {
        $sdk.bridge.prelogin()
      } else if (err.response.status === 400) {
        alert('请求参数错误！')
      } else if (err.response.status === 403) {
        alert('当前功能需要APP授权！')
      } else {
        alert('api error:' + err)
      }
    })
  })
}
// 接口不需要Auth数据
function apibasewithoutauth (method, url, params, success, failure, contentType) {
  // debugger
  var data = params || {}
  var opt = {
    url: url,
    method: method,
    responseType: 'json',
    data: data
  }
  if (contentType) {
    axios.defaults.headers.post['Content-Type'] = contentType
  }
  axios(opt).then(function (res) {
    // debugger
    if (res.data.Code === 403) {
      $sdk.bridge.prelogin()
    } else {
      if (res.data.IsError === false) {
        if (success && typeof (success) === 'function') {
          success(res.data)
        }
      } else {
        if (failure && typeof (failure) === 'function') {
          failure(res.data)
        } else {
          console.log('error:' + JSON.stringify(res.data))
        }
      }
    }
  }).catch(function (error) {
    console.log('api error: ' + error.message)
  })
}
// 提交接口处理函数，数据操作在服务中处理
function servicebase (url, params, success, failure) {
  $sdk.bridge.auth(function (auth) {
    // debugger
    var data = params || {}
    data.mid = auth.mid
    data.bcid = data.bcid || auth.bcid
    data.sid = auth.sid
    data.deviceCode = auth.deviceCode
    var opt = {
      url: root + '/entrance/sync/' + url + '/1',
      method: 'POST',
      responseType: 'json',
      headers: auth,
      data: { Data: JSON.stringify(data) }
    }
    if ($sdk.bridge.option.debug) {
      console.log(JSON.stringify(data))
    }
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    axios(opt).then(function (res) {
      if (res.data.Code === '403') {
        $sdk.bridge.prelogin()
      } else {
        if (res.data.IsError === false) {
          if (success && typeof (success) === 'function') {
            success(res.data)
          }
        } else {
          if (failure && typeof (failure) === 'function') {
            failure(res.data)
          } else {
            console.log('service error:' + JSON.stringify(res.data))
          }
        }
      }
    }, function (err) {
      alert('api error:' + err)
    })
  })
}
// 输出可被外界调用接口
export default {
  get: function (url, params, success, failure) {
    return apibase('GET', root + '/' + url, params, success, failure, 'application/x-www-form-urlencoded')
  },
  post: function (url, params, success, failure) {
    return apibase('POST', root + '/' + url, params, success, failure, 'application/json')
  },
  // 不需要授权登录请求，支持部分api调用
  post2: function (url, params, success, failure) {
    return apibasewithoutauth('POST', root + '/' + url, params, success, failure, 'application/json')
  },
  service: function (url, params, success, failure) {
    return servicebase(url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apibase('PUT', root + '/' + url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apibase('DELETE', root + '/' + url, params, success, failure)
  },
  qrcode: function (url) {
    return root + '/su/qrcode?url=' + encodeURIComponent(url)
  },
  shareUrl: function (gid, code, callback) {
    $sdk.bridge.auth(function (auth) {
      let mid = auth.mid
      let sid = auth.sid
      var url = share + '/marketing/#/mpGoodsShare/' + gid + '/' + code + '/' + mid + '/' + sid
      callback(url)
    })
  },
  shareCollect: function (id) {
    return share + '/marketing/#/share/' + id
  },
  polling: function (contextId, callback) {
    function pli () {
      apibase('POST', root + '/c/status/' + contextId, {},
        function (r) {
          if (r.Data.end) {
            if (callback) {
              try {
                callback(JSON.parse(r.Data.message))
              } catch (e) {
                callback(r.Data.message)
              }
            }
          } else {
            setTimeout(pli, 3000)
          }
        },
        function () { }, 'application/json'
      )
    }
    setTimeout(pli, 300)
  },
  stateMachine: function (callback, cancelToken) {
    var t = 0
    function pli () {
      apibase('POST', root + '/state/pull', {},
        function (r) {
          if (r.Data) {
            if (callback) {
              callback(r.Data)
            }
          }
          if (cancelToken) {
            var flag = cancelToken()
            if (flag) {
              clearTimeout(t)
              return
            }
          }
          t = setTimeout(pli, 3000)
        },
        function () {
          clearTimeout(t)
        },
        'application/json'
      )
    }
    t = setTimeout(pli, 3000)
  },
  // 取图片名称
  getChineseName: function (name) {
    var reg = /[\u4e00-\u9fa5]+/g
    var results = name.match(reg)
    if (results && results.length > 0) {
      var str = ''
      for (var i = 0; i < results.length; i++) {
        str += results[i]
      }
      return str
    } else {
      return name
    }
  },
  apiroot: root
}
