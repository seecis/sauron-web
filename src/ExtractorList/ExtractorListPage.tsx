import * as React from 'react';
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
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
import Chip from "@material-ui/core/Chip/Chip";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class ExtractorListPage extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            extractors: null,
            selectedExtractor: null,
            selectedReport: null,
            successDialogOpen: false,
            schedulingDialogOpen: false,
            extractionUrlList: [],
            textFieldValue: '',
            period: 1,
            time: 'Days',
            dropdownList: days
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

    scheduleExtraction(extractorId: string | undefined, urlList: string[] | undefined) {
        if (extractorId == null || urlList == null || urlList.length == 0) {
            return;
        }

        let chronStr = this.createCronStr();

        axios.post(EndPointProvider.CreateScheduleJob, {
            Urls: urlList,
            Cron: chronStr,
            extractorId: extractorId
        }, {})
            .then(response => {
                this.setState({successDialogOpen: true, schedulingDialogOpen: false})
            })
            .catch(error => {
                alert(error)
            });
    }

    createCronStr = (): string => {
        let time = this.state.time;
        let period = this.state.period;
        let now = new Date();

        let result = '';

        if (time === 'Days') {
            let remainder = now.getDate() % period;
            result = now.getMinutes() + ' ' + now.getHours() + ' ' + remainder + '-' + (31 - remainder) + '/' + period + ' * *';
        } else if (time === 'Hours') {
            let remainder = now.getHours() % period;
            result = now.getMinutes() + ' ' + remainder + '-' + (24 - remainder) + '/' + period + ' * * *';
        } else if (time === 'Weeks') {
            result = now.getMinutes() + ' ' + now.getHours() + ' * * ' + now.getDay();
        } else {
            result = 'Cron Error';
        }

        return result;
    };

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
                <Dialog open={this.state.schedulingDialogOpen} onClose={() => {
                    this.setState({schedulingDialogOpen: false})
                }} fullWidth={true}>
                    <DialogTitle>Schedule Extraction</DialogTitle>
                    <DialogContent>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (this.state.textFieldValue === "")
                                return;

                            let urls = this.state.extractionUrlList;
                            urls.push(this.state.textFieldValue);
                            this.setState({extractionUrlList: urls, textFieldValue: ''});
                        }}>
                            <TextField label={'Run extraction on'} value={this.state.textFieldValue}
                                       onChange={(e) => {
                                           this.setState({textFieldValue: e.target.value})
                                       }}/>
                        </form>
                    </DialogContent>
                    <DialogContent>
                        {
                            this.state.extractionUrlList.map((extractionUrl: string) => {
                                return <Chip
                                    style={{
                                        marginRight: 8,
                                        marginBottom: 4
                                    }}
                                    label={extractionUrl}
                                    onDelete={() => {
                                        let urls = this.state.extractionUrlList;
                                        let index = urls.indexOf(extractionUrl);
                                        if (index > -1) {
                                            urls.splice(index, 1);
                                            this.setState({extractionUrlList: urls})
                                        }
                                    }}
                                />
                            })
                        }
                    </DialogContent>
                    <DialogContent>

                        <Paper elevation={0} style={{backgroundColor: '#00000000'}}>
                            Every

                            <TextField
                                select
                                value={this.state.period}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    this.setState({period: e.target.value});
                                }}
                                style={{marginLeft: 20}}
                            >
                                {
                                    this.state.dropdownList.map((dropdownItem: number) => {
                                        return <MenuItem key={dropdownItem} value={dropdownItem}>
                                            {dropdownItem}
                                        </MenuItem>
                                    })
                                }
                            </TextField>

                            <TextField
                                select
                                value={this.state.time}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    let dropdownList;
                                    switch (e.target.value) {
                                        case 'Hours':
                                            dropdownList = hours;
                                            break;
                                        case 'Days':
                                            dropdownList = days;
                                            break;
                                        case 'Weeks':
                                            dropdownList = weeks;
                                            break;
                                        default:
                                            dropdownList = hours;
                                    }

                                    if (dropdownList.indexOf(this.state.period) == -1) {
                                        this.setState({
                                            time: e.target.value,
                                            dropdownList: dropdownList,
                                            period: dropdownList[0]
                                        });
                                    } else {
                                        this.setState({time: e.target.value, dropdownList: dropdownList});
                                    }
                                }}
                                style={{marginLeft: 20}}
                            >
                                <MenuItem key={1} value={'Hours'}>
                                    Hours
                                </MenuItem>
                                <MenuItem key={2} value={'Days'}>
                                    Days
                                </MenuItem>
                                <MenuItem key={3} value={'Weeks'}>
                                    Weeks
                                </MenuItem>
                            </TextField>

                        </Paper>

                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.scheduleExtraction(selectedExtractor.id, this.state.extractionUrlList)}>Schedule</Button>
                        <Button
                            onClick={() => {
                                if (this.state.textFieldValue === "")
                                    return;

                                let urls = this.state.extractionUrlList;
                                urls.push(this.state.textFieldValue);
                                this.setState({extractionUrlList: urls, textFieldValue: ''});
                            }}>Add URL</Button>
                    </DialogActions>
                </Dialog>
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
                                                            secondary={'Created on: ' + extractor.url}/>
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
                                                    onClick={() => {
                                                        this.setState({schedulingDialogOpen: true})
                                                    }}>Schedule
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