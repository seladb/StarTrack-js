import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Paper, TextField, Container, Button } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 20,
    width: 650
  },

  paper: {
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
    height: 55,
  },
}));

function RepoDetails() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <TextField id="github-user" label="GitHub User" variant="outlined" className={classes.text}/>
        <TextField id="github-repo" label="GitHub Repo" variant="outlined" className={classes.text}/>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<SendIcon />}
          size="large"
          onClick={() => { console.log('onClick'); }}
        >
        Go
        </Button>
      </Paper>
    </Container>
  )
}

export default RepoDetails