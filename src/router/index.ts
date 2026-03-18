import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import AppointmentForm from '@/components/AppointmentForm.vue';
import SubmitSuccess from '@/components/SubmitSuccess.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: AppointmentForm,
    meta: {
      title: '社区肠胃预约登记表'
    }
  },
  {
    path: '/success',
    name: 'Success',
    component: SubmitSuccess,
    meta: {
      title: '提交成功'
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 路由守卫：设置页面标题
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});

export default router;
