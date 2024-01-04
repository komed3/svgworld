/**
 * SVGWorld
 * 
 * @author komed3 (Paul Köhler)
 * @version 0.1.0
 * @license MIT
 */

'use strict';

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
     * @param {Node} container map container
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

    };

};