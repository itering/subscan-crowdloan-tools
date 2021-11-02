import api from 'Plugins/api';
const {
  polkaGetMetadata,
  polkaGetParachainMeta,
  polkaGetToken,
} = api;
export default {
  state: {
    metadata: {},
    parachainMetadata: {},
    token: {},
    tokenSymbol: {},
  },
  mutations: {
    SET_METADATA: (state, data) => {
      state.metadata = data;
    },
    SET_PARACHAIN_METADATA: (state, data) => {
      state.parachainMetadata = data;
    },
    SET_TOKEN: (state, data) => {
      state.token = data;
    },
    SET_TOKEN_SYMBOL: (state, data) => {
      state.tokenSymbol = data;
    },
  },
  actions: {
    async SetMetadata({
      commit
    }) {
      const data = await polkaGetMetadata();
      commit('SET_METADATA', data);
    },
    async setTokenSymbol({
      commit
    }, payload) {
      commit('SET_TOKEN_SYMBOL', payload);
    },
    async SetToken({
      commit
    }) {
      const data = await polkaGetToken();
      commit('SET_TOKEN', data);
      commit('SET_TOKEN_SYMBOL', {
        balances: {
          value: data['token'] && data['token'][0],
        },
        kton: {
          value: (data['token'] && data['token'][1]) || 'KTON',
        },
      });
    },
    async SetParachainMetadata({
      commit
    }) {
      const data = await polkaGetParachainMeta();
      commit('SET_PARACHAIN_METADATA', data);
    },
  }
};
