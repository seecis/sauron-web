import * as React from 'react';
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpandMore from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Paper from "@material-ui/core/Paper/Paper";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import axios from "axios";
import {Extractor} from "../Extractor";
import Query from "../models";

class ResultsPage extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            extractors: null,
            selectedExtractor: null
        }
    }

    getExtractors = () => {
        axios.get('http://192.168.1.83:9091/extractor', {})
            .then(response => {
                this.setState({extractors: response.data})
            })
            .catch(error => {
                alert(error.message);
            });
    };

    getReport = (id: string) => {
        axios.get('http://192.168.1.83:9091/report/' + id, {})
            .then(response => {
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    render() {

        const selectedExtractor = this.state.selectedExtractor;
        const grayBackground = '#818181';

        if (this.state.extractors == null) {
            this.getExtractors();
            return (<div></div>);
        }

        return (
            <Grid container>
                <Grid item xs={2} style={{backgroundColor: grayBackground}}>
                    <Paper elevation={0} style={{backgroundColor: '#FFFFFF'}}>
                        <List style={{marginTop: 20}}>
                            {
                                this.state.extractors.map((extractor: Extractor) => {
                                    return (
                                        <ListItem key={extractor.id} button onClick={() => {
                                            this.setState({selectedExtractor: extractor})
                                        }}>
                                            <ListItemText
                                                primary={<Typography><b>{extractor.name}</b></Typography>}
                                                secondary={'URL: ' + extractor.url}/>
                                        </ListItem>
                                    );
                                })
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={24} style={{marginTop: 20}}>
                        <Grid item xs={4}/>
                        <Grid item xs={4}>
                            {(selectedExtractor == null ?
                                    <Typography style={{marginTop: 50, textAlign: 'center', fontSize: 17}}><b>Please
                                        select from left</b></Typography>
                                    :
                                    <ExpansionPanel expanded>
                                        <ExpansionPanelSummary
                                            key={selectedExtractor.id}>{selectedExtractor.name}</ExpansionPanelSummary>

                                        <ExpansionPanelDetails>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    {
                                                        selectedExtractor.queries.map((query: Query) => {
                                                            return (
                                                                <>
                                                                    <ExpansionPanel key={query.id}>
                                                                        <ExpansionPanelSummary
                                                                            expandIcon={<ExpandMore/>}>
                                                                            <Typography>{query.name}</Typography>
                                                                        </ExpansionPanelSummary>
                                                                    </ExpansionPanel>
                                                                    {
                                                                        query.subQueries == null ?
                                                                            <div></div>
                                                                            :
                                                                            getQueryViews(query)
                                                                    }
                                                                </>
                                                            );
                                                        })
                                                    }
                                                </Grid>
                                            </Grid>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={2} style={{backgroundColor: grayBackground}}>
                    <Typography style={{textAlign: 'center', color: '#FFFFFF', marginTop: 70, fontSize: 17}}>
                        Reserved Area</Typography>
                </Grid>
            </Grid>

        );
    }
}

function getQueryViews(query: Query) {
    return query.subQueries.map((subQuery: Query) => {
        return (
            <>
                <ExpansionPanel key={subQuery.id}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMore/>}>
                        <Typography>{query.name}.{subQuery.name}</Typography>
                    </ExpansionPanelSummary>
                </ExpansionPanel>
                {
                    subQuery.subQueries == null ?
                        <div></div>
                        :
                        getQueryViews(subQuery)
                }
            </>
        );
    })
}

export default withRouter(ResultsPage);