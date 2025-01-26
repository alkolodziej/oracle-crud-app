import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { useFetchTables } from "../hooks/useFetchTables";
import { useFetchTableData } from "../hooks/useFetchTableData";
import apiClient from "../api/apiClient";

const TablesPage = () => {
  const [tableName, setTableName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newRow, setNewRow] = useState({});

  const [addDialogOpen, setAddDialogOpen] = useState(false); // Stan dla otwierania dialogu
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const confirm = useConfirm();

  const { data: tables, isLoading: isLoadingTables } = useFetchTables();
  const { data, isLoading, error } = useFetchTableData(tableName);

  const handleViewTable = (selectedTable) => {
    setTableName(selectedTable);
    setNewRow({});
  };

  const handleDelete = (id) => {
    confirm({
      description: `Czy na pewno chcesz usunąć pole o ID ${id}?`,
    })
      .then(() => {
        console.log(`Usunięto pole o ID ${id}`);
        // Logika usuwania
      })
      .catch(() => console.log("Usuwanie zostało przerwane"));
  };

  const handleEdit = (row) => {
    console.log("Edycja:", row);
    setEditDialogOpen(true);
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true); // Otwarcie dialogu dodawania
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false); // Zamknięcie dialogu
  };

  const handleAdd = () => {
    if (Object.keys(newRow).length === 0) {
      console.log("Brak danych do dodania");
      return;
    }
    if (!tableName) {
      console.log("Nie wybrano tabeli");
      return;
    }
    apiClient
      .post(`/add${tableName.toLowerCase()}`, newRow)
      .then((res) => {
        console.log("Dodano nowy rekord:", res.data);
        setNewRow({});
      })
      .catch((err) => {
        console.error("Błąd podczas dodawania nowego rekordu:", err);
      });

    };
    const handleInputChange = (e, column) => {
      setNewRow((prev) => ({ ...prev, [column.name]: e.target.value }));
    };

  return (
    <Box sx={{ padding: 4, maxWidth: "1200px", margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="table-name-label">Wybierz tabelę</InputLabel>
          <Select
            labelId="table-name-label"
            value={tableName}
            onChange={(e) => handleViewTable(e.target.value)}
            label="Wybierz tabelę"
          >
            {isLoadingTables ? (
              <MenuItem disabled>Ładowanie...</MenuItem>
            ) : (
              tables?.map((table) => (
                <MenuItem key={table} value={table}>
                  {table}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField
          label="Szukaj"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginLeft: 2, flex: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddDialogOpen}
          sx={{ marginLeft: 2, height: 56 }}
          disabled={!tableName} // Wyłączenie przycisku, jeśli nie wybrano tabeli
        >
          Dodaj do tabeli
        </Button>
      </Box>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">
          Wystąpił błąd podczas pobierania danych: {error.message}
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              {/* Zabezpieczenie przed brakiem columns */}
              {data?.columns && data.columns.length > 0 ? (
                data.columns.map((col) => (
                  <TableCell key={col.name}>{col.name}</TableCell>
                ))
              ) : (
                <TableCell>Brak kolumn</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.rows && data.rows.length > 0 ? (
              data.rows.map((row, index) => (
                <TableRow key={index}>
                  {/* Zabezpieczenie dla mapowania kolumn */}
                  {data.columns.map((col) => (
                    <TableCell key={col.name}>
                      {col.name === "Action" ? (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(row)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(row.id)}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      ) : (
                        row[col.name.toLowerCase()] || "-"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={data?.columns?.length || 1} align="center">
                  Brak dostępnych danych.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edytuj dane</DialogTitle>
        <DialogContent>
          <Typography>Form to edit data (to be implemented).</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Anuluj</Button>
          <Button variant="contained" color="primary">
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog do dodawania danych */}
      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle>Dodaj dane do tabeli</DialogTitle>
        <DialogContent>
          {data?.columns && (
            <Box sx={{ display: "flex", flexDirection: "column", my:1 }}>
              {data.columns.map((column) => (
                <TextField
                  key={column.name}
                  label={column.name}
                  variant="outlined"
                  value={newRow[column.name] || ""}
                  onChange={(e) => handleInputChange(e, column)}
                  sx={{ marginBottom: 2 }}
                  disabled={column.name?.toLowerCase() === "id"} // Wyłączenie pola ID
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Anuluj</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            disabled={!tableName || Object.keys(newRow).length === 0}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablesPage;
