import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,

} from "@material-tailwind/react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import queryString from "query-string";
// import PaginationControls from "./PaginationControls";
import { AddProduct, PaginationControls } from "@/components";
import { EditProduct } from "@/components";
import { PencilSquareIcon,TrashIcon,PlusCircleIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";



export function Tables({setFilter}) {

  const parsed = queryString.parse(location.search);

  // const { page } = parsed;
  const filters = useMemo(() => ({ ...parsed }), [parsed]);
  const {page, category, q: searchQuery } = filters

  console.log('*page* ', page)


  const navigate = useNavigate();

  
   const [Products, setProducts] = useState([])
   const[totalProducts, settotalProducts]=useState()
   
   const [categories,setCategories]=useState([])
   const [showAddForm, setShowAddForm] = useState(false); 
   const [showEditForm, setShowEditForm] = useState(false);
   const [showTable, setShowTable] = useState(true);
   const [editProductId, setEditProductId] = useState(null);
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



   const updateFilters = useCallback(
    debounce(({ target }) => {
      setFilter(target.name, target.value);

    }, 300),
    [setFilter]
  );

  const handleSearchInputChange = (e) => {
    updateFilters(e)
  }
  
const fetchData = async (page, category, searchQuery) => {
     try {
      console.log('page in fetch data', page)
      const response = await axios.get(`http://localhost:3000/api/products?page=${page}&pageSize=6&category=${category}&searchQuery=${searchQuery}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setProducts(response.data.response.products);
      settotalProducts(response.data.response.totalProducts);
     } catch (error) {
      toast.error("There was an error while fetching products. try later!");
      
     }
}

const fetchCategories = async() => {
 try {

  const categoriesResponse = await axios.get("http://localhost:3000/api/categories", {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  setCategories(categoriesResponse.data);
  
 } catch (error) {
  // toast.error("There was an error while fetching products. try later!");

  console.error('error fetching categories', error)
  
 }
  
  }

  useEffect(()=>{
    fetchCategories();

  },[])


useEffect(() => {

    fetchData(page, category, searchQuery);
}, [page,category, searchQuery]);


const AddNewProduct=  ()=>{
  setShowTable(false)
  setShowAddForm(true); 
} 
const handleEditProduct = async (id) => {
  setEditProductId(id);
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
    setShowTable(false)
    setShowEditForm(true);


  } catch (err) {
    toast.error("There was an error while updating this product. try later!");

    console.log(err);
  }
    }

const deleteProduct = async (id) => {

  if(!confirm('Are u sure?')){
    return
  }
   try {
            const response = await axios.delete(`http://localhost:3000/api/products/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
            console.log(response);

            // if(!toast.isActive('deleteProductSuccess')){
              toast.success("Product Deleted", { toastId: 'deleteProductSuccess' });
            // }
        }
        catch (err) {

            toast.error("There was an error while deleting this product", { toastId: 'deleteProductError' });
            console.log(err);
        }
    }

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      {showTable && 

      <>
      <Card> 
        <CardHeader variant="gradient" color="gray" className="flex justify-between p-6 mb-8">
          <Typography 
          variant="h6" color="white" ripple="light"
          onClick={() => { AddNewProduct() }}   style={{ cursor: 'pointer' }}

            >
              <PlusCircleIcon className="w-8 h-10 text-gray-200 " />
          </Typography>


<Typography>
<select name="category" id=""
        // label="Select satatus "        
        onChange={updateFilters}
        className=" px-4 py-2 rounded-lg text-black border border-solid bg-#333333">
        <option value="" className="">All</option>

{
  categories.map((c)=> {
    return (
      <option value={c.name} className="">{c.name}</option>

    )
  })
}
       </select>
</Typography>
          <Typography>
           <Input
        type="text"
        name="q"
        placeholder="Seach Product"
        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
        labelProps={{
          className: "hidden",
        }}
        containerProps={{ className: "min-w-[100px]" }}
        // value={searchQuery}
        // onChange={(e) => setSearchTerm(e.target.value)}
        onChange={handleSearchInputChange}
      />
         </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Product", "Price","Stock",  "Published", "Action"].map((el) => (
                  <th
                    key={el}
                    className="px-5 py-3 text-left border-b border-blue-gray-50"
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
                     <td className={className}>
                      <div className="flex items-center gap-4">
 
                      <button
                        onClick={() => handleEditProduct(id)}
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

      <PaginationControls currentPage={page} navigate={navigate} totalItems={totalProducts} />

      </>


      }


        
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
{showEditForm && (
        <EditProduct
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          editProductId={editProductId}
          setEditProduct={setEditProduct}
          editProduct={editProduct}
          categories={categories}
          showTable={showTable}
          setShowTable={setShowTable}
        />
      )}

    </div>
  );
}

export default Tables;

