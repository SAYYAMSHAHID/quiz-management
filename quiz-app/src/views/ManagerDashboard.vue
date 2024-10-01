<template>
  <div class="dashboard-container">

    <!-- Assign Quizzes -->
    <div class="section" v-if="!loading">
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

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Loading data, please wait...
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      students: [],
      quizzes: [],
      selectedStudent: '',
      selectedQuiz: '',
      filterStatus: '',
      loading: true, // New loading state
    };
  },
  computed: {
    filteredStudents() {
      if (this.filterStatus) {
        return this.students.filter(student => student.status === this.filterStatus);
      }
      return this.students;
    }
  },
  methods: {
    // Assign Quiz API Call
    async assignQuiz() {
      try {
        if (!this.selectedStudent || !this.selectedQuiz) {
          alert('Please select both a student and a quiz');
          return;
        }
        const response = await axios.post('http://192.168.15.76:8000/api/assign-quiz',{
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          }
        },
        {
          studentId: this.selectedStudent,
          quizId: this.selectedQuiz,
        });
        if (response.status === 200) {
          alert('Quiz assigned successfully');
          this.fetchStudents(); // Refresh student list
        } else {
          alert('Failed to assign quiz');
        }
      } catch (error) {
        console.error('Error assigning quiz:', error);
        alert('Error assigning quiz');
      }
    },

    // Fetch Students and Quizzes
    async fetchData() {
      const token = localStorage.getItem('token'); // Ensure token is defined here
    
      try {
        const [studentsResponse, quizzesResponse] = await Promise.all([
        axios.get('http://192.168.15.76:8000/api/admin/view-students', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          }
        }),
          axios.get('http://192.168.15.76:8000/api/view-quizzes', {
      headers: {
        Authorization: `Bearer ${token}` // Add token in the headers
      }
    }),
        ]);
        this.students = studentsResponse.data;
        this.quizzes = quizzesResponse.data;
        this.loading = false; // Data is loaded, set loading to false
      } catch (error) {
        console.error('Error fetching data:', error);
        this.loading = false; // In case of error, stop the loading state
      }
    },

    // Fetch Students after update
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
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
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
  transition: box-shadow 0.3s;
}

.section:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

select {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 5px;
  background-color: #e9ecef;
}

select:focus {
  outline: none;
  border-color: #80bdff;
  background-color: white;
}

button#b1 {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 20px auto 0;
}

button#b1:hover {
  background-color: #218838;
}

h3 {
  text-align: center;
  color: #343a40;
  font-size: 1.25em;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

li:last-child {
  border-bottom: none;
}

.loading {
  text-align: center;
  font-size: 1.2em;
  color: #007bff;
}
</style>