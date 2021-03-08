import BoardHolderExplorer from "../components/boardHolderExplorer";
import { Container, Grid, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import GameInfoModal from "../components/gameInfoModal";
import { useState } from "react";



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
        height: "100%",
        backgroundColor: "#FCF5E5"
    }
}));

const Explorer = () => {
    const classes = useStyle();
    const [ismodal, setIsmodal] = useState(true)
    return <div className={classes.container}>
        <Container>
            <Grid container
            container
            direction="row"
            justify="space-between"
            >
                <GameInfoModal isopen={ismodal} closeModal={() => {setIsmodal(false)}} Title={"Explorer"} Description={"Coming Soon!"} />
                <Grid item xs={12} md={2}>
                    <Paper className={classes.paper}>
                        
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <div>
                        <div className="app-game-holder">
                        <BoardHolderExplorer board={board} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className={classes.paper}>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        </div>
}

export default Explorer;