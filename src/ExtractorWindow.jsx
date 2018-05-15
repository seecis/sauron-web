import jQuery from "jquery";
import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import {setupCache} from 'axios-cache-adapter'
import Extractor from "./models.js"
import ExtractorLayoutBox from "./ExtractorLayoutBox.jsx"

jQuery.fn.extend({
    getPath: function () {
        let pathes = [];

        this.each(function (index, element) {
            let path, $node = jQuery(element);

            let allSiblings;
            while ($node.length) {
                let realNode = $node.get(0), name = realNode.localName;
                if (!name) {
                    break;
                }

                name = name.toLowerCase();
                let parent = $node.parent();
                let sameTagSiblings = parent.children(name);

                if (sameTagSiblings.length > 1) {
                    allSiblings = parent.children();
                    let index = allSiblings.index(realNode) + 1;
                    if (index > 0) {
                        name += ':nth-child(' + index + ')';
                    }
                }

                path = name + (path ? ' > ' + path : '');
                $node = parent;
            }

            pathes.push(path);
        });

        return pathes.join(',');
    },

    getPathRelativeTo: function (elem) {
        let selfPath = this.getPath();
        let parent = elem.getPath().toString();
        return selfPath.toString().replace(parent + " > ", "")
    }
});

class ExtractorWindow extends React.Component {
    constructor(props) {
        super(props);
        this.onNewExtractor = props.onNewExtractor;
        this.state = {
            u: "",
            selectedElement: null,
        };

        this.mouseMove = this.mouseMove.bind(this);
        this.setSize = this.setSize.bind(this);
        this.mouseClick = this.mouseClick.bind(this);
    }

    componentDidMount() {
        this.fetchUrl(this.props.url)
    }

    fetchUrl = (url) => {
        let prepent = "http://localhost:9092/proxy?url=" + url;
        this.props.api.get(prepent)
            .then(res => {
                this.setState({u: res.data})
            })
    };

    getSubdocumentRoot = () => {
        let frame = window.frames["wrapper"];
        if (frame == null) {
            return null;
        }

        return frame.contentDocument;
    };

    getHitRef = () => {
        let contentDocument = this.getSubdocumentRoot();
        if (contentDocument == null) {
            return
        }

        return contentDocument.body;
    };

    getHoverElem = () => {
        if (this.props.hoverQuery) {
            return jQuery(this.getSubdocumentRoot()).find(this.props.hoverQuery)[0];
        }
    };

    hitTest = (contentWrapper, x, y) => {
        function hits(rect) {
            return x <= rect.right && x > rect.left && y < rect.bottom && y >= rect.top;
        }

        function test(elem, x, y) {
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

    getScreenCoordinates = (obj) => {
        let p = {
            x: obj.offsetLeft,
            y: obj.offsetTop
        };

        while (obj.offsetParent) {
            p.x = p.x + obj.offsetParent.offsetLeft;
            p.y = p.y + obj.offsetParent.offsetTop;
            if (obj === document.getElementsByTagName("body")[0]) {
                break;
            }

            obj = obj.offsetParent;
        }

        return p;
    };


    mouseMove = (e) => {
        let hitRef = this.getHitRef();
        let iframe = document.getElementById("wrapper");
        let coords = this.getScreenCoordinates(iframe);

        let elementHit = this.hitTest(hitRef, e.pageX - coords.x, e.pageY - coords.y);
        this.setState(state => {
            state.selectedElement = elementHit;
        });

        if (elementHit == null) {
            return
        }

        let elemRect = elementHit.getBoundingClientRect();
        this.setState({
            selection: {
                selectedWidth: elemRect.width,
                selectedHeight: elemRect.height,
                selectedTop: elemRect.top,
                selectedLeft: elemRect.left
            },
        });
    };

    mouseClick() {
        let selectedElement = this.state.selectedElement;
        if (selectedElement == null) {
            return;
        }

        let path = jQuery(selectedElement).getPath();
        this.onNewExtractor(new Extractor(path));
    }

    generateHoverSelection = () => {
        let he = this.getHoverElem();
        if (!he) {
            return
        }

        let elemRect = he.getBoundingClientRect();
        return {
            selectedWidth: elemRect.width,
            selectedHeight: elemRect.height,
            selectedTop: elemRect.top,
            selectedLeft: elemRect.left
        };
    };

    render() {
        return <React.Fragment>
            <div style={this.props.style}>
                <iframe
                    style={{
                        width: "100%"
                    }}
                    onLoad={(e) => this.setSize(e)}
                    scrolling="no"
                    id="wrapper"
                    srcDoc={this.state.u}
                    frameBorder="0"/>

                <div id="overlay"
                     style={{
                         position: "absolute"
                     }}
                     onMouseMove={this.mouseMove}
                     onMouseDown={this.mouseClick}>

                    <ExtractorLayoutBox selection={this.state.selection}/>
                    <ExtractorLayoutBox selection={this.generateHoverSelection()} color={"red"}/>
                </div>
            </div>
        </React.Fragment>
    }


    setSize(el) {
        el.target.style.height = el.target.contentWindow.document.body.scrollHeight + 'px'
    }
}

ExtractorWindow.propTypes = {
    onNewExtractor: PropTypes.func,
    api: PropTypes.object
};

export default ExtractorWindow;