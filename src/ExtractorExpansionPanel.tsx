import * as React from 'react';
import * as PropTypes from 'prop-types'
import * as ExpansionPanel from '@material-ui/core/ExpansionPanel';
import * as ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import * as ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core//Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import DeleteIcon from "@material-ui/icons/Delete"
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions"
import Grid from "@material-ui/core/Grid"
import IconButton from '@material-ui/core/IconButton';
import Extractor from './models'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
});

class ExtractorList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            expanded: false,
            childExtractors: props.extractors,

        };

        this.handleExtractorExpand = this.handleExtractorExpand.bind(this);
    }

    handleExtractorExpand(index) {
        return (event, expanded) => {
            this.setState({
                expanded: expanded ? index : -1,
            });
        };
    }

    handleDelete = (index) => (e) => {
        e.preventDefault();
        this.setState(state => {
            state.childExtractors.splice(index, 1);
            return state;
        });
    };

    render() {
        const {expanded} = this.state;
        return (
            <React.Fragment>
                <List>
                    {
                        Array.from(this.props.extractors.map((ex, index) => {
                            return <ExtractorExpansionPanel
                                expanded={expanded === index}
                                index={index + 1}
                                depth={0}
                                extractor={ex}
                                onChange={this.handleExtractorExpand(index)}
                                onDelete={this.handleDelete(index)}
                                parentValue={this.props.parentValue}
                                hoverCallback={this.props.onListItemHover}
                            />
                        }))
                    }
                </List>
            </React.Fragment>
        )
    }
}

class ExtractorExpansionPanel extends React.Component {
    constructor(props) {
        super();
        this.state = {childExtractors: []};
        this.handleExtractorExpand = this.handleExtractorExpand.bind(this);
        this.addSubQuery = this.addSubQuery.bind(this);
        this.deleteSubquery = this.deleteSubquery.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
    }

    handleExtractorExpand(index) {
        return (event, expanded) => {
            this.setState({
                expanded: expanded ? index : -1,
            });
        };
    }

    addSubQuery() {
        this.setState(state => {
            state.childExtractors.push(new Extractor("a"));
            state.expanded = state.childExtractors.length - 1;
            return state;
        });
    }

    deleteSubquery(index) {
        this.props.onDelete(index)
    }

    handleMouseOver = (event) => {
        event.preventDefault();
        this.props.hoverCallback(this.props.extractor.getPath());
    };

    childHover = (path) => {
        this.props.hoverCallback(this.props.extractor.getPath() + " > " + path);
    };

    /**
     * @return {null}
     */
    render() {
        const props = this.props;
        const {depth} = props;
        const {childExtractors} = this.state;
        const parentValue = props.parentValue ? props.parentValue : "";
        let name = (parentValue ? (parentValue + ".") : "Query ") + props.index;

        return depth > 3 ? (null) : (
            //self
            <ExpansionPanel onChange={props.onChange}
                            expanded={props.expanded}
                            onMouseOver={this.handleMouseOver}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item xs={2}>
                            <Typography>{name}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton onClick={this.props.onDelete}><DeleteIcon/></IconButton>
                        </Grid>
                    </Grid>

                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <TextField
                        label="Name of this field"
                        id="margin-none"
                        defaultValue={"Label " + props.index}
                    />
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <ExtractorList
                        onListItemHover={this.childHover}
                        extractors={childExtractors}
                        depth={depth + 1}/>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                    {depth > 2 ? null : (
                        <Button onClick={this.addSubQuery}>Add Subquery</Button>
                    )}
                    <Button onClick={this.props.onDelete}>Delete</Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        )
    }
}

ExtractorList.propTypes = {
    extractors: PropTypes.object.isRequired,
    depth: PropTypes.number.isRequired,
    parentValue: PropTypes.string,
    onListItemHover: PropTypes.func
};

ExtractorExpansionPanel.propTypes = {
    index: PropTypes.number.isRequired,
    extractor: PropTypes.object.isRequired,
    parentValue: PropTypes.string,
    hoverCallback: PropTypes.func
};


export {
    ExtractorExpansionPanel,
    ExtractorList,
};

