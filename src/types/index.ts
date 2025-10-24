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
    initialize: ( map: any ) => void;
    destroy: () => void;
}

export interface MapOptions {
    container: string | HTMLElement;
    width?: number;
    height?: number;
    theme?: Theme;
    plugins?: Plugin[];
}
