<template>
  <div class="crowdloan-wrapper">
    <div class="connect-section">
      <div>
        <div v-if="isApiReady && hasExtentionAccount">
          <div class="signer-section">
            <div>
              <identicon :size="50" theme="polkadot" :value="signer" />
            </div>
            <div class="detail-section">
              <div class="signer">
                <el-select :value="signer" placeholder="" @change="changeSigner" ref="extensionAccountSelect">
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
                        :hasHashFormat="isMobile"
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
                    :iconSize="22"
                    :hasIdenticon="false"
                    :address="signer"
                    :hasDisplayNameInfo="true"
                    :hasCopyBtn="false"
                  ></address-display>
                  <icon-svg class="icon switch-icon" icon-class="switch" />
                </div>
              </div>
              <div class="amount-section">
                <span class="available-amount">{{ amountPlaceholder }}</span>
                <span class="contributed-amount">{{ contributedPlaceholder }}</span>
              </div>
            </div>
            <!-- <span class="available-amount" v-if="signer">{{ amountPlaceholder }}</span> -->
          </div>
        </div>
        <el-button
          v-else-if="isLoading"
          :loading="isLoading"
          class="button black-btn connect-btn"
          @click="initPolkaApi"
        >
          {{ $t('polkadot.api_connecting') }}
        </el-button>
        <el-button v-else class="button black-btn connect-btn" @click="initPolkaApi">
          {{ $t('polkadot.connect') }}
        </el-button>
        <div class="form-section">
          <el-form
            :model="form"
            ref="contributeForm"
            label-position="top"
            class="contribute-form"
            @submit.native.prevent
          >
            <el-form-item :label="$t('contribute.value')" :label-width="formLabelWidth">
              <el-input v-model="form.contributeAmount" @keyup.enter.native="submitContribute">
                <template slot="append">{{ tokenSymbol }}</template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="hasSignature" :label="$t('contribute.signature')" :label-width="formLabelWidth">
              <el-input v-model="form.signature" autocomplete="off" @keyup.enter.native="submitContribute"></el-input>
            </el-form-item>
            <div class="memo-switch" v-if="referralLink">
              <el-switch v-model="form.hasMemo" :inactive-text="$t('contribute.subscan_referral')"> </el-switch>
            </div>
            <template v-else>
              <div class="memo-switch">
                <el-switch v-model="form.hasMemo" :inactive-text="$t('contribute.add_memo')"> </el-switch>
              </div>
              <el-form-item v-if="form.hasMemo" :label="$t('contribute.memo')" :label-width="formLabelWidth">
                <el-input v-model="form.memo" autocomplete="off" @keyup.enter.native="submitContribute"></el-input>
              </el-form-item>
            </template>
          </el-form>
          <div class="action-btns">
            <el-button
              :disabled="!(isApiReady && hasExtentionAccount)"
              class="button black-btn"
              @click.stop="submitContribute"
              :loading="isContributeLoading"
              >{{ $t('contribute.index') }}</el-button
            >
          </div>
        </div>
        <div class="github">
          <a class="github-pr-btn" target="_blank" href="https://github.com/itering/subscan-crowdloan-tools">
            {{ $t('contribute.view') }}
            <span class="link">{{ $t('contribute.source_code') }}</span>
            <icon-svg icon-class="github-black" class="icon" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Identicon from '@polkadot/vue-identicon';
