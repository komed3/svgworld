import { MapOptions } from '../types';

export class SVGWorldMap {

    private container: HTMLElement;
    private svg: SVGSVGElement;

    constructor ( options: MapOptions ) {

        this.container = typeof options.container === 'string'
            ? document.getElementById( options.container ) || document.body
            : options.container;

        this.svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        this.svg.setAttribute( 'width', options.width?.toString() || '100%' );
        this.svg.setAttribute( 'height', options.height?.toString() || '100%' );
        this.svg.setAttribute( 'viewBox', '0 0 1000 500' );
        this.container.appendChild( this.svg );

    }

}
