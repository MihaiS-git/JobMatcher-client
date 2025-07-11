import { Link, useNavigate } from "react-router-dom";
import PageContent from "../../components/PageContent";
import { useRegisterMutation } from "../../features/authApi";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validation";
import { useState } from "react";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [errors, setErrors] = useState<{
    email?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }>({});

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );
    const firstNameError = validateName(firstName);
    const lastNameError = validateName(lastName);

    if (
      emailError ||
      passwordError ||
      confirmPasswordError ||
      firstNameError ||
      lastNameError
    ) {
      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        firstName: firstNameError,
        lastName: lastNameError,
      });
      return;
    }

    try {
      const result = await register({ email, password, firstName, lastName });
      if ("error" in result) {
        alert("Registration failed: " + JSON.stringify(result.error));
        return;
      }
      navigate("/auth");
    } catch (err: unknown) {
      console.error("Registration failed", err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <PageContent className="flex flex-col items-center justify-center">
      <div className="w-full md:w-160 border border-blue-950 bg-blue-200 dark:bg-blue-900 shadow-lg shadow-blue-400">
        <h1 className="font-semibold text-lg xl:text-2xl text-center m-8 mx-auto">
          Registration Form
        </h1>
        <form
          className="flex flex-col items-stretch p-4"
          onSubmit={handleRegisterFormSubmit}
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
              autoComplete="email"
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
              value={confirmPassword}
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

          <label
            htmlFor="firstName"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            First Name
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={firstName}
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="John"
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => {
                const firstNameError = validateName(firstName);
                setErrors((prev) => ({ ...prev, firstName: firstNameError }));
              }}
              autoComplete="given-name"
            />
          </label>
          {errors?.firstName && (
            <p className="text-red-600 text-xs px-4 mt-[-8px] mb-2">
              {errors.firstName}
            </p>
          )}

          <label
            htmlFor="lastName"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            Last Name
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={lastName}
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="Doe"
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => {
                const lastNameError = validateName(lastName);
                setErrors((prev) => ({ ...prev, lastName: lastNameError }));
              }}
              autoComplete="family-name"
            />
          </label>
          {errors?.lastName && (
            <p className="text-red-600 text-xs px-4 mt-[-8px] mb-2">
              {errors.lastName}
            </p>
          )}

          <div className="w-full text-center py-8">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 hover:text-blue-200 dark:hover:text-blue-950 px-12 py-1 rounded-sm ring-1 ring-blue-900 text-sm xl:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs font-extralight">
              Do you have an account?{" "}
              <Link
                to="/auth"
                className="text-blue-800 underline dark:text-blue-100 hover:text-red-600"
              >
                Login
              </Link>
            </p>
            <p className="text-xs font-extralight">
              Forgot your password?{" "}
              <Link
                to="/reset-password"
                className="text-blue-800 underline dark:text-blue-100 hover:text-red-600"
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

export default RegistrationPage;
