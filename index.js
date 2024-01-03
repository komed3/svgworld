'use strict';

export default class SVGWorld {

    options = {};

    container;
    chart;

    constructor ( container, data = {} ) {

        if( !container || container.length == 0 ) {

            throw 'SVGWorld error: container does not exists';

        }

        this.container = container;

        this.options = {
            ...this.options,
            ...data
        };

    };

    setSize () {};

    update () {};

};