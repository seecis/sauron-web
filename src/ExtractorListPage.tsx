import * as React from 'react';
import {withRouter} from "react-router";
import axios from "axios";
import QueryView from "./QueryView";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";

const localIP = 'http://192.168.1.83:9091/extractor';

const query1 = {
    selector: 'asd', name: 'query1',
    forEachChildren: true,
    subQueries: []
};
const query2 = {
    selector: 'asd', name: 'query1',
    forEachChildren: true,
    subQueries: [query1]
};
const extractor = {
    name: 'extractor',
    id: 'asdasdasd',
    queries: [query2, query1]
};

const extractorList = [
    extractor, extractor, extractor, extractor
];


class ExtractorListPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            extractors: extractorList,
            error: null
        };
    }

    getExtractors = () => {
        axios.get(localIP)
            .then((response) => {
                this.setState({extractors: response.data, error: null});
            })
            .catch((error) => {
                alert(error);
                this.setState({error: error, extractors: null});
            });
    };

    render() {
        const {extractors, error} = this.state;

        if (extractors == null && error == null) {
            this.getExtractors();
            return (<div/>);
        }

        if (error != null) {
            return (<div style={{marginTop: '400px'}}>Could not find a single extractor, but did find an error if that
                helps.</div>);
        }

        return <List>
            {extractors.map(extractor => {
                extractor.queries.map(query => {
                    return (
                        <ListItem>
                            <QueryView query={query}/>
                        </ListItem>
                    );
                });
            })}
        </List>;

    }
}

export default withRouter(ExtractorListPage);