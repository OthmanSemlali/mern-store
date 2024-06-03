import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Checkbox, Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import ButtonLoader from "./loaders/ButtonLoader";
export function EditProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false)
  const fetchCategories = async () => {
    console.log("Fetching categories...");
    try {
      const categoriesResponse = await axios.get(
        "http://localhost:3000/api/categories",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      //   console.log('Categories***********:', categoriesResponse);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    size: { width: 0, height: 0 },
    options: [],
    style: "",
    tileUse: "",
    materials: "",
    featured: false,
    published: false,
    categoryID: "",
  });
  const fetchOldProductInfos = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products/fetchSingleProductByID/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const product = response.data;
      console.log("comming product", product);
      setEditProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        size: { width: product.size.width, height: product.size.height },
        options: product.options,
        style: product.style,
        tileUse: product.tileUse,
        materials: product.materials,
        featured: product.featured,
        published: product.published,
        categoryID: product.categoryID,
      });
    } catch (err) {
      toast.error("There was an error. try later!");

      console.log(err);
    }
  };
  const { id } = useParams();

  const handleEditConfirm = async () => {

    console.log('editProduct.categoryID', editProduct.categoryID)
    try {

      setLoading(true)
      const response = await axios.put(
        `http://localhost:3000/api/products/${id}`,
        editProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      console.log("edit response", response.data);

      if (response.data.id) {
      setLoading(false)

        toast.success("Product updated");
        navigate("/dashboard/products");
      }
    } catch (err) {
      toast.error("There was an error updating this product. Try later!");
      console.log(err);
      setLoading(false)

    }
  };

  

  useEffect(() => {
    fetchCategories();
    fetchOldProductInfos(id);

    console.log("edit ----- products");
  }, [id]);

  const [currentOption, setCurrentOption] = useState({ color: "", images: [] });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event, optionIndex = null) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setUploading(true);
      try {
        const uploadedImages = await Promise.all(
          files.map(async (file) => {
            const formData = new FormData();
            formData.append("image", file);

            const response = await axios.post(
              "http://localhost:3000/upload",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );

            return response.data.url;
          }),
        );

        if (optionIndex !== null) {
          setEditProduct((prevProduct) => {
            const updatedOptions = [...prevProduct.options];
            const newImages = [
              ...updatedOptions[optionIndex].images,
              ...uploadedImages,
            ].slice(0, 5);

            updatedOptions[optionIndex] = {
              ...updatedOptions[optionIndex],
              images: [...new Set(newImages)], // Remove duplicates
            };

            return { ...prevProduct, options: updatedOptions };
          });
        } else {
          setCurrentOption((prevOption) => ({
            ...prevOption,
            images: [
              ...new Set([...prevOption.images, ...uploadedImages]),
            ].slice(0, 5), // Remove duplicates and limit to 5
          }));
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setUploading(false);
        event.target.value = ""; // Clear the file input
      }
    }
  };

  const handleAddOption = () => {
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      options: [...prevProduct.options, { ...currentOption }],
    }));
    setCurrentOption({ color: "", images: [] });
  };

  const handleDeleteOption = (index) => {
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      options: prevProduct.options.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteImage = (optionIndex, imageIndex) => {
    setEditProduct((prevState) => {
      // Create a copy of the current options array
      const newOptions = [...prevState.options];
  
      // Create a copy of the specific option's images array
      const newImages = [...newOptions[optionIndex].images];
  
      // Remove the image at the specified index
      newImages.splice(imageIndex, 1);
  
      // Update the images array in the copied options array
      newOptions[optionIndex] = {
        ...newOptions[optionIndex],
        images: newImages,
      };
  
      // Return the new state with updated options
      return {
        ...prevState,
        options: newOptions,
      };
    });
  };
  

  return (
    <>
      <Card className="w-4/5 mx-auto bg-gray-100 bg-opacity-50 rounded-lg">
        <CardBody>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />
          </div>
          <div className="w-full mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
              }
            ></textarea>
          </div>

          {/* <div className="flex w-full gap-2 mt-2"> */}
          <div className="w-full mt-4">
            <h3 className="block text-sm font-medium text-gray-700">
              Add Options
            </h3>

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                name="color"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={currentOption.color}
                onChange={(e) =>
                  setCurrentOption({
                    ...currentOption,
                    color: e.target.value,
                  })
                }
              />
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Images (1 to 5)
              </label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                className="hidden"
                id="file-input-new-option"
                onChange={(e) => handleFileChange(e)}
              />
              <label
                htmlFor="file-input-new-option"
                className="block w-full p-2 mt-2 text-center bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Add Images
              </label>
              {uploading && (
                <p className="text-sm text-gray-600">Uploading...</p>
              )}
            </div>

            <div className="mt-4">
              <button
                type="button"
                className={
                  uploading ||
                  !currentOption.color ||
                  currentOption.images.length === 0
                    ? `px-3 py-1 text-white bg-blue-gray-500 rounded-md `
                    : `px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600`
                }                onClick={handleAddOption}
                disabled={
                  uploading ||
                  !currentOption.color ||
                  currentOption.images.length === 0
                }
              >
                Add Option
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">
                Current Options
              </h4>
              {editProduct.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="p-2 mt-2 border border-gray-300 rounded-md"
                >
                  <h5 className="font-medium">Color: {option.color}</h5>
                  <div className="flex items-center mt-2">
                    {option.images.map((image, imageIndex) => (
                      <div
                        key={imageIndex}
                        className="relative w-16 h-16 mb-2 mr-2"
                      >
                        <img
                          src={image}
                          alt={`option-${optionIndex}-${imageIndex}`}
                          className="object-cover w-full h-full rounded-md "
                        />

                        <button
                          type="button"
                          className="absolute top-0 right-0 flex items-center justify-center p-1 text-white bg-gray-200 rounded-full hover:bg-gray-300"
                          onClick={() =>
                            handleDeleteImage(optionIndex, imageIndex)
                          }
                          style={{
                            transform: "translate(50%, -50%)",
                            zIndex: 1,
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 6h18M7.5 6V4.5C7.5 3.83696 8.03696 3.3 8.7 3.3H15.3C15.963 3.3 16.5 3.83696 16.5 4.5V6M10.5 10.5v7.5M13.5 10.5v7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {option.images.length < 5 && (
                      <>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileChange(e, optionIndex)}
                          accept="image/*"
                          id={`file-input-${optionIndex}`}
                        />
                        <label
                          htmlFor={`file-input-${optionIndex}`}
                          className={`flex items-center justify-center w-16 h-16 bg-gray-200 rounded-md cursor-pointer ${
                            option.images.length < 5 ? "hover:bg-gray-300" : ""
                          }`}
                        >
                          <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </label>
                      </>
                    )}
                  </div>
                  {/* Delete option button */}
                  <button
                    type="button"
                    className="p-1 mt-2 text-white bg-red-500 rounded-md"
                    onClick={() => handleDeleteOption(optionIndex)}
                  >
                    Delete Option
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  price: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="w-full mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={editProduct.stock}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  stock: parseInt(e.target.value),
                })
              }
            />
          </div>
          {/* </div> */}
          <div className="flex w-full gap-2 mt-2">
            <div className="w-full mt-2">
              
                <label className="block text-sm font-medium text-gray-700">
                  Width
                </label>
              <input
                type="number"
                name="width"
                id="width"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editProduct.size.width}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  size: {
                    ...editProduct.size,
                    width: parseInt(e.target.value, 10),
                  },
                })
              }
              />
            </div>
            
            <div className="w-full mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Height
                  </label>

          
                <input
                  type="number"
                  name="height"
                  id="height"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editProduct.size.height}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  size: {
                    ...editProduct.size,
                    height: parseInt(e.target.value, 10),
                  },
                })
              }
                />
              </div>
      
          </div>
          <div className="flex w-full gap-2 mt-2">
            <div className="w-full mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Style
              </label>
              <input
                type="text"
                name="style"
                id="style"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editProduct.style}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, style: e.target.value })
                }
              />
            </div>
            <div className="w-full mt-2">
              <label className="block text-sm font-medium text-gray-700">
                materials
              </label>
              <input
                type="text"
                name="materials"
                id="materials"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editProduct.materials}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, materials: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex w-full gap-2 mt-2">
            <div className="w-full mt-2">
              <label className="block text-sm font-medium text-gray-700">
                tileUse
              </label>
              <input
                type="text"
                name="tileUse"
                id="tileUse"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editProduct.tileUse}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, tileUse: e.target.value })
                }
              />
            </div>

            <div className="w-full mt-2">
              <label className="block text-sm font-medium text-gray-700">
                category
              </label>
              <select
                name="category"
                id="category"
                className="w-full p-2 border border-gray-300 rounded-md"
                // value={editProduct.categoryID}
                onChange={(e) =>
                 {
                  setEditProduct({ ...editProduct, categoryID: e.target.value });
                  console.log('editProduc-----t', editProduct.categoryID, e.target.value);
                 }
                }
              >

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    selected={
                      category.id === editProduct.categoryID ? "selected" : null
                    }
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex w-full gap-2 mt-2">
            <div className="w-full mt-2">
              <label className="block text-sm font-medium text-gray-700">
                featured
              </label>
              <Checkbox
                name="featured"
                checked={editProduct.featured}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, featured: e.target.checked })
                }
              />
            </div>
            <div className="w-full mt-2">
              <label className="block text-sm font-medium text-gray-700">
                published
              </label>
              <Checkbox
                name="published"
                checked={editProduct.published}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    published: e.target.checked,
                  })
                }
              />
            </div>
          </div>
          

          <div className="flex justify-center gap-4 mt-4">
              <button className="px-4 py-2 text-gray-500 bg-transparent border border-gray-500 rounded hover:text-gray-700 hover:bg-gray-100">
                <Link to={"/dashboard/products"}>Cancel</Link>
              </button>
              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={() => handleEditConfirm()}
              >
                  Confirm {loading ?  <ButtonLoader /> : null}
              </button>
            </div>
        </CardBody>
      </Card>
    </>
  );
}
