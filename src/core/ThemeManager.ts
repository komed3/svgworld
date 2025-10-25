import { Theme } from '../types';
import { SVGWorldMap } from './SVGWorldMap';

export class ThemeManager {

    private _map: SVGWorldMap;
    private _currentTheme: Theme;

    constructor ( map: SVGWorldMap, theme?: Theme ) {

        this._map = map;
        this._currentTheme = theme || this.getDefaultTheme();

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
