

use super::{perms::Perms, piece::Piece, square::{Square}};
use std::{f64::consts::PI, fmt, u8};

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
        Ok(_) => true,
        Err(_) => false
    }
}

#[derive(Debug, Clone, Copy)]
pub struct Board {
    pub table: [Piece; 64],
    pub bitboard: [u8; 64],
    pub castling_ability: u8,
    pub en_passent_square: Square,
    pub moves_count: u32,
    pub half_move_count: u32,
    pub turn: bool,
    last_repeated: u8,
    last_black_square: u8,
    last_white_square: u8
}


impl Board {
    pub fn new() -> Self {
        let p: Piece = Piece::new(Piece::Empty, Square::NO_SQUARE);
        Self { table: [p ; 64], castling_ability: 0b0000, en_passent_square: Square::NO_SQUARE, moves_count: 1, half_move_count: 0, turn: false, bitboard: [0b1111; 64], last_repeated: 0, last_black_square: 64, last_white_square: 64 }
    }
    /*pub fn print_debug_board_table(&self) {
        println!("{:?}", self.table);
    }

    pub fn print_debug_bitboard(&self) {
        println!("{:?}", self.bitboard);
    }*/

    pub fn print_debug_board_table_squares(&self) {
        let mut c = 0;
        for i in self.table.iter() {
            print!("{}, ", i.square.get_square_int());
            if c%8 == 0 {
                println!();
            }
            c += 1;
        }
        println!("{:?}", self.table);
    }

    pub fn is_checkmate(&self) -> bool {
        let king = self.get_king();
        if Perms.is_checkmate(self, king) {
            return true;
        }
        false
    }

    pub fn is_incheck (&self) -> bool{
        Perms.is_king_in_check(self)
    }

    pub fn is_stale_mate(&self) -> bool {
        let king = self.get_king();
        if Perms.is_stalemate(self, king) {
            return true;
        }
        false
    }

    pub fn is_draw(&self) -> bool {
        if self.half_move_count > 50 {
            return true;
        }
        if self.last_repeated > 5 {
            return true;
        }
        for piece in self.pieces_left() {
            if (piece.get_piece() == Piece::WPAWN || piece.get_piece() == Piece::BPAWN) && self.half_move_count < 50 {
                return false;
            }
            if self.count_values_black() > 3 && self.count_values_white() > 3 {
                return false;
            }
        }

        true
    }

    pub fn count_values_white(&self) -> u8 {
        let mut count: u8 = 0;
        for piece in self.pieces_left() {
            count += match piece.get_piece() {
                Piece::WKNIGHT => 3,
                Piece::WBISHOP => 3,
                Piece::WPAWN => 3,
                Piece::WROOK => 3,
                Piece::WQUEEN => 3,
                _ => 0
            }
        }
        count
    }
    pub fn count_values_black(&self) -> u8 {
        let mut count: u8 = 0;
        for piece in self.pieces_left() {
            count += match piece.get_piece() {
                Piece::BKNIGHT => 3,
                Piece::BBISHOP => 3,
                Piece::BPAWN => 3,
                Piece::BROOK => 3,
                Piece::BQUEEN => 3,
                _ => 0
            }
        }
        count
    }

    fn pieces_left(&self) -> Vec<Piece> {
        let mut vec = Vec::new();
        for &piece in self.table.iter() {
            if piece.get_piece() != Piece::Empty {
                vec.push(piece);
            }
        }
        vec
    }

    fn increment_half_move(&mut self) {
        self.half_move_count += 1;
    }

    fn reset_half_moves(&mut self) {
        self.half_move_count = 0;
    }

    fn increment_last_repeated(&mut self) {
        self.last_repeated += 1;
    }
    fn reset_last_repeated(&mut self) {
        self.last_repeated = 0;
    }

    fn increment_move(&mut self) {
        self.moves_count += 1;
    }

    pub fn move_piece(&mut self, piece: Piece, square: Square, promote: u8) -> bool {
        if Perms.is_can_move(&self, &piece, &square) {
            let mut is_promote = false;
            if piece.get_piece() != Piece::WPAWN && piece.get_piece() != Piece::BPAWN {
                if self.table[square.get_square_int() as usize].get_piece() == Piece::Empty {
                    self.increment_half_move();
                } else {
                    self.reset_half_moves()
                }
                if self.turn {
                    if self.last_black_square == square.get_square_int() {
                        self.increment_last_repeated();
                    } else {
                        self.reset_last_repeated();
                    }
                    self.last_black_square = square.get_square_int();
    
                } else {
                    if self.last_white_square == square.get_square_int() {
                        self.increment_last_repeated();
                    } else {
                        self.reset_last_repeated();
                    }
                    self.last_white_square = square.get_square_int();
    
                }
            } else {
                self.reset_half_moves();
                if square.get_square_int()/8 == 7 || square.get_square_int()/8 == 0 {
                    is_promote = true;
                }
            }


            self.clear_piece_square(piece);
            self.set_piece_location(piece, square, is_promote, promote);
            return true;
        }
        false
    }

