mod chess_core;
use chess_core::game;

#[derive(Debug)]
struct Test(u8);

fn main() {
    let mut game = game::Game::new(0);
    //game.test_play();
    game.test_play();
}