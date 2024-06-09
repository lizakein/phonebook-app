import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/App.vue' 
import LoginPage from '@/views/LoginPage.vue'
import AdminLoginPage from '@/views/AdminLoginPage.vue'
import UserInfoPage from '@/views/UserInfoPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import ProfileEditPage from '@/views/ProfileEditPage.vue'
import UserListPage from '@/views/UserListPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    name: HomePage,
    component: HomePage 
  },
  { 
    path: '/login', 
    name: LoginPage,
    component: LoginPage 
  },
  {
    path: '/user-info',
    name: UserInfoPage,
    component: UserInfoPage
  },
  {
    path: '/profile/:id',
    name: 'ProfilePage',
    component: ProfilePage
  },
  {
    path: '/profile/:id/edit',
    name: ProfileEditPage,
    component: ProfileEditPage
  },
  {
    path: '/users',
    name: UserListPage,
    component: UserListPage
  },
  {
    path: '/admin/login', 
    name: AdminLoginPage,
    component: AdminLoginPage 
  },
  {
    path: '*',
    name: 'notFound',
    component: NotFoundPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
	routes
})

export default router;
