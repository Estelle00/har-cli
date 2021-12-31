const VIRTUAL_KEY = "@virtual-demo:";
export function getVirtualPath(filename: string) {
  return VIRTUAL_KEY + filename;
}
export function isVirtualModule(id: string) {
  return new RegExp(VIRTUAL_KEY).test(id);
}
