const VITE_API_URL = import.meta.env.VITE_API_URL

if (!VITE_API_URL) throw new Error("VITE_API_URL is not defined in the env");

export const baseUrl = VITE_API_URL + "/api";

const apiGateway = {

    baseUrl: baseUrl,

    user: {
        me: "/user/me",
        signUp: "/user/register",
        sigIn: "/user/login",
        refresh: "/user/refresh",
        getById: "/user/",
        updateAgent: "/user/update-agent",
        update: "/user/update-user",
        logOut: "/user/log-out",
        requestResetPassword: "/user/request-reset-password",
        resetPassword: "/user/reset-password",
        changePassword: "/user/change-password",
    },


    property: {
        list: "/property",
        create: "/property",
        getById: "/property",
        update: "/property",
        delete: "/property",
        myProperties: {
            list: "/property/my-properties",
        },
        pendingProperties: {
            list: "/property/pending-properties",
        },
        unavailableProperties: {
            list: "/property/unavailable-properties",
        },

        approve: "/property/approve",
        decline: "/property/decline",
        unavailable: "/property/unavailable",
        all_properties: "/property/all-properties",

        feature: {
            listAll: "/property/featured-properties",
            update: "/property/feature",
        },



    },

    agent: {
        list: "/agent/",
        create: "/agent",
        update: "/agent",
        delete: "/agent",
    },


    sponsor: {
        get: "/sponsor/",
        getAll: "/sponsor/all",
        create: "/sponsor",
        delete: "/sponsor",
        update: "/sponsor",
    },


    services: {
        emailContactUs: "/services/email/contact-us",
        emailProperty: "/services/email/property",
    },

    images: baseUrl + "/images/",

    getSignedUrl: baseUrl + "/images/getSignedUrl",

}




export default apiGateway;