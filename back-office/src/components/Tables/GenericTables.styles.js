import { colors, styled} from "@mui/material"; 
import { DataGrid } from "@mui/x-data-grid";

export const StyledDataGrid = styled(DataGrid)(({theme})=>({
    color:theme.palette.text.primary,
    width:'90%',
    borderRadius:"12px",
    backgroundColor:theme.palette.background.paper,
    '& .MuiDataGrid-columnHeaders':{
        backgroundColor: "#1976d2",
        color:theme.palette.primary.main,
        fontSize: "15px",
        fontWeight: "bold",
       }
}))     