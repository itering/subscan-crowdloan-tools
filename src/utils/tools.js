import store from '@/plugins/store';
export function assert(condition, msg) {
  if (!condition) throw new Error(`[Apior] ${msg}`)
}

export function isMobile() {
  const u = navigator.userAgent;
  return (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) &&
      !!u.match(/AppleWebKit.*Mobile.*/)) ||
    window.innerWidth <= 768;
}

export function getTokenDecimalByCurrency(token) {
  if (token) {
    return token.tokenDecimals && token.tokenDecimals[0];
  }
  return 0;
}
export function getTokenDetail(token) {
  if (token && token.detail && token.token) {
    return token.detail[token.token[0]];
  }
  return {};
}
export function getTokenDecimal(token) {
  if (token) {
    return token.token_decimals;
  }
  return 0;
}
export function getCurrencyTokenDetail(token, sourceSelected, currency) {
  if (token && token.detail && token.token) {
    if (currency) {
      return token.detail[currency.toUpperCase()] || token.detail[token.token[0]];
    } else {
      return token.detail[token.token[0]];
    }
  }
  return {};
}
export function formatSource(module, type, $const, sourceSelected) {
  if (module === 'ring') {
    module = 'balances';
  }
  const source = $const[`SYMBOL/${sourceSelected}`];
  if (source && source[module]) {
    if ((module === 'balances') && type === 'value') {
      return (store.state.polka.tokenSymbol[module] && store.state.polka.tokenSymbol[module][type]) || '';
    } else {
      return source[module][type] || '';
    }
  } else {
    return '';
  }
}
export function formatSymbol(module, $const, sourceSelected) {
  if (!$const[`SYMBOL/${sourceSelected}`]) {
    return "";
  }
  return $const[`SYMBOL/${sourceSelected}`][module] && $const[`SYMBOL/${sourceSelected}`][module].value || "";
}

/**
 * first char uppercase
 */
 export function toUpperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
