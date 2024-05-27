import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { ChevronRightIcon, ChevronLeftIcon,XMarkIcon } from "@heroicons/react/24/outline";
import { fetchOrdersService, updateOrderStatus, useOrderContext } from "@/context";

import {
    CardHeader,
    CardBody,
    Avatar,
    Chip,
    Tooltip,
    Progress,
    Select,
    Input,
    Popover,
    PopoverHandler,
    PopoverContent,
    Checkbox,
    List,
    ListItem,
    ListItemPrefix,
    Option,
    Card, 
    Typography,
} from "@material-tailwind/react";

import { authorsTableData, projectsTableData } from "@/data";
import { formatDate } from "@/configs";
import { PaginationControls } from "@/components";
// import { Select, Option } from "@material-tailwind/react";
 
 

export function Orders() {

  const [state, dispatch] = useOrderContext();
  const navigate = useNavigate()
  const [handelInput, setHandelInput] = useState('')
  const {orders, totalOrders} = state;
  const [handelStatus, setHandelStatus] = useState('')
  const [handelDate, setHandelDate] = useState('')
  const parsed = queryString.parse(location.search);

  // const { page } = parsed;
  const filters = useMemo(() => ({ ...parsed }), [parsed]);
  const {page, orderStatus } = filters



  useEffect(() => {
    fetchOrdersService(dispatch, page, filters, handelInput,handelStatus,handelDate)
  }, [page, orderStatus, handelInput,handelStatus,handelDate])


  //* FILTER ORDERS
    // const setFilter = (name, value) => {
   
    //     const params = new URLSearchParams(window.location.search);
    //     params.set('page', 1);
        
    //     // Set the filter value if it's not empty
    //     if (value.trim() !== "") {
    //       params.set(name, value);
    //     } else {
    //       // If the value is empty, remove the filter from the query string
    //       params.delete(name);
    //     }
        
    //     const newParamsString = params.toString();
    //     const newUrl = `${window.location.pathname}${newParamsString ? '?' + newParamsString : ''}`;
        
    //     navigate(newUrl);
    
    //   };
  const handleChange = (event, id) => {
  const newValue = event.target.value;

  const confirmChange = window.confirm(`Are you sure you want to change the value to ${newValue}?`);

  if (confirmChange) {
    updateOrderStatus(dispatch, id, newValue)
  }
  };

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8 justify-center">
           
      <Card>
        <CardHeader variant="gradient" color="gray" className="flex items-center justify-between p-6 px-7 mb-8 overflow-visible">
          <Typography variant="h6" color="white">
            Orders
          </Typography>

      <select name="" id=""
        // label="Select satatus "        
        onChange={(e)=>{setHandelStatus(e.target.value); console.log('trr ', e.target.value);}}
        className=" px-4 py-2 rounded-lg text-black border border-solid bg-#333333 w-1/5">
          {/* <label htmlFor="">nnnnnnnnn</label> */}
        <option value="" className="" >All</option>
        <option value="pending" className="bg-orange-800">Pending</option>
        <option value="confirmed" className="bg-yellow-700">Confirmed</option>
        <option value="shipped" className="bg-light-green-500">Shipped</option>
        <option value="delivered" className="bg-green-900">Delivered</option>
       </select>

       <select name="" id=""
        // value="Select satatus "        
        onChange={(e)=>{setHandelDate(e.target.value)}}
        className=" px-4 py-2 rounded-lg text-black border border-solid bg-#333333 w-1/5">
          
        <option value="" className="">All</option>
        <option value="7" className="">last 7 days</option>
        <option value="30">last 30 days</option>
        <option value="60">last 60 days</option>
       </select>
            
          <Typography variant="h6" color="white">
            <Input type="text" placeholder="search by name"
              className="!border !border-gray-300 bg-white text-gray-900  "
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
              onChange={(e)=>setHandelInput(e.target.value)}
            />
          </Typography>
          
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["customer", "shipping address", "products", "total price", "payment status", "date", "order status"].map((el) => (
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
              { orders.length  != 0 ? 
              (
              orders.map(
                ({id,  user, products, totalPrice, shipping, orderStatus, paymentStatus, createdAt }, key) => {



                  return <OrderRow {...{id, user, products, totalPrice, shipping, orderStatus, paymentStatus, createdAt, key}} handleChange={handleChange} />;
                })
              ) : (
              <div className=" text-center py-6 px-5">
                <p>No matching order found</p>
              </div>
              )
              }
            </tbody>
          </table>
        </CardBody>
        
      </Card>

      <PaginationControls currentPage={page} navigate={navigate} totalItems={totalOrders} />
      
     
    </div>
  )
}

export default Orders


const OrderRow = ({ id, user, products, totalPrice, shipping, orderStatus, paymentStatus, createdAt, key, handleChange }) => {

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-800';
      case 'confirmed':
        return 'bg-yellow-700';
      case 'delivered':
        return 'bg-light-green-500';
      case 'shipped':
        return 'bg-green-900';
      default:
        return '';
    }
  };

    console.log('***id', id)
    const {line1, city, country} = shipping.address

    const className = `py-3 px-5 ${
        key === authorsTableData.length - 1
          ? ""
          : "border-b border-blue-gray-50"
      }`;
    const [showProductDetails, setShowProductDetails] = useState(false)

    const handelProduct = (products)=>{
      console.log('products', products)
      setShowProductDetails(!showProductDetails)
    }  
  return (
  <>

  <tr key={key}>
        <td className={className}>
          <div className="flex items-center gap-4">
            {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold"
              >
                

                {user.firstName && user.firstName} {user.lastName && user.lastName}
              </Typography>
              <Typography className="text-xs font-normal text-blue-gray-500">
                {user && user.email && user.email}
              </Typography>
              
            </div>
          </div>
        </td>
        <td className={className}>
          
          <Typography className="text-sm font-normal text-blue-gray-500">
            {line1}, {city} 
            
          </Typography>
          <Typography className="text-sm font-normal text-blue-gray-500">
            
            {country}
          </Typography>
        </td>
        <td className={className}>
          
          <Typography className="text-sm font-normal underline text-blue-gray-500"
          
          >
           <button onClick={()=>handelProduct(products)}>products</button> 
          </Typography>
        </td>
        <td className={className}>
          <Typography className="text-xs font-normal text-blue-gray-500">
            ${totalPrice}
          </Typography>
        </td>
        
        <td className={className}>
          <Chip
            variant="gradient"
            color={paymentStatus =='succeeded' ? "green" : "blue-gray"}
            value={paymentStatus == 'succeeded' ? "succeeded" : "failed"}
            className="py-0.5 px-2 text-[11px] font-medium w-fit"
          />
        </td>
        <td className={className}>
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {formatDate(createdAt)}
          </Typography>
        </td>
        <td className={`${className} `}>
        <select
          // value={orderStatus} 
          
          onChange={(e) => handleChange(e, id)}
            className={`p-1  h-full font-sans text-sm font-normal bg-transparent  text-blue-gray-700 outline  rounded-md ${getStatusBgColor(orderStatus)} `}
            // value={orderStatus}
            >
            
            <option value="pending" className="p-4 bg-orange-800" selected={orderStatus == 'pending'}>pending</option>
            <option value="confirmed" className="bg-yellow-700" selected={orderStatus == 'confirmed' }>confirmed</option>
            <option value="shipped" className="bg-light-green-500" selected={orderStatus == 'shipped' }>shipped</option>
            <option value="delivered" className="bg-green-900" selected={orderStatus == 'delivered' }>delivered</option>
        </select>
        </td>
  </tr>
  {showProductDetails && (
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-75">
    <Card className=" rounded-lg w-3/5 h-2/6">
      <table className="relative table-auto text-center h-24">
        <thead>
          <tr>
             {["Name", "OptionColor", "Amount", "Price",<XMarkIcon onClick={handelProduct} class=" text-gray-500 cursor-pointer" /> ].map((clm) => (
               <th className=" bg-opacity-75  border-b border-blue-gray-100 bg-blue-gray-50 p-5 ">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                  >
                  {clm}
                </Typography>
               </th>
             ))}
          </tr>
        </thead>
        <tbody className="h-20">
           {products.map((e) => {

             return (
               <tr key={id}>
                 <td >
                   <Typography variant="small" color="blue-gray" className="font-normal">
                     {e.name}
                   </Typography>
                 </td>
                 <td>
                   <Typography variant="small" color="blue-gray" className="font-normal">
                     {e.optionColor}
                   </Typography>
                 </td>
                 <td >
                   <Typography variant="small" color="blue-gray" className="font-normal">
                     {e.amount}
                   </Typography>
                 </td>
                 <td>
                   <Typography variant="small" color="blue-gray" className="font-normal">
                     {e.price}
                   </Typography>
                 </td>
               </tr>
             );
           })}
        </tbody>

      </table>
      
    </Card>
    </div>
  )}
 </>
  )

}