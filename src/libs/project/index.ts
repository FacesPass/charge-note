import { appWindow } from '@tauri-apps/api/window'
import { getName } from '@tauri-apps/api/app'

export async function initWindow() {
  const appName = await getName()
  const titlebarName = document.getElementById('titlebar-name')
  titlebarName && (titlebarName.innerHTML = `${appName}`)

  document
    .getElementById('titlebar-minimize')
    ?.addEventListener('click', () => appWindow.minimize())

  document.getElementById('titlebar-close')?.addEventListener('click', () => {
    appWindow.hide()
  })
}

export function handleGlobalEvent() {
  document.body.addEventListener('click', (e: any) => {
    if (e.target?.tagName === 'A') {
      window.open(e.target.origin)
      e.preventDefault()
    }
  })

  // window.oncontextmenu = () => {
  //   return false
  // }
}
