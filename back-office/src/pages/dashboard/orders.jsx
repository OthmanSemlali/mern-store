import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

import { fetchOrdersService, updateOrderStatus, useOrderContext } from "@/context";

import {
    Card,
    CardHeader,
    CardBody,
    Typography,
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
    Option
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
  // const [date, setDate] = React.useState<Date>(new Date());;
  const [handelStatus, setHandelStatus] = useState('')
  const [handelDate, setHandelDate] = useState('')
  console.log('totalOrders', totalOrders)
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

  if(orders.length == 0){
    return <div className="flex flex-col gap-12 mt-12 mb-8">
            <p>No orders</p>
    </div>
  }
  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
           
      <Card>
        <CardHeader variant="gradient" color="gray" className="flex items-center justify-between p-6 mb-8 overflow-visible">
          <Typography variant="h6" color="white">
            Orders
          </Typography>
    <div>

      <select name="" id=""
        // label="Select satatus "        
        onChange={(e)=>{setHandelStatus(e.target.value); console.log('trr ', e.target.value);}}
        className=" px-4 py-2 rounded-lg text-black border border-solid bg-#333333">
        <option value="" className="">All</option>
        <option value="pending" className="">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
       </select>

       <select name="" id=""
        // label="Select satatus "        
        onChange={(e)=>{setHandelDate(e.target.value)}}
        className=" px-4 py-2 rounded-lg text-black border border-solid bg-#333333">
        <option value="" className="">All</option>
        <option value="3" className="">last 7 days</option>
        <option value="30">last 30 days</option>
        <option value="60">last 60 days</option>
       </select>
    </div>
            
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
              {orders.map(
                ({id,  user, products, totalPrice, shipping, orderStatus, paymentStatus, createdAt }, key) => {

         

                  return <OrderRow {...{id, user, products, totalPrice, shipping, orderStatus, paymentStatus, createdAt, key}} handleChange={handleChange} />;
                }
              )}
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

    console.log('***id', id)
    const {line1, city, country} = shipping.address

    const className = `py-3 px-5 ${
        key === authorsTableData.length - 1
          ? ""
          : "border-b border-blue-gray-50"
      }`;
      
      const [showProducts, setShowProducts] = useState(false)
      return (


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
          
          <Typography className="text-sm font-normal underline text-blue-gray-500">
            products
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
        <td className={className}>
        <select
          // value={orderStatus} 
          onChange={(e) => handleChange(e, id)}
            className="h-full font-sans text-sm font-normal bg-transparent peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent disabled:border-0 disabled:bg-blue-gray-50">
            <option value="pending" selected={orderStatus == 'pending' ? true : null}>pending</option>
            <option value="confirmed" selected={orderStatus == 'confirmed' ? true : null}>confirmed</option>
            <option value="shipped" selected={orderStatus == 'shipped' ? true : null}>shipped</option>
            <option value="delivered" selected={orderStatus == 'delivered' ? true : null}>delivered</option>
          </select>
        </td>
      </tr>


    )
}