import { createApiClient } from '@fehub/api-client'

import { API_BASE_URL } from '../config/api'

export const apiClient = createApiClient({ baseUrl: API_BASE_URL })
