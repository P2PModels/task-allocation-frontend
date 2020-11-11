import React from 'react'
import { Grid, Paper, Typography, Fade } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ErrorOutline } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '30%',
    padding: theme.spacing(3),
  },
  titleWrapper: {
    color: theme.palette.error.light,
  },
}))

const ErrorPanel = ({ title, children }) => {
  const { wrapper, titleWrapper } = useStyles()

  return (
    <Fade in={true}>
      <Paper elevation={3} className={wrapper}>
        <Grid container direction="column">
          <Grid
            className={titleWrapper}
            container
            direction="row"
            alignItems="center"
            alignContent="center"
          >
            <ErrorOutline style={{ fontSize: 50, marginRight: 5 }} />
            <Typography variant="h4">{title}</Typography>
          </Grid>
          {children}
        </Grid>
      </Paper>
    </Fade>
  )
}

export default ErrorPanel
