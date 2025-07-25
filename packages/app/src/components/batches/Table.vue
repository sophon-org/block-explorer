<template>
  <Table class="batches-table" :class="{ loading }" :items="batches" :loading="loading">
    <template v-if="batches?.length || loading" #table-head>
      <TableHeadColumn v-if="columns.includes('status')">{{ t("batches.table.status") }}</TableHeadColumn>
      <TableHeadColumn v-if="columns.includes('txnBatch')">{{ t("batches.table.txnBatch") }}</TableHeadColumn>
      <TableHeadColumn v-if="columns.includes('size')">{{ t("batches.table.size") }}</TableHeadColumn>
      <TableHeadColumn v-if="columns.includes('age')">{{ t("batches.table.age") }}</TableHeadColumn>
    </template>
    <template #loading>
      <tr class="loader-row" v-for="item in loadingRows" :key="item">
        <TableBodyColumn v-for="(col, index) in 4" :key="`col-${index}`" class="loader-col">
          <ContentLoader />
        </TableBodyColumn>
      </tr>
    </template>
    <template #table-row="{ item }: { item: any }">
      <TableBodyColumn v-if="columns.includes('status')" :data-heading="t('batches.table.status')">
        <div class="status-badge-container">
          <Badge color="dark-success" :data-testid="$testId.statusBadge">
            <template #default>
              {{ te(`batches.status.${item.status}`) ? t(`batches.status.${item.status}`) : item.status
              }}<component :is="getBadgeIconByStatus(item)" />
            </template>
          </Badge>
        </div>
      </TableBodyColumn>
      <TableBodyColumn v-if="columns.includes('txnBatch')" :data-heading="t('batches.table.txnBatch')">
        <router-link :to="{ name: 'batch', params: { id: item.number } }"> #{{ item.number }} </router-link>
      </TableBodyColumn>
      <TableBodyColumn v-if="columns.includes('size')" :data-heading="t('batches.table.size')">
        <router-link :to="{ name: 'batch', params: { id: item.number, scrollToTxns: true } }">
          {{ item.l1TxCount + item.l2TxCount }}
        </router-link>
      </TableBodyColumn>
      <TableBodyColumn v-if="columns.includes('age')" :data-heading="t('batches.table.age')">
        <CopyButton :value="utcStringFromISOString(item.timestamp)">
          <TimeField :value="item.timestamp" :format="TimeFormat.TIME_AGO" />
        </CopyButton>
      </TableBodyColumn>
    </template>
    <template #empty>
      <TableBodyColumn class="batches-not-found" :colspan="4">
        <slot name="not-found">{{ t("batches.table.notFound") }}</slot>
      </TableBodyColumn>
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </Table>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

import Badge from "@/components/common/Badge.vue";
import CopyButton from "@/components/common/CopyButton.vue";
import ContentLoader from "@/components/common/loaders/ContentLoader.vue";
import Table from "@/components/common/table/Table.vue";
import TableBodyColumn from "@/components/common/table/TableBodyColumn.vue";
import TableHeadColumn from "@/components/common/table/TableHeadColumn.vue";
import TimeField from "@/components/common/table/fields/TimeField.vue";
import EthereumIcon from "@/components/icons/Ethereum.vue";
import GatewayIcon from "@/components/icons/Gateway.vue";
import SophonIcon from "@/components/icons/Sophon.vue";

import useContext from "@/composables/useContext";

import type { BatchListItem } from "@/composables/useBatches";
import type { PropType } from "vue";

import { TimeFormat } from "@/types";
import { utcStringFromISOString } from "@/utils/helpers";

const { t, te } = useI18n();
const { isGatewaySettlementChain } = useContext();

defineProps({
  batches: {
    type: Array as PropType<BatchListItem[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: true,
  },
  loadingRows: {
    type: Number,
    default: 10,
  },
  columns: {
    type: Array as PropType<string[]>,
    default: () => ["status", "txnBatch", "size", "age"],
  },
});

function getBadgeIconByStatus(batch: BatchListItem) {
  if (batch.status === "sealed") {
    return SophonIcon;
  }
  return isGatewaySettlementChain(batch.commitChainId) ? GatewayIcon : EthereumIcon;
}
</script>

<style lang="scss">
.batches-table {
  &.loading {
    .table-body td::before {
      @apply opacity-30;
    }
  }
  td {
    @apply py-2 md:py-3.5;
  }
  .status-badge {
    .badge-dot {
      @apply h-1.5 w-1.5 rounded-full bg-current;
    }
  }

  .table-body {
    @apply rounded-t-2xl;

    td {
      @apply relative flex flex-col items-end justify-end whitespace-normal text-right md:table-cell md:text-left;

      &:before {
        @apply absolute left-4 top-2 whitespace-nowrap pr-5 text-left text-xs uppercase text-neutral-400 content-[attr(data-heading)] md:content-none;
      }
    }
  }
  .external-link-icon {
    @apply ml-1 inline-block w-5 align-sub;
  }
  td.batches-not-found {
    @apply my-0 table-cell items-start justify-start bg-white p-4 text-left text-gray;
  }
  .copy-button-container {
    @apply flex w-fit;
    .copy-button {
      @apply static p-0 focus:ring-0;
    }
  }
  .badge-content {
    @apply flex items-center;
    white-space: nowrap;

    svg {
      @apply ml-1;
    }
  }
  .badge-container.type-label {
    @apply pr-2 normal-case;
  }
}
</style>
