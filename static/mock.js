var Mock = require('mockjs')
// 头部数据
const mockAll = Mock.mock('/all.com/', 'get', {
  'alldata|6': [{
    'id|+1': 1,
    'tag':  '@pick(["3D", "IMG"])',
    'code|10000-19999': 19999,
    'img': '@dataImage("912x608")',
    'speic': '@pick(["三室两厅", "两室一厅","五室三厅"])',
    'number|1-100': 100,
    'name': '@ctitle(2,5)',
    'describe': '@ctitle(5,10)',
    'label': ['@ctitle(2,5)','@ctitle(2,5)','@ctitle(2,5)']
  }]
})
// goods
const mockgoodsPic = Mock.mock('/goodspic.com/', 'get', {
  'alldata|10': [{
    'id|+1': 1,
    'code|10000-19999': 19999, 
    'tag':  '@pick(["客厅系列", "餐厅系列", "卧室空间", "书房空间"])',
    'img': '@dataImage("321x214")',
    'name': '@ctitle(2,5)',
    'href': '@ctitle(5,10)'
  }]
})
// goods clone
const mockgoods = Mock.mock('/goods.com/', 'get', {
  'alldata|20': [{
    'id|+1': 1,
    'code|10000-19999': 19999, 
    'tag':  '@pick(["客厅系列", "餐厅系列", "卧室空间", "书房空间"])',
    'img': '@dataImage("360x360")',
    'name': '@ctitle(2,5)',
    'href': '@ctitle(5,10)',
    'price|1-10000': 10000,
    'price_active|1-10000': 10000
  }]
})
// details
const mockDetails = Mock.mock('/detials.com/', 'get', {
  'alldata': [{
    'id|+1': 1,
    'img': '@dataImage("1028x720")',
    'title': '@ctitle(2,5)',
    'describe': '@ctitle(5,10)',
    'price': '@pick(["5-10万", "10-20万", "20-30万", "30万以上"])',
    'details|10': [
      {
        'id|+1': 1,
        'img': '@dataImage("1028x720")',
        'title': '@ctitle(2,5)'
      }
    ]
  }]
})

const mockObj = Mock.mock('/obj.com/', 'get', {
  'alldata': {
    'id|+1': 1,
    'img': '@dataImage("1028x720")',
    'title': '@ctitle(2,5)',
    'describe': '@ctitle(5,10)',
    'price': '@pick(["5-10万", "10-20万", "20-30万", "30万以上"])',
    'details|10': [
      {
        'id|+1': 1,
        'imgs|1-5': [
          {
            'img': '@dataImage("1028x720")'
          }
        ],
        'title': '@ctitle(2,5)'
      }
    ]
  }
})
// 购物车

const mockCar = Mock.mock('/car.com/', 'get', {
  'alldata|10': [{
    'id|+1': 1,
    'code|+1': 10001, 
    'img': '@dataImage("260x260")',
    'title': '@ctitle(2,5)',
    'oldPrice|1-10000': 10000,
    'Price|1-10000': 10000,
    'stock|1-100': 100,
    'num|1-10': 10,
    'Attrs': {
        'Color': '@ctitle(2,5)',
        'Material': '@ctitle(2,5)',
        'PSize': '@ctitle(2,5)',
    },
    'checked': true,
    'show': true
  }]
})

const mockSPU = Mock.mock('/spu.com/', 'get', {
  'alldata|4': [{
    'id|+1': 1,
    'code|+1': 10001, 
    'img': '@dataImage("260x260")',
    'title': '@ctitle(2,5)',
    'oldPrice|1-10000': 10000,
    'Price|1-10000': 10000,
    'stock|1-100': 100,
    'num|1-10': 10,
    'Attrs': {
        'Color': '@pick(["红色", "绿色", "黄色", "紫色"])',
        'Material': '@pick(["牛皮", "猪皮", "羊皮", "恐龙皮"])',
        'PSize': '@pick(["10x100", "20x200", "30x300", "40x400"])',
    },
    'checked': true
  }]
})
export default {
  mockAll,
  mockgoodsPic,
  mockgoods,
  mockDetails,
  mockObj,
  mockCar,
  mockSPU
}
