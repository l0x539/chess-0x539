import { Container, Grid, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";

const board = [11, 9, 10, 12, 13, 10, 9, 11, 8, 8, 8, 8, 8, 8, 8, 8, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 4, 5, 2, 1, 3]


const useStyle = makeStyles((theme) => ({
    container: {
        marginTop: 40,
        paddingTop: 40,
        [theme.breakpoints.down('sm')]: {
            marginTop: 30,
        }
    },
    paper: {
        width: "100%",
        height: 400,
        backgroundColor: "#FCF5E5"
    }
}));

const ComingSoon = () => {
    const classes = useStyle();
    return <div className={classes.container}>
        <Container>
            <Grid container
            direction="row"
            justify="space-between"
            >
                <Grid item xs={12} md={2}>
                </Grid>
                <Grid item xs={12} md={5}>
                    <div className={classes.paper}>
                        <div className={classes.container}>
                        <Typography variant="h1">
                        Coming Soon..
                        </Typography>

                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                </Grid>
            </Grid>
        </Container>
        </div>
}

export default ComingSoon;