import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/App.vue' 
import LoginPage from '@/views/auth/LoginPage.vue'
import AdminLoginPage from '@/views/admin/AdminLoginPage.vue'
import UserInfoPage from '@/views/user/UserInfoPage.vue'
import ProfilePage from '@/views/user/ProfilePage.vue'
import ProfileEditPage from '@/views/user/ProfileEditPage.vue'
import UserListPage from '@/views/user/UserListPage.vue'
import AdminAccessRequestsPage from '@/views/admin/AdminAccessRequestsPage.vue'
import BlockedUsersPage from '@/views/admin/BlockedUsersPage.vue'
import NotFoundPage from '@/views/common/NotFoundPage.vue'

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
    path: '/admin/requests', 
    name: AdminAccessRequestsPage,
    component: AdminAccessRequestsPage 
  },
  {
    path: '/admin/blocked-users', 
    name: BlockedUsersPage,
    component: BlockedUsersPage
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
