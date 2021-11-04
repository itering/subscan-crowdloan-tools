<template>
  <div class="subscan-container countdown">
    <div class="table-top space-between align-items-center">
      <div class="for-block align-items-center">
        <div v-if="parachainMetadata.auction_count && parachainMetadata.auction_active">
          <span>{{ $t('parachain.auction_hash') }}{{ parachainMetadata.auction_count }}</span>
          <el-tooltip class="item" effect="light" popper-class="lease-index" placement="top">
            <div slot="content">
              {{
                parseLeaseIdx2Time(
                  currentAuction.lease_index,
                  currentAuction.lease_index + parachainMetadata.lease_periods_per_slot - 1,
                  parachainMetadata.lease_period,
                  metadata.blockNum
                )
              }}
            </div>
            <span class="lease-period-time">{{' ('}}{{$t('parachain.lease_period')}}{{ `: ${currentAuction.lease_index} - ${currentAuction.lease_index + parachainMetadata.lease_periods_per_slot - 1})` }}</span>
          </el-tooltip>
        </div>
        <div v-else>{{ $t('parachain.auction') }}</div>
      </div>
      <div class="btns">
        <a class="btn" target="_blank" rel="noopener noreferrer" :href="`${networkDomain}/auction`">{{ $t('parachain.auction_history') }}</a>
        <a
          v-if="parachainMetadata.auction_count"
          :href="`${networkDomain}/auction/${parachainMetadata.auction_count - 1 || 1}`"
          class="btn"
          target="_blank" rel="noopener noreferrer"
          >{{ $t('parachain.last_auction') }}</a
        >
      </div>
    </div>
    <div class="countdown-card" :style="cssVars" v-if="parachainMetadata.auction_active">
      <div class="label">
        <div class="content countdown-content" v-if="parachainMetadata.auction_active && !countdownEnd">
          <div class="status">{{ $t('parachain.in_auction') }}</div>
          <div class="time">
            <div class="time-item">
              <div class="num">{{ countdown.days }}</div>
              <div class="unit">{{ $t('parachain.countdown_day') }}</div>
            </div>
            <div class="time-item">
              <div class="num">{{ countdown.hours }}</div>
              <div class="unit">{{ $t('parachain.countdown_hour') }}</div>
            </div>
            <div class="time-item">
              <div class="num">{{ countdown.minutes }}</div>
              <div class="unit">{{ $t('parachain.countdown_minute') }}</div>
            </div>
            <div class="time-item">
              <div class="num">{{ countdown.seconds }}</div>
              <div class="unit">{{ $t('parachain.countdown_second') }}</div>
            </div>
          </div>
        </div>
        <div class="content end-content" v-else-if="currentAuction.extinguish_block == 0">
          <div class="time">
            <div class="time-item">
              <div class="text">
                {{ $t('parachain.auction_calculating') }}
              </div>
            </div>
          </div>
        </div>
        <div class="content end-content" v-else-if="parachainMetadata.auction_count">
          <!-- <div class="status">{{ $t("parachain.auction_ended") }}</div> -->
          <div class="time">
            <div class="time-item">
              <!-- <div class="text">{{ $t("parachain.auction_ended") }}{{': '}}</div> -->
              <div class="text">
                {{ $t('parachain.auction_ended') }}{{ ' #'
                }}{{ (currentAuction.extinguish_block || currentAuction.end_block) | toThousandslsFilter }}
              </div>
            </div>
          </div>
        </div>
        <div class="content end-content" v-else>
          <!-- <div class="status">{{ $t("parachain.auction_ended") }}</div> -->
          <div class="time">
            <div class="time-item">
              <!-- <div class="text">{{ $t("parachain.auction_ended") }}{{': '}}</div> -->
              <div class="text">{{ $t('parachain.auction_waiting') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="progress">
        <div class="stages">
          <div class="start">{{ $t('parachain.auction_start') }}</div>
          <div class="period">
            {{ $t('parachain.end_period') }}
            <el-tooltip class="item" effect="light" :content="$t('parachain.end_period_tip')" placement="top">
              <icon-svg class="iconfont" icon-class="question" />
            </el-tooltip>
          </div>
          <div class="end">{{ $t('parachain.auction_end') }}</div>
        </div>
        <el-progress class="progress-bar" :show-text="false" :stroke-width="8" :percentage="37"></el-progress>
        <div class="progress-dot"></div>
        <div class="blocks" v-if="parachainMetadata.auction_count">
          <el-tooltip
            class="item"
            effect="light"
            :content="currentAuction.start_block | parseBlock2Time(metadata.blockNum)"
            placement="top"
          >
            <div class="start">{{ $t('parachain.block') }}{{ currentAuction.start_block | toThousandslsFilter }}</div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            :content="currentAuction.early_end_block | parseBlock2Time(metadata.blockNum)"
            placement="top"
          >
            <div class="period">
              {{ $t('parachain.block') }}{{ currentAuction.early_end_block | toThousandslsFilter }}
            </div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            :content="currentAuction.end_block | parseBlock2Time(metadata.blockNum)"
            placement="top"
          >
            <div class="end">{{ $t('parachain.block') }}{{ currentAuction.end_block | toThousandslsFilter }}</div>
          </el-tooltip>
        </div>
        <div class="blocks" v-else>
          <div class="start">{{ $t('parachain.block') }} {{ $t('parachain.block_waiting') }}</div>
          <div class="period">{{ $t('parachain.block') }} {{ $t('unknown') }}</div>
          <div class="end">{{ $t('parachain.block') }} {{ $t('unknown') }}</div>
        </div>
      </div>
    </div>
    <div class="empty-card" v-else>
      <img src="./../../assets/images/auction-empty.png" alt="empty" />
      <div class="empty-text">
        <div>{{$t('parachain.auction_empty_1')}}</div>
        <div>{{$t('parachain.auction_empty_2')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import rococoLogo from 'Assets/images/rococo-logo.png';
import { toThousandslsFilter, parseBlock2Time, parseLeaseIdx2Time } from 'Utils/filters';
export default {
  components: {},
  data() {
    return {
      rococoLogo: rococoLogo,
      connected: '',
      upcoming: '',
      proposal: '',
      auction: '',
      slot: '',
      countdownEnd: false,
      countdown: {
        seconds: '00',
        minutes: '00',
        hours: '00',
        days: '0',
      },
    };
  },
  computed: {
    ...mapState({
      metadata: (state) => state.polka.metadata,
      parachainMetadata: (state) => state.polka.parachainMetadata,
      currentAuction: (state) => state.polka.currentAuction,
      token: (state) => state.polka.token,
      currentTime: (state) => state.global.currentTime,
      sourceSelected: (state) => state.global.sourceSelected,
    }),
    networkDomain() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["domain"]["value"];
    },
    cssVars() {
      return {
        '--period-progress': '34%',
        '--dot-progress': Math.min(Math.max(this.currentProgress, 0), 99) + '%',
      };
    },
    currentProgress() {
      if (this.metadata.blockNum > this.currentAuction.early_end_block) {
        return (
          37 +
          (((this.metadata.blockNum - this.currentAuction.early_end_block) /
            (this.currentAuction.end_block - this.currentAuction.early_end_block)) *
            100 *
            0.63 || 0)
        );
      } else {
        return (
          ((this.metadata.blockNum - this.currentAuction.start_block) /
            (this.currentAuction.early_end_block - this.currentAuction.start_block)) *
            100 *
            0.37 || 0
        );
      }
    },
    periodProgress() {
      return (
        ((this.currentAuction.early_end_block - this.currentAuction.start_block) /
          (this.currentAuction.end_block - this.currentAuction.start_block)) *
          100 || 0
      );
    },
  },
  filters: {
    toThousandslsFilter,
    parseBlock2Time,
    parseLeaseIdx2Time
  },
  watch: {
    currentAuction(newV) {
      if (!this.cdInterval && newV && newV.end_block) {
        this.initCountdown();
      }
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.cdInterval && clearInterval(this.cdInterval);
  },
  methods: {
    parseLeaseIdx2Time,
    init() {
      this.getMetaCount();
      if (this.currentAuction.end_block && this.metadata.blockNum) {
        this.initCountdown();
      }
    },
    initCountdown() {
      this.cdInterval && clearInterval(this.cdInterval);
      const second = 1,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
      let endBlock = this.currentAuction.end_block;
      let distance = (endBlock - this.metadata.blockNum) * 6;
      if (distance < 0) {
        this.countdownEnd = true;
        return;
      }
      this.cdInterval = setInterval(() => {
        let days = Math.floor(distance / day);
        this.countdown.days = days;
        let hours = Math.floor((distance % day) / hour);
        this.countdown.hours = ('' + hours).padStart(2, '0');
        (this.countdown.minutes = ('' + Math.floor((distance % hour) / minute)).padStart(2, '0')),
          (this.countdown.seconds = ('' + Math.floor((distance % minute) / second)).padStart(2, '0'));
        distance = Math.max(distance - 1, 0);
        if (distance == 0) {
          this.countdownEnd = true;
        }
      }, second * 1000);
    },
    getMetaCount() {},
  },
};
</script>

<style lang='scss' scoped>
.countdown {
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
    .lease-period-time {
      color: var(--main-color);
    }
    .btn {
      display: inline-block;
      cursor: pointer;
      margin-right: 20px;
      padding: 4px 18px;
      background: var(--white);
      border-radius: 2px;
      border: 1px solid var(--main-color);
      font-size: 14px;
      font-weight: 600;
      color: var(--main-color);
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .countdown-card {
    margin-top: 10px;
    background: var(--navbar-bg);
    border-radius: 10px;
    border: 1px solid var(--border-color);
  }
  .empty-card {
    margin-top: 10px;
    background: var(--white);
    border-radius: 10px;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    .empty-text {
      margin-left: 20px;
      color: #98959F;
      font-size: 14px;
      font-weight: 600;
    }
  }
  .label {
    // flex: 1 1 auto;
    display: flex;
    justify-content: center;
    margin: 30px;
    .content {
      color: var(--white);
      display: flex;
      align-items: center;
      // width: 900px;
      // height: 80px;
      background: #ffffff33;
      border-radius: 40px;
      padding: 10px 30px;
    }
    .status {
      font-size: 24px;
      font-weight: bold;
      line-height: 33px;
      margin-right: 26px;
    }
    .time {
      display: flex;
      // background: #ffffff4d;
      border-radius: 31px;
      padding: 0 100px;
    }
    .time-item {
      display: flex;
      align-items: center;
      margin-right: 40px;
      &:last-child {
        margin-right: 0;
      }
    }
    .num {
      font-size: 50px;
      font-weight: bold;
      line-height: 60px;
    }
    .text {
      font-size: 24px;
      font-weight: bold;
      line-height: 33px;
    }
    .unit {
      margin-left: 23px;
      font-size: 20px;
      line-height: 25px;
    }
  }
  .progress {
    margin: 0 30px 30px 30px;
    color: var(--white);
    position: relative;
    /deep/ .el-progress-bar {
      .el-progress-bar__outer {
        background-color: #ffffff66;
      }
      .el-progress-bar__inner {
        background-color: var(--white);
      }
    }
    .progress-bar {
      margin: 10px 0;
    }
    .progress-dot {
      width: 26px;
      height: 26px;
      background: var(--navbar-bg);
      box-shadow: 0px 0px 8px 0px rgba(255, 255, 255, 0.5);
      border: 4px solid var(--white);
      border-radius: 50%;
      position: absolute;
      top: 18px;
      left: calc(var(--dot-progress) - 1%);
    }
    .stages {
      position: relative;
      display: flex;
      justify-content: space-between;
      .period {
        position: absolute;
        left: var(--period-progress);
      }
    }
    .blocks {
      position: relative;
      display: flex;
      justify-content: space-between;
      .period {
        position: absolute;
        left: var(--period-progress);
      }
    }
  }
  @media screen and (max-width: $screen-xs) {
    width: 100%;
    .table-top {
      flex-direction: column;
      align-items: initial;
      .btns {
        margin-top: 10px;
      }
    }
    .empty-card {
      flex-direction: column;
      .empty-text {
        margin-left: 0;
        margin-top: 20px;
      }
    }
    .label {
      margin: 20px 15px 15px;
      .content {
        flex-direction: column;
        border-radius: 36px;
      }
      .countdown-content {
        background: initial;
        .time {
          background: #ffffff33;
        }
      }
      .end-content {
        .time {
          padding: 0;
        }
      }
      .status {
        font-size: 14px;
        line-height: 20px;
        margin-right: 0;
        margin-bottom: 10px;
      }
      .text {
        font-size: 14px;
        line-height: 20px;
      }
      .time {
        border-radius: 30px;
        padding: 15px 50px;
      }
      .num {
        font-size: 22px;
        line-height: 30px;
      }
      .unit {
        margin-left: 0;
        font-size: 12px;
        line-height: 16px;
      }
      .time-item {
        flex-direction: column;
        margin-right: 30px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .progress {
      display: flex;
      margin: 0 25px 20px;
      // flex: 0 0 auto;
      .progress-bar {
        width: 100px;
        transform: rotateZ(90deg);
        margin: 0;
        position: absolute;
        top: 50px;
        left: -50px;
      }
      .progress-dot {
        width: 16px;
        height: 16px;
        box-shadow: 0px 0px 5px 0px rgba(255, 255, 255, 0.5);
        border: 2px solid var(--white);
        top: calc(var(--dot-progress) * 0.9);
        left: -7px;
      }
      .stages {
        flex: 1 1 auto;
        flex-direction: column;
        margin-left: 20px;
        height: 110px;
        min-width: 80px;
        .period {
          left: 0;
          top: 30%;
        }
      }
      .blocks {
        flex-direction: column;
        .period {
          left: 0;
          top: 30%;
        }
      }
    }
  }
}
</style>
