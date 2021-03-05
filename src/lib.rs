extern crate wasm_bindgen;

use chess_core::{board::Board, square::Square};
use wasm_bindgen::prelude::*;
use js_sys::Array;
use js_sys::Boolean;

#[macro_use]
extern crate lazy_static;

mod components;
mod drawer;
mod app_state;
mod common_funcs;
mod gl_setup;
mod programs;
mod shaders;
mod chess_core;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub struct GameWasmClient {
    board: Board
}

#[wasm_bindgen]
impl GameWasmClient {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut board = Board::new();
        board.initialize_classic_start_board();
        Self {
            board: board
        }
    }

    pub fn update_board(&mut self, square: u8, square_to: u8, promote: u8) -> Array {
        let mut status = [self.board.turn as u8, 0, 0];
        let piece_move = self.board.move_piece(self.board.table[square as usize], Square::new(square_to), promote);
        if piece_move {
            self.board.switch_turn();
            status[0] = if self.board.turn {0} else {1};
        };
        if self.board.is_incheck() {
            status[1] = 1;
        };
        if self.board.is_checkmate() {
            status[2] = 1;
        } else if self.board.is_stale_mate() {
            status[2] = 2;
        } else if self.board.is_draw() {
            status[2] = 3;
        };
        let status: Vec<u8> = status.to_vec();
        status.into_iter().map(JsValue::from).collect()

    }

    pub fn get_board(&mut self) -> Array {
        let board: Vec<u8> = self.board.bitboard.to_vec();
        board.into_iter().map(JsValue::from).collect()
    }
}
