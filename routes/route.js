
import { Route } from "react-router-dom";


const AppRoute = ({soundSFX, component: Component, ...rest}) => (
    <Route 
        {...rest}
        render={props => <Component soundSFX={soundSFX} {...props}/>}
    />
)

export default AppRoute