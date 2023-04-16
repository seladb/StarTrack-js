import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React, { createContext, useContext } from "react";

type AlertDialogContextActions = {
  showAlert: (text: string) => void;
};

const AlertDialogContext = createContext({} as AlertDialogContextActions);

interface AlertContextProviderProps {
  children: React.ReactNode;
}

const AlertContextProvider: React.FC<AlertContextProviderProps> = ({ children }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");

  const showAlert = (text: string) => {
    setMessage(text);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialogContext.Provider value={{ showAlert }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" variant="filled">
          {message}
        </Alert>
      </Snackbar>
      {children}
    </AlertDialogContext.Provider>
  );
};

const useAlertDialog = (): AlertDialogContextActions => {
  const context = useContext(AlertDialogContext);

  if (!context || Object.keys(context).length === 0) {
    throw new Error("useAlertDialog must be used within an AlertContextProvider");
  }

  return context;
};

export { AlertContextProvider, useAlertDialog };
