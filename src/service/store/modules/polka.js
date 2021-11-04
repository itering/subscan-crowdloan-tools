import api from 'Plugins/api';
const {
  polkaGetMetadata,
  polkaGetParachainMeta,
  polkaGetParachainAuctions,
  polkaGetToken,
} = api;
export default {
  state: {
    metadata: {},
    parachainMetadata: {},
    currentAuction: {},
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
    SET_CURRENT_AUCTION: (state, data) => {
      state.currentAuction = data;
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
    async SetCurrentAuction({
      commit,
      state
    }) {
      const data = await polkaGetParachainAuctions({
        // status: 1,
        row: 25,
        page: 0,
      });
      const result = (data && data.auctions && data.auctions[0]) || {};
      if (!result.end_block) {
        result.end_block =
          result.early_end_block + (state.parachainMetadata && state.parachainMetadata.ending_period) || 0;
      }
      commit('SET_CURRENT_AUCTION', (data && data.auctions && data.auctions[0]) || {});
    },
  }
};
