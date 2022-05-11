export function splitPath(path: string): string[] {
  if (!path) return []
  return path.split('\\')
}

/** 获取所有相同字符串的起始下标 */
export function indexOfStr(str: string, search: string): number[] {
  const res = []

  let pos = str.indexOf(search)
  while (pos > -1) {
    res.push(pos)
    pos = str.indexOf(search, pos + 1)
  }

  return res
}
