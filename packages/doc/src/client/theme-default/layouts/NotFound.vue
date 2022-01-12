<template>
  <div class="theme-container">
    <div class="theme-default-content">
      <h1>404</h1>

      <blockquote>{{ getMsg() }}</blockquote>

      <a :href="site.base">返回首页</a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useData } from "@har/doc";

const { site } = useData();
const msgs = [
  `There's nothing here.`,
  `How did we get here?`,
  `That's a Four-Oh-Four.`,
  `Looks like we've got some broken links.`,
];

function getMsg() {
  return msgs[Math.floor(Math.random() * msgs.length)];
}
</script>
