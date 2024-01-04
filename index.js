'use strict';

export default class SVGWorld {

    /**
     * map container
     * DOM node
     **/
    container;

    /**
     * json map object
     */
    map;

    /**
     * chart object
     */
    chart;

    /**
     * create new SVGWorld from data 
     * @param {Node} container 
     * @param {Object} data 
     */
    constructor ( container, data ) {

        /**
         * check if container element exists
         */
        if( !container || container.length == 0 ) {

            /**
             * [ERR] container does not exists
             */
            throw new Error( 'SVGWorld error: container does not exists' );

        }

        this.container = container;

        /**
         * load map object
         */
        this.#loadMap( data.map || {} );

        /**
         * draw map
         */
        this.#drawMap();

        /**
         * set size
         */
        this.setSize( '100%', 640 );

    };

    /**
     * test and load map object
     * @param {Object} map map object
     */
    #loadMap ( map ) {

        /**
         * check if map can be recognized
         */
        if( typeof map != 'object' || !( 'path' in map ) || typeof map.path != 'object' ) {

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

    setData ( data ) {};

    /**
     * draw basic map
     */
    #drawMap () {

        let svgns = 'http://www.w3.org/2000/svg';

        /**
         * create svg container
         */
        let svg = document.createElementNS( svgns, 'svg' );

        svg.setAttribute( 'viewBox', this.map.viewBox || '0 0 100 100' );

        Object.assign( this.container.style, {
            display: 'flex',
            flexFlow: 'column nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px'
        } );

        this.container.appendChild( svg );

        /**
         * create paths group
         */
        let g = document.createElementNS( svgns, 'g' );

        g.setAttribute( 'map-id', 'paths' );

        svg.appendChild( g );

        /**
         * loop through map paths
         */
        Object.values( this.map.path ).forEach( p => {

            let path = document.createElementNS( svgns, 'path' );

            path.setAttribute( 'd', p.path || '' );
            path.setAttribute( 'map-id', p.id );

            g.appendChild( path );

        } );

    };

    update () {};

};