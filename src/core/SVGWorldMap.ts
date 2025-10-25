import { HookCallback, Hooks, MapData, MapEvent, MapOptions } from '../types';
import { GeoProjection } from './GeoProjection';
import { PluginManager } from './PluginManager';
import { ThemeManager } from './ThemeManager';

export class SVGWorldMap {

    private _container: HTMLElement;
    private _svg: SVGSVGElement;
    private _themeManager: ThemeManager;
    private _pluginManager: PluginManager;
    private _hooks: Hooks = {};
    private _data: MapData[] = [];

    constructor ( options: MapOptions ) {

        this._container = typeof options.container === 'string'
            ? document.getElementById( options.container ) || document.body
            : options.container;

        this._svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        this._svg.setAttribute( 'width', options.width?.toString() || '100%' );
        this._svg.setAttribute( 'height', options.height?.toString() || '100%' );
        this._svg.setAttribute( 'viewBox', '0 0 1000 500' );
        this._container.appendChild( this._svg );

        this._themeManager = new ThemeManager( this, options.theme );
        this._pluginManager = new PluginManager( this, options.plugins );

        this.initEventHandler();
        this.render();

    }

    // Hook system

    public addHook ( event: string, callback: HookCallback ) : void {

        if ( ! this._hooks[ event ] ) this._hooks[ event ] = [];
        this._hooks[ event ].push( callback );

    }

    public removeHook ( event: string, callback: HookCallback ) : void {

        if ( this._hooks[ event ] ) this._hooks[ event ] = this._hooks[ event ].filter(
            cb => cb !== callback
        );

    }

    private triggerHook ( event: string, data?: any ) : void {

        if ( this._hooks[ event ] ) {

            const mapEvent: MapEvent = { type: event, target: this, data };
            this._hooks[ event ].forEach( callback => callback( mapEvent ) );

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

        this._svg.addEventListener( 'mouseover', this.handleMouseOver.bind( this ) );
        this._svg.addEventListener( 'mouseout', this.handleMouseOut.bind( this ) );
        this._svg.addEventListener( 'click', this.handleClick.bind( this ) );

    }

    // Rendering

    private render () : void {

        // Clear existing content
        while ( this._svg.firstChild ) this._svg.removeChild( this._svg.firstChild );

        // Render map data
        this._data.forEach( item => { if ( item.geometry.type === 'Polygon' || item.geometry.type === 'MultiPolygon' ) {

            const path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
            path.setAttribute( 'd', this.generatePath( item.geometry.coordinates ) );
            path.setAttribute( 'id', item.id );
            path.setAttribute( 'data-name', item.properties.name );
            this._themeManager.applyTheme( path );
            this._svg.appendChild( path );

        } } );

        this.triggerHook( 'render' );

    }

    private generatePath ( coordinates: any[] ) : string {

        const projection = new GeoProjection( 1000, 500 );

        if ( Array.isArray( coordinates[ 0 ] ) && Array.isArray( coordinates[ 0 ][ 0 ] ) ) {

            // MultiPolygon
            return projection.projectMultiPolygon( coordinates );

        } else {

            // Single Polygon
            return projection.projectPolygon( coordinates );

        }

    }

    // Public API

    public get container () : HTMLElement { return this._container }
    public get svg () : SVGSVGElement { return this._svg }
    public get themeManager () : ThemeManager { return this._themeManager }
    public get pluginManager () : PluginManager { return this._pluginManager }

    public update ( data?: MapData[] ) : void {

        if ( data ) this._data = data;
        this.render();

    }

    public destroy () : void {

        this._svg.removeEventListener( 'mouseover', this.handleMouseOver.bind( this ) );
        this._svg.removeEventListener( 'mouseout', this.handleMouseOut.bind( this ) );
        this._svg.removeEventListener( 'click', this.handleClick.bind( this ) );

        this._pluginManager.destroy();
        this._container.removeChild( this._svg );
        this._hooks = {};

    }

}
