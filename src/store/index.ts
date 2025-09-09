import { createStore } from 'vuex'

export interface State {
  user: {
    isAuthenticated: boolean
    email: string | null
    name: string | null
  }
}

export default createStore<State>({
  state: {
    user: {
      isAuthenticated: false,
      email: null,
      name: null
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    LOGOUT(state) {
      state.user = {
        isAuthenticated: false,
        email: null,
        name: null
      }
    }
  },
  actions: {
    login({ commit }, userData) {
      // Aqui seria implementada a lógica de login
      commit('SET_USER', {
        isAuthenticated: true,
        email: userData.email,
        name: userData.name
      })
    },
    logout({ commit }) {
      commit('LOGOUT')
    }
  },
  getters: {
    isAuthenticated: (state) => state.user.isAuthenticated,
    userEmail: (state) => state.user.email,
    userName: (state) => state.user.name
  }
})

