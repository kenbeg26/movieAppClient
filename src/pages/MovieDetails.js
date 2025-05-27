import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container, Card, Button, Spinner, Alert,
  Row, Col, Form, ListGroup
} from 'react-bootstrap';

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovie/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (movie && Array.isArray(movie.comments)) {
      setComments(movie.comments);
    }
  }, [movie]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addComment/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add comment');
      }

      setNewComment('');

      const updatedRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovie/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedMovie = await updatedRes.json();
      setMovie(updatedMovie);
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <p>Loading movie details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading movie</Alert.Heading>
          <p>{error}</p>
          <Link to="/movies" className="btn btn-primary">Back to Movies</Link>
        </Alert>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Movie not found</Alert.Heading>
          <p>The requested movie could not be found.</p>
          <Link to="/movies" className="btn btn-primary">Back to Movies</Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0 overflow-hidden mb-4">
            <Row className="g-0">
              <Col md={6} className="p-3 bg-light">
                <div style={{ height: '400px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                  {movie.poster ? (
                    <Card.Img
                      variant="top"
                      src={movie.poster}
                      alt={`${movie.title} Poster`}
                      className="img-fluid rounded"
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                      <span>No Poster Available</span>
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6} className="p-4">
                <Card.Body className="d-flex flex-column h-100 p-0">
                  <Card.Title as="h2" className="fw-bold mb-3">
                    {movie.title}
                  </Card.Title>

                  <Card.Text className="fs-5 mb-4 text-muted">
                    {movie.description || 'No description available'}
                  </Card.Text>

                  <div className="mb-3">
                    <p><strong>Genre:</strong> {movie.genre || 'N/A'}</p>
                    <p><strong>Director:</strong> {movie.director || 'N/A'}</p>
                    <p><strong>Year:</strong> {movie.year || 'N/A'}</p>
                  </div>

                  <div className="mt-auto">
                    <Button as={Link} to="/movies" variant="outline-secondary" className="w-100">
                      Back to Movies
                    </Button>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>

          {/* Comments Section */}
          <Card className="shadow-sm border-0">
            <Card.Header as="h5">Comments</Card.Header>
            <Card.Body>
              {commentError && <Alert variant="danger">{commentError}</Alert>}
              <Form onSubmit={handleCommentSubmit} className="mb-4">
                <Form.Group controlId="comment">
                  <Form.Label>Add a comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={commentLoading} className="mt-2">
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </Button>
              </Form>

              <div className="mt-3">
                <h6>Comment List</h6>
                {comments.length === 0 ? (
                  <Alert variant="info">No comments found for this movie.</Alert>
                ) : (
                  <ListGroup variant="flush">
                    {comments.map((comment) => (
                      <ListGroup.Item key={comment._id}>
                        <strong>User:</strong> {comment.userId}<br />
                        <span>{comment.comment || 'No comment text'}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
