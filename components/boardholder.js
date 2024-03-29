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
        
    }

    componentDidMount () {
    }


    render () {
        let {king_pos, boardHolder, _arr, status, king_check, moved_from_pos, moved_to_pos, show_overlay, square_dots, updateBoard} = this.props;


        // if (side) {
        //     if (side === "black") {
        //         //_board = board.reverse();
        //     }
        // }
        const _board = document.getElementById("board-blank");
        const board_width = _board?.clientWidth;
        const board_height = _board?.clientHeight;
        if (this.props.myside === "black") {
            moved_from_pos = _arr[moved_from_pos]
            moved_to_pos = _arr[moved_to_pos]
            // king_pos = _arr[king_pos]
        }

        return <div className={boardHolder} id="board-blank" onContextMenu={(e)=> e.preventDefault()}>
                {board_height?<MergePieces {...this.props} board_height={board_height} board_width={board_width} />:"Loading"}
                {show_overlay?
                <Fragment>
                    <Overlay board_width={board_width} board_height={board_height} className={"last-moved-from"} overlay_position={{x: Math.floor((moved_from_pos%8)*((board_width)/8)), y: Math.floor(moved_from_pos/8)*(board_height/8)}} />
                    <Overlay board_width={board_width} board_height={board_height} className={"last-moved"} overlay_position={{x: Math.floor((moved_to_pos%8)*((board_width)/8)), y: Math.floor(moved_to_pos/8)*(board_height/8)}} />
                    
                </Fragment>
                :""}
                {square_dots?.map((dot, key) =>{
                    let clicked = this.props.clicked - 1
                    
                    return <Overlay key={key} side={this.props.myside} updateBoard={updateBoard} square={clicked} square_to_go={dot} board_width={board_width} board_height={board_height} className={"dot"} overlay_position={{x: Math.floor((dot%8)*((board_width)/8)), y: Math.floor(dot/8)*(board_height/8)}} />
                })}
                {king_check?<Overlay board_width={board_width} board_height={board_height} className={"check"} overlay_position={{x: Math.floor((king_pos%8)*((board_width)/8)), y: Math.floor(king_pos/8)*(board_height/8)}} />:""}
            </div>
    }
}



export default BoardHolder;