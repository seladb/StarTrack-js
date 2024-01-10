import { makeStyles, createStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    },
    paper: {
      padding: theme.spacing(3),
      textAlign: "center",
      color: theme.palette.text.secondary,
      maxWidth: 400,
    },
    errorMessage: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
  });
});

export default function ErrorPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h4" color="error" className={classes.errorMessage}>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1">
          Sorry, but an unexpected error occurred. Please try again later.
        </Typography>
        <Button variant="contained" color="primary" href="/">
          Go to Home
        </Button>
      </Paper>
    </div>
  );
}
