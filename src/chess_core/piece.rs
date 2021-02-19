use super::square::Square;
#[derive(Debug, Copy, Clone)]
pub struct Piece {
    pub piece: u8,
    pub square: Square
}


impl Piece {
    // Empty
    pub const Empty :u8 = 0b1111;

    // White piece
    pub const WPawn :u8 = 0b0000;
    pub const WKnight :u8 = 0b0001;
    pub const WBishop :u8 = 0b0010;
    pub const WRook :u8 = 0b0011;
    pub const WQueen :u8 = 0b0100;
    pub const WKing :u8 = 0b0101;

    // Black pieces
    pub const BPawn :u8 = 0b1000;
    pub const BKnight :u8 = 0b1001;
    pub const BBishop :u8 = 0b1010;
    pub const BRook :u8 = 0b1011;
    pub const BQueen :u8 = 0b1100;
    pub const BKing :u8 = 0b1101;

    pub fn new(piece: u8, square: Square) -> Self {
        Self {piece, square}
    }
    pub fn get_piece(&self) -> u8 {
        self.piece
    }
}