import * as React from 'react';
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpandMore from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";

class QueryView extends React.Component<any, any> {

    render() {
        const query = this.props.query;

        let subQueries = query.subQueries;
        if (subQueries == null || subQueries.length == 0) {
            return (
                <ExpansionPanel>
                    <ExpansionPanelSummary expanded={true}
                                           expandIcon={<ExpandMore/>}>{query.name}</ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {query.name}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            );
        }

        return (
            <List>
                {subQueries.map(query => {
                    return (
                        <ListItem>
                            <QueryView query={query}/>
                        </ListItem>
                    );
                })}
            </List>
        );
    }
}

// todo: withRouter but props fail
export default (QueryView);