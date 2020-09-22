# Three Ammo WebWorker Template

A template for running ammojs with threejs in an Offscreen Canvas for greatly improved performance.

## This is a work in progress, but feel free to lurk the code and make an issue for improvements!

You can find a working demo [here](https://three-ammo-webworker-template.netlify.app/) 

This has been mostly taken and adapted from [the threejs offscreen-canvas example](https://threejs.org/examples/?q=offsc#webgl_worker_offscreencanvas), [enable3d's ammo wrapper](https://enable3d.io) and [the Three.js Rendering on Demand
](https://threejsfundamentals.org/threejs/lessons/threejs-rendering-on-demand.html) and improved upon


## TODO: 

- A nice API for arbitrary threading
- Worker -> DOM events
- Ammojs WASM support
- Seperately threaded physics
- Update @enable3d/ammo-physics to run with latest threejs
- add fps counter