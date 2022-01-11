<script setup lang="ts">
import { computed } from "vue";
import { useData } from "@har/doc";
// components
// import NavBar from "./components/NavBar.vue";
// import SideBar from "./components/SideBar.vue";
import Page from "./components/Page.vue";

// const Home = defineAsyncComponent(() => import("./components/Home.vue"));

const { site, frontmatter } = useData();

// custom layout
const isCustomLayout = computed(() => !!frontmatter.value.customLayout);
// home
const enableHome = computed(() => !!frontmatter.value.home);

// navbar
const showNavbar = computed(() => {
  if (frontmatter.value.navbar === false) {
    return false;
  }
  return site.value.title;
});

const pageClasses = computed(() => {
  return [
    {
      "no-navbar": !showNavbar.value,
    },
  ];
});
</script>

<template>
  <div class="theme" :class="pageClasses">
    <doc-content v-if="isCustomLayout" />
    <Page v-else>
      <template #top>
        <slot name="page-top" />
      </template>
      <template #bottom>
        <slot name="page-bottom" />
      </template>
    </Page>
  </div>
</template>
