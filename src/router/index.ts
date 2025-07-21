// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home           from '@/views/Home.vue'
import Students       from '@/views/Students.vue'
import StudentForm    from '@/views/StudentForm.vue'
import StudentProfile from '@/views/StudentProfile.vue'
import Flows          from '@/views/Flows.vue'
import Finance        from '@/views/Finance.vue'
import StudentDetail  from '@/views/StudentDetail.vue'
import AddCourse      from '@/views/AddCourse.vue'
import CourseForm     from '@/views/CourseForm.vue'
import AddFlow        from '@/views/AddFlow.vue'
import FlowDetail     from '@/views/FlowDetail.vue'      
import EditFlow       from '@/views/EditFlow.vue'    
import Autorization   from '@/views/Autorization.vue'
import Verification   from '@/views/Verification.vue'   
import StudentPaymentCalendar from '@/views/StudentPaymentCalendar.vue'
import CustomDropdown from '@/components/CustomDropdown.vue'

const routes = [
  { path: '/',                    name: 'Home',            component: Home },
  { path: '/students',            name: 'Students',        component: Students },
  { path: '/students/new',        name: 'NewStudent',      component: StudentForm },
  { path: '/students/:id',        name: 'EditStudent',     component: StudentForm,   props: true },
  { path: '/students/:id/profile',name: 'StudentProfile',  component: StudentProfile, props: true },
  { path: '/flows',               name: 'Flows',           component: Flows },
  { path: '/finance',             name: 'Finance',         component: Finance },
  { path: '/students/:id/detail', name: 'StudentDetail',   component: StudentDetail, props: true },

  // ─── Course/Flow routes ──────────────────────────────────────────────────
  { path: '/courses/add',         name: 'AddCourse',       component: AddCourse },
  { path: '/courses/:id/edit',    name: 'EditCourse',      component: CourseForm,    props: true },

  { path: '/flows/add',           name: 'AddFlow',         component: AddFlow },
  { path: '/flows/:flowId',       name: 'FlowDetail',      component: FlowDetail,    props: true },
  { path: '/flows/:flowId/edit',  name: 'EditFlow',        component: EditFlow,      props: true },
  { path: '/login',               name: 'Autorization',    component: Autorization, meta: { noLayout: true } },
  { path: '/verification',        name: 'Verification',    component: Verification, meta: { noLayout: true }},
  { path: '/finance/payments', name: 'StudentPayments', component: () => import('@/views/StudentPayments.vue') },
  { path: '/finance/reports', name: 'Reports', component: () => import('@/views/Reports.vue') },
  { path: '/finance/reports/total-revenue', component: () => import('@/views/TotalRevenue.vue') },
  { path: '/finance/reports/debts', component: () => import ('@/views/Debts.vue') },
  { path: '/finance/reports/student-funding', name: 'StudentFunding', component: () => import('@/views/StudentFunding.vue') },
  { path: '/login', name: 'Autorization', component: Autorization },
  { path: '/verification', name: 'Verification', component: Verification },
  {
        path: '/payments/:id/calendar', // /finance/payments/42/calendar
        name: 'StudentPaymentCalendar',
        component: StudentPaymentCalendar,
        props: true
      },
  { path: '/dropdown-test', component: CustomDropdown }
  
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const publicPages = ['Autorization', 'Verification'] // по именам маршрутов

  if (!isAuthenticated && !publicPages.includes(to.name as string)) {
    return next('/login')
  }

  next()
})