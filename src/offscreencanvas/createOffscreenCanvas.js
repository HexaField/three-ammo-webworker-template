let nextProxyId = 0

class ElementProxy {
    constructor(element, worker) {
        this.id = nextProxyId++

        this.element = element
        this.worker = worker
        this.sendEvent = this.sendEvent.bind(this)
        this.sendSize = this.sendSize.bind(this)
        this.handleMessageFromWorker = this.handleMessageFromWorker.bind(this)
        this.addEventListener = this.addEventListener.bind(this)
        this.removeEventListener = this.removeEventListener.bind(this)
        this.dispatchEvent = this.dispatchEvent.bind(this)

        this.handlers = {
            addEventListener: this.addEventListener,
            removeEventListener: this.removeEventListener,
        }
        
        this.initialise()
    }

    addEventListener(event) {
        this.element.addEventListener(event.data, this.dispatchEvent)
    }

    removeEventListener(event) {
        this.element.removeEventListener(event.data, this.dispatchEvent)
    }
    
    handleMessageFromWorker(message) {
        const fn = this.handlers[message.data.type]
        if (!fn) {
            throw new Error('no handler for type: ' + message.data.type)
        }
        fn(message.data)
    }

    dispatchEvent(event) {
        let messageData = {}
        for(let prop in event)
            if(typeof event[prop] !== 'function' && typeof event[prop] !== 'object')
                messageData[prop] = event[prop]
        
        this.worker.postMessage({
            type: 'event',
            id: this.id,
            data: messageData
        })
    }

    sendEvent(data) {
        this.worker.postMessage({
            type: 'event',
            id: this.id,
            data,
        })
    }

    sendSize() {
        const rect = this.element.getBoundingClientRect()
        this.sendEvent({
            type: 'size',
            left: rect.left,
            top: rect.top,
            width: this.element.clientWidth,
            height: this.element.clientHeight,
        })
    }

    initialise() {
        // register an id
        this.worker.postMessage({
            type: 'makeProxy',
            id: this.id,
        })

        this.worker.addEventListener("message", this.handleMessageFromWorker)
        this.sendSize()
        window.addEventListener('resize', this.sendSize)
    }
}

function startWorker(canvas, workerURL) {
    const offscreen = canvas.transferControlToOffscreen()
    const worker = new Worker(workerURL, { type: 'module' })
    
    const proxy = new ElementProxy(canvas, worker)
    worker.postMessage({
        type: 'start',
        canvas: offscreen,
        canvasId: proxy.id,
        devicePixelRatio: window.devicePixelRatio
    }, [offscreen])

    return proxy
}

// if we don't have web worker
function startMainPage(canvas, entryPoint) {
    entryPoint({canvas, inputElement: canvas})
}

export function createOffscreenCanvas(canvas, workerURL, entryPoint) {
    if (canvas.transferControlToOffscreen) {
        return startWorker(canvas, workerURL)
    } else {
        startMainPage(canvas, entryPoint)
        return false
    }
}