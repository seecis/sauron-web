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
import {Field, Report, ReportSummary} from "../models";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Button from "@material-ui/core/Button/Button";

interface ReportsPageProps {
    history: any;
}

class ReportsPage extends React.Component<ReportsPageProps, any> {

    constructor(props) {
        super(props);
        this.state = {
            reports: null,
            selectedReport: null,
            selectedReportSummary: null
        };
    }

    getReports = () => {
        axios.get(EndPointProvider.Reports, {})
            .then(response => {
                this.setState({reports: response.data});
            })
            .catch(error => {
                alert(error.message);
            });
    };

    fetchReportById = (reportId: string | undefined) => {
        let path = EndPointProvider.GetReportById(reportId);
        if (path == null) {
            return;
        }

        axios.get(path, {})
            .then(response => {

                let selectedReportSummary: ReportSummary | null = null;
                this.state.reports.map((report: ReportSummary) => {
                    if (report.id === reportId) {
                        selectedReportSummary = report;
                    }
                });

                this.setState({selectedReport: response.data, selectedReportSummary: selectedReportSummary})
            })
            .catch(error => {
                alert(error.message);
            });
    };

    render() {

        const grayBackground = '#818181';
        const selectedReport: Report = this.state.selectedReport;
        const reports: ReportSummary[] | null = this.state.reports;
        const selectedReportSummary: ReportSummary | null = this.state.selectedReportSummary;

        if (reports == null) {
            this.getReports();
            return null;
        }

        return (
            <Grid container>
                <Grid item xs={2} style={{backgroundColor: grayBackground}}>
                    {
                        reports !== null && reports.length > 0 ?
                            <Paper elevation={0} style={{backgroundColor: '#FFFFFF'}}>
                                <List style={{marginTop: 20}}>
                                    {
                                        reports.map((report: ReportSummary) => {
                                            return (
                                                <ListItem key={report.id} button onClick={() => {
                                                    this.fetchReportById(report.id);
                                                }}>
                                                    <ListItemText
                                                        primary={<Typography><b>{report.id}</b></Typography>}
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
                            {selectedReportSummary == null ?
                                null
                                :
                                <>
                                    <Paper><Typography>Created
                                        at: {new Date(selectedReportSummary.created_at).toLocaleTimeString()}</Typography></Paper>
                                    <Paper><Typography>Updated
                                        at: {new Date(selectedReportSummary.updated_at!).toLocaleTimeString()}</Typography></Paper>
                                </>
                            }
                        </Grid>
                        <Grid item xs={4}>
                            {(selectedReport == null ? (
                                        reports !== null && reports.length == 0 ?
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
                                                this.props.history.push('/report/' + selectedReport.id);
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

export default withRouter(ReportsPage);
