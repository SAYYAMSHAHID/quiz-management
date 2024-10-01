<template>
  <!-- <div class="Logout-container">
    <h2>Admin Dashboard</h2>
    <AppLogout />
  </div> -->
  <div class="dashboard-container">
    <!-- Add Manager Section -->
    <div class="section1">
      <h3>Add User</h3>
      <input type="text" v-model="newUserName" placeholder="User Name" />
      <input type="email" v-model="newUserEmail" placeholder="User Email" />
      <select v-model="selectedRole">
        <option disabled value="">Select Role</option>
        <option>manager</option>
        <option>supervisor</option>
      </select>
      <button id="b1" @click="addUser">Add User</button>
    </div>

    <!-- Student Requests -->
    <div class="section">
      <h3>Student Requests</h3>


      <div v-if="studentRequests.length === 0">
        <p>No student requests found.</p>
      </div>
      <div v-for="(request, index) in studentRequests" :key="index" class="request">
        <p><strong>Name:</strong> {{ request.name }}</p>
        <p><strong>Email:</strong> {{ request.email }}</p>
        <p><a :href="request.cv_file" target="_blank">View CV</a></p>
        <button id="b2" @click="acceptRequest(request.id)">Accepted</button>
        <button id="b2" @click="rejectRequest(request.id)">Rejected</button>
      </div>
    </div>


    <!-- Assign Quizzes -->
    <div class="section">
  <h3>Assign Quizzes</h3>
  <select v-model="selectedStudent">
    <option disabled value="">Select Student</option>
    <option v-for="student in students" :key="student.id" :value="student.id">{{ student.name }}</option>
  </select>

  <select v-model="selectedQuiz">
    <option disabled value="">Select Quiz</option>
    <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">{{ quiz.title }}</option>
  </select>

  <button id="b1" @click="assignQuiz">Assign Quiz</button>
  
  <!-- New button to create quiz -->
  <button id="createQuizBtn" @click="goToCreateQuiz">Create Quiz</button>

  <!-- Optionally show selected quiz information -->
  <div v-if="selectedQuiz">
    <h4>Selected Quiz Details</h4>
    <p>Quiz ID: {{ selectedQuiz }}</p>
    <p>Quiz Title: {{ quizzes.find(quiz => quiz.id === selectedQuiz)?.title }}</p>
  </div>
