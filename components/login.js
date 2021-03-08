import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InputBase , Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, IconButton, Typography, Button } from '@material-ui/core';
import clsx from 'clsx';

import { red } from '@material-ui/core/colors';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';



const useStyles = makeStyles((theme) => ({
    root: {
      width: 600,
      [theme.breakpoints.down('xs')]: {
        marginTop: 60,
      }
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));

export const Login = ({ signUp, loginUser }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [username, setUsername] = React.useState(false);
    const [password, setPassword] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const loginCall = () => {
        if (username && password) {
            loginUser(username, password)
        }
    }

    const changeUserName = (e) => {
        setUsername(e.target.value)
    }

    const changePassWord = (e) => {
        setPassword(e.target.value)
    }

    return <Card className={classes.root}>
                    <CardHeader
                        title={"Login"}
                        subheader={"login to your account"}
                    />
                    <CardContent>
                        <InputBase onChange={changeUserName} placeholder="Username or Email" />
                        
                    </CardContent>
                    <CardContent>
                        <InputBase onChange={changePassWord} placeholder="Password" type="password" />
                    </CardContent>
                    <CardContent>
                        <Button
                            variant="contained"
                            color={"primary"}
                            size={"medium"}
                            className={classes.button}
                            disableRipple
                            disableTouchRipple
                            fullWidth
                            onClick={loginCall}
                        >
                            {"Login"}
                        </Button>
                    </CardContent>
                    <CardContent>
                        <Button
                            variant="contained"
                            color={"seconadary"}
                            size={"medium"}
                            className={classes.button}
                            disableRipple
                            disableTouchRipple
                            fullWidth
                            onClick={signUp}
                        >
                            {"Sign Up"}
                        </Button>
                    </CardContent>  
                                     
                </Card>
}