export function createObjectURL(file: File) {
  const URL = window.URL || window.webkitURL
  return URL.createObjectURL(file)
}
