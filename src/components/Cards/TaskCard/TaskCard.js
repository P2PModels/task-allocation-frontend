import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, Chip, CardContent } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import { getPriority } from '../../../helpers/amara-helpers'
import Thumbnail from './Thumbnail/Thumbnail'
import Details from './Details'
import Timer from './Timer'
import ActionButton from '../../Buttons/ActionButton'

const useStyles = makeStyles(theme => ({
  root: {
    width: 330,
    // padding: theme.spacing(2),
  },
  chip: {
    backgroundColor: ({ priorityColor }) => priorityColor,
  },
}))

const TaskCard = ({ task, video, actionButtons = [] }) => {
  const [disabled, setDisabled] = useState(false)
  // TODO: Need to set a priority field on contract task struct
  const { endDate, reallocationTime } = task.contractData
  const priority = getPriority(reallocationTime)
  const theme = useTheme()
  const { palette } = theme
  const { root, chip } = useStyles({
    priorityColor: palette.chips[priority],
  })

  return (
    <Card className={root} elevation={5}>
      <Box mb={1} pt={1} pl={2} pr={2}>
        <Grid
          container
          direction="row"
          justify={actionButtons.length === 1 ? "flex-end" : "space-between"}
          alignItems="center"
        >
          {actionButtons.length === 1 &&
          actionButtons[0].label.toLowerCase() === 'translate' ? null : (
            <React.Fragment>
              <Grid item>
                <Timer end={endDate} onTimeOut={() => setDisabled(true)} />
              </Grid>
            </React.Fragment>
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
      <CardContent>
        <Details task={task} video={video} />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          {actionButtons.map(
            ({ label, color, actionHandler, disabled }, index, arr) => (
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
