
import { createOffscreenCanvas } from './offscreencanvas'

async function start()
{
    const { default: initJank } = await import('./jank.js');
    const { default: init } = await import('./app/index.js');

    const canvas1 = document.getElementById( 'canvas1' );
    const canvas2 = document.getElementById( 'canvas2' );

    // - ONSCREEN CANVAS - //

    // we can put whatever data we need into objects like this!
    canvas1.devicePixelRatio = window.devicePixelRatio;

    init({ canvas: canvas1, inputElement: canvas1 });
    initJank();

    // - OFFSCREEN CANVAS - //

    const proxy = createOffscreenCanvas(canvas2, '/_dist_/worker.js', init);
    if(proxy) {
        console.log('Successfully loaded offscreen canvas!')
    } else {
        document.getElementById( 'message' ).style.display = 'block';
    }

    document.getElementById( 'buttondrop' ).onclick = () => {
        let dropCount = parseInt(document.getElementById( 'dropcount' ).value);
        const event = new CustomEvent('drop', { detail: Math.min(isNaN(dropCount) ? 20 : dropCount, 1000) });
        proxy.dispatchEvent(event);
        canvas1.dispatchEvent(event);
    }

    document.getElementById( 'buttonclear' ).onclick = () => {
        const event = new CustomEvent('clear');
        proxy.dispatchEvent(event);
        canvas1.dispatchEvent(event);
    }

}
start()