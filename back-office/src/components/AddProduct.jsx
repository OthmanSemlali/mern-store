import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Checkbox } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ButtonLoader from "./loaders/ButtonLoader";

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is reqiured" })
    .min(5, { message: "Name must be at least 5 characters" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .min(20, { message: "Description must be at least 20 characters" }),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 1, {
      message: "price must be at least 1",
    }),
  stock: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 1, {
      message: "stock must be at least 1",
    }),
  size: z.object({
    width: z
      .string()
      .transform((val) => parseFloat(val))

      .refine((val) => val >= 1, {
        message: "Width must be at least 1",
      }),
    height: z
      .string()
      .transform((val) => parseFloat(val))

      .refine((val) => val >= 1, {
        message: "Height must be at least 1",
      }),
  }),
  style: z
    .string()
    .min(1, { message: "Style is required" })
    .min(3, { message: "Style must be at least 3 characters" }),
  materials: z
    .string()
    .min(1, { message: "Materials is required" })
    .min(3, { message: "Materials must be at least 3 characters" }),
  categoryID: z
    .string()
    .refine((val) => val !== "", { message: "Category is required" }),
  tileUse: z
    .string()
    .min(1, { message: "Tile use is required" })
    .min(3, { message: "Tile use must be at least 3 characters" }),
});

export function AddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [optionsErr, setOptionsErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    if (
      newProduct.options.length === 0 ||
      newProduct.options[0].images.length === 0
    ) {
      setOptionsErr("Options must contain  at least 1 option");

      return;
    } else {
      setOptionsErr(null);
    }
    console.log("isValid", isValid, { ...newProduct, ...data });

    try {

      setLoading(true)
      const response = await axios.post(
        "http://localhost:3000/api/products/create",
        { ...newProduct, ...data },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log("create pro respnse: ", response);

      const updatedPro = response.data;

      if (updatedPro) {

        setLoading(false)
        toast.success("Product Added");
        console.log("create pro respnse data: ", response.data);
        navigate("/dashboard/products");
      } else {
        setLoading(false)

        toast.error("there was an error. try later!");
      }
    } catch (err) {
      setLoading(false)
      toast.error("Internal Server error. try later!");
      console.log("err", err);
    }
  };

  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    featured: false,
    published: true,
    options: [],
  });

  const [categories, setCategories] = useState([]);
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

      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [currentOption, setCurrentOption] = useState({
    color: "",
    images: [],
  });

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
          setNewProduct((prevProduct) => {
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
      }
    }
  };

  const handleAddOption = () => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      options: [...prevProduct.options, currentOption],
    }));
    setCurrentOption({ color: "", images: [] });
  };

  const handleDeleteOption = (index) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      options: prevProduct.options.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteImage = (optionIndex, imageIndex) => {
    const updatedOptions = newProduct.options.map((option, i) => {
      if (i === optionIndex) {
        return {
          ...option,
          images: option.images.filter((_, j) => j !== imageIndex),
        };
      }
      return option;
    });

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      options: updatedOptions,
    }));
  };

  return (
    <div>
      <Card className="w-4/5 mx-auto bg-gray-100 bg-opacity-50 rounded-lg">
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                {errors.name && (
                  <p className="text-sm text-red-500 ">{errors.name.message}</p>
                )}
              </div>

              <input
                type="text"
                {...register("name")}
                id="name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="w-full mt-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>

                {errors.description && (
                  <p className="text-sm text-red-500 ">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <textarea
                name="description"
                id="description"
                rows="3"
                {...register("description")}
                className="w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>

            <div className="w-full mt-4">
              <div className="flex justify-between">
                <h3 className="block text-sm font-medium text-gray-700">
                  Add Options
                </h3>

                {optionsErr && (
                  <p className="text-sm text-red-500 ">{optionsErr}</p>
                )}
              </div>

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
                  }
                  onClick={handleAddOption}
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
                {newProduct.options.map((option, optionIndex) => (
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
                              option.images.length < 5
                                ? "hover:bg-gray-300"
                                : ""
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

            <div className="flex w-full gap-2 mt-2">
              <div className="w-full mt-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  {errors.price && (
                    <p className="text-sm text-red-500 ">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <input
                  type="number"
                  name="price"
                  id="price"
                  {...register("price")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="w-full mt-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>

                  {errors.stock && (
                    <p className="text-sm text-red-500 ">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  {...register("stock")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex w-full gap-2 mt-2">
              <div className="w-full mt-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Style
                  </label>

                  {errors.style && (
                    <p className="text-sm text-red-500 ">
                      {errors.style.message}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  name="style"
                  {...register("style")}
                  id="style"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-full mt-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Materials
                  </label>

                  {errors.materials && (
                    <p className="text-sm text-red-500 ">
                      {errors.materials.message}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  name="materials"
                  {...register("materials")}
                  id="materials"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex w-full gap-2 mt-2">
              <div className="w-full mt-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Width
                  </label>

                  {errors.size?.width && (
                    <p className="text-sm text-red-500 ">
                      {errors.size.width.message}
                    </p>
                  )}
                </div>
                <input
                  type="number"
                  name="width"
                  id="width"
                  {...register("size.width")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-full mt-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Height
                  </label>

                  {errors.size?.height && (
                    <p className="text-sm text-red-500 ">
                      {errors.size.height.message}
                    </p>
                  )}
                </div>

                <input
                  type="number"
                  name="height"
                  id="height"
                  {...register("size.height")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex w-full gap-2 mt-2">
              <div className="w-full mt-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    TileUse
                  </label>

                  {errors.tileUse && (
                    <p className="text-sm text-red-500 ">
                      {errors.tileUse.message}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  name="TileUse"
                  {...register("tileUse")}
                  id="TileUse"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-full mt-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  {errors.categoryID && (
                    <p className="text-sm text-red-500 ">
                      {errors.categoryID.message}
                    </p>
                  )}
                </div>
                <select
                  type="text"
                  name="category"
                  id="category"
                  {...register("categoryID")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value={""}>select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
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
                  checked={newProduct.featured}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, featured: e.target.checked })
                  }
                />
              </div>
              <div className="w-full mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  published
                </label>
                <Checkbox
                  name="published"
                  checked={newProduct.published}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
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
              >
                  Confirm {loading ?  <ButtonLoader /> : null}
                
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
