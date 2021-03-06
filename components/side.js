import { Avatar, Grid, Paper, Typography } from "@material-ui/core"
import Timer from "./timer";

const Side = ({ side, timeRemaining, userName }) => {
    return <Grid container
        direction="row"
        justify="space-around"
        alignItems="center"
        spacing={2}
        >
            <Grid item  md={3}>
                <Avatar variant="square" />
            </Grid>
            <Grid item  md={5}>
                <Typography variant='caption'>{userName? userName: "Guest"}</Typography>
            </Grid>

            <Grid item md={4}>
                <Timer timeRemaining={timeRemaining} />
            </Grid>
        </Grid>
}

export default Side;