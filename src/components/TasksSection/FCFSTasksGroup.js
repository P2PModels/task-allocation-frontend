import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Box } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'

import TaskCard from '../Cards/TaskCard/TaskCard'

// TODO: https://blog.logrocket.com/the-material-ui-grid-system/
const FCFSTasksGroup = ({
    tasks,
    videoRegistry,
    totalPages = 1,
    actionButtons,
    onChangePage,
}) => {
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems={tasks.length > 1 ? 'center' : 'flex-start'}
        >
            <Grid item>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justify="space-between"
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

FCFSTasksGroup.propTypes = {
    tasks: PropTypes.array,
    totalPages: PropTypes.number,
    onChangePage: PropTypes.func.isRequired,
}

export default FCFSTasksGroup
