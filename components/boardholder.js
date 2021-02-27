
import { Component } from 'react';
import Piece from './piece'

class BoardHolder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board_width: 0,
            board_height: 0

        }
    } 

    componentDidMount() {
        const _board = document.getElementById("board-blank");
        const board_width = _board?.clientWidth;
        const board_height = _board?.clientHeight;
        this.setState({ board_width, board_height });

    }

    render () {
    return <div className="boardHolder" id="board-blank" onContextMenu={(e)=> e.preventDefault()}>
                {this.state.board_width?this.props.board.map((piece, i) => {
                    if (piece !== 15) {
                        return <Piece piece_type={piece} square={i} key={i} board_width={this.state.board_width} board_height={this.state.board_height} {...this.props} />
                    } else {
                        return;
                    }
                }): "Loading"}
            </div>
    }
}


export default BoardHolder;