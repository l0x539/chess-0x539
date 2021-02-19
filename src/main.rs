mod chess_core;

use std::f64::consts::PI;

use chess_core::{board::Board, piece::Piece, square::Square};

#[derive(Debug)]
struct Test(u8);

fn main() {
    let mut b = Board::new();
    b.initialize_classic_start_board();
    println!("{:#?}", b);
}