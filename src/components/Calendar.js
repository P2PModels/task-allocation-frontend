import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
    Grid,
    Box,
    Modal,
    Typography,
    IconButton,
    Button,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const useStyles = makeStyles(theme => ({
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        // height: '80vh',
        boxShadow: 24,
        p: 4,
        backgroundColor: '#fff',
        '& div.fc': {
            // calendar styles
            marginBottom: '1.5rem',
        },
        '& .fc-scrollgrid': {
            border: 'none',
        },
        padding: '1rem',
    },
    closeButton: {
        color: theme.palette.grey[500],
        position: 'relative',
        top: '-.75rem',
        right: '-.75rem',
    },
    header1: {
        color: '#B3B5B8',
        fontSize: '.75rem',
        fontWeight: 'bold',
        letterSpacing: 0,
        textTransform: 'uppercase',
    },
    mainHeader: {
        color: '#333333',
        fontSize: '2rem',
        fontWeight: 300,
        letterSpacing: 0,
    },
    paragraph1: {
        color: '#333333',
        fontSize: '14px',
        letterSpacing: 0,
    },
    note: {
        color: '#333333',
        fontSize: '.75rem',
        fontWeight: 'bold',
        letterSpacing: 0,
        marginBottom: '1rem',
    },
    submitButton: {
        color: '#fff',
        backgroundColor: theme.palette.success.main,
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        },
    },
}))

const Calendar = ({ open, calendarRanges, onClose, onSubmit, ...props }) => {
    const {
        modalBox,
        closeButton,
        header1,
        mainHeader,
        paragraph1,
        note,
        submitButton,
    } = useStyles()
    const [events, setEvents] = useState([])

    useEffect(() => {
        let currentEvents = []
        if (
            calendarRanges.length === 2 &&
            calendarRanges[0] &&
            calendarRanges[1]
        ) {
            calendarRanges[0].map((startRange, i) => {
                let startRangeDate = new Date(startRange * 1000).toISOString()
                // Timestamps are stored in s in the blockchain and also in GMT+0, they get converted to client GMT time
                let endRangeDate = new Date(
                    calendarRanges[1][i] * 1000
                ).toISOString()
                // Timestamps are stored in s in the blockchain
                let newEventId = `event-${startRangeDate}-${endRangeDate}`
                currentEvents = [
                    ...currentEvents,
                    {
                        id: newEventId,
                        title: 'Working hours',
                        start: startRangeDate,
                        end: endRangeDate,
                    },
                ]
            })
            setEvents(currentEvents)
        }
    }, [calendarRanges])

    const updateEvents = (eventStart, eventEnd, id = null) => {
        let newEventId = `event-${eventStart}-${eventEnd}`
        setEvents(events => {
            // If event exists, delete it and create new with the current data
            if (id) {
                if (events.find(e => e.id === id)) {
                    let index = events.findIndex(e => e.id === id)
                    events.splice(index, 1)
                }
            }
            return [
                ...events,
                {
                    id: newEventId,
                    start: eventStart,
                    end: eventEnd,
                    title: 'Working hours',
                },
            ]
        })
    }

    const hanldeSelectClick = e => {
        updateEvents(
            new Date(e.startStr).toISOString(),
            new Date(e.endStr).toISOString()
        )
        let calendarApi = e.view.calendar
        calendarApi.unselect() // clear date selection
    }

    const handleDragEvent = e => {
        // Time zone offset has to be extracted due to the fact that fullcalendar is working with local GMT time while blockchain stores GMT+0
        // Time zone offset is in minutes, offset can be negative
        updateEvents(
            new Date(
                e.event._instance.range.start.getTime() +
                    e.event._instance.range.start.getTimezoneOffset() * 60000
            ).toISOString(),
            new Date(
                e.event._instance.range.end.getTime() +
                    e.event._instance.range.end.getTimezoneOffset() * 60000
            ).toISOString(),
            e.oldEvent._def.publicId
        )
        let calendarApi = e.view.calendar
        calendarApi.unselect() // clear date selection
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={modalBox}>
                <Grid container>
                    <Grid item sm={11}>
                        <Typography variant="h4" className={header1}>
                            Calendar to indicate your availability to accept
                            task
                        </Typography>
                        <Typography variant="h2" className={mainHeader}>
                            Please, select the time when you are available to
                            accept tasks
                        </Typography>
                        <Typography variant="body1" className={paragraph1}>
                            This doesn't mean you have to work on the tasks
                            during this time, it is primarily used by the
                            distribution system to assign you with tasks.
                        </Typography>
                        <Typography variant="body2" className={note}>
                            Remember you cannot select more than XX hours a day
                            and past time ranges will be ignored
                        </Typography>
                    </Grid>
                    <Grid item sm={1}>
                        <Grid container justify="flex-end">
                            <IconButton
                                aria-label="close"
                                className={closeButton}
                                onClick={() => {
                                    onClose()
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid item sm={12}>
                        <FullCalendar
                            events={events}
                            plugins={[
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin,
                            ]}
                            initialView="timeGridWeek" //first view = week with hours
                            headerToolbar={{
                                start: 'prev',
                                end: 'today next',
                            }}
                            startAccessor="start"
                            endAccessor="end"
                            select={hanldeSelectClick}
                            eventDrop={handleDragEvent}
                            eventColor="#b6daa7"
                            eventBorderColor="#87d666"
                            aspectRatio={2} //the smaller, the bigger the cells of the calendar
                            selectable={true} //Allows a user to highlight multiple days or timeslots by clicking and drag
                            editable={true}
                            selectMirror={true} //A value of true will draw a “placeholder” event while the user is dragging (similar to what Google Calendar does )
                            businessHours={{
                                startTime: '8:00', //moment().format('HH:mm'), /* Current Hour/Minute 24H format */
                                endTime: '20:00',
                                daysOfWeek: [1, 2, 3, 4, 5], // Day of week. If you don't set it, Sat/Sun are gray too
                            }} //try to put grey the days before today
                            nowIndicator={true}
                            allDaySlot={false}
                            scrollTime={'08:00:00'}
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <Grid container justify="center">
                            <Button
                                variant="contained"
                                className={submitButton}
                                onClick={() => {
                                    onClose()

                                    let calendarRanges = events.map(e => [
                                        new Date(e.start).getTime() / 1000,
                                        new Date(e.end).getTime() / 1000,
                                    ])

                                    calendarRanges.sort(
                                        (r1, r2) => r1[0] - r2[0]
                                    )

                                    let calendarRangesStart = []
                                    let calendarRangesEnd = []
                                    calendarRanges.map(range => {
                                        calendarRangesStart.push(range[0])
                                        calendarRangesEnd.push(range[1])
                                    })

                                    onSubmit(
                                        calendarRangesStart,
                                        calendarRangesEnd
                                    )
                                }}
                            >
                                Submit week availability
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}

export default Calendar
