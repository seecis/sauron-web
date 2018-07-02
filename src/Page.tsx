// Copyright 2018 Legrin, LLC
//
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file.
import * as React from 'react';
import Query from './models'
import ExtractorModule from "./ExtractorModule";
import BrowserInBrowser from "./BrowserInBrowser";
import {AxiosStatic} from 'axios';
import {DocumentFetcher} from './DocumentFetcher'
import "./page.scss"
import {withRouter} from "react-router";
import axios from 'axios';

interface PageProps {
    api: AxiosStatic,
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

    constructor(props) {
        super(props);
        this.state = {
            extractors: [],
            hoverQuery: '',
            editAddress: null
        }
    }

    render() {

        const url = decodeURIComponent(this.props.match.url.replace('/page/', ''));

        return <div style={{top: "0", position: "relative", display: "flex", height: "100vh"}}>
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
                                     this.props.history.push("/results")
                                 }}
                />
            </aside>
            <main>
                <BrowserInBrowser
                    key={"k"}
                    api={new Fetcher()}
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
    }
}

class Fetcher implements DocumentFetcher {
    async fetch(url: string) {
        return axios({url: 'http://192.168.1.83:8092/new?url=' + url, maxRedirects: 86})
        // return axios.get('http://localhost:9092/proxy?url=' + url)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error;
            });
    }
}

export default withRouter(Page);