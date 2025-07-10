import { Link } from "react-router-dom";
import PageContent from "../../components/PageContent";

const RegistrationPage = () => {
  return (
    <PageContent className="flex flex-col items-center justify-center">
      <div className="w-full md:w-160 border border-blue-950 bg-blue-200 dark:bg-blue-900 shadow-lg shadow-blue-400">
        <h1 className="font-semibold text-lg xl:text-2xl text-center m-8 mx-auto">
          Registration Form
        </h1>
        <form className="flex flex-col items-stretch p-4">
          <label
            htmlFor="email"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            Email
            <input
              id="email"
              type="email"
              name="email"
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="your@email.com"
            />
          </label>
          <label
            htmlFor="password"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            Password
            <input
              id="password"
              type="password"
              name="password"
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="password"
            />
          </label>
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
            />
          </label>
          <label
            htmlFor="firstName"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            First Name
            <input
              id="firstName"
              type="text"
              name="firstName"
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="John"
            />
          </label>
          <label
            htmlFor="lastName"
            className="font-light text-sm xl:text-base px-4 w-full flex flex-row items-center justify-between"
          >
            Last Name
            <input
              id="lastName"
              type="text"
              name="lastName"
              className="bg-gray-200 text-gray-950 px-2 py-0.5 m-2 w-4/6 rounded-sm border border-gray-950 text-sm xl:text-base"
              placeholder="Doe"
            />
          </label>

          <div className="w-full text-center py-8">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 hover:text-blue-200 dark:hover:text-blue-950 px-12 py-1 rounded-sm ring-1 ring-blue-900 text-sm xl:text-base"
            >
              Auth
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
