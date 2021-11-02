import { ApiPromise, WsProvider } from "@polkadot/api";
import keyring from "@polkadot/ui-keyring";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import store from "Plugins/store";
import { ENDPOINTS_MAP } from "Config";
import { TypeRegistry } from '@polkadot/types/create';

let apiInstance = {};
const registry = new TypeRegistry();

// eslint-disable-next-line no-unused-vars
async function connectWS() {
  const network = store.state.global.sourceSelected
  const { wss } = ENDPOINTS_MAP[network];
  const provider = new WsProvider(wss);

  apiInstance = new ApiPromise({
    provider
  });

  await apiInstance.isReady;

  const chainState = await apiInstance.rpc.system.properties();

  store.commit("SET_CHAIN_TOKEN", chainState.toHuman());

  const {ss58Format, tokenDecimals, tokenSymbol} = chainState;

  registry.setChainProperties(registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }));
  cryptoWaitReady().then(() => {
    keyring.loadAll({
      genesisHash: apiInstance.genesisHash,
      type: 'sr25519',
      ss58Format: ss58Format
    });
    store.commit("SET_KEYRING_STATUS", true);
  });
}

connectWS();
// store.commit("SET_KEYRING_STATUS", true);

export default { apiInstance, registry };
