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
    match: any
}


class Page extends React.Component<PageProps, any> {

    private dom: Document;

    handleNewExtractor = (ex: Query) => {
        let extractors = this.state.extractors;

        let newElement = this.dom.querySelector(ex.selector);

        extractors.map((extractor: Query) => {
            let savedElement = this.dom.querySelector(extractor.selector);

            if (savedElement != null && newElement != null && savedElement.contains(newElement)) {
                extractor.subQueries.push(ex);
                this.setState({extractors: extractors});
                return;
            }
        });

        this.setState(state => {
            return {extractors: [...state.extractors, ex]}
        });
    };


    setState<K extends keyof any>(state: any, callback?: () => void): void {
        super.setState(state, callback);
    }

    constructor(props) {
        super(props);
        this.state = {
            extractors: []
        }
    }

    render() {
        return <div style={{top: "0", position: "relative", display: "flex", height: "100vh"}}>
            <aside>
                <ExtractorModule extractors={this.state.extractors}
                                 onHoverSet={(q) => this.setState({hoverQuery: q})}
                                 url={'http://www.amazon.com/HOOVER-FH11300PC-Spotless-Portable-Upholstery/dp/B01KIMOEW4/'}
                                 width={"420px"}/>
            </aside>
            <main>
                <BrowserInBrowser
                    key={"k"}
                    api={new Fetcher()}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                    url={'http://www.amazon.com/HOOVER-FH11300PC-Spotless-Portable-Upholstery/dp/B01KIMOEW4/'}
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
        return axios.get('http://localhost:9092/proxy?url=' + url)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error;
            });
    }
}

export default withRouter(Page);