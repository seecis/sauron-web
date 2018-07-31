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
import Typography from "@material-ui/core/Typography/Typography";
import {EndPointProvider} from "./EndPointProvider";

export interface ExtractorModuleProps {
    extractors: Array<Query>
    onHoverSet: (any) => any
    width: string
    url: string
    onEditAddressSet: (address: string | null) => void
    editAddress: string | null
    onSaveSuccess: () => void
    onDeleteQuery: (query: Query) => void
}

class ExtractorModule extends React.Component<ExtractorModuleProps, any> {

    saveExtractors = () => {
        console.log(this.state.extractors);
        axios.put(EndPointProvider.ExtractorList, {
            name: this.state.extractorName,
            queries: this.state.extractors,
            trim: true,
            url: this.props.url
        })
            .then(response => {
                alert("Save Successful");
                this.props.onSaveSuccess();
            })
            .catch(error => {
                alert(error.message);
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
        const extractors = this.state.extractors;

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
                                    {
                                        extractors.length > 0 ?
                                            <TextField
                                                value={this.state.extractorName}
                                                onChange={(event) => {
                                                    this.setState({extractorName: event.target.value})
                                                }}
                                                label={'Extractor Name'}
                                            />
                                            :
                                            null
                                    }
                                </Grid>
                                <Grid item xs={12} style={{marginTop: 20}}>
                                    {
                                        extractors.length > 0 ?
                                            <ExtractorList
                                                extractors={extractors}
                                                onListItemHover={testCode}
                                                parentValue={""}
                                                depth={0}
                                                onEditAddressSet={this.props.onEditAddressSet}
                                                editAddress={this.props.editAddress}
                                                onDeleteQuery={this.props.onDeleteQuery}
                                            />
                                            :
                                            <Typography>Please Select From Right</Typography>
                                    }
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                        <ExpansionPanelActions>
                            {/*<Button onClick={this.createEmptyExtractor}>New extractor</Button>*/}
                            {
                                extractors.length > 0 ?
                                    <Button onClick={this.saveExtractors}>Save</Button>
                                    :
                                    null
                            }
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                </div>
            </>
        )
    }
}

export default ExtractorModule;