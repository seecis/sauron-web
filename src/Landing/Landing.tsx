// Copyright 2018 Legrin, LLC
//
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file.
import * as React from 'react';
import {Card, CardContent} from '@material-ui/core/'
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button"
import "./Landing.scss"
import CardActions from "@material-ui/core/CardActions";
import {withRouter} from 'react-router-dom';

class Landing extends React.Component<any, any> {
    private urlRef: React.Ref<string>;
    private textInput: HTMLInputElement;

    handleButtonClick = () => {
        let url = this.textInput.value;
        if(url == ''){
            return;
        }

        url = 'https://www.amazon.com/HOOVER-FH11300PC-Spotless-Portable-Upholstery/dp/B01KIMOEW4/';

        url = url.replace('http://', '').replace('https://', '');
        this.props.history.push('/page/' + url);
    };

    render() {

        return <>
            <Typography variant="headline">Sauron</Typography>
            <Card className={"main-card"} square={false}>
                <CardContent className="card-content">
                    <TextField id="url" label={"Url to navigate"} inputRef={(ref) => this.textInput = ref}/>
                </CardContent>
                <CardActions>
                    <Button onClick={this.handleButtonClick}>Go!</Button>
                </CardActions>
            </Card>
        </>
    }
}

export default withRouter(Landing);