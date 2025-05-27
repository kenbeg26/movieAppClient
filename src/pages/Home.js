import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 text-center">
          {/* Header with logo/title */}
          <h1 className="display-4 mb-4" style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 700 }}>
            <span style={{ color: '#00c030' }}>Movie</span><span style={{ color: '#333' }}>Catalog</span>
          </h1>

          {/* Navigation links */}

          {/* Hero image with shadow and rounded corners */}
          <div className="mb-4 shadow-lg rounded overflow-hidden" style={{ borderRadius: '8px' }}>
            <img
              src="https://dnm.nflximg.net/api/v6/BvVbc2Wxr2w6QuoANoSpJKEIWjQ/AAAAQU-VGx2A-uB4e2Pr3w7Si2oFTUlEGk2dJQgu-wUYQCKCJO1MQzcbyb9RKpJG5AvE-tE7mdtHVnDvx-cQHtW-yKsl9P2glsKIxo-s1puM3IZKS6b147iUJ8KkDZJ7rXQn5tElL52STSjef5onDDmSk2PlQrw.jpg?r=4a6"
              alt="Popular films collage"
              className="img-fluid"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>

          {/* Value propositions with icons */}
          <div className="mb-1 px-3">
            <div className="d-flex align-items-start justify-content-center mb-3">
              <i
                className="bi bi-check-circle-fill me-3"
                style={{ color: '#00c030', fontSize: '1.4rem', marginTop: '0.4rem' }}
              ></i>
              <ul className="mb-0 fs-5" style={{ listStyleType: 'disc', paddingLeft: 0 }}>
                <li>Track films you've watched</li>
                <li>Save those you want to see</li>
                <li>Tell your friends what's good</li>
              </ul>
            </div>
          </div>


          {/* CTA button with link to /movies */}
          <Link
            to="/movies"
            className="btn btn-lg py-2 px-4 mb-4 d-inline-block"
            style={{
              backgroundColor: '#00c030',
              color: 'white',
              fontWeight: '600',
              border: 'none',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#00a028'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00c030'}
          >
            Get started — It's free!
          </Link>

          {/* Additional trust indicators */}
          <div className="text-muted small">
            <p>Join millions of film enthusiasts worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;