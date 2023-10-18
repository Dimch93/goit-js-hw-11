// url = 'https://pixabay.com/api/';
// api_key = '39933999-f0fa465a086f20cae0ce79cf5';

export const BASE_URL = 'https://pixabay.com/api/';
export const API_KEY = '39933999-f0fa465a086f20cae0ce79cf5';
export const options = {
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
    q: '',
  },
};
