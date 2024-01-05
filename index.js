/**
 * SVGWorld
 * 
 * @author komed3 (Paul Köhler)
 * @version 0.1.0
 * @license MIT
 */

'use strict';

/**
 * import default style
 */
import style from './themes/default.json' assert { type: 'json' };

/**
 * SVGWorld class
 */
export default class SVGWorld {

    /**
     * map container
     */
    container;

    /**
     * map options
     */
    options;

    /**
     * map items
     */
    mapItems;

    /**
     * SVGWorld constructor
     * @param {Element} container map container
     * @param {Object} options map options
     */
    constructor ( container, options ) {

        /**
         * if container is not a valid DOM element
         * throw error
         */
        if( !( container instanceof Element ) ) {

            throw new Error ( '[SVGWorld ERR] container is not a DOM element' );

        }

        this.container = container;
        this.options = options;

        /**
         * draw map
         */

        this.redraw();

    };

    /**
     * redraw whole map
     */
    redraw () {

        /**
         * container style
         */

        this.#style(
            this.container, 'container',
            this.options.options?.container?.style
        );

        /**
         * remove SVG Element if exists
         */

        let svg = this.container.querySelector( 'svg' );

        if( svg ) {

            svg.remove();

        }

        /**
         * clear map items
         */

        this.mapItems = {};

        /**
         * load map
         */

        this.#loadMap();

        /**
         * assign map data
         */

        this.#assignData();

        /**
         * callback "afterRedraw"
         */
        this.#callback( 'afterRedraw' );

    };

    /**
     * clear map
     * delete all drawn data
     */
    clearMap () {

        Object.keys( this.mapItems ).forEach( ( id ) => {

            let item = this.mapItems[ id ];

            item.data = {};

            this.#style(
                item.svgEl, 'emptyPath',
                this.options.options?.path?.emptyStyle
            );

        } );

        /**
         * callback "afterClearMap"
         * @param {Object} items map items
         */
        this.#callback( 'afterClearMap', [ this.mapItems ] );

    };

    /**
     * private methodes
     */

    /**
     * create SVG element
     * load map items
     */
    #loadMap () {

        let map = this.options.map || null;

        /**
         * if map is not defined or contains no paths
         * throw error
         */
        if( typeof map != 'object' || !map.paths || typeof map.paths != 'object' ) {

            throw new Error ( '[SVGWorld ERR] map is not defined or contains no paths' );

        }

        /**
         * create SVG map
         */

        let svgns = 'http://www.w3.org/2000/svg';

        let svg = document.createElementNS( svgns, 'svg' );

        svg.classList.add( 'svgworld-plane' );
        svg.setAttribute( 'viewBox', map.viewBox || '0 0 100 100' );

        this.#style( svg, 'plane' );

        this.container.appendChild( svg );

        /**
         * create SVG series group
         */

        let group = document.createElementNS( svgns, 'g' );

        group.classList.add( 'svgworld-series' );

        this.#style(
            group, 'series',
            this.options.options?.series?.style
        );

        svg.appendChild( group );

        /**
         * create SVG paths
         */

        Object.values( map.paths ).forEach( ( item ) => {

            let path = document.createElementNS( svgns, 'path' );

            path.classList.add( 'svgworld-path' );
            path.setAttribute( 'd', item.path );
            path.setAttribute( 'map-id', item.id );

            group.appendChild( path );

            /**
             * register map item
             */

            this.mapItems[ item.id ] = {
                id: item.id,
                svgEl: path,
                data: {},
                raw: item
            };

            /**
             * callback "createMapPath"
             * @param {Object} item map path object
             * @param {Element} path SVG path
             */
            this.#callback( 'createMapPath', [ item, path ] );

        } );

        this.clearMap();

        /**
         * callback "mapLoadComplete"
         * @param {Object} items map items
         * @param {Object} map map object
         * @param {Element} svg SVG element
         */
        this.#callback( 'mapLoadComplete', [ this.mapItems, map, svg ] );

    };

    /**
     * assign map data to items
     */
    #assignData () {

        Array.from( this.options?.data || [] ).forEach( ( data ) => {

            if( data.id in this.mapItems ) {

                let item = this.mapItems[ data.id ];

                item.data = data;

                this.#style( item.svgEl, 'path', {
                    ...this.options.options?.path?.style,
                    ...data.style || {}
                } );

            }

        } );

        /**
         * callback "afterAssignData"
         * @param {Object} items map items
         */
        this.#callback( 'afterAssignData', [ this.mapItems ] );

    };

    /**
     * assign styles to element
     * @param {Element} el element
     * @param {String} themeDefault theme defaults name
     * @param {Object} styles style options
     */
    #style ( el, themeDefault, styles = {} ) {

        Object.assign( el.style, {
            ...( style[ themeDefault ] || {} ),
            ...styles
        } );

    };

    /**
     * run callback function
     * @param {String} fn callback function name
     * @param {Array} args function arguments
     */
    #callback ( fn, args = [] ) {

        /**
         * check if callback exists and is executable
         */
        if(
            this.options.options?.callbacks?.[ fn ] &&
            typeof this.options.options.callbacks[ fn ] == 'function'
        ) {

            /**
             * call function
             */
            this.options.options.callbacks[ fn ]( ...args, this );

        }

    };

};