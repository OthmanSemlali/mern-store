import { PaginationControls } from "@/container";
import { fetchOrdersService, useOrderContext } from "@/context"
import queryString from "query-string";
import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom";
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
  } from "@material-tailwind/react";
import { authorsTableData, projectsTableData } from "@/data";
import { formatDate } from "@/configs";


export function Orders() {

const [state, dispatch] = useOrderContext();
const navigate = useNavigate()

const {orders, totalOrders} = state;

console.log('totalOrders', totalOrders)
const parsed = queryString.parse(location.search);

// const { page } = parsed;
  const filters = useMemo(() => ({ ...parsed }), [parsed]);

  const {page, orderStatus } = filters


    useEffect(() => {
        fetchOrdersService(dispatch, page, filters)
    }, [page, orderStatus])


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
  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
           
      <Card>
        <CardHeader variant="gradient" color="gray" className="p-6 mb-8">
          <Typography variant="h6" color="white">
            Orders
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
                ({ user, products, totalPrice, shipping, orderStatus, paymentStatus, createdAt }, key) => {

                    const {line1, city, country} = shipping.address
                  const className = `py-3 px-5 ${
                    key === authorsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

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
                          class="peer h-full   border-blue-gray-200 border-t-transparent bg-transparent   font-sans text-sm font-normal text-blue-gray-700 outline outline-0  placeholder-shown:border-t-blue-gray-200  focus:border-t-transparent disabled:border-0 disabled:bg-blue-gray-50">
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="shipped">shipped</option>
                          <option value="delivered">delivered</option>
                        </select>
                      </td>
                    </tr>
                  );
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