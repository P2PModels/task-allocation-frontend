import { useState, useEffect } from 'react'
import { useAppState } from '../contexts/AppState'
import { useTasksForUserSubscription } from './useSubscriptions'
import { mergeTaskData, mergeUserData } from '../helpers/data-transform-helpers'
import { buildMapById } from '../helpers/general-helpers'
import AmaraApi from '../amara-api'
import { TaskStatuses } from '../types'
import { toBytes32 } from '../helpers/web3-helpers'

const { Assigned, Accepted } = TaskStatuses
async function getTasks(tasks, user) {
  const { teams, apiKey } = user

  if (teams && teams.length && tasks && tasks.length) {
    const { name: teamName } = teams[0]
    const t0 = performance.now()

    AmaraApi.setApiKeyHeader(apiKey)

    const tasksRequests = tasks.map(({ id }) => {
      return AmaraApi.teams.getTeamSubtitleRequest(teamName, id)
    })

    const responses = await Promise.all([...tasksRequests])
    const amaraTasks = responses.map(({ data }) => data)
    const transformedTasks = mergeTaskData(tasks, amaraTasks)
    const t1 = performance.now()

    console.log(`[useEffect] getTasks: ${(t1 - t0) / 1000}`)
    return transformedTasks
  }

  return []
}

function useUserLogic(userId) {
  const { roundRobinConnector } = useAppState()
  const contractUserAllocatedTasks = useTasksForUserSubscription(
    userId,
    Assigned
  )
  const contractUserAcceptedTasks = useTasksForUserSubscription(
    userId,
    Accepted
  )
  const [user, setUser] = useState(null)
  const [videosRegistry, setVideosRegistry] = useState(null)
  const [allocatedTasks, setAllocatedTasks] = useState(null)
  const [acceptedTasks, setAcceptedTasks] = useState(null)

  // Fetch Amara user data
  useEffect(() => {
    async function buildUser(userId) {
      try {
        const hexUserId = toBytes32(userId)

        const t0 = performance.now()

        const [rrUser, amaraUserRes] = await Promise.all([
          roundRobinConnector.user(hexUserId),
          AmaraApi.users.getOne(userId),
        ])

        const { data: amaraUser } = amaraUserRes
        const user = mergeUserData(rrUser, amaraUser)

        const t1 = performance.now()
        console.log(`[useEffect] get Amara user: ${(t1 - t0) / 1000}`)

        setUser(user)
      } catch (err) {
        setUser({})
      }
    }

    if (!roundRobinConnector) {
      return
    }

    if (!userId) {
      setUser({})
    }

    buildUser(userId)
    return () => {}
  }, [userId, roundRobinConnector])

  // Fetch team videos
  useEffect(() => {
    async function getTeamVideos(amaraUser) {
      const { teams } = amaraUser
      const t0 = performance.now()
      const {
        data: { objects: videos },
      } = await AmaraApi.videos.getAll({ team: teams[0].name })
      const videosMap = buildMapById(videos)

      const t1 = performance.now()
      console.log(`[useEffect] get Team videos: ${(t1 - t0) / 1000}`)

      setVideosRegistry(videosMap)
    }
    if (!user || !user.teams || !user.teams.length) {
      return
    }

    getTeamVideos(user)

    return () => {}
  }, [user])

  // Fetch allocated tasks
  useEffect(() => {
    if (!contractUserAllocatedTasks || !user) {
      return
    }
    console.log(`[useEffect] fetch allocated tasks`)
    getTasks(contractUserAllocatedTasks, user).then(allocatedTasks => {
      setAllocatedTasks(allocatedTasks)
    })

    return () => {}
  }, [contractUserAllocatedTasks, user])

  // Fetch accepted tasks
  useEffect(() => {
    if (!contractUserAcceptedTasks || !user) {
      return
    }

    getTasks(contractUserAcceptedTasks, user).then(acceptedTasks =>
      setAcceptedTasks(acceptedTasks)
    )

    return () => {}
  }, [contractUserAcceptedTasks, user])

  const loadingData =
    !user || !videosRegistry || !acceptedTasks || !allocatedTasks || !user

  return {
    allocatedTasks,
    acceptedTasks,
    videosRegistry,
    user,
    loadingAppLogic: loadingData,
  }
}

export default useUserLogic
