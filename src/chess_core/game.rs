use super::board::{Board};
use super::square::Square;
use std::io::{self, BufRead};

#[derive(PartialEq, Clone, Copy)]
enum Winner {
    NONE,
    WHITE,
    BLACK,
    STALEMATE,
    DRAW
}

pub struct Game {
    game_type: u8,
    is_clock: bool,
    clock: f64,
    board: Board,
    winner: Winner,

}

// const SQUARES_CHARS: &str = "ABCDEFGH";


pub struct CLI;

impl CLI {

    pub fn get_command(&self) -> (u8, u8) {
        self.command_to_chess_move(self._get_command())
    }
    fn _get_command(&self) -> String {
        let stdin = io::stdin();
        let line1 = stdin.lock().lines().next().unwrap().unwrap();
        line1
    }
    fn command_to_chess_move(&self, cmd: String) -> (u8, u8) {
        let split = cmd.trim().split(' ');
        let vec = split.collect::<Vec<&str>>();
        let mut sq1 = 64;
        let mut sq2 = 64;
        if vec.len() == 2 {
            let char_vec: Vec<char> = vec[0].chars().collect();
            let file = CLI.resolve_file(&char_vec[0]);
            let rank = CLI.resolve_rank(&char_vec[1]);
            sq1 = rank*8+file;

            let char_vec: Vec<char> = vec[1].chars().collect();
            let file = CLI.resolve_file(&char_vec[0]);
            let rank = CLI.resolve_rank(&char_vec[1]);
            sq2 = rank*8+file;
        }       

        (sq1, sq2)
        
    }

    fn resolve_file(&self, c:&char) -> u8 {
        match c {
            'A' => 0,
            'B' => 1,
            'C' => 2,
            'D' => 3,
            'E' => 4,
            'F' => 5,
            'G' => 6,
            'H' => 7,
            _ => 64
        }        
    }
    fn resolve_rank(&self, c:&char) -> u8 {
        match c {
            '8' => 0,
            '7' => 1,
            '6' => 2,
            '5' => 3,
            '4' => 4,
            '3' => 5,
            '2' => 6,
            '1' => 7,
            _ => 64
        }        
    }

    pub fn print_board(&self, board: [u8; 64]) {
        let mut c = 0;
        for &i in board.iter() {
            if c %8 == 0 {print!("\n")}
            print!("{:>4}, ", i);
            c+=1;
        }

        println!();
        
    }
}

impl Game {
    pub fn new(game_type: u8) -> Self {
        Self {game_type, is_clock: false, clock: 0., board: Board::new(), winner: Winner::NONE}
    }

    fn init(&mut self) {
        self.board.initialize_classic_start_board();
    }

    pub fn test_checkmate (&mut self) {
        self.init();
        self.board.move_piece(self.board.table[Square::E2.get_square_int() as usize], Square::E4, 0);
        self.board.switch_turn();
        self.board.move_piece(self.board.table[Square::F7.get_square_int() as usize], Square::F5, 0);
        self.board.switch_turn();
        self.board.move_piece(self.board.table[Square::D1.get_square_int() as usize], Square::H5, 0);
        self.board.switch_turn();
        self.board.move_piece(self.board.table[Square::G7.get_square_int() as usize], Square::G6, 0);
        self.board.switch_turn();
        self.board.move_piece(self.board.table[Square::F1.get_square_int() as usize], Square::E2, 0);
        self.board.switch_turn();
        self.board.move_piece(self.board.table[Square::G6.get_square_int() as usize], Square::H5, 0);
        self.board.switch_turn();
        self.board.move_piece(self.board.table[Square::E2.get_square_int() as usize], Square::H5, 0);
        self.board.switch_turn();
        CLI.print_board(self.board.bitboard);
        println!("{} turn now..", if self.board.turn {"Black"} else {"White"} );
        if self.board.is_incheck() {
            println!("{} King in Check!", if self.board.turn {"Black"} else {"White"});
        }
        if self.board.is_checkmate() {
            println!("yay")
        } else { 
            println!("nay");
         }


    }

    fn _play (&mut self) -> Winner {
        self.init();
        while self.winner == Winner::NONE {
            CLI.print_board(self.board.bitboard);
            println!("{} turn now..", if self.board.turn {"Black"} else {"White"} );
            println!("Enter command ex 'F2 F4'");
            let cmd = CLI.get_command();
            println!("You've enter: {:?}", cmd);
            println!("");
            if self.board.move_piece(self.board.table[cmd.0 as usize], Square::new(cmd.1), 0) {
                self.board.switch_turn();
            };
            if self.board.is_checkmate() {
                self.winner = if self.board.turn {Winner::WHITE} else {Winner::BLACK};
                break;
            }
            self.board.print_debug_board_table_squares();
            if self.board.is_stale_mate() {
                self.winner = Winner::STALEMATE;
                break;
            }
            if self.board.is_draw() {
                self.winner = Winner::DRAW;
                break;
            }
            if self.board.is_incheck() {
                println!("{} King in Check!", if self.board.turn {"Black"} else {"White"});
            }
        }
        self.winner
    }

    pub fn test_play(&mut self) {
        let state = self._play();
        match state {
            Winner::WHITE => println!("White won the game!"),
            Winner::BLACK => println!("Black won the game!"),
            Winner::DRAW => println!("It a Draw!"),
            Winner::STALEMATE => println!("It was a stalemate!"),
            _ => println!("something went wrong")

        }
    }
}