import Login from "../pages/login/Login"
import IsAuthUser from "./IsAuthUser"


const publicRoutes = [
    {
        path:"login",
        element: <IsAuthUser auth={false} />,
        children:[
            {
                index:true,
                element:<Login/>
            } 
        ]
    }

]

export default publicRoutes;