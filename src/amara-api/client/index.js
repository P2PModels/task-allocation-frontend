import axios from 'axios'

const { REACT_APP_AMARA_STAGING_API } = process.env

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
