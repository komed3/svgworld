import { Plugin } from '../types';
import { SVGWorldMap } from './SVGWorldMap';

export class PluginManager {

    private _map: SVGWorldMap;
    private _plugins: Plugin[] = [];

    constructor ( map: SVGWorldMap, plugins?: Plugin[] ) {

        this._map = map;
        if ( plugins ) this.registerPlugins( plugins );

    }

    public registerPlugin ( plugin: Plugin ) : void {

        if ( ! this.getPlugin( plugin.name ) ) {

            plugin.initialize( this._map );
            this._plugins.push( plugin );

        }

    }

    public registerPlugins ( plugins: Plugin[] ) : void {

        plugins.forEach( plugin => this.registerPlugin( plugin ) );

    }

    public unregisterPlugin ( pluginName: string ) : void {

        const plugin = this.getPlugin( pluginName );

        if ( plugin ) {

            plugin.destroy();
            this._plugins = this._plugins.filter( p => p.name !== pluginName );

        }

    }

    public getPlugin ( pluginName: string ) : Plugin | undefined {

        return this._plugins.find( p => p.name === pluginName );

    }

    public destroy () : void {

        this._plugins.forEach( plugin => plugin.destroy() );
        this._plugins = [];

    }

}