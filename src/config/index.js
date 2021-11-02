export * from "./query";

// 路由默认配置，路由表并不从此注入
export const ROUTER_DEFAULT_CONFIG = {
  waitForData: true,
  transitionOnLoad: true,
  mode: "history",
  base: "/",
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
  }
};

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  maxContentLength: 2000,
  headers: {},
  timeout: 30000, // 超时时间
  retry: 4, // 超时再次请求次数
  retryDelay: 1000, // 超时后再次发起请求的时间间隔
  withCredentials: false
};

// vuex 默认配置
export const VUEX_DEFAULT_CONFIG = {
  strict: process.env.NODE_ENV !== "production"
};
function getBaseURL() {
  let result = '/api';
  if (process.env.NODE_ENV === 'production') {
    if (location && location.origin) {
      result = "https://kusama.webapi.subscan.io";
      // result = "https://polkadot.webapi.subscan.io";
    }
  }
  return result;
}
// API 默认配置
export const API_DEFAULT_CONFIG = {
  baseURL: getBaseURL(),
  isTestEnv: process.env.NODE_ENV === "production" ? false : false,
  testEnvBaseURLPrefix: "/test"
};

// CONST 默认配置
export const CONST_DEFAULT_CONFIG = {
  sep: "/"
};

export const NETWORK_LIST = [
  {
    key: "kusama",
    value: "kusama"
  },
  {
    key: "polkadot",
    value: "polkadot"
  },
];

export const ENDPOINTS_MAP = {
  polkadot: {
    wss: "wss://rpc.polkadot.io",
    prefix: 0,
    types: {},
    api: {
      subql: ""
    }
  },
  kusama: {
    wss: "wss://kusama-rpc.polkadot.io",
    prefix: 2,
    types: {},
    api: {
      subql: ""
    }
  },
};
