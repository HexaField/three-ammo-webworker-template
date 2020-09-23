
// adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_worker_offscreencanvas.html

import initJank from './jank.js';
import init from './scene.js';
import { main } from './createOffscreenCanvas'

const canvas1 = document.getElementById( 'canvas1' );
const canvas2 = document.getElementById( 'canvas2' );

// load on screen canvas
canvas1.devicePixelRatio = window.devicePixelRatio

init({ canvas: canvas1, inputElement: canvas1 });
initJank();

// load off screen canvas
const proxy = main(canvas2, 'worker.js')
if(proxy) {
    // console.log('Successfully loaded offscreen canvas!')
} else {
    document.getElementById( 'message' ).style.display = 'block';
}
document.getElementById( 'buttondrop' ).onclick = () => {
    let dropCount = parseInt(document.getElementById( 'dropcount' ).value)
    const event = new CustomEvent('drop', { detail: Math.min(isNaN(dropCount) ? 20 : dropCount, 1000) })
    canvas1.dispatchEvent(event)
    proxy.dispatchEvent(event)
}

document.getElementById( 'buttonclear' ).onclick = () => {
    const event = new CustomEvent('clear')
    canvas1.dispatchEvent(event)
    proxy.dispatchEvent(event)
}
