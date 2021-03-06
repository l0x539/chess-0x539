import { BrowserRouter as Router,
  Switch,      
} from 'react-router-dom';
import { paths } from "./routes";
import AppRoute from "./routes/route";
import './App.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Header from "./components/header";

let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#502A47",
    },
    secondary: {
      main: "#D5B197",
    },
    background: {
      default: "#ffd7ea",
      light: "#FCF5E5",
    },
  },
  breakpoints: {
    values: {
      xs: 0, // phones
      sm: 600, // tablets
      md: 1095, // small laptops
      lg: 1323, // desktops
      xl: 1500, // large screens
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.root}>
          <Header />
          <main className={classes.content}>
          <Switch>
              {paths.map((c, i) => 
                  <AppRoute 
                    path={c.path}
                    component={c.component}
                    key={i}
                  />
              )}
            </Switch>
          </main>
        </div>
        </ThemeProvider>
    </Router>
  );
}

export default App;
