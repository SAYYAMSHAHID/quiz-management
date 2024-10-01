<template>
  <div class="Logout-container">
    <AppLogout />
    <!-- Logout component -->
  </div>
  <div class="main-dashboard">
    <!-- Sidebar -->
    <div class="sidebar">
      <h2>Dashboards</h2>
      <button @click="navigateTo('admin')">Admin Dashboard</button>
      <button @click="navigateTo('manager')">Manager Dashboard</button>
      <button @click="navigateTo('student')">Student Dashboard</button>
    </div>
    
    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <router-view />
      <!-- This will render the respective dashboard component -->
    </div>
  </div>
</template>

<script>
import AppLogout from '../components/AppLogout.vue';

export default {
  name: 'MainDashboard',
  components: {
    AppLogout,
  },
  methods: {
    navigateTo(role) {
      // Navigate to the respective dashboard view
      if (role === 'admin') {
        this.$router.push('/admin-dashboard');
      } else if (role === 'manager') {
        this.$router.push('/manager-dashboard');
      } else if (role === 'student') {
        this.$router.push('/student-dashboard');
      }
    }
  }
};
</script>

<style scoped>
.Logout-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #343a40;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  color: white;
}

.Logout-container h2 {
  margin: 0;
  margin-left: 45%;
  font-size: 1.5em;
}

.Logout-container button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 1390px;
}

.Logout-container button:hover {
  background-color: red;
}

.main-dashboard {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #333;
  color: #fff;
  padding: 1rem;
  position: sticky; /* Make sidebar sticky */
  top: 0; /* It will "stick" to the top when scrolling */
  height: 100vh; /* Ensures the sidebar occupies the full height of the viewport */
  overflow-y: auto; /* Allows scrolling inside the sidebar if content exceeds its height */
}

.sidebar h2 {
  margin-bottom: 1.5rem;
}

.sidebar button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #007bff;
  border: none;
  color: #fff;
  cursor: pointer;
  text-align: left;
}

.sidebar button:hover {
  background-color: #0056b3;
}

.dashboard-content {
  flex-grow: 1;
  padding: 2rem;
  background-color: #f9f9f9;
  overflow-y: auto; /* Content in the main area can scroll */
}
</style>