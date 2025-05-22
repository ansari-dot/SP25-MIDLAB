import React, { useState } from "react";
import "./tourpackages.css";
import axios from "axios";

export default function TourPackages() {
  const [formData, setFormData] = useState({
    packageType: "",
    price: "",
    destination: "",
    travelDate: "",
    duration: "",
    numberOfPeople: "",
    rating: "",
    description: "",
    facilities: [],
    image: null,
    preview: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedFacilities = checked
          ? [...prev.facilities, value]
          : prev.facilities.filter((item) => item !== value);
        return { ...prev, facilities: updatedFacilities };
      });
    } else if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("packageType", formData.packageType);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("destination", formData.destination);
    formDataToSend.append("travelDate", formData.travelDate);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("numberOfPeople", formData.numberOfPeople);
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("facilities", JSON.stringify(formData.facilities));
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post(
        "http://localhost:2000/api/package/add",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(response.data);
      alert(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert(error);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>Add New Tour Package</h1>
      <form className="tourpackage-form" onSubmit={handleSubmit}>
        <div className="tourpackage-row">
          <div className="tourpackage-col">
            <label>Package Type</label>
            <input
              type="text"
              placeholder="e.g. Beach Vacation, Mountain Trek"
              name="packageType"
              value={formData.packageType}
              onChange={handleChange}
            />
          </div>
          <div className="tourpackage-col">
            <label>Price</label>
            <input
              type="text"
              placeholder="Price in USD"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="tourpackage-row">
          <div className="tourpackage-col">
            <label>Destination</label>
            <input
              type="text"
              placeholder="e.g. Bali, Paris"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
            />
          </div>
          <div className="tourpackage-col">
            <label>Travel Date</label>
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="tourpackage-row">
          <div className="tourpackage-col">
            <label>Duration (Days)</label>
            <input
              type="number"
              placeholder="Number of days"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
          <div className="tourpackage-col">
            <label>Number of People</label>
            <input
              type="number"
              placeholder="Max number of people"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="tourpackage-row">
          <div className="tourpackage-col">
            <label>Rating</label>
            <input
              type="number"
              placeholder="Rating out of 5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>
          <div className="tourpackage-col">
            <label>Package Image</label>
            <input type="file" name="image" onChange={handleChange} />
            <div className="tourpackage-image-placeholder">
              {formData.preview ? (
                <img
                  src={formData.preview}
                  alt="Preview"
                  className="image-preview"
                />
              ) : (
                <i
                  className="bi bi-image"
                  style={{ fontSize: "2.5rem", color: "#b0b7c3" }}></i>
              )}
            </div>
          </div>
        </div>
        <div className="tourpackage-row">
          <div className="tourpackage-col-full">
            <label>Description</label>
            <textarea
              placeholder="Describe the tour package"
              name="description"
              value={formData.description}
              onChange={handleChange}></textarea>
          </div>
        </div>
        <div className="tourpackage-row">
          <div className="tourpackage-col-full">
            <label>Facilities</label>
            <div className="tourpackage-facilities">
              {[
                "WiFi",
                "Breakfast",
                "Swimming Pool",
                "Spa",
                "Gym",
                "Tour Guide",
                "Transportation",
                "All Meals",
              ].map((facility) => (
                <label key={facility}>
                  <input
                    type="checkbox"
                    value={facility}
                    checked={formData.facilities.includes(facility)}
                    onChange={handleChange}
                  />{" "}
                  {facility}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="tourpackage-actions">
          <button type="submit" className="tourpackage-save-btn">
            Save Tour Package
          </button>
        </div>
      </form>
    </div>
  );
}
