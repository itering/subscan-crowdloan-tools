<template>
  <div class="metadata-wrapper subscan-card">
    <div class="label">
      <div class="content">
        <img alt="logo" :src="networkLogo"/>
        <div class="name">{{networkName}}</div>
        <div class="tag">{{$t("parachain.relay_chain")}}</div>
      </div>
    </div>
    <div class="count">
      <a class="count-item" target="_blank" rel="noopener noreferrer" :href="`${networkDomain}/parachain?tab=parachain`">
        <div class="content">
          <div class="name">{{$t('parachain.parachain') + '/' + $t('parachain.total_slot')}}</div>
          <div class="number">{{parachainMetadata.online_count + "/" + parachainMetadata.total_slot_num}}</div>
        </div>
      </a>
      <a class="count-item" target="_blank" rel="noopener noreferrer" :href="`${networkDomain}/parachain?tab=upcoming`">
        <div class="content">
          <div class="name">{{$t('parachain.upcoming')}}</div>
          <div class="number">{{parachainMetadata.upcoming_count}}</div>
        </div>
      </a>
      <a class="count-item" target="_blank" rel="noopener noreferrer" :href="`${networkDomain}/auction_board`">
        <div class="content">
          <div class="name">{{$t('parachain.auction')}}</div>
          <div class="number">{{parachainMetadata.auction_count}}</div>
        </div>
      </a>
      <a class="count-item" target="_blank" rel="noopener noreferrer" :href="`${networkDomain}/auction_board`">
        <div class="content">
          <div class="name">{{$t('parachain.current_lease')}}</div>
          <div class="number">{{parseInt(metadata.blockNum/parachainMetadata.lease_period) || 0}}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import rococoLogo from "Assets/images/rococo-logo.png";
export default {
  components: {  },
  data() {
    return {
      rococoLogo: rococoLogo,
      connected: "",
      upcoming: "",
      proposal: "",
      auction: "",
      slot: ""
    };
  },
  computed: {
    ...mapState({
      metadata: (state) => state.polka.metadata,
      parachainMetadata: (state) => state.polka.parachainMetadata,
      token: (state) => state.polka.token,
      sourceSelected: (state) => state.global.sourceSelected,
    }),
    networkDomain() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["domain"]["value"];
    },
    networkLogo() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["mobileButton"];
    },
    networkName() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["label"];
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getMetaCount();
    },
    getMetaCount() {
    }
  },
};
</script>

<style lang='scss' scoped>
.metadata-wrapper {
  display: flex;
  .label {
    flex: 1 1 auto;
    margin: 30px;
    .content {
      display: flex;
      align-items: center;
    }
    .name {
      font-size: 20px;
      font-weight: 600;
      margin: 0 10px 0 20px;
    }
    .tag {
      font-size: 14px;
      font-weight: 600;
      padding: 4px 6px;
      background-color: var(--black-color);
      color: #FBFBFB;
    }
    img {
      width: 56px;
      height: 56px;
    }
  }
  .count {
    flex: 0 0 800px;
    display: flex;
    margin: 28px 0;
    .count-item {
      flex: 1;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
    .name {
      font-size: 14px;
      font-weight: 600;
      color: var(--sub-title-color);
    }
    .number {
      font-size: 26px;
      font-weight: 600;
      color: var(--main-color);
    }
  }
  @media screen and (max-width: $screen-xs) {
    padding: 20px;
    flex-direction: column;
    .label {
      margin: 0;
      padding: 0 0 20px 0;
      border-bottom: 1px solid var(--border-color);
      img {
        width: 40px;
        height: 40px;
      }
      .name {
        font-size: 16px;
        margin: 0 10px;
      }
      .tag {
        font-size: 12px;
        padding: 4px 5px;
      }
    }
    .count {
      flex: 0 0 auto;
      flex-direction: column;
      margin: 0;
      .content {
        padding: 14px 0;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .name {
        font-size: 14px;
      }
      .number {
        font-size: 16px;
      }
    }
  }
}
</style>
