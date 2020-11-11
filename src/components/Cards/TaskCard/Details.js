import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import languageCodes from '../../../language-codes'

dayjs.extend(relativeTime)

const useStyles = makeStyles(theme => ({
  detailWrapper: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
}))

const Details = ({ task, video = {} }) => {
  const { due_date } = task
  const {
    title,
    languages,
    team,
    primary_audio_language_code: audioLanguageCode,
  } = video
  const subLanguages = languages
    ? languages
        .filter(({ published }) => published)
        .map(({ name }) => name.replace(',', ' -'))
    : null
  const formattedSubLanguages =
    !subLanguages || subLanguages.length === 0
      ? `No subtitles published`
      : subLanguages.length === 1
      ? `${subLanguages[0]}`
      : `${subLanguages.slice(0, -1).join(', ')} and ${subLanguages.slice(-1)}`
  const dueDate = dayjs(due_date).isValid()
    ? `${dayjs(due_date).format('YYYY-MM-DD HH:mm')} 
    (${dayjs().to(due_date)})`
    : `No due date`

  return (
    <Box>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        DETAILS
      </Typography>
      <Detail name="Team" value={team} />
      <Detail name="Source team" value={team} />
      <Detail name="Video" value={title} />
      <Detail
        name="Video language"
        value={audioLanguageCode && languageCodes[audioLanguageCode]}
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
        {value || 'No Available'}
      </Typography>
    </Box>
  )
}

export default Details
