import ENV from "../../utils/env.variables";



const apiGateway = {

    baseUrl: ENV.BASE_URL,

    auth: {
        me: () => "/user/me" as const, 
        login: () => "/auth/login" as const,
        refresh: () => "/auth/refresh" as const,
        signUp: () => "/users/" as const,
    },

    services: {
        emailContactUs: () => "/services/email/contact-us" as const,
        emailProperty: () => "/services/email/property" as const,
    },

    images: ENV.BASE_URL + "/images/",

    getSignedUrl: ENV.BASE_URL + "/images/getSignedUrl",

}




export default apiGateway;