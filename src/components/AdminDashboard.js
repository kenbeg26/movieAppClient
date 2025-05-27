import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Card,
  Stack,
  Toast,
  ToastContainer
} from "react-bootstrap";
import EditMovie from './EditMovie';
import DeleteMovie from './DeleteMovie';
import AddMovie from './AddMovie';
import { useMediaQuery } from 'react-responsive';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [actionType, setActionType] = useState("");

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const fetchMovies = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        const moviesData = data.movies || data;
        if (!Array.isArray(moviesData)) {
          throw new Error("Invalid data format received from API");
        }
        setMovies(moviesData);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setShowEditModal(true);
  };

  const handleDelete = (movie) => {
    setSelectedMovie(movie);
    setShowDeleteModal(true);
  };

  const showNotification = (action) => {
    setActionType(action);
    switch (action) {
      case 'add':
        setToastMessage("Movie added successfully!");
        break;
      case 'edit':
        setToastMessage("Movie updated successfully!");
        break;
      case 'delete':
        setToastMessage("Movie deleted successfully!");
        break;
      default:
        setToastMessage("Action completed successfully!");
    }
    setShowSuccessToast(true);
  };

  return (
    <Container className="py-4" fluid="md">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      {/* Notification Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          delay={3000}
          autohide
          bg={actionType === 'delete' ? 'danger' : 'success'}
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Stack direction="horizontal" gap={3} className="justify-content-center mb-4 flex-wrap">
        <Button variant="secondary" onClick={() => setShowAddModal(true)}>
          Add New Movie
        </Button>
      </Stack>

      {/* MOBILE VIEW - CARD LAYOUT */}
      {isMobile ? (
        <div className="movie-cards">
          {movies.map((movie) => (
            <Card key={movie._id} className="mb-3">
              {movie.poster && (
                <Card.Img
                  variant="top"
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text><small>ID: {movie._id.substring(0, 8)}...</small></Card.Text>
                <Card.Text>{movie.description}</Card.Text>
                <Card.Text>Director: {movie.director}</Card.Text>
                <Card.Text>Year: {movie.year}</Card.Text>
                <Card.Text>Genre: {movie.genre || movie.gener}</Card.Text>
                <Stack direction="horizontal" gap={2} className="justify-content-center">
                  <Button variant="warning" size="sm" onClick={() => handleEdit(movie)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(movie)}>Delete</Button>
                </Stack>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        // DESKTOP VIEW - TABLE LAYOUT
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Poster</th>
              <th>Title</th>
              <th>Director</th>
              <th>Year</th>
              <th>Genre</th>
              <th>Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id}>
                <td>{movie._id.substring(0, 8)}...</td>
                <td>
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt="poster"
                      style={{ width: "60px", height: "80px", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{movie.title}</td>
                <td>{movie.director}</td>
                <td>{movie.year}</td>
                <td>{movie.genre || movie.gener}</td>
                <td style={{ maxWidth: "250px" }}>{movie.description}</td>
                <td className="text-center">
                  <Stack direction="horizontal" gap={2} className="justify-content-center">
                    <Button variant="warning" size="sm" onClick={() => handleEdit(movie)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(movie)}>Delete</Button>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modals */}
      <EditMovie
        movie={selectedMovie}
        fetchMovies={fetchMovies}
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSuccess={() => showNotification('edit')}
      />
      <DeleteMovie
        movie={selectedMovie}
        fetchMovies={fetchMovies}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onSuccess={() => showNotification('delete')}
      />
      <AddMovie
        fetchMovies={fetchMovies}
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSuccess={() => showNotification('add')}
      />
    </Container>
  );
};

export default AdminDashboard;
