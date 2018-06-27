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

export default Query;