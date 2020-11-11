import { useState, useEffect } from 'react'
import { useUserSubscription } from './useSubscriptions'
import { mergeTaskData, mergeUserData } from '../helpers/data-transform-helpers'
import { buildMapById } from '../helpers/general-helpers'
import AmaraApi from '../amara-api'

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
  const contractUser = useUserSubscription(userId)

  const [amaraUser, setAmaraUser] = useState(null)
  const [videosRegistry, setVideosRegistry] = useState(null)
  const [allocatedTasks, setAllocatedTasks] = useState(null)
  const [acceptedTasks, setAcceptedTasks] = useState(null)

  // Fetch Amara user data
  useEffect(() => {
    async function getAmaraUser() {
      // Get Amara user data
      const t0 = performance.now()
      const { data: user } = await AmaraApi.users.getOne(userId)

      const t1 = performance.now()

      console.log(`[useEffect] get Amara user: ${(t1 - t0) / 1000}`)
      setAmaraUser(user)
    }

    if (!userId) {
      return
    }

    getAmaraUser()
    return () => {}
  }, [userId])

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
    if (!amaraUser || !amaraUser.teams || !amaraUser.teams.length) {
      return
    }

    getTeamVideos(amaraUser)

    return () => {}
  }, [amaraUser])
  // Fetch allocated tasks
  useEffect(() => {
    if (!contractUser || !amaraUser) {
      return
    }

    getTasks(contractUser.allocatedTasks, amaraUser).then(allocatedTasks =>
      setAllocatedTasks(allocatedTasks)
    )
    return () => {}
  }, [contractUser, amaraUser])

  // Fetch accepted tasks
  useEffect(() => {
    if (!contractUser || !amaraUser) {
      return
    }
    getTasks(contractUser.acceptedTasks, amaraUser).then(acceptedTasks =>
      setAcceptedTasks(acceptedTasks)
    )
    return () => {}
  }, [contractUser, amaraUser])

  const loadingData =
    !contractUser ||
    !videosRegistry ||
    !acceptedTasks ||
    !allocatedTasks ||
    !amaraUser

  return {
    allocatedTasks,
    acceptedTasks,
    videosRegistry,
    user:
      contractUser && amaraUser ? mergeUserData(contractUser, amaraUser) : null,
    loadingAppLogic: loadingData,
  }
}

export default useUserLogic

// useEffect(() => {
//   async function getTeamVideos()
// }, [amaraUser])

// useEffect(() => {
//   async function getTasks({ allocatedTasks = [], acceptedTasks = [] }, user) {
//     const { teams, apiKey } = user
//     const t0 = performance.now()

//     if (teams && teams.length) {
//       const { name: teamName } = teams[0]

//       AmaraApi.setApiKeyHeader(apiKey)

//       const allocatedTasksRequests = allocatedTasks.map(({ id }) => {
//         return AmaraApi.teams.getTeamSubtitleRequest(teamName, id)
//       })
//       const acceptedTasksRequests = acceptedTasks.map(({ id }) => {
//         return AmaraApi.teams.getTeamSubtitleRequest(teamName, id)
//       })

//       const responses = await Promise.all([
//         ...allocatedTasksRequests,
//         ...acceptedTasksRequests,
//       ])
//       const amaraTasks = responses.map(({ data }) => data)
//       const transformedAllocatedTasks = mergeTaskData(
//         contractUser.allocatedTasks,
//         amaraTasks
//       )
//       const transformedAcceptedTasks = mergeTaskData(
//         contractUser.acceptedTasks,
//         amaraTasks
//       )
//       const t1 = performance.now()
//       console.log(`[useEffect] getTasks: ${(t1 - t0) / 1000}`)
//       setUserTasks({
//         allocatedTasks: transformedAllocatedTasks,
//         acceptedTasks: transformedAcceptedTasks,
//       })
//     }
//   }

//   if (!contractUser || !amaraUser) {
//     return
//   }

//   getTasks(contractUser, amaraUser)
//   return () => {}
// }, [contractUser, amaraUser])
