import useToastStore from '@/stores/toastStore';
import ToastMessage from './Toast';

function ToastContainer(): JSX.Element | null {
  const toast = useToastStore((state) => state.toast);

  if (!toast) {
    return null;
  }

  return <ToastMessage toast={toast} />;
}

export default ToastContainer;
