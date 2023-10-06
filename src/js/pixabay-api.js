import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39866612-e7964125725bbe7947c64adff';
export const Per_page = 40;

export async function getImages(searchQuery, page) { 
    const response = await axios.get(`${BASE_URL}`, {
        params: {
            key: API_KEY,
            q: searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: Per_page,
            page,
        },
    });
    return response.data;
};