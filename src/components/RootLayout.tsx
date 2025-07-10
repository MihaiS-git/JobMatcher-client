import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { loadCredentialsFromStorage } from "../features/authSlice";

const RootLayout = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(localStorage.getItem("auth")){
            dispatch(loadCredentialsFromStorage());
        }
    }, [dispatch]);

    return (
    <>
        <Header/>
        <Outlet/>
        <Footer/>
    </>
);
};

export default RootLayout;