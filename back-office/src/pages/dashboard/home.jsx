import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";

// import {
//   BanknotesIcon,
//   UserPlusIcon,
//   UsersIcon,
//   ChartBarIcon,
// } from "@heroicons/react/24/solid";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  // statisticsCardsData,
  // statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
  Charts,
} from "@/data";
import { CheckCircleIcon, ClockIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
 } from "@heroicons/react/24/solid";
import { useAuthenticationContext } from "@/context";
import CardSkeletonLoader from "@/components/loaders/CardSkeletonLoader";

export function Home({dashState}) {


  console.log('dash state in dash home ', dashState)
  const [state] = useAuthenticationContext()
  const {authenticated} = state

  if(!authenticated){
    return;
  }


  const {ordersByMonths, salesByMonths, todays_orders, todays_revenue, total_revenue, usersByDays, week_users} = dashState

  console.log('todays_revenue', todays_revenue)
  const statisticsCardsData = [
    {
      color: "gray",
      icon: BanknotesIcon,
      title: "Today's Money",
      value: `${todays_revenue.revenue} DH`,
      loading: todays_revenue.isLoading,

      
      footer: {
        color: `${todays_revenue.comparison > 0 ? 'text-green-500' : 'text-red-500'}`,
        value: `${todays_revenue.comparison >= 0 ? '+' + todays_revenue.comparison : todays_revenue.comparison}%`,
        label: "than yesterday",
      },
    },
    {
      color: "gray",
      icon: UsersIcon,
      title: "This Week's Users",
      value: week_users.users,
      loading:week_users.isLoading,
      footer: {
        color: `${week_users.comparison > 0 ? 'text-green-500' : 'text-red-500'}`,
        value: `${week_users.comparison >= 0 ? '+' + week_users.comparison : week_users.comparison}%`,
        label: "than last week",
      },
    },
    {
      color: "gray",
      icon: ShoppingCartIcon,
      title: "Today's Orders",
      value: todays_orders.orders,
      loading:todays_orders.isLoading,

      footer: {
        color: `${todays_orders.comparison > 0 ? 'text-green-500' : 'text-red-500'}`,
        value: `${todays_orders.comparison >= 0 ? '+' + todays_orders.comparison : todays_orders.comparison}%`,
        label: "than yesterday",
      },
    },
    {
      color: "gray",
      icon: ChartBarIcon,
      title: "Sales",
      value: `${total_revenue.currentYearRevenue} DH`,
      loading:total_revenue.isLoading,

      footer: {
        color:  `${total_revenue.comparison > 0 ? 'text-green-500' : 'text-red-500'}`,
        value: `${total_revenue.comparison >= 0 ? '+' + total_revenue.comparison : total_revenue.comparison} %`,
        label: "than last year",
      },
    },
  ];

  

  const charts = Charts(usersByDays, ordersByMonths, salesByMonths)
  


  return (
    <div className="mt-12">
      <div className="grid mb-12 gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        
        {statisticsCardsData.map(({ icon, title,loading, footer, ...rest }) => (


          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            loading={loading}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="grid grid-cols-1 mb-6 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {charts.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            // footer={
            //   <Typography
            //     variant="small"
            //     className="flex items-center font-normal text-blue-gray-600"
            //   >
            //     <ClockIcon strokeWidth={2} className="w-4 h-4 text-blue-gray-400" />
            //     &nbsp;{props.footer}
            //   </Typography>
            // }
          />
        ))}
      </div>
      {/* <div className="grid grid-cols-1 gap-6 mb-4 xl:grid-cols-3">
        <Card className="overflow-hidden border shadow-sm xl:col-span-2 border-blue-gray-100">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="flex items-center justify-between p-6 m-0"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="w-4 h-4 text-blue-gray-200" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="w-6 h-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="px-6 py-3 text-left border-b border-blue-gray-50"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="block mb-1 text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
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
        <Card className="border shadow-sm border-blue-gray-100">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="p-6 m-0"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div> */}
    </div>
  );
}

export default Home;
