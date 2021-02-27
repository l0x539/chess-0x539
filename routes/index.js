

import { _404 } from "../404";
import BoardTest from "../pages/board_test";
import Challenge from "../pages/challenge";

export const paths = [
    
    { path:"/challenge", component: Challenge },
    { path:"/", component: BoardTest },

]

export const error = [
    { code:"404", component: _404 }
]