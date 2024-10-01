<template>
  <div class="container">
    <div class="card">
      <h2 class="card-title">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email:</label>
          <input type="email" v-model="email" class="form-control" required />
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" v-model="password" class="form-control" required />
        </div>
        <button type="submit" class="btn-primary">Login</button>
      </form>
      <p>New here? <router-link to="/register">Create an account</router-link></p>
      <p>Forgot your password? <router-link to="/password-reset">Reset it here</router-link></p>

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AppLogin',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      const credentials = {
        email: this.email,
        password: this.password,
      };
      const success = await this.login(credentials); // This is calling the Vuex action
      // Handle redirection based on user role
      if (success) {
        // const role = this.$store.getters.userRole;
        // if (role === 'student') {
        //   this.$router.push('/student-dashboard');
        // } else if (role === 'manager') {
        //   this.$router.push('/manager-dashboard');
        // } else if (role === 'admin') {
          this.$router.push('/main-dashboard');
        // }    
      }

    }
  }
};
</script>
<style>
.container {
  height: 100vh;

  /* Full viewport height */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(270deg, #f7f3e9, #d4e4f7, #f9d5e5, #c8e7e4);
  background-size: 500% 800%;
  animation: gradient 10s ease infinite;
}

.card {
  width: 100%;
  max-width: 300px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.card-title {
  font-size: 26px;
  font-weight: 500;
  color: #333;
}

.form-group {
  position: relative;
  margin-bottom: 1.25rem;
}

.form-control {
  padding-left: 10px;
  /* Adjust padding as necessary */
  border: 1px solid #ddd;
  border-radius: 8px;
  height: 50px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  border-radius: 8px;
  height: 50px;
  font-weight: 600;
  width: 100%;
  /* Use full width for better UX */
  margin-top: 10px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #001c3a;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>