import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/App.vue' 
import LoginPage from '@/views/LoginPage.vue'
import UserInfoPage from '@/views/UserInfoPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
	routes
})

export default router;
