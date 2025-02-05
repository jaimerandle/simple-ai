import privateRoutes from "./privateRoutes"
import publicRoutes from "./publicRoutes"
import App from "../App";
import IsAuthUser from "./IsAuthUser";
import Login from "../pages/login/Login";

const routes = [
    {
        path:"/",
        element : <App />,
        
        children:[
            {
                path:"",
                element:(<IsAuthUser><Login/></IsAuthUser>)
            },

            ...privateRoutes,
            //public routes
            
            ...publicRoutes,
            //private routes
         
        ]

    }
]
 

export default routes;