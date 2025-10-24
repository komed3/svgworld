import { Plugin } from '../types';
import { SVGWorldMap } from './SVGWorldMap';

export class PluginManager {

    private map: SVGWorldMap;
    private plugins: Plugin[] = [];

    constructor ( map: SVGWorldMap, plugins?: Plugin[] ) {

        this.map = map;
        if ( plugins ) this.registerPlugins( plugins );

    }

    public registerPlugin ( plugin: Plugin ) : void {

        if ( ! this.getPlugin( plugin.name ) ) {

            plugin.initialize( this.map );
            this.plugins.push( plugin );

        }

    }

    public registerPlugins ( plugins: Plugin[] ) : void {

        plugins.forEach( plugin => this.registerPlugin( plugin ) );

    }

    public unregisterPlugin ( pluginName: string ) : void {

        const plugin = this.getPlugin( pluginName );

        if ( plugin ) {

            plugin.destroy();
            this.plugins = this.plugins.filter( p => p.name !== pluginName );

        }

    }

    public getPlugin ( pluginName: string ) : Plugin | undefined {

        return this.plugins.find( p => p.name === pluginName );

    }

    public destroy () : void {

        this.plugins.forEach( plugin => plugin.destroy() );
        this.plugins = [];

    }

}