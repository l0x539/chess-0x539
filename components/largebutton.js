import { Button } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
}));

const LargeButton = ({ placeHolder, Icon, color, onClick }) => {
    const classes = useStyles();
    return <Button
    variant="contained"
    color={color}
    size="large"
    className={classes.button}
    startIcon={Icon}
    disableRipple
    disableTouchRipple
    fullWidth
    onClick={onClick}
  >
    {placeHolder}
  </Button>
}

export default LargeButton;