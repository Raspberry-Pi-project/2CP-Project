import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbars from "./components/Nav/navbar";
import Home from "./Pages/home";
import Footer from "./components/foot/footer";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { Fragment } from "react";
import BannerApp from "./components/BannerApp/bann";
import FullPage from "./Pages/NoQuizzespage/FullPage";
import Duration from './Pages/CreationQuiz/Duration';
import Info from "./Pages/CreationQuiz/Info";
import Finalization1 from "./Pages/CreationQuiz/Finalization1";
import Finalization2 from "./Pages/CreationQuiz/Finalization2";

import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
       </Router>
    </AuthProvider>
  );
}

function MainLayout() {
  const location = useLocation();

  // List of pages where BannerApp should be shown instead of Navbars
  const bannerPages = ["/NoQuizzes", "/Info", "/Duration", "/Finalization1", "/Finalization2"]; //here add the pages of the web app

  const showBanner = bannerPages.includes(location.pathname);

  return (
    <Fragment>
      {/* Show BannerApp on specific pages, otherwise show Navbars */}
      {showBanner ? <BannerApp /> : <Navbars />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/*<Route path="/NoQuizzes" element={<FullPage />} /> 
        <Route path="/Info" element={<Info />} />
        <Route path="/Duration" element={<Duration />} />
        <Route path="/Finalization1" element={<Finalization1 />} />
        <Route path="/Finalization2" element={<Finalization2 />} />  */}



        {/*<Route 
          path="/NoQuizzes" 
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <FullPage />
            </ProtectedRoute>
          } 
        /> */}

         <Route path="/NoQuizzes" element={<FullPage />} />

        <Route 
          path="/Info" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Info />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Duration" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Duration />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Finalization1" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Finalization1 />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Finalization2" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Finalization2 />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {/* Hide Footer on pages that use BannerApp */}
      {!showBanner && <Footer />}
    </Fragment>
  );
}
