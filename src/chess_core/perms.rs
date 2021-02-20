extern crate array_tool;

use super::board::{self, Board};
use super::piece::Piece;
use super::square::Square;
use super::utils::draw_ray;
use array_tool::vec::Intersect;

pub struct Perms;

impl Perms {
    pub fn is_can_move(&self, board :&Board, piece :&Piece, square: &Square) -> bool{
        println!("testing..");
        if piece.square.get_square_int() == square.get_square_int() {return false;}
        println!("testing..1");
        if self.is_piece_pinned(*board, piece) { return false; }
        println!("testing..2");
        let default_squares = self.get_piece_default_permitterd_squares(piece);
        let ray = draw_ray(piece.square.get_square_int(), square.get_square_int());
        println!("sq: {}, dest: {}", piece.square.get_square_int(), square.get_square_int());
        println!("default_squares..2-1 {:?}", default_squares);
        println!("ray..2-2 {:?}", ray);
        let mut t = false;
        for r in ray {
            if !default_squares.contains(&r) && r!=piece.square.get_square_int() {
                t = true;
            }
        }
        
        if t && piece.get_piece() != Piece::WKNIGHT && piece.get_piece() != Piece::BKNIGHT {return false;}
        println!("testing..3 " );
        if !self.is_can_capture(board, piece, square) {return false;}
        println!("testing..4");
        true
    }

    pub fn is_king_in_check(&self, board :&Board) -> bool {
        if self.is_square_occupied_by_opponent(board.turn, board, &board.get_king().square).len() != 0 {
            return true;
        }
        false
    }
    
    pub fn is_checkmate(&self, board :&Board, king: Piece) -> bool {
        // TODO: add errors for not king piece check
        if self.is_king_in_check(board) {

            let occ =self.is_square_occupied_by_opponent(king.side, board, &king.square);
            if occ.len() > 1 {
                for sq in self.get_piece_default_permitterd_squares(&king).iter() {
                    if self.is_can_capture(board, &king, &board.table[*sq as usize].square) {

                    }
                }
            }
            
        }
        false
    }

    pub fn is_piece_pinned(&self, board :Board, piece :&Piece) -> bool {
        let mut test_board = board;
        test_board.table[piece.square.get_square_int() as usize] = Piece::new(Piece::Empty, piece.square);
        if self.is_king_in_check(&test_board) {
            return true;
        }
        false
    }

