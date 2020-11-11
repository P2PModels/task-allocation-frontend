import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
  Slide,
  Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { connectorsByName } from '../../wallet-providers'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  providerItem: {
    cursor: ({ activating }) => (activating ? '' : 'pointer'),
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    opacity: ({ activating }) => (activating ? '0.5' : ''),
    '&:hover': {
      backgroundColor: ({ activating }) => (activating ? '' : '#F6F5F5'),
      transition: 'background-color 0.3s',
    },
  },
  dialogContent: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    border: '1px solid yelllow',
  },
  providerTitle: {},
  providerLogo: {
    width: '30%',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  activatingProgress: {
    position: 'absolute',
    top: '50%',
    left: '45%',
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide {...props} direction="down" timeout={500} ref={ref} />
})

const ProvidersModal = ({ open, activating, onSelect, onClose }) => {
  const { closeButton, activatingProgress } = useStyles()

  return (
    <div>
      <Dialog
        open={open}
        // fullWidth={true}
        // maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <strong>Select an account provider</strong>
          {onClose ? (
            <IconButton
              aria-label="close"
              className={closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" alignContent="center">
            {Object.keys(connectorsByName).map(key => {
              const { name, logo, connector } = connectorsByName[key]
              return (
                <div key={key}>
                  <ProviderItem
                    name={name}
                    logo={logo}
                    activating={activating}
                    onSelect={() => onSelect(connector)}
                  />
                  {activating && (
                    <CircularProgress className={activatingProgress} />
                  )}
                </div>
              )
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const ProviderItem = ({ logo, name, activating, onSelect }) => {
  const { providerItem, providerLogo } = useStyles({ activating })

  return (
    <Grid item className={providerItem} onClick={onSelect}>
      <img className={providerLogo} src={logo} />
      <Typography color="primary" variant="h5">
        {name}
      </Typography>
      Connect with your {name} account.
    </Grid>
  )
}

export default ProvidersModal
