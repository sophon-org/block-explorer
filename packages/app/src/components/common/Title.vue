<template>
  <span>
    <h1
      class="title-container flex flex-wrap break-all text-3xl font-semibold tracking-tight sm:text-4xl"
      :data-testid="$testId.pageTitle"
    >
      {{ title }}&nbsp;
      <div v-if="!isName && value" class="title-block flex items-center gap-3 font-semibold">
        <slot>{{ shortValue(value) }}</slot>
        <CopyButton :value="value" class="title-copy-button" />
      </div>
      <div class="badge-container">
        <Badge v-if="isVerified" color="dark-success" class="verified-badge" :tooltip="t('contract.verifiedTooltip')">
          {{ t("contract.verified") }}
        </Badge>
        <Badge v-if="isEvmLike" color="primary" class="verified-badge" :tooltip="t('contract.evmTooltip')">
          {{ t("contract.evm") }}
        </Badge>
      </div>
    </h1>
    <div v-if="subTitle">
      <span class="text-md text-gray-500">{{ subTitle }}</span>
    </div>
  </span>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";

import Badge from "./Badge.vue";

import CopyButton from "@/components/common/CopyButton.vue";

import { shortValue } from "@/utils/formatters";

defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
  },
  subTitle: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
  },
  isEvmLike: {
    type: Boolean,
    default: false,
    required: false,
  },
  isName: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const { t } = useI18n();
</script>
<style lang="scss">
.title-container {
  @apply flex flex-wrap break-all text-3xl sm:text-4xl items-center;
  .title-block {
    @apply flex gap-4 self-center font-bold;
    .title-copy-button {
      .copy-button {
        @apply -top-1 flex text-inherit hover:text-neutral-400 sm:-top-1.5;
        .copy-button-icon {
          @apply h-6 w-6 sm:h-7 sm:w-7;
        }
      }
    }
  }
  .badge-container {
    @apply flex flex-wrap break-all items-center gap-0 ml-2;
  }
}
</style>
