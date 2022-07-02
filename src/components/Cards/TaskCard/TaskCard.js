import React, { useState } from 'react'
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
        // padding: theme.spacing(2),
    },
    chip: {
        backgroundColor: ({ priorityColor }) => priorityColor,
    },
    cardContent: {
        padding: 0,
        paddingTop: theme.spacing(2),
    },
}))

const TaskCard = ({ task, video, actionButtons = [] }) => {
    const [disabled, setDisabled] = useState(false)
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
        ) && task.endDate

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
                                end={endDate}
                                onTimeOut={() => setDisabled(true)}
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
                            { label, color, actionHandler, disabled },
                            index,
                            arr
                        ) => (
                            <ActionButton
                                key={label}
                                label={label}
                                color={color}
                                fullWidth={arr.length === 1}
                                disabled={disabled}
                                onClick={() => actionHandler(task)}
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
            actionHandler: PropTypes.func,
        })
    ),
}

export default TaskCard
