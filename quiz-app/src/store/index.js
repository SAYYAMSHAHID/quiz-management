import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    user: null,
    userRole: '',
    token: null,
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    userRole: (state) => state.userRole,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USER_ROLE(state, role) {
      state.userRole = role;
    },
    SET_TOKEN(state, token) {

      state.token = token;

    },
  },
  actions: {
    async register({ commit }, formData) {
      try {
        // Directly use the formData object that is passed from the component
        const response = await axios.post('http://192.168.15.76:8000/api/submission', formData
        );

        console.log('data ', response.data);

        return true;  // Success
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error);
        return false;  // Failure
      }
    },
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('http://192.168.15.76:8000/api/login', {
          email:credentials.email,
          password:credentials.password
        });
        console.log(response.data);

        const { access_token, token_type, expires_in } = response.data.token;

        commit('SET_TOKEN', access_token);

        localStorage.setItem('token', access_token);
       
        return true;
        
      } 
      
      catch (error) {
        console.error('Login failed:', error.message || error);
        throw error;
      }
    },
  },
});

export default store;
