import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { getEditorLink } from '../helpers/amara-helpers'
import { getTxStatus, getTxAction } from '../helpers/transaction-helpers'
import { getResourceFromPathname } from '../helpers/route-helpers'
import { Actions, convertToString } from '../types/actions'
import useUserLogicFCFS from '../hooks/useUserLogicFCFS'
import useActions from '../hooks/useActions'
import AmaraApi from '../amara-api'

import {
    Grid,
    Typography,
    Box,
    Fade,
    Snackbar,
    Slide,
    CircularProgress,
    Button,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'
import CheckIcon from '@material-ui/icons/Check'

import MainView from '../components/MainView'
import Banner from '../components/Banner'
import TaskSection from '../components/TaskSection'
import MessageModal from '../components/Modals/MessageModal'
import TransactionModal from '../components/Modals/TransactionModal'
import NoValidUserEntered from '../components/ErrorPanels/NoValidUserEntered'
import { useAppState } from '../contexts/AppState'
import Homepage from '../assets/Homepage.svg'
import models from '../types/models'

const { AcceptTask } = Actions
const SNACKBAR_FIXED_TIME = 700

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    taskSection: {
        // width: '90%',
        // border: '1px solid black',
    },
    toastMessage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconLoadingState: {
        color: 'white',
        marginRight: theme.spacing(1),
    },
    disabledModal: {
        opacity: 0.4,
    },
}))

const MODAL_ACTIONS = {
    acceptTask: {
        title: 'Accept Assignment',
        message:
            'You need to create and confirm a transaction in order to accept this assignment.',
    },
}

const SlideUp = props => <Slide {...props} direction="up" />
const SlideLeft = props => <Slide {...props} direction="left" />

