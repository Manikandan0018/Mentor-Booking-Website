import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login } from "./component/Login/Login";
import { Signup } from "./component/Login/Sign";
import Home from "./component/Home/Home";
import MentorProfilePage from "./component/MentorDetailModal/MentorProfilePage";
import MentorDateBooking from "./component/mentorDateBook/MentorDateBooking";
import BookingSuccess from "./component/BookingSuccess/BookingSuccess";
import { useLocation } from "react-router-dom";

import BookedMentors from "./component/bookedMentors/BookedMentors";

import BookedUsers from "./component/BookedUser/BookedUser";
import Chat from "./component/bookedMentors/ChatRoom.jsx";
import Header from "./component/header/Header.jsx";
import { useEffect, useState } from "react";
import Footer from "./component/footer/Footer.jsx";




function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const [shouldHideFooter, setShouldHideFooter] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(console.error);
    }, []);
  
    useEffect(() => {
      const hideHeaderPaths = ["/sign", "/booking-success", "/"];

      // Check if current path matches any hide path
      const shouldHide = hideHeaderPaths.some((path) => {
        const regex = new RegExp("^" + path.replace(":id", "[^/]+") + "$");
        return regex.test(location.pathname);
      });

      setShouldHideHeader(shouldHide);
    }, [location.pathname]);
  
  
    useEffect(() => {
      const hideHeaderPaths = ["/sign", "/booking-success","/", "/chat"];

      // Check if current path matches any hide path
      const shouldHide = hideHeaderPaths.some((path) => {
        const regex = new RegExp("^" + path.replace(":id", "[^/]+") + "$");
        return regex.test(location.pathname);
      });

      setShouldHideFooter(shouldHide);
    }, [location.pathname]);
  
  
     
  
  return (
    <>
      {!shouldHideHeader && <Header user={user} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mentor/:id" element={<MentorProfilePage />} />
        <Route path="/mentorDateBooking/:id" element={<MentorDateBooking />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/bookedMentor" element={<BookedMentors />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/bookedUser" element={<BookedUsers />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </>
  );
}

export default App;
