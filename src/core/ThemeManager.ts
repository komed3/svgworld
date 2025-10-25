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

}
