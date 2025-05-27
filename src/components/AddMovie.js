import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddMovie = ({ show, onHide, fetchMovies, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [poster, setPoster] = useState(""); // New state
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addMovie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          director,
          year: Number(year),
          description,
          genre,
          poster // Include poster URL
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add movie");
      }

      const data = await response.json();

      if (data && data._id) {
        onSuccess("add");
        // Reset fields
        setTitle("");
        setDirector("");
        setYear("");
        setDescription("");
        setGenre("");
        setPoster(""); // Reset poster
        fetchMovies();
        onHide();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error("Error:", err);
      onSuccess("error", err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Director:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter director name"
              required
              value={director}
              onChange={(e) => setDirector(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Year:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter release year"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1800"
              max={new Date().getFullYear()}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter movie description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Genre:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter genre"
              required
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Poster URL:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter poster image URL"
              required
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="mt-3"
            >
              {isLoading ? "Adding..." : "Add Movie"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddMovie;
