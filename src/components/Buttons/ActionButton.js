import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { lightenDarkenColor } from '../../helpers/css-helpers'

const useStyles = makeStyles(() => ({
  actionButton: {
    background: ({ color }) => color,
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: ({ hoverColor }) => hoverColor,
    },
  },
}))

function ActionButton({
  label,
  color,
  fullWidth = false,
  disabled = false,
  onClick,
}) {
  const { actionButton } = useStyles({
    color: color,
    hoverColor: lightenDarkenColor(color, -20),
  })

  return (
    <Button
      variant="contained"
      className={actionButton}
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={disabled}
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
