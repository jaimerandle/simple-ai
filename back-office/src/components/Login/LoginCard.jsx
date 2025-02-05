import { Card,CardContent,Box } from "@mui/material";
import LoginHeader from './LoginHeaer';
import LoginForm from "./LoginForm";
import { StyledBox } from "./LoginCard.styles";

const LoginCard = () =>{


    
    return(<StyledBox>
        <Card>
            <CardContent>
                <LoginHeader/>
                <LoginForm />
            </CardContent>
        </Card>
    </StyledBox>)

}

export default LoginCard