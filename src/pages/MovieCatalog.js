import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function MovieCatalog() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovies`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMovies(data.movies || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <p>Loading movies...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading movies</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Browse Movies</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {movies.map((movie) => (
          <Col key={movie._id}>
            <Card className="h-100 shadow-sm">
              <Link to={`/movies/${movie._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                  {movie.poster ? (
                    <Card.Img
                      variant="top"
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                      <span>No Poster</span>
                    </div>
                  )}
                </div>
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text className="text-muted">{movie.genre || 'Unknown Genre'}</Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
