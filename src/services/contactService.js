// ========================================
// SERVICE: Contact API Service
// Gọi API gửi tin nhắn liên hệ đến Backend
// ========================================

// Base URL cho API Backend - có thể thay đổi theo môi trường
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Gửi tin nhắn liên hệ đến Backend
 * API này công khai, không yêu cầu authentication
 *
 * @param {Object} contactData - Dữ liệu tin nhắn liên hệ
 * @param {string} contactData.name - Tên người gửi
 * @param {string} contactData.email - Email người gửi
 * @param {string} contactData.subject - Tiêu đề tin nhắn
 * @param {string} contactData.message - Nội dung tin nhắn
 * @returns {Promise<Object>} Response từ server
 */
export const submitContact = async (contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
      }),
    });

    const result = await response.json();

    // Xử lý trường hợp rate limit (429 - Too Many Requests)
    if (response.status === 429) {
      throw new Error(result.message || "Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau.");
    }

    // Xử lý lỗi validation (400 - Bad Request)
    if (response.status === 400) {
      throw new Error(result.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
    }

    // Xử lý các lỗi khác
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    // API trả về format: { status, message, data, timestamp }
    // Status 201 - Created thành công
    if (result.status === 201 && result.data) {
      return {
        success: true,
        message: result.message || "Tin nhắn đã được gửi thành công!",
        data: result.data,
      };
    }

    return {
      success: true,
      message: result.message || "Tin nhắn đã được gửi thành công!",
      data: result.data || result,
    };
  } catch (error) {
    console.error("[ERROR] Failed to submit contact message:", error);
    throw error;
  }
};

export default {
  submitContact,
};
