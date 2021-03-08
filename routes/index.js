

import { _404 } from "../404";
import Challenge from "../pages/challenge";
import Test from "../pages/board_test";
import Main from "../pages/main";
import ComingSoon from "../pages/comming_soon";
import Explorer from "../pages/explorer";

export const paths = [
    { path:"/explorer", component: Explorer },
    { path:"/community", component: Explorer },
    { path:"/challenge", component: Challenge },
    { path:"/test", component: Test },
    { path:"/:invite", component: Main },
    { path:"/", component: Main },

]

export const error = [
    { code:"404", component: _404 }
]