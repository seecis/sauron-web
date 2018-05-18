/** @jsx React.DOM */
import React from 'react';

var Filters = React.createClass({
    handleFilterChange: function() {
        var value = this.refs.filterInput.getDOMNode().value;
        this.props.updateFilter(value);
    },
    render: function() {
        return <input type="text" ref="filterInput" onChange={this.handleFilterChange} placeholder="Filter" />;
    }
});

var List = React.createClass({
    render: function() {
        var content;
        if (this.props.items.length > 0) {
            var items = this.props.items.map(function(item) {
                return <li>{item}</li>;
            });
            content = <ul>{items}</ul>
        } else {
            content = <p>No items matching this filter</p>;
        }
        return (
            <div className="results">
                <h4>Results</h4>
                {content}
            </div>
        );
    }
});

var ListContainer = React.createClass({
    getInitialState: function() {
        return {
            listItems: ['Chicago', 'New York', 'Tokyo', 'London', 'San Francisco', 'Amsterdam', 'Hong Kong'],
            nameFilter: ''
        };
    },
    handleFilterUpdate: function(filterValue) {
        this.setState({
            nameFilter: filterValue
        });
    },
    render: function() {
        var displayedItems = this.state.listItems.filter(function(item) {
            var match = item.toLowerCase().indexOf(this.state.nameFilter.toLowerCase());
            return (match !== -1);
        }.bind(this));

        return (
            <div>
                <Filters updateFilter={this.handleFilterUpdate} />
                <List items={displayedItems} />
            </div>
        );
    }
});

React.renderComponent(<ListContainer />, document.body);