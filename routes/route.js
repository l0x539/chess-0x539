
import { Route } from "react-router-dom";


const AppRoute = ({component: Component, ...rest}) => (
    <Route 
        {...rest}
        render={props => <Component {...props}/>}
    />
)

export default AppRoute