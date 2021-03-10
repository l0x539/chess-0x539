import { Component } from 'react';
import Piece from './piece'
import BoardHolder from "./boardholder";
import ReactCursorPosition from 'react-cursor-position';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    boardHolder: {
        height: theme.spacing(70),
        width: theme.spacing(70),
        backgroundSize: "100%",
        // paddingBottom: "100%",
        // width: "100%",
        display: "block",
    }
  });

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }


    render () {
        const { classes } = this.props;
        let pros = false;
        if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            pros = {
                width: window.innerWidth * 0.80,
                height: window.innerWidth * 0.80,
            }
            // some code..
           }
        
        return <ReactCursorPosition>
                <BoardHolder {...this.props} boardHolder={classes.boardHolder} />
            </ReactCursorPosition>
    }
}


Board.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Board);