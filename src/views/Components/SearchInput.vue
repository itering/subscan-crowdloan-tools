<template>
  <div class="search-input-wrapper">
    <el-input
      class="search-input"
      :placeholder="getWaterMark()"
      v-model.trim="inputValue"
      @keyup.enter.native="search"
    >
      <el-select
        class="search-select"
        popper-class="search-select-out"
        v-model="selectValue"
        slot="prepend"
        v-if="!isMini"
      >
        <el-option
          class="search-select-option"
          v-for="item in getSelectList()"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        class="search-button"
        slot="append"
        @click="search"
        :loading="isBtnLoading"
      >{{$t('search')}}</el-button>
      <el-button class="search-button-mobile" slot="append" @click="search" :loading="isBtnLoading">
        <icon-svg class="icon" icon-class="search" />
      </el-button>
    </el-input>
  </div>
</template>

<script>
const bs58 = require("bs58");
import { trimSpecialChar } from "Utils/format";
export default {
  data() {
    return {
      inputValue: "",
      selectValue: "",
      waterMark: "",
      isOnSearch: false,
      isBtnLoading: false
    };
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    selectList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    selectVal: {
      type: String,
      default: ""
    },
    isMini: {
      type: Boolean,
      default: false
    }
  },
  watch: {
  },
  created() {
    if (this.selectVal) {
      this.selectValue = this.selectVal;
    } else {
      let list = this.getSelectList();
      this.selectValue = list[0] ? list[0].value : "";
    }
  },
  computed: {
    selectListFilter() {
      let list = this.getSelectList();
      return list.filter(item => {
        return item.value !== this.selectValue;
      });
    }
  },
  methods: {
    trimSpecialChar,
    ss58Check(ss58) {
      //增加类型2
      // const KNOWN_TYPES = [0, 1, 2, 42, 43, 68, 69];
      let a;
      try {
        a = bs58.decode(ss58);
      } catch (e) {
        return false;
      }
      // let type = a[0];
      // if (KNOWN_TYPES.indexOf(type) === -1) {
      //   return false;
      // }
      if (a.length < 3) {
        return false;
        //throw new Error('Invalid length of payload for address', a.length)
      }
      return true;
    },
    search() {
      let blockNumReg = /^[0-9]+$/;
      let extrinsicNumReg = /^[0-9]+-[0-9]+$/;
      let blockHashOrExtrinsicHashReg = /^0x[0-9a-fA-F]{64}$/;
      if (this.inputValue) {
        this.inputValue = this.trimSpecialChar(this.inputValue);
      } else {
        return;
      }
      if (this.selectValue === "event") {
        this.$api["polkaGetEventByKey"]({
          event_index: this.inputValue
        })
          .then(res => {
            if (res.extrinsic_hash) {
              this.$router.push(
                `/extrinsic/${res.extrinsic_hash}?event=${res.block_num}-${res.event_idx}`
              );
            } else {
              this.$router.push(
                `/extrinsic/${res.event_index}?event=${res.block_num}-${res.event_idx}`
              );
            }
          })
          .catch(() => {
            this.$router.push(`/noData?event=${this.inputValue}`);
          });
      } else {
        if (blockNumReg.test(this.inputValue)) {
          // blockNum
          this.$router.push(`/block/${this.inputValue}`);
        } else if (extrinsicNumReg.test(this.inputValue)) {
          // extrinsicNum
          this.$router.push(`/extrinsic/${this.inputValue}`);
        } else if (blockHashOrExtrinsicHashReg.test(this.inputValue)) {
          // blockHashOrExtrinsicHash
          this.isBtnLoading = true;
          this.$api["polkaCheckHash"]({
            hash: this.inputValue
          })
            .then(res => {
              this.isBtnLoading = false;
              if (res.hash_type === 'evm') {
                this.$router.push(`/tx/${this.inputValue}`);
              } else {
                this.$router.push(`/${res.hash_type}/${this.inputValue}`);
              }
            })
            .catch(() => {
              this.isBtnLoading = false;
              this.$router.push(`/noData?hash=${this.inputValue}`);
            });
        } else {
          if (this.ss58Check(this.inputValue)) {
            this.$router.push(`/account/${this.inputValue}`);
          } else {
            this.$api["polkaGetSearchRes"]({
              key: this.inputValue,
              row: 1,
              page: 0
            })
              .then(() => {
                this.$router.push(`/account/${this.inputValue}`);
              })
              .catch(() => {
                this.$router.push(`/noData`);
              });
          }
        }
      }
    },
    getWaterMark() {
      let waterMark = this.placeholder;
      if (this.selectValue === "event") {
        waterMark = this.$t("placeholder.event");
      }
      return waterMark;
    },
    getSelectList() {
      return [
        {
          label: this.$t("all"),
          value: "all"
        },
        {
          label: this.$t("block"),
          value: "block"
        },
        {
          label: this.$t("extrinsic"),
          value: "extrinsic"
        },
        {
          label: this.$t("account"),
          value: "account"
        },
        {
          label: this.$t("event"),
          value: "event"
        }
      ];
    }
  }
};
</script>

 <style lang="scss" scoped>
.search-input-wrapper {
  .search-input {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    .search-select {
      width: 110px;
      height: 100%;
    }
    .search-button {
      height: 100%;
      width: 110px;
      background: var(--main-button-color);
      color: var(--black-btn-text);
      font-size: 14px;
      font-weight: 600;
      border-radius: 0 0px 0px 0;
    }
    .search-button-mobile {
      display: none;
      height: 100%;
      width: 50px;
      background: var(--main-button-color);
      color: var(--black-btn-text);
      font-size: 30px;
      font-weight: 600;
      border-radius: 0 0px 0px 0;
      padding: 0;
    }
  }
}
</style>
<style lang="scss">
.search-input-wrapper {
  .el-input__inner {
    height: 50px;
    line-height: 1.5;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: var(--white);
  }
  .el-input-group__append {
    background-color: var(--main-button-color);
    border-color: var(--main-button-color);
    overflow: hidden;

    .el-button.is-loading:before {
      right: -2px;
    }
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus,
  .el-input__inner:hover {
    border-color: var(--input-border-color);
  }
  .el-input {
    .el-input__inner::placeholder {
      font-size: 14px;
      font-weight: 600;
      color: rgba(179, 179, 179, 1);
    }
  }
  .search-select {
    .el-input {
      .el-input__inner {
        text-align: center;
        font-size: 14px;
        line-height: 50px;
        font-weight: 600;
        color: var(--black-color);
      }
    }
    .el-input:hover {
      .el-input__inner {
        color: var(--black-color);
      }
    }
  }
  @media screen and (max-width: $screen-xs) {
    .search-input {
      .el-input-group__append {
        .search-button {
          display: none;
        }
        .search-button-mobile {
          display: block;
        }
      }
    }
    .el-input-group__prepend {
      display: none;
    }
    .el-input__inner {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .el-input-group__append {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
.search-select-out {
  margin-top: 0 !important;
  font-size: 14px;
  font-weight: 600;
  color: var(--black-color);
  .popper__arrow {
    display: none;
  }
  .el-select-dropdown__item.search-select-option.selected {
    color: var(--main-color);
    display: none;
  }
}
</style>
