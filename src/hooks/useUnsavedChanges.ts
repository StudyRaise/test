import { ref, watch, onMounted, onBeforeUnmount, type Ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { showConfirmDialog } from 'vant';

/**
 * 表单修改未保存离开提示 Hook
 * @param formData 表单数据对象 (响应式对象)
 * @returns { isSubmitSuccess } 提交成功状态 ref，提交成功前需置为 true
 */
export function useUnsavedChanges(formData: object) {
  const isFormModified = ref(false);
  const isSubmitSuccess = ref(false);

  // 监听表单数据变化
  watch(formData, () => {
    isFormModified.value = true;
  }, { deep: true });

  // 页面离开拦截 (路由跳转)
  onBeforeRouteLeave((to, from, next) => {
    if (isFormModified.value && !isSubmitSuccess.value) {
      showConfirmDialog({
        title: '提示',
        message: '当前页面有修改未保存，是否确认离开？',
      })
        .then(() => {
          // 确认离开
          next();
        })
        .catch(() => {
          // 取消离开
          next(false);
        });
    } else {
      next();
    }
  });

  // 页面关闭/刷新拦截 (浏览器原生行为)
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isFormModified.value && !isSubmitSuccess.value) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  };

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  return {
    isSubmitSuccess,
    isFormModified
  };
}
