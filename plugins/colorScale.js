/**
 * SVGWorld plugin "colorScale"
 * color scale generator
 * 
 * @author komed3 (Paul Köhler)
 * @version 1.0.0
 * @license MIT
 */

'use strict';

export default class colorScale {

    /**
     * define vars
     */
    min; max; range; steps;

    /**
     * color scale stept
     */
    colors = [];

    /**
     * 
     * @param {Float} min minimum
     * @param {Float} max maximum
     * @param {String} minColor hex color
     * @param {String} maxColor hex color
     * @param {Int} steps color steps
     */
    constructor ( min, max, minColor, maxColor, steps = 10 ) {

        /**
         * define vars
         */
        this.min = min;
        this.max = max;
        this.range = max - min;
        this.steps = steps;

        /**
         * get r, g, b values form hex colors
         */
        let minRGB = this.#hex2rgb( minColor ),
            maxRGB = this.#hex2rgb( maxColor );

        /**
         * calculate color step matrix
         */
        let stepRGB = {
            r: ( minRGB.r - maxRGB.r ) / steps,
            g: ( minRGB.g - maxRGB.g ) / steps,
            b: ( minRGB.b - maxRGB.b ) / steps
        };

        /**
         * generate colors steps
         */

        this.colors.push( minColor );

        for( let i = 1; i < steps; i++ ) {

            this.colors.push( this.#rgb2hex( {
                r: minRGB.r - ( stepRGB.r * i ),
                g: minRGB.g - ( stepRGB.g * i ),
                b: minRGB.b - ( stepRGB.b * i )
            } ) );

        }

        this.colors.push( maxColor );

    };

    /**
     * get color step from value
     * @param {Float} y value
     * @param {String} type scale type
     * @param {String} approx type of approx
     * @returns hex color
     */
    getColor ( y, type = 'linear', approx = 'round' ) {

        if( y != 0 ) {

            switch( type ) {

                /**
                 * linear scale
                 */
                default: case 'linear':
                    return this.colors[
                        Math[ approx ](
                            ( y - this.min ) / this.range * this.steps
                        )
                    ];

                /**
                 * logarithmic scale
                 */
                case 'log': case 'logarithmic':
                    return this.colors[
                        y <= 1 ? 0 : Math[ approx ](
                            Math.log10( y - this.min ) / Math.log10( this.range ) * this.steps
                        )
                    ];

            }

        }

    };

    /**
     * hex color to rgb
     * @param {String} hex hex color
     * @returns r, g, b values
     */
    #hex2rgb ( hex ) {

        let rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

        return rgb ? {
            r: parseInt( rgb[1], 16 ),
            g: parseInt( rgb[2], 16 ),
            b: parseInt( rgb[3], 16 )
        } : {
            r: 0, g: 0, b: 0
        };

    };

    /**
     * rgb to hex color
     * @param {Object} rgb r, g, b values
     * @returns hex color
     */
    #rgb2hex ( rgb ) {

        return '#' + (
            1 << 24 | rgb.r << 16 | rgb.g << 8 | rgb.b
        ).toString( 16 ).slice( 1 );

    };

};