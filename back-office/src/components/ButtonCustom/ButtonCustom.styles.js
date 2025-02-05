import { styled,Button } from "@mui/material";



export const StyledButton = styled(Button)(({theme,w})=>(
    {
        backgroundColor:theme.palette.secondary.main,
        color:theme.palette.text.secondary,
        width:w,
        padding:'8px 16px',
        borderRadius:'4px',
        '&:hover':{
            backgroundColor:theme.palette.primary.main,
            color:theme.palette.text.primary,

        }
    }
)
)