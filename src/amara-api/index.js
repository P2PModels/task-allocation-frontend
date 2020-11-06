import { setApiKeyHeader, getApiKeyHeader } from './client'
import Teams from './Teams'
import Users from './Users'
import Videos from './Videos'
import Ratings from './Ratings'

const Api = {
  teams: Teams,
  users: Users,
  videos: Videos,
  ratings: Ratings,
  setApiKeyHeader,
  getApiKeyHeader,
}

export default Api
