import Vue from 'vue'
import Router from 'vue-router'
import Selected from '@/views/selected/index'
import All from '@/views/selected/all'
import Panorama from '@/views/selected/panorama'
import Sample from '@/views/selected/sample'
import Alone from '@/views/selected/alone'
import Collect from '@/views/collect/index'
import Goods from '@/views/goods/index'
import Cart from '@/views/cart/index'
import Qrcode from '@/views/cart/qrcode'
import Mine from '@/views/mine/index'
import Hotgoods from '@/views/goods/hotgoods'
import Promotiongoods from '@/views/goods/promotiongoods'
import Goodlist from '@/views/goods/goodlist'
import OrderDetails from '@/views/mine/orderDetails'
import Order from '@/views/mine/order'
import Problem from '@/views/mine/problem'
import About from '@/views/mine/about'
import Help from '@/views/mine/help'
// 灵感居室、品牌视频、商品详情
import Index from '@/views/homePage/index'
import InspirationRoom from '@/views/homePage/inspirationRoom'
import BrandVideo from '@/views/homePage/brandVideo'
import Product from '@/views/product/product'
import fullLayer from '@/views/homePage/tipLayer'
import productDetail from '@/views/product/productDetail'
// 配置在线杂志、全国门店路由
import OnlineMagazine from '@/views/homePage/onlineMagazine'
import MagazineDetails from '@/views/homePage/magazineDetails'
import Stores from '@/views/homePage/stores'
// 搜索
import Search from '@/views/search/index'
import SearchG from '@/views/search/result_goods'
import SearchS from '@/views/search/result_select'

import GoodsDetails from '@/views/details/goodsDetails'
import CollectDetails from '@/views/details/collectDetails'
import Share from '@/views/share/caseShare'
import listShare from '@/views/share/listShare'
import FullPurchase from '@/views/details/fullPurchase'
import EnlargeImage from '@/views/details/enlargeImage'
import MagazineImage from '@/views/details/magazineImage'
import Enlarge3D from '@/views/details/enlarge3D'
import GoodsImage from '@/views/details/goodsImage'

import MpGoodsShare from '@/views/share/mpGoodsShare'
Vue.use(Router)

export default new Router({
  // mode: 'history', // 默认是location.hash传递，可以设置成html5的history传递 那样在路由中就不会出现#符号
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: Index,
      redirect: '/homePage/inspirationRoom',
      meta: {
        index: 0
      },
      children: [
        {
          path: '/homePage/inspirationRoom',
          meta: {
            index: 0
          },
          component: InspirationRoom
        },
        {
          path: '/homePage/brandVideo',
          meta: {
            index: 1
          },
          component: BrandVideo
        },
        {
          path: '/homePage/onlineMagazine',
          meta: {
            index: 2
          },
          component: OnlineMagazine
        },
        {
          path: '/homePage/stores',
          meta: {
            index: 3
          },
          component: Stores
        }
      ]
    },
    {
      path: '/magazineDetails',
      name: 'magazineDetails',
      component: MagazineDetails
    },
    {
      path: '/productList/',
      name: 'product',
      component: Product,
      meta: {
        index: 4
      }
    },
    {
      path: '/fullLayer/',
      name: 'fullLayer',
      component: fullLayer,
      meta: {
        index: 5
      }
    },
    {
      path: '/productDetail/:id',
      name: 'productDetail',
      component: productDetail,
      meta: {
        index: 6
      }
    },
    {
      path: '/selected',
      name: 'Selected',
      redirect: '/selected/panorama',
      meta: {index: 1},
      component: Selected,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: '/selected/all',
          meta: {index: 0},
          component: All
        },
        {
          path: '/selected/panorama',
          meta: {index: 1},
          component: Panorama
        },
        {
          path: '/selected/sample',
          meta: {index: 2},
          component: Sample
        },
        {
          path: '/selected/alone',
          meta: {index: 3},
          component: Alone
        }
      ]
    },
    {
      path: '/collect',
      name: 'Collect',
      meta: {index: 2},
      component: Collect
    },
    {
      path: '/goods',
      name: 'Goods',
      meta: {index: 3},
      component: Goods
    },
    {
      path: '/goods/hotgoods',
      name: 'Hotgoods',
      meta: {index: 3},
      component: Hotgoods
    },
    {
      path: '/goods/promotiongoods',
      name: 'Promotiongoods',
      meta: {index: 3},
      component: Promotiongoods
    },
    {
      path: '/goods/goodlist/:id',
      name: 'Goodlist',
      meta: {index: 3},
      component: Goodlist
    },
    {
      path: '/cart',
      name: 'Cart',
      meta: {index: 4},
      component: Cart
    },
    {
      path: '/qrcode/:id',
      name: 'Qrcode',
      meta: {index: 4},
      component: Qrcode
    },
    {
      path: '/mine',
      name: 'Mine',
      meta: {index: 5},
      component: Mine
    },
    {
      path: '/mine/order',
      name: 'Order',
      meta: {index: 5},
      component: Order
    },
    {
      path: '/mine/orderDetails/:id',
      name: 'OrderDetails',
      meta: {index: 5},
      component: OrderDetails
    },
    {
      path: '/mine/problem',
      name: 'Problem',
      meta: {index: 5},
      component: Problem
    },
    {
      path: '/about',
      name: 'About',
      meta: {index: 5},
      component: About
    },
    {
      path: '/help',
      name: 'Help',
      meta: {index: 5},
      component: Help
    },
    {
      path: '/search',
      name: 'Search',
      meta: {index: 5},
      component: Search,
      alias: 'SearchG',
      children: [
        {
          path: '/search/result_goods/:id',
          name: 'SearchG',
          meta: {index: 5},
          component: SearchG
        },
        {
          path: '/search/result_select/:id',
          name: 'SearchS',
          meta: {index: 5},
          component: SearchS
        }
      ]
    },
    {
      path: '/goodsDetails/:id/:code',
      name: 'GoodsDetails',
      meta: {index: 5},
      component: GoodsDetails
    },
    {
      path: '/collectDetails/:id',
      name: 'CollectDetails',
      meta: {index: 5},
      component: CollectDetails
    },
    {
      path: '/enlargeImage/:id/:index',
      name: 'EnlargeImage',
      meta: {index: 5},
      component: EnlargeImage
    },
    {
      path: '/magazineImage/:id',
      name: 'MagazineImage',
      meta: {index: 5},
      component: MagazineImage
    },
    {
      path: '/enlarge3D/:id/:column/:row',
      name: 'Enlarge3D',
      meta: {index: 5},
      component: Enlarge3D
    },
    {
      path: '/goodsImage/:id',
      name: 'GoodsImage',
      meta: {index: 5},
      component: GoodsImage
    },
    {
      path: '/share/:id',
      name: 'Share',
      meta: {index: 5},
      component: Share
    },
    {
      path: '/listshare/:sid/:jid',
      name: 'listShare',
      meta: {index: 5},
      component: listShare
    },
    {
      path: '/fullPurchase/:id',
      name: 'FullPurchase',
      meta: {index: 5},
      component: FullPurchase
    },
    {
      path: '/mpGoodsShare/:id/:code/:mid/:sid',
      name: 'mpGoodsShare',
      meta: {index: 5},
      component: MpGoodsShare
    }
  ]
})
