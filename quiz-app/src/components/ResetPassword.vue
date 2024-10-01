<template>
    <div class="container">
      <div class="card">
        <h2 class="card-title">Reset Password</h2>
        <form @submit.prevent="handlePasswordReset">
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="email" class="form-control" required />
          </div>
          <button type="submit" class="btn-primary">Send Reset Link</button>
        </form>
        <p class="remember">Remembered your password? <router-link to="/">Login here</router-link></p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'PasswordReset',
    data() {
      return {
        email: ''
      };
    },
    methods: {
      async handlePasswordReset() {
        try {
          const response = await axios.post('/api/password-reset', { email: this.email });
          alert('Password reset link sent to your email');
        } catch (error) {
          console.error('Error sending password reset link:', error);
          alert('Failed to send reset link. Please try again.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    height: 100vh;
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
    margin-bottom: 1.25rem;
  }
  
  .form-control {
    padding-left: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    height: 35px;
    width: 220px;
    font-size: 16px;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: #fff;
    border-radius: 8px;
    height: 50px;
    width: 100%;
    margin-top: 10px;
    cursor: pointer;
  }
  
  .btn-primary:hover {
    background-color: #001c3a;
  }
  
  p {
    text-align: center;
    margin-top: 1rem;
    font-size: 14px;
  }
  
  router-link {
    color: #007bff;
    text-decoration: none;
  }
  
  router-link:hover {
    text-decoration: underline;
  }
  h2{
    text-align: center;
    margin-bottom: 50px;
  }
  .remember{
    text-align: center;
    margin-top: 3rem;
    font-size: 18px;
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
  