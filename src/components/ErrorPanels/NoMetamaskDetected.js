import React from 'react'
import { Box, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ErrorPanel from './ErrorPanel'
import DownloadMetamask from '../../assets/DownloadMetamask.png'

const useStyles = makeStyles(theme => ({
  imageWrapper: {
    width: '35%',
    height: '35%',
  },
  downloadImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  link: {
    color: 'inherit',
  },
}))

const NoMetamaskDetected = () => {
  const { link, imageWrapper, downloadImage } = useStyles()
  const metamaskLinkDescription = 'What is Metamask and why do I need it?'
  const metamaskHelpGuideLink = 'https://decrypt.co/resources/metamask'
  const metamaskDownloadLink = 'https://metamask.io/download.html'
  return (
    <ErrorPanel title="No Metamask plugin detected">
      <Grid item>
        <Box mt={3} ml={1}>
          <Typography variant="body1">
            You need to install <strong>Metamask</strong> on your browser before
            using the prototype. Once you install it refresh the page.
          </Typography>

          <Typography variant="body1">
            <a
              className={link}
              href={metamaskHelpGuideLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {metamaskLinkDescription}
            </a>
          </Typography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="flex-end">
        <Box className={imageWrapper} mt={2}>
          <a
            href={metamaskDownloadLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={DownloadMetamask}
              alt="Download metamask"
              className={downloadImage}
            />
          </a>
        </Box>
      </Grid>
    </ErrorPanel>
  )
}

export default NoMetamaskDetected
