import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  Input,
} from "@material-tailwind/react";
import { authorsTableData, projectsTableData } from "@/data";
import { formatDate } from "@/configs";
import { PaginationControls, SearchInput } from "@/components";
import { useCustomerContext } from "@/context";
import { fetchUsersService } from "@/context/customer/customerServices";
import { debounce } from "lodash";
import TableRowLoader from "@/components/loaders/TableRowLoader";

export function Customers({ setFilter }) {
  const [state, dispatch] = useCustomerContext();
  const navigate = useNavigate();
  const [handelSearch, setHandelSearch] = useState("");
  
  const { users, totalUsers, isLoading } = state;

  const parsed = queryString.parse(location.search);

  const filters = useMemo(() => ({ ...parsed }), [parsed]);

  const { page, type, q: searchQuery } = filters;

  const updateFilters = useCallback(
    debounce(({ target }) => {
      setFilter(target.name, target.value);
    }, 300),
    [setFilter],
  );

  const handleSearchInputChange = (e) => {
    updateFilters(e);
  };

  useEffect(() => {
    // console.log('type, searchQuery', type, searchQuery)
    fetchUsersService(dispatch, page, type, searchQuery);
  }, [page, type, searchQuery]);

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="flex items-center justify-between p-6 mb-8 space-x-4 overflow-auto"
        >
          <Typography variant="h6" color="white">
            Users
          </Typography>
          <div color="white" className="flex items-center space-x-4">
            <select
              name="type"
              onChange={updateFilters}
              className="w-3/5 px-4 py-2 text-black bg-white border border-gray-300 border-solid rounded-lg"
            >
              <option value="">All</option>
              <option value="placedOrder">Placed Order</option>
              <option value="createdAccount">Created Account</option>
            </select>
            {/* <SearchInput /> */}
            <Input
              type="text"
              placeholder="search by name"
              name="q"
              className="!border !border-gray-300 bg-white text-gray-900  "
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
              // onChange={(e)=>setHandelSearch(e.target.value)}
              onChange={handleSearchInputChange}
            />
          </div>
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
            {isLoading ? (
              <>
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
              </>
            ) : ( users.length !== 0 ? (
                users.map(
                  (
                    { id, firstName, lastName, email, role, createdAt },
                    key,
                  ) => {
                    return (
                      <OrderRow
                        {...{
                          id,
                          firstName,
                          lastName,
                          email,
                          role,
                          createdAt,
                          key,
                        }}
                      />
                    );
                  },
                )
              ) : (
                <p className="px-10 py-6 ">No matching customers found</p>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <PaginationControls
        currentPage={page}
        navigate={navigate}
        totalItems={totalUsers}
      />
    </div>
  );
}

export default Customers;

const OrderRow = ({ id, firstName, lastName, email, role, createdAt, key }) => {
  const className = `py-3 px-5 ${
    key === authorsTableData.length - 1 ? "" : "border-b border-blue-gray-50"
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
  );
};
