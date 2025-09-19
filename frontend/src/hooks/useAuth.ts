import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { login, register, logout, getProfile, clearError } from '@/store/slices/authSlice';
import { LoginRequest, RegisterRequest } from '@/types';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser && !isAuthenticated) {
      try {
        const userData = JSON.parse(storedUser);
        dispatch(setUser(userData));
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch, isAuthenticated]);

  const handleLogin = async (credentials: LoginRequest) => {
    const result = await dispatch(login(credentials));
    return result;
  };

  const handleRegister = async (userData: RegisterRequest) => {
    const result = await dispatch(register(userData));
    return result;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleGetProfile = async () => {
    const result = await dispatch(getProfile());
    return result;
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getProfile: handleGetProfile,
    clearError: handleClearError,
  };
};

// Import setUser from authSlice
import { setUser } from '@/store/slices/authSlice';
