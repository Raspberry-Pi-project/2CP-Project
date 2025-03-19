import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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


export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  // List of pages where BannerApp should be shown instead of Navbars
  const bannerPages = ["/NoQuizzes", "/Info", "/Duration"]; //here add the pages of the web app

  const showBanner = bannerPages.includes(location.pathname);

  return (
    <Fragment>
      {/* Show BannerApp on specific pages, otherwise show Navbars */}
      {showBanner ? <BannerApp /> : <Navbars />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/NoQuizzes" element={<FullPage />} />
        <Route path="/Info" element={<Info />} />
        <Route path="/Duration" element={<Duration />} />
      </Routes>

      {/* Hide Footer on pages that use BannerApp */}
      {!showBanner && <Footer />}
    </Fragment>
  );
}
