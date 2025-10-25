export class GeoProjection {

    private _width: number;
    private _height: number;

    constructor ( width: number = 1000, height: number = 500 ) {

        this._width = width;
        this._height = height;

    }

    // Convert longitude/latitude to x/y coordinates using equirectangular projection
    public project ( coordinates: [ number, number ] ) : [ number, number ] {

        const [ longitude, latitude ] = coordinates;

        // Convert to radians
        const lambda = ( longitude * Math.PI ) / 180;
        const phi = ( latitude * Math.PI ) / 180;

        // Equirectangular projection
        const x = ( this._width * ( lambda + Math.PI ) ) / ( 2 * Math.PI );
        const y = ( this._height * ( Math.PI - phi ) ) / ( 2 * Math.PI );

        return [ x, y ];

    }

    // Convert array of coordinates for polygons
    public projectPolygon ( coordinates: number[][] ) : string {

        const points = coordinates.map( coord => this.project( coord as [ number, number ] ) );
        return points.map( ( point, i ) => `${ i === 0 ? 'M' : 'L' } ${ point[ 0 ] } ${ point[ 1 ] }` ).join( ' ' ) + ' Z';

    }

    // Handle MultiPolygon coordinates
    public projectMultiPolygon ( coordinates: number[][][] ) : string {

        return coordinates.map( polygon => this.projectPolygon( polygon ) ).join( ' ' );

    }

    // Public API

    public get width () { return this._width }
    public set width ( width: number ) { this._width = width }
    public get height () { return this._width }
    public set heigth ( height: number ) { this._height = height }

}
