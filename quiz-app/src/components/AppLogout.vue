<template>
    <button @click="logout">Logout</button>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const router = useRouter();
  
      const logout = () => {
        // Clear local storage or authentication tokens
        localStorage.removeItem('token');
        localStorage.removeItem('role');
  
        // Redirect to login page after logout
        router.push({ name: 'AppLogin' });
      };
  
      return { logout };
    }
  };
  </script>
  
  <style scoped>
  
  </style>
  