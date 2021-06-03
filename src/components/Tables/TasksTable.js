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
const { getContractStatus } = require('eth-manager')

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

const TasksTable = ({ refreshTable = false }) => {
  const classes = useStyles()
  const [tasks, setTasks] = React.useState([])
  const doUpdateTable = React.useRef(false)

  const getTasks = async () => {
    const tData = await getContractStatus()
    setTasks(JSON.parse(tData))
  }

  function updateTable() {
    setTasks([])
    getTasks()
  }

  React.useEffect(() => {
    if (!tasks.length) {
      updateTable()
    }
  }, [])

  function parseDate(dateToParse) {
    const dates = dateToParse.split('T')
    const day = dates[0].split('-')[2]
    const month = dates[0].split('-')[1]
    const year = dates[0].split('-')[0]
    // needed to add 2 hours to ajust to GMT+2 since
    // the time received is in GTM
    const hour = parseInt(dates[1].split(':')[0]) + 2
    const mins = dates[1].split(':')[1]
    return `${day}/${month}/${year} ${hour}:${mins}`
  }

  if (refreshTable) {
    if (!doUpdateTable.current) {
      updateTable()
      doUpdateTable.current = true
    }
  } else {
    doUpdateTable.current = false
  }

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader className={classes.table} aria-label="Tasks Table">
        <caption>
          <IconButton aria-label="Update Table" onClick={updateTable}>
            <RefreshIcon />
          </IconButton>
          Update Table
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
          {!tasks.length ? (
            <StyledTableRow>
              <StyledTableCell componenet="th" scope="row" colSpan="4">
                Loading data...
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            tasks.map(task => (
              <StyledTableRow key={task.id}>
                <StyledTableCell component="th" scope="row">
                  {task.id}
                </StyledTableCell>
                <StyledTableCell align="right">{task.status}</StyledTableCell>
                <StyledTableCell align="right">{task.user}</StyledTableCell>
                <StyledTableCell align="right">
                  {parseDate(task.reassignedBy)}
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TasksTable
