import { chartsConfig } from "@/configs";

export const Charts = (usersByDays, ordersByMonths, salesByMonths) => {

  const usersByDaysChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "users",
        data: usersByDays.users,
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: usersByDays.days,
      },
    },
  };
  
  const ordersByMonthsChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "orders",
        data: ordersByMonths.orders,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: ordersByMonths.months,
      },
    },
  };
  
  const salesByMonthsChart = {
    type: "area",
    height: 220,
    series: [
      {
        name: "Sales",
        data: salesByMonths.sales,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#388e3c"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: salesByMonths.months,
      },
    },
  };

  
  return [
    {
      color: "white",
      title: "Week's Users",
      description: "Last Campaign Performance",
      // footer: "campaign sent 2 days ago",
      chart: usersByDaysChart,
    },
    {
      color: "white",
      title: "Monthly Orders",
      description: "15% increase in today sales",
      // footer: "updated 4 min ago",
      chart: ordersByMonthsChart,
    },
    {
      color: "white",
      title: "Monthly Sales",
      description: "Last Campaign Performance",
      // footer: "just updated",
      chart: salesByMonthsChart,
    },
  ];
  
}
export default Charts;
