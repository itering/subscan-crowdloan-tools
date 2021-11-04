import {bnShift, bn2str} from "./format";
import { encodeAddress } from "@polkadot/util-crypto";
import moment from 'moment';
export function toThousandslsFilter(num) {
  return (num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

export function accuracyFormat(num, accuracy) {
  if (accuracy) {
    return bn2str(bnShift(num, -(accuracy)));
  } else if (+accuracy === 0){
    return num;
  } else {
    return '';
  }
}

export function encodeAddressByType(address, addressType) {
  if (!address) {
    return "";
  }
  return encodeAddress(address, addressType);
}
export function getValidator(nickname, index, stash) {
  return nickname || stash;
}
export function parseLeaseIdx2Time(startIdx, endIdx, leasePeriod, currentBlock, cFormat) {
  const start = parseBlock2Time(startIdx * leasePeriod, currentBlock, cFormat);
  const end = parseBlock2Time((endIdx + 1) * leasePeriod, currentBlock, cFormat);
  if (start && end) {
    return start + ' ~ ' + end;
  } else {
    return '';
  }
}
export function timeAgo(time, now = Date.now(), shouldTruncate) {
  time = +time * 1000;
  const d = new Date(time);

  const diff = parseInt((now - d) / 1000, 10);
  if (diff < 1) {
    return '0 sec ago';
  } else if (diff < 60) {
    return `${diff} ${diff === 1 ? 'sec' : 'secs'} ago`;
  } else if (diff < 3600) {
    // less 1 hour
    const min = Math.floor(diff / 60);
    return `${min} ${min === 1 ? 'min' : 'mins'} ago`;
  } else if (diff < 86400) {
    // less 1 day
    const hr = Math.floor(diff / 3600);
    const min = Math.floor((diff / 60) % 60);
    if (shouldTruncate) {
      return `${hr} ${hr === 1 ? 'hr' : 'hrs'} ago`;
    } else {
      return `${hr} ${hr === 1 ? 'hr' : 'hrs'}${min === 0 ? '' : min == 1 ? ' 1 min' : ` ${min} mins`} ago`;
    }
  } else if (diff < 90000) {
    // less 1 day 60 min
    const day = Math.floor(diff / 86400);
    const min = Math.floor((diff / 60) % 60);
    if (shouldTruncate) {
      return `${day} ${day === 1 ? 'day' : 'days'} ago`;
    } else {
      return `${day} ${day === 1 ? 'day' : 'days'}${min === 0 ? '' : min == 1 ? ' 1 min' : ` ${min} mins`} ago`;
    }
  } else {
    const day = Math.floor(diff / 86400);
    const hr = Math.floor((diff / 60 / 60) % 24);
    if (shouldTruncate) {
      return `${day} ${day === 1 ? 'day' : 'days'} ago`;
    } else {
      return `${day} ${day === 1 ? 'day' : 'days'}${hr === 0 ? '' : hr == 1 ? ' 1 hr' : ` ${hr} hrs`} ago`;
    }
  }
}
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }

  if ((time + '').length === 10) {
    time = +time * 1000;
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    date = new Date(parseInt(time));
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}
export function parseTimeToUtc(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  if ((time + '').length >= 10) {
    time = +time * 1000;
  }
  const format = cFormat || 'YYYY-MM-DD HH:mm:ss';
  const date = moment.utc(time);
  return `${date.format(format)} (+UTC)`;
}
export function parseBlock2Time(endBlock, currentBlock, cFormat, showUTC) {
  let blockTime = 6;
  if (endBlock > -1 && currentBlock > -1) {
    const now = moment().add((endBlock - currentBlock) * blockTime, 'seconds');
    const format = cFormat || 'YYYY-MM-DD HH:mm';
    const date = moment.utc(now);
    if (showUTC) {
      return `${date.format(format)} (UTC+0)`;
    } else {
      return `${date.format(format)}`;
    }
  } else {
    return '';
  }
}
export function countDownByBlock(endBlockNum, startBlockNum, shouldTruncate) {
  let blockTime = 6;
  if (startBlockNum && endBlockNum && endBlockNum > startBlockNum) {
    const diff = (endBlockNum - startBlockNum) * blockTime;
    if (diff < 1) {
      return '0 sec';
    } else if (diff < 60) {
      return `${diff} ${diff === 1 ? 'sec' : 'secs'} ago`;
    } else if (diff < 3600) {
      // less 1 hour
      const min = Math.floor(diff / 60);
      return `${min} ${min === 1 ? 'min' : 'mins'}`;
    } else if (diff < 86400) {
      // less 1 day
      const hr = Math.floor(diff / 3600);
      const min = Math.floor((diff / 60) % 60);
      if (shouldTruncate) {
        return `${hr} ${hr === 1 ? 'hr' : 'hrs'}`;
      } else {
        return `${hr} ${hr === 1 ? 'hr' : 'hrs'}${min === 0 ? '' : min == 1 ? ' 1 min' : ` ${min} mins`}`;
      }
    } else if (diff < 90000) {
      // less 1 day 60 min
      const day = Math.floor(diff / 86400);
      const min = Math.floor((diff / 60) % 60);
      if (shouldTruncate) {
        return `${day} ${day === 1 ? 'day' : 'days'}`;
      } else {
        return `${day} ${day === 1 ? 'day' : 'days'}${min === 0 ? '' : min == 1 ? ' 1 min' : ` ${min} mins`}`;
      }
    } else {
      const day = Math.floor(diff / 86400);
      const hr = Math.floor((diff / 60 / 60) % 24);
      if (shouldTruncate) {
        return `${day} ${day === 1 ? 'day' : 'days'}`;
      } else {
        return `${day} ${day === 1 ? 'day' : 'days'}${hr === 0 ? '' : hr == 1 ? ' 1 hr' : ` ${hr} hrs`}`;
      }
    }
  } else {
    return 'Ended';
  }
}

export function hashFormat(hash) {
  if (hash === "") {
    return "";
  }
  if (hash.length > 12) {
    return `${hash.slice(0, 7)}....${hash.slice(-5)}`;
  } else {
    return hash;
  }
}
