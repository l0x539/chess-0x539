

use super::{perms::Perms, piece::Piece, square::{self, Square}};
use std::{fmt, u8};

const FEN_START_BOARD: &str = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

pub enum FenError {
    InvalidFenFormat {s: String},
    InvalidFenPieceType {piece: char},
    InvalidFenTurn {turn: String},
    InvalidFenHalfMoveCount {hc: String},
}

impl fmt::Debug for FenError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            FenError::InvalidFenFormat{s} => writeln!(f, "Invalid Forsyth-Edwards Notation format: {}", s),
            FenError::InvalidFenPieceType {piece} => writeln!(f, "Invalid Forsyth-Edwards Notation Piece: {} ?", piece),
            FenError::InvalidFenTurn {turn} => writeln!(f, "Couldn't resolve which player turn it is: {}\n it could be 'w' for white or 'b' for black", turn),
            FenError::InvalidFenHalfMoveCount {hc} => writeln!(f, "Invalid Forsyth-Edwards Notation Half Move count: {}\n Should be an integer", hc),
        }
    }
}

fn is_digit(s: &str) -> bool{
    match String::from(s).parse::<u32>() {
        Ok(ok) => true,
        Err(e) => false
    }
}

#[derive(Debug, Clone, Copy)]
pub struct Board {
    pub table: [Piece; 64],
    pub castling_ability: u8,
    pub en_passent_square: Square,
    pub moves_count: u32,
    pub half_move_count: u32,
    pub turn: bool,
}

impl Board {
    pub fn new() -> Self {
        let p: Piece = Piece::new(Piece::Empty, Square::NO_SQUARE);
        Self { table: [p ; 64], castling_ability: 0b0000, en_passent_square: Square::NO_SQUARE, moves_count: 1, half_move_count: 0, turn: false }
    }
    pub fn print_debug_board(&self) {
        println!("{:?}", self.table);
    }

    pub fn move_piece(&mut self, piece: Piece, square: Square) {
        if (Perms::is_can_move(&self, &piece, &square)) {
            self.set_piece_location(piece, square)
        }
    }

    fn set_piece_location(&mut self, piece: Piece, square: Square) {
        self.table[square.0 as usize] = piece;
    }

    fn set_turn(&mut self, turn: bool) {
        self.turn = turn;
    }
    fn switch_turn(&mut self) {
        self.turn = !self.turn;
    }
    fn set_castling_ability(&mut self, castling_ability: u8) {
        self.castling_ability = castling_ability;
    }
    fn set_enpassant_square(&mut self, square: Square) {
        self.en_passent_square = square;
    }
    fn set_half_move_count(&mut self, half_move_count: u32) {
        self.half_move_count = half_move_count;
    }
    fn set_moves_count(&mut self, moves_count: u32) {
        self.moves_count = moves_count;
    }

