<template>
    <div class="create-quiz-container">
        <!-- Back Button -->
        <button @click="goBack" class="back-button">Back</button>
        <h2>Create Quiz</h2>

        <!-- Quiz Title -->
        <div class="quiz-title">
            <label for="quizTitle">Quiz Title:</label>
            <input v-model="quizData.title" type="text" id="quizTitle" placeholder="Enter Quiz Title" />
        </div>

        <button @click="submitQuizDetails($event)" class="create-quiz" :disabled="isSubmitting">Create Quiz</button>

        <!-- Questions Section -->
        <div v-for="(question, index) in quizData.questions" :key="index" class="question-block">
            <h3>Question {{ index + 1 }}</h3>
            <input v-model="question.questionText" type="text" placeholder="Enter Question" />
            <div class="options">
                <input v-model="question.options.A" type="text" placeholder="Option A" />
                <input v-model="question.options.B" type="text" placeholder="Option B" />
                <input v-model="question.options.C" type="text" placeholder="Option C" />
                <input v-model="question.options.D" type="text" placeholder="Option D" />
            </div>
            <div class="correct-option">
                <label for="correctOption">Correct Option</label>
                <select v-model="question.correctOption">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
            </div>
        </div>

        <!-- Add/Remove Questions -->
        <div class="actions">
            <button @click="addQuestion" class="add-question">+ Add Question</button>
            <button @click="removeLastQuestion" class="remove-question">- Remove Last Question</button>
        </div>

        <!-- Create Questions -->
        <button @click="submitQuizQuestions(quizId)" class="create-quiz" :disabled="isSubmitting">Create Questions</button>

        <!-- Submission Message -->
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            quizData: {
                title: '',
                description: 'default',
                scheduled_at: '2024-10-01 10:00:00',
                expires_at: '2024-10-10 10:00:00',
                questions: [
                    {
                        questionText: '',
                        options: {
                            A: '',
                            B: '',
                            C: '',
                            D: ''
                        },
                        correctOption: 'A'
                    }
                ]
            },
            isSubmitting: false,
            successMessage: '',
            errorMessage: '',
            quizId: null // Initialize quizId here
        };
    },
    methods: {
        addQuestion() {
            this.quizData.questions.push({
                questionText: '',
                options: {
                    A: '',
                    B: '',
                    C: '',
                    D: ''
                },
                correctOption: 'A'
            });
        },
        removeLastQuestion() {
            if (this.quizData.questions.length > 1) {
                this.quizData.questions.pop();
            }
        },

        async submitQuizDetails(event) {
    event.stopPropagation(); // Prevent event bubbling
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Validate title
    if (!this.quizData.title) {
        this.errorMessage = 'Quiz title is required.';
        this.isSubmitting = false; // Reset submitting state
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const payload = {
            title: this.quizData.title,
            description: this.quizData.description,
            scheduled_at: this.quizData.scheduled_at,
            expires_at: this.quizData.expires_at
        };
        console.log('Payload for quiz creation:', payload); // Debugging line

        const response = await axios.post('http://192.168.15.76:8000/api/create-quiz', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Debugging: Log the full response
        console.log('API Response:', response);

        // Access quiz ID from the nested structure
        if (response.data && response.data.quiz && response.data.quiz.id) {
            this.successMessage = 'Quiz created successfully!';
            this.quizId = response.data.quiz.id; // Save the created quiz ID
        } else {
            console.error('Unexpected response structure:', response.data);
            throw new Error('Failed to submit quiz details. Please try again.');
        }
    } catch (error) {
        console.error('Error creating quiz:', error);
        if (error.response) {
            console.error('Response data:', error.response.data); // Log response data
            this.errorMessage = error.response.data.message || 'Error submitting quiz details.';
        } else {
            this.errorMessage = error.message || 'Error submitting quiz details.';
        }
    } finally {
        this.isSubmitting = false;
    }
},

// Method to submit questions separately
async submitQuizQuestions(quizId) { 
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const token = localStorage.getItem('token');

    // Construct the questions payload
    const questionsPayload = {
        quiz_id: quizId,
        questions: this.quizData.questions.map((q) => {
            // Construct options object
            const options = {
                A: q.options.A || '',
                B: q.options.B || '',
                C: q.options.C || '',
                D: q.options.D || ''
            };

            return {
                questionText: q.questionText,
                options: options,
                correctOption: q.correctOption
            };
        })
    };

    try {
        console.log('Payload for submitting questions:', JSON.stringify(questionsPayload, null, 2)); // Debugging line

        // Send the payload to the API
        const response = await axios.post('http://192.168.15.76:8000/api/create-questions', questionsPayload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 201) {
            this.successMessage = 'Questions submitted successfully!';
        } else {
            throw new Error('Failed to submit questions. Please try again.');
        }
    } catch (error) {
        // Improved error handling to get more details
        const errorMessage = error.response?.data?.message || error.message || 'Error submitting questions.';
        this.errorMessage = errorMessage;
        console.error('Error submitting questions:', error.response?.data); // Log server response for more insights
    } finally {
        this.isSubmitting = false;
    }
},

        goBack() {
            this.$router.push('/admin-dashboard');
        }
    }
};
</script>

<style scoped>
.create-quiz-container {
    max-width: 800px;
    margin: 40px auto;
    background-color: #f9f9f9;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
}

h2 {
    margin-top: -60px;
    text-align: center;
    color: #333;
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
    color: #555;
}

input,
select,
textarea {
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border-radius: 8px;
    border: 1px solid #ccc;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    font-size: 16px;
}

textarea {
    height: 100px;
}

input:focus,
select:focus,
textarea:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.options {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.options input {
    width: calc(50% - 10px);
}

.actions {
    display: flex;
    justify-content: space-between;
    gap: 7px;
    margin-bottom: 30px;
}

.add-question,
.remove-question {
    flex: 1;
    padding: 12px 0;
    border-radius: 8px;
    font-size: 16px;
    border: none;
    transition: background-color 0.3s;
    font-weight: bold;
    cursor: pointer;
}

.add-question {
    background-color: #28a745;
    color: white;
}

.add-question:hover {
    background-color: #218838;
}

.remove-question {
    background-color: #dc3545;
    color: white;
}

.remove-question:hover {
    background-color: #c82333;
}

.create-quiz {
    width: 100%;
    background-color: #15c7e2;
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-size: 18px;
    margin: 10px 0;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

.create-quiz:hover {
    background-color: #13b0c7;
}

.success-message {
    color: green;
    font-weight: bold;
}

.error-message {
    color: red;
    font-weight: bold;
}

.back-button {
    margin-bottom: 20px;
    background-color: #1768af;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.back-button:hover {
    background-color: #5a6268;
}
</style>