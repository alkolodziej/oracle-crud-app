import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import isObjectEmpty from "../utils/isObjectEmpty";

const DataDialog = ({
  open,
  onClose,
  onSave,
  columns,
  initialData = {},
  dialogTitle = "Dodaj dane",
}) => {
  const [formData, setFormData] = useState(initialData);
  const handleInputChange = (e, column) => {
    setFormData((prev) => ({
      ...prev,
      [column.name?.toLowerCase()]: e.target.value,
    }));
  };

  const handleSave = () => {
    const ret = onSave(formData);
    console.log(ret)
    ret && onClose();
  };

  useEffect(() => {
    // if (!isObjectEmpty(initialData)) {
      setFormData(initialData);
    // }
  }, [initialData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        {columns && (
          <Box sx={{ display: "flex", flexDirection: "column", my: 1 }}>
            {columns.map((column) => (
              <TextField
                key={column.name}
                label={column.name}
                variant="outlined"
                value={formData[column.name?.toLowerCase()] || ""}
                onChange={(e) => handleInputChange(e, column)}
                sx={{ marginBottom: 2 }}
                disabled={column.name?.toLowerCase() === "id"} // Wyłączenie pola ID
              />
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={Object.keys(formData).length === 0}
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataDialog;
