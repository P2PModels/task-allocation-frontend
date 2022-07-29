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
import Timer from '../Cards/TaskCard/Timer'

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    timer: {
        color: theme.palette.primary.main,
    },
}))

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

const JobsTable = ({ jobs }) => {
    const classes = useStyles()

    return jobs ? (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label="Jobs Table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">
                            Timer id
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            Task id
                        </StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                        <StyledTableCell align="center">
                            Timer (s)
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {jobs == null ? (
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
                    ) : !jobs.length ? (
                        <StyledTableRow>
                            <StyledTableCell
                                componenet="th"
                                scope="row"
                                colSpan="4"
                                align="center"
                            >
                                No jobs
                            </StyledTableCell>
                        </StyledTableRow>
                    ) : (
                        jobs.map(job => (
                            <StyledTableRow key={job.id}>
                                <StyledTableCell align="center">
                                    {job.id}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {job.taskId}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {job.status}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Timer
                                        end={new Date(Date.now() + job.timeout)}
                                        className={classes.timer}
                                    />
                                </StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    ) : (
        <></>
    )
}

export default JobsTable
