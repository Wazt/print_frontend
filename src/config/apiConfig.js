const ENV = 'developement' ; 


//dev : "http://127.0.0.1:8000/api/"

// prod : https://print-backend-z4p1.onrender.com/api/v1/
let BASE_API_URL = ""
//http://195.35.3.189:8000/api/v1/
const config = {
    developement : {
        API_URL : "/api/v1"
    },
}

/*
const BASE_API_URL = import.meta.env.VITE_API_URL;
export default BASE_API_URL;

*/

export default BASE_API_URL = config[ENV].API_URL;
