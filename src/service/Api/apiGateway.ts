import ENV from "../../utils/env.variables";



const apiGateway = {

    baseUrl: ENV.BASE_URL,

    user: {
        me: "/user/me" as const, // * when talking to chat it advise you to do them this way, look into it,  me: () => "/user/me" as const, 
        login: () => "/user/login",
        sigIn: "/user/login",
        refresh: "/user/refresh",
        signUp: "/user/signup",
    },

    services: {
        emailContactUs: "/services/email/contact-us",
        emailProperty: "/services/email/property",
    },

    images: ENV.BASE_URL + "/images/",

    getSignedUrl: ENV.BASE_URL + "/images/getSignedUrl",

}




export default apiGateway;