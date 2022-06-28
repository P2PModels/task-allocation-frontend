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

const useStyles = makeStyles({
    table: {
        minWidth: 650,
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

const UsersTable = ({ users }) => {
    const classes = useStyles()

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label="Transactions Table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">Id</StyledTableCell>
                        <StyledTableCell align="center">
                            Has task
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            Task id
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users == null ? (
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
                    ) : !users.length ? (
                        <StyledTableRow>
                            <StyledTableCell
                                componenet="th"
                                scope="row"
                                colSpan="4"
                                align="center"
                            >
                                No users
                            </StyledTableCell>
                        </StyledTableRow>
                    ) : (
                        users.map(user => (
                            <StyledTableRow key={user.id}>
                                <StyledTableCell
                                    align="center"
                                    component="th"
                                    scope="row"
                                >
                                    {user.id}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {user.hasTask ? '✔️' : '❌'}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {user.id}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default UsersTable
