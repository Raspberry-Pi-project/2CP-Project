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
import Duration from "./Pages/CreationQuiz/Duration";
import Info from "./Pages/CreationQuiz/Info";
import Generating from "./Pages/CreationQuiz/generating";
import Finalization1 from "./Pages/CreationQuiz/Finalization1";
import Finalization2 from "./Pages/CreationQuiz/Finalization2";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { QuizProvider } from "./context/QuizProvider"; // Import the QuizProvider



export default function App() {
  return (
    <AuthProvider>
      <QuizProvider>
      <Router>
        <MainLayout />
       </Router>
       </QuizProvider>
    </AuthProvider>
  );
} 

function MainLayout() {
  const location = useLocation();

  const bannerPages = ["/noquizzes", "/info", "/duration", "/generating", "/finalization1", "/finalization2"];

  const showBanner = bannerPages.includes(location.pathname.toLowerCase());


{/*
  return (
    <Fragment>
      {/* Show BannerApp on specific pages, otherwise show Navbars 
      {showBanner ? <BannerApp /> : <Navbars />}
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/NoQuizzes" element={<FullPage />} />
        <Route path="/Info" element={<Info />} />
        <Route path="/Duration" element={<Duration />} />
        <Route path="/Generating" element={<Generating />} />
        <Route path="/Finalization1" element={<Finalization1 />} />
        <Route path="/Finalization2" element={<Finalization2 />} />
      </Routes>
  
      {/* Hide Footer on pages that use BannerApp 
      {!showBanner && <Footer />}
    </Fragment>
  );   */}



  return (
    <Fragment>
      {/* Show BannerApp on specific pages, otherwise show Navbars */}
      {showBanner ? <BannerApp /> : <Navbars />}

      <Routes>

      <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route 
          path="/NoQuizzes" 
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <FullPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Info" 
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <Info />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Duration" 
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <Duration />
            </ProtectedRoute>
          } 
        />

        <Route 
        path="/Generating"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Generating />
          </ProtectedRoute>
        }
      />
        <Route 
          path="/Finalization1" 
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <Finalization1 />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Finalization2" 
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
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
