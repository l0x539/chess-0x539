
import { Component } from 'react';
import Piece from './piece'
import BoardHolder from "./boardholder";
import ReactCursorPosition from 'react-cursor-position';

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    } 



    render () {
    return <ReactCursorPosition>
            <BoardHolder {...this.props} />
        </ReactCursorPosition>
    }
}


export default Board;