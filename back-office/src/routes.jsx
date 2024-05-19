import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  TagIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  UsersIcon
  
} from "@heroicons/react/24/solid";

import { Home, Profile, Tables, Notifications, Orders, Categories, Customers } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import {NotFound} from "@/pages/Error";
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
     
      {
        icon: <TableCellsIcon {...icon} />,
        name: "products",
        path: "/products",
        element: <Tables />,
      },
      {
        icon: <TagIcon {...icon} />,
        name: "categories",
        path: "/categories",
        element:<Categories/>,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "customers",
        path: "/customers",
        element: <Customers />,
      },
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },
      
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
      // {
      //   // icon: <InformationCircleIcon {...icon} />,
      //   // name: "notifications",
      //   path: "*",
      //   element: <NotFound />,
      // }
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export const authRoutes = [
  {
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      // {
      //   // icon: <RectangleStackIcon {...icon} />,
      //   // name: "sign up",
      //   path: "/success",
      //   element: <AuthSuccess,
      // },
    ],
  },
]

export default routes;
