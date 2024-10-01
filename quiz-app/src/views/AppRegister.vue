<template>
    <div class="container">
        <div class="card">
            <h2 class="card-title">Student Registration</h2>
            <!-- Call handleRegister method instead of map action directly -->
            <form @submit.prevent="handleRegister">
                <div class="input-group form-group">
                    <label>Name:</label>
                    <input type="text" v-model="name" class="form-control" required />
                </div>
                <div class="input-group form-group">
                    <label>Email:</label>
                    <input type="email" v-model="email" class="form-control" required />
                </div>
                <div class="input-group form-group">
                    <label>Submit CV:</label>
                    <input type="file" @change="handleFileUpload" class="form-control" />
                </div>
                <button type="submit" class="btn-primary">Register</button>
            </form>
            <p class="haveaccount">Already have Account? <router-link to="/">Login here</router-link></p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'AppRegister',
    data() {
        return {
            name: '',
            email: '',
            cv_file: null
        };
    },
    methods: {
        ...mapActions(['register']),  // Map the register action from Vuex
        handleFileUpload(event) {
            this.cv_file = event.target.files[0];
        },
        async handleRegister() {
            const formData = new FormData();
            formData.append('name', this.name);
            formData.append('email', this.email);
            if (this.cv_file) {
                formData.append('cv_file', this.cv_file);  // Append only if file is uploaded
            }
            try {
                const success = await this.register(formData);  // Dispatch Vuex action for registration
                if (success) {
                    console.log('Registration successful');
                    this.$router.push('/');  // Redirect to dashboard on success
                } else {
                    console.error('Registration failed');
                }
            } catch (error) {
                if (error.response) {
                    // Log server-side validation errors
                    console.error('Validation errors:', error.response.data);
                } else {
                    console.error('Registration failed', error);
                }
            }
        }
    }
};
</script>


<style scoped>
.container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(270deg, #f7f3e9, #d4e4f7, #f9d5e5, #c8e7e4);
    background-size: 800% 800%;
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

.input-group {
    position: relative;
    margin-bottom: 1.25rem;
}

.form-control {

    border: 1px solid #ddd;
    border-radius: 8px;
    height: 40px;
    font-size: 16px;
    transition: border-color 0.3s ease;
    width: 100%;
    /* Make input fields full width */
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
    /* Make button full width */
    margin-top: 10px;
    cursor: pointer;
    border: none;
    /* Remove default border */
}

.btn-primary:hover {
    background-color: #001c3a;
}

.haveaccount {
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
