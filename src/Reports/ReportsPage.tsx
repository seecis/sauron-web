import * as React from 'react';
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Typography from "@material-ui/core/Typography/Typography";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import axios from "axios";
import {EndPointProvider} from "../EndPointProvider";
import {Field, default as Query, Report} from "../models";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Button from "@material-ui/core/Button/Button";

interface ReportsPageProps {
    history: any;
}

export type HtmlExtractor = {
    ID: number;
    Queries?: Query[];
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt?: Date;
    Url: string;
    UID?: string;
    Name: string;
}

export type Url = {
    ID: number;
    JobId: number;
    Url: string;
}

// todo: versions type'ı belli değil
export type Job = {
    ID: number;
    UID: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt?: Date;
    Cron: string;
    Urls: Url[];
    Versions: any[];
    HtmlExtractor: HtmlExtractor;
    HtmlExtractorId: number;
    Report: Report;
    ScheduledTaskId: number;
}

class ReportsPage extends React.Component<ReportsPageProps, any> {

    constructor(props) {
        super(props);
        this.state = {
            jobs: null,
            selectedJob: null
        };
    }

    getReports = () => {
        axios.get(EndPointProvider.GetJobs, {})
            .then(response => {
                this.setState({jobs: response.data});
            })
            .catch(error => {
                alert(error.message);
            });
    };

    render() {

        const grayBackground = '#818181';
        const selectedJob: Job | null = this.state.selectedJob;
        const selectedReport: Report | null = selectedJob != null ? selectedJob.Report : null;
        const jobs: Job[] | null = this.state.jobs;

        if (jobs == null) {
            this.getReports();
            return null;
        }

        return (
            <Grid container>
                <Grid item xs={2} style={{backgroundColor: grayBackground}}>
                    {
                        jobs !== null && jobs.length > 0 ?
                            <Paper elevation={0} style={{backgroundColor: '#FFFFFF'}}>
                                <List style={{marginTop: 20}}>
                                    {
                                        jobs.map((job: Job) => {
                                            return (
                                                <ListItem key={job.UID} button onClick={() => {
                                                    this.setState({selectedJob: job});
                                                }}>
                                                    <ListItemText
                                                        primary={
                                                            <Typography><b>{job.HtmlExtractor.Name === '' ? 'Unnamed Extractor' : job.HtmlExtractor.Name}</b></Typography>}
                                                    />
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
                        <Grid item xs={4}>
                            {selectedJob == null ?
                                null
                                :
                                <div style={{marginLeft: 50}}>
                                    <Typography style={{marginBottom: 8}}>Created
                                        at: {new Date(selectedJob.CreatedAt).toLocaleTimeString()}</Typography>
                                    <Typography>Updated
                                        at: {new Date(selectedJob.UpdatedAt).toLocaleTimeString()}</Typography>
                                </div>
                            }
                        </Grid>
                        <Grid item xs={4}>
                            {(selectedReport == null ? (
                                        jobs !== null && jobs.length == 0 ?
                                            <Typography style={{marginTop: 50, textAlign: 'center', fontSize: 17}}><b>There
                                                are no reports to show</b></Typography>
                                            :
                                            <Typography style={{marginTop: 50, textAlign: 'center', fontSize: 17}}><b>Please
                                                select from left</b></Typography>
                                    )
                                    :
                                    <ExpansionPanel expanded>
                                        <ExpansionPanelSummary
                                            key={selectedReport.id}>{selectedReport.id}</ExpansionPanelSummary>

                                        <ExpansionPanelDetails>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    {
                                                        selectedReport.Field.subFields == null ?
                                                            <ExpansionPanel key={selectedReport.Field.id}
                                                                            defaultExpanded={!(selectedReport.Field.data === "")}>
                                                                <ExpansionPanelSummary
                                                                    expandIcon={<ExpandMore/>}>
                                                                    <Typography>{selectedReport.Field.label === '' ? 'Unnamed Field' : selectedReport.Field.label}</Typography>
                                                                </ExpansionPanelSummary>
                                                                {
                                                                    selectedReport.Field.data !== "" ?
                                                                        <ExpansionPanelDetails>
                                                                            {
                                                                                selectedReport.Field.data
                                                                            }
                                                                        </ExpansionPanelDetails>
                                                                        :
                                                                        <ExpansionPanelDetails>
                                                                            No Data
                                                                        </ExpansionPanelDetails>
                                                                }
                                                            </ExpansionPanel>
                                                            :
                                                            selectedReport.Field.subFields.map((subField: Field) => {
                                                                return (
                                                                    <>
                                                                        <ExpansionPanel key={subField.id}
                                                                                        defaultExpanded={!(subField.data === "")}>
                                                                            <ExpansionPanelSummary
                                                                                expandIcon={<ExpandMore/>}>
                                                                                <Typography>{subField.label}</Typography>
                                                                            </ExpansionPanelSummary>
                                                                            {
                                                                                subField.data !== "" ?
                                                                                    <ExpansionPanelDetails>
                                                                                        {
                                                                                            subField.data
                                                                                        }
                                                                                    </ExpansionPanelDetails>
                                                                                    :
                                                                                    null
                                                                            }
                                                                        </ExpansionPanel>
                                                                        {
                                                                            subField.subFields == null ?
                                                                                null
                                                                                :
                                                                                getFieldViews(subField)
                                                                        }
                                                                    </>
                                                                );
                                                            })
                                                    }
                                                </Grid>
                                            </Grid>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelActions>
                                            <Button onClick={() => {
                                                this.props.history.push('/report/' + selectedReport.VersionId);
                                            }}>Details</Button>
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
        );
    }
}

function getFieldViews(field: Field) {
    return field.subFields.map((subField: Field) => {
        return (
            <>
                <ExpansionPanel key={subField.id} defaultExpanded={!(subField.data === "")}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                        <Typography>{field.label}.{subField.label}</Typography>
                    </ExpansionPanelSummary>
                    {
                        subField.data !== "" ?
                            <ExpansionPanelDetails>
                                {subField.data}
                            </ExpansionPanelDetails>
                            :
                            <ExpansionPanelDetails>
                            </ExpansionPanelDetails>
                    }
                </ExpansionPanel>
                {
                    subField.subFields == null ?
                        null
                        :
                        getFieldViews(subField)
                }
            </>
        );
    })
}

function getNonsubbedFieldDisplay(field: Field): string {
    let label = field.label;
    let data = field.data;

    if (field.subFields != null) {
        alert("Subfield not null")
    }

    if (label === '') {
        label = 'Unnamed field';
    }

    if (data === '') {
        data = 'No data';
    }

    return label + ': ' + data;
}

export default withRouter(ReportsPage);