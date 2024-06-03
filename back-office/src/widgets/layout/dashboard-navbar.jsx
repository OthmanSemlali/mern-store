import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  // ArrowRightStartOnRectangleIcon
} from "@heroicons/react/24/solid";
// import { ArrowRightStartOnRectangleIcon } from "@heroicons/24/outline";

import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
  useAuthenticationContext,
} from "@/context";
import { logout } from "@/context/auth/authenticationServices";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page, secPage] = pathname.split("/").filter((el) => el !== "");

  console.log("secPage", secPage);
  const [authState, authDispatch] = useAuthenticationContext();
  const { authenticated } = authState;
  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row md:items">
        <div className="capitalize">
          <div
            className={`flex bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal transition-all opacity-50 hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>

            {page ? (
              <>
                <span className="ml-2 mr-2 text-black">/</span>

                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal "
                >
                  <Link to={`${page}`}>{page}</Link>
                </Typography>
              </>
            ) : null}

            {secPage ? (
              <>
                <span className="ml-2 mr-2 text-black">/</span>

                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {secPage}
                </Typography>
              </>
            ) : null}
          </div>
          {/* <Typography variant="h6" color="blue-gray">
            {secPage}
          </Typography> */}
        </div>
        <div className="flex items-center">
          {/* <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div> */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="w-6 h-6 text-blue-gray-500" />
          </IconButton>

          {authenticated && (
            <Button
              variant="text"
              color="blue-gray"
              className="items-center hidden gap-1 px-4 text-red-900 normal-case xl:flex"
              onClick={() => logout(authDispatch)}
            >
              {/* <ArrowRightStartOnRectangleIcon class="h-6 w-6 text-gray-500" /> */}
              Sign out
            </Button>
          )}

          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="w-5 h-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="border-0 w-max">
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid rounded-full h-9 w-9 place-items-center bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="w-5 h-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
