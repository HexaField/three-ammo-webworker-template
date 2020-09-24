import { EventDispatcher } from './EventDispatcher'

export function elementProxyReceiver (init) {
  class ElementProxyReceiver extends EventDispatcher {

    constructor() {
      super()
    }

    get clientWidth() {
      return this.width
    }
    
    get clientHeight() {
      return this.height
    }

    addEventListener(event, listener) {  
      super.addEventListener(event, listener)
      self.postMessage({
        type: 'addEventListener',
        data: event
      })
    }

    removeEventListener(event, listener) {
      super.removeEventListener(event, listener)
      self.postMessage({
        type: 'removeEventListener',
        data: event
      })
    }
    
    getBoundingClientRect() {
      return {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        right: this.left + this.width,
        bottom: this.top + this.height,
      }
    }
    
    handleEvent(data) {
      if (data.type === 'size') {
        this.left = data.left
        this.top = data.top
        this.width = data.width
        this.height = data.height
        return
      }
      data.preventDefault = () => {}
      data.stopPropagation = () => {}
      this.dispatchEvent(data)
    }
    
    focus() {
      // no-op
    }
  }

  class ProxyManager {

    constructor() {
      this.targets = {}
      this.handleEvent = this.handleEvent.bind(this)
    }

    makeProxy(data) {
      const {id} = data
      const proxy = new ElementProxyReceiver()
      this.targets[id] = proxy
    }

    getProxy(id) {
      return this.targets[id]
    }

    handleEvent(data) {
      this.targets[data.id].handleEvent(data.data)
    }
  }

  const proxyManager = new ProxyManager()

  function start(data) {
    const proxy = proxyManager.getProxy(data.canvasId)
    proxy.devicePixelRatio = data.devicePixelRatio

    proxy.ownerDocument = proxy // HACK!

    self.document = proxy
    self.window = proxy

    init({
      canvas: data.canvas,
      inputElement: proxy,
    })
  }

  function makeProxy(data) {
    proxyManager.makeProxy(data)
  }

  const handlers = {
    start,
    makeProxy,
    event: proxyManager.handleEvent,
  }
  
  self.onmessage = function(e) {
    const fn = handlers[e.data.type]
    if (!fn) {
      throw new Error('no handler for type: ' + e.data.type)
    }
    fn(e.data)
  }
}