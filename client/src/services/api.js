import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTranscriptions = async () => {
  const response = await api.get("/transcriptions");
  return response.data;
};

export const saveTextTranscription = async (data) => {
  const response = await api.post("/transcriptions/text", data);
  return response.data;
};


export const createTranscription = async (data) => {
  const response = await api.post("/transcriptions", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateTranscription = async (id, data) => {
  const response = await api.put(`/transcriptions/${id}`, data);
  return response.data;
};

export const deleteTranscription = async (id) => {
  const response = await api.delete(`/transcriptions/${id}`);
  return response.data;
};

export default api;