    pub fn initialize_classic_start_board(&mut self) {
        self.fen(FEN_START_BOARD);
    }
    pub fn fen(&mut self, s: &str) -> Result<Board, FenError> {
        // Split to FEN fields
        let split = s.trim().split_whitespace();
        let fields: Vec<&str> = split.collect();

        // check if FEN format has length of 6
        if fields.len() != 6 { return Err(FenError::InvalidFenFormat{s: String::from(s)}); }

        // Get ranks
        let split = fields[0].split('/');
        let piece_placement_ranks: Vec<&str> = split.collect();
        let mut c: u8 = 0;
        for rank in piece_placement_ranks {
            let _pieces = rank.chars();
            for mut p in _pieces {
                if p.is_digit(10) {
                    c += p.to_digit(10).unwrap() as u8 - 1;
                } else if p.is_alphabetic() {
                     let _piece = self.resolve_fen_piece(p, c);
                     if _piece.get_piece() == Piece::Empty {
                         return Err(FenError::InvalidFenPieceType {piece: p});
                     } else {
                         self.set_piece_location(_piece, Square::new(c));
                     }
                }
                c += 1;
            }
        }

        // Get turn
        if fields[1].len() < 1 || fields.len() > 1 { return Err(FenError::InvalidFenTurn {turn: String::from(fields[1])}); }
        let _turn = fields[1].chars().next().unwrap();
        if _turn != 'w' && _turn != 'b' { return Err(FenError::InvalidFenTurn {turn: String::from(fields[1])}); }
        self.set_turn( self.resolve_fen_turn(_turn) );
        
        // Castling ability kqKQ
        let _castling_ability = fields[2];
        self.set_castling_ability(self.resolve_castling_ability(_castling_ability)); 

        // En Passent Square
        let en_passent_square = fields[3];
        self.set_enpassant_square( self.resolve_enpassant_square(en_passent_square) );

        // HalfMove Clock
        let half_move_clock = fields[4];
        if !is_digit(half_move_clock) { return Err(FenError::InvalidFenHalfMoveCount {hc: String::from(fields[4])}); }
        self.set_half_move_count(self.resolve_half_move_count(half_move_clock));

        // Move Count
        let move_count = fields[5];
        self.set_moves_count(self.resolve_move_count(move_count));

        Ok(*self)
    }

    fn resolve_move_count(&self, move_count: &str) -> u32 {
        let _move_count: u32 = move_count.parse().unwrap();
        _move_count
    }

    fn resolve_half_move_count(&self, half_move_clock: &str) -> u32 {
        let _half_move_clock: u32 = half_move_clock.parse().unwrap();
        _half_move_clock
    }
    fn resolve_enpassant_square(&self, s: &str) -> Square {
        match s {
            "a3" => Square::A3,
            "b3" => Square::B3,
            "c3" => Square::C3,
            "d3" => Square::D3,
            "e3" => Square::E3,
            "f3" => Square::F3,
            "g3" => Square::G3,
            "h3" => Square::H3,

            "a6" => Square::A6,
            "b6" => Square::B6,
            "c6" => Square::C6,
            "d6" => Square::D6,
            "e6" => Square::E6,
            "f6" => Square::F6,
            "g6" => Square::G6,
            "h6" => Square::H6,
            "-" => Square::NO_SQUARE,
            _ => Square::NO_SQUARE
        }
    }

    fn resolve_castling_ability(&self, s: &str) -> u8 {
        let mut _castling_ability = 0b0000;
        if s.contains("k") { 
            _castling_ability = _castling_ability|0b1000; 
        };
        if s.contains("q") { 
            _castling_ability = _castling_ability|0b0100; 
        };
        if s.contains("K") { 
            _castling_ability = _castling_ability|0b0010; 
        };
        if s.contains("Q") { 
            _castling_ability = _castling_ability|0b0001; 
        };
        _castling_ability
    }

    fn resolve_fen_turn(&self, c: char) -> bool {
        match c {
            'w' => true,
            'b' => false,
            _ => true
        }
    }

    fn resolve_fen_piece(&self, c: char, sq: u8) -> Piece {
        match c {
            'p' => Piece::new(Piece::BPawn, Square::new(sq)),
            'r' => Piece::new(Piece::BRook, Square::new(sq)),
            'n' => Piece::new(Piece::BKnight, Square::new(sq)),
            'b' => Piece::new(Piece::BBishop, Square::new(sq)),
            'q' => Piece::new(Piece::BQueen, Square::new(sq)),
            'k' => Piece::new(Piece::BKing, Square::new(sq)),

            'P' => Piece::new(Piece::WPawn, Square::new(sq)),
            'R' => Piece::new(Piece::WRook, Square::new(sq)),
            'N' => Piece::new(Piece::WKnight, Square::new(sq)),
            'B' => Piece::new(Piece::WBishop, Square::new(sq)),
            'Q' => Piece::new(Piece::WQueen, Square::new(sq)),
            'K' => Piece::new(Piece::WKing, Square::new(sq)),
            _ => Piece::new(Piece::Empty, Square::new(sq))
        }
    }
}