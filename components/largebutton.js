import { Button } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
}));

const LargeButton = ({ fullWidth, placeHolder, Icon, color, onClick, disable }) => {
    const classes = useStyles();
    return <Button
    variant="contained"
    color={color}
    size={fullWidth?"large":"medium"}
    className={classes.button}
    startIcon={Icon}
    disableRipple
    disableTouchRipple
    fullWidth={fullWidth}
    disabled={disable}
    onClick={onClick}
  >
    {placeHolder}
  </Button>
}

export default LargeButton;