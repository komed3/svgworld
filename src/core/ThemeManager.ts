import { Theme } from '../types';
import { SVGWorldMap } from './SVGWorldMap';

export class ThemeManager {

    private _map: SVGWorldMap;
    private _currentTheme: Theme;

    // Public API

    public get theme () : Theme { return this._currentTheme }

    public set theme ( theme: Theme ) {

        this._currentTheme = theme;
        this.applyThemeToAll();

    }

}
