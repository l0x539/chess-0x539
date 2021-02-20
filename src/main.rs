mod chess_core;

use std::f64::consts::PI;

use chess_core::{board::Board, piece::Piece, square::Square, utils::draw_ray};

#[derive(Debug)]
struct Test(u8);

fn main() {
    let mut b = Board::new();
    b.initialize_classic_start_board();
    b.move_piece(b.table[Square::E2.get_square_int() as usize], Square::E4);
    b.move_piece(b.table[Square::D1.get_square_int() as usize], Square::G4);

    println!("this {:?}", b.bitboard);
}