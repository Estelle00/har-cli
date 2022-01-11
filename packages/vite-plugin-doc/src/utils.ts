const VIRTUAL_KEY = "/@virtual-demo:";
export function getVirtualPath(filename: string) {
  return VIRTUAL_KEY + filename;
}
export function isVirtualModule(id: string) {
  return new RegExp(VIRTUAL_KEY).test(id);
}
export function isDemoMarkdown(id: string) {
  return /\/__demo__\//.test(id);
}
export function getFrontMatter(tokens: any[]) {
  for (const token of tokens) {
    if (token.type === "frontMatter") return token.data;
  }
  return undefined;
}
