import { useState } from "react";
import { Link } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            console.log({ email, password });
            // TODO: call login API
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm w-full mx-auto space-y-4">
            <h2 className="text-xl font-semibold text-center">Login</h2>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                {isSubmitting ? "Logging in..." : "Login"}
            </button>
            <Link
                to="/signup"
                className="w-full flex justify-center  text-black rounded-md  transition"
            >
                Sign up
            </Link>
        </form>
    );
}


export default Login;