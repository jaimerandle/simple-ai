import React from "react";
import styles1 from "./TitleSimple.module.css"
import simpleAi from "../assets/simple-ai.webp"
import SimpleLogo from "../assets/simpleLogo.webp"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Typography } from "@mui/material";


    const TitleSimple = ({w,h,wt,ht,name}) =>{
    
        let container= {
            display: "flex",
            "justify-content": "center",
            gap: "20px",
        }
        
    let styles = {
        height:h,
        width:w
    }   
    let stylesTitle = {
        height:ht,
        width:wt
    }
    return (<div style={{paddingTop:'8%',paddingBottom:"5%" ,backgroundColor:"purple",}}>
        <div className={styles1.container} style={container}>
            <div><img  className={`${styles.logo}`} style={styles} src={SimpleLogo}/> </div>
            <div><img className={`${styles.title}`} style={stylesTitle}src={simpleAi}/></div>
        </div>
        {name?<div style={{textAlign:"center",display:'flex',justifyContent:"center" ,marginTop:"4%"}}><AccountCircleOutlinedIcon/><Typography variant="body1" color={"grey"}>Bienvenido, {name}!</Typography></div>:<></>}
    </div>)
}

export default TitleSimple