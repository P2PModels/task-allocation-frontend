import { Container as Grid } from '@material-ui/core'
import React from 'react'
import { Grid } from '@material-ui/core'
import DownloadMetamask from '../assets/DownloadMetamask.png'

const MetamaskRequired = () => {
  const message = 'Before starting to use the prototype, you need to install Metamask on your browser'
  return (
    <Grid>
      {message}
      <image src={DownloadMetamask} alt="Download metamask" />
    </Grid>
  )
}

export default MetamaskRequired
