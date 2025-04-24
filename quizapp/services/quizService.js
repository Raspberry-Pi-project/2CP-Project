import axios from "axios";
import { API_URL, getApiConfig } from "./config";

const API = axios.create(getApiConfig());

// Function to fetch quizzes for home page
export const fetchHomeQuizzes = async () => {
  try {
    const response = await API.post("/quizzes/get-quizzes", {
      page: 1,
      limit: 10,
      status: "PUBLISHED",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching home quizzes:", error);
    throw error;
  }
};

export const getAvailableQuizzes = async (
  page = 1,
  limit = 10,
  for_groupe,
  for_year
) => {
  try {
    const response = await api.post("/students/getQuizzesStudent", {
      page,
      limit,
      for_groupe,
      for_year,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Function to get quiz details
export const getQuizDetails = async (quizId) => {
  try {
    const response = await API.post(`${API_URL}/students/getQuizDetails`, {
      id_quiz: quizId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    throw error;
  }
};
