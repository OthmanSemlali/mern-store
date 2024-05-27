import queryString from "query-string";
import { useEffect, useMemo, useState } from "react"
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
    Input
  } from "@material-tailwind/react";
import { authorsTableData, projectsTableData } from "@/data";
import { formatDate } from "@/configs";
import { PaginationControls, SearchInput } from "@/components";
import { useCustomerContext } from "@/context";
import { fetchUsersService } from "@/context/customer/customerServices";


export function Customers() {

  const [state, dispatch] = useCustomerContext();
  const navigate = useNavigate()
  const [handelSearch,setHandelSearch] = useState('')
  const {users, totalUsers} = state;

  const parsed = queryString.parse(location.search);

  const filters = useMemo(() => ({ ...parsed }), [parsed]);

  const {page, type } = filters


    useEffect(() => {
        fetchUsersService(dispatch, page, handelSearch)
    }, [page, type,handelSearch])

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
           
      <Card>
        <CardHeader variant="gradient" color="gray" className="flex items-center justify-between p-6 mb-8">
         
         
         <Typography variant="h6" color="white">
            Users
          </Typography>
          <Typography variant="h6" color="white">
            {/* <SearchInput /> */}
            <Input type="text" placeholder="search by name"
              className="!border !border-gray-300 bg-white text-gray-900  "
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
              onChange={(e)=>setHandelSearch(e.target.value)}
            />
          </Typography>

        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["full name", "email", "role", "joined"].map((el) => (
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
              { users.length !==0 ?(
                users.map(
                  ({id, firstName, lastName, email, role, createdAt }, key) => {
                    return <OrderRow {...{id, firstName, lastName, email, role, createdAt, key}} />;
                  }
                )

              ) : (
                <p className=" py-6 px-10">No matching customers found</p>
              )
              }
            </tbody>
          </table>
        </CardBody>
      </Card>



        <PaginationControls currentPage={page} navigate={navigate} totalItems={totalUsers} />
    </div>
  )
}

export default Customers


const OrderRow = ({ id, firstName, lastName, email, role, createdAt, key }) => {


    const className = `py-3 px-5 ${
        key === authorsTableData.length - 1
          ? ""
          : "border-b border-blue-gray-50"
      }`;
      
      
      return (


        <tr key={key}>
        <td className={className}>
          <div className="flex items-center gap-4">
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold"
              >
                

                {firstName && firstName} {lastName && lastName}
              </Typography>
         
              
            </div>
          </div>
        </td>
        <td className={className}>
          
          <Typography className="text-sm font-normal text-blue-gray-500">
            {email && email}
            
          </Typography>
         
        </td>
        <td className={className}>
          
          <Typography className="text-sm font-normal text-blue-gray-500">
            {role}
            
          </Typography>
         
        </td>
       
  
        <td className={className}>
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {formatDate(createdAt)}
          </Typography>
        </td>
        
      </tr>


    )
}
