export function pathToFile(path: string): string {
  let pagePath = path.replace(/\.html$/, "");
  pagePath = decodeURIComponent(pagePath);
  if (pagePath.endsWith("/")) {
    pagePath += "readme";
  }
  if (import.meta.env.DEV) {
    pagePath += ".md?t=" + Date.now();
  }
  return pagePath;
}
