import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import { Box, Typography, Grid } from '@material-ui/core'
import useAnimationFrame from '../../../hooks/useAnimationFrame'
import { difference, formatHtmlDatetime } from '../../../helpers/date-helpers'
import { unselectable } from '../../../helpers/css-helpers'

const useStyles = makeStyles(theme => ({
    timer: {
        whiteSpace: 'nowrap',
        ...unselectable(),
    },
    clockIconWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(0.1),
    },
    timeTextWrapper: {
        padding: '0 0 0 .25rem',
    },
    timeText: {
        fontSize: 12,
    },
    timeUnit: {
        display: 'inline-flex',
        alignItems: 'baseline',
        // justifyContent: 'space-between',
        minWidth: 31,
    },
    separator: {
        marginTop: 0,
        marginRight: theme.spacing(0.3),
        marginLeft: theme.spacing(0.3),
        fontWeight: 400,
    },
}))

const RENDER_EVERY = 1000

const formatUnit = v => String(v).padStart(2, '0')

const formats = {
    yMdhms: 'yMdhms',
    yMdhm: 'yMdhm',
    yMdh: 'yMdh',
    yMd: 'yMd',
    yM: 'yM',
    Mdhms: 'Mdhms',
    Mdhm: 'Mdhm',
    Mdh: 'Mdh',
    Md: 'Md',
    dhms: 'dhms',
    dhm: 'dhm',
    hms: 'hms',
    hm: 'hm',
    ms: 'ms',
    m: 'm',
    s: 's',
}

const unitNames = {
    y: 'years',
    M: 'months',
    d: 'days',
    h: 'hours',
    m: 'minutes',
    s: 'seconds',
}

const getFormat = format =>
    ['y', 'M', 'd', 'h', 'm', 's'].reduce(
        (units, symbol) =>
            formats[format].includes(symbol)
                ? [...units, unitNames[symbol]]
                : units,
        []
    )

function getTime(start, end, format, showEmpty, maxUnits) {
    const date1 = end || new Date()
    const date2 = end ? new Date() : start

    const totalInSeconds = dayjs(date1).diff(date2, 'seconds')

    const { years, months, days, hours, minutes, seconds } = difference(
        date1,
        date2,
        { keepLeadingZeros: showEmpty, maxUnits, units: format }
    )

    return {
        units: [
            ['Y', years],
            ['M', months],
            ['D', days],
            ['H', hours],
            ['M', minutes],
            ['S', seconds],
        ],
        totalInSeconds,
    }
}

const Timer = ({
    start,
    end,
    format = formats.hms,
    showEmpty = false,
    maxUnits = -1,
    showIcon = true,
    onTimeOut = () => {},
}) => {
    const {
        timer,
        clockIconWrapper,
        timeUnit,
        separator,
        timeTextWrapper,
        timeText,
    } = useStyles()
    const theme = useTheme()
    // Need to check if component is mounted to update timer
    const isMountedRef = useRef(false)
    const computedFormat = useMemo(() => getFormat(format), [format])
    const [time, setTime] = useState(
        getTime(start, end, computedFormat, showEmpty, maxUnits)
    )
    const { totalInSeconds, units } = time
    const lastUnitIndex = units.reduce(
        (lastIndex, unit, index) => (unit[1] === null ? lastIndex : index),
        0
    )

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    const updateTime = useCallback(() => {
        const t = getTime(start, end, computedFormat, showEmpty, maxUnits)
        if (t.totalInSeconds === 0) {
            onTimeOut()
        }
        if (isMountedRef.current) {
            setTime(t)
        }
    }, [start, end, computedFormat, showEmpty, maxUnits, onTimeOut])

    useAnimationFrame(RENDER_EVERY, updateTime)

    if (totalInSeconds < 0 || Object.is(totalInSeconds, -0)) {
        return (
            <Typography variant="body2" color="textSecondary">
                {end ? 'Time out' : '−'}
            </Typography>
        )
    }

    return (
        <time className={timer} dateTime={formatHtmlDatetime(end || start)}>
            <Grid
                container
                direction="row"
                alignItems="center"
                justify="center"
            >
                <Grid item>
                    {showIcon && (
                        <span className={clockIconWrapper}>
                            <AccessTimeIcon
                                style={{
                                    color: theme.palette.text.secondary,
                                    fontSize: 20,
                                }}
                            />
                        </span>
                    )}
                </Grid>
                <Grid item className={timeTextWrapper}>
                    <Typography variant="subtitle1" color="textSecondary">
                        {units.map((unit, index) => {
                            const isLast = index === lastUnitIndex
                            const isSeconds = index === units.length - 1

                            // Only time units (hours, minutes and seconds).
                            // Remember to update if ms gets added one day!
                            const isTimeUnit = index >= units.length - 3

                            if (unit[1] === null) {
                                return null
                            }

                            return (
                                <React.Fragment key={index}>
                                    <span
                                        className={
                                            isSeconds
                                                ? clsx(timeText, timeUnit)
                                                : timeText
                                        }
                                    >
                                        {formatUnit(unit[1])}
                                        <Box component="span" ml={0.2}>
                                            {unit[0]}
                                        </Box>
                                    </span>
                                    {!isLast && (
                                        <span className={separator}>
                                            {isTimeUnit && ':'}
                                        </span>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </Typography>
                </Grid>
            </Grid>
        </time>
    )
}

Timer.propTypes = {
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    format: PropTypes.oneOf(Object.keys(formats)),
    showEmpty: PropTypes.bool,
    maxUnits: PropTypes.number,
    showIcon: PropTypes.bool,
}

export default Timer
