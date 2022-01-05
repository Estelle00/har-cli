<template>
  <aside class="doc-aside" :class="cls">
    <div class="aside-top">
      <a-button
        size="large"
        shape="circle"
        class="aside-btn"
        :class="btnCls"
        @click="() => toggle(!show)"
      >
        <icon-right v-if="show" />
        <icon-left v-else />
      </a-button>
    </div>
    <a-anchor class="anchor">
      <a-anchor-link
        v-for="(item, index) in anchors"
        :key="index"
        :href="item.href"
        >{{ item.title }}</a-anchor-link
      >
    </a-anchor>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "aside-anchor",
});
</script>
<script lang="ts" setup>
import { AnchorData } from "./interface";
import { computed, withDefaults } from "vue";
import UseCollapseAnchor from "@/hooks/useCollapseAnchor";
withDefaults(defineProps<{ anchors: AnchorData[] }>(), {
  anchors: () => [],
});
const [show, toggle] = UseCollapseAnchor();
const cls = computed(() => {
  return {
    "aside-collapse": !show.value,
  };
});
const btnCls = computed(() => {
  return {
    "aside-collapse-btn": !show.value,
  };
});
</script>
<style lang="less" scoped>
.doc-aside {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  width: 180px;
  padding: 0 24px;
  background-color: var(--color-bg-1);
  border-left: 1px solid var(--color-border);
  transition: right 200ms;
  z-index: 1;
  &.aside-collapse {
    right: -180px;
  }
  .aside-top {
    margin: 40px 0;
    .aside-btn {
      position: relative;
      left: 0;
      transition: left 200ms;
    }
    .aside-collapse-btn {
      left: -52px;
      width: 28px;
      background-color: var(--color-bg-5);
      border-radius: 18px 0 0 18px;
      box-shadow: -1px 0 5px 0 rgba(0, 0, 0, 0.1);
      &:hover {
        color: var(--color-text-2);
        background-color: var(--color-secondary-hover);
      }
    }
  }
}
</style>
