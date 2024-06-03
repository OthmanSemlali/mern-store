import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { ChevronRightIcon, ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  fetchOrdersService,
  updateOrderStatus,
  useOrderContext,
} from "@/context";
import {
  CardHeader,
  CardBody,
  Avatar,
  Chip,
  Input,
  Card,
  Typography,
} from "@material-tailwind/react";
import { PaginationControls } from "@/components";
import { debounce } from "lodash";
import { formatDate } from "@/configs";
import { authorsTableData } from "@/data";
import TableRowLoader from "@/components/loaders/TableRowLoader";
const getStatusBgColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-orange-600"; // Darker orange
    case "confirmed":
      return "bg-yellow-600"; // Darker yellow
    case "delivered":
      return "bg-green-600"; // Darker green
    case "shipped":
      return "bg-blue-600"; // Darker blue
    default:
      return "bg-transparent";
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case "pending":
    case "delivered":
    case "shipped":
      return "text-white"; // White text for darker backgrounds
    case "confirmed":
      return "text-black"; // Black text for yellow background
    default:
      return "text-black";
  }
};

const OrderRow = ({
  id,
  user,
  products,
  totalPrice,
  shipping,
  orderStatus,
  paymentStatus,
  createdAt,
  key,
  handleChange,
}) => {
  const [currentOrderStatus, setCurrentOrderStatus] = useState(orderStatus);

  useEffect(() => {
    setCurrentOrderStatus(orderStatus);
  }, [orderStatus]);



  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentOrderStatus(newStatus);
    handleChange(e, id);
  };

  const { line1, city, country } = shipping.address;
  const className = `py-3 px-5 ${
    key === authorsTableData.length - 1 ? "" : "border-b border-blue-gray-50"
  }`;
  const [showProductDetails, setShowProductDetails] = useState(false);

  const handleProduct = (products) => {
    console.log("products", products);
    setShowProductDetails(!showProductDetails);
  };

  return (
    <>
      <tr key={key}>
        <td className={className}>
          <div className="flex items-center gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
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
            <button onClick={() => handleProduct(products)}>products</button>
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
            color={paymentStatus === "succeeded" ? "green" : "blue-gray"}
            value={paymentStatus === "succeeded" ? "succeeded" : "failed"}
            className="py-0.5 px-2 text-[11px] font-medium w-fit"
          />
        </td>
        <td className={className}>
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {formatDate(createdAt)}
          </Typography>
        </td>
        <td className={`${className}`}>
          <select
            onChange={handleStatusChange}
            className={`p-1 h-full font-sans text-sm font-normal  outline-none rounded-md ${getStatusBgColor(
              currentOrderStatus,
            )} ${getStatusTextColor(currentOrderStatus)}`}
            value={currentOrderStatus}
          >
            <option value="pending" className="p-4 text-white bg-orange-500">
              pending
            </option>
            <option value="confirmed" className="text-white bg-yellow-400">
              confirmed
            </option>
            <option value="shipped" className="text-white bg-blue-500">
              shipped
            </option>
            <option value="delivered" className="text-white bg-green-500">
              delivered
            </option>
          </select>
        </td>
      </tr>
      {showProductDetails && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-75">
       <Card className="w-3/5 rounded-lg max-h-[80vh] overflow-y-auto">
       <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <Typography variant="h6" color="blue-gray">
        Order Details
      </Typography>
      <XMarkIcon onClick={handleProduct} className="w-6 h-6 text-gray-500 cursor-pointer" />
    </div>
         <table className="w-full text-center table-auto">
           <thead>
             <tr>
               {["Name", "Option Color", "Amount", "Price"].map((clm, index) => (
                 <th
                   key={index}
                   className="p-4 bg-opacity-75 border-b border-blue-gray-100 bg-blue-gray-50"
                 >
                   <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                     {clm}
                   </Typography>
                 </th>
               ))}
             </tr>
           </thead>
           <tbody>
             {products.map((e, index) => (
               <tr key={index}>
                 <td className="p-4 border-b border-gray-100">
                   <Typography variant="small" color="blue-gray" className="font-normal">
                     {e.name}
                   </Typography>
                 </td>
                 <td className="p-4 border-b border-gray-100">
                   <Typography variant="small" color="blue-gray" className="font-normal">
                     {e.optionColor}
                   </Typography>
                 </td>
                 <td className="p-4 border-b border-gray-100">
                   <Typography variant="small" color="blue-gray" className="font-normal">
                     {e.amount}
                   </Typography>
                 </td>
                 <td className="p-4 border-b border-gray-100">
                   <Typography variant="small" color="blue-gray" className="font-normal">
                     {e.price}
                   </Typography>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </Card>
     </div>
     
      )}
    </>
  );
};

export function Orders({ setFilter }) {
  const updateFilters = useCallback(
    debounce(({ target }) => {
      setFilter(target.name, target.value);
    }, 300),
    [setFilter]
  );

  const handleSearchInputChange = (e) => {
    updateFilters(e);
  };

  const [state, dispatch] = useOrderContext();
  
  const navigate = useNavigate();
  const { orders, totalOrders, isLoading } = state;

  const parsed = queryString.parse(location.search);
  const filters = useMemo(() => ({ ...parsed }), [parsed]);
  const { page, orderStatus, q: searchQuery, date } = filters;

  const handleChange = (event, id) => {
    const newValue = event.target.value;
    const confirmChange = window.confirm(`Are you sure you want to change the value to ${newValue}?`);
    if (confirmChange) {
      updateOrderStatus(dispatch, id, newValue);
    }
  };

  useEffect(() => {
    fetchOrdersService(dispatch, page, searchQuery, orderStatus, date);
  }, [page, orderStatus, searchQuery, date]);


  return (
    <div className="flex flex-col justify-center gap-12 mt-12 mb-8">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="flex items-center justify-between p-6 mb-8 space-x-4 overflow-auto px-7"
        >
          <Typography variant="h6" color="white">
            Orders
          </Typography>
          <div className="flex items-center space-x-4">
            <select
              name="orderStatus"
              onChange={updateFilters}
              className="w-2/5 px-4 py-2 text-black border border-gray-300 border-solid rounded-lg"
              // className={`p-1 h-full font-sans text-sm font-normal bg-transparent outline-none rounded-md ${getStatusBgColor(currentOrderStatus)} ${getStatusTextColor(currentOrderStatus)}`}
            >
              <option value="" >Status</option>
              <option value="pending" className="p-4 text-white bg-orange-500">
              pending
            </option>
            <option value="confirmed" className="text-white bg-yellow-400">
              confirmed
            </option>
            <option value="shipped" className="text-white bg-blue-500">
              shipped
            </option>
            <option value="delivered" className="text-white bg-green-500">
              delivered
            </option>
            </select>
            <select
              name="date"
              onChange={updateFilters}
              className="w-2/5 px-4 py-2 text-black bg-white border border-gray-300 border-solid rounded-lg"
            >
              <option value="">Date</option>
              <option value="7">last 7 days</option>
              <option value="30">last 30 days</option>
              <option value="60">last 60 days</option>
            </select>
            <Input
              type="text"
              placeholder="Search by name"
              name="q"
              className="!border !border-gray-300 bg-white text-gray-900 shadow-lg ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{ className: "hidden" }}
              containerProps={{ className: "min-w-[200px]" }}
              onChange={handleSearchInputChange}
            />
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["customer", "shipping address", "products", "total price", "payment status", "date", "order status"].map((el) => (
                  <th key={el} className="px-5 py-3 text-left border-b border-blue-gray-50">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
              <>
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
              </>
            ) : ( orders.length != 0 ? (
                orders.map(({ id, user, products, totalPrice, shipping, orderStatus, paymentStatus, createdAt }, key) => {
                 return <OrderRow {...{id, user, products, totalPrice, shipping, orderStatus, paymentStatus, createdAt, key}} handleChange={handleChange} />;
                })) : (
                <tr>
                  <td colSpan="7">
                    <div className="px-5 py-6 text-center ">
                      <p>No matching order found</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <PaginationControls currentPage={page} navigate={navigate} totalItems={totalOrders} />
    </div>
  );
}

export default Orders;
