module.exports=(code)=>{
    let status;
    switch(code){
        case 200:status="successful";
        break;
        case 201:status="created";
        break;
        case 400:status="bad request";
        break;
        case 401:status="not authorized";
        break;
        case 404:status="not found";
        break;
        case 403:status="forbidden";
        break;
        case 409:status="conflict";
        break;
        case 422:status="unprocessable entity";
        break;
        case 500:status="server internal error";
        break;
        default:
            status="enter true code";
    }

return status;
}