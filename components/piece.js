
import { Component, Fragment, useState } from 'react';
import Draggable from 'react-draggable';
import { Overlay } from "./overlay";

class Piece extends Component {
    constructor(props) {
        super(props)
        const { square, board_width, board_height } = props;
        this.state = {
            deltaPosition: {
                x: 0,
                y: 0,
              },
              piece_position: {x: Math.floor(square%8)*(board_width/8), y: Math.floor(square/8)*(board_height/8)},
              overlay_position: {x: Math.floor((square%8)*((board_width)/8)), y: Math.floor(square/8)*(board_height/8)},
        }
    } 

    handleDrag = (e, ui) => {
        const {x, y} = this.state.deltaPosition;
        this.setState({ deltaPosition: {
            x: x + ui.deltaX,
            y: y + ui.deltaY,
            }
        });
        this.setState({isDragging: true})
        this.props.clickOverlay(null)
    };

    startDrag = (e, coreEvent) => {
        const { position, board_width, board_height, square } = this.props;
        this.setState({
            piece_position: {x: position.x - (board_width/16), y: position.y - (board_height/16)}
        })
        console.log(e.target.style);
        e.target.style.zIndex = 3
        this.props.clickOverlay(square+1)
        this.setState({isDragging: false})
    }
      
    stopDragging = (e, ui) => {
        e.target.style.zIndex = 2
        const { square, board_width, board_height } = this.props;

        this.setState({isDragging: false})
        this.setState({
            piece_position: {x: Math.floor(square%8)*(board_width/8), y: Math.floor(square/8)*(board_height/8)}
        });
        const X = ui.x + (board_width/16);
        const Y = ui.y + (board_width/16);
        const square_to_go = Math.floor(X / (board_width/8)) + 8 * Math.floor(Y / (board_height/8));

        if (this.props.side === "black") {
            const _arr = [...Array(64).keys()].reverse()
            this.props.updateBoard(_arr[square], _arr[square_to_go], 0)
        } else this.props.updateBoard(square, square_to_go, 0);
    }

    componentDidMount () {
        
    }


    render () {
        const { piece_type, square, board_width, board_height, clicked, show_overlay, position } = this.props;
        return <Fragment>
                <Draggable
                bounds="parent"
                onDrag={this.handleDrag}
                onStop={this.stopDragging}
                position={ this.state.piece_position?this.state.piece_position:position }
                onStart={this.startDrag}
                >
                    <div style={{height: board_height/8, width: board_width/8}} className={"piece p" + piece_type + " sq-" + square + " " + (this.state.isDragging?"dragging":"")}></div>
                </Draggable>
                {(clicked===square+1 && !show_overlay)?<Overlay board_height={board_height} board_width={board_width} className={"clicked"} overlay_position={this.state.overlay_position} />:""}
            </Fragment>
    }
}


export default Piece;