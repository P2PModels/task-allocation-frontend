import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  actionButton: {
    background: ({ color }) => color,
    color: 'white',
    fontWeight: 'bold',
  },
}))

function ActionButton({ label, color, fullWidth = false, onClick }) {
  const { actionButton } = useStyles({ color })

  return (
    <Button
      variant="contained"
      className={actionButton}
      onClick={onClick}
      fullWidth={fullWidth}
    >
      {label}
    </Button>
  )
}

ActionButton.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
}

export default ActionButton
