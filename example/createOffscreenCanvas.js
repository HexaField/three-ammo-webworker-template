
const pointerEventHandler = makeSendPropertiesHandler([
    'ctrlKey',
    'metaKey',
    'shiftKey',
    'button',
    'buttons',
    'pointerType',
    'clientX',
    'clientY',
    'pageX',
    'pageY',
])

const mouseEventHandler = makeSendPropertiesHandler([
    'ctrlKey',
    'metaKey',
    'shiftKey',
    'button',
    'clientX',
    'clientY',
    'pageX',
    'pageY',
]);
const wheelEventHandlerImpl = makeSendPropertiesHandler([
    'deltaX',
    'deltaY',
]);
const keydownEventHandler = makeSendPropertiesHandler([
    'ctrlKey',
    'metaKey',
    'shiftKey',
    'keyCode',
]);

function wheelEventHandler(event, sendFn) {
    event.preventDefault();
    wheelEventHandlerImpl(event, sendFn);
}

function preventDefaultHandler(event) {
    event.preventDefault();
}

function copyProperties(src, properties, dst) {
    for (const name of properties) {
        dst[name] = src[name];
    }
}

function makeSendPropertiesHandler(properties) {
    return function sendProperties(event, sendFn) {
        const data = {type: event.type};
        copyProperties(event, properties, data);
        sendFn(data);
    };
}

function touchEventHandler(event, sendFn) {
    const touches = [];
    const data = {type: event.type, touches};
    for (let i = 0; i < event.touches.length; ++i) {
        const touch = event.touches[i];
        touches.push({
            pageX: touch.pageX,
            pageY: touch.pageY,
        });
    }
    sendFn(data);
}

// The four arrow keys
const orbitKeys = {
    '37': true,  // left
    '38': true,  // up
    '39': true,  // right
    '40': true,  // down
};
function filteredKeydownEventHandler(event, sendFn) {
    const {keyCode} = event;
    if (orbitKeys[keyCode]) {
        event.preventDefault();
        keydownEventHandler(event, sendFn);
    }
}

let nextProxyId = 0;
class ElementProxy
{
    constructor(element, worker, eventHandlers)
    {
        this.id = nextProxyId++;

        this.element = element;
        this.worker = worker;
        this.eventHandlers = eventHandlers;
        this.sendEvent = this.sendEvent.bind(this);
        this.sendSize = this.sendSize.bind(this);

        this.initialise()
    }

    dispatchEvent(event)
    {
        this.worker.postMessage({
            type: 'customevent',
            id: this.id,
            data: {
                type: event.type,
                detail: event.detail
            },
        });
    }

    sendEvent(data)
    {
        this.worker.postMessage({
            type: 'event',
            id: this.id,
            data,
        });
    }

    sendSize()
    {
        const rect = this.element.getBoundingClientRect();
        this.sendEvent({
            type: 'size',
            left: rect.left,
            top: rect.top,
            width: this.element.clientWidth,
            height: this.element.clientHeight,
        });
    }

    initialise()
    {
        // register an id
        this.worker.postMessage({
            type: 'makeProxy',
            id: this.id,
        });

        for (const [eventName, handler] of Object.entries(this.eventHandlers)) {
            this.element.addEventListener(eventName, (event) => {
                handler(event, this.sendEvent);
            });
        }

        this.sendSize();
        // really need to use ResizeObserver
        window.addEventListener('resize', this.sendSize);
    }
}

export function startWorker(canvas, entryPoint) {
    // canvas.focus();
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(entryPoint, {type: 'module'});

    const eventHandlers = {
        contextmenu: preventDefaultHandler,
        mousedown: mouseEventHandler,
        mousemove: mouseEventHandler,
        mouseup: mouseEventHandler,
        pointerdown: pointerEventHandler,
        pointermove: pointerEventHandler,
        pointerup: pointerEventHandler,
        touchstart: touchEventHandler,
        touchmove: touchEventHandler,
        touchend: touchEventHandler,
        wheel: wheelEventHandler,
        keydown: filteredKeydownEventHandler,
    };

    const proxy = new ElementProxy(canvas, worker, eventHandlers);
    worker.postMessage({
        type: 'start',
        canvas: offscreen,
        canvasId: proxy.id,
        devicePixelRatio: window.devicePixelRatio
    }, [offscreen]);
    return proxy
}
export function main(canvas, entryPoint) {  /* eslint consistent-return: 0 */
    if (canvas.transferControlToOffscreen) {
        return startWorker(canvas, entryPoint);
    }
}