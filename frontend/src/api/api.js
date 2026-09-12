import axiosInstance from "./axios";

// ===== AUTH =====
export const login = (credentials) =>
  axiosInstance.post("/auth/login", credentials);

export const logout = () => localStorage.removeItem("token");

// ===== PROFILE =====
export const getProfile = () => axiosInstance.get("/profile");

export const updateProfile = (formData) =>
  axiosInstance.put("/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ===== PROJECTS =====
export const getProjects = () => axiosInstance.get("/project");

export const addProject = (formData) =>
  axiosInstance.post("/project", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProject = (id) => axiosInstance.delete(`/project/${id}`);

// ===== SKILLS =====
export const getSkills = () => axiosInstance.get("/skill");

export const addSkill = (data) => axiosInstance.post("/skill", data);

export const deleteSkill = (id) => axiosInstance.delete(`/skill/${id}`);

// ===== INQUIRIES =====
export const sendInquiry = (data) => axiosInstance.post("/inquiry", data);

export const getInquiries = () => axiosInstance.get("/inquiry");

export const replyInquiry = (id, replyText) =>
  axiosInstance.post(`/inquiry/${id}/reply`, { replyText });

export const deleteInquiry = (id) => axiosInstance.delete(`/inquiry/${id}`);
