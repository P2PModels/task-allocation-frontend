import axios from 'axios'

const {
  REACT_APP_AMARA_STAGING_API,
  REACT_APP_AMARA_API_LOCAL_PORT,
} = process.env

// const baseURL =
//   NODE_ENV === 'development'
//     ? `http://localhost:${REACT_APP_AMARA_API_LOCAL_PORT}/api`
//     : REACT_APP_AMARA_STAGING_API
const headers = { 'X-api-key': '' }
const ROOT = 'api'
const baseURL = `${REACT_APP_AMARA_STAGING_API}${ROOT}`

const instance = axios.create({
  baseURL,
  headers,
})

function getApiKeyHeader() {
  return instance.defaults.headers['X-api-key']
}

function setApiKeyHeader(apiKey) {
  instance.defaults.headers['X-api-key'] = apiKey
}

export { instance, setApiKeyHeader, getApiKeyHeader }
