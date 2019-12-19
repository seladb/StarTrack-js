import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    width: 900,
    marginTop: 20,
  },

  paper: {
    padding: theme.spacing(1, 1),
    height: 900,
  },
}));

function Chart() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
      </Paper>
    </Container>
  )
}

export default Chart