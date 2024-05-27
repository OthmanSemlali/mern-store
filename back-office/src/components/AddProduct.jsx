import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Checkbox } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";


export function AddProduct() {
  

  const navigate = useNavigate()
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: "",
    price: 0,
    stock: 0,
    size:{ width: "", height: "",},
    style: "",
    materials: "",
    featured: false,
    published: true,
    categoryID: "",
    options: [],
    tileUse: "",
  });

  const [categories,setCategories]=useState([])
  const fetchCategories = async () => {
    console.log('Fetching categories...');
    try {
      const categoriesResponse = await axios.get("http://localhost:3000/api/categories", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

    //   console.log('Categories***********:', categoriesResponse);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(()=>{
    fetchCategories()
  },[])

  const handleConfirm = async () => {

    try {
      const response = await axios.post(
        "http://localhost:3000/api/products/create",
        newProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log('create pro respnse: ',response);

      const updatedPro = response.data

      if(updatedPro){

        toast.success('Product Added')
        console.log('create pro respnse data: ',response.data);
        navigate('/dashboard/products')

      }else{
        toast.error('there was an error. try later!')


      }
    } catch (err) {
      toast.error('Internal Server error. try later!')

      console.log("err", err);
    }

  };


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
  
            const response = await axios.post("http://localhost:3000/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
  
            return response.data.url;
          })
        );
  
        if (optionIndex !== null) {
          setNewProduct((prevProduct) => {
            const updatedOptions = [...prevProduct.options];
            const newImages = [
              ...updatedOptions[optionIndex].images,
              ...uploadedImages
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
            images: [...new Set([...prevOption.images, ...uploadedImages])].slice(0, 5), // Remove duplicates and limit to 5
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
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>
 <div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        name="description"
        id="description"
        rows="3"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.description}
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
      ></textarea>
    </div>
    
    <div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">Image URL</label>
      <input
        type="text"
        name="image"
        id="image"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.image}
        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
      />
    </div>
    <div className="w-full mt-4">
  <h3 className="block text-sm font-medium text-gray-700">Add Options</h3>

  <div className="mt-2">
    <label className="block text-sm font-medium text-gray-700">Color</label>
    <input
      type="text"
      name="color"
      className="w-full p-2 border border-gray-300 rounded-md"
      value={currentOption.color}
      onChange={(e) => setCurrentOption({ ...currentOption, color: e.target.value })}
    />
  </div>

  <div className="mt-2">
    <label className="block text-sm font-medium text-gray-700">Upload Images (1 to 5)</label>
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
    {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
  </div>

  <div className="mt-4">
    <button
      type="button"
      className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600"
      onClick={handleAddOption}
      disabled={uploading || !currentOption.color || currentOption.images.length === 0}
    >
      Add Option
    </button>
  </div>

  <div className="mt-4">
    <h4 className="text-sm font-medium text-gray-700">Current Options</h4>
    {newProduct.options.map((option, optionIndex) => (
      <div key={optionIndex} className="p-2 mt-2 border border-gray-300 rounded-md">
        <h5 className="font-medium">Color: {option.color}</h5>
        <div className="flex items-center mt-2">
          {option.images.map((image, imageIndex) => (
            <div key={imageIndex} className="relative w-16 h-16 mb-2 mr-2">
              <img src={image} alt={`option-${optionIndex}-${imageIndex}`} className="object-cover w-full h-full rounded-md" />
              <button
                type="button"
                className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                onClick={() => handleDeleteImage(optionIndex, imageIndex)}
              >
                X
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
                  option.images.length < 5 ? 'hover:bg-gray-300' : ''
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
        <button
          type="button"
          className="px-3 py-1 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600"
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
      <label className="block text-sm font-medium text-gray-700">Price</label>
      <input
        type="number"
        name="price"
        id="price"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.price}
         onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
      />
    </div>
    <div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">Stock</label>
      <input
        type="number"
        name="stock"
        id="stock"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.stock}
        onChange={(e) => setNewProduct({ ...newProduct, stock: parseFloat(e.target.value) })}
      />
    </div>
    </div>
     <div className="flex w-full gap-2 mt-2">
    <div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">Style</label>
      <input
        type="text"
        name="style"
        id="style"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.style}
        onChange={(e) => setNewProduct({ ...newProduct, style: e.target.value })}
      />
    </div>
    <div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">Materials</label>
      <input
        type="text"
        name="materials"
        id="materials"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.materials}
        onChange={(e) => setNewProduct({ ...newProduct, materials: e.target.value })}
      />
    </div>
    </div>

    <div className="flex w-full gap-2 mt-2">
      <div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">Width</label>
      <input
        type="number"
        name="width"
        id="width"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.size.width}
        onChange={(e) => setNewProduct({ ...newProduct, size: { ...newProduct.size, width: e.target.value } })}
      /></div>
      <div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">Height</label>

       <input
        type="number"
        name="height"
        id="height"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.size.height}
        onChange={(e) => setNewProduct({ ...newProduct, size: { ...newProduct.size, height: e.target.value } })}
      /></div>
    </div>
   
         <div className="flex w-full gap-2 mt-2">
 
      <div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">TileUse</label>
      <input
        type="text"
        name="TileUse"
        id="TileUse"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.tileUse}
        onChange={(e) => setNewProduct({ ...newProduct, tileUse: e.target.value })}
      />
    </div>
    <div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">Category</label>
      <select
        type="text"
        name="category"
        id="category"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={newProduct.categoryID}
        onChange={(e) => setNewProduct({ ...newProduct, categoryID: e.target.value })}
        >

          <option>select category</option>
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
      <label className="block text-sm font-medium text-gray-700">featured</label> 
        <Checkbox
         name="featured"
         checked={newProduct.featured}
         onChange={ (e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
          />
            

      </div>
      <div className="w-full mt-2">

      <label className="block text-sm font-medium text-gray-700">published</label>
        <Checkbox 
         name="published"
         checked={newProduct.published}
         onChange={ (e) => setNewProduct({ ...newProduct, published: e.target.checked })}
          />
    </div>
    </div>          
      <div className="flex justify-center gap-4 mt-4">
            <button className="text-grey-500" >
              <Link to={'/dashboard/products'}>

              Cancel
              
              </Link>
            </button>
            <button  className="text-green-500"  onClick={handleConfirm}>Confirm</button>
          </div>
        </CardBody>
      </Card>

    </div>
  );
}
