


const rust = import("../pkg/chess_0x539");

const promiesChess = rust.then((m) => new m.GameWasmClient());

export default promiesChess