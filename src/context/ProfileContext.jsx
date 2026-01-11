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
        console.log("Profile data fetched:", data);
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("[ERROR] ProfileContext - Failed to load profile:", err);
        setError(err.message);
        // Fallback data khi API lỗi (để UI không bị trống)
        setProfile({
          id: 1,
          fullName: "Nguyen Duy Linh",
          title: "Backend Engineer",
          bio: "Backend Java Developer with a background in Electrical Engineering. Completed an 12-month Fullstack course and built multiple projects using Java Spring Boot.",
          email: "duylinh63b5@gmail.com",
          githubUrl: "https://github.com/DUYLINH1402",
          linkedinUrl: null,
          avatarUrl:
            "https://res.cloudinary.com/ddia5yfia/image/upload/v1767447064/3C937529-0AD2-409F-B0BD-BB31B4A5A841_1_201_a_u9dzus.jpg",
        });
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
