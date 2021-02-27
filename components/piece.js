
import { Component, useState } from 'react';
import Draggable from 'react-draggable';

class Piece extends Component {
    constructor(props) {
        super(props)
        const { square, board_width, board_height } = props;
        console.log(square, board_width, board_height);
        this.state = {
            deltaPosition: {
                x: 0,
                y: 0,
              },
              piece_position: {x: Math.floor(square%8)*(board_width/8), y: Math.floor(square/8)*(board_height/8)}
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
    };

    startDrag = (e, coreEvent) => {
        const { position, board_width, board_height } = this.props;
        this.setState({
            piece_position: {x: position.x - (board_width/16), y: position.y - (board_height/16)}
        })
        this.setState({isDragging: true})
    }
      
    stopDragging = (e, ui) => {
        const { square, board_width, board_height } = this.props;
        this.setState({isDragging: false})
        this.setState({
            piece_position: {x: Math.floor(square%8)*(board_width/8), y: Math.floor(square/8)*(board_height/8)}
        })
        const go_to_square = ui.x
        console.log(ui.x, ui.y);
    }



    render () {
        const { piece_type, square, board_width, board_height } = this.props;
        return <Draggable
            bounds="parent"
            onDrag={this.handleDrag}
            onStop={this.stopDragging}
            position={ this.state.piece_position }
            onStart={this.startDrag}
            >
                <div className={"piece p" + piece_type + " sq-" + square + " " + (this.state.isDragging?"dragging":"")}></div>
            </Draggable>
    }
}


export default Piece;