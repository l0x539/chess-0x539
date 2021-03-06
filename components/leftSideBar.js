import { Container, Grid } from "@material-ui/core"
import Side from "./side"

import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
    root: {
        paddingTop: 20,
        paddingBottom: 20,
    }
}));

const LeftSideBar = ({timeRemaining, userName}) => {
    const classes = useStyle();
    return <Container className={classes.root}>
            <Grid container direction="column"
            justify="flex-start"
            alignItems="flex-end"
            spacing={3}>
                <Grid item>
                    <Side side={false} timeRemaining={timeRemaining} userName={userName} />
                </Grid>
            </Grid>
        </Container>
}

export default LeftSideBar;