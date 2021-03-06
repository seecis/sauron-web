import Query from "./models";

type Extractor = {
    name: string;
    id?: string;
    queries: Query[];
    url: string;
}

export {Extractor};