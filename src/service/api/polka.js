export default [
  {
    name: 'getMetadata',
    method: 'POST',
    desc: '元数据',
    baseURL: '',
    path: '/scan/metadata',
    options: {},
  },
  {
    name: 'getToken',
    method: 'POST',
    desc: '获取token信息',
    baseURL: '',
    path: '/scan/token',
    options: {
      noShowDefaultError: true,
    },
  },
  {
    name: 'getParachainFunds',
    method: 'POST',
    desc: '根据status获取parachain的funds信息(1:Created;2:Onboard;3:Dissolved)',
    baseURL: '',
    path: '/scan/parachain/funds',
    options: {},
  },
  {
    name: 'getParachainMeta',
    method: 'POST',
    desc: '获取parachain的meta信息',
    baseURL: '',
    path: '/scan/parachain/meta',
    options: {},
  },
  {
    name: 'getParachainAuctions',
    method: 'POST',
    desc: '获取parachain的auctions信息(1:Started;2:Closed)',
    baseURL: '',
    path: '/scan/parachain/auctions',
    options: {},
  },
];
