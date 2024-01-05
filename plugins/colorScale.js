/**
 * SVGWorld plugin "colorScale"
 * color scale generator
 * 
 * @author komed3 (Paul Köhler)
 * @version 0.1.0
 * @license MIT
 */

'use strict';

export default function colorScale ( items, svgworld ) {

    /**
     * get rgb color array from input
     * @param {String|Array} color hex or rgb color
     * @returns rgb color array
     */
    const getRGB = ( color ) => {

        /**
         * rgb color array
         */
        if( Array.isArray( color ) && color.length > 2 ) {

            return color.slice( 0, 3 );

        }

        /**
         * rgb color string
         */
        else if( color.length && color.includes( ',' ) ) {

            return color.split( ',' ).slice( 0, 3 );

        } else if( color.length && color.includes( ' ' ) ) {

            return color.split( ' ' ).slice( 0, 3 );

        }

        /**
         * hex string
         */
        else if( color.length > 5 ) {

            return hex2rgb( color );

        }

        /**
         * color format could not recognized
         * throw error
         */
        else {

            svgworld.err(
                'color format [' + color + '] could not recognized',
                'colorScale'
            );

        }

    };

    /**
     * hex color to rgb
     * @param {String} hex hex color
     * @returns rgb color array
     */
    const hex2rgb = ( hex ) => {

        let rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

        return rgb ? [
            parseInt( rgb[1], 16 ),
            parseInt( rgb[2], 16 ),
            parseInt( rgb[3], 16 )
        ] : [ 0, 0, 0 ];

    };

    /**
     * rgb to hex color
     * @param {Array} rgb rgb color array
     * @returns hex color
     */
    const rgb2hex = ( rgb ) => {

        return '#' + (
            1 << 24 | rgb[0] << 16 | rgb[1] << 8 | rgb[2]
        ).toString( 16 ).slice( 1 );

    };

    /**
     * set options
     * colors, steps etc.
     */

    let minRGB = [ 42, 2, 17 ],
        maxRGB = [ 227, 11, 92 ];

    let steps = 10,
        scaleType = 'linear',
        approx = 'round';

    if( svgworld.options.options?.plugins?.colorScale ) {

        let options = svgworld.options.options.plugins.colorScale;

        if( options.minColor ) {

            minRGB = getRGB( options.minColor );

        }

        if( options.maxColor ) {

            maxRGB = getRGB( options.maxColor );

        }

        steps = parseInt( options.steps || steps );
        scaleType = options.scaleType || scaleType;
        approx = options.approx || approx;

    }

    /**
     * calculate min, max values
     */

    let minVal = Infinity,
        maxVal = -Infinity;

    Object.values( items ).forEach( ( item ) => {

        if( item.data.y && !isNaN( item.data.y ) ) {

            minVal = Math.min( minVal, item.data.y );
            maxVal = Math.max( maxVal, item.data.y );

        }

    } );

    let range = maxVal - minVal;

    /**
     * calculate color step matrix
     */

    let stepRGB = [
        ( minRGB[0] - maxRGB[0] ) / steps,
        ( minRGB[1] - maxRGB[1] ) / steps,
        ( minRGB[2] - maxRGB[2] ) / steps
    ];

    /**
     * generate colors steps
     */

    let colors = [];

    colors.push( rgb2hex( minRGB ) );

    for( let i = 1; i < steps; i++ ) {

        colors.push( rgb2hex( [
            minRGB[0] - ( stepRGB[0] * i ),
            minRGB[1] - ( stepRGB[1] * i ),
            minRGB[2] - ( stepRGB[2] * i )
        ] ) );

    }

    colors.push( rgb2hex( maxRGB ) );

    /**
     * assign colors to map items
     */

    Object.values( items ).forEach( ( item ) => {

        if( item.data.y && !isNaN( item.data.y ) ) {

            let c = item.svgEl.style.fill || 'transparent';

            switch( scaleType ) {

                /**
                 * linear scale
                 */
                default: case 'linear':
                    c = colors[
                        Math[ approx ](
                            ( item.data.y - minVal ) / range * steps
                        )
                    ];
                    break;

                /**
                 * logarithmic scale
                 */
                case 'logarithmic': case 'log': case 'log10':
                    c = colors[
                        item.data.y <= 1 ? 0 : Math[ approx ](
                            Math.log10( item.data.y - minVal ) /
                            Math.log10( range ) * steps
                        )
                    ];
                    break;

            }

            Object.assign( item.svgEl.style, {
                fill: c
            } );

        }

    } );

};