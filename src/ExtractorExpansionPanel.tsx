import * as React from 'react';
import {ChangeEvent} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import {ExpansionPanelDetails, ExpansionPanelSummary} from '@material-ui/core/'
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import DeleteIcon from "@material-ui/icons/Delete"
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions"
import Grid from "@material-ui/core/Grid"
import IconButton from '@material-ui/core/IconButton';
import Extractor from './models'
import {ExtractorModuleProps} from "./ExtractorModule";

interface ExtractorListProps {
    extractorResolver: (ex: Extractor) => string,
    extractors: Array<Extractor>,
    parentValue: string,
    onListItemHover: (string) => any
    depth: number;
}

class ExtractorList extends React.Component<ExtractorListProps, any> {
    handleDelete = (index: number) => (e: MouseEvent) => {
        e.preventDefault();
        this.setState(state => {
            state.extractors.splice(index, 1);
            return state;
        });
    };

    handleExtractorExpand = (index: number) => (event, expanded) => {
        this.setState({
            expanded: expanded ? index : -1,
        });
    };

    private parentValue: string;
    private onListItemHover: (string) => any;

    constructor(props: ExtractorListProps) {
        super(props);
        this.parentValue = props.parentValue;
        this.onListItemHover = props.onListItemHover;
        this.state = {
            expanded: false,
            extractors: props.extractors,
        };
    }

    componentWillReceiveProps(nextProps: Readonly<ExtractorListProps>, nextContext: any): void {
        this.setState( {extractors: nextProps.extractors})
    }

    render() {
        return (
            <React.Fragment>
                <List style={{padding: "8px"}}>
                    {
                        Array.from(this.state.extractors.map((ex: Extractor, index: number) => {
                            return <ExtractorView
                                expanded={this.state.expanded === index}
                                index={index + 1}
                                depth={0}
                                extractor={ex}
                                onChange={this.handleExtractorExpand(index)}
                                onDelete={this.handleDelete(index)}
                                parentValue={this.parentValue}
                                hoverCallback={this.onListItemHover}
                                extractorResolver={this.props.extractorResolver}
                            />
                        }))
                    }
                </List>
            </React.Fragment>
        )
    }
}

interface ExtractorExpansionPanelProps {
    hoverCallback: (string) => any
    onDelete: (number) => any
    expanded?: boolean | undefined
    index: number
    depth: number
    extractor: Extractor
    onChange: (event: ChangeEvent<{}>, expanded: boolean | number) => void
    extractorResolver: (ex: Extractor) => string
    parentValue: string
}

class ExtractorView extends React.Component<ExtractorExpansionPanelProps, any> {
    handleMouseOver = (event) => {
        event.preventDefault();
        this.hoverCallback(this.extractor.path);
    };

    childHover = (path: string) => {
        this.hoverCallback(this.extractor.path + " > " + path)
    };

    addSubQuery = () => {
        this.setState(state => {
            state.childExtractors.push(new Extractor("a"));
            state.expanded = state.childExtractors.length - 1;
            return state;
        });
    };

    private extractor: Extractor;
    private hoverCallback: (string) => any;
    private onChangeCallback: (event: React.ChangeEvent<{}>, expanded: (boolean | number)) => void;

    constructor(props: ExtractorExpansionPanelProps) {
        super(props);
        this.hoverCallback = props.hoverCallback;
        this.onChangeCallback = props.onChange;
        this.extractor = props.extractor;
        this.state = {childExtractors: []};
    }

    render() {
        const props = this.props;
        const {depth} = props;
        const {childExtractors} = this.state;
        const parentValue = props.parentValue ? props.parentValue : "";
        let name = (parentValue ? (parentValue + ".") : "Query ") + props.index;

        return depth > 3 ? (null) : (
            //self
            <><ExpansionPanel onChange={props.onChange} expanded={props.expanded} onMouseOver={this.handleMouseOver}>
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
                        {this.props.extractorResolver(this.extractor)}
                    </Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                    <ExtractorList
                        onListItemHover={this.childHover}
                        extractors={childExtractors}
                        depth={depth + 1}
                        parentValue={name}
                        extractorResolver={this.props.extractorResolver}/>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                    {depth > 2 ? null : (<Button onClick={this.addSubQuery}>Add Subquery</Button>)}
                    <Button onClick={this.props.onDelete}>Delete</Button>
                </ExpansionPanelActions>
            </ExpansionPanel></>
        )
    }
}

export {
    ExtractorView,
    ExtractorList,
};

