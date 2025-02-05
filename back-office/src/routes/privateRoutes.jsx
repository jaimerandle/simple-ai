import IsAuthUser from "./IsAuthUser"
import Home from "../pages/home/Home"
import Users from "../pages/users/Users"
import Assistants from "../pages/Assistants/Assistants"
import Channels from "../pages/Channels/Channels"
import BaileysDevices from "../pages/Baileys/BaileysDevices"
import PeriodicJobs from "../pages/PeriodicJobs/PeriodicJobs"
import { Layout } from "../pages/layout"
const privateRoutes = [

{
  path:"",
    element:  <Layout/>,
  children:
  [  {
   
    path:"home",
    element:<IsAuthUser auth={true}/>,
    children:[
      {
        index:true,
        element:<Home/>
      },
    ]
    
  },
  {
   
    path:"users",
    element:<IsAuthUser auth={true}/>,
    children:[
      {
        index:true,
        element:<Users/>
      },
    ]
    
  },
  {
   
    path:"assistants",
    element:<IsAuthUser auth={true}/>,
    children:[
      {
        index:true,
        element:<Assistants/>
      },
    ]
    
  },
  {
   
    path:"channels",
    element:<IsAuthUser auth={true}/>,
    children:[
      {
        index:true,
        element:<Channels />
      },
    ]
    
  },
  {
   
    path:"Baileys",
    element:<IsAuthUser auth={true}/>,
    children:[
      {
        index:true,
        element:<BaileysDevices />
      },
    ]
    
  },
  {
   
    path:"periodicJobs",
    element:<IsAuthUser auth={true}/>,
    children:[
      {
        index:true,
        element:<PeriodicJobs />
      },
    ]
    
  }]}
]

export default privateRoutes