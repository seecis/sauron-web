import * as React from 'react';
import {ExtractorList} from "./ExtractorExpansionPanel";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import Query from "./models";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpandMore from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";

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
        axios.put('http://192.168.1.83:9091/extractor', {
            name: this.state.extractorName,
            queries: this.state.extractors
        })
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
            extractorName: ''
        };
    }

    render() {
        const {onHoverSet} = this.props;

        function testCode(path) {
            onHoverSet(path);
        }

        return (<>
                <div style={{width: this.props.width}}>
                    <ExpansionPanel style={{width: '400px', marginLeft: '10px', marginTop: '10px'}}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMore/>}>Extractor</ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField
                                        value={this.state.extractorName}
                                        onChange={(event) => {
                                            this.setState({extractorName: event.target.value})
                                        }}
                                        label={'Extractor Name'}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{marginTop: 20}}>
                                    <ExtractorList
                                        extractors={this.state.extractors}
                                        onListItemHover={testCode}
                                        extractorResolver={this.resolver}
                                        parentValue={""}
                                        depth={0}
                                    />
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                        <ExpansionPanelActions>
                            <Button onClick={this.createEmptyExtractor}>New extractor</Button>
                            <Button onClick={this.saveExtractors}>Save</Button>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                </div>
            </>
        )
    }
}

export default ExtractorModule;