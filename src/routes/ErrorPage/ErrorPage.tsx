import { Button, Typography, Box, Grid } from "@mui/material";
import { Illustration } from "./Illustration";
import { createStyles, makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    imageContainer: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: theme.breakpoints.values.sm,
      maxWidth: "100%",
    },
    image: {
      inset: 0,
      opacity: 0.03,
    },
  });
});

export default function ErrorPage() {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box className={classes.imageContainer}>
        <Illustration className={classes.image} />
      </Box>
      <Box maxWidth="sm">
        <Grid container rowSpacing={5}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
              Nothing to see here
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center">
              The page you are trying to open does not exist. You may have mistyped the address, or
              the page has been moved to another URL.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center">
              <Button LinkComponent={Link} href="/" variant="contained">
                Take me back to home page
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
