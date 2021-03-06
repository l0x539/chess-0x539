import clsx from 'clsx';
import { AppBar, Toolbar, Grid, Drawer, Button, IconButton, Divider, List, ListItem, ListItemText, ListItemIcon, SvgIcon, Avatar } from "@material-ui/core";
import { withStyles , useTheme } from '@material-ui/core/styles';
import SearchBar from "./searchBar";
import theme from "../utils";
import PropTypes from 'prop-types';
import { Navbar as ReactNavbar } from 'react-bootstrap';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Help from '@material-ui/icons/Help';
import Settings from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import { Component, Fragment } from "react";
import logo from "../logo.png";
import {ReactComponent as SvgPlay} from "../themes/svgs/chess2.svg"
import {ReactComponent as SvgCommunity} from "../themes/svgs/chesspieces.svg"
import ImgExplorer from "../themes/svgs/website.png"
import { createGuest, getMe } from '../utils/apiStrapi';

const drawerWidth = 200;

const styles = (theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      backgroundColor: "#1B0E18",
      color: "#D5B197",
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      backgroundColor: "#1B0E18",
      color: "#D5B197",
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    joinButton: {
        backgroundColor: "#E66A82",
        border: "1px solid #E66A82",
        boxSizing: "border-box",
        boxShadow: "0px 2px 7px 1px rgba(0, 0, 0, 0.71)",
        borderRadius: 30,
        color: "#FFF",
        width: 30,
        height: 40,
        fontFamily: "'Saira Condensed', sans-serif",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
        "&:hover": {
            //you want this to be the same as the backgroundColor above
            backgroundColor: "#dc8f9e",
            opacity: 0.95
        },
        [theme.breakpoints.down('xs')]: {
            height: 38
        }
    },
    icon: {
      color: "#E66A82"
    }
  });

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    async componentDidMount () {
      const me = await getMe(window.localStorage?.token)
        if (!me.error) {
            this.setState({user: {isUser: true, ...me}})
        } else {
            const guest = window.localStorage.guest;
            const user = guest?JSON.parse(guest):await createGuest()
            window.localStorage.guest = JSON.stringify(user);
            this.setState({user: {isUser: false, ...user}})
        }
    }

    render () {
        const { logged_in } = this.props;
        const { classes } = this.props;
        return <Fragment>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                    [classes.appBarShift]: this.state.open,
                    })}
                    color="primary"
                >
                    <Toolbar >
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                            [classes.hide]: this.state.open,
                            })}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        wrap="nowrap"
                        >
                            <Grid item className={classes.toggleMobile}>
                            {this.state.open?"":
                                <ReactNavbar.Brand href="#" alt="ftita logo image"> 
                                    <div className="logo"><img src={logo}
                                    style={{objectFit: "contain"}}
                                    width={203}
                                    height={55}
                                    /></div>
                                </ReactNavbar.Brand>
                            }
                            </Grid>
                            
                            <Grid item>
                                <Grid container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                wrap="nowrap"
                                spacing={2}>
                                    <Grid className={classes.toggleSmall} item><SearchBar /></Grid>       
                                </Grid>
                            </Grid>
                            <div className={"left"}>
                            </div>
                            <Grid item><Button to="/" color="secondary">Home</Button></Grid>
                            <Grid item><Button to="/community" color="secondary">Community</Button></Grid>
                            <Grid item><Button to="/explorer" color="secondary">Explorer</Button></Grid>
                            <Grid item>
                                <Grid container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                wrap="nowrap"
                                spacing={2}>
                                    <Grid item><IconButton className={classes.toggleTablet} onClick={this.toggleFullscreen}><FullscreenIcon/></IconButton></Grid>
                                    <Grid item><IconButton className={classes.toggleTablet} onClick={this.props.changeThemeColor}>{this.props.themeColor=="primary"?<Brightness2Icon/>:<WbSunnyIcon/>}</IconButton></Grid>
                                    <Grid item>
                                      {this.state.isloggedIn?<Avatar />:<Button
                                        aria-controls="services-menu"
                                        aria-haspopup="true"
                                        color="secondary"
                                        className={classes.joinButton}
                                        >Join</Button>}
                                        
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                [classes.drawerOpen]: this.state.open,
                [classes.drawerClose]: !this.state.open,
                })}
                classes={{
                paper: clsx({
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open,
                }),
                }}
            >
                <div className={classes.toolbar}>
                {this.state.open?<Grid item className={classes.toggleMobile}>
                    <ReactNavbar.Brand href="#" alt="ftita logo image"> 
                        <div className="logo"><img src={logo} style={{objectFit: "contain"}}
                        width={100}
                        height={55}
                        /></div>
                    </ReactNavbar.Brand>
                </Grid>:""}
                <IconButton className={classes.icon} onClick={this.handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
                </div>
                <List>
                    <ListItem button >
                    <ListItemIcon className={classes.icon} ><SvgPlay className={classes.icon} /></ListItemIcon>
                    <ListItemText primary={"Play"} />
                    </ListItem>
                    <ListItem button >
                    <ListItemIcon className={classes.icon} ><SvgCommunity className={classes.icon} /></ListItemIcon>
                    <ListItemText primary={"Community"} />
                    </ListItem>
                    <ListItem button >
                    <ListItemIcon className={classes.icon} ><img src={ImgExplorer}/></ListItemIcon>
                    <ListItemText primary={"Explorer"} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                {['Settings', 'Help'].map((text, index) => (
                    <ListItem button key={text}>
                    <ListItemIcon className={classes.icon} >{index % 2 === 0 ? <Settings /> : <Help />}</ListItemIcon>
                    <ListItemText  primary={text} />
                    </ListItem>
                ))}
                </List>
            </Drawer>
            </Fragment>
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Header);