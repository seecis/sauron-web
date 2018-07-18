import * as React from 'react';
import {Field} from "../models";
import {withRouter} from "react-router";
import {EndPointProvider} from "../EndPointProvider";
import axios from "axios";
import Grid from "@material-ui/core/Grid/Grid";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Paper from "@material-ui/core/Paper/Paper";
import {Job, Version} from "./JobsPage";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

interface VersionsPageProps {
    match: any;
}

class VersionsPage extends React.Component<VersionsPageProps, any> {

    constructor(props) {
        super(props);
        this.state = {
            job: null,
            selectedVersion: null,
            error: null
        };
    }

    getJobById = (id: string | null) => {
        if (id == null)
            return;

        let endPoint = EndPointProvider.GetJobById(id);
        if (endPoint == null)
            return;

        axios.get(endPoint, {})
            .then(response => {
                let data = response.data;
                if (data == null) {
                    let error = {message: 'Data is null'};
                    this.setState({error: error});
                    return;
                }

                this.setState({job: data})
            })
            .catch(error => {
                this.setState({error: error});
            });
    };

    render() {

        const grayBackground = '#818181';
        const job: Job = this.state.job;
        const selectedVersion: Version | null = this.state.selectedVersion;
        const jobId = this.props.match.params.jobId;
        const error = this.state.error;

        if (error != null) {
            return <div>Error: {error.message}</div>;
        }

        if (job == null) {
            this.getJobById(jobId);
            return null;
        }

        return (
            <Grid container>
                <Grid item xs={3} style={{backgroundColor: grayBackground}}>
                    <Paper elevation={0} style={{backgroundColor: '#FFFFFF', marginTop: 30}}>
                        <Typography style={{textAlign: 'center'}}>Versions</Typography>
                        <List>
                            {
                                job.Versions != null && job.Versions.length > 0 ?
                                    job.Versions.map((version: Version, index: number) => {
                                        return (
                                            <ListItem key={version.ID} button onClick={() => {
                                                this.setState({selectedVersion: version});
                                            }}>
                                                <ListItemText
                                                    primary={<Typography><b>{'version' + (index + 1)}</b></Typography>}
                                                    secondary={
                                                        <Typography>{'Version id: ' + version.ID}</Typography>}
                                                />
                                            </ListItem>
                                        );
                                    })
                                    :
                                    <Typography>No versions</Typography>
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={6} style={{minHeight: '100vh'}}>
                    <Grid container>
                        <Grid item xs={2}/>
                        <Grid item xs={8}>
                            {
                                selectedVersion == null ?
                                    <Typography style={{textAlign: 'center', marginTop: 30}}>Please select
                                        version</Typography>
                                    :
                                    <Paper style={{marginTop: 50}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Value</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    !isVersionValid(selectedVersion) ?
                                                        <TableRow>
                                                            <TableCell colSpan={2}>No Report</TableCell>
                                                        </TableRow>
                                                        :
                                                        selectedVersion.Reports[0].Field.subFields.map((subField: Field) => {
                                                            return (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell>{subField.label}</TableCell>
                                                                        <TableCell>{subField.data}</TableCell>
                                                                    </TableRow>
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
                                            </TableBody>
                                        </Table>
                                    </Paper>
                            }

                        </Grid>
                        <Grid item xs={2}/>
                    </Grid>

                </Grid>
                <Grid item xs={3} style={{backgroundColor: grayBackground}}>
                    <Typography style={{color: '#FFFFFF', marginTop: 30, textAlign: 'center'}}>
                        Reserved Area
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

function getFieldViews(field: Field) {
    return field.subFields.map((subField: Field) => {
        return (
            <>
                <TableRow key={subField.id}>
                    <TableCell>{field.label}.{subField.label}</TableCell>
                    <TableCell>{subField.data}</TableCell>
                </TableRow>
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

function isVersionValid(version: Version): boolean {
    return !(
        version == null ||
        version.Reports == null ||
        version.Reports.length == 0 ||
        version.Reports[0] == null ||
        version.Reports[0].Field == null ||
        version.Reports[0].Field.subFields == null ||
        version.Reports[0].Field.subFields.length == 0
    );
}

export default withRouter(VersionsPage);