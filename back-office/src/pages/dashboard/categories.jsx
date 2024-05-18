import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { z } from 'zod';
import { TrashIcon,PencilSquareIcon ,PlusCircleIcon} from "@heroicons/react/24/solid";
import { data } from "autoprefixer";
import { Input } from "@material-tailwind/react";


const categorySchema = z.object({
  name: z.string().min(3,'Category name must be at least 3 characters'),
});

export function Categories() {
  const [Data, SetData] = useState([]) 
  const [filteredData,setFilteredData] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showDeleteForm, setShowDeleteForm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [oldCategory,setOldCategory] = useState({})
  const [addCategoryName, setAddCategoryName] = useState('')
  const [handelSearch,sethandelSearch] = useState('')
  const [errorMsg,setErrorMsg] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toggleForm = (category)=>{
    setShowForm(!showForm)
    setOldCategory( {name:category.name, id : category.id})
    setErrorMsg('')
  }
  const toggleDelete = (category)=>{
    setShowDeleteForm(!showDeleteForm)
    setOldCategory( {id : category.id})
  }
  const toggleAddForm = ()=>{
    setShowAddForm(!showAddForm)
    setAddCategoryName('')
    setErrorMsg('')
  }

  const confirmEdit = async (e)=>{
    e.preventDefault()
    const validation = categorySchema.safeParse({ name: oldCategory.name });
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message);  
      return;
    }
   
    try {
      const response = await axios.put(`http://localhost:3000/api/categories/${oldCategory.id}`,oldCategory,{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      console.log('edit response : ',response);
      const updatedCategory = response.data;
      const updatedData = Data.map(category =>
        category.id === updatedCategory.id ? updatedCategory : category
      );
  
      SetData(updatedData);

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
      SetData((prev)=>prev.filter((ctg)=>ctg.id !== oldCategory.id))
    } catch (error) {
      console.log('error deleting ctg :', error);
      
    } 
    setShowDeleteForm(!showDeleteForm)
     
  }

  
  const AddCategory = async (e)=>{
    e.preventDefault()
    
    const validationResult = categorySchema.safeParse({ name: addCategoryName });
    if (!validationResult.success) {
      setErrorMsg(validationResult.error.errors[0].message);  
      return;
    }

    try {
      var response = await axios.post('http://localhost:3000/api/categories/create',{name : addCategoryName},{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
    
      })
      const createdCtg = response.data
      SetData((e)=>[...e,createdCtg])
      console.log('created category : ', response);

    } catch (error) {
      console.log('error adding category',error);
    }
    setShowAddForm(!showAddForm)
    setAddCategoryName('')
  }
  const fetchData = async (name = '',page = 1)=>{
    try {
      let getCategories = await axios.get(`http://localhost:3000/api/categories?search=${name}&page=${page}`,{
        headers: {
          "Content-Type": "application/json",
        },
        params: { name : name },
        withCredentials: true,
      })    
      const {data, totalPages } = getCategories.data;
      SetData(data);
      setFilteredData(data);
      setTotalPages(totalPages);
      console.log('jjjjjjjjjj',getCategories.data);
      setFilteredData(getCategories.data) //search
      SetData(getCategories.data) //fetch
    } catch (error) {
      setError(error)
    }
  }
  
  useEffect(()=>{
    handelSearch.length === '' ? 
    SetData(Data) : (
      fetchData(handelSearch)
    )
  },[handelSearch])
  
  const handlePagination = async (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchData(handelSearch, pageNumber);
  };
  
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 py-4 flex justify-between ">
        <Typography className="flex justify-between px-7 items-center" variant="h6" color="white">
          <PlusCircleIcon onClick={()=>{setShowAddForm(!showAddForm)}} class="h-69 w-9 text-gray-200" className="border px-5 p-3 hover:cursor-pointer " />
        </Typography>

        <Typography className=" px-7 " variant="h6" color="white" >
        <Input
        type="text"
        placeholder="Search..."
        className="!border !border-gray-00 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
        labelProps={{
          className: "hidden",
        }}
        containerProps={{ className: "min-w-[100px]" }}
        onChange={(e)=>sethandelSearch(e.target.value)}
      />
        </Typography>

      </CardHeader>
      
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <div className="flex">
              <tr>
              {['name', 'Action'].map((el) => (
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
            </div>
          </thead>
          <tbody>
            {Data.length != 0 ? (
              Data.map(
                ({id, name }, key) => {
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
                      <PencilSquareIcon  onClick={() => toggleForm({ id: id, name: name })} class="h-6 w-6 text-green-500 hover:cursor-pointer" />                     
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        
                        className="text-xs font-semibold text-red-900"
                      >
                      <TrashIcon onClick={()=>toggleDelete({id : id})} class="h-6 w-6 text-red-500 hover:cursor-pointer" />

                      </Typography>
                    </td>
                  </tr>
                  </>                 
                );
                }
              )
            ) :(
            <tr>
            <td colSpan={3} className="text-center py-3 px-5">
              No matching categories
            </td>
          </tr>
          )}
          </tbody>
        </table>
      </CardBody>
    </Card>
    <div className="fixed bottom-3   right-6 flex justify-between ">
    <button className="px-4 py-2 mr-4 bg-white rounded hover:bg-gray-300 focus:outline-none"
      disabled={currentPage === 1}
      onClick={() => handlePagination(currentPage - 1)}
    >previous</button>
    
    <button
      className="px-4 py-2 bg-white rounded hover:bg-gray-300  focus:outline-none"
      disabled={currentPage === totalPages}
      onClick={() => handlePagination(currentPage + 1)}
    >Next
    </button>
   </div>

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
      {errorMsg && <p className="text-red-500 mt-1">{errorMsg}</p> }
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
        {errorMsg && <p className="text-red-500 mt-1">{errorMsg}</p>} 
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

