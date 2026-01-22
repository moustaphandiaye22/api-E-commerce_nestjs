import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lazy-loaded components for better performance
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Products = () => import('../views/Products.vue')
const ProductDetail = () => import('../views/ProductDetail.vue')
const Profile = () => import('../views/Profile.vue')
const Cart = () => import('../views/Cart.vue')
const Wishlist = () => import('../views/Wishlist.vue')
const Orders = () => import('../views/Orders.vue')
const Checkout = () => import('../views/Checkout.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true },
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navigation pour les routes protégées
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router