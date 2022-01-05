<template>
  <div class="cell-demo"><slot /></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CellDemo",
});
</script>

<style scoped lang="less">
.cell-demo {
  margin-top: 24px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 2px 2px 0 0;
}
</style>
