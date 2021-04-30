import React,{BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {First} from "./components/First"; 
function App(){
    return(
        <>

        <Router>
            <Switch>
                <Route exact path="/" component={First} />
            </Switch>
        </Router>
        
        </>
        
    )
}
export default App;