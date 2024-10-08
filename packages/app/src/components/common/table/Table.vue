<template>
  <div
    class="table-container w-full rounded-2xl shadow-soft"
    :class="[{ 'has-head': !!$slots['table-head'] }, { 'has-footer': !!$slots['footer'] }]"
  >
    <div class="table-body">
      <table cellspacing="0" cellpadding="0">
        <thead v-if="$slots['table-head']">
          <tr>
            <slot name="table-head"></slot>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <slot />
          <template v-if="items?.length">
            <tr v-for="(item, index) in items" :key="index">
              <slot name="table-row" :item="item" :index="index"></slot>
            </tr>
          </template>
          <template v-else-if="$slots.empty && !failed">
            <slot name="empty"></slot>
          </template>
          <template v-else-if="$slots.failed && failed">
            <slot name="failed"></slot>
          </template>
        </tbody>
        <tbody v-else>
          <slot name="loading" />
        </tbody>
      </table>
    </div>
    <div v-if="$slots.footer" class="table-footer" :class="[items?.length! % 2 ? 'bg-neutral-50' : 'bg-white']">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  items: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Array as PropType<any[] | null>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: true,
  },
  failed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.table-container {
  .table-body {
    @apply w-full overflow-auto;

    & > table > thead tr {
      @apply absolute left-[-9999px] top-[-9999px] md:relative md:left-0 md:top-0;
    }
  }
  &.has-head {
    table thead tr th {
      @apply first:rounded-tl-lg last:rounded-tr-lg;
    }
  }
  &:not(.has-head) {
    table tbody tr:first-child td {
      @apply first:rounded-tl-lg last:rounded-tr-lg;
    }
  }
  &:not(.has-footer) {
    .table-body {
      @apply rounded-b-2xl;
    }

    table tbody tr:last-child td {
      @apply first:rounded-bl-2xl last:rounded-br-2xl;
    }
  }

  table {
    @apply w-full border-collapse border-none;

    thead {
      tr th {
        @apply bg-white;
      }
    }
    tbody {
      tr {
        @apply transition odd:bg-white even:bg-blue-lightest;
      }
    }
  }
  .table-footer {
    @apply w-full rounded-b-lg;
  }
}
</style>
