import { CircularProgress, Container, Grid } from "@material-ui/core"
import Side from "./side"

import { makeStyles } from '@material-ui/core/styles';
import LargeButton from "./largebutton";

import {ReactComponent as SvgPlay} from "../themes/svgs/chess2.svg"
import IniteImage from "../themes/svgs/handshake.png"
import ResignImage from "../themes/svgs/flag.png"
import AgreementImage from "../themes/svgs/agreement.png"
import Exit from '@material-ui/icons/ExitToApp'

import AdTest from "../themes/GoogleAd.jpg"
import { Fragment, useState } from "react";

const useStyle = makeStyles((theme) => ({
    root: {
        paddingTop: 20,
        paddingBottom: 20,
    }
}));

const RightSideBar = ({cancelPlay, idraw_offered, draw_offered, declineDraw, isQueuing, isPlaying, startPlaying, startInvite, resign, offerDraw, timeRemaining, userName}) => {


    const classes = useStyle();
    return <Container className={classes.root}>
            <Grid container direction="column-reverse"
            justify="flex-start"
            alignItems="stretch"
            spacing={3}>
                <Grid item xs={8}>
                    <Side side={false} timeRemaining={timeRemaining} userName={userName} />
                </Grid>
                <Grid item>
                    <img src={AdTest} height={220} />
                </Grid>{isPlaying?<Fragment>
                <Grid item xs={12}>
                    <LargeButton fullWidth onClick={resign} placeHolder={"Resign"} color={"primary"} Icon={<img src={ResignImage} />} />
                </Grid>
                <Grid item xs={12}>
                    {draw_offered?<Grid container direction="row"
            justify="space-between"
            alignItems="flex-start"><Grid item><LargeButton onClick={offerDraw} placeHolder={"Accept Draw"} color={"secondary"} Icon={<img src={AgreementImage} />} /></Grid><Grid item><LargeButton onClick={declineDraw} placeHolder={"Decline Draw"} color={"disabled"} Icon={<Exit />} /></Grid></Grid>:<LargeButton disable={idraw_offered} fullWidth onClick={offerDraw} placeHolder={"Offer Draw"} color={"secondary"} Icon={<img src={AgreementImage} />} />}
                </Grid>
            </Fragment>
            :isQueuing?<Grid container style={{height: 400}} height={"400"} direction="column"
            justify="center"
            alignItems="center"
            wrap="nowrap" item xs={12}>
                <Grid item xs={1}>
                    <CircularProgress/>
                </Grid>
                <Grid item xs={4}>
                    <LargeButton fullWidth onClick={cancelPlay} placeHolder={"Cancel"} color={"disabled"} Icon={<Exit/>} />
                </Grid>
            </Grid>:<Fragment>
                <Grid item xs={12}>
                    <LargeButton fullWidth onClick={startInvite} placeHolder={"Invite"} color={"primary"} Icon={<img src={IniteImage} />} />
                </Grid>
                <Grid item xs={12}>
                    <LargeButton fullWidth onClick={startPlaying} placeHolder={"Play"} color={"secondary"} Icon={<SvgPlay/>} />
                </Grid>
                </Fragment>
            }
            </Grid>
            
        </Container>
}

export default RightSideBar;