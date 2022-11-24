import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, Chip, CardContent } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import { getPriority } from '../../../helpers/amara-helpers'
import Thumbnail from './Thumbnail/Thumbnail'
import Details from './Details'
import Timer from './Timer'
import ActionButton from '../../Buttons/ActionButton'
import { useAppState } from '../../../contexts/AppState'

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 280,
    },
    chip: {
        backgroundColor: ({ priorityColor }) => priorityColor,
    },
    cardContent: {
        padding: 0,
        paddingTop: theme.spacing(2),
    },
}))

const TaskCard = ({
    task,
    video,
    actionButtons = [],
    onTaskTimeout = () => {},
}) => {
    // TODO: Need to set a priority field on contract task struct
    const { endDate, reallocationTime } = task.contractData
    const priority = getPriority(reallocationTime)
    const theme = useTheme()
    const { palette } = theme
    const { root, chip, cardContent, timer } = useStyles({
        priorityColor: palette.chips[priority],
    })
    // Show timer only if task has end date and is not already accepted
    const showTimer =
        !(
            actionButtons.length === 1 &&
            actionButtons[0].label.toLowerCase() === 'translate'
        ) && task.contractData.endDate

    let nowString = new Date(Date.now() + 1999).toLocaleTimeString()
    let endTimeString = new Date(task.contractData.endDate * 1000 ).toLocaleTimeString()

    // If timed out dont render, substract 1s to make sure,timer is not reliable
    if(task.contractData.endDate * 1000 <= Date.now() + 1999) return null
    
    return (
        <Card className={root} elevation={0}>
            <Box mb={0.5} pt={1}>
                <Grid
                    container
                    direction="row"
                    justify={!showTimer ? 'flex-end' : 'space-between'}
                    alignItems="center"
                >
                    {!showTimer ? null : (
                        <Grid item>
                            <Timer
                                end={new Date(endDate * 1000)}
                                onTimeOut={() => {
                                    console.log(`        ${task.contractData.id} I'm substractiing!`)
                                    onTaskTimeout()
                                }}
                            />
                        </Grid>
                    )}
                    <Grid item>
                        <Chip
                            className={chip}
                            color="secondary"
                            label={<strong>{priority} priority</strong>}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Thumbnail video={video} targetLanguage={task.language} />
            <CardContent className={cardContent}>
                <Details task={task} video={video} />
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                >
                    {actionButtons.map(
                        (
                            {
                                label,
                                color,
                                variant,
                                actionHandler,
                                disabled,
                                ...buttonProps
                            },
                            index,
                            arr
                        ) => (
                            <ActionButton
                                key={label}
                                label={label}
                                color={color}
                                variant={variant}
                                fullWidth={arr.length === 1}
                                disabled={disabled}
                                onClick={() => actionHandler(task)}
                                {...buttonProps}
                            />
                        )
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}

TaskCard.propTypes = {
    task: PropTypes.object.isRequired,
    actionButtons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            color: PropTypes.string,
            variant: PropTypes.string,
            actionHandler: PropTypes.func,
        })
    ),
}

export default TaskCard
