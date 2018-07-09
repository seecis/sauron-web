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
import {EndPointProvider} from "../EndPointProvider";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Button from "@material-ui/core/Button/Button";
import {PathProvider} from "../PathProvider";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

class ExtractorListPage extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            extractors: null,
            selectedExtractor: null,
            selectedReport: null,
            successDialogOpen: false
        }
    }

    getExtractors = () => {
        axios.get(EndPointProvider.ExtractorList, {})
            .then(response => {
                this.setState({extractors: response.data})
            })
            .catch(error => {
                alert(error.message);
            });
    };

    scheduleExtraction(extractorId: string | undefined, url: string | undefined) {
        if (extractorId == null || url == null) {
            return;
        }

        axios.post(EndPointProvider.ScheduleExtraction(extractorId), {url: url}, {})
            .then(response => {
                this.setState({successDialogOpen: true})
            })
            .catch(error => {
            });
    }

    render() {

        const selectedExtractor: Extractor = this.state.selectedExtractor;
        const extractors: Extractor[] | null = this.state.extractors;
        const grayBackground = '#818181';

        if (extractors == null) {
            this.getExtractors();
            return null;
        }

        return (
            <>
                <Dialog open={this.state.successDialogOpen} onClose={() => {
                    this.setState({successDialogOpen: false})
                }}>
                    <DialogTitle>Success</DialogTitle>
                    <DialogContent>
                        Extraction scheduled, see the report or continue scheduling?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.setState({successDialogOpen: false})
                        }}>
                            Schedule Stuff
                        </Button>
                        <Button onClick={() => {
                            this.props.history.push(PathProvider.Reports);
                        }}>
                            See the reports
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid container>
                    <Grid item xs={2} style={{backgroundColor: grayBackground}}>
                        {
                            extractors !== null && extractors.length > 0 ?
                                <Paper elevation={0} style={{backgroundColor: '#FFFFFF'}}>
                                    <List style={{marginTop: 20}}>
                                        {
                                            extractors.map((extractor: Extractor) => {
                                                return (
                                                    <ListItem key={extractor.id} button onClick={() => {
                                                        this.setState({selectedExtractor: extractor});
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
                                :
                                null
                        }
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container spacing={24} style={{marginTop: 20, minHeight: '100vh'}}>
                            <Grid item xs={4}/>
                            <Grid item xs={4}>
                                {(selectedExtractor == null ?
                                        (
                                            extractors !== null && extractors.length > 0 ?
                                                <Typography
                                                    style={{marginTop: 50, textAlign: 'center', fontSize: 17}}><b>Please
                                                    select from left</b></Typography>
                                                :
                                                <Typography
                                                    style={{marginTop: 50, textAlign: 'center', fontSize: 17}}><b>There
                                                    are no extractors to show</b></Typography>
                                        )

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
                                                                        <ExpansionPanel key={query.id} expanded>
                                                                            <ExpansionPanelSummary>
                                                                                <Typography>{query.name}</Typography>
                                                                            </ExpansionPanelSummary>
                                                                        </ExpansionPanel>
                                                                        {
                                                                            query.subQueries == null ?
                                                                                null
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
                                            <ExpansionPanelActions>
                                                <Button
                                                    onClick={() => this.scheduleExtraction(selectedExtractor.id, selectedExtractor.url)}>Schedule
                                                    Extraction</Button>
                                            </ExpansionPanelActions>
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
            </>
        );
    }
}

function getQueryViews(query: Query) {
    return query.subQueries.map((subQuery: Query) => {
        return (
            <>
                <ExpansionPanel key={subQuery.id} expanded>
                    <ExpansionPanelSummary>
                        <Typography>{query.name}.{subQuery.name}</Typography>
                    </ExpansionPanelSummary>
                </ExpansionPanel>
                {
                    subQuery.subQueries == null ?
                        null
                        :
                        getQueryViews(subQuery)
                }
            </>
        );
    })
}

export default withRouter(ExtractorListPage);