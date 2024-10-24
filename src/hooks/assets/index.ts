export const useAssets = (name: string) => {
  return new URL(`../../assets/${name}`, import.meta.url).href
}
