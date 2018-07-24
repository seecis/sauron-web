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
import CheckIcon from '@material-ui/icons/Check';
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions"
import Grid from "@material-ui/core/Grid"
import IconButton from '@material-ui/core/IconButton';
import Query from './models'
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";

interface ExtractorListProps {
    extractors: Array<Query>,
    parentValue: string,
    onListItemHover: (string) => any
    depth: number;
    onEditAddressSet: (address: string | null) => void
    editAddress: string | null
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
        this.setState({extractors: nextProps.extractors})
    }

    render() {
        return (
            <React.Fragment>
                <List style={{padding: "8px"}}>
                    {
                        Array.from(this.state.extractors.map((ex: Query, index: number) => {
                            return <ExtractorView
                                expanded={this.state.expanded === index}
                                index={index + 1}
                                depth={0}
                                extractor={ex}
                                onChange={this.handleExtractorExpand(index)}
                                onDelete={this.handleDelete(index)}
                                parentValue={this.parentValue}
                                hoverCallback={this.onListItemHover}
                                onExtracorLabelChange={() => {
                                }}
                                onEditComplete={() => {
                                }}
                                onCheckedChange={(isChecked: boolean) => {
                                    this.state.extractors[index].forEachChildren = isChecked;
                                    this.setState({extractors: this.state.extractors});
                                }}
                                address={(this.parentValue ? (this.parentValue + ".") : "") + (index + 1)}
                                onEditAddressSet={this.props.onEditAddressSet}
                                editAddress={this.props.editAddress}
                            />
                        }))
                    }
                </List>
            </React.Fragment>
        )
    }
}

interface ExtractorViewProps {
    hoverCallback: (string) => any
    onDelete: (number) => any
    expanded?: boolean | undefined
    index: number
    depth: number
    extractor: Query
    onChange: (event: ChangeEvent<{}>, expanded: boolean | number) => void
    onExtracorLabelChange: (string, Query) => void
    parentValue: string
    onCheckedChange: (isChecked: boolean) => void
    onEditComplete: () => void
    address: string
    onEditAddressSet: (address: string | null) => void
    editAddress: string | null
}

class ExtractorView extends React.Component<ExtractorViewProps, any> {
        handleMouseOver = (event) => {
            event.preventDefault();
            this.hoverCallback(this.extractor.selector);
        };

        childHover = (path: string) => {
            this.hoverCallback(this.extractor.selector + " > " + path)
        };

    addSubQuery = () => {
        // this.setState(state => {
        //     state.childExtractors.push(new Query("a"));
        //     state.expanded = state.childExtractors.length - 1;
        //     return state;
        // });
    };

    handleLabelChange = (event) => {
        let label = event.target.value;
        this.props.onExtracorLabelChange(label, this.extractor);
        this.extractor.name = label;
        this.setState({extractor: this.extractor});
    };

    private extractor: Query;
    private hoverCallback: (string) => any;
    private onChangeCallback: (event: React.ChangeEvent<{}>, expanded: (boolean | number)) => void;

    constructor(props: ExtractorViewProps) {
        super(props);
        this.hoverCallback = props.hoverCallback;
        this.onChangeCallback = props.onChange;
        this.extractor = props.extractor;
        this.state = {
            childExtractors: props.extractor.subQueries,
            isChecked: false,
        };
    }

    render() {
        const props = this.props;
        const {depth} = props;
        const {childExtractors} = this.state;
        const parentValue = props.parentValue ? props.parentValue : "";
        let name = (parentValue ? (parentValue + ".") : "Query ") + props.index;
        let address = this.props.address;

        return depth > 3 ? (null) : (
            //self
            <><ExpansionPanel onChange={props.onChange} expanded={props.expanded} onMouseOver={this.handleMouseOver}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item xs={3}>
                            <Typography>{name}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            {
                                address === this.props.editAddress ?
                                    <IconButton onClick={() => {
                                        this.props.onEditComplete();
                                        this.props.onEditAddressSet(null);
                                    }}><CheckIcon/></IconButton>
                                    :
                                    <IconButton onClick={this.props.onDelete}><DeleteIcon/></IconButton>
                            }
                        </Grid>
                    </Grid>

                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>Example Value: {getDisplayText(this.extractor.defaultValue)}</Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                    <TextField
                        label="Name of this field"
                        id="margin-none"
                        defaultValue={"Label " + props.index}
                        value={this.extractor.name}
                        onChange={this.handleLabelChange}
                    />
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.isChecked}
                                onChange={() => {
                                    this.setState({isChecked: !this.state.isChecked});
                                    this.props.onCheckedChange(!this.state.isChecked);
                                }}
                            />
                        }
                        label="Select every child of this element"
                    />
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                    <ExtractorList
                        onListItemHover={this.childHover}
                        extractors={childExtractors}
                        depth={depth + 1}
                        parentValue={name}
                        // todo: buraya bakıcaz
                        onEditAddressSet={this.props.onEditAddressSet}
                        editAddress={this.props.editAddress}
                    />
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                    {depth > 2 ? null : (<Button onClick={() => {
                        this.addSubQuery();
                        this.props.onEditAddressSet(address);
                    }}>Add Subquery</Button>)}
                </ExpansionPanelActions>
            </ExpansionPanel></>
        )
    }
}

function getDisplayText(originalText: string | null):string {
    if(originalText === null)
        return '';

    if(originalText.length > 100){
        return originalText.substring(0, 99) + '...';
    }

    return originalText;
}

export {
    ExtractorView,
    ExtractorList,
};

