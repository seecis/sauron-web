import * as React from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

interface LoadingProgressDialogProps {
    open: boolean;
}

class LoadingProgressDialog extends React.Component<LoadingProgressDialogProps, any> {

    render() {
        return (
            <Dialog open={this.props.open}>
                <DialogContent>
                    <CircularProgress/>
                </DialogContent>
            </Dialog>
        );
    }
}

export default LoadingProgressDialog;