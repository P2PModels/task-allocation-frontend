import { useState, useEffect } from 'react'
import {
    useUserQuery,
    useAvailableTasksQueryPolling,
    useTasksAcceptedByUserQueryPolling,
} from './useRequests'
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
    const contractUser = useUserQuery(userId)
    const {
        contractTasks,
        stopPolling: stopTasksPolling,
    } = useAvailableTasksQueryPolling()
    const contractAcceptedTasks = useTasksAcceptedByUserQueryPolling(userId)
    const [user, setUser] = useState()
    const [tasks, setTasks] = useState()
    const [acceptedTask, setAcceptedTask] = useState()
    const [videosRegistry, setVideosRegistry] = useState(new Map())

    // Fetch Amara user data
    useEffect(() => {
        let isMounted = true
        async function buildUser(userId) {
            try {
                const amaraUserRes = await AmaraApi.users.getOne(userId)
                const amaraUser = { ...amaraUserRes.data }
                const user = { ...contractUser, ...amaraUser }
                if (isMounted) setUser(user)
            } catch (err) {
                console.log(err)
            }
        }
        buildUser(userId)
        return () => {
            isMounted = false
        }
    }, [userId, contractUser])

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

    // Fetch tasks
    useEffect(() => {
        if (!user || !contractTasks) {
            return
        }
        getTasks(contractTasks, user).then(mergedTasks => {
            setTasks(mergedTasks)
        })

        return () => {}
    }, [user, contractTasks])

    // Fetch accepted task
    useEffect(() => {
        if (!user || !contractAcceptedTasks) {
            return
        }
        if (
            !acceptedTask ||
            acceptedTask.contractData.id !== contractAcceptedTasks[0].id
        ) {
            getTasks(contractAcceptedTasks, user).then(mergedTasks => {
                setAcceptedTask(mergedTasks[0] ? mergedTasks[0] : null)
            })
            stopTasksPolling()
        }

        return () => {}
    }, [user, contractAcceptedTasks])

    const loadingData =
        !user || !videosRegistry || !tasks || acceptedTask === undefined

    return {
        user,
        tasks,
        acceptedTask: acceptedTask ? acceptedTask : null,
        videosRegistry,
        loading: loadingData,
    }
}

export default useUserLogicFCFS
