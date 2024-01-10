import { makeStyles, createStyles } from "@mui/styles";
import Footer from "../../components/Footer";
import MainContainer from "../../components/MainContainer";
import TopNav from "../../components/TopNav";
import { AlertContextProvider } from "../../shared/AlertContext";
import { ProgressProvider } from "../../shared/ProgressContext";

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    content: {
      flex: "1 0 auto",
    },
  });
});

export default function MainPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <AlertContextProvider>
          <TopNav />
          <ProgressProvider>
            <MainContainer />
          </ProgressProvider>
        </AlertContextProvider>
      </div>
      <Footer />
    </div>
  );
}
