export interface MainVueType {
  html: string;
  imports: string[];
  components: string[];
  data: Record<string, any>;
}
export function getMainVue({ html, imports, components, data }: MainVueType) {
  return `<template>
  <doc-article v-bind="data">
    ${html}
  </doc-article>
</template>
<script lang="ts">
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
export interface DemoVueType {
  id: string;
  virtualPath: string;
  title: string;
  description: string;
  code: string;
}
export function getDemoVue({
  id,
  virtualPath,
  title,
  description,
  code,
}: DemoVueType) {
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
