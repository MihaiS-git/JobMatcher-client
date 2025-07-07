import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full text-base text-center p-2 z-100 font-extrabold bg-blue-600 dark:bg-gray-900 text-blue-100 dark:text-gray-300">
                        <p className="hover:text-red-hover">
                <Link to="https://mihais-git.github.io/">
                    Mihai Suciu © 2025
                </Link>
            </p>
            <span className="font-light text-xs">Demo project - Developed for learning purposes</span>
        </footer>
    );
};

export default Footer;