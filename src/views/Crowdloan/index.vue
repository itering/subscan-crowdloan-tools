<template>
  <div class="contribute-wrapper">
    <div class="subscan-container">
      <div class="metadata-chart-wrapper space-between">
        <meta-data class="metadata-component" />
      </div>
      <div class="countdown-wrapper space-between">
        <Countdown class="metadata-component" />
      </div>
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
              min-width="105"
              prop="para_id"
              sortable
              :label="$t('parachain.para_id')"
            >
              <template slot-scope="scope">
                <div class="link para-id">
                  <a
                    target="_blank" rel="noopener noreferrer"
                    :href="`${networkDomain}/parachain/${scope.row.para_id}`"
                    class="project"
                  >
                    <span class="para-id">{{ scope.row.para_id }}</span>
                  </a>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="150"
              prop="para_id"
              sortable
              :label="$t('parachain.project')"
            >
              <template slot-scope="scope">
                <div class="link para-id">
                  <a
                    target="_blank" rel="noopener noreferrer"
                    :href="`${networkDomain}/parachain/${scope.row.para_id}`"
                    class="project"
                  >
                    <img
                      v-if="scope.row.logo"
                      :src="scope.row.logo"
                      :alt="scope.row.name"
                    />
                    <img v-else :src="unknownLogo" :alt="scope.row.name" />
                    <span class="project-name">{{ scope.row.name }}</span>
                  </a>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
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
            </el-table-column> -->
            <el-table-column
              min-width="135"
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
              min-width="125"
              prop="contributors"
              sortable
              :label="$t('parachain.contributor')"
            >
              <template slot-scope="scope">
                <div class="link" v-if="scope.row.contributors">
                  <a
                    target="_blank" rel="noopener noreferrer"
                    :href="`${networkDomain}/crowdloan/${scope.row.fund_id}?tab=contributor`"
                  >
                    {{ scope.row.contributors }}
                  </a>
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column width="180">
              <template slot-scope="scope">
                <div class="action-btns">
                  <div class="contribute-btn white-btn" @click="selectParaId(scope.row.para_id)">
                    {{$t('contribute.index')}}
                  </div>
                  <div class="expand-btn" @click="handleRuntimeExpand(scope.row)">
                    <div class="el-table__expand-icon">
                      <i class="el-icon el-icon-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
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
      <el-dialog
        :width="getDialogWidth()"
        :visible.sync="dialogVisible"
        :title="$t('contribute.to_crowdloan')"
        center
        class="contribute-dialog"
      >
        <el-form :model="form" ref="contributeForm" label-position="top" class="contribute-form">
          <el-form-item
            :label="$t('parachain.para_id')"
            :label-width="formLabelWidth"
            class="para-select"
          >
            <el-input
              :placeholder="$t('contribute.select')"
              :value="paraName"
              disabled
            >
              <template slot="append">
                <el-dropdown trigger="click" @command="handleParaIdChange">
                  <span>
                    <i class="el-icon-caret-bottom"></i>
                  </span>
                  <el-dropdown-menu
                    slot="dropdown"
                    class="version-dropdown-menu"
                  >
                    <div class="prefix-search-input">
                      <el-input
                        size="small"
                        clearable
                        v-model.trim="keyword"
                        :placeholder="$t('contribute.search')"
                      />
                    </div>
                    <div class="dropdown-scroll-list">
                      <el-dropdown-item
                        :command="item.para_id"
                        class="menu-item"
                        v-for="item in filteredParaList"
                        :key="item.para_id"
                      >
                        <span class="prefix-name">{{
                          `${item.para_id} (${item.name})`
                        }}</span>
                      </el-dropdown-item>
                    </div>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('value')" :label-width="formLabelWidth">
            <el-input
              :placeholder="amountPlaceholder"
              v-model="form.contributeAmount"
            >
              <template slot="append">{{
                tokenDetail && tokenDetail.symbol
              }}</template>
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
            :label="$t('memo')"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.memo" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            class="button main-btn"
            @click.stop="submitContribute"
            :loading="isContributeLoading"
            >{{ $t("contribute.index") }}</el-button
          >
          <div class="button white-btn" @click="closeContributeDialog">
            {{ $t("cancel") }}
          </div>
        </span>
      </el-dialog>
      <div class="fixed-panel">
        <div class="subscan-container">
          <div v-if="!extensionAccountList.length" class="extention-section">
            <p>{{ $t("no_polkadotjs_extension") }}</p>
          </div>
          <div v-else class="extention-section">
            <el-select
              v-model="signer"
              placeholder=""
              ref="extensionAccountSelect"
            >
              <el-option
                class="contribute-dropdown-item"
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
                    <h3>{{ encodeAddress(item.address) | hashFormat }}</h3>
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
                <h3>
                  {{ encodeAddress(signer) | hashFormat }}<img :src="iconImg" />
                </h3>
              </div>
            </div>
            <div class="contribute-section">
              <span class="available-amount">{{amountPlaceholder}}</span>
              <el-button
                class="btn white-btn contribute-btn"
                :disabled="!isApiReady"
                @click.stop="selectParaId()"
                >{{ $t("parachain.contribute") }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MetaData from "./metadata";
import Countdown from "./countdown";
import unknownLogo from "Assets/images/unknown.png";
import Identicon from "@polkadot/vue-identicon";
import _ from "lodash";
// import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3FromAddress } from "@polkadot/extension-dapp";
import { mapState } from "vuex";
// import AddressDisplay from "@/views/Components/AddressDisplay";
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
  isMobile,
} from "../../utils/tools";

