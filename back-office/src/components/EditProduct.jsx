import React, { useEffect, useState } from 'react'
import axios from "axios";
import {
  Card,
  CardBody,
  Checkbox,
  Typography,
 
} from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
export function EditProduct() {

    const navigate = useNavigate()
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
  const fetchOldProductInfos = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/fetchSingleProductByID/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const product = response.data;
      console.log("comming product",product);
      setEditProduct({
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock,
        size:{width:product.size.width,height:product.size.height},
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
      }
  const {id} = useParams()

const handleEditConfirm = async () => {

  try {
    const response = await axios.put(`http://localhost:3000/api/products/${id}`, editProduct, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    
    console.log('edit response', response.data);

    if(response.data.id){
        toast.success('Product updated')
        navigate('/dashboard/products')
    }

  } catch (err) {

    toast.error('There was an error updating this product. Try later!')
    console.log(err);
  }
};

const [editProduct, setEditProduct] = useState({
  name: "",
  description: "",
  image: "",
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


useEffect(() => {
  fetchCategories()
  fetchOldProductInfos(id)

  console.log("edit ----- products");
},[id])

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

            const response = await axios.post("http://localhost:3000/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            return response.data.url;
          })
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
    setEditProduct((prevProduct) => {
      const updatedOptions = [...prevProduct.options];
      updatedOptions[optionIndex].images = updatedOptions[optionIndex].images.filter((_, i) => i !== imageIndex);
      return { ...prevProduct, options: updatedOptions };
    });
  };


  return (
    <>
    <Card className="w-4/5 mx-auto bg-gray-100 bg-opacity-50 rounded-lg">
     <CardBody>
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.name}
          onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
        />
      </div>
      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.description}
          onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
        ></textarea>
      </div>
      {/* <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">SEO Description</label>
        <textarea
          name="seodescription"
          id="seodescription"
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.seodescription}
          onChange={(e) => setEditProduct({ ...editProduct, seodescription: e.target.value })}
        ></textarea>
      </div> */}
      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          name="image"
          id="image"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.image}
          onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
        />
      </div>
              <div className="flex w-full gap-2 mt-2">


              <div className="w-full mt-2">
  <label className="block text-sm font-medium text-gray-700">Options</label>
  {editProduct.options.map((option, index) => (
    <div key={index} className="mt-4">
      <h4 className="text-lg font-medium">{option.color}</h4>
      <div className="flex items-center mt-2">
        {option.images.map((image, imgIndex) => (
          <div key={imgIndex} className="relative w-16 h-16 mb-2 mr-2">
            <img
              src={image}
              alt={option.color}
              className="object-cover w-full h-full rounded-md"
            />
            <button
              onClick={() => handleDeleteImage(index, imgIndex)}
              className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
            >
              X
            </button>
          </div>
        ))}
        {option.images.length < 5 && (
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileChange(e, index)}
            accept="image/*"
            id={`file-input-${index}`}
          />
        )}
        <label
          htmlFor={`file-input-${index}`}
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
      </div>
      <button
        onClick={() => handleDeleteOption(index)}
        className="px-3 py-1 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600"
      >
        Delete Option
      </button>
    </div>
  ))}
  <div className="mt-4">
    <input
      type="text"
      placeholder="Color"
      value={currentOption.color}
      onChange={(e) => setCurrentOption({ ...currentOption, color: e.target.value })}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
    <input
      type="file"
      multiple
      className="hidden"
      onChange={handleFileChange}
      accept="image/*"
      id="file-input-new-option"
    />
    <label
      htmlFor="file-input-new-option"
      className="block w-full p-2 mt-2 text-center bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
    >
      Add Images
    </label>
    <button
      onClick={handleAddOption}
      className="px-3 py-1 mt-2 text-white bg-green-500 rounded-md hover:bg-green-600"
    >
      Add Option
    </button>
  </div>
</div>
      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          id="price"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.price}
          onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
        />
      </div>
      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          id="stock"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.stock}
          onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) })}
        />
      </div>
      </div>
      <div className="flex w-full gap-2 mt-2">
        <label className="block text-sm font-medium text-gray-700">Size</label>
        <input
          type="number"
          name="width"
          id="width"
          className="w-1/2 p-2 mr-2 border border-gray-300 rounded-md"
          placeholder="Width"
          value={editProduct.size.width}
          onChange={(e) => setEditProduct({ ...editProduct, size: { ...editProduct.size, width: parseInt(e.target.value, 10) } })}
        />
        <input
          type="number"
          name="height"
          id="height"
          className="w-1/2 p-2 border border-gray-300 rounded-md"
          placeholder="Height"
          value={editProduct.size.height}
          onChange={(e) => setEditProduct({ ...editProduct, size: { ...editProduct.size, height: parseInt(e.target.value, 10) } })}
        />
        </div>
    <div className="flex w-full gap-2 mt-2">
      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">Style</label>
        <input
          type="text"
          name="style"
          id="style"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.style}
          onChange={(e) => setEditProduct({ ...editProduct, style: e.target.value })}
        />
      </div>
      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">materials</label>
        <input
          type="text"
          name="materials"
          id="materials"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.materials}
          onChange={(e) => setEditProduct({ ...editProduct, materials: e.target.value })}
        />
      </div>
      </div>
    <div className="flex w-full gap-2 mt-2">
       <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">tileUse</label>
        <input
          type="text"
          name="tileUse"
          id="tileUse"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.tileUse}
          onChange={(e) => setEditProduct({ ...editProduct, tileUse: e.target.value })}
        />
      </div>

      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">category</label>
      <select
        name="category"
        id="category"
        className="w-full p-2 border border-gray-300 rounded-md"
        // value={getCategoryById(editProduct.categoryID)}
        onChange={(e) => setEditProduct({ ...editProduct, categoryID: e.target.value })}
        >
        {/* <option key={editProduct.categoryID} value={editProduct.categoryID}>
          {getCategoryById(editProduct.categoryID)}
         </option> */}

      {categories.map((category) => (
       <option key={category.id} value={category.id} selected={category.id === editProduct.categoryID ? 'selected' : null} >{category.name} </option>
     ))}
      </select>
      </div>
      </div>
   <div className="flex w-full gap-2 mt-2">
      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">featured</label> 
        <Checkbox 
         name="featured"
         checked={editProduct.featured}
         onChange={ (e) => setEditProduct({ ...editProduct, featured: e.target.checked })}
          />
            

      </div>
      <div className="w-full mt-2">

      <label className="block text-sm font-medium text-gray-700">published</label>
        <Checkbox 
         name="published"
         checked={editProduct.published}
         onChange={ (e) => setEditProduct({ ...editProduct, published: e.target.checked })}
          />
   
        </div> 
    </div>
      <div className="flex justify-center gap-4 mt-4">
        <Typography color="grey"   style={{ cursor: 'pointer' }}
>
<Link to={'/dashboard/products'}>

Cancel

</Link>
        </Typography>
        <Typography color="green" onClick={()=>handleEditConfirm()}   style={{ cursor: 'pointer' }}
>
          Confirm
        </Typography>
      </div>
    </CardBody>
  </Card>

    </>
  )
}

