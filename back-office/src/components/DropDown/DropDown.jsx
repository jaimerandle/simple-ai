import React from "react";
import { MenuItem, Select, FormControl, InputLabel, CircularProgress, Typography } from "@mui/material";
import { useFetch } from "./../../hooks/useFetch";

const DropDown = ({ label, value, onChange, fetchOptions,token }) => {
  const { data: options, loading, error } = useFetch(fetchOptions, [token]);
  
  return (
    <FormControl fullWidth required={true}>
      <InputLabel>{label}</InputLabel>
      {loading ? (
        <CircularProgress size={24} sx={{ margin: "10px auto" }} />
      ) : error ? (
        <Typography color="error">Error al cargar opciones</Typography>
      ) : (
        <Select value={value || ""} onChange={(e) => onChange(e.target.value)}>
          {options?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default DropDown;