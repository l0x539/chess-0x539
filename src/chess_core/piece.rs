use super::square::Square;

#[derive(Debug, Copy, Clone)]
pub struct Piece {
    pub piece: u8,
    pub square: Square,
    pub side: bool
}


impl Piece {
    // Empty
    pub const Empty :u8 = 0b1111;

    // White piece
    pub const WPAWN :u8 = 0b0000;
    pub const WKNIGHT :u8 = 0b0001;
    pub const WBISHOP :u8 = 0b0010;
    pub const WROOK :u8 = 0b0011;
    pub const WQUEEN :u8 = 0b0100;
    pub const WKING :u8 = 0b0101;

    // Black pieces
    pub const BPAWN :u8 = 0b1000;
    pub const BKNIGHT :u8 = 0b1001;
    pub const BBISHOP :u8 = 0b1010;
    pub const BROOK :u8 = 0b1011;
    pub const BQUEEN :u8 = 0b1100;
    pub const BKING :u8 = 0b1101;

    pub fn new(piece: u8, square: Square) -> Self {
        Self {piece, square, side: piece&0b1000 != 0}
    }
    pub fn get_piece(&self) -> u8 {
        self.piece
    }
    pub fn get_rank_square(&self) -> u8 {
        let rank = self.square.get_square_int() / 8;
        rank
    }
    pub fn get_file_square(&self) -> u8 {
        let file = self.square.get_square_int() % 8;
        file
    }

    pub fn set_square(&mut self, square: Square) {
        self.square = square;
    }
}