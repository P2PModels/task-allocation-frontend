import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, useTheme, Box } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'

import TaskCard from '../Cards/TaskCard/TaskCard'

// TODO: https://blog.logrocket.com/the-material-ui-grid-system/
const RRTasksGroup = ({
  tasks,
  videoRegistry,
  totalPages = 1,
  actionButtons,
  onChangePage,
}) => {
  const theme = useTheme()
  const [checked, setChecked] = useState(true)

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="flex-start"
          spacing={5}
        >
          {tasks.map(t => (
            <Grid item key={t.job_id}>
              <TaskCard
                task={t}
                video={videoRegistry.get(t.video)}
                actionButtons={actionButtons}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      {totalPages > 1 && (
        <Grid item>
          <Box mt={5}>
            <Pagination
              count={totalPages}
              shape="round"
              color="primary"
              onChange={(e, value) => onChangePage(value)}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

RRTasksGroup.propTypes = {
  tasks: PropTypes.array,
  totalPages: PropTypes.number,
  onChangePage: PropTypes.func.isRequired,
}

export default RRTasksGroup
