

import { _404 } from "../404";
import Challenge from "../pages/challenge";

export const paths = [
    
    { path:"/challenge", component: Challenge },
    { path:"/", component: Challenge },

]

export const error = [
    { code:"404", component: _404 }
]