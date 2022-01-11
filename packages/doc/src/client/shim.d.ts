declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const comp: ComponentOptions;
  // @ts-ignore
  export default comp;
}
declare module "@siteData" {
  const data: Record<string, any>;
  export default data;
}
