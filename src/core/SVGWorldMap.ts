import { HookCallback, Hooks, MapData, MapEvent, MapOptions } from '../types';

export class SVGWorldMap {

    private container: HTMLElement;
    private svg: SVGSVGElement;
    private hooks: Hooks = {};
    private data: MapData[] = [];

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
        this.render();

    }

    public setData ( data: MapData[] ) : void {

        this.data = data;
        this.render();

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

    // Rendering

    private render () : void {

        // Clear existing content
        while ( this.svg.firstChild ) this.svg.removeChild( this.svg.firstChild );

        // Render map data
        this.data.forEach( item => { if ( item.geometry.type === 'Polygon' || item.geometry.type === 'MultiPolygon' ) {

            const path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
            path.setAttribute( 'd', this.generatePath( item.geometry.coordinates ) );
            path.setAttribute( 'id', item.id );
            path.setAttribute( 'data-name', item.properties.name );
            this.svg.appendChild( path );

        } } );

        this.triggerHook( 'render' );

    }

    private generatePath ( coordinates: any[] ) : string {

        return '';

    }

}
