import { Container, Grid, Paper } from "@material-ui/core"
import { withStyles } from "@material-ui/styles";
import Board from "../components/board";
import LeftSideBar from "../components/leftSideBar";
import RightSideBar from "../components/rightSideBar";
import GameInfoModal from "../components/gameInfoModal";
import { searchQueue, updateGame, searchGame, createQueue, getMe, getGuest, getUser, createInvite, findInvite } from "../utils/apiStrapi";
import PropTypes from 'prop-types';
import { Component } from "react";
import GameWasmClient from "../chess-core/chess";

var _ = require('lodash');

const styles = (theme) => ({
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
});

class Main extends Component {
    constructor(props) {
        super(props)
        const { match: { params } } = props;
        this.state = {
            GameWasmEngine: null,
            isQueuing: false,
            date: new Date(),
            queue: {},
            game: {},
            user: {},
            durationGame: 15*60,
            oponent: false,
            isPlaying: false,
            isStarted: false,
            startSide: null,
            promote: 0,
            status: [0,0,0,0],
            board: [11, 9, 10, 12, 13, 10, 9, 11, 8, 8, 8, 8, 8, 8, 8, 8, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 4, 5, 2, 1, 3],
            suggestWin: null,
            invite: params.invite,
            modal: {
                isopen: false,
                title: "",
                description: ""
            }
        }
    }

    async componentDidMount() {
        const { match: { params } } = this.props;
        this.timerID = setInterval(
          () => this.tick(),
          1000
        );
        const me = await getMe(window.localStorage?.token)
        if (!me.error) {
            this.setState({user: {isUser: true, ...me}})
        } else {
            this.setState({user: {isUser: false, ...(JSON.parse(window.localStorage.guest))}})
        }

        if (params.invite && !this.state.game.isPlaying) {
            const queues = await findInvite(params.invite);
            if (queues.length > 0) {
                this.setState({queue: queues[0]})
                const game = await searchGame(queues[0].game_id)
                const joinedGame = await updateGame(game.id, {user_id: this.state.user.id, isUser: this.state.user.isUser, token: this.state.user.token})
                this.setState({game: joinedGame})
                this.setState({isPlaying: joinedGame.isPlaying})
                this.setState({startSide: this.state.user.id===joinedGame.black_id?"black":"white"})

            }
        }

        await GameWasmClient.then((GameWasmClient) => {
            this.setState({ GameWasmEngine: GameWasmClient })
            this.setState({ board: GameWasmClient.get_board() })
            this.setState({ status: this.state.status })
        })

    }

