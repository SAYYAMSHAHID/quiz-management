<template>
  <div class="dashboard-container">
    <!-- Personal Details Form -->
    <div class="section">
      <h3>Submit Personal Details</h3>
      <form @submit.prevent="submitDetails">
        <input type="text" v-model="personalDetails.name" placeholder="Name" required />
        <input type="email" v-model="personalDetails.email" placeholder="Email" required />
        <input type="file" @change="onFileChange" required />
        <button type="submit">Submit</button>
      </form>
    </div>

    <!-- Quizzes Section -->
    <div class="section">
      <h3>Assigned Quizzes</h3>
      <div v-if="assignedQuizzes.length === 0">
        <p>No quizzes assigned yet.</p>
      </div>
      <div v-else>
        <div v-for="quiz in assignedQuizzes" :key="quiz.id" class="quiz-item">
          <p>{{ quiz.title }} - Available on: {{ quiz.availableDate }}</p>
          <button @click="attemptQuiz(quiz)" :disabled="!canAttemptQuiz(quiz)">
            Start Quiz
          </button>
        </div>
      </div>
    </div>

    <!-- Pending Quizzes Section -->
    <div class="section">
      <h3>Pending Quizzes</h3>
      <div v-if="pendingQuizzes.length === 0">
        <p>No pending quizzes.</p>
      </div>
      <ul>
        <li v-for="quiz in pendingQuizzes" :key="quiz.id">{{ quiz.title }}</li>
      </ul>
    </div>

    <!-- Attempted Quizzes Section -->
    <div class="section">
      <h3>Attempted Quizzes</h3>
      <div v-if="attemptedQuizzes.length === 0">
        <p>No quizzes attempted yet.</p>
      </div>
      <ul>
        <li v-for="quiz in attemptedQuizzes" :key="quiz.id">
          {{ quiz.title }} - Result: {{ quiz.result }}
        </li>
      </ul>
    </div>
  </div>

  <!-- Quiz Modal for attempting a quiz -->
  <div v-if="isQuizActive" class="quiz-modal">
    <h3>{{ activeQuiz.title }}</h3>
    <p>{{ activeQuiz.description }}</p>
    <div v-if="isRecording">
      <video id="quizVideo" autoplay></video>
      <button @click="stopRecording">Stop Recording</button>
    </div>
    <button @click="submitQuiz">Submit Quiz</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      personalDetails: {
        name: '',
        email: '',
        cv: null,
      },
      assignedQuizzes: [],
      pendingQuizzes: [],
      attemptedQuizzes: [],
      activeQuiz: null,
      isQuizActive: false,
      isRecording: false,
      quizResult: null,
    };
  },
  methods: {
    // Submit personal details
    async submitDetails() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }

      try {
        const data = new FormData();
        data.append('name', this.personalDetails.name);
        data.append('email', this.personalDetails.email);
        data.append('cv', this.personalDetails.cv);

        await axios.post('http://192.168.15.243:8000/api/students/personal-details', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Personal details submitted successfully');
      } catch (error) {
        console.error('Error submitting personal details:', error.response ? error.response.data : error.message);
        alert('Failed to submit personal details');
      }
    },

    // Handle CV file change
    onFileChange(event) {
      this.personalDetails.cv = event.target.files[0];
    },

    // Fetch assigned quizzes
    async fetchAssignedQuizzes() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }

      try {
        const response = await axios.get('http://192.168.15.87:8000/view-assigned-quizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.assignedQuizzes = response.data;
      } catch (error) {
        console.error('Error fetching assigned quizzes:', error);
      }
    },

    // Fetch pending quizzes
    async fetchPendingQuizzes() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }

      try {
        const response = await axios.get('http://192.168.15.87:8000/api/assign-quiz', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.pendingQuizzes = response.data;
      } catch (error) {
        console.error('Error fetching pending quizzes:', error);
      }
    },

    // Fetch attempted quizzes
    async fetchAttemptedQuizzes() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }

      try {
        const response = await axios.get('http://192.168.15.87:8000/view-attempted-quizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.attemptedQuizzes = response.data;
      } catch (error) {
        console.error('Error fetching attempted quizzes:', error);
      }
    },

    // Check if quiz can be attempted
    canAttemptQuiz(quiz) {
      const now = new Date();
      const availableDate = new Date(quiz.availableDate);
      return now >= availableDate;
    },

    // Navigate to AppQuiz.vue with quiz ID
    attemptQuiz(quiz) {
      console.log('Attempting quiz:', quiz);
      this.$router.push('/AppQuiz');
    },
  },
  mounted() {
    this.fetchAssignedQuizzes();
    this.fetchPendingQuizzes();
    this.fetchAttemptedQuizzes();
  },
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

button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 20px auto 0;
  width: auto;
}

button:hover {
  background-color: #218838;
}

.quiz-modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
</style>