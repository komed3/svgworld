/**
 * SVGWorld
 * simple SVG world map / chart
 * 
 * @author komed3 (Paul Köhler)
 * @version 0.1.0
 * @license MIT
 */

'use strict';

export default class SVGWorld {

    /**
     * DOM nodes / elements
     **/
    container; svg;

    /**
     * map options
     */
    options = {};

    /**
     * chart elements
     */
    chartElements = {};

    /**
     * debug mode
     */
    debug = false;

    /**
     * json map object
     */
    map = {};

    /**
     * map paths
     */
    paths = {};

    /**
     * map data
     */
    mapData = [];

    /**
     * create new SVGWorld from data 
     * @param {Node} container map container
     * @param {Object} data map data/options
     * @param {Boolean} debug enable debug mode
     */
    constructor ( container, data, debug = false ) {

        /**
         * check if container element exists
         */
        if ( !container || container.length == 0 ) {

            /**
             * [ERR] container does not exists
             */
            throw new Error( 'SVGWorld error: container does not exists' );

        }

        this.container = container;
        this.options = data.options || {};
        this.chartElements = data.elements || {};

        /**
         * enable debug mode
         */
        this.debug = !!debug;

        /**
         * load map object
         */
        this.#loadMap( data.map || {} );

        /**
         * add chart element
         */
        this.#chartElements();

        /**
         * draw map
         */
        this.#drawMap();

        /**
         * set data
         */
        this.setData( data.data || [] );

        /**
         * set size
         */
        this.setSize( '100%', 640 );

        /**
         * register event listener
         */
        this.container.addEventListener( 'mousemove', ( e ) => {

            /**
             * show tooltip over paths
             */

            if( e.target.localName == 'path' ) {

                this.#tooltip( e );

            }

            /**
             * callback "eventMouseMove"
             * @param {Event} e mousemove event
             */
            this.#callback( 'eventMouseMove', [ e ] );

        } );

    };

    /**
     * test and load map object
     * @param {Object} map map object
     */
    #loadMap ( map ) {

        /**
         * check if map can be recognized
         */
        if ( typeof map != 'object' || !( 'path' in map ) || typeof map.path != 'object' ) {

            /**
             * [ERR] map not recognized
             */
            throw new Error( 'SVGWorld error: map not recognized' );

        }

        /**
         * set map object
         */
        this.map = map;

        return true;

    };

    /**
     * set new chart size
     * @param {String|Int} width chart width
     * @param {String|Int} height chart height
     */
    setSize ( width, height ) {

        this.container.style.width = !isNaN( width ) ? width + 'px' : width;
        this.container.style.height = !isNaN( height ) ? height + 'px' : height;

    };

    /**
     * set map data
     * @param {Array} data map data
     */
    setData ( data ) {

        /**
         * check if map data are readable
         */
        if ( !Array.isArray( data ) ) {

            /**
             * [ERR] map data must be of type array
             */
            throw new Error( 'SVGWorld error: map data must be of type array' );

        }

        this.mapData = data;

        /**
         * empty map
         */
        this.#emptyMap();

        /**
         * callback "beforeSetData"
         * @param {Object} paths map paths
         */
        this.#callback( 'beforeSetData', [ this.paths ] );

        /**
         * loop through map data
         */

        let min = Infinity,
            max = -Infinity;

        this.mapData.forEach( item => {

            if ( item.id in this.paths ) {

                let path = this.paths[ item.id ];

                path.y = item.y || 0;

                path.svgEl.setAttribute( 'map-y', path.y || 0 );

                Object.assign( path.svgEl, item.style || {} );

                min = Math.min( min, path.y || 0 );
                max = Math.max( max, path.y || 0 );

                /**
                 * callback "setItem"
                 * @param {Object} item data item
                 * @param {Object} path map path item
                 */
                this.#callback( 'setItem', [ item, path ] );

            } else if ( this.debug ) {

                console.warn( 'SVGWorld warn: ' + item.id + ' not recognized' );

            }

        } );

        /**
         * callback "afterSetData"
         * @param {Object} paths map paths
         * @param {Float} min min value
         * @param {Float} max max value
         */
        this.#callback( 'afterSetData', [ this.paths, min, max ] );

    };

    /**
     * draw/create map
     */
    #drawMap () {

        let svgns = 'http://www.w3.org/2000/svg';

        /**
         * create svg container
         */
        this.svg = document.createElementNS( svgns, 'svg' );

        this.svg.setAttribute( 'viewBox', this.map.viewBox || '0 0 100 100' );

        Object.assign( this.container.style, {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px'
        } );

        this.container.appendChild( this.svg );

        /**
         * create paths group
         */
        let g = document.createElementNS( svgns, 'g' );

        g.setAttribute( 'map-id', 'paths' );

        this.svg.appendChild( g );

        /**
         * loop through map paths
         */
        Object.values( this.map.path ).forEach( item => {

            let path = document.createElementNS( svgns, 'path' );

            path.setAttribute( 'd', item.path || '' );
            path.setAttribute( 'map-id', item.id );

            g.appendChild( path );

            this.paths[ item.id ] = {
                ...item,
                ...{
                    y: 0,
                    svgEl: path
                }
            }

            /**
             * callback "createPath"
             * @param {Node} path path element
             * @param {Object} item path item
             */
            this.#callback( 'createPath', [ path, item ] );

        } );

        /**
         * callback "afterDrawMap"
         */
        this.#callback( 'afterDrawMap' );

    };

    /**
     * create chart elements
     */
    #chartElements () {

        /**
         * show title
         */
        if( 'title' in this.chartElements ) {

            let title = document.createElement( 'div' );

            title.innerHTML = this.chartElements.title.text || '';

            Object.assign( title.style, this.chartElements.title.style || {} );

            this.container.insertBefore( title, this.svg );

            /**
             * callback "chartElementsTitle"
             * @param {Node} title title element
             */
            this.#callback( 'chartElementsTitle', [ title ] );

        }

        /**
         * callback "afterChartElemente"
         */
        this.#callback( 'afterChartElemente' );

    };

    /**
     * show tooltip
     * @param {Event} e trigger event
     */
    #tooltip ( e ) {

        //

    };

    /**
     * reset map paths
     */
    #emptyMap () {

        Object.values( this.paths ).forEach( path => {

            path.svgEl.setAttribute( 'map-y', 0 );

            path.y = 0;

            Object.assign(
                path.svgEl.style,
                this.options.path?.style || {}
            );

            /**
             * callback "emptyPath"
             * @param {Object} path path object
             */
            this.#callback( 'emptyPath', [ path ] );

        } );

    };

    /**
     * run callback function
     * @param {String} fn callback function name
     * @param {Array} args function arguments
     */
    #callback ( fn, args = [] ) {

        /**
         * test if callback exists
         */
        if ( this.options.callbacks && fn in this.options.callbacks ) {

            if ( typeof this.options.callbacks[ fn ] == 'function' ) {

                this.options.callbacks[ fn ]( ...args, this );

            } else if ( this.debug ) {

                console.warn( 'SVGWorld warn: ' + fn + ' is not a callable function' );

            }

        }

    };

};