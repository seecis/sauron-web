import PropTypes from "prop-types";
import React from 'react';


class ExtractorLayoutBox extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        if (!this.props.selection) {
            return null;
        }

        const props = this.props;

        function getStyle() {
            const {selection} = props;
            let t = selection.selectedTop;
            let l = selection.selectedLeft;
            return {
                backgroundColor: props.color ? props.color : "purple",
                opacity: 0.3,
                position: "absolute",
                transform: "translate(" + l + "px, " + t + "px)",
                width: selection.selectedWidth,
                height: selection.selectedHeight,
            };
        }

        return <div style={getStyle()}/>
    }
}

ExtractorLayoutBox.propTypes = {
    selection: PropTypes.object,
    color: PropTypes.string
};

export default ExtractorLayoutBox;