# Three Ammo Offscreen Canvas

A template for running ammojs and threejs in an Offscreen Canvas for greatly improved performance. This template automatically detects if there is no offscreen canvas option available and defaults to using the main thread.

This template allows you to use document and window as normal in the web worker context. This requires modification to some THREE modules such as [OrbitControls](https://github.com/HexaField/three-ammo-webworker-template/blob/727a0a4378486a7be925f72d1f77f09d1177cff2/src/app/OrbitControls.js#L21), If you wish to disable this, remove [these lines](https://github.com/HexaField/three-ammo-webworker-template/blob/727a0a4378486a7be925f72d1f77f09d1177cff2/src/offscreencanvas/elementProxyReceiver.js#L93).

You can find a working demo [here](https://three-ammo-webworker-template.netlify.app/) 

This has been mostly taken and adapted from [the threejs offscreen-canvas example](https://threejs.org/examples/?q=offsc#webgl_worker_offscreencanvas), [enable3d's ammo wrapper](https://enable3d.io) and [the Three.js Rendering on Demand
](https://threejsfundamentals.org/threejs/lessons/threejs-rendering-on-demand.html) and improved upon

## Usage

### Main thread

```
import { createOffscreenCanvas } from './offscreencanvas'
import init from './app/index.js'

const proxy = createOffscreenCanvas(canvas2, './worker.js', init);

const event = new CustomEvent('ping', { detail: Math.random() });
proxy.dispatchEvent(event);
```

### Worker thread

```
import { elementProxyReceiver } from './offscreencanvas'
import init from './app/index.js'

elementProxyReceiver(init)
```

### App

```
export default function (data) {

    const { canvas, inputElement } = data;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas })
    // ... rest of Three app as usual
}
```

## To do

- A nice API for arbitrary webworker threading
- Ammojs WASM example
- Seperately threaded physics
- Update @enable3d/ammo-physics to run with latest threejs
- add fps counter