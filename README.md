# ipad

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 文件存放地址
  1.static放不会变动的文件。 
  2.assets放可能会变动的文件。
  3.components 存放组件。

# ajax  使用 axios 
  1.首先安装 npm install axios 
  2.在需要请求的页面中引入axios 
  3.使用在created里面，获取数据。在这发起后端请求，拿回数据，配合路由钩子做一些事情
  4.具体文档参照https://www.kancloud.cn/yunye/axios/234845

# mockjs使用
  1.首先安装npm install mockjs
  2.在main.js中根据路径引入，本项目于是放在static下的 所以引入代码： require('../static/mock')

# views中存放文件  components中存放 组件

# VUX使用
  1.  npm install vux --save
  2.  npm install vux-loader --save-dev
  3.  vux2必须配合vux-loader使用, 请在build/webpack.base.conf.js里参照如下代码进行配置：
      const vuxLoader = require('vux-loader')
      const webpackConfig = originalConfig // 原来的 module.exports 代码赋值给变量 webpackConfig

      module.exports = vuxLoader.merge(webpackConfig, {
        plugins: ['vux-ui']
      })
  4. 使用

# 文件存放路径
\\192.168.18.163\Marketing\Pad

# 发布的时候market.js 里面debug改成false

# 修改插件vue-jlunar-datepicker 里面的css
  .full-jcalendar .input__inner{
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 5px;
  border: 1px solid #CCCCCC;
  box-sizing: border-box;
  color: #1f2d3d;
  display: inline-block;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: none;
  padding: 3px 10px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}

# 发布调整 
1. market.js 的debug
2. api.js root share
3. commonFun url 
4. wxSHare url