export default {
  name: "Contribute",
  components: {
    Identicon,
    // AddressDisplay,
    MetaData,
    Countdown,
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
      isContributeLoading: false,
      isApiReady: false,
      isStaking: false,
      dialogVisible: false,
      total: 0,
      pageSize: 25,
      currentPage: 0,
      currency: "ring",
      allValidators: [],
      checkedValidators: [],
      api: null,
      extensionAccountList: [],
      keyword: "",
      form: {
        hasMemo: false,
        memo: "",
        paraId: "",
        contributeAmount: "",
      },
      formLabelWidth: "120px",
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
    networkDomain() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["domain"]["value"];
    },
    amountPlaceholder() {
      let result = "0";
      _.forEach(this.extensionAccountList, (account) => {
        if (account.address === this.signer) {
          result = account.balance || 0;
        }
      });
      return this.$t("available") + ": " + result + ' ' + (this.tokenDetail.symbol||'');
    },
    paraName() {
      let result = "";
      _.forEach(this.sortedParachain, (item) => {
        if (item.para_id == this.form.paraId) {
          result = this.form.paraId + " (" + item.name + ")";
          return false;
        }
      });
      return result;
    },
    filteredParachain() {
      return this.sortedParachain;
    },
    filteredParaList() {
      let keyWord = this.keyword.toLowerCase();
      return this.sortedParachain.filter(function (parachain) {
        if (
          parachain &&
          ("" + parachain.para_id)
            .replace(" ", "")
            .toLowerCase()
            .includes(keyWord)
        ) {
          return true;
        }
        let name = parachain && parachain.name;
        if (name && name.toLowerCase().includes(keyWord)) {
          return true;
        }
        return false;
      });
    },
    iconImg() {
      let icon = "";
      switch (this.sourceSelected) {
        case "kusama":
          icon = switchKusama;
          break;
        default:
          icon = switchKusama;
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
    isMobile,
    accuracyFormat,
    fmtNumber4Digits,
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
    getDialogWidth() {
      if (this.isMobile()) {
        return "300px";
      } else {
        return "530px";
      }
    },
    selectParaId(paraId) {
      this.form.paraId = paraId || '';
      this.dialogVisible = true;
    },
    closeContributeDialog() {
      this.dialogVisible = false;
      this.form = {
        hasMemo: false,
        memo: "",
        paraId: "",
        contributeAmount: ""
      };
      // this.$refs['contributeForm'] && this.$refs['contributeForm'].resetFields();
    },
    handleInputChange() {
      this.debounceFilter();
    },
    filterByName() {
      this.currentChange(1);
    },
    async initPolkadotJs() {
      const allAccounts = await web3Accounts();
      this.extensionAccountList = allAccounts || [];
      if (allAccounts && allAccounts.length > 0) {
        this.signer = allAccounts[0].address || "";
      }
      this.isApiReady = true;
      this.getAccountBalance();
    },
    getAccountBalance() {
      let addressList = _.map(this.extensionAccountList, "address");
      this.$polkaApi.query.system.account.multi(addressList, (balances) => {
        _.forEach(balances, ({ data }, index) => {
          this.extensionAccountList[index]["balance"] = fmtNumber4Digits(accuracyFormat(
            data.free.toString(),
            this.currencyTokenDetail.token_decimals
          ), 4);
        });
      });
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
    handleParaIdChange(val) {
      this.form.paraId = val;
    },
    handleRuntimeExpand(row) {
      window.open(`${this.networkDomain}/crowdloan/${row.fund_id}`);
    },
    tableRowStyle() {
      return "background-color:pink;font-size:15px;";
    },
    inputToKSMBN(value) {
      let decimal = this.getTokenDecimal(this.currencyTokenDetail);
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
        this.$polkaApi.setSigner(injector.signer);
        let tx = this.$polkaApi.tx.crowdloan.contribute(
          this.form.paraId,
          this.inputToKSMBN(this.form.contributeAmount),
          null
        );
        if (this.form.hasMemo && this.form.memo) {
          let txs = [
            this.$polkaApi.tx.crowdloan.contribute(
              this.form.paraId,
              this.inputToKSMBN(this.form.contributeAmount),
              null
            ),
            this.$polkaApi.tx.crowdloan.addMemo(
              this.form.paraId,
              this.form.memo
            ),
          ];
          tx = this.$polkaApi.tx.utility.batchAll(txs);
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
                this.closeContributeDialog();
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
.white-btn.el-button,
.white-btn.el-button:focus,
.white-btn.el-button:hover {
  background-color: var(--white);
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
    .metadata-chart-wrapper {
      height: 116px;
      margin-bottom: 20px;
      .metadata-component {
        width: 100%;
      }
    }
    .countdown-wrapper {
      margin-bottom: 20px;
    }
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
      .extention-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        position: relative;
      }
      .contribute-btn {
        padding: 8px 12px;
      }
      .available-amount {
        color: var(--black-color);
        font-size: 14px;
        margin-right: 20px;
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
      .action-btns {
        display: flex;
      }
      .contribute-btn {
        display: inline-block;
        margin-right: 10px;
        padding: 3px 12px;
      }
      .expand-btn {
        display: inline-block;
        .el-table__expand-icon {
          width: 48px;
          height: 32px;
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
      .metadata-chart-wrapper {
        height: inherit;
        flex-direction: column;
        .metadata-component {
          width: 100%;
        }
        .chart-component {
          margin-top: 20px;
          width: 100%;
          height: 196px;
        }
      }
      .fixed-panel {
        .extention-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          position: relative;
        }
        .contribute-section {
          display: flex;
          flex-direction: column;
        }
        .available-amount {
          margin-right: 0;
        }
      }
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
.contribute-dialog {
  /deep/ .el-dialog__title {
    font-weight: bold;
  }
  /deep/ .el-dialog__body {
    padding: 25px 0 5px 0;
  }
  .contribute-form {
    padding: 0 75px;
    .memo-switch {
      margin-bottom: 15px;
      text-align: right;
      /deep/ .el-switch__label {
        color: var(--black-color);
        font-weight: bold;
      }
      /deep/ .el-switch.is-checked .el-switch__core {
        border-color: var(--main-color);
        background-color: var(--main-color);
      }
    }
    /deep/ .el-form-item {
      margin-bottom: 20px;
      .el-input {
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
      }
      .el-input-group {
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
      }
    }
    /deep/ .el-form-item__label {
      font-weight: bold;
      line-height: 20px;
      padding: 0 0 5px;
      color: var(--black-color);
    }
    .para-select {
      /deep/ .el-input {
        input {
          font-size: 14px;
          color: var(--main-color);
          cursor: default;
          background-color: var(--white);
        }
        .el-input-group__append {
          padding: 0;
          cursor: pointer;
          span {
            display: inline-block;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
          }
        }
        .el-input__inner,
        .el-input__inner:focus,
        .el-input__inner:hover {
          border-color: var(--input-border-color);
        }
      }
    }
  }
  /deep/ .el-dialog__footer {
    padding: 5px 20px 30px;
    .button {
      width: 140px;
      height: 32px;
      line-height: 32px;
      padding: 0;
      & + .button {
        margin-left: 20px;
      }
    }
  }
  @media screen and (max-width: $screen-xs) {
    /deep/ .el-dialog__body {
      padding: 25px 0 5px 0;
    }
    .contribute-form {
      padding: 0 15px;
    }
    /deep/ .el-dialog__footer {
      padding: 5px 5px 20px;
      .button {
        width: 100px;
        height: 32px;
        line-height: 32px;
        & + .button {
          margin-left: 20px;
        }
      }
    }
  }
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
<style lang="scss">
.contribute-dropdown-item {
  height: auto;
  line-height: auto;
  padding: 5px 20px;
}
.version-dropdown-menu.el-dropdown-menu {
  // max-height: 230px;
  // overflow: auto;
  .dropdown-scroll-list {
    margin-top: 10px;
    max-height: 230px;
    overflow: auto;
  }
  .prefix-search-input {
    margin: 0 10px;
  }
  .menu-item {
    text-align: center;
    color: var(--menu-item-color);
    cursor: pointer;
    outline: none;
    &:hover {
      color: var(--menu-item-hover-color);
      text-decoration: none;
      background-color: var(--main-bg);
    }
    .prefix-name {
      // text-transform: capitalize;
    }
  }
}
</style>
