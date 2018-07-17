class Query {
    public name: string;
    public forEachChildren: boolean;
    public subQueries: Query[];
    public id: string;

    constructor(public selector: string, public defaultValue: string | null) {
        this.name = '';
        this.forEachChildren = false;
        this.subQueries = [];
        this.id = '';
        this.defaultValue = defaultValue;
    }
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
    VersionId: number;
};

type ReportSummary = {
    id: string;
    created_at: string;
    updated_at?: string;
}

export default Query;
export {Field, Report, ReportSummary};