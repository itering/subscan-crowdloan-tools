<template>
  <div class="contribute-wrapper">
    <div class="subscan-container">
      <div class="table-top space-between align-items-center">
        <div class="for-block align-items-center">
          <div>{{ $t("parachain.crowdloan") }}</div>
        </div>
      </div>
      <div class="crowdloan-table subscan-card" v-loading="isLoading">
        <el-checkbox-group
          v-model="checkedValidators"
          @change="selectedListChange"
        >
          <el-table :data="filteredParachain" style="width: 100%">
            <el-table-column
              style="background: #fff"
              min-width="40"
              prop="rank_validator"
              label=""
            >
              <template slot-scope="scope">
                <el-checkbox
                  :key="scope.row.para_id"
                  :label="scope.row.para_id"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              min-width="75"
              prop="fund_id"
              :label="$t('parachain.fund_id')"
            >
              <template slot-scope="scope">
                <div class="link">
                  <router-link :to="`/crowdloan/${scope.row.fund_id}`">{{
                    scope.row.fund_id
                  }}</router-link>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="170"
              prop="para_id"
              sortable
              :label="$t('parachain.para_id')"
            >
              <template slot-scope="scope">
                <div class="link para-id">
                  <router-link
                    class="project"
                    :to="`/parachain/${scope.row.para_id}`"
                  >
                    <span class="para-id">{{ scope.row.para_id }}</span>
                    <img
                      v-if="scope.row.logo"
                      :src="scope.row.logo"
                      :alt="scope.row.name"
                    />
                    <img v-else :src="unknownLogo" :alt="scope.row.name" />
                    <span class="project-name">{{ scope.row.name }}</span>
                  </router-link>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="150"
              prop="crowdloan_account"
              :label="$t('parachain.owner')"
            >
              <template slot-scope="scope">
                <address-display
                  customCls="address-display-cls"
                  :hasHashFormat="true"
                  :isTruncate="true"
                  :hasDisplayNameInfo="true"
                  :address="scope.row.owner"
                  :displayNameInfo="scope.row.owner_display"
                  :hasAddressWrapper="false"
                  :hasIdenticon="false"
                ></address-display>
              </template>
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="first_period"
              sortable
              :label="$t('parachain.lease_index')"
            >
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="light"
                  popper-class="lease-index"
                  placement="top"
                >
                  <div slot="content">
                    {{
                      parseLeaseIdx2Time(
                        scope.row.first_period,
                        scope.row.last_period,
                        parachainMetadata.lease_period,
                        metadata.blockNum
                      )
                    }}
                  </div>
                  <span>{{
                    `${scope.row.first_period}-${scope.row.last_period}`
                  }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              min-width="115"
              prop="raised"
              sortable
              :label="
                $t('parachain.fundraised_unit', {
                  symbol: currencyTokenDetail.symbol,
                })
              "
            >
              <template slot-scope="scope">
                <balances
                  :hasPrice="true"
                  :hasImg="false"
                  :hasTooltip="true"
                  :hasSymbol="false"
                  :recentPrice="true"
                  :amount="
                    scope.row.raised
                      | accuracyFormat(currencyTokenDetail.token_decimals)
                      | fmtNumber4Digits(0)
                  "
                ></balances>
              </template>
            </el-table-column>
            <el-table-column
              min-width="105"
              prop="cap"
              sortable
              :label="
                $t('parachain.fund_cap_unit', {
                  symbol: currencyTokenDetail.symbol,
                })
              "
            >
              <template slot-scope="scope">
                <balances
                  :hasPrice="true"
                  :hasImg="false"
                  :hasTooltip="true"
                  :hasSymbol="false"
                  :recentPrice="true"
                  :amount="
                    scope.row.cap
                      | accuracyFormat(currencyTokenDetail.token_decimals)
                      | fmtNumber4Digits(0)
                  "
                ></balances>
              </template>
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="countdown"
              :label="$t('parachain.countdown')"
            >
              <template slot-scope="scope">
                {{
                  scope.row.end_block
                    | countDownByBlock(metadata.blockNum, currentTime)
                }}
              </template>
            </el-table-column>
            <el-table-column
              min-width="115"
              prop="contributors"
              sortable
              :label="$t('parachain.contributor')"
            >
              <template slot-scope="scope">
                <div class="link" v-if="scope.row.contributors">
                  <router-link
                    :to="`/crowdloan/${scope.row.fund_id}?tab=contributor`"
                    >{{ scope.row.contributors }}</router-link
                  >
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <!-- <el-table-column width="80">
              <template slot-scope="scope">
                <div class="expand-btn" @click="handleRuntimeExpand(scope.row)">
                  <div class="el-table__expand-icon">
                    <i class="el-icon el-icon-arrow-right"></i>
                  </div>
                </div>
              </template>
            </el-table-column> -->
          </el-table>
        </el-checkbox-group>
      </div>
      <div class="table-bottom space-between align-items-center">
        <div class="placeholder"></div>
        <pagination
          :page-size="pageSize"
          :total="total"
          :currentPage="+currentPage + 1"
          @currentChange="currentChange"
        />
      </div>
      <div class="fixed-panel">
        <div class="subscan-container">
          <div v-if="!extensionAccountList.length">
            <p>{{ $t("no_polkadotjs_extension") }}</p>
          </div>
          <div v-if="extensionAccountList.length">
            <el-select
              v-model="signer"
              placeholder=""
              ref="extensionAccountSelect"
            >
              <el-option
                class="nominate-dropdown-item"
                v-for="item in extensionAccountList"
                :key="item.address"
                :label="item.address"
                :value="item.address"
              >
                <div class="account-box">
                  <identicon
                    class="identicon"
                    :size="46"
                    theme="polkadot"
                    :value="item.address"
                  />
                  <div class="title">
                    <p>{{ item.meta.name }}</p>
                    <h3>{{ encodeAddress(item.address) | hashFormat}}</h3>
                  </div>
                </div>
              </el-option>
            </el-select>
            <div
              class="account-box account-box-selected"
              @click="selectExtensionAccount"
            >
              <identicon
                class="identicon"
                :size="46"
                theme="polkadot"
                :value="signer"
              />
              <div class="title">
                <p>{{ addressToName(signer).meta.name }}</p>
                <h3>{{ encodeAddress(signer) | hashFormat}}<img :src="iconImg" /></h3>
              </div>
            </div>
            <el-input class="contribute-amount-input" size="small" v-model.trim="contributeAmount" :placeholder="$t('')" />
            <el-button
              class="nominate-btn"
              :disabled="!checkedValidators.length || !isApiReady"
              @click.stop="submitNominate()"
              :loading="isNominateLoading"
              >{{ $t("parachain.contribute") }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import unknownLogo from "Assets/images/unknown.png";
import Identicon from "@polkadot/vue-identicon";
import _ from "lodash";
// import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3FromAddress } from "@polkadot/extension-dapp";
import { mapState } from "vuex";
import AddressDisplay from "@/views/Components/AddressDisplay";
import Balances from "@/views/Components/Balances";
import Pagination from "@/views/Components/Pagination";
import BN from "bn.js";
import Bignumber from "bignumber.js";
// import { ENDPOINTS_MAP } from 'Config';
import { encodeAddress } from "@polkadot/util-crypto";
import switchKusama from "../../assets/images/switch-pink.png";
import {
  timeAgo,
  hashFormat,
  getValidator,
  parseTime,
  parseTimeToUtc,
  countDownByBlock,
  accuracyFormat,
  toThousandslsFilter,
  parseLeaseIdx2Time,
} from "Utils/filters";
import { fmtNumber4Digits } from "Utils/format";
import {
  getCurrencyTokenDetail,
  getTokenDecimal,
  getTokenDetail,
} from "../../utils/tools";

export default {
  name: "Contribute",
  components: {
    Identicon,
    AddressDisplay,
    Pagination,
    Balances,
  },
  data() {
    return {
      unknownLogo,
      inputValue: "",
      isLoading: false,
      type: "",
      parachain: [],
      sortedParachain: [],
      isOnSearch: false,
      isBtnLoading: false,
      isNominateLoading: false,
      isApiReady: false,
      isStaking: false,
      contributeAmount: '',
      total: 0,
      pageSize: 25,
      currentPage: 0,
      currency: "ring",
      allValidators: [],
      checkedValidators: [],
      api: null,
      extensionAccountList: [],
      signer: {
        address: "",
        meta: {
          name: "",
        },
      },
    };
  },
  watch: {},
  filters: {
    timeAgo,
    hashFormat,
    parseTime,
    parseTimeToUtc,
    getValidator,
    countDownByBlock,
    accuracyFormat,
    toThousandslsFilter,
    fmtNumber4Digits,
  },
  computed: {
    ...mapState({
      latestBlocks: (state) => state.polka.latestBlocks,
      sourceSelected: (state) => state.global.sourceSelected,
      token: (state) => state.polka.token,
      metadata: (state) => state.polka.metadata,
      parachainMetadata: (state) => state.polka.parachainMetadata,
      currentTime: (state) => state.global.currentTime,
    }),
    tokenDetail() {
      return getTokenDetail(this.token, this.sourceSelected, this.currency);
    },
    filteredParachain() {
      return this.sortedParachain;
    },
    iconImg() {
      let icon = "";
      switch (this.sourceSelected) {
        case "kusama":
          icon = switchKusama;
          break;
        default:
          break;
      }
      return icon;
    },
    currencyTokenDetail() {
      return getCurrencyTokenDetail(
        this.token,
        this.sourceSelected,
        this.currency
      );
    },
  },
  created() {
    // this.scrollThrottle = _.throttle(this.calcPos, 200);
    this.debounceFilter = _.debounce(this.filterByName, 500);
    this.init();
    this.initPolkadotJs();
  },
  mounted() {
    // this.addVirtualTable();
  },
  async beforeDestroy() {
    try {
      this.$polkaApi && this.$polkaApi.disconnect();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    accuracyFormat,
    parseLeaseIdx2Time,
    getTokenDecimal,
    init() {
      this.initQuery();
      this.getCrownloanInfo();
    },
    initQuery() {
      this.currentPage = 0;
      if (this.$route.query) {
        let page = this.$route.query.page;
        if (page) {
          this.currentPage = page - 1;
        }
      }
    },
    handleInputChange() {
      this.debounceFilter();
    },
    filterByName() {
      this.currentChange(1);
    },
    async initPolkadotJs() {
      // await web3Enable('subscan.io');
      const allAccounts = await web3Accounts();

      this.extensionAccountList = allAccounts || [];
      if (allAccounts && allAccounts.length > 0) {
        this.signer = allAccounts[0].address || "";
      }

      // const network = this.sourceSelected;
      // const provider = new WsProvider(ENDPOINTS_MAP[network].wss);
      // const api = new ApiPromise({
      //   provider,
      // });
      this.isApiReady = true;
      // this.api = api;
      // this.api.isReady
      //   .then(() => {
      //     this.isApiReady = true;
      //   })
      //   .catch((e) => {
      //     this.isApiReady = false;
      //     console.log('api ready error: ', e);
      //   });
    },
    async getBondedValue() {
      let self = this;
      if (this.signer && this.isApiReady) {
        try {
          const ledger = await this.$polkaApi.query.staking.ledger(self.signer);
          self.isStaking = !(ledger.unwrap() || { isEmpty: true }).isEmpty;
        } catch (e) {
          self.isStaking = false;
        }
      }
    },
    getWalletUrl() {
      return "https://polkadot.js.org/apps/";
    },
    selectExtensionAccount() {
      this.$refs["extensionAccountSelect"].toggleMenu();
    },
    addressToName(address) {
      return (
        _.find(this.extensionAccountList, {
          address,
        }) || { address: "", meta: { name: "" } }
      );
    },
    search() {
      this.getCrownloanInfo();
    },
    getCurrency() {},
    async getCrownloanInfo() {
      this.$api["polkaGetParachainFunds"]({
        status: 1,
        row: 100,
        page: this.currentPage,
      })
        .then((res) => {
          if (res.count) {
            this.parachain = this.fmtParachainData(res.funds);
            this.sortedParachain = [].concat(this.parachain);
            this.parachainCount = res.count;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    fmtParachainData(res) {
      let result = res;
      let parachainConfigs =
        this.$const["COMMON/networkList"]["parachains"][this.sourceSelected];
      _.forEach(result, (project) => {
        if (project) {
          if (project.raised) {
            project.raised = +project.raised;
          }
          if (project.amount) {
            project.amount = +project.amount;
          }
          if (project.balance) {
            project.balance = +this.accuracyFormat(
              project.balance,
              this.getTokenDecimal(this.currencyTokenDetail)
            );
          }
          project.name = this.$t("unknown");
          _.forEach(parachainConfigs, (config) => {
            if (project.para_id == config.paraId) {
              project.logo = config.logo;
              project.batch = config.batch;
              project.type = config.tag;
              project.link = config.link;
              project.wss = _.values(config.providers)[0];
              project.token = "";
              project.decimal = 0;
              project.supply = "";
              if (!project.name && this.activeTab === "parachain") {
                project.name = config.name || config.text;
              } else {
                project.name = config.name || config.text || project.name;
              }
              return false;
            }
          });
        }
      });
      return result;
    },
    handleRuntimeExpand(row) {
      this.$router.push(`/crowdloan/${row.fund_id}`);
    },
    tableRowStyle() {
      return "background-color:pink;font-size:15px;";
    },
    inputToKSMBN(value) {
      const DECIMAL = 12;
      const TEN = new Bignumber(10);
      if (!value) return new BN(0);
      try {
        return new BN(
          TEN.pow(new Bignumber(DECIMAL)).times(value).toFixed(0, 1)
        );
      } catch (error) {
        console.log("utils error:", error);
        return new BN(0);
      }
    },
    async submitNominate() {
      this.isNominateLoading = true;
      let self = this;
      try {
        const injector = await web3FromAddress(this.signer);
        const paraId = this.checkedValidators && this.checkedValidators[0];
        this.$polkaApi.setSigner(injector.signer);
        const unsub = await this.$polkaApi.tx.crowdloan
          .contribute(paraId, this.inputToKSMBN(this.contributeAmount), null)
          .signAndSend(this.signer, ({ events = [], status }) => {
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
                this.isNominateLoading = false;
              }
              if (method === "ExtrinsicFailed" && section === "system") {
                self.$notify({
                  title: this.$t("transaction_failed_title"),
                  message: this.$t("transaction_failed_content"),
                  type: "error",
                });
                this.isNominateLoading = false;
              }
            });
            // }
          });
      } catch (e) {
        console.log(e);
        this.isNominateLoading = false;
      }
    },
    selectedListChange(value) {
      let checkedCount = value.length;
      if (checkedCount > 0) {
        this.checkedValidators = [value[checkedCount - 1]];
      }
    },
    currentChange(page) {
      this.$router.push({
        query: {
          page: page,
        },
      });
      this.currentPage = --page;
      this.updateVirtualTable();
    },
    encodeAddress(address) {
      if (!address) {
        return "";
      }
      return encodeAddress(address, this.metadata.addressType);
    },
  },
};
</script>
<style lang="scss" scoped>
.nominate-btn {
  display: inline-block;
  border-radius: 2px;
  border: 1px solid var(--black-color);
  color: var(--white);
  background: var(--black-color);
  padding: 5px 20px;
  line-height: 1.5;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
}
.nominate-btn.el-button.is-disabled,
.nominate-btn.el-button.is-disabled:focus,
.nominate-btn.el-button.is-disabled:hover {
  color: #c0c4cc;
  cursor: not-allowed;
  background-image: none;
  background-color: var(--white);
  border-color: #ebeef5;
}
.account-box {
  display: flex;
  align-items: center;
  .identicon {
    height: 46px;
  }
  .title {
    margin-left: 10px;
    font-size: 14px;
    p {
      color: var(--black-color);
      font-weight: normal;
      line-height: 1;
    }

    h3 {
      color: var(--main-color);
      line-height: 1.25;
      margin-top: 3px;
      display: flex;
      align-items: center;
    }

    img {
      width: 18px;
      height: 18px;
      margin-left: 10px;
    }
  }
}
.account-box-selected {
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;
}
.account-box-selected:hover {
  /* background: #f2f2f2; */
}
.space-holder {
  flex: 1;
  padding: 0 20px;
  text-align: right;
  color: #ff475d;
  a {
    text-decoration: underline;
  }
}
.contribute-wrapper {
  padding-bottom: 100px;
  padding-top: 10px;
  .el-checkbox__label {
    display: none;
  }
  .subscan-container {
    .fixed-panel {
      position: absolute;
      bottom: 0;
      left: 0;
      background: var(--white);
      width: 100%;
      min-height: 76px;
      z-index: 100;
      box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(231, 234, 243, 0.05);
      display: flex;
      align-items: center;
      .el-select {
        height: 1px;
        width: 1px;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 10px;
      }
      .subscan-container {
        & > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          position: relative;
        }
      }
      .contribute-amount-input {
        width: 200px;
      }
    }
    .table-top {
      .for-block {
        font-size: 14px;
        font-weight: bold;
        color: var(--black-color);
        .icon {
          padding-left: 10px;
          transform: translateY(2px);
        }
        .link {
          padding: 0 10px;
          color: var(--main-color);
          cursor: pointer;
        }
        .all {
          padding: 0 10px;
        }
      }
      .table-top-middle {
        flex: 1;
        padding: 0 20px;
        .nominate-btn {
          display: inline-block;
          border-radius: 2px;
          border: 1px solid var(--main-color);
          color: var(--main-color);
          padding: 5px 20px;
          font-size: 14px;
          cursor: pointer;
          font-weight: 600;
        }
      }
    }
    .crowdloan-table {
      min-height: 120px;
      margin-top: 10px;
      padding: 13px 20px;
      .default-cursor {
        a {
          cursor: auto;
        }
      }
      .link {
        color: var(--link-color);
        span {
          cursor: pointer;
        }
      }
      .icon {
        vertical-align: -0.5em;
        font-size: 26px;
        user-select: none;
      }
      .icon-wrapper {
        width: 28px;
        height: 28px;
        text-align: center;
        line-height: 28px;
        border-radius: 50%;
        font-size: 12px;
        background-color: transparent;
        color: var(--main-color);
        border: 1px solid var(--main-color);
        &.top-ten {
          background-color: var(--main-color);
          color: var(--white);
        }
      }
      .detail-btn {
        width: 48px;
        height: 26px;
        background: var(--white);
        border-radius: 4px;
        border: 1px solid var(--btn-border-color);
        font-size: 10px;
        text-align: center;
        cursor: pointer;
        user-select: none;
      }
      .expand-btn {
        .el-table__expand-icon {
          width: 48px;
          height: 26px;
          background: var(--white);
          border-radius: 4px;
          border: 1px solid var(--btn-border-color);
          font-size: 10px;
          text-align: center;
          cursor: pointer;
          user-select: none;
          .el-icon {
            transition: transform 0.2s ease-in-out;
          }
          &.el-table__expand-icon--expanded {
            transform: rotate(0);
            .el-icon {
              transform: rotate(90deg);
            }
          }
        }
      }
      .project {
        display: flex;
        align-items: center;
        .para-id {
          flex: none;
        }
        .project-name {
          word-break: break-word;
        }
        img {
          width: 30px;
          height: 30px;
          margin: 0 10px;
          flex: 0 0 30px;
          border-radius: 50%;
        }
      }
    }
    .table-bottom {
      margin-top: 20px;
      .download {
      }
    }
  }
  @media screen and (max-width: $screen-xs) {
    .subscan-container {
      .validator-search-wrapper {
        width: 220px;
      }
      .table-top {
        margin-top: 0;
        .for-block {
          .link {
            max-width: 250px;
            word-break: break-all;
          }
        }
      }
      .table-bottom {
        flex-direction: column;
        .pagination-component {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.nominate-dropdown-item {
  height: auto;
  line-height: auto;
  padding: 5px 20px;
}
.contribute-wrapper {
  .el-checkbox {
    .el-checkbox__input {
      .el-checkbox__inner {
        width: 22px;
        height: 22px;
        background-color: var(--white);
        border-color: #dbdbdb;
        &::after {
          border-color: #000;
          border-width: 2px;
          height: 10px;
          left: 7px;
          top: 2px;
          width: 5px;
        }
      }
    }
    .el-checkbox__label {
      display: none;
    }
  }
  .subscan-container {
    .validator-search-wrapper {
      width: 290px;
      .el-input-group__append {
        overflow: hidden;
        background-color: var(--main-button-color);
        border-color: var(--main-button-color);
      }
      .el-input {
        .el-input__inner::placeholder {
          font-size: 14px;
          font-weight: 600;
          color: rgba(179, 179, 179, 1);
        }
      }
      .search-input {
        .search-button {
          display: block;
          width: 60px;
          padding: 0;
          font-size: 30px;
          background-color: var(--main-button-color);
        }
      }
    }
  }
  .crowdloan-table {
    .el-table {
      .el-table__header-wrapper {
        th,
        tr {
          box-sizing: border-box;
          height: 44px;
          background: var(--table-bg);
          font-size: 14px;
          font-weight: bold;
          color: var(--black-color);
        }
        th {
          padding: 0;
          border: none;
        }
        th:first-child {
          background: var(--white);
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
    }
  }
}
</style>
