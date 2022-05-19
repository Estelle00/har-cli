"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDemoVue = exports.getMainVue = void 0;
function getMainVue({ html, imports, components, data }) {
    return `<template>
  <doc-article v-bind="data">
    ${html}
  </doc-article>
</template>
<script lang="ts">
	export const __pageData = ${JSON.stringify(data)};
  import { defineComponent } from "vue";
	${imports.join("\n")};
	export default defineComponent({
	  name: "DocMain",
	  components: { ${components.join(",")} },
	  setup() {
			return {
				data: ${JSON.stringify(data)}
			}
	  }
	})
</script>`;
}
exports.getMainVue = getMainVue;
function getDemoVue({ id, virtualPath, title, description, code, }) {
    return `<template>
  <code-block id="${id}" title="${title}">
    <template #description>${description}</template>
    <cell-demo>
      <virtual-demo />
    </cell-demo>
    <cell-code>
      ${code}
    </cell-code>
  </code-block>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import VirtualDemo from "${virtualPath}";
export default defineComponent({
  name: 'DocDemo',
  components: { VirtualDemo },
});
</script>`;
}
exports.getDemoVue = getDemoVue;
