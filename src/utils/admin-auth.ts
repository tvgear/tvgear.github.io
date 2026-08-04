export const ADMIN_SESSION_KEY = "tvgear-admin-authenticated";

export const getAdminAccessCode = (currentTime = new Date()): string => {
  const nextMinute = new Date(currentTime);
  nextMinute.setMinutes(nextMinute.getMinutes() + 1);

  const hours = String(nextMinute.getHours()).padStart(2, "0");
  const minutes = String(nextMinute.getMinutes()).padStart(2, "0");

  return `${minutes}${hours}`;
};

export const hasAdminSession = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
};

export const createAdminSession = (): void => {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
};
