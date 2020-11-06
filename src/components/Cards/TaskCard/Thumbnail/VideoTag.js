import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  videoTag: {
    cursor: 'default',
    overflow: 'hidden',
    backgroundColor: 'black',
    color: 'white',
    opacity: 0.6,
    padding: theme.spacing(0.7),
    fontWeight: 'bold',
  },
}))

function isEllipsisActivated(element) {
  return (
    element.offsetHeight < element.scrollHeight ||
    element.offsetWidth < element.scrollWidth
  )
}

const VideoTag = ({ label, boxProps = {} }) => {
  const { videoTag } = useStyles()
  const typographyEl = useRef(null)
  const [ellipsisActivated, setEllipsisActivated] = useState(false)

  useEffect(() => {
    if (isEllipsisActivated(typographyEl.current)) setEllipsisActivated(true)
    return () => {}
  }, [])

  const innerComponent = (
    <Box position="absolute" {...boxProps}>
      <Typography
        ref={typographyEl}
        className={videoTag}
        variant="subtitle2"
        noWrap
      >
        {label}
      </Typography>
    </Box>
  )
  return ellipsisActivated ? (
    <Tooltip arrow title={<Typography variant="subtitle2">{label}</Typography>}>
      {innerComponent}
    </Tooltip>
  ) : (
    innerComponent
  )
}

export default VideoTag
