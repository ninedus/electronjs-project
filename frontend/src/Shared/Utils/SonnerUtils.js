import { toast } from 'sonner';

export const showToast = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    ...options
  });
};

export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    duration: 4000,
    ...options
  });
};

export const showErrorToast = (message, options = {}) => {
  return toast.error(message, {
    duration: 5000,
    ...options
  });
};

export const showInfoToast = (message, options = {}) => {
  return toast.info(message, {
    duration: 4000,
    ...options
  });
};

export const showWarningToast = (message, options = {}) => {
  return toast.warning(message, {
    duration: 4000,
    ...options
  });
};

export const showActionToast = (message, actionLabel, onAction, options = {}) => {
  return toast(message, {
    duration: 5000,
    ...options,
    action: {
      label: actionLabel,
      onClick: onAction,
    },
  });
};

export const AlarmToasts = {
  created: (time) => showSuccessToast(`알람이 ${time}에 설정되었습니다.`),
  updated: (time) => showSuccessToast(`알람이 ${time}로 수정되었습니다.`),
  deleted: () => showSuccessToast('알람이 삭제되었습니다.'),
  activated: (time) => showInfoToast(`${time} 알람이 활성화되었습니다.`),
  deactivated: (time) => showInfoToast(`${time} 알람이 비활성화되었습니다.`),
  rang: (time) => showActionToast(
    `알람이 울렸습니다! (${time})`,
    '끄기',
    () => {
      showInfoToast('알람이 종료되었습니다.');
    }
  ),
  
  snoozed: (minutes = 5) => showInfoToast(`${minutes}분 후 다시 알립니다.`),
  error: (message = '알람 처리 중 오류가 발생했습니다.') => showErrorToast(message),
  
  volumeChanged: (volume) => showToast(`볼륨이 ${Math.round(volume * 100)}%로 설정되었습니다.`, {
    duration: 2000
  }),
  
  soundChanged: (soundName) => showToast(`알람음이 '${soundName}'으로 변경되었습니다.`, {
    duration: 2000
  })
};

export const AppToasts = {
  saved: () => showSuccessToast('저장되었습니다.'),
  cancelled: () => showInfoToast('취소되었습니다.'),
  loading: (message = '처리 중입니다...') => showToast(message, {
    duration: Infinity,
    dismissible: false
  }),
  
  networkError: () => showErrorToast('네트워크 연결을 확인해주세요.'),
  permissionDenied: () => showWarningToast('권한이 거부되었습니다.'),
  copied: () => showSuccessToast('클립보드에 복사되었습니다.', {
    duration: 2000
  }),
  
  invalidInput: (field = '입력값') => showErrorToast(`${field}이 올바르지 않습니다.`)
};

export const getToasterProps = (isDark = false) => ({
  theme: isDark ? 'dark' : 'light',
  position: 'bottom-right',
  richColors: true,
  expand: true,
  visibleToasts: 5,
  toastOptions: {
    style: {
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
      border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
    },
    className: 'sonner-toast',
    descriptionClassName: 'sonner-toast-description',
    actionButtonStyle: {
      background: '#3b82f6',
      color: 'white',
    },
    cancelButtonStyle: {
      background: isDark ? '#374151' : '#f3f4f6',
      color: isDark ? '#f9fafb' : '#111827',
    },
  }
});

export const TOAST_POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right'
};

export const getToasterPropsByPosition = (position, isDark = false) => ({
  ...getToasterProps(isDark),
  position
});

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};

let lastToastId = null;
export const showUniqueToast = (message, type = 'default', options = {}) => {
  if (lastToastId) {
    dismissToast(lastToastId);
  }
  
  const toastFunction = {
    default: showToast,
    success: showSuccessToast,
    error: showErrorToast,
    info: showInfoToast,
    warning: showWarningToast
  }[type] || showToast;
  
  lastToastId = toastFunction(message, options);
  return lastToastId;
};