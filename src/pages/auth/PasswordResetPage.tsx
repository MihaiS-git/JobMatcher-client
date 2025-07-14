import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageContent from "../../components/PageContent";
import { useEffect, useState } from "react";
import {
  validateConfirmPassword,
  validatePassword,
} from "../../utils/validation";
import {
  useResetPasswordMutation,
  useValidateResetTokenQuery,
} from "../../features/authApi";

const PasswordResetPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [errors, setErrors] = useState<{
    password?: string | null;
    confirmPassword?: string | null;
    token?: string | null;
  }>({});

  const { error, isLoading: isValidating } = useValidateResetTokenQuery(
    token ?? "",
    { skip: !token }
  );

  useEffect(() => {
    if (!token) {
      setErrors({ token: "Invalid or missing reset token." });
      return;
    }

    if (error) {
      const status = "status" in error ? error.status : null;
      if (status === 401) {
        setErrors({
          token: "Invalid or expired reset token. Please request a new one.",
        });
      } else {
        setErrors({
          token: "An unexpected error occurred while validating the token.",
        });
      }
    } else {
      setErrors({});
    }
  }, [token, error]);

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors({ token: "Invalid or missing reset token." });
      return;
    }

    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    try {
      const result = await resetPassword({ password, token });
      if ("data" in result && result?.data?.success) {
        navigate("/auth");
      } else {
        const message =
          "error" in result
            ? JSON.stringify(result.error)
            : "Password reset failed.";
        alert(message);
      }
    } catch (err: unknown) {
      console.error("Password reset failed", err);
      alert("Password reset failed. Please try again.");
    }
  };

  return (
    <PageContent className="flex flex-col items-center justify-center">
      <div className="w-full md:w-160 border border-blue-950 bg-blue-200 dark:bg-blue-900 shadow-lg shadow-blue-400">
        <h1 className="font-semibold text-lg xl:text-2xl text-center m-8 mx-auto">
          Reset Password Form
        </h1>
        <form
          className="flex flex-col items-stretch p-4"
          onSubmit={handleResetPasswordSubmit}
        >
          <label
            htmlFor="password"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            New Password
            <input
              id="password"
              type="password"
              name="password"
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="New Password..."
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                const passwordError = validatePassword(password);
                setErrors((prev) => ({ ...prev, password: passwordError }));
              }}
              autoComplete="new-password"
            />
          </label>
          {errors?.password && (
            <p className="text-red-600 text-xs px-4 mt-[-8px] mb-2">
              {errors.password}
            </p>
          )}

          <label
            htmlFor="confirmPassword"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            Confirm
            <br />
            Password
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="Confirm password..."
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => {
                const confirmPasswordError = validateConfirmPassword(
                  password,
                  confirmPassword
                );
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: confirmPasswordError,
                }));
              }}
            />
          </label>
          {errors?.confirmPassword && (
            <p className="text-red-600 text-xs px-4 mt-[-8px] mb-2">
              {errors.confirmPassword}
            </p>
          )}

          <div className="w-full text-center py-8">
            <button
              type="submit"
              disabled={isLoading || isValidating}
              className="bg-blue-400 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 hover:text-blue-200 dark:hover:text-blue-950 px-12 py-1 rounded-sm ring-1 ring-blue-900 text-sm xl:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Reset"}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs font-extralight">
              Do you have an account?{" "}
              <Link
                to="/auth"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-600"
              >
                Login
              </Link>
            </p>
            <p className="text-xs font-extralight">
              Don't you have an account?{" "}
              <Link
                to="/register"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-600"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
        {!isValidating && errors?.token && (
          <div className="flex flex-col items-center">
            <p className="text-red-600 text-center">{errors.token}</p>
            <Link
              to="/auth/recover-password"
              className="text-blue-600 underline"
            >
              Request a new password reset
            </Link>
          </div>
        )}
      </div>
    </PageContent>
  );
};

export default PasswordResetPage;
