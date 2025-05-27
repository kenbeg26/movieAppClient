import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const EditMovie = ({ movie, fetchMovies, show, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    director: "",
    year: "",
    description: "",
    genre: "",
    poster: "" // New poster field
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        director: movie.director,
        year: movie.year,
        description: movie.description,
        genre: movie.genre || movie.gener || "",
        poster: movie.poster || "" // Populate existing poster if present
      });
    }
  }, [movie]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/updateMovie/${movie._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update movie");
      }

      onSuccess("edit");
      fetchMovies();
      onHide();
    } catch (err) {
      console.error("Error:", err);
      onSuccess("error", err.message || "Failed to update movie");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Director:</Form.Label>
            <Form.Control
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Year:</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Genre:</Form.Label>
            <Form.Control
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Poster URL:</Form.Label>
            <Form.Control
              type="text"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              placeholder="Enter poster image URL"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="mt-3"
            >
              {isLoading ? "Updating..." : "Update Movie"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditMovie;
