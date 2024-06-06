import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { PageHero } from "../Components";

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 40px 30px 100px 30px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 16px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const Sidebar = styled.div`
  width: 40%;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 10px;
`;

const MenuItem = styled.li`
  button {
    width: 100%;
    border: 1px solid;
    border-radius: 8px;
    padding: 16px;
    margin: 6px;
    // color:hsl(162, 100%, 25%);
    background-color: #e0dcd4;

    // &:first-child {
    //   border-top: 1px solid black;
    // }

    &.active {
      background-color: #efece6;
    }
  }
`;

const Content = styled.div`
  width: 80%;
  // padding: 24px;
  // border: 1px solid black;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  // padding: 8px 16px;
  // background-color: #3b82f6;
  // color: white;
  // border: none;
  // border-radius: 4px;
  // cursor: pointer;

  // &:hover {
  //   background-color: #2563eb;
  // }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 16px;
`;

const Info = styled.div`
  flex-grow: 1;
`;

// const Button = styled.button`
//   background-color: #ff4d4f;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   padding: 8px 16px;
//   cursor: pointer;
//   font-size: 16px;

//   &:hover {
//     background-color: #ff7875;
//   }
// `;
const Account = () => {
  const [section, setSection] = useState("details");
  const [user, setUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
          throw new Error("oops User not found in session storage");
        }
        setUser(JSON.parse(userString));
        console.log(user);

        // // Optionally, fetch additional user information from the backend
        // const response = await axios.get(`/api/user/${user.id}`);
        // setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  const renderSection = () => {
    switch (section) {
      case "details":
        return <AccountDetails user={user} setUser={setUser} />;
      //   case "address":
      //     return <Address />;
      case "orders":
        return <Orders user={user} />;
      default:
        return <AccountDetails user={user} setUser={setUser} />;
    }
  };

  return (
    <>
      <PageHero title="profile" />
      <Container>
        {/* <Title>Profile</Title> */}

        <FlexContainer>
          <Sidebar>
            <MenuList>
              <MenuItem>
                <button
                  className={section === "details" ? "active" : ""}
                  onClick={() => setSection("details")}
                >
                  Account Details
                </button>
              </MenuItem>
              {/* <MenuItem>
              <button
                className={section === "address" ? "active" : ""}
                onClick={() => setSection("address")}
              >
                Address 
              </button>
            </MenuItem> */}
              <MenuItem>
                <button
                  className={section === "orders" ? "active" : ""}
                  onClick={() => setSection("orders")}
                >
                  Orders
                </button>
              </MenuItem>
            </MenuList>
          </Sidebar>
          <Content>{renderSection()}</Content>
        </FlexContainer>
      </Container>
    </>
  );
};

const AccountDetails = ({ user, setUser }) => {
  const [editedUser, setEditedUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.put(
      `http://localhost:3000/api/users/${user.id}`,
      editedUser,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const updatedUser = response.data;

    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    console.log(response.data);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={editedUser.firstName}
            onChange={(e) =>
              setEditedUser({ ...editedUser, firstName: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            id="lastName"
            type="text"
            value={editedUser.lastName}
            onChange={(e) =>
              setEditedUser({ ...editedUser, lastName: e.target.value })
            }
          />
        </div>
        {/* <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            value={user.displayName}
            onChange={(e) =>
              setEditedUser({ ...editedUser, displayName: e.target.value })
            }
          />
        </div> */}
        <div>
          <Label>Email</Label>
          <Input
            id="email"
            type="email"
            value={editedUser.email}
            onChange={(e) =>
              setEditedUser({ ...editedUser, email: e.target.value })
            }
          />
        </div>
        <Button className="btn" type="submit">
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

// const Address = () => {
//   return (
//     <div>
//       <h3 className="text-xl font-bold mb-4">Address</h3>
//       <p>Update your address here.</p>
//       <Form>
//         <div>
//           <Label htmlFor="address">Address</Label>
//           <Input id="address" type="text" />
//         </div>
//         <Button type="submit">Save Changes</Button>
//       </Form>
//     </div>
//   );
// };

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [image, setImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGVt-dJYnJNb0MZiok_xEgaoq1luX1SIO38Q&s"
  );

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/${user.id}/orders`,

          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("response", response);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      }
    };
    fetchOrdersData();
  }, []);
  const cancelOrder = async (orderId, currentStatus) => {
    if (currentStatus !== "pending") {
      alert("This order can't be canceled anymore.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/orders/updateOrderStatus/${orderId}`,
        { orderStatus: "canceled" },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("update data", response.data);
      // setOrders(
      //   orders.map((order) =>
      //     order.id === orderId ? { ...order, orderStatus: "canceled" } : order
      //   )
      // );
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };
  return (
    <div>
      {orders.map((order) => (
        <Card key={order.id} order={order}>
          <Image src={image} alt="Product" />
          <Info>
            <p>Status: {order.orderStatus}</p>
            <p>Order # {order.id}</p>
            <p>Ordered on: {order.createdAt}</p>
            <p>Order Total: ${order.totalPrice}</p>
          </Info>
          <Button
            className="btn"
            onClick={() => cancelOrder(order.id, order.orderStatus)}
          >
            Cancel Order
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default Account;
