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
import Login          from '@/views/Login.vue'

const routes = [
  { path: '/', redirect: '/login' },

  { path: '/home',                    name: 'Home',            component: Home },
  { path: '/students',            name: 'Students',        component: Students },
  { path: '/students/new',        name: 'NewStudent',      component: StudentForm },
  { path: '/students/:id',        name: 'EditStudent',     component: StudentForm,   props: true },
  { path: '/students/:id/profile',name: 'StudentProfile',  component: StudentProfile, props: true },
  { path: '/flows',               name: 'Flows',           component: Flows },
  { path: '/finance',             name: 'Finance',         component: Finance },
  { path: '/students/:id/detail', name: 'StudentDetail',   component: StudentDetail, props: true },

  { path: '/courses/add',         name: 'AddCourse',       component: AddCourse },
  { path: '/courses/:id/edit',    name: 'EditCourse',      component: CourseForm,    props: true },

  { path: '/flows/add',           name: 'AddFlow',         component: AddFlow },
  { path: '/flows/:flowId',       name: 'FlowDetail',      component: FlowDetail,    props: true },
  { path: '/flows/:flowId/edit',  name: 'EditFlow',        component: EditFlow,      props: true },

  { path: '/login',               name: 'Login',           component: Login },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
