import { useEffect, useCallback, useRef } from 'react'

const useAnimationFrame = (interval = 1000, callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef()
  const previousTimeRef = useRef()
  const accumulatedTime = useRef()
  const stopSignalRef = useRef(false)

  const animate = useCallback(
    time => {
      if(stopSignalRef.current) return
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current

        accumulatedTime.current += deltaTime
        if (accumulatedTime.current > interval) {
          callback(accumulatedTime.current)
          accumulatedTime.current = 0
          
        }
      } else accumulatedTime.current = 0
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    },
    [callback, interval]
  )

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
  }, [animate]) // Make sure the effect runs only once

  const cancelAnimation = () => {
    cancelAnimationFrame(requestRef.current)
    stopSignalRef.current = true
  }
  return cancelAnimation
}

export default useAnimationFrame
