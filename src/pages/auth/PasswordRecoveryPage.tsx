import { Link } from "react-router-dom";
import PageContent from "../../components/PageContent";
import { useState } from "react";
import { validateEmail } from "../../utils/validation";
import { useRecoverPasswordMutation } from "../../features/authApi";
import { parseApiError } from "../../utils/parseApiError";

const PasswordRecoveryPage = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string | null }>({});
  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [recoverPassword, { isLoading }] = useRecoverPasswordMutation();

  const handlePasswordRecoveryFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      await recoverPassword({ email }).unwrap();
      setMessage("Check your inbox for a password reset link.");
      setErrors({});
    } catch (err: unknown) {
      /* console.log(err); */
      setApiError(parseApiError(err));
    }
  };

  return (
    <PageContent className="flex flex-col items-center justify-center">
      <div className="w-full md:w-160 border border-blue-950 bg-blue-200 dark:bg-blue-900 shadow-lg shadow-blue-400">
        <h1 className="font-semibold text-lg xl:text-2xl text-center m-8 mx-auto">
          Recover Password Form
        </h1>

        {message && (
          <p className="text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-800 px-4 py-2 mx-4 mb-4 rounded text-sm text-center">
            {message}
          </p>
        )}

        <form
          className="flex flex-col items-stretch p-4"
          onSubmit={handlePasswordRecoveryFormSubmit}
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

          <div className="w-full text-center py-8">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 hover:text-blue-200 dark:hover:text-blue-950 px-12 py-1 rounded-sm ring-1 ring-blue-900 text-sm xl:text-base"
            >
              {isLoading ? "Loading..." : "Recover Password"}
            </button>
          </div>

          {apiError && (
            <p className="text-red-600 dark:text-red-400 text-center text-sm mb-4 px-4">
              {apiError}
            </p>
          )}

          <div className="flex flex-col items-center justify-center">
            <p className="text-xs font-extralight">
              Do you have an account?{" "}
              <Link
                to="/auth"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-500"
              >
                Login
              </Link>
            </p>
            <p className="text-xs font-extralight">
              Don't you have an account?{" "}
              <Link
                to="/register"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-500"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </PageContent>
  );
};

export default PasswordRecoveryPage;
