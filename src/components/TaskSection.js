import React, { useState, useRef, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import { Grid, Typography, Box } from '@material-ui/core'
import FCFSTasksGroup from './TasksSection/FCFSTasksGroup'

const TASKS_PER_PAGE = 4

const useStyles = makeStyles(theme => ({
    title: {
        fontSize: '50px',
        lineHeight: '50px',
        fontWeight: 100,
    },
    description: {
        fontSize: '14px',
        lineHeight: '1.25rem',
        fontWeight: 400,
    },
}))

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
    description = '',
    emptyText,
    taskActionButtons = [],
}) => {
    const classes = useStyles()
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
        anchorRef.current.scrollIntoView({
            inline: 'start',
            behavior: 'smooth',
        })
        const init = (selectedPage - 1) * TASKS_PER_PAGE
        const end = init + TASKS_PER_PAGE
        setSelectedPage(selectedPage)
    }

    return (
        <Grid container direction="column">
            {tasks && tasks.length ? (
                <React.Fragment>
                    <Grid item>
                        <Box mb={1} ref={anchorRef}>
                            <Typography variant="h3" className={classes.title}>
                                {title}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="h5"
                                className={classes.description}
                            >
                                {description}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <FCFSTasksGroup
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
