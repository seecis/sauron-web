class Query {
    constructor(public selector: string) {
        this.name = '';
        this.forEachChildren = false;
        this.subQueries = [];
        this.id = '';
    }

    public name: string;
    public forEachChildren: boolean;
    public subQueries: Query[];
    public id: string;
}


type Field = {
    id: string;
    subFields: Field[];
    label: string;
    data: string;
};

type Report = {
    Field: Field;
    id: string;
    FieldId: string;
};

type ReportSummary = {
    id: string;
    created_at: string;
    updated_at?: string;
}

export default Query;
export {Field, Report, ReportSummary};