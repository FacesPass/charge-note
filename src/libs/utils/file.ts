export function isEndsWith(name: string | undefined, ext: string | string[]) {
  if (!name) return
  if (Array.isArray(ext)) {
    return ext.some((_ext) => name.includes(_ext))
  }
  return name.endsWith(`.${ext}`)
}

export function isEndsWithMd(name: string | undefined) {
  if (!name) return
  return isEndsWith(name, ['md', 'markdown', 'MD'])
}
