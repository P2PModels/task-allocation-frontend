import { useState, useEffect } from 'react'
import { useFCFSUserQuery, useTasksQueryPolling } from './useRequests'
import { buildMapById } from '../helpers/general-helpers'
import AmaraApi from '../amara-api'
import { mergeTaskData } from '../helpers/data-transform-helpers'

async function getTasks(tasks, user) {
    const { teams, apiKey } = user

    if (teams && teams.length && tasks && tasks.length) {
        const { name: teamName } = teams[0]

        AmaraApi.setApiKeyHeader(apiKey)

        const tasksRequests = tasks.map(({ id }) => {
            return AmaraApi.teams.getTeamSubtitleRequest(teamName, id)
        })

        const responses = await Promise.all([...tasksRequests])
        const amaraTasks = responses.map(({ data }) => data)
        const transformedTasks = mergeTaskData(tasks, amaraTasks)

        return transformedTasks
    }

    return []
}

function useUserLogicFCFS(userId) {
    const contractUser = useFCFSUserQuery(userId)
    const contractTasks = useTasksQueryPolling()
    const [user, setUser] = useState()
    const [tasks, setTasks] = useState()
    const [videosRegistry, setVideosRegistry] = useState(null)

    // Fetch Amara user data
    useEffect(() => {
        async function buildUser(userId) {
            try {
                const amaraUserRes = await AmaraApi.users.getOne(userId)
                const amaraUser = { ...amaraUserRes.data }

                const user = { ...contractUser, ...amaraUser }

                setUser(user)
            } catch (err) {
                console.log(err)
            }
        }
        buildUser(userId)
        return () => {}
    }, [userId])

    // Fetch team videos
    useEffect(() => {
        async function getTeamVideos(amaraUser) {
            const { teams } = amaraUser
            const {
                data: { objects: videos },
            } = await AmaraApi.videos.getAll({ team: teams[0].name })
            const videosMap = buildMapById(videos)

            setVideosRegistry(videosMap)
        }
        if (!user || !user.teams || !user.teams.length) {
            return
        }

        getTeamVideos(user)

        return () => {}
    }, [user])

    // Fetch accepted tasks
    useEffect(() => {
        if (!user || !contractTasks) {
            return
        }
        getTasks(contractTasks, user).then(mergedTasks => {
            setTasks(mergedTasks)
        })

        return () => {}
    }, [user, contractTasks])

    const loadingData = !user || !videosRegistry || !tasks

    return {
        user,
        tasks,
        videosRegistry,
        loading: loadingData,
    }
}

export default useUserLogicFCFS