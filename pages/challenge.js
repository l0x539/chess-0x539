
import Board from "../components/board";
import GameWasmClient from "../chess-core/chess";
import { Component } from "react";


class Challenge extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board: [],
            GameWasmEngine: null,
            status: [0, 0, 0]
        }
    }

    componentDidMount() {
        GameWasmClient.then((GameWasmClient) => {
            console.log(GameWasmClient)
            this.setState({ GameWasmEngine: GameWasmClient })
            this.setState({ board: GameWasmClient.get_board() })
            this.setState({ status: GameWasmClient.get_board()  })
        })
    
        // const status = GameWasmClient.update_board(48, 40, 0)
    }

    updateBoard = (square, square_to_go, promote) => {

        const status = this.state.GameWasmEngine.update_board(square, square_to_go, promote);
        console.log(status);
        this.setState({ status: status  })
        GameWasmClient.then((GameWasmClient) => {
            this.setState({ GameWasmEngine: GameWasmClient })
            this.setState({ board: GameWasmClient.get_board() })
            this.setState({ status: GameWasmClient.get_board()  })
        })
        //this.setState({ board: this.state.GameWasmClient.get_board()  })
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