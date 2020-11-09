import React, { useState, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Grid, Typography, Box } from '@material-ui/core'
import RRTasksGroup from './TasksSection/RRTasksGroup'

const TASKS_PER_PAGE = 4

function computePageTasks(tasks, selectedPage) {
  if (!tasks) {
    return []
  }

  const init = (selectedPage - 1) * TASKS_PER_PAGE
  const end = init + TASKS_PER_PAGE

  return tasks.slice(init, end)
}

const TaskSection = ({
  tasks = [],
  videoRegistry = new Map(),
  title,
  emptyText,
  taskActionButtons = [],
}) => {
  const anchorRef = useRef(null)
  const [selectedPage, setSelectedPage] = useState(1)
  const currentTasks = useMemo(() => computePageTasks(tasks, selectedPage), [
    tasks,
    selectedPage,
  ])
  // const [tasks, setTasks] = useState(mockTasks.slice(0, TASKS_PER_PAGE))
  const totalPages = !tasks ? 0 : Math.ceil(tasks.length / TASKS_PER_PAGE)

  // TODO: Should call Amara API with limit and offset values.
  // Pagination on the server side
  const handleChangePage = selectedPage => {
    // TODO: Take into account navbar height when scrolling to title element. Scroll some additional pixels up.
    anchorRef.current.scrollIntoView({ inline: 'start', behavior: 'smooth' })
    // const init = (selectedPage - 1) * TASKS_PER_PAGE
    // const end = init + TASKS_PER_PAGE
    // console.log(mockTasks.slice(init, end))
    setSelectedPage(selectedPage)
  }

  return (
    <Grid container direction="column">
      {tasks && tasks.length ? (
        <React.Fragment>
          <Grid item>
            <Box mb={10} ref={anchorRef}>
              <Typography variant="h3">{title}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <RRTasksGroup
              tasks={currentTasks}
              videoRegistry={videoRegistry}
              actionButtons={taskActionButtons}
              totalPages={totalPages}
              totalTasks={tasks.length}
              tasksPerPage={TASKS_PER_PAGE}
              onChangePage={handleChangePage}
            />
          </Grid>
        </React.Fragment>
      ) : (
        <Grid item>
          <Typography variant="h4" color="textSecondary">
            {emptyText}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

TaskSection.propTypes = {
  task: PropTypes.array,
  title: PropTypes.string.isRequired,
  emptyText: PropTypes.string,
}

export default TaskSection
