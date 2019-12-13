import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, TextField, Container, Button } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 1),
  },

  text: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },

  button: {
    margin: theme.spacing(1),
  },
}));

function RepoDetails() {
  const classes = useStyles();

  return (
    <Container maxWidth="md">
      <Paper className={classes.root}>
        <TextField id="github-user" label="GitHub User" variant="outlined" className={classes.text}/>
        <TextField id="github-repo" label="GitHub Repo" variant="outlined" className={classes.text}/>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<SendIcon />}
          size="large"
        >
        Go
        </Button>
      </Paper>
    </Container>
  )
}

export default RepoDetails