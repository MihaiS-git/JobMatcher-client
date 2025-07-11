import { Link, useNavigate } from "react-router-dom";
import PageContent from "../../components/PageContent";
import { useState } from "react";
import { useLoginMutation } from "../../features/authApi";
import { useAppDispatch } from "../../hooks/hooks";
import { setCredentials } from "../../features/authSlice";
import { validateEmail, validatePassword } from "../../utils/validation";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{
    email?: string | null;
    password?: string | null;
  }>();

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken,
        })
      );
      navigate("/");
    } catch (err: unknown) {
      console.error("Login failed", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <PageContent className="flex flex-col items-center justify-center">
      <div className="w-full md:w-160 border border-blue-950 bg-blue-200 dark:bg-blue-900 shadow-lg shadow-blue-400">
        <h1 className="font-semibold text-lg xl:text-2xl text-center m-8 mx-auto">
          Authentication Form
        </h1>
        <form
          className="flex flex-col items-stretch p-4"
          onSubmit={(e) => handleLoginFormSubmit(e)}
        >
          <label
            htmlFor="email"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            Email
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                const emailError = validateEmail(email);
                setErrors((prev) => ({ ...prev, email: emailError }));
              }}
            />
          </label>
          {errors?.email && (
            <p className="text-red-600 text-xs px-4 mt-[-8px] mb-2">
              {errors.email}
            </p>
          )}

          <label
            htmlFor="password"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            Password
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                const passwordError = validatePassword(password);
                setErrors((prev) => ({ ...prev, password: passwordError }));
              }}
            />
          </label>
          {errors?.password && (
            <p className="text-red-600 text-xs px-4 mt-[-8px] mb-2">
              {errors.password}
            </p>
          )}

          <div className="w-full text-center py-8">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 hover:text-blue-200 dark:hover:text-blue-950 px-12 py-1 rounded-sm ring-1 ring-blue-900 text-sm xl:text-base"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs font-extralight">
              Don't you have an account?{" "}
              <Link
                to="/register"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-600"
              >
                Register
              </Link>
            </p>
            <p className="text-xs font-extralight">
              Forgot your password?{" "}
              <Link
                to="/recover-password"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-600"
              >
                Reset Password
              </Link>
            </p>
          </div>
        </form>
      </div>
    </PageContent>
  );
};

export default AuthPage;
