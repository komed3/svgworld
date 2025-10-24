import { HookCallback, Hooks, MapEvent, MapOptions } from '../types';

export class SVGWorldMap {

    private container: HTMLElement;
    private svg: SVGSVGElement;
    private hooks: Hooks = {};

    constructor ( options: MapOptions ) {

        this.container = typeof options.container === 'string'
            ? document.getElementById( options.container ) || document.body
            : options.container;

        this.svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        this.svg.setAttribute( 'width', options.width?.toString() || '100%' );
        this.svg.setAttribute( 'height', options.height?.toString() || '100%' );
        this.svg.setAttribute( 'viewBox', '0 0 1000 500' );
        this.container.appendChild( this.svg );

        this.initEventHandler();

    }

    // Hook system

    public addHook ( event: string, callback: HookCallback ) : void {

        if ( ! this.hooks[ event ] ) this.hooks[ event ] = [];
        this.hooks[ event ].push( callback );

    }

    public removeHook ( event: string, callback: HookCallback ) : void {

        if ( this.hooks[ event ] ) this.hooks[ event ] = this.hooks[ event ].filter(
            cb => cb !== callback
        );

    }

    private triggerHook ( event: string, data?: any ) : void {

        if ( this.hooks[ event ] ) {

            const mapEvent: MapEvent = { type: event, target: this, data };
            this.hooks[ event ].forEach( callback => callback( mapEvent ) );

        }

    }

    // Event handlers

    private handleMouseOver ( event: MouseEvent ) : void {

        const target = event.target as SVGElement;
        if ( target.tagName === 'path' ) this.triggerHook( 'hover', { element: target } );

    }

    private handleMouseOut ( event: MouseEvent ) : void {

        const target = event.target as SVGElement;
        if ( target.tagName === 'path' ) this.triggerHook( 'unhover', { element: target } );

    }

    private handleClick ( event: MouseEvent ) : void {

        const target = event.target as SVGElement;
        if ( target.tagName === 'path' ) this.triggerHook( 'select', { element: target } );

    }

    private initEventHandler () : void {

        this.svg.addEventListener( 'mouseover', this.handleMouseOver.bind( this ) );
        this.svg.addEventListener( 'mouseout', this.handleMouseOut.bind( this ) );
        this.svg.addEventListener( 'click', this.handleClick.bind( this ) );

    }

}
