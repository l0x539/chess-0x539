use super::board::Board;
use super::piece::Piece;
use super::square::Square;

pub struct Perms;

impl Perms {
    pub fn is_can_move(board :&Board, piece :&Piece, sqare: &Square) -> bool{
        true
    }
}