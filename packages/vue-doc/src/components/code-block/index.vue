<template>
  <section class="code-block">
    <h2>{{ title }}</h2>
    <slot name="description" />
    <slot />
  </section>
</template>
<script setup lang="ts">
defineProps({
  title: String,
});
</script>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CodeBlock",
});
</script>
<style scoped lang="less">
.code-block {
  h2 {
    margin: 48px 0 12px;
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 20px;
  }

  ::v-deep(p) {
    line-height: 1.5;
  }
}
</style>
