import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import "./form.css";
import Select from "react-select";
import { header } from "express-validator";
import firebase, { storage } from "../config/fire";
import { database } from "firebase";

let token;

const FormEntry = () => {
  const [product, updateProduct] = useState("");
  const [price, updatePrice] = useState(null);
  const [number, updateNumber] = useState(null);
  const [address, updateAddress] = useState("");
  const [location, updateLocation] = useState("");
  const [valid, updateValid] = useState(false);
  const [category, updateCategory] = useState("");
  const [image, updateImage] = useState(null);
  const [path, updatePath] = useState("");

  const productName = (e) => {
    e.preventDefault();
    updateProduct(e.target.value);
  };
  /*  const categoryhandle = (value) => {
    value.preventDefault();
    updateCategory(value);
  }; */
  const Number = (e) => {
    e.preventDefault();
    updateNumber(e.target.value);
  };
  const Address = (e) => {
    e.preventDefault();
    updateAddress(e.target.value);
  };
  const Location = (e) => {
    e.preventDefault();
    updateLocation(e.target.value);
  };
  const Price = (e) => {
    e.preventDefault();
    updatePrice(e.target.value);
  };
  let tkn = "";
  useEffect(() => {
    token = localStorage.getItem("token");
    tkn = token.toString();
  });
  const imageHandler = (e) => {
    if (e.target.files[0]) {
      updateImage(e.target.files[0]);
    }
  };

  const imageSaveHandler = (e) => {
    e.preventDefault();
    const uploadTask = storage.child(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then((downloadURL) => updatePath(downloadURL));
      }
    );
  };
  console.log(path);
  const newpath = path.toString();
  console.log(newpath);

  const postdetail = async (e) => {
    e.preventDefault();
    const headers = {
      "x-auth-token": tkn,
    };
    await axios
      .post(
        "/api/item",
        {
          item_name: product,
          price,
          number,
          address,
          location,
          images: [newpath],
          category,
        },
        {
          headers: headers,
        }
      )
      .then(() => updateValid(true))
      .catch((err) => {
        console.error(err);
        console.log(err);
      });
  };

  const options = [
    { value: "Automobile", label: "Automobile" },
    { value: "Furniture", label: "Furniture" },
    { value: "Others", label: "Others" },
    { value: "Electronic Appliances", label: "Electronic Appliances" },
    { value: "Gaming Equipment", label: "Gaming Equipment" },
  ];

  const MyComponent = () => (
    <Select
      options={options}
      onChange={(value) => updateCategory(value.value)}
    />
  );

  if (valid) return <Redirect to="/"></Redirect>;
  return (
    <div>
      <div>
        <ul className="nav justify-content-center">
          <li className="nav-item">
            <a href="#" className="nav-link active">
              Profile
            </a>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link active">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link active">
              Login
            </Link>
          </li>
        </ul>
      </div>
      <div className="background-form">
        <div className="container-sm">
          <div className="contanier-sm shadow-lg  bg-white rounded">
            <div className="p-3 mb-5" style={{ height: "80vh" }}>
              <form onSubmit={postdetail}>
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  name="name"
                  placeholder="Product Name"
                  onChange={productName}
                />
                <br></br>
                <br></br>
                <input
                  type="number"
                  className="form-control"
                  aria-describedby="emailHelp"
                  name="number"
                  placeholder="Number"
                  onChange={Number}
                />
                <br></br>
                <br></br>
                <input
                  type="number"
                  className="form-control"
                  aria-describedby="emailHelp"
                  name="number"
                  placeholder="Price"
                  onChange={Price}
                />
                <br></br>
                <br></br>
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  name="location"
                  placeholder="Location"
                  onChange={Location}
                />
                <br></br>
                <br></br>
                <input
                  name="address"
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="address"
                  onChange={Address}
                />
                <br></br>
                <br></br>
                {MyComponent()}
                <br></br>
                <br></br>
                <input
                  placeholder="Select Image"
                  type="file"
                  onChange={imageHandler}
                ></input>
                <button className="btn btn-primary" onClick={imageSaveHandler}>
                  Upload
                </button>
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: "178px" }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEntry;
