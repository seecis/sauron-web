let basePath = 'http://sauron.amerikadaniste.com';

let SAURON_API_URL = ((<any>window).SAURON_API_URL);
if (SAURON_API_URL) {
    basePath = SAURON_API_URL
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
