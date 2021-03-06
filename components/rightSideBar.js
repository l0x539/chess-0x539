import { CircularProgress, Container, Grid } from "@material-ui/core"
import Side from "./side"

import { makeStyles } from '@material-ui/core/styles';
import LargeButton from "./largebutton";

import {ReactComponent as SvgPlay} from "../themes/svgs/chess2.svg"
import IniteImage from "../themes/svgs/handshake.png"
import ResignImage from "../themes/svgs/flag.png"
import AgreementImage from "../themes/svgs/agreement.png"

import AdTest from "../themes/GoogleAd.jpg"
import { Fragment, useState } from "react";

const useStyle = makeStyles((theme) => ({
    root: {
        paddingTop: 20,
        paddingBottom: 20,
    }
}));

const RightSideBar = ({draw_offerer, isQueuing, isPlaying, startPlaying, startInvite, resign, offerDraw, timeRemaining, userName}) => {


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
                    <LargeButton onClick={resign} placeHolder={"Resign"} color={"primary"} Icon={<img src={ResignImage} />} />
                </Grid>
                <Grid item xs={12}>
                    {draw_offerer?<Fragment><LargeButton onClick={offerDraw} placeHolder={"Accept Draw"} color={"secondary"} Icon={<img src={AgreementImage} />} /><LargeButton onClick={offerDraw} placeHolder={"Accept Draw"} color={"secondary"} Icon={<img src={AgreementImage} />} /></Fragment>:<LargeButton onClick={offerDraw} placeHolder={"Offer Draw"} color={"secondary"} Icon={<img src={AgreementImage} />} />}
                </Grid>
            </Fragment>
            :isQueuing?<Grid container style={{height: 400}} height={"400"} direction="row"
            justify="center"
            alignItems="center"
            wrap="nowrap" item xs={12}>
                <Grid item>
                    <CircularProgress/>
                </Grid>
            </Grid>:<Fragment>
                <Grid item xs={12}>
                    <LargeButton onClick={startInvite} placeHolder={"Invite"} color={"primary"} Icon={<img src={IniteImage} />} />
                </Grid>
                <Grid item xs={12}>
                    <LargeButton onClick={startPlaying} placeHolder={"Play"} color={"secondary"} Icon={<SvgPlay/>} />
                </Grid>
                </Fragment>
            }
            </Grid>
            
        </Container>
}

export default RightSideBar;