<template>
  <div id="app" :class="[sourceSelected]">
    <router-view />
  </div>
</template>

<script>
// import Navbar from "Views/Layout/Navbar";
// import FooterBar from "Views/Layout/FooterBar";
const queryString = require("query-string");
import { mapState } from "vuex";
import { NETWORK_LIST } from "Config";
export default {
  name: "App",
  components: {
  },
  data() {
    return {
      network: NETWORK_LIST,
      dialogVisible: false,
      polkadotInstallLink:
        "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
    };
  },
  watch: {
  },
  computed: {
    ...mapState({
      sourceSelected: (state) => state.global.sourceSelected,
      isPolkadotConnect: (state) => state.global.isPolkadotConnect,
      isKeyringLoaded: (state) => state.global.isKeyringLoaded,
    }),
  },
  beforeDestroy() {
  },
  created() {
    // 接受路由中携带语言参数lang
    const parsedObj = queryString.parse(location.search);
    let language = parsedObj["lang"];

    if (language) {
      if (["en", "zh-CN"].indexOf(language) === -1) {
        // 浏览器语言不在列表中
        language = "en";
      }
      this.$store.dispatch("SetLanguage", language);
      this.$i18n.locale = language;
    }
  },
  mounted() {
    window.GLOBAL.vbus.$on("CHANGE_LANGUAGE", (language) => {
      this.$i18n.locale = language;
    });
    document.getElementsByTagName("body")[0].className = this.sourceSelected;
  },
  methods: {
    init() {
    },
    detectNetwork() {
      const parsedObj = queryString.parse(location.search);
      const networkParam = parsedObj["network"] || "polkadot";
      this.$store.dispatch("SetSourceSelected", networkParam);
    },
  },
};
</script>
<style lang='scss' scoped>
.main {
}
</style>
<style lang="scss">
@import "./assets/style/index.scss";
html {
  --black-color: #302b3c;
  --border-color: #e7eaf3;
  --input-border-color: #dcdfe6;
  --white: #fff;
  --black-btn-text: #fff;
  --table-bg: #f3f5f9;
  --table-text-color: #363636;
  --btn-border-color: #dbdbdb;
  --main-bg: #f8f9fa;
  --menu-item-color: #212529;
  --menu-item-hover-color: #16181b;
  --sub-title-color: #2a2727;
}
body {
  &.kusama {
    --main-color: #e90979;
    --main-color-dark: #e90979cc;
    --main-color-light: #e9097980;
    --main-color-super-light: #e909794d;
    --main-color-bg-light: #e9097933;
    --main-color-white: #e909790d;
    --main-button-color: var(--black-color);
    --link-color: #4572de;
    --navbar-bg: linear-gradient(
      315deg,
      rgba(254, 56, 118, 1) 0%,
      rgba(230, 1, 122, 1) 71%,
      rgba(230, 1, 122, 1) 100%
    );
  }

  &.polkadot {
    --main-color: #e90979;
    --main-color-dark: #e90979cc;
    --main-color-light: #e9097980;
    --main-color-super-light: #e909794d;
    --main-color-bg-light: #e9097933;
    --main-color-white: #e909790d;
    --main-button-color: var(--black-color);
    --link-color: #4572de;
    --navbar-bg: linear-gradient(
      315deg,
      rgba(254, 56, 118, 1) 0%,
      rgba(230, 1, 122, 1) 71%,
      rgba(230, 1, 122, 1) 100%
    );
  }

  .el-select-dropdown__item.selected {
    color: inherit;
    font-weight: inherit;
  }
  .copy-icon {
    color: var(--main-color-light);
    font-size: 10px;
    min-width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--main-color-bg-light);
    border-radius: 50%;
  }
}
#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .nav-bar {
    flex: none;
  }
  .footer-bar {
    flex: none;
  }
  .main {
    flex: auto;
    background: #f8f9fa;
    position: relative;
  }
  .subscan-content {
    padding: 20px 0;
    overflow: scroll;
  }
  .subscan-card-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 10px;
  }
  .subscan-card {
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    border: 1px solid rgba(231, 234, 243, 1);
  }
  .not-found-img {
    display: block;
    margin: 0 auto;
    width: 290px;
    height: 250px;
  }
  .token-symbol {
    margin-left: 4px;
  }
  .link {
    cursor: pointer;
    color: var(--link-color);
  }
  .button {
    display: inline-block;
  }
  .white-btn {
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid var(--main-color);
    font-size: 14px;
    font-weight: 600;
    color: var(--main-color);
  }
  .main-btn {
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid var(--main-color);
    background-color: var(--main-color);
    font-size: 14px;
    font-weight: 600;
    color: var(--white);
    transition: opacity 0.1s;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 1;
    }
  }
  .el-table {
    &::before {
      background-color: transparent;
    }
    tr:last-child {
      &.el-table__row {
        > td {
          border-bottom: none;
        }
      }
    }
    th.is-sortable {
      > .cell {
        display: inline-flex;
        align-items: center;
        .caret-wrapper {
          margin-top: 0.3em;
        }
      }
    }
    .el-table__header-wrapper {
      th,
      tr {
        box-sizing: border-box;
        height: 44px;
        background: #f3f5f9;
        font-size: 14px;
        font-weight: bold;
        color: var(--black-color);
      }
      th {
        padding: 0;
        border: none;
      }
    }
    .el-table__body-wrapper {
      .el-table__body tr:hover > td {
        background: none;
      }
      tr {
        box-sizing: border-box;
        height: 50px;
        font-size: 14px;
        color: var(--black-color);
      }
      td {
        padding: 0;
      }
    }
    .el-table__expanded-cell {
      background: #f3f5f9;
      &:hover {
        background: #f3f5f9 !important;
      }
    }
    .expand-form {
      background: #f3f5f9;
      padding: 20px;
      .form-item {
        min-height: 40px;
        font-size: 14px;
        color: rgba(48, 43, 60, 1);
        .label {
          min-width: 140px;
        }
        .value {
          width: 900px;
          word-break: break-all;
        }
      }
    }
  }
  .el-input-number {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
  .link {
    a {
      color: var(--link-color);
    }
  }
  @media screen and (max-width: $screen-xs) {
    .main {
      padding-left: 20px;
      padding-right: 20px;
      &.is-subscan-home {
        padding: 0;
      }
    }
    > .nav-bar-wrapper {
      // height: 125px;
      &.is-home-page {
        // height: 125px;
        .nav-bar-search {
          margin-top: 10px;
        }
      }
      .nav-bar-search {
        display: block;
        padding: 0 20px;
        margin-top: 10px;
        > div.search-input-wrapper {
          width: 100%;
        }
      }
      .subscan-container {
        height: 50px;
      }
    }
    .subscan-container {
      .search-input-wrapper {
        display: none;
      }
    }
  }
}
</style>