import { fmtNumber4Digits } from 'Utils/format';
import { accuracyFormat } from 'Utils/filters';
import { isMobile } from "Utils/tools";
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { encodeAddress } from '@polkadot/util-crypto';
import { ApiPromise, WsProvider } from '@polkadot/api';
import Bignumber from 'bignumber.js';
import BN from 'bn.js';
import AddressDisplay from '@/views/Components/AddressDisplay';
import LinkWrapper from '@/views/Components/LinkWrapper';
import _ from 'lodash';
export default {
  name: 'CrowdloanContribute',
  components: {
    AddressDisplay,
    // eslint-disable-next-line vue/no-unused-components
    LinkWrapper,
    Identicon,
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
    fundId() {
      return this.$route.query.fundId || '';
    },
    network() {
      return this.$route.query.network || 'polkadot';
    },
    tokenSymbol() {
      return (this.chainState.tokenSymbol && this.chainState.tokenSymbol[0]) || '';
    },
    tokenDecimal() {
      return (this.chainState.tokenDecimals && this.chainState.tokenDecimals[0]) || '';
    },
    isMobile() {
      return isMobile();
    },
    referralLink() {
      let result = '';
      let referralConfig = this.$const['COMMON/networkList']['referralLinks'];
      let networkReferralConfig = referralConfig && referralConfig[this.network];
      if (networkReferralConfig) {
        result = networkReferralConfig[this.paraId];
      }
      return result;
    },
    contributedPlaceholder() {
      let result = '';
      if (this.contributedAmount) {
        result = this.$t('contribute.contributed') + ': ' + this.contributedAmount + ' ' + this.tokenSymbol;
      }
      return result;
    },
    amountPlaceholder() {
      let result = '0';
      _.forEach(this.extentionList, (account) => {
        if (account.address === this.signer) {
          result = account.balance || 0;
        }
      });
      return this.$t('contribute.available') + ': ' + result + ' ' + this.tokenSymbol;
    },
  },
  watch: {},
  data() {
    return {
      extentionList: [],
      signer: '',
      contributedAmount: '',
      polkaApi: null,
      isApiReady: false,
      isLoading: false,
      isContributeLoading: false,
      chainState: {
        ss58Format: '',
        tokenDecimals: [],
        tokenSymbol: [],
      },
      hasSignature: false,
      form: {
        hasMemo: false,
        signature: '',
        memo: '',
        contributeAmount: '',
      },
      networkConfig: {
        polkadot: {
          wss: 'wss://rpc.polkadot.io/',
        },
        kusama: {
          wss: 'wss://kusama-rpc.polkadot.io',
        },
      },
      formLabelWidth: '120px',
    };
  },
  created() {
    this.checkSignature();
    // this.initPolkaApi();
    // this.initPolkadotJs();
  },

  mounted() {},

  methods: {
    accuracyFormat,
    fmtNumber4Digits,
    checkSignature() {
      let signatureConfig = this.$const['COMMON/networkList']['hasSignature'];
      let networkSignatureList = signatureConfig && signatureConfig[this.network];
      if (networkSignatureList && networkSignatureList.indexOf(this.paraId) > -1) {
        this.hasSignature = true;
      }
      if (this.referralLink) {
        this.form.hasMemo = true;
      }
    },
    async initPolkaApi() {
      this.isLoading = true;
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
      if (_.isEmpty(window.injectedWeb3)) {
        window.injectedWeb3 = window.parent.injectedWeb3 || {};
      }
      await web3Enable('subscan.io');
      const allAccounts = await web3Accounts();
      _.forEach(allAccounts, (account) => {
        if (account.address) {
          account.address = encodeAddress(account.address, this.chainState.ss58Format);
        }
      });
      this.extentionList = allAccounts;
      if (allAccounts && allAccounts.length > 0) {
        let signer = allAccounts[0].address || '';
        this.changeSigner(signer);
      }
      this.isLoading = false;
      this.getAccountBalance();
    },
    async getSignerContribute() {
      this.contributedAmount = '';
      const data = await this.$api['polkaGetParachainContributes']({
        row: 100,
        page: 0,
        who: this.signer,
        para_id: +this.paraId
      }).catch(() => {});
      if (data && data.count > 0) {
        _.forEach(data.contributes, (contribute) => {
          if (contribute.fund_id === this.fundId) {
            let amount = fmtNumber4Digits(
              accuracyFormat(contribute.contributed, this.chainState.tokenDecimals && this.chainState.tokenDecimals[0]),
              4
            );
            this.contributedAmount = amount;
          }
        });
      }
    },
    getAccountBalance() {
      let addressList = _.map(this.extentionList, 'address');
      this.polkaApi.query.system.account.multi(addressList, (balances) => {
        _.forEach(balances, ({ data }, index) => {
          this.extentionList[index]['balance'] = fmtNumber4Digits(
            accuracyFormat(data.free.toString(), this.chainState.tokenDecimals && this.chainState.tokenDecimals[0]),
            4
          );
        });
      });
    },
    changeSigner(signer) {
      this.signer = signer;
      this.getSignerContribute();
    },
    selectExtensionAccount() {
      this.$refs['extensionAccountSelect'].toggleMenu();
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
        return new BN(TEN.pow(new Bignumber(decimal)).times(value).toFixed(0, 1));
      } catch (error) {
        console.log('utils error:', error);
        return new BN(0);
      }
    },
    async submitContribute() {
      this.isContributeLoading = true;
      let self = this;
      let signature = null;
      if (this.hasSignature) {
        signature = {
          Sr25519: this.form.signature,
        };
      }
      try {
        const injector = await web3FromAddress(this.signer);
        this.polkaApi.setSigner(injector.signer);
        let tx = this.polkaApi.tx.crowdloan.contribute(
          this.paraId,
          this.inputToKSMBN(this.form.contributeAmount),
          signature
        );
        let memo = this.form.memo || this.referralLink;
        if (this.form.hasMemo && memo) {
          let txs = [
            this.polkaApi.tx.crowdloan.contribute(
              this.paraId,
              this.inputToKSMBN(this.form.contributeAmount),
              signature
            ),
            this.polkaApi.tx.crowdloan.addMemo(this.paraId, memo),
          ];
          tx = this.polkaApi.tx.utility.batchAll(txs);
        }
        let unsub = await tx.signAndSend(this.signer, async ({ events = [], status }) => {
          if (status.isInBlock) {
            let block = await this.polkaApi.rpc.chain.getBlock(status.asInBlock);
            let extrinsics = block['block']['extrinsics'];
            let height = block['block']['header']['number'];
            let extrinsicIndex = '';
            events.forEach(({ event: { method, section } }) => {
              if (method === 'ExtrinsicSuccess' && section === 'system') {
                _.forEach(extrinsics,  (extrinsic, idx)=>{
                  if (tx.signature && (extrinsic.signature.toHex() === tx.signature.toHex())) {
                    extrinsicIndex = height.toString() + '-' + idx;
                    return false;
                  }
                })
                if (extrinsicIndex) {
                  const h = this.$createElement;
                  self.$msgbox({
                    title: this.$t('contribute.success'),
                    confirmButtonText: this.$t('ok'),
                    center: true,
                    showClose: false,
                    confirmButtonClass: 'black-btn',
                    message: h('p', null, [
                      h('span', null, this.$t('contribute.check_extrinsic')),
                      h(LinkWrapper, {props: {text: extrinsicIndex, href: `https://${this.network}.subscan.io/extrinsic/${extrinsicIndex}`}})
                    ]),
                  });
                } else {
                  self.$msgbox({
                    title: this.$t('contribute.success'),
                    confirmButtonText: this.$t('ok'),
                    center: true,
                    showClose: false,
                    confirmButtonClass: 'black-btn',
                    message: this.$t('transaction_success_content')
                  });
                }
                if (status.isFinalized) {
                  unsub && unsub();
                }
                this.isContributeLoading = false;
              }
              if (method === 'ExtrinsicFailed' && section === 'system') {
                self.$msgbox({
                  title: this.$t('transaction_failed_title'),
                  confirmButtonText: this.$t('ok'),
                  center: true,
                  showClose: false,
                  confirmButtonClass: 'black-btn',
                  message: this.$t('transaction_failed_content'),
                });
                this.isContributeLoading = false;
              }
            });
          }
          // }
        });
      } catch (e) {
        console.log(e);
        self.$msgbox({
          title: this.$t('transaction_failed_title'),
          confirmButtonText: this.$t('ok'),
          center: true,
          showClose: false,
          confirmButtonClass: 'black-btn',
          message: e,
        });
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
    > div {
      flex: 1;
    }
    .button {
      cursor: pointer;
      display: inline-block;
      // margin-top: 10px;
      background: #302b3c;
      border: 1px solid #302b3c;
      border-radius: 2px;
      color: #fff;
      font-weight: bold;
      font-size: 14px;
      &.is-disabled {
        color: #fbfbfb;
        cursor: not-allowed;
        background-image: none;
        background-color: #d8d8d8;
        border-color: #d8d8d8;
      }
    }
    .connect-btn {
      padding: 8px 22px;
      margin-bottom: 15px;
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
            color: var(--main-color);
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
      .detail-section {
        margin-left: 10px;
      }
      .amount-section {
        .contributed-amount {
          margin-left: 20px;
        }
      }
    }
    .form-section {
      .contribute-form {
        .memo-switch {
          margin-bottom: 20px;
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
    .github {
      margin-top: 12px;
      margin-right: 3px;
      text-align: right;
      .github-pr-btn {
        display: inline-flex;
        font-size: 14px;
        .icon {
          font-size: 20px;
        }
        .link {
          color: var(--link-color);
          margin: 0 5px;
        }
      }
    }
    .tip {
      font-size: 14px;
    }
  }
  @media screen and (max-width: $screen-xs) {
    // display: flex;
    // justify-content: center;
    .connect-section {
      .signer-section {
        .signer {
          .signer-account {
            .switch-icon {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-select-dropdown {
  .account-box {
    a {
      color: var(--main-color);
      pointer-events: none;
    }
  }
}
.contribute-dropdown-item {
  height: auto;
  line-height: auto;
  padding: 5px 20px;
}
.el-message-box {
  .el-message-box__title {
    color: var(--black-color);
    font-weight: bold;
  }
  .el-message-box__content {
    color: var(--black-color);
    font-weight: bold;
  }
  .black-btn {
    cursor: pointer;
    background: var(--main-button-color);
    border-color: var(--main-button-color);
    border-radius: 2px;
    color: var(--white);
    transition: opacity 0.1s;
    padding: 9px 50px;
    font-weight: bold;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 1;
    }
    &.is-disabled {
      color: #FBFBFB;
      cursor: not-allowed;
      background-image: none;
      background-color: #D8D8D8;
      border-color: #D8D8D8;
    }
  }
}
@media screen and (max-width: $screen-xs) {
  .el-message-box {
    width: 300px;
  }
}
</style>
