import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserProvider } from './context/UserContext';

import AppNavbar from './components/AppNavbar';
import Register from './pages/Register';
import Login from './pages/Login';
import MovieCatalog from './pages/MovieCatalog';
import MovieDetails from './pages/MovieDetails';
import Home from './pages/Home';
import Logout from './pages/Logout';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser() {
    localStorage.clear();
    setUser({
      id: null,
      isAdmin: null
    });
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          console.log("User details received:", data);
          setUser({
            id: data.user._id,
            isAdmin: data.user.isAdmin,
          });
        } else {
          setUser({
            id: null,
            isAdmin: null
          });
        }
      })
      .catch(error => {
        console.error("Error fetching user details:", error);
        setUser({
          id: null,
          isAdmin: null
        });
      });
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<MovieCatalog />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;