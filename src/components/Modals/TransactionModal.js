import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import { makeStyles } from '@material-ui/core/styles'
import { Button, CircularProgress, DialogActions } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  modalTitle: {
    marginLeft: theme.spacing(1),
    color: ({ type }) =>
      type === 'error'
        ? theme.palette.secondary.light
        : theme.palette.primary.light,
  },
  operationTitle: {
    fontWeight: 700,
  },
  opacityWrapper: {
    opacity: 0.5,
  },
  activatingProgress: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
  opacityBackground: {
    backgroundColor: theme.palette.grey,
    cursor: ({ activating }) => (activating ? '' : 'pointer'),
  },
}))

const TransactionModal = ({
  modalContent,
  activating = true,
  open,
  onClose,
}) => {
  const { title, message, createTransactionHandler } = modalContent || {}
  const {
    titleWrapper,
    operationTitle,
    modalTitle,
    closeButton,
    opacityWrapper,
    activatingProgress,
    opacityBackground,
  } = useStyles(activating)
  return (
    <Dialog open={open} onClose={onClose}>
      <div className={opacityBackground}>
        <div className={activating ? opacityWrapper : null}>
          <DialogTitle>
            <div className={titleWrapper}>
              <InfoOutlined color="primary" fontSize="large" />
              <span className={modalTitle}>
                Perform operation:{' '}
                <span className={operationTitle}>{title}</span>
              </span>
            </div>
            <IconButton
              aria-label="close"
              className={closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{message}</DialogContentText>
            <DialogActions>
              <Button
                variant="outlined"
                color="primary"
                onClick={createTransactionHandler}
                disabled={activating}
              >
                Create Transaction
              </Button>
            </DialogActions>
          </DialogContent>
        </div>
      </div>
      {activating && <CircularProgress className={activatingProgress} />}
    </Dialog>
  )
}

export default TransactionModal
