import { Theme } from '../types';
import { SVGWorldMap } from './SVGWorldMap';

export class ThemeManager {

    private _map: SVGWorldMap;
    private _currentTheme: Theme;

    constructor ( map: SVGWorldMap, theme?: Theme ) {

        this._map = map;
        this._currentTheme = theme || this.getDefaultTheme();

    }

    private ensureStylesExist ( styles: string ) : void {

        const styleId = 'svgworld-styles';
        let styleSheet = document.getElementById( styleId );

        if ( ! styleSheet ) {

            styleSheet = document.createElement( 'style' );
            styleSheet.id = styleId;
            document.head.appendChild( styleSheet );

        }

        if ( ! styleSheet.textContent.includes( styles ) ) {
            styleSheet.textContent += styles;
        }

    }

    private applyThemeToAll () : void {

        const paths = this._map.svg.getElementsByTagName( 'path' );

        for ( const path of paths ) this.applyTheme( path );

    }

    // Default theme

    private getDefaultTheme () : Theme {

        return {
            name: 'default',
            background: '#ffffff',
            land: {
                fill: '#e8e8e8',
                stroke: '#ffffff',
                strokeWidth: 0.5
            },
            hover: {
                fill: '#c0c0c0',
                stroke: '#404040',
                strokeWidth: 1
            },
            selected: {
                fill: '#808080',
                stroke: '#404040',
                strokeWidth: 1
            },
            text: {
                fill: '#404040',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px'
            }
        };

    }

    // Public API

    public get theme () : Theme { return this._currentTheme }

    public set theme ( theme: Theme ) {

        this._currentTheme = theme;
        this.applyThemeToAll();

    }

    public applyTheme ( element: SVGElement ) : void {

        const theme = this._currentTheme;

        if ( element.tagName === 'path' ) {

            element.setAttribute( 'fill', theme.land.fill );
            element.setAttribute( 'stroke', theme.land.stroke );
            element.setAttribute( 'stroke-width', theme.land.strokeWidth.toString() );

            // Add hover and selection styles
            element.style.transition = 'fill 0.2s, stroke 0.2s';
            const hover = `
                ${ element.tagName }:hover {
                    fill: ${ theme.hover.fill };
                    stroke: ${ theme.hover.stroke };
                    stroke-width: ${ theme.hover.strokeWidth }px;
                }
            `;

            const selected = `
                ${ element.tagName }.selected {
                    fill: ${ theme.selected.fill };
                    stroke: ${ theme.selected.stroke };
                    stroke-width: ${ theme.selected.strokeWidth }px;
                }
            `;

            // Add styles to a stylesheet if not already present
            this.ensureStylesExist( hover + selected );

        }

    }

}
