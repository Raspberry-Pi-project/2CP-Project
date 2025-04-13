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
import { QuizProvider } from "./context/QuizProvider"; // Import the QuizProvider
import HistoryPage from "./Pages/History/historypage";
import QuizDetails from "./Pages/QuizDetails/quizdetails";
import Results from "./Pages/ResultsPage/results";
import DraftQuiz from "./Pages/DraftQuizPage/draftquiz";
import AdminDash from './Pages/Profile/AdminDash';
import TeacherDash from './Pages/Profile/TeacherDash';
import AdminTeacher from './Pages/Profile/AdminTeacher';
import AdminStudent from './Pages/Profile/AdminStudent';
import TeacherStudent from './Pages/Profile/TeacherStudents';
import TeacherStudentProfile from './Pages/Profile/TeacherStudentProfile';
import TeacherProfile from './Pages/Profile/TeacherProfile';
import StudentProfile from './Pages/Profile/StudentProfile';



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

  // Define routes where the banner and navbar should not be shown
  const noBannerOrNavbarPages = [
    "/admindash",
    "/teacherdash",
    "/adminteacher",
    "/adminstudent",
    "/teacherstudents",
    "/teacherstudentprofile",
    "/teacherprofile",
    "/studentprofile",
  ];

   // Define routes where only the banner should be shown
   const bannerPages = [
    "/noquizzes",
    "/info",
    "/duration",
    "/generating",
    "/finalization1",
    "/finalization2",
    "/historypage",
    "/quizdetails",
    "/results",
    "/draftquiz",
  ];

  const isNoBannerOrNavbar = noBannerOrNavbarPages.includes(location.pathname.toLowerCase());
  const showBanner = bannerPages.includes(location.pathname.toLowerCase());


  return (
    <Fragment>
      {/* Conditionally render BannerApp or Navbars */}
      {!isNoBannerOrNavbar && (showBanner ? <BannerApp /> : <Navbars />)}

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
        <Route path="/historypage" element={<HistoryPage />} />
        <Route path="/quizdetails" element={<QuizDetails />} />
        <Route path="/results" element={<Results />} />
        <Route path="/draftquiz" element={<DraftQuiz />} />
        <Route path="/AdminDash" element={<AdminDash />} /> {/* Admin will now include NavProfile */}
        <Route path="/TeacherDash" element={<TeacherDash />} />
        <Route path="/AdminTeacher" element={<AdminTeacher/>} />
        <Route path="AdminStudent" element={<AdminStudent/>}/>
        <Route path="TeacherStudents" element={<TeacherStudent/>}/>
        <Route path="TeacherStudentProfile" element={<TeacherStudentProfile/>}/>
        <Route path="/TeacherProfile" element={<TeacherProfile/>}/>
        <Route path="/StudentProfile" element={<StudentProfile/>}/>



{/*}
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
        
        
        // ADD HERE THE OTHER 4 PAGES THAT I ADDED
        
        */}

      </Routes>

      
      {/* Conditionally render Footer */}
      {!isNoBannerOrNavbar && !showBanner && <Footer />}
    </Fragment>
  );
}
