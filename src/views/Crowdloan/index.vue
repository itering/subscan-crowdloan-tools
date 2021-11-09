<template>
  <div class="crowdloan-wrapper">
    <div class="connect-section">
      <div v-if="isApiReady">
        <div
          v-if="!hasExtentionAccount"
          class="button black-btn"
          @click="initPolkadotJs"
        >
          {{ $t("polkadot.connect") }}
        </div>
        <div v-else>
          <div class="signer-section">
            <div class="signer">
              <el-select
                :value="signer"
                placeholder=""
                @change="changeSigner"
                ref="extensionAccountSelect"
              >
                <el-option
                  class="contribute-dropdown-item"
                  v-for="item in this.extentionList"
                  :key="item.address"
                  :label="item.address"
                  :value="item.address"
                >
                  <div class="account-box">
                    <address-display
                      customCls="address-display-cls"
                      :hasAddressWrapper="true"
                      :hasHashFormat="true"
                      :isVertical="true"
                      :iconSize="30"
                      :address="item.address"
                      :hasDisplayNameInfo="true"
                      :hasCopyBtn="false"
                      :displayNameInfo="getAccountDisplayInfo(item)"
                    ></address-display>
                  </div>
                </el-option>
              </el-select>
              <div class="signer-account" @click="selectExtensionAccount">
                <address-display
                  customCls="address-display-cls"
                  :hasHashFormat="true"
                  :iconSize="22"
                  :address="signer"
                  :hasDisplayNameInfo="true"
                  :hasCopyBtn="false"
                ></address-display>
                <icon-svg class="icon" icon-class="switch" />
              </div>
            </div>
            <!-- <span class="available-amount" v-if="signer">{{ amountPlaceholder }}</span> -->
          </div>
          <div class="form-section">
            <el-form
              :model="form"
              ref="contributeForm"
              label-position="top"
              class="contribute-form"
            >
              <el-form-item :label="$t('value')" :label-width="formLabelWidth">
                <el-input
                  :placeholder="amountPlaceholder"
                  v-model="form.contributeAmount"
                >
                  <template slot="append">{{ tokenSymbol }}</template>
                </el-input>
              </el-form-item>
              <div class="memo-switch">
                <el-switch
                  v-model="form.hasMemo"
                  :inactive-text="$t('contribute.add_memo')"
                >
                </el-switch>
              </div>
              <el-form-item
                v-if="form.hasMemo"
                :label="$t('contribute.memo')"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.memo" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div class="action-btns">
              <el-button
                class="button main-btn"
                @click.stop="submitContribute"
                :loading="isContributeLoading"
                >{{ $t("contribute.index") }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <div v-else class="tip">
        {{ $t("polkadot.api_connecting") }}
      </div>
    </div>
  </div>
</template>

<script>
import { fmtNumber4Digits } from "Utils/format";
import { accuracyFormat } from "Utils/filters";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { encodeAddress } from "@polkadot/util-crypto";
import { ApiPromise, WsProvider } from "@polkadot/api";
import Bignumber from "bignumber.js";
import BN from "bn.js";
import AddressDisplay from "@/views/Components/AddressDisplay";
import _ from "lodash";
export default {
  name: "CrowdloanContribute",
  components: {
    AddressDisplay,
  },
  props: {},
  computed: {
    hasExtentionAccount() {
      let result = false;
      if (this.extentionList && this.extentionList.length > 0) {
        result = true;
      }
      return result;
    },
    paraId() {
      return this.$route.query.paraId || '';
    },
    network() {
      return this.$route.query.network || 'polkadot';
    },
    tokenSymbol() {
      return (
        (this.chainState.tokenSymbol && this.chainState.tokenSymbol[0]) || ""
      );
    },
    tokenDecimal() {
      return (
        (this.chainState.tokenDecimals && this.chainState.tokenDecimals[0]) ||
        ""
      );
    },
    amountPlaceholder() {
      let result = "0";
      _.forEach(this.extentionList, (account) => {
        if (account.address === this.signer) {
          result = account.balance || 0;
        }
      });
      return (
        this.$t("charts.available") + ": " + result + " " + this.tokenSymbol
      );
    },
  },
  watch: {},
  data() {
    return {
      extentionList: [],
      signer: "",
      polkaApi: null,
      isApiReady: false,
      isContributeLoading: false,
      chainState: {
        ss58Format: "",
        tokenDecimals: [],
        tokenSymbol: [],
      },
      form: {
        hasMemo: false,
        memo: "",
        contributeAmount: "",
      },
      networkConfig: {
        'polkadot': {
          wss: 'wss://rpc.polkadot.io',
        },
        'kusama': {
          wss: 'wss://kusama-rpc.polkadot.io',
        }
      },
      formLabelWidth: "120px",
    };
  },
  created() {
    this.initPolkaApi();
    // this.initPolkadotJs();
  },

  mounted() {},

  methods: {
    accuracyFormat,
    fmtNumber4Digits,
    async initPolkaApi() {
      const provider = new WsProvider(this.networkConfig[this.network]['wss']);
      this.polkaApi = new ApiPromise({
        provider,
      });
      await this.polkaApi.isReady;
      this.isApiReady = true;
      const property = await this.polkaApi.rpc.system.properties();
      this.chainState = property.toHuman();
      this.initPolkadotJs();
    },
    async initPolkadotJs() {
      await web3Enable("subscan");
      const allAccounts = await web3Accounts();
      _.forEach(allAccounts, (account) => {
        if (account.address) {
          account.address = encodeAddress(
            account.address,
            this.chainState.ss58Format
          );
        }
      });
      this.extentionList = allAccounts;
      if (allAccounts && allAccounts.length > 0) {
        let signer = allAccounts[0].address || "";
        this.signer = signer;
      }
      this.getAccountBalance();
    },

    getAccountBalance() {
      let addressList = _.map(this.extentionList, "address");
      this.polkaApi.query.system.account.multi(addressList, (balances) => {
        _.forEach(balances, ({ data }, index) => {
          this.extentionList[index]["balance"] = fmtNumber4Digits(
            accuracyFormat(
              data.free.toString(),
              this.chainState.tokenDecimals && this.chainState.tokenDecimals[0]
            ),
            4
          );
        });
      });
    },
    changeSigner(signer) {
      this.signer = signer;
    },
    selectExtensionAccount() {
      this.$refs["extensionAccountSelect"].toggleMenu();
    },
    getAccountDisplayInfo(item) {
      return {
        address: item.address,
        display: item.meta.name,
      };
    },
    inputToKSMBN(value) {
      let decimal = this.tokenDecimal;
      const TEN = new Bignumber(10);
      if (!value) return new BN(0);
      try {
        return new BN(
          TEN.pow(new Bignumber(decimal)).times(value).toFixed(0, 1)
        );
      } catch (error) {
        console.log("utils error:", error);
        return new BN(0);
      }
    },
    async submitContribute() {
      this.isContributeLoading = true;
      let self = this;
      try {
        const injector = await web3FromAddress(this.signer);
        this.polkaApi.setSigner(injector.signer);
        let tx = this.polkaApi.tx.crowdloan.contribute(
          this.paraId,
          this.inputToKSMBN(this.form.contributeAmount),
          null
        );
        if (this.form.hasMemo && this.form.memo) {
          let txs = [
            this.polkaApi.tx.crowdloan.contribute(
              this.paraId,
              this.inputToKSMBN(this.form.contributeAmount),
              null
            ),
            this.polkaApi.tx.crowdloan.addMemo(this.paraId, this.form.memo),
          ];
          tx = this.polkaApi.tx.utility.batchAll(txs);
        }
        let unsub = await tx.signAndSend(
          this.signer,
          ({ events = [], status }) => {
            // if (status.isFinalized) {
            events.forEach(({ event: { method, section } }) => {
              if (method === "ExtrinsicSuccess" && section === "system") {
                self.$notify({
                  title: this.$t("transaction_success_title"),
                  message: this.$t("transaction_success_content"),
                  type: "success",
                });
                if (status.isFinalized) {
                  unsub && unsub();
                }
                this.isContributeLoading = false;
              }
              if (method === "ExtrinsicFailed" && section === "system") {
                self.$notify({
                  title: this.$t("transaction_failed_title"),
                  message: this.$t("transaction_failed_content"),
                  type: "error",
                });
                this.isContributeLoading = false;
              }
            });
            // }
          }
        );
      } catch (e) {
        console.log(e);
        this.isContributeLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scope>
.crowdloan-wrapper {
  .connect-section {
    display: flex;
    .button {
      cursor: pointer;
      display: inline-block;
      margin-top: 10px;
      padding: 10px 50px;
      background: #302b3c;
      border-radius: 2px;
      color: #fff;
    }
    .signer-section {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .signer {
        position: relative;
        cursor: pointer;
        border-radius: 2px;
        // border: 1px solid var(--main-color);
        // padding: 2px 6px 0;
        .signer-account {
          display: flex;
          align-items: center;
          font-size: 14px;
          a {
            pointer-events: none;
          }
          .icon {
            color: var(--main-color);
          }
        }
        .el-select {
          height: 1px;
          width: 1px;
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 10px;
        }
        .extention-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          position: relative;
        }
        .icon {
          margin-left: 5px;
          font-size: 16px;
        }
      }
    }
    .form-section {
      .contribute-form {
        .memo-switch {
          margin-bottom: 15px;
          text-align: right;
          .el-switch__label {
            color: var(--black-color);
            font-weight: bold;
          }
          .el-switch.is-checked .el-switch__core {
            border-color: var(--main-color);
            background-color: var(--main-color);
          }
        }
        .el-form-item {
          margin-bottom: 20px;
          .el-input {
            box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
          }
          .el-input-group {
            box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
          }
        }
        .el-form-item__label {
          font-weight: bold;
          line-height: 20px;
          padding: 0 0 5px;
          color: var(--black-color);
        }
      }
      .action-btns {
        .main-btn {
          width: 100%;
        }
      }
    }
    .tip {
      font-size: 14px;
    }
  }
  @media screen and (max-width: $screen-xs) {
    display: flex;
    justify-content: center;
  }
}
</style>
<style lang="scss">
.el-select-dropdown {
  .account-box {
    a {
      pointer-events: none;
    }
  }
}
.contribute-dropdown-item {
  height: auto;
  line-height: auto;
  padding: 5px 20px;
}
</style>