    updateBoardManually = async (square, square_to_go) => {
        if (this.state.isPlaying) {
            if ((this.state.startSide === "black") === this.state.GameWasmEngine.get_side()) {
                const game = await updateGame(this.state.game.id, {token: this.state.user.token, suggested_move: JSON.stringify([square, square_to_go])})
                await GameWasmClient.then((GameWasmClient) => {
                    const status = this.state.GameWasmEngine.update_board(square, square_to_go, this.state.promote);
                    window.status = status
                    this.setState({ status: status  })
                    this.setState({ GameWasmEngine: GameWasmClient })
                    this.setState({ board: GameWasmClient.get_board() })
                })
                if (!this.state.isStarted) this.startGame();
            }
        }
        
        //this.setState({ board: this.state.GameWasmClient.get_board()  })
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    startGame = async () => {
        const joinedGame = await updateGame(this.state.game.id, {token: this.state.user.token, isStarting: true, start_time: new Date()})
        this.setState({isStarted: true})
    }

    openModal = (title, description) => {
        this.setState({modal: {
            isopen: true,
            title: title,
            description: description
        }})
    }
    closeModal = () => {
        this.setState({modal: {
            isopen: false,
            title: "",
            description: ""
        }})
    }

    async tick() {
        this.setState({
          date: new Date()
        });

        if (this.state.isInvite) {
            this.openModal("Invite a friend", "Link: http://localhost:9000/" + this.state.queue.link)
            this.setState({isInvite: false})
        }

        if (this.state.modal && this.state.modal.title === "Invite a friend" && this.state.isPlaying) {
            this.closeModal();
        }

        if (this.state.status[2] === 1) {
            // checkmate
            this.setState({suggestWin: "checkmate"})
            await updateGame(this.state.game.id, {token: this.state.user.token, suggest_win: "checkmate"})

            this.openModal("CheckMate", !this.state.status[0]?"Black" + " won": "White" + " won")
            this.reset()
            

        } else if (this.state.status[2] === 2) {
            // stalemate
            this.setState({suggestWin: "stalemate"})
            await updateGame(this.state.game.id, {token: this.state.user.token, suggest_win: "stalemate"})
            this.openModal("StaleMate", "Draw by stalemate")
            this.reset()
            
        } else if (this.state.status[2] === 3) {
            // draw
            this.setState({suggestWin: "draw"})
            await updateGame(this.state.game.id, {token: this.state.user.token, suggest_win: "draw"})
            this.openModal("Draw", "Game was drawn")
            this.reset()
            
        }
        
        if (this.state.queue.game_id){
            const game = await searchGame(this.state.queue.game_id)
            if (this.state.isQueuing) {
                this.setState({game})
                if (game.isPlaying) {
                    this.setState({queue: {}})
                    this.setState({isPlaying: true})
                    
                }
            } else if (this.state.invite) {
                this.setState({game})
                if (game.isPlaying) {
                    this.setState({queue: {}})
                    this.setState({isPlaying: true})
                }
            }
            if (this.state.isPlaying) {
                this.setState({isQueuing: false})
                this.setState({game})
            }  
        } else if (this.state.game.id) {
            const game = await searchGame(this.state.game.id);
            if (this.state.game.isStarting) {
                this.setState({isStarted: true})
            }
            if (this.state.isPlaying) {
                this.setState({isQueuing: false})
                this.setState({game})
                this.setState({timeRemaining: this.state.startSide === "black"?this.state.game.black_time_remaining:this.state.game.white_time_remaining})
                this.setState({timeRemainingOpp: this.state.startSide === "black"?this.state.game.white_time_remaining:this.state.game.black_time_remaining})
            }
            if (this.state.game.winner) {
                this.setState({isPlaying: false})
                const title = this.state.game.winner === "black"?"Black Won!":this.state.game.winner === "white"?"White Won!":this.state.game.winner === "draw"?"Draw!":this.state.game.winner === "stalemate"?"StaleMate":this.state.game.winner === "checkmate"?"Checkmate":"";
                const description = this.state.startSide === this.state.game.winner?"Congratulations":this.state.game.winner === "draw"?"game withdraw.":this.state.game.winner === "stalemate"?"no moves left":this.state.game.winner === "checkmate"?"checkmated.":"Better Luck next time.";
                const modal = {
                    title,
                    description,
                    isopen: true,
                }
                this.setState({modal})
                console.log("winner: ", this.state.game.winner)
                this.reset()
            }
            if (!this.state.oponent) {
                if (this.state.game.white_id === this.state.user.id) {
                    if (this.state.game.isBlackUser) {
                        const user = await getUser(this.state.game.black_id)
                        this.setState({oponent: user.username})
                    } else {
                        const guest = await getGuest(this.state.game.black_id)
                        this.setState({oponent: "Guest"+guest.randomNumber})
                    }
                } else if (this.state.game.black_id === this.state.user.id) {
                    if (this.state.game.isWhiteUser) {
                        const user = await getUser(this.state.game.white_id);
                        this.setState({oponent: user.username})
                    } else {
                        const guest = await getGuest(this.state.game.white_id)
                        this.setState({oponent: "Guest"+guest.randomNumber})
                    }
                }
            }
            if (this.state.game.suggested_move) {
                if (this.state.game.approved_move) {
                    if (this.state.game.suggested_move === this.state.game.approved_move) {
                        if (this.state.isPlaying) {
                            await GameWasmClient.then((GameWasmClient) => {
                                const approved_move = JSON.parse(this.state.game.approved_move);
                                const status = this.state.GameWasmEngine.update_board(approved_move[0], approved_move[1], this.state.promote);
                                window.status = status
                                this.setState({ status: status  })
                                this.setState({ GameWasmClient })
                                this.setState({ board: this.state.GameWasmClient.get_board() })
                            })
                        }
                    }
                } 
                if ((this.state.startSide === "black") !== this.state.GameWasmEngine.get_side()) {
                    await GameWasmClient.then(async (GameWasmClient) => {
                        const suggested_move = JSON.parse(this.state.game.suggested_move);
                        const status = this.state.GameWasmEngine.update_board(suggested_move[0], suggested_move[1], this.state.promote);
                        if (status[0] === this.state.status[0]) {
                            await updateGame(this.state.game.id, {token: this.state.user.token, approved_move: JSON.stringify(suggested_move)})
                        }
                    })
                }
            }
        }
    }

    startPlay = async (event) => {
        const queues = await searchQueue(this.state.user.id);
        if (queues.length) {
            const game = await searchGame(queues[0].game_id)
            const joinedGame = await updateGame(game.id, {user_id: this.state.user.id, isUser: this.state.user.isUser, token: this.state.user.token})
            this.setState({game: joinedGame})
            this.setState({isPlaying: joinedGame.isPlaying})
            this.setState({startSide: this.state.user.id===joinedGame.black_id?"black":"white"})
            await GameWasmClient.then((GameWasmClient) => {
                const approved_move = JSON.parse(this.state.game.approved_move);
                const status = this.state.GameWasmEngine.update_board(approved_move[0], approved_move[1], this.state.promote);
                window.status = status
                this.setState({ status: status  })
                this.setState({ GameWasmClient })
                this.setState({ board: this.state.GameWasmClient.get_board() })
            })
        } else {
            const side = this.state.startSide?this.state.startSide: _.sample(['white', 'black'])
            this.setState({startSide: side})
            this.setState({queue: await createQueue({ 
                start_with: side,
                isUser: this.state.user.isUser,
                user_id: this.state.user.id,
                durationGame: this.state.durationGame
                }) 
            });
            this.setState({isQueuing: true})
        }
    }
    startInvite = async (event) => {
        const side = this.state.startSide?this.state.startSide: _.sample(['white', 'black']);
        this.setState({startSide: side});
        this.setState({queue: await createInvite({ 
            start_with: side,
            isUser: this.state.user.isUser,
            user_id: this.state.user.id,
            durationGame: this.state.durationGame
            })
        });
        this.setState({isInvite: true})
        this.setState({isQueuing: true})
    }
    gameReisgn = async (event) => {
        const game = await updateGame(this.state.game.id, {token: this.state.user.token, resign: true})
    }
    offerDraw = async (event) => {
        updateGame(this.state.game.id, {token: this.state.user.token, offer_draw: true})
    }

    reset = () => {
        this.setState({
            GameWasmEngine: null,
            isQueuing: false,
            date: new Date(),
            queue: {},
            game: {},
            user: {},
            oponent: false,
            isPlaying: false,
            isStarted: false,
            startSide: null,
            promote: 0,
            status: [0,0,0,0],
            board: [11, 9, 10, 12, 13, 10, 9, 11, 8, 8, 8, 8, 8, 8, 8, 8, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 4, 5, 2, 1, 3],
            suggestWin: null,
        })
    }

    render () {
        const { classes } = this.props;
        return <div className={classes.container}>
            <GameInfoModal closeModal={this.closeModal} isopen={this.state.modal.isopen} Title={this.state.modal.title} Description={this.state.modal.description} />
            <Container>
                <Grid container
                container
                direction="row"
                justify="space-between"
                >
                    <Grid item xs={12} md={2}>
                        <Paper className={classes.paper}>
                            <LeftSideBar userName={this.state.oponent?this.state.oponent:"Opponent"} timeRemaining={this.state.timeRemainingOpp} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <div>
                            <div className="app-game-holder">
                                <Board updateBoard={this.updateBoardManually} board={this.state.board} side={this.state.startSide} />
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper className={classes.paper}>
                            <RightSideBar userName={this.state.isUser? this.state.user.username: "Guest"+this.state.user.randomNumber} timeRemaining={this.state.timeRemaining} isQueuing={this.state.isQueuing} isPlaying={this.state.isPlaying} startPlaying={this.startPlay} startInvite={this.startInvite} resign={this.gameReisgn} offerDraw={this.offerDraw} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            </div>
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(Main);