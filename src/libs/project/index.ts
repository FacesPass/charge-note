import { appWindow } from '@tauri-apps/api/window'
import { dialog } from '@tauri-apps/api'
import { getName } from '@tauri-apps/api/app'

export async function handleWindow() {
  const appName = await getName()
  const titlebarName = document.getElementById('titlebar-name')
  titlebarName && (titlebarName.innerHTML = `${appName}`)

  document
    .getElementById('titlebar-minimize')
    ?.addEventListener('click', () => appWindow.minimize())

  document.getElementById('titlebar-close')?.addEventListener('click', () => {
    dialog
      .ask('是：退出到托盘\r否：直接退出', '是否退出到系统托盘')
      .then((answer) => {
        if (!answer) {
          appWindow.close()
          return
        }

        appWindow.hide()
      })
  })
}
