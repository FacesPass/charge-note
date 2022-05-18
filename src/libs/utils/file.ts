import { fs } from '@tauri-apps/api'
import { IFsOutput } from '../backend/type'
import { timestampToTime } from './time'

export function isEndsWith(name: string | undefined, ext: string | string[]) {
  if (!name) return false
  if (Array.isArray(ext)) {
    return ext.some((_ext) => name.endsWith(`.${_ext}`))
  }
  return name.endsWith(`.${ext}`)
}

export function isEndsWithMd(name?: string) {
  if (!name) return false
  return isEndsWith(name, ['md', 'markdown', 'MD'])
}

export function isEndsWithTxt(name?: string) {
  if (!name) return false
  return isEndsWith(name, ['txt', 'TXT'])
}

export function isLegalFile(name?: string) {
  if (!name) return false
  return isEndsWithMd(name) || isEndsWithTxt(name)
}

/** 深度递归遍历所有 markdown 文件 */
export function filterMarkdownFile(fileList: IFsOutput[]) {
  if (!fileList.length) return []
  return fileList
    .filter(
      (file) =>
        file.name !== '.git' ||
        isLegalFile(file.name) ||
        (file.children && file.children?.length > 0),
    )
    .sort((a, b) => (b.create_time as number) - (a.create_time as number))
    .map((file) => {
      if (file.children) {
        file.children = filterMarkdownFile(file.children)
      }
      file.create_time = timestampToTime(file.create_time)
      return file
    })
}
