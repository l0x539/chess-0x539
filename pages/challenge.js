
import Board from "../components/board";
import GameWasmClient from "../chess-core/chess";
import { Component, Fragment } from "react";


class Challenge extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board: [],
            GameWasmEngine: null,
            status: [0, 0, 0],
            turn: 0
        }
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        GameWasmClient.then((GameWasmClient) => {
            this.setState({ GameWasmEngine: GameWasmClient })
            this.setState({ board: GameWasmClient.get_board() })
            this.setState({ status: this.state.status })
        })
    
        // const status = GameWasmClient.update_board(48, 40, 0)
    }

    updateBoard = (square, square_to_go, promote) => {

        
        GameWasmClient.then((GameWasmClient) => {
            const status = this.state.GameWasmEngine.update_board(square, square_to_go, promote);
            window.status = status
            this.setState({ status: status  })
            this.setState({ GameWasmEngine: GameWasmClient })
            this.setState({ board: GameWasmClient.get_board() })
        })
        //this.setState({ board: this.state.GameWasmClient.get_board()  })
    }

    render () {
        return <div>
                <div  style={{ margin: "0 64px"}}>
                    {(() => {
                            if (this.state.status) {
                                return <Fragment>
                                        <p>{ this.state.status[0]? "Black": "White"} Turn</p>
                                        { this.state.status[1]? <p>You're in check</p>: ""}
                                        { this.state.status[2] === 1 ? <p>Checkmate!</p>: ""}
                                        { this.state.status[2] === 2 ? <p>Stale Mate!</p>: ""}
                                        { this.state.status[2] === 3 ? <p>Draw!</p>: ""}
                                    </Fragment>
                            }
                        })()
                    }
                </div>
                {}
                <div style={{margin: 60}}>
                    <div className="app-game-holder">
                        <Board board={this.state.board} updateBoard={this.updateBoard} />
                    </div>
                </div>
            </div>
    }
}

export default Challenge;