import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LOGO from "../../photos/Design (1) 1.png"
import "./bann.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuiz } from "../../context/QuizProvider"
import {
  faHome,
  faBell,
  faPlus,
  faSearch,
  faChevronDown,
  faTimes,
  faBook,
  faUser,
  faQuestionCircle,
  faCog,
  faSignOutAlt,faUserCircle
} from "@fortawesome/free-solid-svg-icons"
import HamburgerMenu from "./hamburger-menu"

const Link = ({ to, children }) => <a href={to}>{children}</a>

const BannerApp = () => {
  const navigate = useNavigate()
  const [searchMode, setSearchMode] = useState("default")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("")


  const navigationRoutes = [
    {
      name: "Home",
      path: "/draftquiz",
      icon: <FontAwesomeIcon icon={faHome} />,
    },
    {
      name: "Profile",
      path: "/TeacherProfile",
      icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
      name: "History",
      path: "/historypage",
      icon: <FontAwesomeIcon icon={faBook} />,
    },
    {
      name: "Create Quiz",
      path: "/Info",
      icon: <FontAwesomeIcon icon={faPlus} />,
    },
    {
      name: "Draft",
      path: "/draftquiz",
      icon: <FontAwesomeIcon icon={faQuestionCircle} />,
    },
    {
      name: "Logout",
      path: "/",
      icon: <FontAwesomeIcon icon={faSignOutAlt} />,
    },
  ]


  const { quizData,setQuizData } = useQuiz() // Get setQuiz function from QuizProvider context
  const handleNewQuiz = () => {
    setQuizData({
      ...quizData,
      title: "",
      description: "",
      subject: "",
      nb_attempts:0 ,
      duration:0 , // Default 30 minutes
      correctionType: "auto", // Default to auto-graded
      score: 0, // Default score
      for_year: "", // To be filled by user
      for_groupe: "", // To be filled by user
      status: "draft", // Default to draft
      questions: [], // Array to hold questions
      created_at : "",
    })
    navigate("/Info")
  }

  const handleSearchClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const selectSearchMode = (mode) => {
    setSearchMode(mode)
    setIsDropdownOpen(true)
  }

  const selectYear = (year) => {
    setSelectedYear(year)
    setSearchMode("group")
  }

  const selectGroup = (group) => {
    setSelectedGroup(group)
    setIsDropdownOpen(false)
  }

  const resetSearch = (e) => {
    if (e) {
      e.stopPropagation()
    }
    setSearchMode("default")
    setSelectedYear("")
    setSelectedGroup("")
  }

  const getPlaceholderText = () => {
    if (selectedYear && selectedGroup) {
      return (
        <div className="selection-display">
          <span className="selection-badge year-badge">Year {selectedYear}</span>
          <span className="selection-badge group-badge">Group {selectedGroup}</span>
        </div>
      )
    }

    if (selectedYear) {
      return `Year ${selectedYear} - Select Group...`
    }

    if (searchMode === "year") {
      return "Select Year..."
    }

    return "Search..."
  }

  return (
    <div className="banner-container">
      <div className="banner-row py-2">
        {/* Hamburger Menu - Remove the extra div wrapper */}
        <div className="col-md-1 col-sm-2 text-center">
          <div className="banner-btn" >
          <HamburgerMenu routes={navigationRoutes} />
          </div>
        </div>

        {/* Home Button */}
        <div className="col-md-1 col-sm-2 text-center">
          <Link to="/draftquiz">
            <button className="banner-btn">
              <FontAwesomeIcon icon={faHome} />
            </button>
          </Link>
        </div>

        {/* Add Button  ; To Add QUIZZES*/}
        <div className="col-md-1 col-sm-2 text-center">
          <button className="banner-btnnn" onClick={handleNewQuiz}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* Search Bar  by year and grouup */}
        <div className="col-md-6 col-sm-6 text-center">
          <div className="banner-search-container">
            <div className="banner-search-bar" onClick={handleSearchClick}>
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <div className="search-text">{getPlaceholderText()}</div>
              {selectedYear && selectedGroup ? (
                <button className="reset-button" onClick={resetSearch} aria-label="Clear selection">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              ) : (
                <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
              )}
            </div>

            {isDropdownOpen && (
              <div className="search-dropdown">
                {searchMode === "default" && (
                  <div className="search-options">
                    <div className="search-option" onClick={() => selectSearchMode("year")}>
                      Select Year and Group
                    </div>
                  </div>
                )}

                {searchMode === "year" && (
                  <div className="search-options">
                    <div className="search-option back-option" onClick={() => setSearchMode("default")}>
                      ← Back to Search Options
                    </div>
                    <div className="option-header">Select Year</div>
                    {[1, 2, 3, 4, 5].map((year) => (
                      <div key={year} className="search-option" onClick={() => selectYear(year.toString())}>
                        Year {year}
                      </div>
                    ))}
                  </div>
                )}

                {searchMode === "group" && (
                  <div className="search-options">
                    <div className="search-option back-option" onClick={() => setSearchMode("year")}>
                      ← Back to Year Selection
                    </div>
                    <div className="option-header">Year {selectedYear} - Select Group</div>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((group) => (
                      <div key={group} className="search-option" onClick={() => selectGroup(group.toString())}>
                        Group {group}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="col-md-1 col-sm-3 text-center">
          <button className="banner-btn">
            <FontAwesomeIcon icon={faBell} />
          </button>
        </div>


        {/* Account Circle */}
        <div className="col-md-1 col-sm-3 text-center">
          <div className="banner-profile"
          onClick={() => navigate('/TeacherDash')}
          style={{ cursor: 'pointer'}}>
            <FontAwesomeIcon icon={faUserCircle} size="2x"  />
          </div>
        </div>


        {/* Small Logo */}
        <div className="col-md-2 col-sm-3 text-center">
          <Link to="/">
          <img src={LOGO} alt="Logo" className="banner-logo" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BannerApp
