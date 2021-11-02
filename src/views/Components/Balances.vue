<template>
  <div class="align-items-center">
    <div class="currency-icon" v-if="hasImg">
      <img v-if="customToken" :src="getCustomToken(customToken)" :alt="customToken" />
      <img v-else :src="icon" :alt="symbol" />
    </div>
    <el-tooltip
      class="item"
      effect="light"
      popper-class="price-tooltip"
      :disabled="(!hasTooltip || !this.price)"
      placement="top"
    >
      <div slot="content" v-if="hasPrice"> {{"$" + this.price }}</div>
      <div class="currency-num">
        <span v-if="hasMinus">-</span>
        <span class="num">{{ amount | toThousandslsFilter }} </span>
        <span v-if="customToken">{{
          customToken
        }}</span>
        <span v-else-if="hasSymbol">{{
          symbol
        }}</span>
      </div>
    </el-tooltip>
    <div v-if="hasPrice && !hasTooltip" class="usd-price">
      {{ usd }}
    </div>
    <div v-if="hasPercent" class="percent">
      {{ percent }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dai from "Assets/images/token/dai.png";
import eth from "Assets/images/token/eth.png";
import uni from "Assets/images/token/uni.png";
import usdt from "Assets/images/token/usdt.png";
import wbtc from "Assets/images/token/wbtc.png";
import zrx from "Assets/images/token/zrx.png";
import { formatSymbol, formatSource, getCurrencyTokenDetail } from "Utils/tools";
import { toThousandslsFilter } from "Utils/filters";
import { fmtNumber4Digits } from "Utils/format";
export default {
  props: {
    amount: {
      type: [String, Number],
      default: "0",
    },
    block: {
      type: [String, Number],
    },
    hasImg: {
      type: Boolean,
      default: true,
    },
    hasPercent: {
      type: Boolean,
      default: true,
    },
    hasPrice: {
      type: Boolean,
      default: false,
    },
    hasTooltip: {
      type: Boolean,
      default: false,
    },
    recentPrice: {
      type: Boolean,
      default: false,
    },
    hasSymbol: {
      type: Boolean,
      default: true,
    },
    hasMinus: {
      type: Boolean,
      default: false,
    },
    percent: {
      type: [String, Number],
      default: "",
    },
    customToken: {
      type: String,
      default: ""
    },
    module: {
      type: String,
      default: "balances",
    },
  },
  data() {
    return {
      price: "",
      tokenList: {
        'dai': dai,
        'eth': eth,
        'uni': uni,
        'usdt': usdt,
        'wbtc': wbtc,
        'zrx': zrx,

      }
    };
  },
  watch: {
    amount(newValue) {
      if (newValue && this.hasPrice) {
        this.getUSDPrice();
      }
    }
  },
  filters: {
    toThousandslsFilter,
  },
  computed: {
    ...mapState({
      sourceSelected: (state) => state.global.sourceSelected,
      token: (state) => state.polka.token,
    }),
    usd: function () {
      if (this.price) {
        return "($" + this.price + ")";
      } else {
        return "";
      }
    },
    tokenDetail() {
      return getCurrencyTokenDetail(this.token, this.sourceSelected, "ring");
    },
    symbol: function () {
      return this.formatSymbol(this.module, {
        block: this.block,
      });
    },
    icon: function () {
      return this.formatSource(this.module, "icon");
    },
  },
  created() {
    if (this.hasPrice) {
      this.getUSDPrice();
    }
  },
  methods: {
    toThousandslsFilter,
    getCustomToken(customToken) {
      let name = customToken && customToken.toLowerCase();
      if (this.tokenList[name]) {
        return this.tokenList[name]
      } else {
        return this.icon;
      }
    },
    async getUSDPrice() {
      if ((+this.amount) && (+this.amount !== 0)) {
        if (this.recentPrice) {
          let total = this.amount * this.tokenDetail.price;
          this.price = toThousandslsFilter(fmtNumber4Digits(total, 2));
        } else {
          let time = +this.block;
          const data = await this.$api["polkaPriceConverter"]({
            value: +this.amount,
            from: this.getSymbol("balances"),
            quote: "USD",
            time: time,
          });
          if (data) {
            this.price = toThousandslsFilter(fmtNumber4Digits(data.output, 2));
          }
        }
      }
    },
    getSymbol(module) {
      if (this.sourceSelected === "polkadot") {
        return "DOT";
      } else {
        return this.formatSource(module, "value");
      }
    },
    formatSymbol(module, params) {
      return formatSymbol(module, this.$const, this.sourceSelected, params);
    },
    formatSource(module, type) {
      return formatSource(module, type, this.$const, this.sourceSelected)
    }
  },
};
</script>

<style lang="scss" scoped>
.currency-icon {
  margin-right: 10px;
  img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    transform: translateY(-2px);
  }
}
.currency-num {
  .num {
    word-break: break-all;
  }
}
.usd-price {
  margin-left: 10px;
}
.percent {
  margin-left: 5px;
}
</style>
