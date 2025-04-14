import React, { useEffect, useRef, useState } from "react";
import headerimage from "../photos/headerimage.png";
import './Home.css';
import { Link } from "react-router-dom";
import teacherImage from "../photos/teacher-image.png";
import signupIcon from "../photos/signup-icon.png";
import createIcon from "../photos/create-icon.png";
import shareIcon from "../photos/share-icon.png";
import trackIcon from "../photos/track-icon.png";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const aboutRef = useRef(null);
  const howItWorksRef = useRef(null);
  const feedbacksRef = useRef(null);
  const whyChooseRef = useRef(null);
  
  // Testimonial carousel logic
  const testimonials = [
    {
      id: 1,
      stars: 5,
      text: "",
      author: "AMRI",
      role: "Teacher"
    },
    {
      id: 2,
      stars: 5,
      text: "",
      author: "AMRI",
      role: "Teacher"
    },
    {
      id: 3,
      stars: 5,
      text: "",
      author: "AMRI",
      role: "professor"
    }
  ];
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });
    
    const sections = [
      aboutRef.current,
      howItWorksRef.current,
      feedbacksRef.current,
      whyChooseRef.current
    ];
    
    sections.forEach(section => {
      if (section) observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      <header>
        <div className="container">
          <div className="row">
            <div className="col-md-6 ">
              <h5>Free & Automated</h5>
              <h2>Create, Share, and Track Student Quizzes —All <br></br> in One Place!</h2>
              <p>Save Time on Assessments – Focus More on Teaching!</p>
              <Link to="/signin" className="button">Get Started</Link>
            </div>
            <div className="col-md-6">
              <img src={headerimage || "/placeholder.svg"} alt="headerimage" />
            </div>
          </div>
        </div>
      </header>
      
      {/* About Us Section */}
      <section className="about-us-section" ref={aboutRef}>
        <div className="container">
          <div className="about-us-wrapper">
            <div className="about-us-left">
              <div className="logo-icon">
                <div className="logo-shape"></div>
              </div>
              
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <span className="check-icon"></span>
                  </div>
                  <h3>Easy Quiz Creation</h3>
                  <p>Drag & drop interface to add questions quickly</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <span className="check-icon"></span>
                  </div>
                  <h3>Auto-Grading & Reports</h3>
                  <p>Save time with automatic scoring & analytics.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <span className="check-icon"></span>
                  </div>
                  <h3>Customizable Access</h3>
                  <p>Set deadlines, shuffle questions, and limit attempts.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <span className="check-icon"></span>
                  </div>
                  <h3>Secure & Private</h3>
                  <p>Control who can access quizzes.</p>
                </div>
              </div>
            </div>
            
            <div className="about-us-right">
              <div className="about-us-header">
                <span className="about-label">ABOUT US</span>
                <h2>
                  An Intuitive Platform For <span className="highlight-text">Teachers</span> To
                  Design Interactive <span className="highlight-text">Quizzes</span> And Monitor
                  <span className="highlight-text"> Student</span> Performance
                </h2>
              </div>
              
              <div className="welcome-text">
                <p>Welcome to Trivio, the ultimate platform designed for teachers to create, manage, and analyze quizzes effortlessly. In order to simplify assessments, enhance learning, and save educators valuable time with powerful yet easy-to-use tools.</p>
              </div>
              
              <div className="mission-vision">
                <div className="mission">
                  <h4>OUR MISSION:</h4>
                  <p>Revolutionizing the way teachers create, manage, and analyze quizzes—saving time, improving accuracy, and making learning more interactive.</p>
                </div>
                <div className="vision">
                  <h4>OUR VISION:</h4>
                  <p>A future where every teacher has tools to assess, engage, and inspire students effortlessly—bridging the gap between teaching and technology.</p>
                </div>
              </div>
              
              <div className="get-started-btn-container">
                <Link to="/signup" className="get-started-btn">
                  Get Started Now! <span className="arrow-icon">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="curved-line-decoration"></div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section" ref={howItWorksRef}>
        <div className="container">
          <div className="section-title-container">
            <h2 className="section-title">How It Works ?</h2>
            <div className="curved-line"></div>
          </div>

          <div className="steps-container">
            <div className="step-card solid">
              <div className="step-icon">
                <img src={signupIcon || "/placeholder.svg"} alt="Sign Up Icon" />
              </div>
              <h3>SIGN UP & CREATE YOUR PROFILE</h3>
              <p>Teachers can sign up for free and set up their profile in seconds.</p>
            </div>

            <div className="step-card outline">
              <div className="step-icon dark">
                <img src={createIcon || "/placeholder.svg"} alt="Create Icon" />
              </div>
              <h3>CREATE & CUSTOMIZE QUIZZES</h3>
              <p>Easily build quizzes with multiple question types, time limits, and images.</p>
            </div>

            <div className="step-card solid">
              <div className="step-icon">
                <img src={shareIcon || "/placeholder.svg"} alt="Share Icon" />
              </div>
              <h3>SHARE WITH STUDENTS</h3>
              <p>Generate a unique quiz link or class code and share it with students.</p>
            </div>

            <div className="step-card outline">
              <div className="step-icon dark">
                <img src={trackIcon || "/placeholder.svg"} alt="Track Icon" />
              </div>
              <h3>TRACK STUDENT PERFORMANCE</h3>
              <p>Get real-time results, analytics, and insights to see how students are performing.</p>
            </div>
          </div>
        </div>
      </section>

  
      {/* Testimonials Section */}
      <section className="testimonials-section" ref={feedbacksRef}>
        <div className="container">
          <div className="testimonial-header">
            <span className="testimonial-label">TESTIMONIAL</span>
            <h2 className="testimonial-title">FeedBacks</h2>
          </div>
          
          <div className="testimonial-carousel">
            <button className="carousel-arrow prev" onClick={prevSlide}>
              &lt;
            </button>
            
            <div className="testimonial-slides">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className={`testimonial-card ${index === currentSlide ? 'active' : ''}`}
                >
                  <div className="stars">
                    {"★★★★★"}
                  </div>
                  <p className="testimonial-text">
                    "exmpleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee of feedbackkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar"></div>
                    <div className="author-info">
                      <h4>{testimonial.author}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="carousel-arrow next" onClick={nextSlide}>
              &gt;
            </button>
          </div>
        </div>
        
        {/* Marquee Section */}
        <div className="marquee-container">
          <div className="marquee">
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
            <span className="marquee-dot">•</span>
            <span>Making Quizz</span>
          </div>
        </div>
      </section>

      
      {/* Why Choose Section */}
      <section className="why-choose-section" ref={whyChooseRef}>
        <div className="container">
          <div className="why-choose-content">
            <div className="why-choose-text">
              <div className="badge-icon"></div>
              <h2>Why Choose Trivio</h2>
              <p>
                Trivio is a powerful, easy-to-use quiz platform designed specifically for teachers, making assessments faster, smarter, and more engaging.
              </p>
              <p>
                Our platform offers auto-grading and detailed analytics, saving teachers valuable time. Gamified quizzes with multimedia support keep students engaged, while advanced security ensures data protection. Make high-quality learning accessible to all. Join us today and transform the way you teach!
              </p>
              <Link to="/signin" className="start-quiz-btn">
                Start A Quiz <span className="arrow-icon">→</span>
              </Link>
            </div>
            <div className="why-choose-image">
              <img src={teacherImage || "/placeholder.svg"} alt="Teacher in classroom" />
              <div className="dots-decoration"></div>
            </div>
          </div>
        </div>
        <div className="decoration-elements">
          <div className="dot-grid"></div>
          <div className="arrows"></div>
          <div className="star-shape"></div>
          <div className="cap-shape"></div>
        </div>
      </section>
    </>
  );
}

export default Home;
