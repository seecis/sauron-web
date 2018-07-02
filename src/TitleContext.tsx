import * as React from "react";

const TitleContext = React.createContext({});

type TitleType = {
    title: string,
    onTitleChange: (newTitle: string) => void
}

class TitleProvider extends React.Component<any, TitleType> {

    constructor(props) {
        super(props);
        this.state = {
            title: 'SauronFromContext',
            onTitleChange: (newTitle: string) => {
                this.setState({title: newTitle});
            }
        }
    }

    render() {
        return (
            <TitleContext.Provider value={this.state}>
                {this.props.children}
            </TitleContext.Provider>
        );
    }
}

export {
    TitleContext
}

export {
    TitleProvider
}

export const TitleConsumer = TitleContext.Consumer;