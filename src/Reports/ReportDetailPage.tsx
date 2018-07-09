import * as React from 'react';
import {Field, Report} from "../models";
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

interface ReportDetailPageProps {
    match: any;
}

class ReportDetailPage extends React.Component<ReportDetailPageProps, any> {

    constructor(props) {
        super(props);
        this.state = {
            report: null
        };
    }

    getReportById = (id: string | null) => {
        if (id == null)
            return;

        let endPoint = EndPointProvider.GetReportById(id);
        if (endPoint == null)
            return;

        axios.get(endPoint, {})
            .then(response => {
                this.setState({report: response.data})
            })
            .catch(error => {
                alert(error.message);
            });
    };

    render() {

        const report: Report = this.state.report;
        const reportId = this.props.match.params.reportId;

        if (report == null) {
            this.getReportById(reportId);
            return null;
        }

        return (
            <Grid container spacing={24}>
                <Grid item xs={3}/>
                <Grid item xs={6}>
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
                                    report.Field.subFields.map((subField: Field) => {
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
                </Grid>
                <Grid item xs={3}/>
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

export default withRouter(ReportDetailPage);