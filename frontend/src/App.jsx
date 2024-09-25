import { useState, createRef } from "react";
import "./App.css";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const fileInput = createRef();
  const baseUrl = "http://localhost:3000/";

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("images", fileInput.current.files[0]);

    try {
      const response = await axios.post(
        `${baseUrl}upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data === "fileupload sucessfully") {
        setStatus("Image upload successful");
        fetchImages(); // Fetch updated data after upload
      }
    } catch (error) {
      console.error("File upload error:", error);
      setStatus("Image upload failed");
    }
  };

  // Fetch the images from the server
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${baseUrl}`); // Assuming '/images' endpoint returns data
      setData(res.data); // Set the data into state
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Fetch images on initial render
  useEffect(() => {
    fetchImages();
  }, []); // Empty dependency array to run only once on component mount

  // Clear status message after 1 second
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus("");
      }, 1000); // Clear the status message after 1 second

      return () => clearTimeout(timer); // Cleanup on component unmount or status change
    }
  }, [status]);

  // Reset the form and file input
  const handleReset = () => {
    fileInput.current.value = ""; // Clear the file input
    setStatus("");
  };

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <input type="file" name="file" ref={fileInput} />
        <input type="submit" value="Upload File" />
        <button type="button" onClick={handleReset}>Reset</button>
        <p>{status}</p>
      </form>

      <div style={{display:'flex',flexWrap:'wrap'}}>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index}>
              <img src={`${baseUrl}${item.imagePath}`} width="400px" alt={`Uploaded ${index}`} />
            </div>
          ))
        ) : (
          <p>No images found</p>
        )}
      </div>
    </>
  );
}

export default App;
