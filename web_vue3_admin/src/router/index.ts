import { LocalCache } from '@/utils/cache'
import { createRouter, createWebHashHistory } from 'vue-router'
import { TOKEN } from "@/global/constants";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/main',
      component: () => import('../views/main/Main.vue')
    },
    {
      path: '/login',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('../views/not-found/NotFound.vue')
    }
  ]
})
//导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = LocalCache.get(TOKEN)
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
