
const VITE_API_URL = import.meta.env.VITE_API_URL




const ENV = {
    VITE_API_URL,
}


for (const env in ENV) {
    if (!env) throw new Error("VITE_API_URL is not defined in the env");
}


export default ENV;