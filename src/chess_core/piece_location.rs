
use super::square::Square;
pub struct PieceLocation {
    loc: Square
}

impl PieceLocation {
    pub fn new(square: u8) -> Self {
        Self { loc: Square::new(square) }
    }
}