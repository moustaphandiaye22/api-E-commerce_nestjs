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

// Admin components
const AdminLayout = () => import('../views/admin/AdminLayout.vue')
const AdminDashboard = () => import('../views/admin/AdminDashboard.vue')
const AdminProducts = () => import('../views/admin/AdminProducts.vue')
const AdminProductForm = () => import('../views/admin/AdminProductForm.vue')
const AdminCategories = () => import('../views/admin/AdminCategories.vue')
const AdminCoupons = () => import('../views/admin/AdminCoupons.vue')
const AdminOrders = () => import('../views/admin/AdminOrders.vue')
const AdminUsers = () => import('../views/admin/AdminUsers.vue')

const routes: RouteRecordRaw[] = [
  // Public routes
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
  // Protected routes (require authentication)
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
  // Admin routes (require authentication + admin role)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard,
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: AdminProducts,
      },
      {
        path: 'products/new',
        name: 'AdminProductNew',
        component: AdminProductForm,
      },
      {
        path: 'products/:id',
        name: 'AdminProductEdit',
        component: AdminProductForm,
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: AdminCategories,
      },
      {
        path: 'coupons',
        name: 'AdminCoupons',
        component: AdminCoupons,
      },
      {
        path: 'coupons/new',
        redirect: '/admin/coupons',
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: AdminOrders,
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navigation pour les routes protégées
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Vérifier l'authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Vérifier le rôle admin
  if (to.meta.requiresAdmin) {
    // Si l'auth store n'est pas encore initialisé, attendre ou rediriger
    if (!authStore.user) {
      // Tentative de récupération du profil si token existe
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          await authStore.fetchProfile()
        } catch {
          next({ name: 'Login' })
          return
        }
      } else {
        next({ name: 'Login' })
        return
      }
    }

    // Vérifier si admin après mise à jour
    if (authStore.user?.role !== 'ADMIN') {
      // Rediriger vers la page d'accueil si pas admin
      next({ name: 'Home' })
      return
    }
  }

  next()
})

export default router

