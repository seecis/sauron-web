type Extractor = {
    name: string;
    id: string;
    queries: Query[];
}

type Query = {
    selector: string;
    name: string;
    forEachChildren: boolean;
    subQueries: Query[];
};

export {Extractor, Query};