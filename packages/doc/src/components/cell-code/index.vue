<template>
  <div class="cell-code">
    <div class="cell-code-operation">
      <a-tooltip :content="showCode ? '收起代码' : '展开代码'">
        <a-button
          :class="[
            'cell-code-operation-btn',
            {
              ['cell-code-operation-btn-active']: showCode,
            },
          ]"
          shape="circle"
          size="small"
          @click="handleClick"
        >
          <icon-code />
        </a-button>
      </a-tooltip>
      <a-tooltip content="复制代码">
        <a-button
          class="cell-code-operation-btn"
          shape="circle"
          size="small"
          @click="handleClickCopy"
        >
          <icon-copy />
        </a-button>
      </a-tooltip>
    </div>
    <div ref="contentRef" class="cell-code-content" :style="style">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CellCode",
});
</script>
<script setup lang="ts">
import { computed, CSSProperties, onMounted, ref } from "vue";
import copy from "@/utils/clipboard";
import { Message } from "@arco-design/web-vue";
const showCode = ref(false);
const contentRef = ref<HTMLElement>();
const contentHeight = ref<number>(0);
onMounted(() => {
  if (contentRef.value) {
    const { height } = contentRef.value.getBoundingClientRect();
    contentHeight.value = height;
  }
});
const style = computed<CSSProperties>(() => {
  if (showCode.value) {
    const height = contentRef.value?.firstElementChild?.clientHeight;
    return {
      height: height ? height + "px" : "auto",
    };
  }
  return { height: 0, marginTop: 0 };
});
function handleClick() {
  showCode.value = !showCode.value;
}
function handleClickCopy() {
  const textContent = contentRef.value?.textContent;
  if (textContent) {
    copy(textContent)
      .then(() => Message.success("复制成功！"))
      .catch(() => Message.error("复制失败，请重试！"));
  }
}
</script>
<style scoped lang="less">
.cell-code {
  margin-top: 12px;
  &-content {
    margin-top: 16px;
    overflow: hidden;
    background-color: var(--color-fill-1);
    transition: all 200ms;
  }

  &-operation {
    display: flex;
    justify-content: flex-end;

    & &-btn {
      margin-left: 8px;
      background-color: var(--color-bg-4);
      border: 1px solid var(--color-fill-3);

      &:hover {
        color: rgb(var(--primary-6));
        border-color: rgb(var(--primary-6));
      }

      &-active {
        color: rgb(var(--gray-1));
        background-color: rgb(var(--gray-10));
        border-color: rgb(var(--gray-1));

        &:hover {
          color: rgb(var(--gray-1));
          background-color: rgb(var(--gray-10));
          border-color: rgb(var(--gray-1));
        }
      }
    }
  }
}
</style>
