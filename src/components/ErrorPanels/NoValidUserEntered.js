import React from 'react'
import { Box, Grid, Typography } from '@material-ui/core'
import ErrorPanel from './ErrorPanel'

const NoValidUserEntered = () => {
  return (
    <ErrorPanel title="Couldn't find demo user">
      <Grid item>
        <Box mt={3} ml={1}>
          <Typography variant="body1">
            It seems the link you received isn&apos;t valid. Please ask the
            research team for a valid one.
          </Typography>
        </Box>
      </Grid>
    </ErrorPanel>
  )
}

export default NoValidUserEntered
