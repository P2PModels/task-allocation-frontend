import React from 'react'
import AmaraLogo from '../assets/Logo.svg'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  logoWrapper: {
    position: 'relative',
    margin: `${theme.spacing(1)}px 0`,
    cursor: 'default',
    userSelect: 'none',
  },
  subtitle: {
    position: 'absolute',
    top: theme.spacing(2.5),
    left: theme.spacing(5.25),
    color: theme.palette.secondary.light,
  },
}))

const Logo = () => {
  const { logoWrapper, subtitle } = useStyles()
  return (
    <div>
      <div className={logoWrapper}>
        <img src={AmaraLogo} />
        <Typography className={subtitle} variant="body1">
          assignments
        </Typography>
      </div>
    </div>
  )
}

export default Logo