</div>


    <!-- Filter Students -->
    <div class="section">
      <h3>Filter Students</h3>
      <select v-model="filterStatus">
        <option value="">All</option>
        <option value="accepted">accepted</option>
        <option value="rejected">rejected</option>
      </select>
      <ul>
        <li v-for="student in filteredStudents" :key="student.id">
          <p><strong>Name:</strong> {{ student.name }}</p>
          <p><strong>Email:</strong> {{ student.email }}</p>
          <p><strong>Status:</strong> {{ student.status }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AppLogout from '../components/AppLogout.vue';

export default {
  data() {
    return {
      newUserName: '',
      newUserEmail: '',
      selectedRole: '',
      studentRequests: [],
      students: [],
      quizzes: [],
      selectedStudent: '',
      selectedQuiz: '',
      filterStatus: '',
    };

  },
  computed: {
    filteredStudents() {
      if (this.filterStatus) {
        return this.students.filter(student => student.status === this.filterStatus);
      }
      return this.students;
    },
  },
  components: {
    AppLogout,
  },
  methods: {
    goToCreateQuiz() {
      this.$router.push({ name: 'CreateQuiz' });
    },
    async fetchStudentRequests() {
      const token = localStorage.getItem('token');  // Ensure token is defined here
      if (!token) {
        alert('User is not authenticated. Please log in.');
        this.$router.push({ name: 'Login' });
        return;  // Stop further execution if the token is missing
      }

      try {
        const response = await axios.get('http://192.168.15.76:8000/api/admin/view-students', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        // Update the studentRequests with the fetched data
        this.studentRequests = response.data; // Make sure to set the response data


      } catch (error) {
        console.error('Error fetching data:', error.message);
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Unknown error occurred:', error);
        }
      }
    },

    async fetchStudents() {
      const token = localStorage.getItem('token'); // Ensure token is defined here
      if (!token) {
        alert('User is not authenticated. Please log in.');
        this.$router.push({ name: 'Login' });
        return; // Stop further execution if the token is missing
      }

      try {
        const response = await axios.get('http://192.168.15.76:8000/api/admin/view-students', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          }
        });

        // Update the students with the fetched data
        this.students = response.data; // Make sure to set the response data


      } catch (error) {
        console.error('Error fetching students:', error.message);
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Unknown error occurred:', error);
        }
      }
    },


    async fetchQuizzes() {
      const token = localStorage.getItem('token'); // Ensure token is defined here
      if (!token) {
        alert('User is not authenticated. Please log in.');
        this.$router.push({ name: 'Login' });
        return; // Stop further execution if the token is missing
      }
  this.loading = true; // Start loading
  try {
    const response = await axios.get('http://192.168.15.76:8000/api/view-quizzes', {
      headers: {
        Authorization: `Bearer ${token}` // Add token in the headers
      }
    });
    console.log('Quizzes response:', response);
    this.quizzes = response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
  } finally {
    this.loading = false; // End loading
  }
},

    async addUser() {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      console.log('Token:', token);
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return; // Prevent further actions if token is not found
      }

      try {
        const data = new FormData();
        data.append('name', this.newUserName);
        data.append('email', this.newUserEmail);
        data.append('role', this.selectedRole);
        data.append('token', token);

        // Debugging: Check the form data before sending
        console.log('Form Data:', {
          name: this.newUserName,
          email: this.newUserEmail,
          role: this.selectedRole,
          token: token
        });

        const response = await axios.post('http://192.168.15.87:8000/api/admin/add-manager', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert(`User ${this.newUserName} added successfully`);
        this.newUserName = '';
        this.newUserEmail = '';
        this.selectedRole = '';
      } catch (error) {
        console.error('Error adding User:', error.response ? error.response.data : error.message);
        console.error('Full error response:', error.response);
        alert(error.response?.data?.message || 'Failed to add User');
      }
    }
    ,

    async acceptRequest(requestId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('User is not authenticated. Please log in.');
          return;
        }

        const response = await axios.patch(`http://192.168.15.76:8000/api/admin/submission/${requestId}/accept`, { id: requestId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        // Log the response to verify the update
        console.log('API response after accepting request:', response.data);

        alert('Student request accepted');
        this.fetchStudentRequests(); // Reload student requests after accepting
        this.fetchStudents(); // Update student list
      } catch (error) {
        console.error('Error accepting request:', error);
      }
    },


    async rejectRequest(requestId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('User is not authenticated. Please log in.');
          return;
        }

        // Use the correct requestId in the endpoint
        const response = await axios.patch(`http://192.168.15.76:8000/api/admin/submission/${requestId}/reject`, { id: requestId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        // Log the response to verify the update
        console.log('API response after rejecting request:', response.data);

        alert('Student request rejected');
        await this.fetchStudentRequests(); // Reload student requests after rejecting
        await this.fetchStudents(); // Update student list
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    },


    async assignQuiz() {
      if (this.selectedStudent && this.selectedQuiz) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('User is not authenticated. Please log in.');
            return;
          }
          await axios.post('http://192.168.15.76:8000/api/assign-quiz', {
            studentId: this.selectedStudent,
            quizId: this.selectedQuiz,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          alert('Quiz assigned successfully');
          this.selectedStudent = '';
          this.selectedQuiz = '';
        } catch (error) {
          console.error('Error assigning quiz:', error);
          alert('Failed to assign quiz');
        }
      } else {
        alert('Please select both a student and a quiz');
      }
    },
  },
  mounted() {
    this.fetchStudentRequests();
    this.fetchStudents();
     this.fetchQuizzes();
  },
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
}

.Logout-container button:hover {
  background-color: red;
}

.dashboard-container {
  padding: 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.section {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.section1 {
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

input,
select {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 5px;
  background-color: #e9ecef;
}

input:focus,
select:focus {
  outline: none;
  border-color: #80bdff;
  background-color: white;
}

button#b1,
button#b2 {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button#b1:hover,
button#b2:hover {
  background-color: #218838;
}

.request {
  display: flex;
  align-items: center;
  /* Center items vertically */
  justify-content: space-between;
  /* Space items out evenly */
  background-color: #f1f3f5;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.request p {
  margin: 0 10px;
  /* Add some margin for spacing */
  flex: 1;
  /* Allow paragraphs to grow */
}

.request button {
  margin-left: 10px;
  /* Add some space between the buttons and the text */
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px 0;
}

#createQuizBtn {
  padding: 10px 20px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

#createQuizBtn:hover {
  background-color: #138496;
}
</style>