export function indexName(
  namespace: string,
  entity: string,
  version: number
): string {
  return `${namespace}-${entity}-${version}`
}
