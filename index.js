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

            throw new Error( '[SVGWorld ERR] container is not a DOM element' );

        }

        this.container = container;
        this.options = options;

        this.#style( this.container, 'container', this.options.options?.container?.style );

        /**
         * load map
         */

        this.#loadMap();

    };

    #loadMap () {

        let map = this.options.map || null;

        /**
         * if map is not defined or contains no paths
         * throw error
         */
        if( typeof map != 'object' || !map.paths || typeof map.paths != 'object' ) {

            throw new Element( '[SVGWorld ERR] map is not defined or contains no paths' );

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

        this.#style( group, 'series', this.options.options?.series?.style );

        svg.appendChild( group );

        /**
         * create SVG paths
         */

        Object.values( map.paths ).forEach( ( item ) => {

            let path = document.createElementNS( svgns, 'path' );

            path.classList.add( 'svgworld-path' );
            path.setAttribute( 'd', item.path );
            path.setAttribute( 'map-id', item.id );

            this.#style( path, 'emptyPath', this.options.options?.path?.emptyStyle );

            group.appendChild( path );

            /**
             * callback "createMapPath"
             * @param {Object} item map path object
             * @param {Element} path SVG path
             */
            this.#callback( 'createMapPath', [ item, path ] );

        } );

        /**
         * callback "mapLoadComplete"
         * @param {Object} map map object
         * @param {Element} svg SVG element
         */
        this.#callback( 'mapLoadComplete', [ map, svg ] );

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
        if( this.options.callbacks?.[ fn ] && typeof this.options.callbacks[ fn ] == 'function' ) {

            /**
             * call function
             */
            this.options.callbacks[ fn ]( ...args, this );

        }

    };

};