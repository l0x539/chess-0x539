import { Fragment } from "react"

export const Overlay = ({side, overlay_position, board_height, board_width, className, updateBoard, square, square_to_go}) => {
    const _updateBoard = () => {
        if (side === "black") {
            const _arr = [...Array(64).keys()].reverse()
            square = _arr[square]
            square_to_go = _arr[square_to_go]
        }
        updateBoard(square, square_to_go)
    }
    return <Fragment>
            <div className={className} style={{transform: "translate("+(overlay_position.x + (className==="dot"?((board_height/8) - ((board_height/8)/2)-(((board_height/8)/3)/2)):0)) +"px, "+(overlay_position.y + (className==="dot"?((board_width/8)-((board_width/8)/2)-(((board_width/8)/3)/2)):0))+"px)", height: className==="dot"?(board_height/8)/3:board_height/8, width: className==="dot"?(board_width/8)/3:board_width/8}}></div>
            {className==="dot"?<div className={"transparent"} onClick={_updateBoard} style={{transform: "translate("+overlay_position.x +"px, "+overlay_position.y +"px)", height: board_height/8, width: board_width/8}}></div>:""}
        </Fragment>
}