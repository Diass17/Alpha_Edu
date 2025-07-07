import { createRouter, createWebHistory } from 'vue-router'

// 📄 Core Views
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Verification from '@/views/Verification.vue'

// 👨‍🎓 Students
import Students from '@/views/Students.vue'
import StudentForm from '@/views/StudentForm.vue'
import StudentProfile from '@/views/StudentProfile.vue'
import StudentDetail from '@/views/StudentDetail.vue'

// 📘 Courses
import Courses from '@/views/Courses.vue'
import AddCourse from '@/views/AddCourse.vue'
import CourseForm from '@/views/CourseForm.vue'
import CourseFlows from '@/views/CourseFlows.vue'

// 🔄 Flows
import Flows from '@/views/Flows.vue'
import AddFlow from '@/views/AddFlow.vue'
import FlowDetail from '@/views/FlowDetail.vue'
import EditFlow from '@/views/EditFlow.vue'

// 💵 Finance
import Finance from '@/views/Finance.vue'
import StudentPaymentCalendar from '@/views/StudentPaymentCalendar.vue'

// 🔧 Components
import CustomDropdown from '@/components/CustomDropdown.vue'

const routes = [
  { path: '/', redirect: '/login' },

  // 🔐 Auth
  { path: '/login', name: 'Login', component: Login },
  { path: '/verification', name: 'Verification', component: Verification, meta: { noLayout: true } },

  // 🏠 Home
    { path: '/home', name: 'Home', component: Home },

  // 👨‍🎓 Students
  { path: '/students', name: 'Students', component: Students },
  { path: '/students/new', name: 'NewStudent', component: StudentForm },
  { path: '/students/:id', name: 'EditStudent', component: StudentForm, props: true },
  { path: '/students/:id/profile', name: 'StudentProfile', component: StudentProfile, props: true },
  { path: '/students/:id/detail', name: 'StudentDetail', component: StudentDetail, props: true },

  // 📘 Courses
  { path: '/courses', name: 'Courses', component: Courses },
  { path: '/courses/new', name: 'AddCourse', component: AddCourse },
  { path: '/courses/:id/edit', name: 'EditCourse', component: CourseForm, props: true },
  { path: '/courses/:id/flows', name: 'CourseFlows', component: CourseFlows, props: true },

  // 🔄 Flows
  { path: '/flows', name: 'Flows', component: Flows },
  { path: '/courses/:courseId/flows/add', name: 'AddFlow', component: AddFlow, props: true },
  { path: '/flows/:flowId', name: 'FlowDetail', component: FlowDetail, props: true },
  { path: '/flows/:flowId/edit', name: 'EditFlow', component: EditFlow, props: true },

  // 💵 Finance
  { path: '/finance', name: 'Finance', component: Finance },
  { path: '/finance/payments', name: 'StudentPayments', component: () => import('@/views/StudentPayments.vue') },
  { path: '/finance/reports', name: 'Reports', component: () => import('@/views/Reports.vue') },
  { path: '/finance/reports/total-revenue', name: 'TotalRevenue', component: () => import('@/views/TotalRevenue.vue') },
  { path: '/finance/reports/debts', name: 'Debts', component: () => import('@/views/Debts.vue') },
  { path: '/finance/reports/student-funding', name: 'StudentFunding', component: () => import('@/views/StudentFunding.vue') },
  { path: '/payments/:id/calendar', name: 'StudentPaymentCalendar', component: StudentPaymentCalendar, props: true },

  // 🧪 Misc
  { path: '/dropdown-test', name: 'DropdownTest', component: CustomDropdown }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔐 Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const publicPages = ['Autorization', 'Verification']

  if (!isAuthenticated && !publicPages.includes(to.name as string)) {
    return next('/login')
  }

  next()
})