import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8001/api/recipes",
});

export const generateRecipe = async (payload) =>
  (await API.post("/generate", payload)).data;

export const getAllRecipes = async () =>
  (await API.get("/")).data;

export const getRecipeById = async (id) =>
  (await API.get(`/${id}`)).data;

export const deleteRecipe = async (id) =>
  (await API.delete(`/${id}`)).data;

export const modifyRecipe = async (id, instruction) =>
  (await API.post(`/${id}/modify?instruction=${encodeURIComponent(instruction)}`)).data;
