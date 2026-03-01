// ========================================
// CONTEXT: Profile Context
// Quản lý state profile và chia sẻ giữa các component
// Pattern: Context + Custom Hook
// ========================================

import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/profileService";

// Tạo context
const ProfileContext = createContext(null);

/**
 * Provider component để wrap app
 * Fetch profile data khi mount và cung cấp cho children
 */
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        console.log("[ProfileContext] Fetched profile:", data);
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("[ERROR] ProfileContext - Failed to load profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Hàm refresh profile (dùng khi admin cập nhật)
  const refreshProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    profile,
    loading,
    error,
    refreshProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

/**
 * Custom hook để sử dụng profile context
 * @returns {{ profile: Object, loading: boolean, error: string, refreshProfile: Function }}
 */
export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
};

export default ProfileContext;
