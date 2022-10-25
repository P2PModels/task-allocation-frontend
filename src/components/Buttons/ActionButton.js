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
        borderRadius: 0,
        '&:hover': {
            backgroundColor: ({ hoverColor }) => hoverColor,
        },
    },
}))

function ActionButton({
    label,
    color,
    variant,
    fullWidth = false,
    disabled = false,
    onClick,
    ...props
}) {
    const { actionButton } = useStyles({
        color: color,
        hoverColor: lightenDarkenColor(color, -20),
    })

    return (
        <Button
            variant={variant}
            className={actionButton}
            onClick={onClick}
            fullWidth={fullWidth}
            disabled={disabled}
            {...props}
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
