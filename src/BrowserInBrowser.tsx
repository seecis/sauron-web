import * as React from "react"
import Query from "./models"
import ExtractorLayoutBox from "./ExtractorLayoutBox"
import {DetailedHTMLProps} from "react";
import {DocumentFetcher} from "./DocumentFetcher"
import "./DocumentFetcher";
import './page.scss';
import {default as Pathfinder} from "./Pathfinder";

interface ExtractorWindowProps {
    api: DocumentFetcher;
    url: string;
    hoverQuery: string | null;
    style: DetailedHTMLProps<any, any>
    onNewExtractor: (ex: Query) => void
    onGetSubDocumentRoot: (dom: Document) => void
}

class Point {
    x: number;
    y: number;
    toString = (): string => {
        return "[" + this.x + ", " + this.y + "]"
    };

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class BrowserInBrowser extends React.Component<ExtractorWindowProps, any> {
    fetchUrl = (url) => {
        this.props.api.fetch(url).then(
            (value: Object) => this.setState({u: value})
        ).catch(
            value => this.setState({u: value})
        );
    };
    getSubDocumentRoot = () => {
        let frame = window.frames["wrapper"];
        if (frame == null) {
            return null;
        }

        let contentDocument = frame.contentDocument;
        this.props.onGetSubDocumentRoot(contentDocument);
        return contentDocument;
    };
    getHitRef = () => {
        let contentDocument = this.getSubDocumentRoot();
        if (contentDocument == null) {
            return
        }

        return contentDocument.body;
    };
    getHoverElem = () => {
        if (this.props.hoverQuery) {
            return $(this.getSubDocumentRoot()).find(this.props.hoverQuery)[0];
        }
    };


    hitTest = (contentWrapper, x, y): HTMLElement | null => {
        function hits(rect): boolean {
            return x <= rect.right && x > rect.left && y < rect.bottom && y >= rect.top;
        }

        function test(elem, x, y): HTMLElement | null {
            if (!hits(elem.getBoundingClientRect())) {
                return null
            }

            if (elem.children.length === 0) {
                return elem
            }

            for (let i = 0; i < elem.children.length; i++) {
                let el = elem.children[i];
                let hit = test(el, x, y);
                if (hit != null) {
                    return hit;
                }
            }

            return elem;
        }

        return test(contentWrapper, x, y);
    };
    mouseMove = (e: Point): void => {
        let hitRef = this.getHitRef();
        this.selectedElement = this.hitTest(hitRef, e.x, e.y);
        if (this.selectedElement == null) {
            return;
        }

        this.setState({
            selection: this.selectedElement.getBoundingClientRect()
        });
    };

    generateHoverSelection = () => {
        let he = this.getHoverElem();
        if (!he) {
            return;
        }

        this.setState({hover: he.getBoundingClientRect()});
    };

    mouseClick = () => {
        if (this.selectedElement == null) {
            return;
        }

        if (this.p == null) {
            this.p = new Pathfinder(this.getSubDocumentRoot().body);
        }
        let path = this.p.findUntilRoot(this.selectedElement);
        let s = this.selectedElement.textContent;
        if (s == null) {
            s = ""
        }

        this.props.onNewExtractor(new Query(path, s.trim()));
    };

    translateCoordinates = (e: React.MouseEvent<HTMLElement>): Point => {
        const tBounds = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - tBounds.left;
        let y = e.clientY - tBounds.top;
        return new Point(x, y);
    };
    private selectedElement: HTMLElement | null;
    private p: Pathfinder;

    constructor(props) {
        super(props);
        this.state = {
            u: "",
            selectedElement: null,
        };
    }

    render() {
        return <>
            <div style={this.props.style}>
                <iframe
                    className={"sauron-framer"}
                    scrolling="yes"
                    id="wrapper"
                    srcDoc={this.state.u}
                    frameBorder="0"/>
                <div id="overlay"
                     onMouseMove={e => {
                         this.mouseMove(this.translateCoordinates(e))
                     }}
                     onClick={() => this.mouseClick()}>
                    <ExtractorLayoutBox selection={this.state.selection}/>
                    <ExtractorLayoutBox selection={this.state.hover}/>
                </div>
            </div>
        </>
    }

    componentDidMount() {
        // todo: async
        this.fetchUrl(this.props.url);
    }
}

export default BrowserInBrowser;