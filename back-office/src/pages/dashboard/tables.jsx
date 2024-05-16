import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,

} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import PaginationControls from "./PaginationControls";
import { AddProduct } from "@/components";
import { PencilSquareIcon,TrashIcon,PlusIcon } from "@heroicons/react/24/solid";




export function Tables() {
   const [Products, setProducts] = useState([])
   const[totalProducts, settotalProducts]=useState()
   const parsed = queryString.parse(location.search);
   const { page } = parsed;
   const [categories,setCategories]=useState([])
   const [showAddForm, setShowAddForm] = useState(false); 
  const [showEditForm, setShowEditForm] = useState(false);
    const [showTable, setShowTable] = useState(true);

const [editProductId, setEditProductId] = useState(null);
const [editProduct, setEditProduct] = useState({
  name: "",
  description: "",
  seodescription: "",
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

 //* State for the form inputs
 const [newProduct, setNewProduct] = useState({
     name: "",
     description: "",
     seodescription: "",
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

   useEffect(() => {

    const fetchData = async () => {
     
        const response = await axios.get(`http://localhost:3000/api/products?page=${page}&pageSize=6`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setProducts(response.data.response.products);
        settotalProducts(response.data.response.totalProducts);
      }
const fetchCategories = async() => {
  const categoriesResponse = await axios.get("http://localhost:3000/api/categories", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    setCategories(categoriesResponse.data);
   }
    fetchData();
    fetchCategories();
  }, [page]);

const getCategoryById = (id) => {
   const category = categories.find(category => category.id == id);
     console.log("id and name",id,category.name,categories);
  return category;
}
  
  const deleteProduct = async (id) => {

   try {
            const response = await axios.delete(`http://localhost:3000/api/products/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
            console.log(response);
        }
        catch (err) {
            console.log(err);
        }
    
    //     <section className="">
    //         <p className=''>Are you sure ?</p>
    //         <p className=''>Do you really want to delete this Product?</p>
    //         <div className="">
    //             <button onClick={}>Cancel</button>
    //             <button onClick={deleteProduct}>delete</button>
    //         </div>

    //     </section>
    }
    
  const EditProduct = async (id) => {
  setEditProductId(id);
  try {
    const response = await axios.get(`http://localhost:3000/api/products/fetchSingleProductByID/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    const product = response.data;
    setEditProduct({
      name: product.name,
      description: product.description,
      seodescription: product.seoDescription,
      image: product.image,
      price: product.price,
      stock: product.stock,
      size: product.size,
      options: product.options,
      style: product.style,
      tileUse: product.tileUse,
      materials: product.materials,
      featured: product.featured,
      published: product.published,
      categoryID: product.categoryID,
    });
    setShowEditForm(true);
  } catch (err) {
    console.log(err);
  }
    }
  const handleEditConfirm = async () => {
  try {
    const response = await axios.put(`http://localhost:3000/api/products/${editProductId}`, editProduct, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    console.log(response);
    setShowEditForm(false);
  } catch (err) {
    console.log(err);
  }
};

  const AddNewProduct=  ()=>{
     setShowTable(false)
    setShowAddForm(true); 

}


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {showTable && 
      <Card> 
        <CardHeader variant="gradient" color="gray" className="flex justify-between mb-8 p-6">
          <Typography variant="h6" color="white">
            All Products Table
          </Typography>
          <Typography 
          variant="h6" color="white" ripple="light"
        onClick={() => { AddNewProduct() }}
       >
        <button> 
Add New
{/* <PlusIcon class="h-6 w-6 text-gray-500" /> */}
            </button>
            
</Typography>
        </CardHeader>
         
      
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Product", "Price","Stock",  "Published", "Action"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Products.map(
                ({ id,image, name, price, stock,published }, key) => {
                  const className = `py-3 px-5 ${
                    key === Products.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={image} alt={name} size="sm" variant="rounded" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                            {/* <Typography className="text-xs font-normal text-blue-gray-500">
                              {seodescription}
                            </Typography> */}
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {price} DH
                        </Typography>
                       
                      </td>
                       <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {stock}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={published ? "green" : "blue-gray"}
                          value={published ? "showen" : "Hiden"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                     
                      {/* <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {published}
                        </Typography>
                      </td> */}
                     <td className={className}>
                      <div className="flex items-center gap-4">
 
                      <button
                        onClick={() => EditProduct(id)}
                      >
<PencilSquareIcon class="h-6 w-6 text-green-500" />
                      </button>
                      <button
                        onClick={() => deleteProduct(id)}
                      >
<TrashIcon class="h-6 w-6 text-red-500" />
                      </button>
                      </div>
                    </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      }
       <PaginationControls currentPage={page} totalProducts={totalProducts} />
        {showEditForm && (
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
      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">SEO Description</label>
        <textarea
          name="seodescription"
          id="seodescription"
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={editProduct.seodescription}
          onChange={(e) => setEditProduct({ ...editProduct, seodescription: e.target.value })}
        ></textarea>
      </div>
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
              <div className="w-full flex gap-2 mt-2">
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
      
      <div className="w-full flex gap-2 mt-2">
        <label className="block text-sm font-medium text-gray-700">Size</label>
        <input
          type="number"
          name="width"
          id="width"
          className="w-1/2 p-2 border border-gray-300 rounded-md mr-2"
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
    <div className="w-full flex gap-2 mt-2">
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
              <div className="w-full flex gap-2 mt-2">

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
  value={editProduct.categoryID}
  onChange={(e) => setEditProduct({ ...editProduct, categoryID: e.target.value })}
>
  <option key={editProduct.categoryID} value={editProduct.categoryID}>{getCategoryById(editProduct.categoryID).name}</option>
  {categories.map((category) => (
    <option key={category._id} value={category._id}>
      {category.name}
    </option>
  ))}
</select>



      </div>
      </div>
   <div className="w-full flex gap-2 mt-2">

      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">featured</label>
        <select
                name="featured"
                id="featured"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editProduct.featured}
                onChange={(e) => {setEditProduct({ ...editProduct, featured: e.target.value === "true" }); console.log('featt',editProduct.featured);}}
              >
                <option value="true" >yes</option>
                <option value="false">no</option>
              </select>
      </div>

      <div className="w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">published</label>
        <select
                name="published"
                id="published"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editProduct.published}
                onChange={(e) => {setEditProduct({ ...editProduct, published: e.target.value === "true" }); console.log('featt',editProduct.published);}}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
      </div>
      </div>
      <div className="flex justify-between mt-4">
        <Typography color="red" onClick={() => setShowEditForm(false)}>
          Cancel
        </Typography>
        <Typography color="blue" onClick={handleEditConfirm}>
          Confirm
        </Typography>
      </div>
    </CardBody>
  </Card>
)}
{showAddForm && (
        <AddProduct
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          setNewProduct={setNewProduct}
          newProduct={newProduct}
          categories={categories}
          showTable={showTable}
          setShowTable={setShowTable}


        />
      )}

    </div>
  );
}

export default Tables;