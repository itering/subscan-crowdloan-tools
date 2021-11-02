<template>
  <div class="csv-download-component white-btn" @click="$emit('downloadClick')">
    <icon-svg class="icon" icon-class="download-csv" />
    <div class="label align-items-center">{{ $t(text) }}</div>
  </div>
</template>

<script>
import XLSX from 'xlsx';
export default {
  props: {
    btnText: {
      type: String,
      default: '', // 起始值
    },
  },
  created() {
    if (this.btnText) {
      this.text = this.btnText;
    } else {
      this.text = 'download_csv_file_current';
    }
  },
  methods: {
    downloadClick(tableData, tableName) {
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, 'SheetJS');
      XLSX.writeFile(new_workbook, tableName);
    },
  },
};
</script>

<style lang="scss" scoped>
.csv-download-component {
  box-sizing: border-box;
  // width: 100%;
  // height: 100%;
  border-radius: 2px;
  border: 1px solid var(--main-color);
  color: var(--main-color);
  padding: 0 15px 0 10px;
  display: flex;
  cursor: pointer;
  .icon {
    font-size: 30px;
  }
  .label {
    font-size: 14px;
    font-weight: 600;
    margin-left: 10px;
    user-select: none;
  }
}
</style>
