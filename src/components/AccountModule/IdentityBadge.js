import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { shortenAddress } from '../../helpers/web3-helpers'
import { capitalizeFirstLetter } from '../../helpers/general-helpers'

import { Typography } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'

import Identicon from '../Identicon'

const RADIUS = 4

const useStyles = makeStyles(theme => ({
    wrapper: {
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        padding: theme.spacing(1),
        // paddingLeft: ({ icon }) => (icon ? 0 : 1.5) * theme.spacing(1),
        // paddingRight: ({ icon }) => (icon ? 0 : 1.5) * theme.spacing(1),
        borderRadius: ({ radius }) => radius,
    },
    addressWrapper: {
        overflow: 'hidden',
        maxWidth: theme.spacing(8) * 2,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        letterSpacing: 1,
        marginBottom: 0,
        '& p': {
            fontSize: '16px',
            lineHeight: '16px',
        },
    },
    rightSection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        maxHeight: '32px', // Identicon height
        paddingLeft: theme.spacing(1),
    },
    connectionMessage: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.success.main,
        '& span': {
            fontSize: '12px',
            lineHeight: '12px',
        },
        '& svg': {
            fontSize: '1rem',
            marginRight: '.1rem',
        },
    },
}))

const IdentityBadge = ({ entity, network }) => {
    const {
        wrapper,
        rightSection,
        addressWrapper,
        connectionMessage,
    } = useStyles({
        icon: true,
        radius: RADIUS,
    })
    // TODO: Check if entity is a valid address
    const shortAddress = shortenAddress(entity)
    return (
        <div className={wrapper}>
            <div
                css={`
                    position: relative;
                `}
            >
                <Identicon scale={1.3} radius={RADIUS} />
            </div>
            <div className={rightSection}>
                <div className={addressWrapper}>
                    <Typography variant="body1">{shortAddress}</Typography>
                </div>
                <div className={connectionMessage}>
                    <DoneIcon />
                    <Typography variant="caption">
                        {/* {hasNetworkMismatch ? 'Wrong network' : connectionMessage} */}
                        Connected to {capitalizeFirstLetter(network)}
                    </Typography>
                </div>
            </div>
        </div>
    )
}

export default IdentityBadge
