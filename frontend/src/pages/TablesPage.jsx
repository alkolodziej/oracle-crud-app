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
import apiClient from "../api/apiClient";
import DataDialog from "../components/DataDialog";
import { useFetchTables } from "../hooks/useFetchTables";
import { useFetchTableData } from "../hooks/useFetchTableData";

const TablesPage = () => {
  const [tableName, setTableName] = useState("");
  const [file, setFile] = useState(null); // Przechowuje wybrany plik
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const confirm = useConfirm();

  const { data: tables, isLoading: isLoadingTables } = useFetchTables();
  const { data, isLoading, error, refetch } = useFetchTableData(tableName);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Przechowuje wybrany plik
  };

  const handleUpload = () => {
    if (!file) {
      showSnackbar("Nie wybrano pliku!", "warning");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
  
    apiClient
      .post(`/add${tableName.toLowerCase()}fromfile`, formData)
      .then(() => {
        showSnackbar("Plik został pomyślnie przesłany!", "success");
        setFile(null); // Resetowanie pliku po udanym przesłaniu
        refetch();
      })
      .catch(() => {
        showSnackbar("Błąd podczas przesyłania pliku.", "error");
      });
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredRows = data?.rows?.filter((row) => {
    if (!searchTerm) return true; // Jeśli brak terminu wyszukiwania, zwróć wszystkie wiersze
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
        <Box sx={{ padding: 4, maxWidth: "1500px", margin: "0 auto" }}>
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
            onChange={(e) => setTableName(e.target.value)}
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, padding: 2}}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <input
              accept=".json"
              type="file"
              onChange={handleFileChange}
              id="file-upload"
              style={{
                display: "none",
              }}
              disabled={!tableName || tableName.startsWith("v_")}
            />

            <label
              htmlFor="file-upload"
              style={{
                cursor: tableName && !tableName.startsWith("v_") ? "pointer" : "not-allowed",
                color: tableName && !tableName.startsWith("v_") ? "#000000" : "#a0a0a0",
                backgroundColor: tableName && !tableName.startsWith("v_")
                  ? "#ACCFFF"
                  : "#4c6cb1",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                textTransform: "none",
                display: "inline-block",
                textAlign: "center",
                transition: "background-color 0.3s, transform 0.3s",
                "&:hover": {
                  backgroundColor: tableName && !tableName.startsWith("v_")
                    ? "#0056b3"
                    : "#4c6cb1",
                  transform: tableName && !tableName.startsWith("v_") ? "scale(1.05)" : "none",
                },
              }}
            >
              {file ? file.name : "Wybierz plik"}
            </label>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || !tableName || tableName.startsWith("v_")}
            sx={{
              height: 56
            }}
          >
            Dodaj z pliku
          </Button>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ height: 56 }}
          disabled={!tableName || tableName.startsWith("v_")}
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
                  {!tableName.startsWith("v_") && <TableCell>Akcje</TableCell>}
                </>
              ) : (
                <TableCell>Brak kolumn</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows && filteredRows.length > 0 ? (
              filteredRows.map((row, index) => (
                <TableRow key={index}>
                  {[...data.columns, { name: "Action" }].map((col) => (
                    <TableCell key={col.name}>
                      {col.name === "Action" ? (
                        <>
                          {col.name === "Action" && !tableName.startsWith("v_") ? (
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
                  {searchTerm
                    ? `Brak wyników dla frazy: "${searchTerm}"`
                    : "Brak dostępnych danych."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

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
