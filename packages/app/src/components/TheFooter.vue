<template>
  <footer>
    <div class="footer-container container py-12 md:flex md:items-center md:justify-between">
      <div class="links-container flex justify-center space-x-6 md:order-1">
        <a
          class="font-semibold text-gray no-underline hover:text-black"
          rel="noopener"
          target="_blank"
          v-for="item in navigation"
          :href="item.url"
          :key="item.label"
        >
          {{ item.label }}
        </a>
      </div>
      <div class="version-text-container mt-8 text-center font-medium text-gray md:order-2 md:mt-0">
        <!-- <p>{{ config.version }}</p> -->
        <p>0.2.0</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";

import config from "@/configs/hyperchain.config.json";

const { t } = useI18n();

const navigation = reactive([
  {
    label: computed(() => t("footer.nav.docs")),
    url: `${config.networks[0].apiUrl}/docs`,
  },
  {
    label: computed(() => t("footer.nav.terms")),
    url: "https://farm.sophon.xyz/terms.html",
  },
  {
    label: computed(() => t("footer.nav.contact")),
    url: "https://x.com/sophon",
  },
]);
</script>
