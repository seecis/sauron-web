import * as React from 'react';

const env = process.env;

let basePath = '';
if (env.NODE_ENV == 'production') {
    basePath = 'http://api.sauron.amerikadaniste.com';
} else {
    basePath = 'http://192.168.1.83:9091';
}

export class EndPointProvider {
    public static ExtractorList: string = basePath + '/extractor';
    public static GetReportById: (id: string) => string = (id) => {
        return basePath + '/report/' + id
    };
}
