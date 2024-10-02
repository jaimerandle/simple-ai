import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import { getConversations } from '../services/bffService';
import TableHeader from './TableHeader';
import ConversationTable from './ConversationTable';
import Loading from '../components/Loading';
import ActionButton from './ActionButton';
import StateSelector from '../components/StateSelector';

const SimpleTable = () => {
  const [filter, setFilter] = useState('');
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [pageSize] = useState(40);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const conversations = await getConversations(token);
        setRows(conversations);
        setFilteredRows(conversations);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleFilterChange = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = rows.filter(row => row.referencia.toLowerCase().includes(value));
    setFilteredRows(filtered);
  };

  const handleRefresh = () => {
    setFilteredRows(rows);
  };

  const handleStateChange = (id, newState) => {
    const updatedRows = rows.map(row =>
      row.id === id ? { ...row, state: newState } : row
    );
    setRows(updatedRows);
    setFilteredRows(updatedRows);

    // Actualiza también en sessionStorage
    sessionStorage.setItem('conversations', JSON.stringify(updatedRows));
  };

  const columns = isMobile
    ? [
        { field: 'referencia', headerName: 'Referencia', flex: 1 },
        {
          field: 'actions',
          headerName: 'Acciones',
          flex: 1,
          renderCell: (params) => <ActionButton row={params.row} onDelete={() => {}} />,
        },
      ]
    : [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'referencia', headerName: 'Referencia', flex: 1 },
        {
            field: 'fechaHora',
            headerName: 'Fecha',
            flex: 1,
            sortComparator: (a, b) => new Date(b) - new Date(a),
          },
          {
            field: 'state',
            headerName: 'Prioridad',
            flex: 1,
            renderCell: (params) => (
              <StateSelector id={params.row.id} initialState={params.row.state} onStateChange={handleStateChange} />
            ),
          },
        {
          field: 'actions',
          headerName: 'Acciones',
          flex: 1,
          renderCell: (params) => <ActionButton row={params.row} onDelete={() => {}} />,
        },
      ];

  return (
    <Box sx={{ height: "70vh", width: '100%', padding: 2 }}>
      <TableHeader filter={filter} onFilterChange={handleFilterChange} onRefresh={handleRefresh} />
      {loading ? (
        <Loading />
      ) : (
        <ConversationTable
          rows={filteredRows}
          columns={columns}
          pageSize={pageSize}
        />
      )}
    </Box>
  );
};

export default SimpleTable;
