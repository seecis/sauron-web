// Copyright 2018 Legrin, LLC
//
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file.
import * as React from 'react';
import Extractor from './models'
import ExtractorModule from "./ExtractorModule";
import BrowserInBrowser from "./BrowserInBrowser";
import {AxiosStatic} from 'axios';
import {MockDocumentFetcher} from './DocumentFetcher'
import "./page.scss"
import {withRouter} from "react-router";

interface PageProps {
    api: AxiosStatic,
    match: any
}


class Page extends React.Component<PageProps, any> {
    handleNewExtractor = (ex: Extractor) => {
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
                                 width={"420px"}/>
            </aside>
            <main>
                <BrowserInBrowser
                    key={"k"}
                    api={new MockDocumentFetcher()}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                    url={this.props.match.url}
                    onNewExtractor={this.handleNewExtractor}
                    hoverQuery={this.state.hoverQuery}
                />
            </main>
        </div>
    }
}

export default withRouter(Page);