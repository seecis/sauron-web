import * as React from 'react';
import {ExtractorList} from "./ExtractorExpansionPanel";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import Query from "./models";

export interface ExtractorModuleProps {
    extractors: Array<Query>
    onHoverSet: (any) => any
    width: string
    url: string
}

class ExtractorModule extends React.Component<ExtractorModuleProps, any> {
    resolver = (e: Query) => {
        // Todo: implement this.
        return ""
    };

    createEmptyExtractor = () => {
        this.setState(state => {
            return {
                extractors: [...state.extractors, {}],
                expanded: state.extractors.length - 1
            }
        })
    };

    // todo: extractor'a url eklensin this.props.url
    saveExtractors = () => {
        axios.put('http://192.168.1.83:9091/extractor', {name: 'DummyName', queries: this.state.extractors})
            .then(response => {
                alert("Fulfilled");
            })
            .catch(error => {
                alert("Rejected");
            });
    };

    componentWillReceiveProps(nextProps: Readonly<ExtractorModuleProps>, nextContext: any): void {
        this.setState({extractors: nextProps.extractors})
    }

    constructor(props) {
        super(props);
        this.state = {
            innerHtml: "",
            extractors: props.extractors,
            expanded: null,
        };
    }

    render() {
        const {onHoverSet} = this.props;

        function testCode(path) {
            onHoverSet(path);
        }

        return (<>
                <div style={{width: this.props.width}}>
                    <Button onClick={this.createEmptyExtractor}>New extractor</Button>
                    <Button onClick={this.saveExtractors}>Save</Button>
                    <ExtractorList
                        extractors={this.state.extractors}
                        onListItemHover={testCode}
                        extractorResolver={this.resolver}
                        parentValue={""}
                        depth={0}
                    />
                </div>
            </>
        )
    }
}

export default ExtractorModule;