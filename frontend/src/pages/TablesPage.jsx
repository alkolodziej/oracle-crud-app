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
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { useFetchTables } from "../hooks/useFetchTables";
import { useFetchTableData } from "../hooks/useFetchTableData";
import apiClient from "../api/apiClient";
import DataDialog from "../components/DataDialog";

const TablesPage = () => {
  const [tableName, setTableName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentRow, setCurrentRow] = useState({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const confirm = useConfirm();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // Możliwe wartości: "success", "error", "info", "warning"
  });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const { data: tables, isLoading: isLoadingTables } = useFetchTables();
  const { data, isLoading, error, refetch } = useFetchTableData(tableName);

  const handleViewTable = (selectedTable) => {
    setTableName(selectedTable);
    setSearchTerm("");
    setCurrentRow({});
    showSnackbar(`Trwa ładowanie tabeli: ${selectedTable}`, "info");
  };

  const handleDelete = (id) => {
    console.log(id);
    confirm({
      description: `Czy na pewno chcesz usunąć pole o ID ${id}?`,
    })
      .then(() => {
        apiClient
          .post(`/delete${tableName.toLowerCase()}/${id}`) // Wywołanie endpointu usuwania
          .then((response) => {
            console.log(`Usunięto pole o ID ${id}`);
            showSnackbar(`Usunięto pole o ID ${id}`, "success");
            refetch(); // Odświeżenie danych po usunięciu
          })
          .catch((error) => {
            console.error("Błąd podczas usuwania:", error);
            showSnackbar("Usuwanie się nie powiodło", "error");
          });
      })
      .catch(() => {
        console.log("Usuwanie się nie powiodło");
        showSnackbar("Usuwanie się nie powiodło", "error");
      });
  };

  const handleEdit = (row) => {
    console.log("Edycja:", row);
    handleEditDialogOpen(row);
  };

  const handleAddDialogOpen = () => {
    setDialogMode("add");
    setCurrentRow({});
    setDialogOpen(true);
  };

  const handleEditDialogOpen = (row) => {
    setDialogMode("edit");
    setCurrentRow(row);
    setDialogOpen(true);
  };

  const handleSave = (formData) => {
    if (!formData || Object.keys(formData).length === 0) {
      console.log("Brak danych do zapisania");
      showSnackbar("Brak danych do zapisania", "warning");
      return false;
    }

    if (!tableName) {
      console.log("Nie wybrano tabeli");
      showSnackbar("Nie wybrano tabeli", "error");
      return false;
    }

    const apiEndpoint =
      dialogMode === "edit"
        ? `/update${tableName.toLowerCase()}/${formData.id}`
        : `/add${tableName.toLowerCase()}`;

    const apiRequest = apiClient.post(apiEndpoint, formData);

    apiRequest
      .then((res) => {
        const action = dialogMode === "edit" ? "zaktualizowano" : "dodano";
        console.log(
          `${action.charAt(0).toUpperCase() + action.slice(1)} rekord:`,
          res.data
        );
        // setDialogOpen(false);
        showSnackbar(`Pomyślnie ${action} rekord!`, "success");
        refetch();
        return true;
      })
      .catch((err) => {
        console.error(
          `Błąd podczas ${
            dialogMode === "edit" ? "aktualizacji" : "dodawania"
          } rekordu:`,
          err
        );
        showSnackbar(
          `Błąd podczas ${
            dialogMode === "edit" ? "aktualizacji" : "dodawania"
          } rekordu`,
          "error"
        );
        return false;
      });
  };

  const handleInputChange = (e, column) => {
    setCurrentRow((prev) => ({
      ...prev,
      [column.name?.toLowerCase()]: e.target.value,
    }));
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
              {data && data.columns && data.columns.length > 0 ? (
                <>
                  {data.columns.map((col) => (
                    <TableCell key={col.name}>{col.name}</TableCell>
                  ))}
                  <TableCell>Akcje</TableCell>
                </>
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
                  {[...data.columns, { name: "Action" }].map((col, i) => (
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
      <DataDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        columns={data?.columns || []}
        initialData={dialogMode === "edit" ? currentRow : {}}
        dialogTitle={dialogMode === "edit" ? "Edytuj dane" : "Dodaj dane"}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TablesPage;
