import { AnchorData } from "../aside-anchor/interface";
import { InjectionKey } from "vue";

interface ArticleContext {
  anchors: AnchorData[];
  addAnchor: (data: AnchorData) => void;
  removeAnchor: (href: string) => void;
}
export const articleInjectKey: InjectionKey<ArticleContext> =
  Symbol("docArticle");
