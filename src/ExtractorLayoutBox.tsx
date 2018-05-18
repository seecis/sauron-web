import * as React from 'react';
import {CSSProperties} from 'react'


interface ExtractorLayoutBoxProps {
    selection: { top: number, left: number, width: number, height: number }
    color?: string
}

class ExtractorLayoutBox extends React.Component<ExtractorLayoutBoxProps, any> {

    constructor(props) {
        super(props)
    }

    render() {
        if (!this.props.selection) {
            return null;
        }

        const props = this.props;

        function getStyle(): CSSProperties {
            const {selection} = props;
            let t = selection.top;
            let l = selection.left;
            return {
                backgroundColor: props.color ? props.color : "purple",
                opacity: 0.3,
                position: "absolute",
                transform: "translate(" + l + "px, " + t + "px)",
                width: selection.width,
                height: selection.height,
            };
        }

        return <div style={getStyle()}/>
    }
}

export default ExtractorLayoutBox;