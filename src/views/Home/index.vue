<template>
  <div class="dashboard-wrapper subscan-content">
  </div>
</template>
<script>
import _ from "lodash";
import const_symbol from "Service/const/symbol";
import { mapState } from "vuex";
import { isMobile } from "Utils/tools";
import { accuracyFormat, toThousandslsFilter } from "Utils/filters";

export default {
  name: "Home",
  components: {
  },
  data() {
    return {
      const_symbol: const_symbol,
      sourceList: this.$const["COMMON/networkList"]["all"].value,
    };
  },
  filters: {
    accuracyFormat,
    toThousandslsFilter,
  },
  watch: {
  },
  computed: {
    ...mapState({
      sourceSelected: (state) => state.global.sourceSelected,
      language: (state) => state.global.language,
      extensionAccountList: (state) => state.global.extensionAccountList,
    }),
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
    },
    isMobile() {
      return isMobile();
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  .subscan-card {
    position: relative;
    min-height: 500px;
    flex: 1 1 auto;
  }
}
</style>
<style lang="scss">
.main {
  display: flex;
}
</style>
