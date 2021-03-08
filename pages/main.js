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
            durationGame: 10*60,
            oponent: false,
            isPlaying: false,
            isStarted: false,
            startSide: "white",
            promote: 0,
            status: [0,0,0,0],
            board: [11, 9, 10, 12, 13, 10, 9, 11, 8, 8, 8, 8, 8, 8, 8, 8, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 4, 5, 2, 1, 3],
            suggestWin: null,
            invite: params.invite,
            modal: {
                isopen: false,
                title: "",
                description: ""
            },
            move_turn: true,
            clicked: null,
            draw_offered: false,
            idraw_offered: false,
            show_overlay: false,
            moved_to_pos: [0, 0],
            moved_from_pos: [0, 0],
            _arr: [...Array(64).keys()].reverse()
        }
    }

    async componentDidMount() {
        try {
            this.timerID = setInterval(
              () => this.tick(),
                500
            );
            const _user = window.localStorage.user?JSON.parse(window.localStorage.user):{}
            const me = await getMe(_user.metoken)
            if (!me.error) {
                me.token = _user.token
                me.metoken = _user.metoken
                me.id = _user.id
                await this.setState({user: {isUser: false, ...me}})
            } else {
                await this.setState({user: {isUser: false, ...(_user)}})
            }
            
            await GameWasmClient.then(async (GameWasmClient) => {
                this.setState({ GameWasmEngine: GameWasmClient })
                let board = await GameWasmClient.get_board();
                this.setState({ board:  this.state.game.black_id === this.state.user.id?board.reverse():board})
                this.setState({ status: this.state.status })
            })

            await this.joinInvite()
    
        } catch (err) {
            console.log(err);
        }

    }

    joinInvite = async () => {
        const { match: { params } } = this.props;
        await GameWasmClient.then(async (GameWasmClient) => {
            this.setState({ GameWasmEngine: GameWasmClient })
            let board = await GameWasmClient.get_board();
            this.setState({ board:  this.state.game.black_id === this.state.user.id?board.reverse():board})
            this.setState({ status: this.state.status })
        })
        if (params.invite && !this.state.game.isPlaying) {
            const queues = await findInvite(params.invite);
            if (queues.length > 0) {
                this.setState({queue: queues[0]})
                const game = await searchGame(queues[0].game_id, )
                await this._join_game(game)    
            }
        }
    }

    updateBoardManually = async (square, square_to_go) => {
        try {
            if (this.state.isPlaying) {
                if ((this.state.startSide === "black") === this.state.GameWasmEngine.get_side()) {
                    await GameWasmClient.then(async (GameWasmClient) => {
                        const status = this.state.GameWasmEngine.update_clone_board(square, square_to_go, this.state.promote);

                        if (!(status[0] === this.state.status[0])) {
                            this.clickOverlay(null)
                            updateGame(this.state.game.id, {token: this.state.user.token, suggested_move: JSON.stringify([square, square_to_go])})
                            const status = this.state.GameWasmEngine.update_board(square, square_to_go, this.state.promote);
                            window.status = status
                            await this.setState({ status: status  })
                            await this.setState({GameWasmClient: GameWasmClient })
                            let board = await this.state.GameWasmClient.get_board();
                            this.setState({ board:  this.state.game.black_id === this.state.user.id?board.reverse():board})

                            if (!this.state.isStarted) this.startGame();
                        }
                    })
                }
            }
        } catch (err) {
            console.log(err);
        }
        
        //this.setState({ board: this.state.GameWasmClient.get_board()  })
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    startGame = async () => {
        try {
            const joinedGame = await updateGame(this.state.game.id, {token: this.state.user.token, isStarting: true, start_time: true})
            this.setState({isStarted: true})

        } catch (err) {
            console.log(err);
        }
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
        try {

            if (!this.state.reversed && this.state.startSide === "black") {
                this.setState((state, props) => {
                    return {board: state.board.reverse()}
                })
                this.setState({reversed: true})
            }

            if (this.state.game.draw_offerer && !this.state.draw_offered) {
                if (this.state.game.draw_offerer !== this.state.user.id) {
                    this.setState({draw_offered: true})
                }
            } else {

            }

            if (this.state.status[1] === 1) {
                this.setState({king_check: true})
            } else {
                this.setState({king_check: false})
            }

            if (this.state.isInvite) {
                this.openModal("Invite a friend", "Link: https://chess.0x539.co/" + this.state.queue.link)
                this.setState({isInvite: false})
            }

            if (this.state.modal && this.state.modal.title === "Invite a friend" && this.state.isPlaying) {
                this.closeModal();
            }

            if (this.state.status[2] === 1) {
                // checkmate
                this.setState({suggestWin: "checkmate"})
                await updateGame(this.state.game.id, {token: this.state.user.token, suggest_win: "checkmate"}, this.state.user.token, this.state.user.isUser)
                

            } else if (this.state.status[2] === 2) {
                // stalemate
                this.setState({suggestWin: "stalemate"})
                await updateGame(this.state.game.id, {token: this.state.user.token, suggest_win: "stalemate"}, this.state.user.token, this.state.user.isUser)

                
            } else if (this.state.status[2] === 3) {
                // draw
                this.setState({suggestWin: "draw"})
                await updateGame(this.state.game.id, {token: this.state.user.token, suggest_win: "draw"}, this.state.user.token, this.state.user.isUser)

                
            }
            
            if (this.state.queue.game_id){
                const game = await searchGame(this.state.queue.game_id, this.state.user.token, this.state.user.isUser)
                this.setState({game})
                if (this.state.isQueuing) {
                    this.setState({game})
                    if (game.isPlaying) {
                        this.setState({queue: {}})
                        this.setState({isPlaying: true})
                        
                    } else {
                        this.startPlay()
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
                const game = await searchGame(this.state.game.id, this.state.user.token, this.state.user.isUser);
                if (!game.draw_offerer && this.state.idraw_offered) {
                    this.setState({idraw_offered: false})
                }
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
                    const description = this.state.startSide === this.state.game.winner?"Congratulations":this.state.game.winner === "draw"?"game withdraw.":this.state.game.winner === "stalemate"?"no moves left":this.state.game.winner === "checkmate"?"checkmated.":this.state.game.winner === "abort"?"Game Aborted":"Better Luck next time.";
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
                            if (guest.error) {
                                alert("opponent user doesn't exist")
                            } else this.setState({oponent: "Guest"+guest.randomNumber})
                        }
                    } else if (this.state.game.black_id === this.state.user.id) {
                        if (this.state.game.isWhiteUser) {
                            const user = await getUser(this.state.game.white_id);
                            this.setState({oponent: user.username})
                        } else {
                            const guest = await getGuest(this.state.game.white_id)
                            if (guest.error) {
                                alert("opponent user doesn't exist")
                            } else this.setState({oponent: "Guest"+guest.randomNumber})
                        }
                    }
                }
                if (this.state.game.suggested_move) {
                    if ((this.state.startSide === "black") !== this.state.GameWasmEngine.get_side()) {

                        await GameWasmClient.then(async (GameWasmClient) => {
                            const suggested_move = JSON.parse(this.state.game.suggested_move);
                            const status = this.state.GameWasmEngine.update_clone_board(suggested_move[0], suggested_move[1], this.state.promote);

                            if (!(status[0] === this.state.status[0])) {

                                await updateGame(this.state.game.id, {token: this.state.user.token, approved_move: JSON.stringify(suggested_move)}, this.state.user.token, this.state.user.isUser)
                            }
                        })
                    }
                }
                if (this.state.game.approved_move) {
                    await GameWasmClient.then(async (GameWasmClient) => {
                        const approved_move = JSON.parse(this.state.game.approved_move);
                        const status = this.state.GameWasmEngine.update_board(approved_move[0], approved_move[1], this.state.promote);
                        window.status = status
                        if (!(status[0] === this.state.status[0])) {

                            if (this.state.game.approved_move !== JSON.stringify(this.state.moved_to_pos) && ((this.state.startSide === "black") === (status[0]===1))) {
                                
                                await this.setState({moved_to_pos: approved_move[1]})
                                await this.setState({moved_from_pos: approved_move[0]})


                                await this.setState({show_overlay: true})
                            }
                        }
                        this.setState({ status: status  })
                        this.setState({ GameWasmClient })
                        let board = await this.state.GameWasmClient.get_board();
                        this.setState({ board:  this.state.game.black_id === this.state.user.id?board.reverse():board})
                        
                    })
                }
            } else {
            }
            this.setState({
                date: new Date(),
            });
        } catch (error) {
            console.log("error here");
            console.log(error);
            window.localStorage.removeItem("user")
        }
    }

    _suggest_win = async (win) => {

    }

    _join_game = async (game) => {
        const joinedGame = await updateGame(game.id, {user_id: this.state.user.id, isUser: this.state.user.isUser, token: this.state.user.token, create: true}, this.state.user.token, this.state.user.isUser)
        this.setState({game: joinedGame})
        this.setState({isPlaying: joinedGame.isPlaying})
        this.setState({startSide: this.state.user.id===joinedGame.black_id?"black":"white"})
        await GameWasmClient.then(async (GameWasmClient) => {
            this.setState({ GameWasmClient })
            
            let board = await this.state.GameWasmClient.get_board();
            await this.setState({ board:  game.black_id === this.state.user.id?board.reverse():board})
        })
    }

    startPlay = async (event) => {
        try {
            const queues = await searchQueue(this.state.user.id, this.state.user.token, this.state.user.isUser);
            while (queues.length) {
                try {
                    const game = await searchGame(queues[0].game_id, this.state.user.token, this.state.user.isUser)
                    if (!game.error) {
                        this._join_game(game)
                        return;
                    }
                    queues.pop()
                    
                } catch {
                }
            } 
            if (!this.state.isQueuing) {
                this.reset()
                const side = this.state.startSide?this.state.startSide: _.sample(['white', 'black'])

                this.setState({startSide: side})
                const queue = await createQueue({ 
                    start_with: side,
                    isUser: this.state.user.isUser,
                    user_id: this.state.user.id,
                    durationGame: this.state.durationGame
                    }, this.state.user.token, this.state.user.isUser) 
                
                if (!queue.error) {
                    this.setState({queue: queue
                    });
                    this.setState({isQueuing: true})
                    await GameWasmClient.then(async (GameWasmClient) => {
                        this.setState({ GameWasmClient })
                        
                        let board = await this.state.GameWasmClient.get_board();
                        this.setState({ board:  side==="black"?board.reverse():board})
                    })

                } else {
                    window.localStorage.removeItem("user");
                    window.location = "/"
                }
            }
        } catch(err) {
            console.log(err);
            window.localStorage.removeItem("user")

        }
    }

    cancelPlay = () => {
        this.reset()
    }

    startInvite = async (event) => {
        try {
            const side = this.state.startSide?this.state.startSide: _.sample(['white', 'black']);
            this.setState({startSide: side});
            this.setState({queue: await createInvite({ 
                start_with: side,
                isUser: this.state.user.isUser,
                user_id: this.state.user.id,
                durationGame: this.state.durationGame
                }, this.state.user.token, this.state.user.isUser)
            });
            this.setState({isInvite: true})
            this.setState({isQueuing: true})
        } catch (err) {
            console.log(err);
            window.localStorage.removeItem("user")
        }
    }
    gameReisgn = async (event) => {
        try {
            const game = await updateGame(this.state.game.id, {token: this.state.user.token, resign: true}, this.state.user.token, this.state.user.isUser)

        } catch (err) {
            console.log(err);
            window.localStorage.removeItem("user")

        }
    }
    offerDraw = async (event) => {
        try {
            const game = await updateGame(this.state.game.id, {token: this.state.user.token, offer_draw: true}, this.state.user.token, this.state.user.isUser)
            await this.setState({game})
            await this.setState({idraw_offered: true})
            
        } catch (err) {
            console.log(err);
            window.localStorage.removeItem("user")

        }
    }

    reset = async () => {
        
        this.setState({
            GameWasmEngine: null,
            isQueuing: false,
            date: new Date(),
            queue: {},
            game: {},
            oponent: false,
            isPlaying: false,
            isStarted: false,
            startSide: null,
            promote: 0,
            status: [0,0,0],
            board: [11, 9, 10, 12, 13, 10, 9, 11, 8, 8, 8, 8, 8, 8, 8, 8, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 4, 5, 2, 1, 3],
            suggestWin: null,
            dots: [],
            move_turn: true,
            clicked: null,
            draw_offered: false,
            idraw_offered: false,
            show_overlay: false,
            moved_to_pos: [0, 0],
            moved_from_pos: [0, 0],
            reversed: false

        })
        await GameWasmClient.then(async (GameWasmClient) => {
            GameWasmClient.reset_board()
            this.setState({ GameWasmEngine: GameWasmClient })
            
            let board = await GameWasmClient.get_board();
            this.setState({ board:  this.state.game.black_id === this.state.user.id?board.reverse():board})
            this.setState({ status: [0, 0, 0] })
        })
        
    }
    
    declineDraw = async () => {
        await updateGame(this.state.game.id, {token: this.state.user.token, decline_draw: true}, this.state.user.token, this.state.user.isUser)
        this.setState({draw_offered: false})
        
    }

    clickOverlay = async (piece) => {
        this.setState({show_overlay: false})
        if (this.state.isPlaying) {    
            if (piece) {
                if (this.state.game.id && (this.state.game.turn?true:false) === (this.state.startSide === "black")) {
                    this.setState({clicked: piece})
                    piece = piece-1;
                    if (this.state.startSide === "black") {

                        piece = await this.state._arr[piece]
                    }
                    let dots = await this.state.GameWasmClient.get_permitted_squares(piece);
                    if (this.state.startSide === "black") {
                        dots = dots.map((d) => this.state._arr[d])
                    }
                    this.setState({dots})
                }
            } else {
                this.setState({clicked: piece})
                this.disableOverlay()
            }
        }
    }

    disableOverlay = () => {
        this.setState({dots: []})
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
                            <LeftSideBar userName={this.state.oponent?this.state.oponent:"Opponent"} timeRemaining={this.state.startSide === "black"? this.state.timeRemaining:this.state.timeRemainingOpp} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <div>
                            <div className="app-game-holder">
                                <Board status={this.state.status} king_check={this.state.king_check} disableOverlay={this.disableOverlay} square_dots={this.state.dots} moved_from_pos={this.state.moved_from_pos} moved_to_pos={this.state.moved_to_pos} show_overlay={this.state.show_overlay} clickOverlay={this.clickOverlay} clicked={this.state.clicked} updateBoard={this.updateBoardManually} board={this.state.board} myside={this.state.startSide} _arr={this.state._arr} />
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper className={classes.paper}>
                            <RightSideBar cancelPlay={this.cancelPlay} idraw_offered={this.state.idraw_offered} declineDraw={this.declineDraw} draw_offered={this.state.draw_offered} userName={this.state.user.username? this.state.user.username: "Guest"+this.state.user.randomNumber} timeRemaining={this.state.startSide === "black"?this.state.timeRemainingOpp: this.state.timeRemaining} isQueuing={this.state.isQueuing} isPlaying={this.state.isPlaying} startPlaying={this.startPlay} startInvite={this.startInvite} resign={this.gameReisgn} offerDraw={this.offerDraw} />
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