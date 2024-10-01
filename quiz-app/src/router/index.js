import { createRouter, createWebHistory } from 'vue-router';
import AppLogin from '../views/AppLogin.vue';
import AppRegister from '../views/AppRegister.vue';
import MainDashboard from '../views/MainDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import ManagerDashboard from '../views/ManagerDashboard.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import AppQuiz from '../components/AppQuiz.vue';
import PasswordReset from '../components/ResetPassword.vue';
import UpdatePassword from '@/components/UpdatePassword.vue';
import CreateQuiz from '@/components/CreateQuiz.vue';


// Route guard to ensure only authenticated users can access certain routes
const requireAuth = (to, from, next) => {
  const token = localStorage.getItem('token'); // Check if user is authenticated
  if (!token) {
    next({ name: 'AppLogin' }); // If no token, redirect to login page
  } else {
    next(); // If authenticated, proceed to route
  }
};

const routes = [
  { path: '/', name: 'AppLogin', component: AppLogin },
  { path: '/register', name: 'AppRegister', component: AppRegister },
  // { path: '/student-dashboard', name: 'StudentDashboard', component: StudentDashboard },
  // { path: '/manager-dashboard', name: 'ManagerDashboard', component: ManagerDashboard },
  // { path: '/admin-dashboard', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/app-quiz', name: 'AppQuiz', component: () => import('../components/AppQuiz.vue') },
  { path: '/password-reset', component: PasswordReset },
  { path: '/update-password', name: 'UpdatePassword', component: UpdatePassword },
  { path: '/create-quiz', name: 'CreateQuiz', component: CreateQuiz,},
  {
    path: '/main-dashboard',
    name: 'MainDashboard',
    component: MainDashboard,
     beforeEnter: requireAuth, // Protect the main dashboard
    children: [
      {
        path: '/admin-dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        // beforeEnter: requireAuth, // Protect admin dashboard
      },
      {
        path: '/manager-dashboard',
        name: 'ManagerDashboard',
        component: ManagerDashboard,
        // beforeEnter: requireAuth, // Protect manager dashboard
      },
      {
        path: '/student-dashboard',
        name: 'StudentDashboard',
        component: StudentDashboard,
        // beforeEnter: requireAuth, // Protect student dashboard
      }
    ]
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;