import * as React from 'react';
import Extractor from './models'
import {ExtractorList} from "./ExtractorExpansionPanel";
import Button from "@material-ui/core/Button";

export interface ExtractorModuleProps {
    extractors: Array<Extractor>
    onHoverSet: (any) => any
    width: string
}

class ExtractorModule extends React.Component<ExtractorModuleProps, any> {
    resolver = (e: Extractor) => {
        // Todo: implement this.
        return ""
    };

    createEmptyExtractor = () => {
        this.setState(state => {
            return {
                extractors: [...state.extractors, new Extractor("")],
                expanded: state.extractors.length - 1
            }
        })
    };

    componentWillReceiveProps(nextProps: Readonly<ExtractorModuleProps>, nextContext: any): void {
        this.setState( {extractors: nextProps.extractors})
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
                    <Button>Save</Button>
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