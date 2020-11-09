import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Button, DialogActions } from '@material-ui/core'

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
}))

const TransactionModal = ({ modalContent, open, onClose }) => {
  const { title, message, createTransactionHandler } = modalContent
  const { titleWrapper, operationTitle, modalTitle, closeButton } = useStyles()
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <div className={titleWrapper}>
          <InfoOutlined color="primary" fontSize="large" />
          <span className={modalTitle}>
            Perform operation: <span className={operationTitle}>{title}</span>
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
          >
            Create Transaction
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionModal
