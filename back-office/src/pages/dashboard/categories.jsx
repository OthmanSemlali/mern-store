import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { z } from 'zod';
// import Model from 'react-modal'


export function Categories() {
  const [Data, SetData] = useState([]) 
  const [showForm, setShowForm] = useState(false)
  const [showDeleteForm, setShowDeleteForm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [oldCategory,setOldCategory] = useState({})
  const [addCategoryName, setAddCategoryName] = useState('')

  // const categorySchema = z.object({
  //   name: z.string().min(3),
  // });
  
  // const validateCategory = (data) => {
  //   try {
  //     categorySchema.parse(data);
  //     return null; 
  //   } catch (error) {
  //     return error.errors;
  //   }
  // };
  
  // const [newCategory,setNewCategory] = useState('')
  const toggleForm = (category)=>{
    setShowForm(!showForm)
    setOldCategory( {name:category.name, id : category.id})
  }
  const toggleDelete = (category)=>{
    setShowDeleteForm(!showDeleteForm)
    setOldCategory( {id : category.id})
  }
  const toggleAddForm = ()=>{
    setShowAddForm(!showAddForm)
    setAddCategoryName('')
  }
  const confirmEdit = async (e)=>{
    e.preventDefault()
    // const validationErrors = validateCategory(oldCategory);
    // if (validationErrors) {
    //   console.log('Validation failed:', validationErrors);
    //   return; 
    // }
    try {
      const response = await axios.put(`http://localhost:3000/api/categories/${oldCategory.id}`,oldCategory,{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      console.log('response : ',response);
    } catch (error) {
      console.log('error updating category name  : ',error);
    }
    setShowForm(!showForm)
    // setOldCategory({})

  }
  const confirmDelete = async (e)=>{
    e.preventDefault()
    try {
      const response = await axios.delete(`http://localhost:3000/api/categories/${oldCategory.id}`,{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
    
      })
      console.log('response', response.data);

    } catch (error) {
      console.log('error deleting ctg :', error);
      
    } 
    setShowDeleteForm(!showDeleteForm)
     
  }
  const AddCategory = async (e)=>{
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/api/categories/create',{name : addCategoryName},{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
    
      })
      console.log('created category : ', response);
    } catch (error) {
      console.log('error adding category',error);
    }
    setShowAddForm(!showAddForm)
  }
  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const response = await axios.get(`http://localhost:3000/api/categories`,{
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
      
        })
        
        SetData(response.data)
      } catch (error) {
        setError(error)
      }
    }
    fetchData()
  },[Data])
  
  
  return (
          <div className="mt-12 mb-8 flex flex-col gap-12">

    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography className="flex justify-between px-7 items-center" variant="h6" color="white">
          <p className="font-bold text-lg	">Categories</p> 
          <button className="border px-5 p-3" onClick={()=>{setShowAddForm(!showAddForm)}} >Add  Category</button>
        </Typography>
      </CardHeader>
      
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {['name', '', ''].map((el) => (
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
            {Data.map(
              ({id, name }, key) => {
                // console.log('nameeeeeeeeeeeeeeeeeeeeeee',name);
                const className = `py-3 px-5 ${
                  key === Data.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <>
                  <tr key={id}>
                    <td className={className}>
                      
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {name}
                          </Typography>
                    </td>                      
                    <td className={className}>
                      <Typography
                        className="text-xs font-semibold text-green-800"
                      >                           
                    <button onClick={() => toggleForm({ id: id, name: name })}>Edit</button>
                    
                     
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        
                        className="text-xs font-semibold text-red-900"
                      >
                      <button  onClick={()=>toggleDelete({id : id})} >Delete</button>
                      </Typography>
                    </td>
                  </tr>
                  </>                 
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>

    {showForm && (  
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-gray-600 bg-opacity-75 absolute inset-0"></div>
    <div className="rounded-lg w-1/2 h-60 bg-white px-6 pt-11 max-w-sm mx-auto relative z-50">
      <p className="text-lg font-semibold mb-2">Edit Category</p>
      <input
        type="text"
        placeholder="Name"
        className="mt-2 p-2 border-solid border-4 rounded-md w-full focus:outline-none"
        onChange={(event) => setOldCategory((prevState) => ({ ...prevState, name: event.target.value }))}
        value={oldCategory.name}
      />
      {/* {categoryError && (
        <p className="text-red-500 text-sm mt-2">{categoryError}</p>
      )} */}
      <div className="flex justify-end mt-4">
        <button
          className="px-4 w-1/2 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          onClick={toggleForm}
        >
          Cancel
        </button>
        <button
          className="px-4 w-1/2 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={confirmEdit}
        >
          Update
        </button>
      </div>
    </div>
  </div>
  )}
 
 {showDeleteForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-gray-600 bg-opacity-75 absolute inset-0"></div>
    <div className="rounded-lg w-1/2 h-60 bg-white px-6 pt-11 max-w-sm mx-auto relative z-50">
      <p className="text-lg font-semibold mb-2">Delete Category</p>
      <p className="mb-4">Are you sure you want to delete this category?</p>
      <div className="flex justify-end">
        <button
          className="px-4 w-1/2 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          onClick={toggleDelete}
        >
          Cancel
        </button>
        <button
          className="px-4 w-1/2 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
          onClick={confirmDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
  )}

  {showAddForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-gray-600 bg-opacity-75 absolute inset-0"></div>
    <div className=" rounded-lg w-1/2 h-60 bg-white px-6 pt-11 max-w-sm mx-auto relative z-50">
      <p className="text-lg font-semibold mb-2">Add new category</p>
      <input
        type="text"
        placeholder="Name"
        className="mt-2 p-2 border-solid border-4 rounded-md w-full focus:outline-none"
        onChange={(e) => setAddCategoryName(e.target.value)}
        value={addCategoryName}
      />
      <div className="flex justify-end mt-4">
        <button
          className="px-4 w-1/2 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          onClick={toggleAddForm}
        >
          Cancel
        </button>
        <button
          className="px-4 w-1/2 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={AddCategory}
        >
          Add
        </button>
      </div>
    </div>
  </div>
  )}


    </div>
  );
}
export default Categories;

