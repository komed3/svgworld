# SVGWorld

The simple and free to use __SVGWorld__ npm package can be used to draw map based charts. The project is currently in an early alpha release and does not yet include many functions. However, it is highly flexible and can be expanded with other maps or plug-ins.

## Install

Using __Node.js__ install this package with the following command:

```shell
npm install svgworld
```

## Example

```js
import SVGWorld from './index.js';
import world from './maps/world.json' assert { type: 'json' };
import colorScale from './plugins/colorScale.js';

var chart = new SVGWorld( document.getElementById( 'map' ), {
    map: world,
    data: [
        { id: "af", y: 38928346 }, { id: "ax", y: 29013 },
        { id: "al", y: 2877797 }, { id: "dz", y: 43851044 },
        { id: "as", y: 55191 } ...
    ],
    options: {
        plugins: {
            colorScale: {
                minColor: '#2a0211',
                maxColor: '#e30b5c',
                scaleType: 'logarithmic',
                steps: 12
            }
        },
        callbacks: {
            afterAssignData: colorScale
        }
    }
} );
```

## Documentation

### Callback functions

Callback functions can be used to extend or modify the existing code. They are called from different spots and provide various arguments depending on their purpose. The last argument passed is always the SVGWorld class itself.

| Callback | Arguments | Description |
|----------|-----------|-------------|
| ``afterRedraw`` | ``svgworld`` | Fires after drawing map chart. |
| ``afterClearMap`` | ``ìtems``, ``svgworld`` | Fires after clearing map chart, provides map items. |
| ``createMapPath`` | ``item``, ``path`` | Fires after creating SVG path element, provides map item and the SVG path itself. |
| ``mapLoadComplete`` | ``items``, ``map``, ``svg``, ``svgworld`` | Fires after creating whole SVG map and all paths, provides map items, the map itself and the SVG element. |
| ``afterAssignData`` | ``items``, ``svgworld`` | Fires after assigning map data to items, provides this items. |