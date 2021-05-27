import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

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

function createData(id, status, user, reassignedBy) {
  return { id, status, user, reassignedBy }
}
const rows = [
  createData('JS4TMAF', 'Assigned', 'p2pmodels.user2', '29/04/2021 17:27:45'),
  createData('0UTJG1S', 'Assigned', 'p2pmodels.user5', '29/04/2021 17:27:45'),
  createData('9AR30EW', 'Assigned', 'p2pmodels.user3', '29/04/2021 17:33:00'),
  createData('TNEYKA0', 'Assigned', 'p2pmodels.user5', '16/04/2021 10:01:33'),
]

export default function TasksTable() {
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader className={classes.table} aria-label="Tasks Table">
        <caption>
          <b>Information about tasks currently allocated</b>
        </caption>
        <TableHead>
          <TableRow>
            <StyledTableCell>Task Id</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
            <StyledTableCell align="right">Assigned to</StyledTableCell>
            <StyledTableCell align="right">Reassigned by</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.status}</StyledTableCell>
              <StyledTableCell align="right">{row.user}</StyledTableCell>
              <StyledTableCell align="right">
                {row.reassignedBy}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
