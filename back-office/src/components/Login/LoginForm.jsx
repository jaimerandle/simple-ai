
import { Dialog, TextField, Typography } from "@mui/material";
import { ButtonGeneralCustom } from "../ButtonCustom/ButtonCustom";
import { StyledBox } from "./LoginForm.styles";
import { useEffect, useState } from "react";
import { onChangeForm,onSubmitForm } from "../../pages/login/logicLogin";
import { useDispatch,useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginForm = ()=>{
    
    const {isAuthenticated,error, loading} = useSelector((state)=>state.auth);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [isOpen,setIsOpen] = useState(false)
    const dispath = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/home')
        }
    },[isAuthenticated,navigate])

    useEffect(()=>{
        if(error){
            console.log('se cometio un error')
            setIsOpen(true)
        }
    },[error])

    const handleSubmit= async  (e) =>{
        e.preventDefault()
         console.log(isAuthenticated,error)
         await onSubmitForm(email,password ,dispath);

    }

     


    return (<form onSubmit={handleSubmit}>
       <Dialog sx={{marginBottom:'280px'}}open={isOpen} onClose={()=>setIsOpen(false)}>
            <Typography sx={{margin:'30px'}}>{error}</Typography>
       </Dialog>
        
        <TextField label="Email" type="email" variant="outlined"  fullWidth margin="normal"  value={email} onChange={onChangeForm(setEmail)} required/>
        <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={onChangeForm(setPassword)} required/>
        <StyledBox>
            {!loading && <ButtonGeneralCustom label="login" typed="submit" />}
            {loading && <Typography sx={{margin:'30px'}}>Cargando...</Typography> }
        </StyledBox>
        
    </form>)
}

export default LoginForm;