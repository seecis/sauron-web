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
import {Extractor} from "../Extractor";
import Query from "../models";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";

type QueryWrapper = {
    query: Query;
    result: string;
};

type ExtractorWrapper = {
    name: string;
    id: string;
    queries: QueryWrapper[];
};

class ResultsPage extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            selectedExtractor: null
        }
    }

    render() {

        let query1: Query = {
            name: 'Full Price',
            subQueries: [],
            selector: '',
            forEachChildren: false
        };

        let query2: Query = {
            name: 'Discounted',
            subQueries: [],
            selector: '',
            forEachChildren: false,
        };

        let queryWrapper1: QueryWrapper = {
            query: query1,
            result: '72.99 $'
        };

        let queryWrapper2: QueryWrapper = {
            query: query2,
            result: '22.99 £'
        };

        let extractor1: ExtractorWrapper = {
            name: 'Extractor 1',
            queries: [queryWrapper1, queryWrapper2],
            id: 'asdasd'
        };

        let extractor2: ExtractorWrapper = {
            name: 'Extractor 2',
            queries: [queryWrapper1, queryWrapper2],
            id: 'asdasdasd'
        };

        const extractorList = [extractor1, extractor2];
        const selectedExtractor: ExtractorWrapper = this.state.selectedExtractor;
        const grayBackground = '#818181';

        return (
            <Grid container>
                <Grid item xs={2} style={{backgroundColor: grayBackground}}>
                    <Paper elevation={0} style={{backgroundColor: '#FFFFFF'}}>
                        <List style={{marginTop: 20}}>
                            {extractorList.map((extractor: ExtractorWrapper) => {
                                return (
                                    <ListItem key={extractor.id} button onClick={() => {
                                        this.setState({selectedExtractor: extractor})
                                    }}>
                                        <ListItemText
                                            primary={<Typography><b>{extractor.name}</b></Typography>}
                                            secondary={'URL: ' + extractor.name}/>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={24} style={{marginTop: 20}}>
                        <Grid item xs={4}/>
                        <Grid item xs={4}>
                            {(selectedExtractor == null ?
                                    (extractorList == null ?
                                            <Typography>Nothing Found :(</Typography>
                                            :
                                            <Typography style={{marginTop: 50, textAlign: 'center', fontSize: 17}}><b>Please
                                                select from left</b></Typography>
                                    )
                                    :

                                    <ExpansionPanel>
                                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}
                                                               key={selectedExtractor.id}>{selectedExtractor.name}</ExpansionPanelSummary>

                                        <ExpansionPanelDetails>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    {
                                                        selectedExtractor.queries.map((queryWrapper: QueryWrapper) => {
                                                            return (
                                                                <ExpansionPanel key={queryWrapper.query.name}>
                                                                    <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                                                                        <Typography>{queryWrapper.query.name}</Typography>
                                                                    </ExpansionPanelSummary>
                                                                    <ExpansionPanelDetails>
                                                                        <Typography>{queryWrapper.result}</Typography>
                                                                    </ExpansionPanelDetails>
                                                                </ExpansionPanel>
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
                        Burası Dursun</Typography>
                </Grid>
            </Grid>

        );
    }
}

export default withRouter(ResultsPage);