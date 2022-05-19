<template>
  <section class="code-block">
    <h2>{{ title }}</h2>
    <slot name="description" />
    <slot />
  </section>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CodeBlock",
});
</script>
<script lang="ts" setup>
import { getCurrentInstance, inject, withDefaults } from "vue";
import { articleInjectKey } from "../doc-article/context";

const article = inject(articleInjectKey);
const props = withDefaults(
  defineProps<{
    title: string;
  }>(),
  { title: "" }
);
if (props.title) {
  const { attrs } = getCurrentInstance()!;
  article?.addAnchor({
    href: `#${attrs.id}`,
    title: props.title,
  });
}
</script>
<style scoped lang="less">
.code-block {
  ::v-deep(blockquote) {
    margin: 0;
  }
  h2 {
    //margin: 36px 0 12px;
    color: var(--color-text-1);
    font-weight: 500;
    //font-size: 20px;
  }

  ::v-deep(p) {
    line-height: 1.5;
  }
}
</style>
