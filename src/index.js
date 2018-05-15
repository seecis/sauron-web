import * as React from "react"
import * as ReactDOM from "react-dom"
import axios from 'axios';
import './index.css';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import {setupCache} from 'axios-cache-adapter'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import Extractor from "./models.ts"
import ExtractorWindow from "./ExtractorWindow.jsx"
import './App.scss'
import {ExtractorList} from "./ExtractorExpansionPanel";

const cache = setupCache(/* options */);

const api = axios.create({
    adapter: cache.adapter
});

class ExtractorModule extends React.Component {
    constructor(props) {
        super();
        this.state = {innerHtml: "", extractors: [], expanded: null};
        this.state.extractors = props.extractors;
        this.newExtractorCallback = this.newExtractorCallback.bind(this);
        this.createExtractor = this.createExtractor.bind(this);
    }

    createExtractor() {
        this.setState(state => {
            state.expanded = state.extractors.length - 1;
            return state;
        })
    }

    newExtractorCallback(e) {
        this.setState(state => {
            state.extractors.push(e);
            console.log(state);
            return state
        })
    }

    render() {
        const {onHoverSet} = this.props;

        function testCode(path) {
            onHoverSet(path);
        }

        return (<React.Fragment>
                <div style={{width: this.props.style.width}}>
                    <Button onClick={this.createExtractor}>New extractor</Button>
                    <Button>Save</Button>
                    <ExtractorList
                        extractors={this.state.extractors}
                        classes={styles}
                        onListItemHover={testCode}
                    />
                </div>
            </React.Fragment>
        )
    }
}


const theme = createMuiTheme({
    palette: {
        primary: {main: purple[500]}, // Purple and green play nicely together.
        // secondary: {main: '#11cb5f'}, // This is just green.A700 as hex.

    },
});

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    subheader: {
        width: '100%',
    },
    paper: {
        height: '100%',
    }
});


class Page extends React.Component {
    constructor(props) {
        super(props);
        let e1 = new Extractor("div");
        let e2 = new Extractor("s");
        this.state = {
            extractors: [e1, e2],
            hoverQuery: null
        };

        this.handleNewExtractor = this.handleNewExtractor.bind(this)
    }

    handleNewExtractor(ex) {
        this.setState(state => {
            console.log(state, ex);
            state.extractors.push(ex);
            return ex;
        });
    }

    render() {
        let {extractors} = this.state;
        const onHover = (q) => {
            this.setState({hoverQuery: q})
        };

        return <div style={{top: "0", position:"relative", display:"flex", height:"100vh"}} >
            <ExtractorModule extractors={extractors} onHoverSet={onHover} style={{width: "420px", position:"absolute", height:"100vh", overflow:"scroll"}} />
            <ExtractorWindow
                style={{top: "0", position:"relative", width: `calc(100% - ${420}px)`, height:"100vh", overflow:"scroll"}}
                url={"https://www.amazon.com/HOOVER-FH11300PC-Spotless-Portable-Upholstery/dp/B01KIMOEW4/"}
                onNewExtractor={this.handleNewExtractor}
                hoverQuery={this.state.hoverQuery}
                api={api}
            />
        </div>
    }
}

ReactDOM.render(
    <div style={{position: "relative", top: "0", height: "100vh"}}>
        <CssBaseline/>
        <MuiThemeProvider theme={theme}>
            <Page/>
        </MuiThemeProvider>
    </div>,
    document.getElementById("root"));

