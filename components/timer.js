import { Typography, Paper } from "@material-ui/core"

import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
    paper: {
        width: 58,
        height: 30,
        paddingTop: 4
    }
}));

const Timer = ({timeRemaining}) => {
    const classes = useStyle();
    return <Paper elevation={3} className={classes.paper}>
        <Typography align="center" >{timeRemaining>0?Math.floor(timeRemaining/60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  }):"00"}:{timeRemaining>0?Math.floor(timeRemaining%60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  }): "00"}</Typography>
    </Paper>

}

export default Timer;