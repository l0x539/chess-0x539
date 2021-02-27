
import { BrowserRouter as Router,
  Switch,      
} from 'react-router-dom';
import { paths } from "./routes";
import AppRoute from "./routes/route";
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
          {paths.map((c, i) => 
              <AppRoute 
                path={c.path}
                component={c.component}
                key={i}
              />
          )}
        </Switch>
    </Router>
  );
}

export default App;
