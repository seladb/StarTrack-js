import Footer from "../../components/Footer";
import MainContainer from "../../components/MainContainer";
import TopNav from "../../components/TopNav";
import { AlertContextProvider } from "../../shared/AlertContext";
import { ProgressProvider } from "../../shared/ProgressContext";
import { Box } from "@mui/material";

export default function MainPage() {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: "1 0 auto" }}>
        <AlertContextProvider>
          <TopNav />
          <ProgressProvider>
            <MainContainer />
          </ProgressProvider>
        </AlertContextProvider>
      </Box>
      <Footer />
    </Box>
  );
}
