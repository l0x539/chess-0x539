import Board from "../components/board";

const board = [11, 9, 10, 12, 13, 10, 9, 11, 8, 8, 8, 8, 8, 8, 8, 8, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 4, 5, 2, 1, 3]

const BoardTest = () => {
    return <div style={{margin: 60}}>
            <div className="app-game-holder">
                <Board board={board} />
            </div>
        </div>
}

export default BoardTest;