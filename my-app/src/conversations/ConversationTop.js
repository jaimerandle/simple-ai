import { Button, Typography, useMediaQuery } from "@mui/material"
import React, { useEffect } from "react"
import CanalLogo from "../components/CanalLogo"
import WhatsApp from "@mui/icons-material/WhatsApp"
import Instagram from "@mui/icons-material/Instagram"
import mercadoLibre from "../assets/meli.png"
import Listado from "../assets/Listado.png"
import { useNavigate } from "react-router-dom"

export const ConversationsTop = (canal, logoSrc, title)=>{
    const navigate = useNavigate()
    const isMobile = useMediaQuery('(max-width:750px)');
    return(
        <div style={{display:"flex",alignItmes:"center",flexDirection:isMobile?'column':'' , zIndex:"0", justifyContent:"space-between", marginTop:"20px",}}>
            <Typography variant={isMobile?"h5":"h5"} gutterBottom color="grey" style={{zIndex:!isMobile?"1111":"", marginTop:!isMobile?"20px":"", textAlign:isMobile?"center":""}}>Detalles de la Conversación</Typography>
            <div style={{display:"flex", marginTop:"20px" ,textAlign:"center",gap:isMobile?"3%":"", justifyContent:isMobile?"space-between":""}}>
                <div style={{display:"flex"}}>
                    <p style={{fontSize:"19px", color:"grey"}}>Canal:</p>
                    <WhatsApp style={{color:"#926DC2", marginLeft:"15px"}}/>
                    <Instagram style={{color:"grey", marginLeft:"15px"}}/>
                    <img style={{height:"20px", borderRadius:"16px", marginLeft:"15px", marginTop:"2px"}} src={mercadoLibre} alt=""/>
                
                </div>
                {
                    isMobile?
                    <Button style={{display:"flex", width:isMobile?"30%":"20%", border:"1px solid grey", height:isMobile?"40px":"60px", marginTop:isMobile? " ":""}}  onClick={()=>{navigate("/home")}}>
                        <img src={Listado} alt="" style={{ height:"20px"}}/>
                        {isMobile? (<></>) : (
                        <p style={{color:"grey", marginTop:"15px", marginLeft:"5px"}}>Volver al dashboard</p>
                        )}
                    </Button>
                    :<></> 
                }

            </div>
            {
               !isMobile?
               <Button style={{display:"flex", width:isMobile?"40%":"20%", border:"1px solid grey", height:isMobile?"40px":"60px", marginTop:isMobile? "30px":""}}  onClick={()=>{navigate("/home")}}>
                    <img src={Listado} alt="" style={{ height:"20px"}}/>
                    {isMobile? (<></>) : (
                    <p style={{color:"grey", marginTop:"15px", marginLeft:"5px"}}>Volver al dashboard</p>
                    )}
                </Button>
               
               :<></> 
            }
        </div>
    )
}