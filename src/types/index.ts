import { SVGWorldMap } from '../core/SVGWorldMap';

export interface Theme {
    name: string;
    background: string;
    land: {
        fill: string;
        stroke: string;
        strokeWidth: number;
    };
    hover: {
        fill: string;
        stroke: string;
        strokeWidth: number;
    };
    selected: {
        fill: string;
        stroke: string;
        strokeWidth: number;
    };
    text: {
        fill: string;
        fontFamily: string;
        fontSize: string;
    };
}

export interface Plugin {
    name: string;
    initialize: ( map: SVGWorldMap ) => void;
    destroy: () => void;
}

export interface MapOptions {
    container: string | HTMLElement;
    width?: number;
    height?: number;
    theme?: Theme;
    plugins?: Plugin[];
}

export interface MapData {
    type: string;
    id: string;
    properties: {
        name: string;
        [ key: string ]: any;
    };
    geometry: {
        type: string;
        coordinates: any[];
    };
}

export interface MapEvent {
    type: string;
    target: any;
    data?: any;
}

export type HookCallback = ( event: MapEvent ) => void;

export interface Hooks {
    [ key: string ]: HookCallback[];
}
