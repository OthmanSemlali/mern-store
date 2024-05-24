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

