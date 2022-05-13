export function markdownBodyLayout() {
  const markdownBody = document.querySelector('.markdown-body') as HTMLElement
  markdownBody.style.overflowY = 'auto'
  markdownBody.style.height = 'calc(100vh - 30px)'
  markdownBody.style.padding = '0 20px 20px'
}

export function tracingHeightLayout() {
  const tracingHeight = (document.querySelector('.path-tracing') as HTMLElement)
    .offsetHeight
  ;(document.querySelector('.file-list') as HTMLElement).style.marginTop =
    tracingHeight + 'px'
}