    pub fn is_can_capture(&self, board :&Board, capture_piece: &Piece, sqaure_to_go: &Square) -> bool {
        println!("capt_test..");
        if capture_piece.side == board.table[sqaure_to_go.get_square_int() as usize].side { return false; }
        match capture_piece.piece {
            Piece::BPAWN => {
                if board.table[sqaure_to_go.get_square_int() as usize].get_piece() != Piece::Empty {
                    if capture_piece.get_file_square() > 0 {
                        if sqaure_to_go.get_square_int() as i8 - capture_piece.square.get_square_int() as i8 == 7 {
                            return true;
                        }
                        
                    }
                    if capture_piece.get_file_square() < 7 {
                        if sqaure_to_go.get_square_int() as i8 - capture_piece.square.get_square_int() as i8 == 9 {
                            return true;
                        }
                    }
               } else {
                    let start_rank = 8..16;
                    if start_rank.contains(&capture_piece.square.get_square_int()) {
                        if sqaure_to_go.get_square_int() as i8 - capture_piece.square.get_square_int() as i8 == 8 + 8 {
                            if board.table[(capture_piece.square.get_square_int() as i8 + 8) as usize].get_piece() == Piece::Empty {
                                if board.table[(capture_piece.square.get_square_int() as i8 + 16) as usize].get_piece() == Piece::Empty {
                                    return true;
                                }
                            }
                        }
                    } else {
                        if sqaure_to_go.get_square_int() as i8 - capture_piece.square.get_square_int() as i8 == 8 {
                            return true;
                        }
                    }
                                        
               }
            },
            Piece::BKNIGHT => {
                let permitted_squares = draw_ray(capture_piece.square.get_square_int(), sqaure_to_go.get_square_int()).intersect(self.get_piece_default_permitterd_squares(capture_piece));
                if permitted_squares.contains(&sqaure_to_go.get_square_int()) {
                    return true;
                }
            },
            Piece::BBISHOP => {
                let permitted_squares = draw_ray(capture_piece.square.get_square_int(), sqaure_to_go.get_square_int()).intersect(self.get_piece_default_permitterd_squares(capture_piece));
                for sq in permitted_squares {
                    if sq != capture_piece.square.get_square_int() && sq != sqaure_to_go.get_square_int() {
                        if board.table[sq as usize].piece != Piece::Empty {
                            return false;
                        }
                    }
                }
                return true;
            },
            Piece::BROOK => {
                let permitted_squares = draw_ray(capture_piece.square.get_square_int(), sqaure_to_go.get_square_int()).intersect(self.get_piece_default_permitterd_squares(capture_piece));
                for sq in permitted_squares {
                    if sq != capture_piece.square.get_square_int() && sq != sqaure_to_go.get_square_int() {
                        if board.table[sq as usize].piece != Piece::Empty {
                            return false;
                        }
                    }
                }
                return true;
            },
            Piece::BQUEEN => {
                let permitted_squares = draw_ray(capture_piece.square.get_square_int(), sqaure_to_go.get_square_int()).intersect(self.get_piece_default_permitterd_squares(capture_piece));
                for sq in permitted_squares {
                    if sq != capture_piece.square.get_square_int() && sq != sqaure_to_go.get_square_int() {
                        if board.table[sq as usize].piece != Piece::Empty {
                            return false;
                        }
                    }
                }
                return true;
            },
            Piece::BKING => {
                let permitted_squares = self.get_piece_default_permitterd_squares(capture_piece);
                if permitted_squares.contains(&sqaure_to_go.get_square_int()) && self.is_square_occupied_by_opponent(true, board, &sqaure_to_go).len()==0{
                    return true;
                }
            },
            Piece::WPAWN => {
                println!("capt_test..1");
               if board.table[sqaure_to_go.get_square_int() as usize].get_piece() != Piece::Empty {
                println!("capt_test..2");
                if capture_piece.get_file_square() > 0 {
                    println!("capt_test..3");
                    if sqaure_to_go.get_square_int() as i8 - capture_piece.square.get_square_int() as i8 == -9 {
                        println!("capt_test..4");
                        return true;
                    }
                    
                    }
                    if capture_piece.get_file_square() < 7 {
                        println!("capt_test..5");
                        if sqaure_to_go.get_square_int() as i8 - capture_piece.square.get_square_int() as i8 == -7 {
                            println!("capt_test..6");
                            return true;
                        }
                    }
                } else {
                    println!("capt_test..7");
                    let start_rank = 48..56;
                    if start_rank.contains(&capture_piece.square.get_square_int()) {
                        println!("capt_test..8");
                        if sqaure_to_go.get_square_int() as i8 - capture_piece.square.get_square_int() as i8 == -8 - 8 {
                            if board.table[(capture_piece.square.get_square_int() as i8 - 8) as usize].get_piece() == Piece::Empty {
                                println!("capt_test..9");
                                if board.table[(capture_piece.square.get_square_int() as i8 - 16) as usize].get_piece() == Piece::Empty {
                                    return true;
                                }
                            }
                        }
                    } else {
                        println!("capt_test..10");
                        if sqaure_to_go.get_square_int() as i8 - capture_piece.square.get_square_int() as i8 == -8 {
                            return true;
                        }
                    }
                                            
                }
                
            },
            Piece::WKNIGHT => {
                let permitted_squares = draw_ray(capture_piece.square.get_square_int(), sqaure_to_go.get_square_int()).intersect(self.get_piece_default_permitterd_squares(capture_piece));
                if permitted_squares.contains(&sqaure_to_go.get_square_int()) {
                    return true;
                }
            },
            Piece::WBISHOP => {
                let permitted_squares = draw_ray(capture_piece.square.get_square_int(), sqaure_to_go.get_square_int()).intersect(self.get_piece_default_permitterd_squares(capture_piece));
                for sq in permitted_squares {
                    if sq != capture_piece.square.get_square_int() && sq != sqaure_to_go.get_square_int() {
                        if board.table[sq as usize].piece != Piece::Empty {
                            return false;
                        }
                    }
                }
                return true;
            },
            Piece::WROOK => {
                println!("Testing_rook..");
                println!("bedore..{:?} {}", sqaure_to_go.get_square_int(), capture_piece.square.get_square_int());
                let v = draw_ray(capture_piece.square.get_square_int(), sqaure_to_go.get_square_int());
                let permitted_squares = v.intersect(self.get_piece_default_permitterd_squares(capture_piece));
                println!("qsdqd");

                println!("after..{:?} {}", sqaure_to_go.get_square_int(), capture_piece.square.get_square_int());
                for sq in permitted_squares {
                    
                    if sq != capture_piece.square.get_square_int() && sq != sqaure_to_go.get_square_int() {
                        println!("Testing_rook..1");
                        if board.table[sq as usize].piece != Piece::Empty {
                            println!("Testing_rook..2");
                            return false;
                        }
                    }
                }
                return true;
            },
            Piece::WQUEEN => {
                let permitted_squares = draw_ray(capture_piece.square.get_square_int(), sqaure_to_go.get_square_int()).intersect(self.get_piece_default_permitterd_squares(capture_piece));
                for sq in permitted_squares {
                    if sq != capture_piece.square.get_square_int() && sq != sqaure_to_go.get_square_int() {
                        if board.table[sq as usize].piece != Piece::Empty {
                            return false;
                        }
                    }
                }
                return true;
            },
            Piece::WKING => {
                let permitted_squares = self.get_piece_default_permitterd_squares(capture_piece);
                if permitted_squares.contains(&sqaure_to_go.get_square_int()) && (self.is_square_occupied_by_opponent(false, board, &sqaure_to_go).len() == 0){
                    return true;
                }                
            },
            _ => { return false }
        }
        false
    }

