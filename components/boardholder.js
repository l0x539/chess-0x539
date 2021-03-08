import { Component, Fragment } from 'react';
import { Overlay } from "./overlay";
import { MergePieces } from './mergePieces';

class BoardHolder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board_width: 0,
            board_height: 0,
            board: this.props.board,
            side: this.props.myside

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
        let {_arr, status, king_check, moved_from_pos, moved_to_pos, show_overlay, square_dots, updateBoard} = this.props;
        // if (side) {
        //     if (side === "black") {
        //         //_board = board.reverse();
        //     }
        // }
        let king_pos = status[0] === 1? status[3]:status[4];
        if (this.props.myside === "black") {
            moved_from_pos = _arr[moved_from_pos]
            moved_to_pos = _arr[moved_to_pos]
            king_pos = _arr[king_pos]
        }

        return <div className="boardHolder" id="board-blank" onChange={this.fixBoard} onContextMenu={(e)=> e.preventDefault()}>
                {this.state.board_height?<MergePieces {...this.props} board_height={this.state.board_height} board_width={this.state.board_width} />:"Loading"}
                {show_overlay?
                <Fragment>
                    <Overlay board_width={this.state.board_width} board_height={this.state.board_height} className={"last-moved-from"} overlay_position={{x: Math.floor((moved_from_pos%8)*((this.state.board_width)/8)), y: Math.floor(moved_from_pos/8)*(this.state.board_height/8)}} />
                    <Overlay board_width={this.state.board_width} board_height={this.state.board_height} className={"last-moved"} overlay_position={{x: Math.floor((moved_to_pos%8)*((this.state.board_width)/8)), y: Math.floor(moved_to_pos/8)*(this.state.board_height/8)}} />
                    
                </Fragment>
                :""}
                {square_dots?.map((dot, key) =>{
                    let clicked = this.props.clicked - 1
                    
                    return <Overlay key={key} side={this.props.myside} updateBoard={updateBoard} square={clicked} square_to_go={dot} board_width={this.state.board_width} board_height={this.state.board_height} className={"dot"} overlay_position={{x: Math.floor((dot%8)*((this.state.board_width)/8)), y: Math.floor(dot/8)*(this.state.board_height/8)}} />
                })}
                {king_check?<Overlay board_width={this.state.board_width} board_height={this.state.board_height} className={"check"} overlay_position={{x: Math.floor((king_pos%8)*((this.state.board_width)/8)), y: Math.floor(king_pos/8)*(this.state.board_height/8)}} />:""}
            </div>
    }
}


export default BoardHolder;