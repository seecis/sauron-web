// Copyright 2018 Legrin, LLC
//
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file.
import * as React from 'react';
import Query from './models'
import ExtractorModule from "./ExtractorModule";
import BrowserInBrowser from "./BrowserInBrowser";
import {DocumentFetcher} from './DocumentFetcher'
import "./page.scss"
import {withRouter} from "react-router";
import {PathProvider} from "./PathProvider";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import LoadingProgressDialog from "./LoadingProgressDialog";
import axios from 'axios';
import {EndPointProvider} from "./EndPointProvider";

interface PageProps {
    match: any,
    history: any
}

class Page extends React.Component<PageProps, any> {

    private dom: Document;

    handleNewExtractor = (ex: Query) => {
        let extractors: Query[] = this.state.extractors;
        let editAddress = this.state.editAddress ? this.state.editAddress.replace('Query ', '') : null;
        let newElement = this.dom.querySelector(ex.selector);

        // todo: fix contains = true stuff later
        let contains = false;
        if (editAddress != null) {
            let editAddressSplit: number[] = [];
            editAddress.split('.').map((address: string) => {
                editAddressSplit.push(parseInt(address) - 1);
            });

            let query = extractors[editAddressSplit[0]];
            editAddressSplit.shift();

            let queryBeingEdited = this.getEditedQuery(query, editAddressSplit);

            let savedElement = this.dom.querySelector(queryBeingEdited.selector);

            if (savedElement != null && newElement != null && savedElement.contains(newElement)) {
                queryBeingEdited.subQueries.push(ex);
                this.setState({extractors: extractors});
                contains = true;
            }
        }

        if (!contains) {
            this.setState(state => {
                return {extractors: [...state.extractors, ex]}
            });
        }

    };

    getEditedQuery(topQuery: Query, addressList: number[]): Query {
        let result: Query = topQuery;
        for (let i = 0; i < addressList.length; i++) {
            result = result.subQueries[addressList[i]];
        }
        return result;
    }

    setState<K extends keyof any>(state: any, callback?: () => void): void {
        super.setState(state, callback);
    }

    fetcher = new Fetcher(
        () => {
            this.setState({pageLoading: true});
        },
        () => {
            this.setState({pageLoading: false});
        }
    );

    constructor(props) {
        super(props);
        this.state = {
            extractors: [],
            hoverQuery: '',
            editAddress: null,
            pageLoading: false
        }
    }

    render() {

        const url = decodeURIComponent(this.props.match.url.replace('/page/', ''));

        return <>
            <LoadingProgressDialog open={this.state.pageLoading}/>
            <Grid container>
                <Grid item xs={12}>
                    <Typography
                        style={{
                            marginLeft: 30,
                            marginTop: 10,
                            marginBottom: 10,
                            fontSize: 15
                        }}>{'Currently Browsing ' + url}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <div style={{top: "0", position: "relative", display: "flex", height: "100vh"}}>
                        <aside>
                            <ExtractorModule extractors={this.state.extractors}
                                             onHoverSet={(q) => this.setState({hoverQuery: q})}
                                             url={url}
                                             width={"420px"}
                                             onEditAddressSet={(address: string | null) => {
                                                 this.setState({editAddress: address})
                                             }}
                                             editAddress={this.state.editAddress}
                                             onSaveSuccess={() => {
                                                 this.props.history.push(PathProvider.ExtractorList)
                                             }}
                            />
                        </aside>
                        <main style={{
                            overflow: 'hidden'
                        }}>
                            <BrowserInBrowser
                                key={"k"}
                                api={this.fetcher}
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                                url={url}
                                onNewExtractor={this.handleNewExtractor}
                                hoverQuery={this.state.hoverQuery}
                                onGetSubDocumentRoot={(dom: Document) => {
                                    this.dom = dom;
                                }}
                            />
                        </main>
                    </div>
                </Grid>
            </Grid>
        </>
    }
}

class Fetcher implements DocumentFetcher {

    private onLoading;
    private onComplete;

    constructor(onLoading, onComplete) {
        this.onLoading = onLoading;
        this.onComplete = onComplete;
    }

    getInstance = () => {
        return this;
    };

    async fetch(url: string) {

        this.onLoading();
        let instance = this.getInstance();

        return axios({url: EndPointProvider.Proxy +'/new?url=' + url, maxRedirects: 86})
            .then(function (response) {
                instance.onComplete();
                return response.data;
            })
            .catch(function (error) {
                instance.onComplete();
                return error;
            });
    }
}

export default withRouter(Page);