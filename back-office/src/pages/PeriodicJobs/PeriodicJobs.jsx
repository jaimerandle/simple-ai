import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Box, Typography, Chip } from "@mui/material";
import GenericTable from "../../components/Tables/GenericTable";
import OperationBasic from "../home/logicHome.js";
import { useFetch } from "../../hooks/useFetch";
import ActionButton from "../../components/Tables/ActionButton";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/Tables/modal/Modal";
import Delete from "../../components/Tables/Delete/Delete";
import LoopIcon from '@mui/icons-material/Loop';
import { 
  ContainerBox, 
  StyledBox, 
  StyledButtonBox, 
  StyledDivider, 
} from "../home/Home.styles.js";
import FormularioPeriodic from "../../components/Tables/formularioPeriodic/FormularioPeriodic.jsx";

const ACTIONS = {
  DELETE: 'delete',
  UPDATE: 'update',
  CREATE: 'create',
  SUCCESS_DELETE: 'sDelete',
  RELOADED: 'reloded'
};

const operaciones = new OperationBasic("periodicjobs");

const MemoizedActionButton = React.memo(({ params, handleSetAction, handleSetSelect }) => (
  <ActionButton 
    action={handleSetAction} 
    select={() => handleSetSelect(params.row)} 
  />
));

const StatusChip = React.memo(({ value, type }) => (
  <Chip
    label={value.toString()}
    color={value ? "success" : "error"}
    variant="outlined"
    size="small"
    sx={{ minWidth: 75 }}
  />
));

const LoadingState = () => (
  <Box display="flex" alignItems="center" justifyContent="center" p={2}>
    <Typography>Loading...</Typography>
  </Box>
);
const ErrorState = ({ message}) => (
  <Box p={2} display="flex"  alignContent={"center"} justifyContent={"center"} marginTop="30vh">
    <Box textAlign="center">
          <Typography color="error">
      Error loading data: {message|| ""}

    </Typography>
    <LoopIcon onClick={()=>window.location.reload()} color="error" sx={{fontSize:"80px",cursor:'pointer'}}/>
    </Box>

  </Box>
);


const PeriodicJobs = () => {
  const [selectRow, setSelect] = useState(null);
  const [action, setAction] = useState("");
  const token = useSelector((state) => state.auth.token);
  const { data, loading, error } = useFetch(operaciones.getTables, [token]);
  const [items, setItems] = useState([]);
  const { isOpen, closeModal, openModal } = useModal();

  const handleSetAction = useCallback((newAction) => setAction(newAction), []);
  const handleSetSelect = useCallback((row) => setSelect(row), []);

  const columns = [
    { field: "id", headerName: "Id", flex: 1 },
    { field: "client_id", headerName: "Client Id", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "schedule", headerName: "Schedule", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actiones",
      headerName: "Actiones",
      flex: 1,
      renderCell: (params) => (
        <MemoizedActionButton 
          params={params}
          handleSetAction={handleSetAction}
          handleSetSelect={handleSetSelect}
        />
      ),
    },
  ];

  const actionCallbacks = {
    [ACTIONS.UPDATE]: operaciones.editItem,
    [ACTIONS.CREATE]: operaciones.createItem,
    [ACTIONS.DELETE]: operaciones.deleteItem
  };

  // Effect for initial data loading
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  // Effect for handling modal opening
 useEffect(() => {
       if (action) {
         if (action === ACTIONS.SUCCESS_DELETE || action === ACTIONS.RELOADED) {
           operaciones.getTables(token)
             .then(fetchedData => {
               setItems(fetchedData);
               setAction("");
             })
             .catch(error => {
               console.error("Error fetching data:", error);
             });
         } else {
           openModal();
         }
       }
     }, [action, token, openModal]);

  const handleNewElement = useCallback(() => {
    setSelect({});
    setAction(ACTIONS.CREATE);
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  return (
    <ContainerBox>
      <StyledBox>
        <StyledButtonBox>
          <StyledDivider />
          <Button onClick={handleNewElement}>Nuevo Elemento</Button>
        </StyledButtonBox>
        
        {action && isOpen && (
          <Modal
            isOpen={isOpen}
            row={selectRow}
            action={action}
            handleClose={closeModal}
            setAction={setAction}
            callback={actionCallbacks[action]}
            Component={action === ACTIONS.DELETE ? Delete : FormularioPeriodic}
          />
        )}
        
        {items && <GenericTable columns={columns} data={items} />}
      </StyledBox>
    </ContainerBox>
  );
};

export default React.memo(PeriodicJobs);  