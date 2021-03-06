import { Component } from "react";

class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render () {
        return <div className={"sidebar"}>
            <div className={"sidebutton"}><span>Home</span></div>
            <div className={"sidebutton"}><span>Play</span></div>
            <div className={"sidebutton"}><span>Settings</span></div>
            
        </div>
    }
}