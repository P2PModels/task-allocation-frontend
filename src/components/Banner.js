import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Box, Fade } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.secondary,
        padding: theme.spacing(2, 0),
        position: 'relative',
        '&:before': {
            content: "''",
            display: 'block',
            width: '200vw',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '-100vw',
            backgroundColor: theme.palette.background.secondary,
            zIndex: '-1',
        },
    },
    title: {
        fontSize: '24px',
        lineHeight: '1.75rem',
        fontWeight: 300,
    },
    description: {
        fontSize: '14px',
        lineHeight: '1.25rem',
        fontWeight: 400,
    },
    textImgWrapper: {
        position: 'relative',
        height: '100%',
        overflow: 'visible',
        '& img': {
            height: '140px',
            width: 'auto',
            // objectFit: 'cover',
            position: 'absolute',
            bottom: theme.spacing(-2),
            left: '75%',
        },
    },
    h100: {
        height: '100%',
    },
}))

export default function Banner({ title, description, img, cta }) {
    const classes = useStyles()

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            className={classes.root}
        >
            <Fade in={true} style={{ transitionDelay: '300ms' }}>
                <Grid item lg={8} xl={6} className={classes.textImgWrapper}>
                    <Grid container direction="row" spacing={2}>
                        <Grid item lg={8} xl={9}>
                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                className={classes.h100}
                            >
                                <Grid item mb={1}>
                                    <Typography
                                        variant="h2"
                                        className={classes.title}
                                    >
                                        {title}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant="h5"
                                        className={classes.description}
                                    >
                                        {description}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={4} xl={3}>
                            <img src={img} alt="Model description image" />
                        </Grid>
                    </Grid>
                </Grid>
            </Fade>
            {cta ? (
                <Fade in={true} style={{ transitionDelay: '500ms' }}>
                    <Grid item lg={4} xl={6}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            className={classes.h100}
                        >
                            {cta}
                        </Grid>
                    </Grid>
                </Fade>
            ) : (
                <></>
            )}
        </Grid>
    )
}
