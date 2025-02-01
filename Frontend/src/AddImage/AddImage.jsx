import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddImage.css';

function AddImage() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:7001/api/images/analyzeImage', formData);

      if (response.status === 200) {
        alert('Successfully analyzed image');
        // Redirect to ViewChemical after uploading the image
        navigate('/ViewChemical');
      } else {
        console.log('Error:', response.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const uploadImage = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="container">
      <h1>Add Image to Analyze</h1>
      <form onSubmit={submitForm}>
        <input type="file" accept="image/*" onChange={uploadImage} />
        <button type="submit">Add Image</button>
      </form>
    </div>
  );
}

export default AddImage;
