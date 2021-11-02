<template>
  <div class="pagination-component">
    <el-pagination
      background
      :layout="layout"
      :total="total"
      :pager-count="5"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    pageSize: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  computed: {
    layout() {
      if (this.total > 250) {
        // return 'prev, pager, next, jumper';
        return "prev, pager, next";
      } else {
        return 'prev, pager, next';
      }
    },
  },
  methods: {
    currentChange(pageSize) {
      this.$emit('currentChange', pageSize);
    },
  },
};
</script>

<style lang="scss">
.pagination-component {
  .el-pagination {
    padding: 0;
    .btn-prev,
    .btn-next {
      background: var(--main-color);
      width: 30px;
      height: 30px;
      .el-icon {
        font-size: 18px;
        color: var(--white);
      }
      &:disabled {
        background: #c0c4cc;
        color: #f4f4f5;
      }
    }
    .el-pager {
      li {
        &:not(.disabled) {
          &:hover {
            color: var(--main-color);
          }
        }
      }
      .number {
        box-sizing: border-box;
        min-width: 30px;
        height: 30px;
        background: var(--white);
        border-radius: 2px;
        border: 1px solid #ccc;
        color: #98959f;
        &.active {
          background: #fff !important;
          border: 1px solid var(--main-color);
          color: var(--main-color) !important;
        }
      }
    }
  }

  @media screen and (max-width: $screen-xs) {
    .el-pagination {
      .el-pagination__jump {
        display: block;
        text-align: center;
        margin-top: 10px;
        margin-left: 0;
      }
    }
  }
}
</style>
