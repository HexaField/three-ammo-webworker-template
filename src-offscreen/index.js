
// adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_worker_offscreencanvas.html

import initJank from './jank.js';
import init from './scene.js';
import { main } from './createOffscreenCanvas'

var canvas1 = document.getElementById( 'canvas1' );
var canvas2 = document.getElementById( 'canvas2' );

// load on screen canvas
canvas1.devicePixelRatio = window.devicePixelRatio

init({ canvas: canvas1, inputElement: canvas1 });
initJank();

// load off screen canvas

if(main(canvas2, 'worker.js')) {
    console.log('Successfully loaded offscreen canvas!')
} else {
    document.getElementById( 'message' ).style.display = 'block';
}