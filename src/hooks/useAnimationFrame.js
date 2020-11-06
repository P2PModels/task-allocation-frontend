import { useEffect, useCallback, useRef } from 'react'

const useAnimationFrame = (interval = 1000, callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef()
  const previousTimeRef = useRef()
  const accumulatedTime = useRef()

  const animate = useCallback(
    time => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current

        accumulatedTime.current += deltaTime
        if (accumulatedTime.current > interval) {
          // console.log('[useAnimationFrame] calling callback...')
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
    console.log('[useEffect useAnimationFrame]')
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [animate]) // Make sure the effect runs only once
}

export default useAnimationFrame
