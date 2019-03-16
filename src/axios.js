import axios from 'axios';

const instance = axios.create({
    baseURL: "https://data.melbourne.vic.gov.au/resource/dtpv-d4pf.json"
});


export default instance;
