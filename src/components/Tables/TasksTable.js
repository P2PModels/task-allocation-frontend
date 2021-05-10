import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
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
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Task Id</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Assigned to</TableCell>
            <TableCell align="right">Reassigned by</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="right">{row.user}</TableCell>
              <TableCell align="right">{row.reassignedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
