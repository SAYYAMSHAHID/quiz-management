<template>
    <div class="container">
      <div class="card">
        <h2 class="card-title">Set New Password</h2>
        <form @submit.prevent="handleSetNewPassword">
          <div class="form-group">
            <label>New Password:</label>
            <input type="password" v-model="newPassword" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Confirm Password:</label>
            <input type="password" v-model="confirmPassword" class="form-control" required />
          </div>
          <button type="submit" class="btn-primary">Set Password</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UpdatePassword',
    data() {
      return {
        newPassword: '',
        confirmPassword: '',
        token: this.$route.query.token // Assuming the token is passed via query parameters
      };
    },
    methods: {
      async handleSetNewPassword() {
        if (this.newPassword !== this.confirmPassword) {
          alert('Passwords do not match. Please try again.');
          return;
        }
  
        try {
          const response = await axios.post('/api/password-update', {
            token: this.token,
            newPassword: this.newPassword
          });
          alert('Password has been updated successfully.');
          this.$router.push('/'); // Redirect to login page after successful reset
        } catch (error) {
          console.error('Error updating password:', error);
          alert('Failed to update password. Please try again.');
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
    margin-left: 30px;
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
  
  h2 {
    text-align: center;
    margin-bottom: 50px;
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
  