    pub fn is_square_occupied_by_opponent(&self, turn: bool, board: &Board, sq: &Square) -> Vec<Piece> {
        let mut occupiers = Vec::new();
        if turn { // black checking
            // check if white pawn can capture in this square
            if sq.get_square_int()%8 > 0 {
                if board.table[(sq.get_square_int() + 7) as usize].get_piece() == Piece::WPAWN {
                    occupiers.push(board.table[(sq.get_square_int() + 7) as usize]);
                }
            }
            if sq.get_square_int()%8 < 7 {
                if board.table[(sq.get_square_int() + 9) as usize].get_piece() == Piece::WPAWN {
                    occupiers.push(board.table[(sq.get_square_int() + 9) as usize]);
                }
            }
            // check if white knight can capture in this square
            if sq.get_square_int()/8 > 1 && sq.get_square_int()%8 > 0 {
                if board.table[(sq.get_square_int() -1 -8 -8) as usize].get_piece() == Piece::WKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() -1 -8 -8) as usize]);
                }
            }
            if sq.get_square_int()/8 > 0 && sq.get_square_int()%8 > 1 {
                if board.table[(sq.get_square_int() -2 -8) as usize].get_piece() == Piece::WKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() -2 -8) as usize]);
                }
            }
            if sq.get_square_int()/8 > 1 && sq.get_square_int()%8 < 7 {
                if board.table[(sq.get_square_int() +1 -8 -8) as usize].get_piece() == Piece::WKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() +1 -8 -8) as usize]);
                }
            }
            if sq.get_square_int()/8 > 0 && sq.get_square_int()%8 < 6 {
                if board.table[(sq.get_square_int() +2 -8) as usize].get_piece() == Piece::WKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() +2 -8) as usize]);
                }
            }

            if sq.get_square_int()/8 < 6 && sq.get_square_int()%8 > 0 {
                if board.table[(sq.get_square_int() -1 +8 +8) as usize].get_piece() == Piece::WKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() -1 +8 +8) as usize]);
                }
            }
            if sq.get_square_int()/8 < 7 && sq.get_square_int()%8 > 1 {
                if board.table[(sq.get_square_int() -2 +8) as usize].get_piece() == Piece::WKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() -2 +8) as usize]);
                }
            }
            if sq.get_square_int()/8 < 6 && sq.get_square_int()%8 < 7 {
                if board.table[(sq.get_square_int() +1 +8 +8) as usize].get_piece() == Piece::WKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() +1 +8 +8) as usize]);
                }
            }
            if sq.get_square_int()/8 < 7 && sq.get_square_int()%8 < 6 {
                if board.table[(sq.get_square_int() +2 +8) as usize].get_piece() == Piece::WKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() +2 +8) as usize]);
                }
            }

            // check if white bishop/queen occupie square on diag
            let tl = if sq.get_square_int()/8 > sq.get_square_int()%8 { sq.get_square_int()%8 } else { sq.get_square_int()/8 };
            let sqtl = sq.get_square_int() - tl - (tl*8);
            let br = if (8 - 1 - sq.get_square_int()/8) > (8 - 1 - sq.get_square_int()%8) { sq.get_square_int()%8 } else { sq.get_square_int()/8 };
            let sqbr = sq.get_square_int() + br + (br*8);
            
            let vec = draw_ray(sqtl, sqbr);

            for square in vec {
                if square != sq.get_square_int() {
                    if board.table[square as usize].piece == Piece::WBISHOP || board.table[square as usize].piece == Piece::WQUEEN {
                        let new_vec = draw_ray(sq.get_square_int(), square);
                        let mut t = false;
                        for _square in new_vec {
                            if _square != sq.get_square_int() && _square != square && board.table[_square as usize].piece != Piece::Empty {

                                t = true;
                            }
                            if !t {occupiers.push(board.table[_square as usize]);}
                        }
                    }
                }
            }
            
            let tr = if sq.get_square_int()/8 > (8 - 1 - sq.get_square_int()%8) { sq.get_square_int()%8 } else { sq.get_square_int()/8 };
            let sqtr = sq.get_square_int() + tr - (tr*8);
            let bl = if (8 - 1 - sq.get_square_int()/8) > sq.get_square_int()%8 { sq.get_square_int()%8 } else { sq.get_square_int()/8 };
            let sqbl = sq.get_square_int() - bl + (bl*8);
            let vec = draw_ray(sqtr, sqbl);

            for square in vec {
                if square != sq.get_square_int() {
                    if board.table[square as usize].piece == Piece::WBISHOP || board.table[square as usize].piece == Piece::WQUEEN {
                        let new_vec = draw_ray(sq.get_square_int(), square);
                        let mut t = false;
                        for _square in new_vec {
                            if _square != sq.get_square_int() && _square != square && board.table[_square as usize].piece != Piece::Empty {
                                t = true;
                            }
                            if !t { occupiers.push(board.table[_square as usize]);}
                        }
                    }
                }
            }

            // check if white rook/queen occupie square 
            let sqt = sq.get_square_int()%8;
            let sqb = sq.get_square_int()%8 + 8 * 7;

            let vec = draw_ray(sqt, sqb);

            for square in vec {
                if square != sq.get_square_int() {
                    if board.table[square as usize].piece == Piece::WROOK || board.table[square as usize].piece == Piece::WQUEEN {
                        let new_vec = draw_ray(sq.get_square_int(), square);
                        let mut t = false;
                        for _square in new_vec {
                            if _square != sq.get_square_int() && _square != square && board.table[_square as usize].piece != Piece::Empty {
                                t = true;
                            }
                            if !t {occupiers.push(board.table[_square as usize]);}
                        }
                    }
                }
            }

            let sql = 8*(sq.get_square_int()/8);
            let sqr = 8*(sq.get_square_int()/8) + 8;

            let vec = draw_ray(sql, sqr);
            for square in vec {
                if square != sq.get_square_int() {
                    if board.table[square as usize].piece == Piece::WROOK || board.table[square as usize].piece == Piece::WQUEEN {
                        let new_vec = draw_ray(sq.get_square_int(), square);
                        let mut t = false;
                        for _square in new_vec {
                            if _square != sq.get_square_int() && _square != square && board.table[_square as usize].piece != Piece::Empty {
                                t = true;
                            }
                            if !t {occupiers.push(board.table[_square as usize]);}
                        }
                    }
                }
            }

            let mut vec = Vec::new();
            // check if white king occupies square
            if sq.get_square_int()%8 > 0 {
                vec.push(sq.get_square_int()-1);

                if sq.get_square_int()/8 > 0 {
                    vec.push(sq.get_square_int()-8);
                    vec.push(sq.get_square_int()-1-8);
                }
                if sq.get_square_int()/8 < 7 {
                    vec.push(sq.get_square_int()+8);
                    vec.push(sq.get_square_int()-1+8);
                }
            } 
            if sq.get_square_int()%8 < 7 {
                vec.push(sq.get_square_int()+1);
                if sq.get_square_int()/8 > 0 {
                    vec.push(sq.get_square_int()-8);
                    vec.push(sq.get_square_int()+1-8);
                }
                if sq.get_square_int()/8 < 7 {
                    vec.push(sq.get_square_int()+8);
                    vec.push(sq.get_square_int()+1+8);
                }
            }
            vec.sort();
            vec.dedup();
            for square in vec {
                if board.table[square as usize].get_piece() == Piece::WKING {
                    occupiers.push(board.table[square as usize]);
                }
            }
        } else { // white checking
            // check if black pawn can capture in this square
            if sq.get_square_int()%8 > 0 {
                if board.table[(sq.get_square_int() - 9) as usize].get_piece() == Piece::BPAWN {
                    occupiers.push(board.table[(sq.get_square_int() - 9) as usize]);
                }
            }
            if sq.get_square_int()%8 < 7 {
                if board.table[(sq.get_square_int() - 7) as usize].get_piece() == Piece::BPAWN {
                    occupiers.push(board.table[(sq.get_square_int() - 7) as usize]);
                }
            }
            // check if white knight can capture in this square
            if sq.get_square_int()/8 > 1 && sq.get_square_int()%8 > 0 {
                if board.table[(sq.get_square_int() -1 -8 -8) as usize].get_piece() == Piece::BKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() -1 -8 -8) as usize]);
                }
            }
            if sq.get_square_int()/8 > 0 && sq.get_square_int()%8 > 1 {
                if board.table[(sq.get_square_int() -2 -8) as usize].get_piece() == Piece::BKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() -2 -8) as usize]);
                }
            }
            if sq.get_square_int()/8 > 1 && sq.get_square_int()%8 < 7 {
                if board.table[(sq.get_square_int() +1 -8 -8) as usize].get_piece() == Piece::BKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() +1 -8 -8) as usize]);
                }
            }
            if sq.get_square_int()/8 > 0 && sq.get_square_int()%8 < 6 {
                if board.table[(sq.get_square_int() +2 -8) as usize].get_piece() == Piece::BKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() +2 -8) as usize]);
                }
            }

            if sq.get_square_int()/8 < 6 && sq.get_square_int()%8 > 0 {
                if board.table[(sq.get_square_int() -1 +8 +8) as usize].get_piece() == Piece::BKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() -1 +8 +8) as usize]);
                }
            }
            if sq.get_square_int()/8 < 7 && sq.get_square_int()%8 > 1 {
                if board.table[(sq.get_square_int() -2 +8) as usize].get_piece() == Piece::BKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() -2 +8) as usize]);
                }
            }
            if sq.get_square_int()/8 < 6 && sq.get_square_int()%8 < 7 {
                if board.table[(sq.get_square_int() +1 +8 +8) as usize].get_piece() == Piece::BKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() +1 +8 +8) as usize]);
                }
            }
            if sq.get_square_int()/8 < 7 && sq.get_square_int()%8 < 6 {
                if board.table[(sq.get_square_int() +2 +8) as usize].get_piece() == Piece::BKNIGHT {
                    occupiers.push(board.table[(sq.get_square_int() +2 +8) as usize]);
                }
            }

            // check if white bishop/queen occupie square on diag
            let tl = if sq.get_square_int()/8 > sq.get_square_int()%8 { sq.get_square_int()%8 } else { sq.get_square_int()/8 };
            let sqtl = sq.get_square_int() - tl - (tl*8);
            let br = if (8 - 1 - sq.get_square_int()/8) > (8 - 1 - sq.get_square_int()%8) { sq.get_square_int()%8 } else { sq.get_square_int()/8 };
            let sqbr = sq.get_square_int() + br + (br*8);
            
            let vec = draw_ray(sqtl, sqbr);

            for square in vec {
                if square != sq.get_square_int() {
                    if board.table[square as usize].piece == Piece::BBISHOP || board.table[square as usize].piece == Piece::BQUEEN {
                        let new_vec = draw_ray(sq.get_square_int(), square);
                        let mut t = false;
                        for _square in new_vec {
                            if _square != sq.get_square_int() && _square != square && board.table[_square as usize].piece != Piece::Empty {
                                t = true;
                            }
                            if !t {occupiers.push(board.table[_square as usize]);}
                        }
                    }
                }
            }
            
            let tr = if sq.get_square_int()/8 > (8 - 1 - sq.get_square_int()%8) { sq.get_square_int()%8 } else { sq.get_square_int()/8 };
            let sqtr = sq.get_square_int() + tr - (tr*8);
            let bl = if (8 - 1 - sq.get_square_int()/8) > sq.get_square_int()%8 { sq.get_square_int()%8 } else { sq.get_square_int()/8 };
            let sqbl = sq.get_square_int() - bl + (bl*8);
            let vec = draw_ray(sqtr, sqbl);

            for square in vec {
                if square != sq.get_square_int() {
                    if board.table[square as usize].piece == Piece::BBISHOP || board.table[square as usize].piece == Piece::BQUEEN {
                        let new_vec = draw_ray(sq.get_square_int(), square);
                        let mut t = false;
                        for _square in new_vec {
                            if _square != sq.get_square_int() && _square != square && board.table[_square as usize].piece != Piece::Empty {
                                t = true;
                            }
                            if !t {occupiers.push(board.table[_square as usize]);}
                        }
                    }
                }
            }

            // check if white rook/queen occupie square 
            let sqt = sq.get_square_int()%8;
            let sqb = sq.get_square_int()%8 + 8 * 7;

            let vec = draw_ray(sqt, sqb);

            for square in vec {
                if square != sq.get_square_int() {
                    if board.table[square as usize].piece == Piece::BROOK || board.table[square as usize].piece == Piece::BQUEEN {
                        let new_vec = draw_ray(sq.get_square_int(), square);
                        let mut t = false;
                        for _square in new_vec {
                            if _square != sq.get_square_int() && _square != square && board.table[_square as usize].piece != Piece::Empty {
                                t = true;
                            }
                            if !t {occupiers.push(board.table[_square as usize]);}
                        }
                    }
                }
            }

            let sql = 8*(sq.get_square_int()/8);
            let sqr = 8*(sq.get_square_int()/8) + 8;

            let vec = draw_ray(sql, sqr);
            for square in vec {
                if square != sq.get_square_int() {
                    if board.table[square as usize].piece == Piece::BROOK || board.table[square as usize].piece == Piece::BQUEEN {
                        let new_vec = draw_ray(sq.get_square_int(), square);
                        let mut t = false;
                        for _square in new_vec {
                            if _square != sq.get_square_int() && _square != square && board.table[_square as usize].piece != Piece::Empty {
                                t = true;
                            }
                            if !t {occupiers.push(board.table[_square as usize]);}
                        }
                    }
                }
            }

            let mut vec = Vec::new();
            // check if white king occupies square
            if sq.get_square_int()%8 > 0 {
                vec.push(sq.get_square_int()-1);

                if sq.get_square_int()/8 > 0 {
                    vec.push(sq.get_square_int()-8);
                    vec.push(sq.get_square_int()-1-8);
                }
                if sq.get_square_int()/8 < 7 {
                    vec.push(sq.get_square_int()+8);
                    vec.push(sq.get_square_int()-1+8);
                }
            } 
            if sq.get_square_int()%8 < 7 {
                vec.push(sq.get_square_int()+1);
                if sq.get_square_int()/8 > 0 {
                    vec.push(sq.get_square_int()-8);
                    vec.push(sq.get_square_int()+1-8);
                }
                if sq.get_square_int()/8 < 7 {
                    vec.push(sq.get_square_int()+8);
                    vec.push(sq.get_square_int()+1+8);
                }
            }
            vec.sort();
            vec.dedup();
            for square in vec {
                if board.table[square as usize].get_piece() == Piece::WKING {
                    occupiers.push(board.table[square as usize]);
                }
            }
        }
        occupiers
    }

    fn get_piece_default_permitterd_squares(&self, piece: &Piece) -> Vec<u8> {
        assert!(piece.piece != Piece::Empty);
        let mut vec = Vec::new();
        match piece.piece {
            Piece::BPAWN => {
                let start_rank = 8..16;
                if start_rank.contains(&piece.square.get_square_int()) {
                    vec.push(piece.square.get_square_int() + 8 + 8);
                }
                if piece.get_file_square() > 0 {
                    vec.push(piece.square.get_square_int() + 7);
                }
                if piece.get_file_square() < 7 {
                    vec.push(piece.square.get_square_int() + 9);
                }
                vec.push(piece.square.get_square_int() + 8);
                vec
            },
            Piece::BKNIGHT => {
                if piece.get_rank_square() > 1 && piece.get_file_square() > 0 {
                        vec.push(piece.square.get_square_int() -1 -8 -8)
                }
                if piece.get_rank_square() > 0 && piece.get_file_square() > 1 {
                    vec.push(piece.square.get_square_int() -2 -8)
                }
                if piece.get_rank_square() > 1 && piece.get_file_square() < 7 {
                    vec.push(piece.square.get_square_int() +1 -8 -8)
                }
                if piece.get_rank_square() > 0 && piece.get_file_square() < 6 {
                    vec.push(piece.square.get_square_int() +2 -8)
                }

                if piece.get_rank_square() < 6 && piece.get_file_square() > 0 {
                    vec.push(piece.square.get_square_int() -1 +8 +8)
                }
                if piece.get_rank_square() < 7 && piece.get_file_square() > 1 {
                    vec.push(piece.square.get_square_int() -2 +8)
                }
                if piece.get_rank_square() < 6 && piece.get_file_square() < 7 {
                    vec.push(piece.square.get_square_int() +1 +8 +8)
                }
                if piece.get_rank_square() < 7 && piece.get_file_square() < 6 {
                    vec.push(piece.square.get_square_int() +2 +8)
                }
                vec
            },
            Piece::BBISHOP => {
                let tl = if piece.get_rank_square() > piece.get_file_square() { piece.get_file_square() } else { piece.get_rank_square() };
                let sqtl = piece.square.get_square_int() - tl - (tl*8);
                let br = if (8 - 1 - piece.get_rank_square()) > (8 - 1 - piece.get_file_square()) { 8 - 1 - piece.get_file_square() } else { 8 - 1 - piece.get_rank_square() };
                let sqbr = piece.square.get_square_int() + br + (br*8);

                let mut vec = draw_ray(sqtl, sqbr);

                let tr = if piece.get_rank_square() > (8 - 1 - piece.get_file_square()) { 8 - 1 - piece.get_file_square() } else { piece.get_rank_square() };
                let sqtr = piece.square.get_square_int() + tr - (tr*8);
                let bl = if (8 - 1 - piece.get_rank_square()) > piece.get_file_square() { piece.get_file_square() } else { 8 - 1 - piece.get_rank_square() };
                let sqbl = piece.square.get_square_int() - bl + (bl*8);
                vec.extend(draw_ray(sqtr, sqbl));
                
                vec.sort();
                vec.dedup();
                vec
            },
            Piece::BROOK => {
                let sqt = piece.square.get_square_int()%8;
                let sqb = piece.square.get_square_int()%8 + 8 * 7;

                let mut vec = draw_ray(sqt, sqb);

                let sql = piece.get_rank_square() * 8;
                let sqr = piece.get_rank_square()*8 + 7;

                vec.extend(draw_ray(sql, sqr));

                vec
            },
            Piece::BQUEEN => {
                let tl = if piece.get_rank_square() > piece.get_file_square() { piece.get_file_square() } else { piece.get_rank_square() };
                let sqtl = piece.square.get_square_int() - tl - (tl*8);
                let br = if (8 - 1 - piece.get_rank_square()) > (8 - 1 - piece.get_file_square()) { 8 - 1 - piece.get_file_square() } else { 8 - 1 - piece.get_rank_square() };
                let sqbr = piece.square.get_square_int() + br + (br*8);

                let mut vec = draw_ray(sqtl, sqbr);

                let tr = if piece.get_rank_square() > (8 - 1 - piece.get_file_square()) { 8 - 1 - piece.get_file_square() } else { piece.get_rank_square() };
                let sqtr = piece.square.get_square_int() + tr - (tr*8);
                let bl = if (8 - 1 - piece.get_rank_square()) > piece.get_file_square() { piece.get_file_square() } else { 8 - 1 - piece.get_rank_square() };
                let sqbl = piece.square.get_square_int() - bl + (bl*8);
                vec.extend(draw_ray(sqtr, sqbl));

                let sqt = piece.square.get_square_int()%8;
                let sqb = piece.square.get_square_int()%8 + 8 * 7;

                vec.extend(draw_ray(sqt, sqb));

                let sql = piece.get_rank_square() * 8;
                let sqr = piece.get_rank_square()*8 + 7;

                vec.extend(draw_ray(sql, sqr));
                vec.sort();
                vec.dedup();
                vec
            },
            Piece::BKING => {
                if piece.get_file_square() > 0 {
                    vec.push(piece.square.get_square_int()-1);

                    if piece.get_rank_square() > 0 {
                        vec.push(piece.square.get_square_int()-8);
                        vec.push(piece.square.get_square_int()-1-8);
                    }
                    if piece.get_rank_square() < 7 {
                        vec.push(piece.square.get_square_int()+8);
                        vec.push(piece.square.get_square_int()-1+8);
                    }
                } 
                if piece.get_file_square() < 7 {
                    vec.push(piece.square.get_square_int()+1);
                    if piece.get_rank_square() > 0 {
                        vec.push(piece.square.get_square_int()-8);
                        vec.push(piece.square.get_square_int()+1-8);
                    }
                    if piece.get_rank_square() < 7 {
                        vec.push(piece.square.get_square_int()+8);
                        vec.push(piece.square.get_square_int()+1+8);
                    }
                }
                vec.sort();
                vec.dedup();
                vec
            },
            Piece::WPAWN => {
                let start_rank = 48..56;
                if start_rank.contains(&piece.square.get_square_int()) {
                    vec.push(piece.square.get_square_int() - 8 - 8);
                }
                if piece.get_file_square() > 0 {
                    vec.push(piece.square.get_square_int() - 9);
                }
                if piece.get_file_square() < 7 {
                    vec.push(piece.square.get_square_int() - 7);
                }
                vec.push(piece.square.get_square_int() - 8);
                vec
            },
            Piece::WKNIGHT => {
                if piece.get_rank_square() > 1 && piece.get_file_square() > 0 {
                    vec.push(piece.square.get_square_int() -1 -8 -8)
                }
                if piece.get_rank_square() > 0 && piece.get_file_square() > 1 {
                    vec.push(piece.square.get_square_int() -2 -8)
                }
                if piece.get_rank_square() > 1 && piece.get_file_square() < 7 {
                    vec.push(piece.square.get_square_int() +1 -8 -8)
                }
                if piece.get_rank_square() > 0 && piece.get_file_square() < 6 {
                    vec.push(piece.square.get_square_int() +2 -8)
                }

                if piece.get_rank_square() < 6 && piece.get_file_square() > 0 {
                    vec.push(piece.square.get_square_int() -1 +8 +8)
                }
                if piece.get_rank_square() < 7 && piece.get_file_square() > 1 {
                    vec.push(piece.square.get_square_int() -2 +8)
                }
                if piece.get_rank_square() < 6 && piece.get_file_square() < 7 {
                    vec.push(piece.square.get_square_int() +1 +8 +8)
                }
                if piece.get_rank_square() < 7 && piece.get_file_square() < 6 {
                    vec.push(piece.square.get_square_int() +2 +8)
                }
                vec
            },
            Piece::WBISHOP => {
                let tl = if piece.get_rank_square() > piece.get_file_square() { piece.get_file_square() } else { piece.get_rank_square() };
                let sqtl = piece.square.get_square_int() - tl - (tl*8);
                let br = if (8 - 1 - piece.get_rank_square()) > (8 - 1 - piece.get_file_square()) { 8 - 1 - piece.get_file_square() } else { 8 - 1 - piece.get_rank_square() };
                let sqbr = piece.square.get_square_int() + br + (br*8);
                println!("bishop.. {:?}, {:?}", br, sqbr);
                let mut vec = draw_ray(sqtl, sqbr);

                let tr = if piece.get_rank_square() > (8 - 1 - piece.get_file_square()) { 8 - 1 - piece.get_file_square() } else { piece.get_rank_square() };
                let sqtr = piece.square.get_square_int() + tr - (tr*8);
                let bl = if (8 - 1 - piece.get_rank_square()) > piece.get_file_square() { piece.get_file_square() } else { 8 - 1 - piece.get_rank_square() };
                let sqbl = piece.square.get_square_int() - bl + (bl*8);
                vec.extend(draw_ray(sqtr, sqbl));
                
                vec.sort();
                vec.dedup();
                vec
            },
            Piece::WROOK => {
                let sqt = piece.square.get_square_int()%8;
                let sqb = piece.square.get_square_int()%8 + 8 * 7;

                let mut vec = draw_ray(sqt, sqb);

                let sql = piece.get_rank_square() * 8;
                let sqr = piece.get_rank_square()*8 + 7;

                vec.extend(draw_ray(sql, sqr));

                vec
            },
            Piece::WQUEEN => {
                let tl = if piece.get_rank_square() > piece.get_file_square() { piece.get_file_square() } else { piece.get_rank_square() };
                let sqtl = piece.square.get_square_int() - tl - (tl*8);
                let br = if (8 - 1 - piece.get_rank_square()) > (8 - 1 - piece.get_file_square()) { 8 - 1 - piece.get_file_square() } else { 8 - 1 - piece.get_rank_square() };
                let sqbr = piece.square.get_square_int() + br + (br*8);

                let mut vec = draw_ray(sqtl, sqbr);

                let tr = if piece.get_rank_square() > (8 - 1 - piece.get_file_square()) { 8 - 1 - piece.get_file_square() } else { piece.get_rank_square() };
                let sqtr = piece.square.get_square_int() + tr - (tr*8);
                let bl = if (8 - 1 - piece.get_rank_square()) > piece.get_file_square() { piece.get_file_square() } else { 8 - 1 - piece.get_rank_square() };
                let sqbl = piece.square.get_square_int() - bl + (bl*8);
                vec.extend(draw_ray(sqtr, sqbl));

                let sqt = piece.square.get_square_int()%8;
                let sqb = piece.square.get_square_int()%8 + 8 * 7;

                vec.extend(draw_ray(sqt, sqb));

                let sql = piece.get_rank_square() * 8;
                let sqr = piece.get_rank_square()*8 + 7;

                vec.extend(draw_ray(sql, sqr));
                vec.sort();
                vec.dedup();
                vec
            },
            Piece::WKING => {
                if piece.get_file_square() > 0 {
                    vec.push(piece.square.get_square_int()-1);

                    if piece.get_rank_square() > 0 {
                        vec.push(piece.square.get_square_int()-8);
                        vec.push(piece.square.get_square_int()-1-8);
                    }
                    if piece.get_rank_square() < 7 {
                        vec.push(piece.square.get_square_int()+8);
                        vec.push(piece.square.get_square_int()-1+8);
                    }
                } 
                if piece.get_file_square() < 7 {
                    vec.push(piece.square.get_square_int()+1);
                    if piece.get_rank_square() > 0 {
                        vec.push(piece.square.get_square_int()-8);
                        vec.push(piece.square.get_square_int()+1-8);
                    }
                    if piece.get_rank_square() < 7 {
                        vec.push(piece.square.get_square_int()+8);
                        vec.push(piece.square.get_square_int()+1+8);
                    }
                }
                vec.sort();
                vec.dedup();
                vec
            },
            _ => vec
        }
    }
}