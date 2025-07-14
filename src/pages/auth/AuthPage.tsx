import { Link, useNavigate } from "react-router-dom";
import PageContent from "../../components/PageContent";
import { useState } from "react";
import { useLoginMutation } from "../../features/authApi";
import { useAppDispatch } from "../../hooks/hooks";
import { setCredentials } from "../../features/authSlice";
import { validateEmail, validatePassword } from "../../utils/validation";
import { parseApiError } from "../../utils/parseApiError";

const API_ROOT_URL =
  import.meta.env.VITE_API_ROOT_URL || "http://localhost:8080";

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{
    email?: string | null;
    password?: string | null;
  }>();

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${API_ROOT_URL}/oauth2/authorization/google`;
  };

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
      if (result && result.token && result.user && result.refreshToken) {
        dispatch(
          setCredentials({
            user: result.user,
            token: result.token,
            refreshToken: result.refreshToken,
          })
        );
        navigate("/");
      } else {
        throw new Error("Login failed: Invalid response from server");
      }
    } catch (err: unknown) {
      console.error("Login failed", err);
      setLoginError(parseApiError(err));
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
            E-mail
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="E-mail..."
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                const emailError = validateEmail(email);
                setErrors((prev) => ({ ...prev, email: emailError }));
              }}
            />
          </label>
          {errors?.email && (
            <p className="text-red-600 dark:text-red-400 text-xs px-4 mt-[-8px] mb-2">
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
              placeholder="Password..."
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                const passwordError = validatePassword(password);
                setErrors((prev) => ({ ...prev, password: passwordError }));
              }}
            />
          </label>
          {errors?.password && (
            <p className="text-red-600 dark:text-red-400 text-xs px-4 mt-[-8px] mb-2">
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

          {loginError && (
            <p className="text-red-600 dark:text-red-400 text-center text-sm mb-4 px-4">
              {loginError}
            </p>
          )}

          <div className="flex flex-col items-center justify-center">
            <p className="text-xs font-extralight">
              Don't you have an account?{" "}
              <Link
                to="/register"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-500"
              >
                Register
              </Link>
            </p>
            <p className="text-xs font-extralight">
              Forgot your password?{" "}
              <Link
                to="/recover-password"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-500"
              >
                Reset Password
              </Link>
            </p>
          </div>
        </form>

        <hr />

        <div className="flex flex-row justify-center py-8">
          <button
            onClick={handleGoogleLogin}
            className="bg-gray-200 text-gray-950 px-6 py-3 rounded-sm
         hover:bg-gray-300 transition mb-4 max-w-sm flex items-center justify-center border border-gray-950"
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : (
              <div className="flex items-center justify-between space-x-2">
                <img
                  src="google-logo.svg"
                  alt="google logo"
                  className="w-5 h-5"
                />
                <span>Sign in with Google</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </PageContent>
  );
};

export default AuthPage;
