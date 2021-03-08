import Piece from './piece'

export const MergePieces = (props) => {
    const {board, board_height, board_width, myside} = props
    return board.map((piece, i) => {
                    
        if (piece !== 15) {
            return <Piece piece_type={piece} side={myside} square={i} key={i} board_width={board_width} board_height={board_height} {...props} />
        } else {
            return;
        }
    })
}