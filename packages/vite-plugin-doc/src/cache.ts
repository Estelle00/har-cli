const cache = new Map();
export function setCache(id: string, context: string) {
  cache.set(id, context);
}
export function getCache(id: string) {
  return cache.get(id);
}
