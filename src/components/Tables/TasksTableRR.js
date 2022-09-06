import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from '@material-ui/icons/Refresh'
import { getTime } from '../../helpers/date-helpers'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    lastUpdateCell: {
        color: '#676767',
        backgroundColor: '#fff',
    },
})

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell)

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow)

const TasksTable = ({ tasks }) => {
    const classes = useStyles()

    return tasks ? (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label="Tasks Table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">
                            Task Id
                        </StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                        <StyledTableCell align="center">
                            End date
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            Assigned to
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks == null ? (
                        <StyledTableRow>
                            <StyledTableCell
                                componenet="th"
                                scope="row"
                                colSpan="4"
                                align="left"
                            >
                                Loading data...
                            </StyledTableCell>
                        </StyledTableRow>
                    ) : !tasks.length ? (
                        <StyledTableRow>
                            <StyledTableCell
                                componenet="th"
                                scope="row"
                                colSpan="4"
                                align="center"
                            >
                                No tasks
                            </StyledTableCell>
                        </StyledTableRow>
                    ) : (
                        tasks.map(task => (
                            <StyledTableRow key={task.id}>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    align="center"
                                >
                                    {task.id}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {task.status}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {task.endDate
                                        ? new Date(
                                              task.endDate
                                          ).toLocaleTimeString()
                                        : '--'}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {task.userId ? task.userId : '--'}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                    <StyledTableRow key="last-update-trow">
                        <StyledTableCell className={classes.lastUpdateCell}>
                            {`Last update ${new Date(
                                Date.now()
                            ).toLocaleTimeString()}`}
                        </StyledTableCell>
                    </StyledTableRow>
                </TableBody>
            </Table>
        </TableContainer>
    ) : (
        <></>
    )
}

export default TasksTable
