
import Board from "../components/board";
import GameWasmClient from "../chess-core/chess";
import { Component } from "react";


class Challenge extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board: [],
            GameWasmEngine: null
        }
    }

    componentDidMount() {
        GameWasmClient.then((GameWasmClient) => {
            console.log(GameWasmClient)
            this.setState({ board: GameWasmClient.get_board() })
        })
    
        // const status = GameWasmClient.update_board(48, 40, 0)
    }

    render () {
        return <div style={{margin: 60}}>
                <div className="app-game-holder">
                    <Board board={this.state.board} updateBoard={this.updateBoard} />
                </div>
            </div>
    }
}

export default Challenge;