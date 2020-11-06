import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import languageCodes from 'helpers/language-codes'

dayjs.extend(relativeTime)

const useStyles = makeStyles(theme => ({
  detailWrapper: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
}))

const Details = ({ task, video }) => {
  const subLanguages = video.languages
    .filter(({ published }) => published)
    .map(({ name }) => name.replace(',', ' -'))
  const formattedSubLanguages =
    subLanguages && subLanguages.length === 0
      ? `No subtitles published`
      : subLanguages.length === 1
      ? `${subLanguages[0]}`
      : `${subLanguages.slice(0, -1).join(', ')} and ${subLanguages.slice(-1)}`
  const dueDate = dayjs(task.due_date).isValid()
    ? `${dayjs(task.due_date).format('YYYY-MM-DD HH:mm')} 
    (${dayjs().to(task.due_date)})`
    : `No due date`

  return (
    <Box>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        DETAILS
      </Typography>
      <Detail name="Team" value={video && video.team} />
      <Detail name="Source team" value={video && video.team} />
      <Detail name="Video" value={video && video.title} />
      <Detail
        name="Video language"
        value={video && languageCodes[video.primary_audio_language_code]}
      />
      <Detail name="Subtitle language" value={formattedSubLanguages} />
      <Detail name="Request due date" value={dueDate} />
      {/* <Detail name="Guidelines" /> */}
    </Box>
  )
}

const Detail = ({ name, value }) => {
  const { detailWrapper } = useStyles()
  return (
    <Box>
      <Typography className={detailWrapper} variant="body2" gutterBottom>
        <strong>{name}: </strong>
        {value || 'Unknown'}
      </Typography>
    </Box>
  )
}

export default Details
