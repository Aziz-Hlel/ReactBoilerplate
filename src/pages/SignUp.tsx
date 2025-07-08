import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
    const { signup } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!name) newErrors.name = "Name is required";
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

            const response = await signup({ name, email, password });

            if (response.success)
                navigate('/protected');

            if (!response.success && response.status === 309) setErrors({ email: "Email already exists" });

            if (!response.success && response.status !== 309) alert("Uncaught error");
            


        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm w-full mx-auto space-y-4 justify-center  items-center">
            <h2 className="text-xl font-semibold text-center">Sign Up</h2>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
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
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition hover:cursor-pointer "
            >
                {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>

            <div className=" w-full flex justify-center">
                <Link
                    to="/login"
                    className="w-fit flex justify-center  text-black rounded-md  transition  text-center"
                >
                    Log in
                </Link>
            </div>
        </form>
    );

}

export default SignUp;