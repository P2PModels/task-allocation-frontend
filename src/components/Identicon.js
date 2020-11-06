import React from 'react'
import Blockies from 'react-blockies'
import { makeStyles } from '@material-ui/core/styles'

const PX_RATIO = typeof devicePixelRatio === 'undefined' ? 2 : devicePixelRatio
const BLOCKIES_SQUARES = 8 // commonly used to represent Ethereum addresses
const BASE_SCALE = 3

const useStyles = makeStyles(theme => ({
  main: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    overflow: 'hidden',
    width: ({ mainSize }) => mainSize,
    height: ({ mainSize }) => mainSize,
    borderRadius: ({ radius }) => radius,
  },
  blockiesOpacity: {
    opacity: ({ soften }) => 1 - soften,
  },
  blockiesScaling: {
    display: 'flex',
    width: ({ scalingSize }) => scalingSize,
    height: ({ scalingSize }) => scalingSize,
    background: '#fff',
  },
}))

const Identicon = ({
  address = '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
  scale = 1,
  radius = 0,
  soften = 0.3,
}) => {
  const blockiesScale = scale * BASE_SCALE
  const { main, blockiesOpacity, blockiesScaling } = useStyles({
    mainSize: BLOCKIES_SQUARES * blockiesScale,
    scalingSize: BLOCKIES_SQUARES * blockiesScale * PX_RATIO,
    radius,
    soften,
  })
  return (
    <div className={main}>
      <div className={blockiesScaling}>
        <div className={blockiesOpacity}>
          <Blockies
            seed={address.toLowerCase()}
            size={BLOCKIES_SQUARES}
            scale={blockiesScale * PX_RATIO}
          />
        </div>
      </div>
    </div>
  )
}

export default Identicon
