import React, { useState,useEffect } from "react";
import {StyledDataGrid} from "./GenericTables.styles.js"

const GenericTable = ({columns,data}) =>{
    const [info,setInfo] = useState(data)
    useEffect(() => {
      setInfo(data); 
    }, [data]);
    return(
      <StyledDataGrid
      com
      columns={columns}
      rows={info}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 14 }
        }
      }}
      
    />
    )
}


export default GenericTable;