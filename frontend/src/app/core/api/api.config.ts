export const API_CONFIG = {
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      refresh: '/auth/refresh',
    },
    matches: {
      list: '/matches',
      detail: (id: number) => `/matches/${id}`,
      live: '/matches/live',
    },
    teams: {
      list: '/teams',
      detail: (id: number) => `/teams/${id}`,
    },
    players: {
      list: '/players',
      detail: (id: number) => `/players/${id}`,
      stats: (id: number) => `/players/${id}/statistics`,
    },
    standings: {
      list: '/standings',
    },
    favorites: {
      list: '/favorites',
      toggle: '/favorites/toggle',
    },
  },
} as const;
