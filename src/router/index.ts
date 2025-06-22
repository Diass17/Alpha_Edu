import { createRouter, createWebHistory } from 'vue-router'

// 📄 Views
import Home            from '@/views/Home.vue'
import Login           from '@/views/Login.vue'
import Finance         from '@/views/Finance.vue'

// 🧑‍🎓 Student
import Students        from '@/views/Students.vue'
import StudentForm     from '@/views/StudentForm.vue'
import StudentProfile  from '@/views/StudentProfile.vue'
import StudentDetail   from '@/views/StudentDetail.vue'

// 📚 Course
import Courses         from '@/views/Courses.vue'
import AddCourse       from '@/views/AddCourse.vue'
import CourseForm      from '@/views/CourseForm.vue'
import CourseFlows     from '@/views/CourseFlows.vue'

// 🔄 Flows
import AddFlow         from '@/views/AddFlow.vue'
import FlowDetail      from '@/views/FlowDetail.vue'
import EditFlow        from '@/views/EditFlow.vue'

const routes = [
  { path: '/', redirect: '/login' },

  // 🏠 Auth + Home
  { path: '/login', name: 'Login', component: Login },
  { path: '/home',  name: 'Home',  component: Home },

  // 👨‍🎓 Students
  { path: '/students',                 name: 'Students',       component: Students },
  { path: '/students/new',            name: 'NewStudent',     component: StudentForm },
  { path: '/students/:id',            name: 'EditStudent',    component: StudentForm,    props: true },
  { path: '/students/:id/profile',    name: 'StudentProfile', component: StudentProfile, props: true },
  { path: '/students/:id/detail',     name: 'StudentDetail',  component: StudentDetail,  props: true },

  // 📘 Courses
  { path: '/courses',                 name: 'Courses',        component: Courses },
  { path: '/courses/new',            name: 'AddCourse',      component: AddCourse },
  { path: '/courses/:id/edit',       name: 'EditCourse',     component: CourseForm,      props: true },
  { path: '/courses/:id/flows',      name: 'CourseFlows',    component: CourseFlows,     props: true },

  // 🔄 Flows
  { path: '/flows/add',              name: 'AddFlow',        component: AddFlow },
  { path: '/flows/:flowId',          name: 'FlowDetail',     component: FlowDetail,      props: true },
  { path: '/flows/:flowId/edit',     name: 'EditFlow',       component: EditFlow,        props: true },

  // 💵 Finance
  { path: '/finance',                name: 'Finance',        component: Finance },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
