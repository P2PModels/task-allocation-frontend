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

const TxsTable = ({ txs }) => {
    return txs ? (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label="Transactions Table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">
                            Block number
                        </StyledTableCell>
                        <StyledTableCell align="center">To</StyledTableCell>
                        <StyledTableCell align="center">From</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {txs == null ? (
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
                    ) : !txs.length ? (
                        <StyledTableRow>
                            <StyledTableCell
                                componenet="th"
                                scope="row"
                                colSpan="4"
                                align="center"
                            >
                                No transactions
                            </StyledTableCell>
                        </StyledTableRow>
                    ) : (
                        txs.map(tx => (
                            <StyledTableRow key={tx.transactionHash}>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                    align="center"
                                >
                                    {tx.blockNumber}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {tx.to}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {tx.from}
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

export default TxsTable
