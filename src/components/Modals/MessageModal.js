import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import WarningOutlined from '@material-ui/icons/WarningOutlined'
import { makeStyles, useTheme } from '@material-ui/core/styles'

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
}))

function getIconType(messageType) {
  switch (messageType.toLowerCase()) {
    case 'error':
      return <ErrorOutline color="secondary" fontSize="large" />
    case 'warning':
      return <WarningOutlined fontSize="large" />
    case 'info':
      return <InfoOutlined color="primary" fontSize="large" />
    default:
      return null
  }
}

const MessageModal = ({
  type,
  title,
  message,
  showIcon = true,
  open,
  onClose,
}) => {
  const { titleWrapper, modalTitle, closeButton } = useStyles({ type })
  const messageIcon = getIconType(type)
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <div className={titleWrapper}>
          {showIcon && messageIcon}
          <span className={modalTitle}>{title}</span>
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
      </DialogContent>
    </Dialog>
  )
}

export default MessageModal
