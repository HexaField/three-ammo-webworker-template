import init from './scene.js';

self.onmessage = function ( message ) {
	if(!message.data) return
	var data = message.data;
	init( data.canvas, data.width, data.height, data.pixelRatio );
};