const HomeFCFS = () => {
    const theme = useTheme()
    const {
        root,
        taskSection,
        toastMessage,
        iconLoadingState,
        disabledModal,
    } = useStyles()
    const web3React = useWeb3React()
    const { account } = web3React
    const { pathname } = useLocation()
    const { modelName, setModel } = useAppState()
    const userId = getResourceFromPathname(pathname, 'userId')
    const modelNameParam = getResourceFromPathname(pathname, 'model')
    const {
        user,
        tasks,
        acceptedTask,
        videosRegistry,
        loading,
    } = useUserLogicFCFS(userId)
    /* ref to avoid updating component when setting to true.
   Need it to execute useEffect only once at some point in time */
    const loadingHandlerExecutedRef = useRef(false)
    const [openMessageModal, setOpenMessageModal] = useState(false)
    const [modal, setModal] = useState(null)
    const [openTxModal, setOpenTxModal] = useState(false)
    const [activatingTxModal, setActivatingTxModal] = useState(false)
    const [openLoadingSnackbar, setOpenLoadingSnackbar] = useState(true)
    const [openTxSnackbar, setOpenTxSnackbar] = useState(false)
    const [txSnackbar, setTxSnackbar] = useState({})
    const [processingTx, setProcessingTx] = useState(false)
    const model = models.find(m => m.name == modelName)

    useEffect(() => {
        setModel(modelNameParam)
        return () => {}
    }, [])

    // Wait half second before hiding loading snackbar. Only for aesthetic purposes
    useEffect(() => {
        if (!loadingHandlerExecutedRef.current && !loading) {
            setTimeout(() => setOpenLoadingSnackbar(false), SNACKBAR_FIXED_TIME)
            loadingHandlerExecutedRef.current = true
        }
        return () => {}
    }, [loading])

    /**
     * Handle that is executed every time snakbars need to be open
     */
    const handleExecutedTransaction = (type, action) => {
        if (type === 'success' || type === 'error') {
            setProcessingTx(false)
        }

        const snackbar = { type }
        const txStatus = getTxStatus(type)
        const txAction = getTxAction(action)

        snackbar.message = <span>{txStatus}</span>
        setActivatingTxModal(false)
        setOpenTxModal(false)

        setTxSnackbar(snackbar)
        setOpenTxSnackbar(true)
    }

    const actions = useActions(handleExecutedTransaction)

    const handleTxSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenTxSnackbar(false)
    }

    /**
     * Handle that is executed when user accepts to
     * create a transaction.
     * @param task: contain information about the task
     * @param action: contain the action to be executed
     */
    const handleCreateTransaction = (task, action) => {
        const actionStr = convertToString(action)
        setProcessingTx(true)
        actions[actionStr](userId, task.contractData.id)
        setActivatingTxModal(true)
    }

    /**
     * Handle that manages task acceptance
     */
    const handleAcceptTask = task => {
        // If the user is not connected with metamask, a modal is displayed
        // asking the user to check her metamask installation
        if (!account) setOpenMessageModal(true)
        else {
            // If the user is connected to metamask, a modal is displayed
            // to notify that a transaction is going to be created
            const content = { ...MODAL_ACTIONS.acceptTask }
            content.createTransactionHandler = () =>
                handleCreateTransaction(task, AcceptTask)
            setModal(content)
            setOpenTxModal(true)
        }
    }

    const handleTranslateTask = task => {
        console.log('Translating task...')
        AmaraApi.teams
            .updateSubtitleRequest(user.teams[0].name, task.job_id, userId)
            .then(
                () => {
                    window.open(getEditorLink(task), '_blank')
                },
                err =>
                    console.error(
                        'A problem has ocurred trying to update assignment using Amara API',
                        err
                    )
            )
    }

    const availableTaskActionButtons = [
        {
            label: 'Accept',
            color: theme.palette.success.main,
            variant: 'contained',
            actionHandler: handleAcceptTask,
        },
    ]

    const disabledTaskActionButtons = availableTaskActionButtons.map(
        taskButton => {
            return {
                ...taskButton,
                disabled: true,
            }
        }
    )

    const assignedTaskActionButtons = [
        {
            label: 'Translate',
            color: theme.palette.translateButton,
            variant: 'contained',
            actionHandler: handleTranslateTask,
        },
    ]

    if (user) {
        if (!Object.keys(user).length) {
            return <NoValidUserEntered />
        }

        return (
            <MainView className={root}>
                <Grid
                    container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center"
                >
                    <Banner
                        title={model.displayName}
                        description={model.description}
                        img={Homepage}
                        // cta={<Button>Botón</Button>}
                    />
                    {acceptedTask ? (
                        <Grid container className={taskSection}>
                            <Grid item>
                                <Box mt={!tasks ? 0 : 2} width="100">
                                    <TaskSection
                                        tasks={[acceptedTask]}
                                        videoRegistry={
                                            videosRegistry === []
                                                ? null
                                                : videosRegistry
                                        }
                                        title="You have this task selected"
                                        description=""
                                        taskActionButtons={
                                            assignedTaskActionButtons
                                        }
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    ) : (
                        !loading && (
                            <Grid container className={taskSection}>
                                <Grid item>
                                    <Box mt={!tasks ? 0 : 2} width="100">
                                        <TaskSection
                                            tasks={
                                                tasks.length == 0 ? [] : tasks
                                            }
                                            videoRegistry={
                                                videosRegistry === []
                                                    ? null
                                                    : videosRegistry
                                            }
                                            title={
                                                processingTx
                                                    ? 'Processing your request...'
                                                    : tasks.length <= 0
                                                    ? 'No tasks available'
                                                    : tasks.length === 1
                                                    ? 'This task is currently assigned to you'
                                                    : 'These tasks are currently assigned to you'
                                            }
                                            description=""
                                            taskActionButtons={
                                                processingTx
                                                    ? disabledTaskActionButtons
                                                    : availableTaskActionButtons
                                            }
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        )
                    )}
                </Grid>

                <Snackbar
                    open={openTxSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    TransitionComponent={SlideLeft}
                    transitionDuration={500}
                    autoHideDuration={3000}
                    onClose={handleTxSnackbarClose}
                    key={'bottomright'}
                >
                    <Alert severity={txSnackbar.type || 'info'}>
                        {txSnackbar.message}
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={openLoadingSnackbar}
                    TransitionComponent={SlideUp}
                    transitionDuration={500}
                    onClose={() => setTimeout(() => {}, 1000)}
                >
                    <Alert icon={false} variant="filled" color="info">
                        <div className={toastMessage}>
                            {loading ? (
                                <CircularProgress
                                    className={iconLoadingState}
                                    size={20}
                                    thickness={5}
                                />
                            ) : (
                                <CheckIcon className={iconLoadingState} />
                            )}
                            Loading your assingments!
                        </div>
                    </Alert>
                </Snackbar>
                <TransactionModal
                    className={disabledModal}
                    modalContent={modal}
                    open={openTxModal}
                    activating={activatingTxModal}
                    onClose={() => setOpenTxModal(false)}
                    onCreateTransaction={() => handleCreateTransaction()}
                />
                <MessageModal
                    type="error"
                    title="You can't perform this action"
                    message="Check you have Metamask installed and you're connected to your account."
                    open={openMessageModal}
                    onClose={() => setOpenMessageModal(false)}
                />
            </MainView>
        )
    }
    return null
}

export default HomeFCFS
