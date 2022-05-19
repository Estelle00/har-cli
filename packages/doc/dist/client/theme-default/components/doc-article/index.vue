<template>
  <aside-anchor v-if="anchors.length" :anchors="anchors" />
  <main class="main">
    <article class="doc-article">
      <div class="article-header" v-if="title || description">
        <h1 class="article-title" v-if="title">{{ title }}</h1>
        <div v-if="description" class="article-description">
          {{ description }}
        </div>
      </div>
      <div class="article-content">
        <slot />
      </div>
    </article>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DocArticle",
});
</script>
<script lang="ts" setup>
import AsideAnchor from "../aside-anchor/index.vue";
import { provide, reactive } from "vue";
import { articleInjectKey } from "./context";
import { AnchorData } from "../aside-anchor/interface";

defineProps<{
  title?: string;
  description?: string;
}>();
const anchors = reactive<AnchorData[]>([]);
provide(
  articleInjectKey,
  reactive({
    anchors,
    addAnchor(data: AnchorData) {
      anchors.push(data);
    },
    removeAnchor(href: string) {
      const index = anchors.findIndex((item) => item.href === href);
      if (index > -1) {
        anchors.splice(index, 1);
      }
    },
  })
);
</script>
<style scoped lang="less">
.main {
  .doc-article {
    max-width: 70vw;
    min-width: 320px;
    min-height: 800px;
    margin: 0 auto;
    padding: 0 56px 100px;
    .article-header {
      padding: 36px 0;
      border-bottom: 1px solid var(--color-border);
    }
    .article-title {
      margin: 20px 0 12px;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 36px;
    }
    .article-description {
      color: var(--color-text-2);
      line-height: 20px;
    }
    & ::v-deep(h3) {
      margin-top: 24px;
      line-height: 24px;
    }

    & ::v-deep(code) {
      padding: 2px 8px;
      color: var(--color-text-2);
      background-color: var(--color-neutral-2);
    }
    & ::v-deep(.code-content) {
      box-sizing: border-box;
      margin: 0;
      border-radius: 4px;
      code {
        color: #ccc;
        padding: 0;
        white-space: pre-wrap;
        background-color: transparent;
      }
    }
  }
}
</style>
