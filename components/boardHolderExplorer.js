import { Component, Fragment } from 'react';
import Piece from './piece'
import ReactCursorPosition from 'react-cursor-position';


class BoardHolderExplorer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board_width: 0,
            board_height: 0,
            board: this.props.board,
            side: this.props.side

        }
    } 

    componentDidMount() {
        const _board = document.getElementById("board-blank");
        const board_width = _board?.clientWidth;
        const board_height = _board?.clientHeight;
        this.setState({ board_width, board_height });
    }

    fixBoard = async () => {
        const _board = document.getElementById("board-blank");
        const board_width = _board?.clientWidth;
        const board_height = _board?.clientHeight;
        this.setState({ board_width, board_height });
    }


    render () {
        let { board, side, updateBoard} = this.props;
        if (side) {
            if (side === "black") {
                board = board.reverse();
            }
        }
        return <ReactCursorPosition>
                <div className="boardHolder" id="board-blank" onChange={this.fixBoard} onContextMenu={(e)=> e.preventDefault()}>
                    {this.state.board_width?this.props.board.map((piece, i) => {
                        if (piece !== 15) {
                            return <Piece piece_type={piece} side={side} square={i} key={i} board_width={this.state.board_width} board_height={this.state.board_height} {...this.props} />
                        } else {
                            return;
                        }
                    }): "Loading"}
                    
                    
                    
                </div>
            </ReactCursorPosition>
    }
}


export default BoardHolderExplorer;