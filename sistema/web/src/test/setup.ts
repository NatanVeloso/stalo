import '@testing-library/jest-dom/vitest'

/**
 * O jsdom não implementa `showModal`/`close` do <dialog>. Polyfill mínimo, só o que o `Drawer`
 * usa: liga/desliga o atributo `open` e `close()` dispara o evento `close` (é ele que chama `onClose`).
 */
if (typeof HTMLDialogElement !== 'undefined') {
  const proto = HTMLDialogElement.prototype
  proto.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.show = proto.showModal
  proto.close = function close(this: HTMLDialogElement, returnValue?: string) {
    if (!this.hasAttribute('open')) return
    if (returnValue !== undefined) this.returnValue = returnValue
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}

/** O `Segmented` (e o Radix) observam tamanho; o jsdom não tem `ResizeObserver`. */
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
