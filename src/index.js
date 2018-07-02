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
import Page from "./Page";
import ResultsPage from './Results/ResultsPage';
import Grid from '@material-ui/core/Grid/Grid';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer/SwipeableDrawer';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import Link from 'react-router-dom/Link';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import InboxIcon from '@material-ui/icons/Inbox';

const cache = setupCache(/* options */);

const theme = createMuiTheme({
    palette: {
        primary: {main: purple[500]}, // Purple and green play nicely together.
    },
});

const api = axios.create({
    adapter: cache.adapter
});

class SauronAppBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Sauron',
            drawerOpen: false
        };
    }

    toggleDrawer = (open) => () => {
        this.setState({drawerOpen: open});
    };

    render() {
        const drawerItemStyle = {textDecoration: 'none', color: 'unset'};

        return (
            <div>
                <SwipeableDrawer
                    open={this.state.drawerOpen}
                    onClose={this.toggleDrawer(false)}
                    onOpen={this.toggleDrawer(true)}
                >
                    <div
                        role="button"
                        onClick={this.toggleDrawer(false)}
                        onKeyDown={this.toggleDrawer(false)}
                        style={{width: 250}}
                    >
                        <List>
                            <Link to={'/'} style={drawerItemStyle}>
                                <ListItem button>
                                    <ListItemIcon>
                                        <StarIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Home"/>
                                </ListItem>
                            </Link>
                            <Link to={'/results'} style={drawerItemStyle}>
                                <ListItem button>
                                    <ListItemIcon>
                                        <InboxIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Results"/>
                                </ListItem>
                            </Link>
                        </List>
                    </div>
                </SwipeableDrawer>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu" style={{
                            marginLeft: -12,
                            marginRight: 20
                        }} onClick={this.toggleDrawer(true)}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="title" color="inherit" style={{flex: 1}}>
                            <div id={'title'}>
                                Sauron
                            </div>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    // todo: burası değişcek iğrenç oldu
    changeTitle = (title) => {
        let element = document.getElementById("title");
        if (element == null) {
            return;
        }
        element.innerHTML = title;
    };

    render() {

        return (
            <Router>
                <div>
                    <CssBaseline/>
                    <MuiThemeProvider theme={theme}>
                        <SauronAppBar/>
                        <div>
                            <Route path={'/page/:url'} component={() => {
                                this.changeTitle('Create Extractor');
                                return <Page api={api}/>
                            }}/>
                            <Route exact path={'/results'} component={() => {
                                this.changeTitle('Results');
                                return <ResultsPage/>
                            }}/>
                            <Grid container style={{flexGrow: 1}}>
                                <Grid item md={1} lg={2}/>
                                <Grid item xs={12} md={10} lg={8}>
                                    <Grid container justify={'center'}>
                                        <Grid item>
                                            <Route exact path={'/'} component={() => {
                                                this.changeTitle('Sauron');
                                                return <Landing/>
                                            }}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </MuiThemeProvider>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(
    <div style={{position: "relative", top: "0", height: "100vh"}}>
        <App/>
    </div>,
    document.getElementById("root"));