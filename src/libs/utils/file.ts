import { fs } from '@tauri-apps/api'

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

export function isEndsWithTxt(name: string | undefined) {
  if (!name) return
  return isEndsWith(name, ['txt', 'TXT'])
}

export function isLegalFile(name: string | undefined) {
  if (!name) return
  return isEndsWithMd(name) || isEndsWithTxt(name)
}

/** 深度递归遍历所有 markdown 文件 */
export function filterMarkdownFile(fileList: fs.FileEntry[]) {
  if (!fileList.length) return []
  return fileList
    .filter(
      (file) =>
        file.name !== '.git' ||
        isLegalFile(file.name) ||
        (file.children && file.children?.length > 0),
    )
    .map((file) => {
      if (file.children) {
        file.children = filterMarkdownFile(file.children)
      }
      return file
    })
}
