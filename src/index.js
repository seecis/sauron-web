import * as React from "react"
import * as ReactDOM from "react-dom"
import CssBaseline from '@material-ui/core/CssBaseline';
import {setupCache} from 'axios-cache-adapter'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import './App.scss'
import * as axios from "axios";
import Landing from "./Landing/Landing"

const cache = setupCache(/* options */);

const theme = createMuiTheme({
    palette: {
        primary: {main: purple[500]}, // Purple and green play nicely together.
    },
});

const api = axios.create({
    adapter: cache.adapter
});



ReactDOM.render(
    <div style={{position: "relative", top: "0", height: "100vh"}}>
        <CssBaseline/>
        <MuiThemeProvider theme={theme}>
            <Landing onUrlReady={url => alert(url)}/>
        </MuiThemeProvider>
    </div>,
    document.getElementById("root"));

