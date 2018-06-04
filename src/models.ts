class Query {
    constructor(public selector: string) {
        this.name = '';
        this.forEachChildren = false;
        this.subQueries = [];
    }

    public name: string;
    public forEachChildren: boolean;
    public subQueries: Query[];
}

export default Query;