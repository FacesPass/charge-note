export function markdownBodyLayout() {
  const markdownBody = document.querySelector('.markdown-body') as HTMLElement
  if (!markdownBody.style) return
  markdownBody.style.overflowY = 'auto'
  markdownBody.style.height = 'calc(100vh - 30px)'
  markdownBody.style.padding = '0 20px 20px'
}

export function tracingHeightLayout() {
  const tracingHeight = (document.querySelector('.path-tracing') as HTMLElement).offsetHeight

  const fileList = document.querySelector('.file-list') as HTMLElement
  if (!fileList) return
  fileList.style.marginTop = tracingHeight + 'px'
}
