import * as React from 'react';

let env;
if (process) {
    env = process.env.NODE_ENV;
} else {
    env = undefined;
}

let basePath = '';

//Todo: Add some sense.
let prodOverride = true;
let connectToProduction = prodOverride || env == 'production';

if (connectToProduction) {
    basePath = 'http://api.sauron.amerikadaniste.com';
} else {
    basePath = 'http://192.168.1.83:9091';
}

export class EndPointProvider {
    public static ExtractorList: string = basePath + '/extractor';
    public static Reports: string = basePath + '/report';
    public static CreateScheduleJob: string = basePath + '/job/';
    public static GetJobs: string = basePath + '/job/';
    public static GetReportById: (id: string | undefined) => string | null = (id) => {
        if (id == null) {
            return null;
        }
        return basePath + '/report/' + id
    };
    public static GetJobById: (id: string | undefined) => string | null = (id) => {
        if (id == null) {
            return null;
        }
        return basePath + '/job/' + id
    };
}
