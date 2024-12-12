// frontend/src/utils/auth.js
export const getRole = () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user?.role || null;
  } catch (error) {
    localStorage.removeItem("user"); // Clear invalid data
    localStorage.removeItem("token");
    return null;
  }
};

export const setUserData = (data) => {
  if (!data || !data.token || !data.user) return false;
  try {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
    return false;
  }
};
