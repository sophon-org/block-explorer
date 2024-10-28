/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, any>;
  export default component;
}

declare module "vue-i18n" {
  const VueI18n: any;
  export default VueI18n;
  export * from "vue-i18n";
}
