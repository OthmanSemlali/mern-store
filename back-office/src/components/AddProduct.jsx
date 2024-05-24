import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Checkbox } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";


export function AddProduct() {
  const [color, setColor] = useState("");
  const [images, setImages] = useState([]);

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
  const AddOption = () => {
    if (color && images) {
      setNewProduct((prev) => ({
        ...prev,
        options: [...prev.options, { color: color, images: images }],
      }));
      setColor("");
      setImages([]);
    }
    console.log("options", newProduct.options);
  };


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
        {/* <div className="flex w-full gap-2 mt-2">
      <label className="block text-sm font-medium text-gray-700">Options</label>
<div className="w-full mt-2">
      <label className="block text-sm font-medium text-gray-700">Color</label>
      <input
        type="text"
        name="color"
        id="color"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      /></div>
      <div className="w-full mt-2">
       <label className="block text-sm font-medium text-gray-700">Images</label>
     <input
  type="text"
  name="images"
  id="images"
  className="w-full p-2 border border-gray-300 rounded-md"
  value={images}
  onChange={(e) => setImages([e.target.value])}
/>

    </div>
    <button 
    className=""
    onClick={AddOption}>Add</button>

    </div> */}
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
