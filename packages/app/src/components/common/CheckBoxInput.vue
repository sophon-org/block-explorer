<template>
  <label class="checkbox-input-container" :class="{ checked: inputted, disabled }">
    <input type="checkbox" :checked="inputted" v-model="inputted" v-bind="$attrs" :disabled="disabled" />
    <slot />
  </label>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (eventName: "update:modelValue", value: unknown): void;
}>();

const inputted = computed({
  get: () => props.modelValue,
  set: (value: unknown) => {
    emit("update:modelValue", value);
  },
});
</script>

<style lang="scss" scoped>
.checkbox-input-container {
  @apply float-right mb-1 flex cursor-pointer items-center leading-snug;

  &.disabled {
    @apply opacity-50 cursor-default;

    input {
      @apply hover:border-neutral-200 cursor-default;
    }
  }

  input {
    @apply me-1 cursor-pointer rounded border-neutral-200 text-blue ring-transparent checked:border-blue hover:border-blue;
  }
}
</style>
