// Copyright 2018 Legrin, LLC
//
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file.

import * as React from "react";
import * as ReactDOM from "react-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import {setupCache} from 'axios-cache-adapter';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import './App.scss';
import * as axios from "axios";
import Landing from "./Landing/Landing";
import {BrowserRouter as Router, Route} from 'react-router-dom';

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
            <Router>
                <div>
                    <Route exact path={'/'} component={() => <Landing/>}/>
                </div>
            </Router>
        </MuiThemeProvider>
    </div>,
    document.getElementById("root"));