    pub fn simulate_clear_piece_square(&mut self, piece:Piece) {
        self.clear_piece_square(piece);
    }
    
    pub fn simulate_set_piece_location(&mut self, piece: Piece, square: Square) {
        self.set_piece_location(piece, square, false, 0);
    }

    fn set_piece_location(&mut self, mut piece: Piece, square: Square, is_promote: bool, promote: u8) {
        piece = Piece::new(piece.piece, square);
        if is_promote {
            piece = match promote {
                0 => Piece::new(if self.turn {Piece::BQUEEN} else {Piece::WQUEEN}, square),
                1 => Piece::new(if self.turn {Piece::BROOK} else {Piece::WROOK}, square),
                2 => Piece::new(if self.turn {Piece::BBISHOP} else {Piece::WBISHOP}, square),
                3 => Piece::new(if self.turn {Piece::BKNIGHT} else {Piece::WKNIGHT}, square),
                _ => piece
            }
        }
        self.table[square.0 as usize] = piece;
        self.bitboard[square.0 as usize] = piece.piece;
        piece.set_square(square);
        self.increment_move();
    }
    fn clear_piece_square(&mut self, piece: Piece) {
        self.set_piece_location(Piece::new(Piece::Empty, piece.square), piece.square, false, 0);
    }

    fn set_turn(&mut self, turn: bool) {
        self.turn = turn;
    }
    pub fn switch_turn(&mut self) {
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

    pub fn get_king(&self) -> Piece {
        for piece in self.table.iter() {
            if self.turn {
                if piece.get_piece() == Piece::BKING {
                    return *piece;
                }
            } else {
                if piece.get_piece() == Piece::WKING {
                    return *piece;
                }
            }
        }
        self.table[Square::E1.get_square_int() as usize]
    }

    pub fn initialize_classic_start_board(&mut self) {
        let r = self.fen(FEN_START_BOARD);
        match r {
            Ok(ok) => println!("Board initialized: {:?}", ok.bitboard),
            Err(e) => println!("{:?}", e)
        }
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
            for p in _pieces {
                if p.is_digit(10) {
                    for i in 0..(p.to_digit(10).unwrap()) {
                        self.set_piece_location(Piece::new(Piece::Empty, Square::new(c + i as u8)), Square::new(c + i as u8), false, 0);
                    }
                    c += p.to_digit(10).unwrap() as u8 - 1;
                } else if p.is_alphabetic() {
                     let _piece = self.resolve_fen_piece(p, c);
                     if _piece.get_piece() == Piece::Empty {
                         return Err(FenError::InvalidFenPieceType {piece: p});
                     } else {
                         self.set_piece_location(_piece, Square::new(c), false, 0);
                     }
                }
                c += 1;
            }
        }

        // Get turn
        if fields[1].len() < 1 || fields[1].len() > 1 { return Err(FenError::InvalidFenTurn {turn: String::from(fields[1])}); }
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
            'w' => false,
            'b' => true,
            _ => true
        }
    }

    fn resolve_fen_piece(&self, c: char, sq: u8) -> Piece {
        match c {
            'p' => Piece::new(Piece::BPAWN, Square::new(sq)),
            'r' => Piece::new(Piece::BROOK, Square::new(sq)),
            'n' => Piece::new(Piece::BKNIGHT, Square::new(sq)),
            'b' => Piece::new(Piece::BBISHOP, Square::new(sq)),
            'q' => Piece::new(Piece::BQUEEN, Square::new(sq)),
            'k' => Piece::new(Piece::BKING, Square::new(sq)),

            'P' => Piece::new(Piece::WPAWN, Square::new(sq)),
            'R' => Piece::new(Piece::WROOK, Square::new(sq)),
            'N' => Piece::new(Piece::WKNIGHT, Square::new(sq)),
            'B' => Piece::new(Piece::WBISHOP, Square::new(sq)),
            'Q' => Piece::new(Piece::WQUEEN, Square::new(sq)),
            'K' => Piece::new(Piece::WKING, Square::new(sq)),
            _ => Piece::new(Piece::Empty, Square::new(sq))
        }
    }
}