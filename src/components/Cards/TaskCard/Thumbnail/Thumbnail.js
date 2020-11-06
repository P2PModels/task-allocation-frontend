import React from 'react'
import { Box, CardMedia } from '@material-ui/core'
import PlayArrow from '@material-ui/icons/PlayArrow'
import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

import VideoTag from './VideoTag'
import NoThumbnail from 'assets/NoThumbnail.jpg'

import languageCodes from 'helpers/language-codes'

const useStyles = makeStyles(theme => ({
  imageWrapper: {
    width: '150px',
    height: '150px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  playButton: {
    position: 'absolute',
    cursor: 'pointer',
    top: 50,
    left: 130,
    fontSize: 80,
    color: green.A700,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.3)',
    },
  },
}))

const Thumbnail = ({ video, targetLanguage, onClickHandler }) => {
  const { media, playButton } = useStyles()
  const { thumbnail, duration, title, all_urls: allUrls } = video

  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  const timeDuration = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`

  return (
    <Box position="relative" onClick={onClickHandler}>
      <VideoTag
        label={languageCodes[targetLanguage]}
        boxProps={{ top: 0, left: 0, maxWidth: 1 / 2 }}
      />
      <VideoTag label={timeDuration} boxProps={{ top: 0, right: 0 }} />
      <CardMedia className={media} image={thumbnail || NoThumbnail}>
        <a
          href={allUrls ? allUrls[0] : '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PlayArrow className={playButton} />
        </a>
      </CardMedia>
      {/* maxWidth = 1 so noWrap works */}
      <VideoTag label={title} boxProps={{ left: 0, bottom: 0, maxWidth: 1 }} />
    </Box>
  )
}

export default Thumbnail
