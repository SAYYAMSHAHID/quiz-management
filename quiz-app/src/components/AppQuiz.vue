<template>
  <div class="quiz-container">
    <div class="quiz-header">
      <h1>{{ quizTitle }}</h1>
      <p>Total Questions: {{ totalQuestions }}</p>
    </div>
    
    <div class="quiz-body">
      <h2>{{ currentQuestion.id }}. {{ currentQuestion.text }}</h2>
      <div v-for="(option, index) in currentQuestion.options" :key="index" class="quiz-option">
        <input
          type="radio"
          :id="'option' + index"
          :value="option"
          v-model="selectedOption"
        />
        <label :for="'option' + index">{{ option }}</label>
      </div>
    </div>

    <div class="quiz-footer">
      <button @click="previousQuestion" :disabled="currentQuestionIndex === 0">Previous</button>
      <button v-if="!isLastQuestion" @click="nextQuestion" :disabled="!selectedOption">Next</button>
      <button v-if="isLastQuestion" @click="submitQuiz" :disabled="!selectedOption">Submit</button>
    </div>

    <!-- Hidden video element to capture the recording -->
    <video ref="video" style="display: none;"></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quizTitle: 'JS Quiz',
      totalQuestions: 25,
      currentQuestionIndex: 0,
      selectedOption: null,
      questions: [
        {
          id: 1,
          text: 'Inside which HTML element do we put the JavaScript?',
          options: ['<script>', '<javascript>', '<scripting>', '<js>']
        },
        {
          id: 2,
          text: 'What is the correct syntax for referring to an external script called "xxx.js"?',
          options: [
            '<script href="xxx.js">',
            '<script name="xxx.js">',
            '<script src="xxx.js">',
            '<script file="xxx.js">'
          ]
        },
        {
          id: 3,
          text: 'How do you write "Hello World" in an alert box?',
          options: ['msg("Hello World");', 'alertBox("Hello World");', 'alert("Hello World");', 'msgBox("Hello World");']
        }
      ],
      mediaRecorder: null,
      chunks: [],
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1;
    }
  },
  methods: {
    startRecording() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.$refs.video.srcObject = stream;
          this.mediaRecorder = new MediaRecorder(stream);
          
          this.mediaRecorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
          };
          
          this.mediaRecorder.start();
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Create a download link
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'quiz_recording.webm';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      };
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedOption = null; // Clear the selected option for the next question
      }
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.selectedOption = null; // Clear the selected option for the previous question
      }
    },
    submitQuiz() {
      // Stop recording first
      this.stopRecording();

      // Stop the video and audio stream
      const stream = this.$refs.video.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(track => track.stop());  // Stop all tracks (both video and audio)

      // Handle quiz submission logic here
      alert('Quiz submitted! Camera and microphone are now disabled.');
    }
  },
  mounted() {
    this.startRecording();
  }
};
</script>

<style scoped>
.quiz-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.quiz-header {
  background-color: #007bff;
  color: white;
  padding: 15px;
  border-radius: 8px 8px 0 0;
}

.quiz-body {
  padding: 20px;
}

.quiz-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.quiz-option {
  background-color: #e9f0fb;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.quiz-option input {
  margin-right: 10px;
}

button {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>