const Product = require("../Models/product.model");
const User = require("../Models/user.model");
const Order = require("../Models/order.model")

const getUserById = async (req, res) => {

  console.log('getUserById');
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'oops User not found' });
        }
        console.log("user", user);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'user.id': req.params.id ,  orderStatus: { $ne: 'canceled' } });
        if (!orders) {
            return res.status(404).json({ message: 'oops No orders found for this user' });
        }
        console.log("orders", orders);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

const updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'oops User not found' });
        }
        console.log("updatedUser", updatedUser);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

const deleteSellerProfile = async (req, res) => {
    try {
        if (!req.user.id) {
            return res.json({ message: "seller acc doesnt exist" })
        }
        // Get seller ID from the request (it could be retrieved from authentication middleware)
        const sellerID = req.user.id;

        // const user = await User.findById(sellerID)

        // Check if the user has the role 'seller'
        // if (req.user.role !== 'seller') {
        //     return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this account.' });
        // }

        // Delete all products posted by the seller
        await Product.deleteMany({ sellerID });

        // Delete the seller's profile
        await User.findByIdAndDelete({ _id: sellerID });



        // Send a success response
        return res.status(200).json({ message: 'Seller profile and all products deleted successfully.' });
    } catch (error) {
        console.error('Error deleting seller profile:', error);
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};


// const fetchPaginatedUsers = async (req, res) => {
//     const {
//       page = 1,
//       pageSize = 6,
//       searchQuery,
//       type
  
//     } = req.query;
//     const search = {}
//     if(searchQuery){
//       search.firstName ={
//         $regex : searchQuery,
//         $options : "i",
//       }
//     }

//     if(type){

//     }

    
//     try {
      
//       const response = await User.fetchUsers(
//         parseInt(page),
//         parseInt(pageSize),
//         search
//       );
//       res.json({ response });
//     console.log('response :', response)

//     } catch (error) {

//         res.status(500).json({ message: "Server Error" });

//     }
// }
const fetchPaginatedUsers = async (req, res) => {
  const {
    page = 1,
    pageSize = 6,
    searchQuery,
    type
  } = req.query;

  const search = {};
  if (searchQuery && searchQuery != 'undefined') {
    search.firstName = {
      $regex: searchQuery,
      $options: "i"
    };
  }

  try {
    let users = [];
    let totalUsers = 0;

    if (type === 'placedOrder') {
      const aggregateQuery = [
        {
          $match: search
        },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "user.id",
            as: "orders"
          }
        },
        {
          $match: {
            "orders.0": { $exists: true }
          }
        }
      ];

      users = await User.aggregate([
        ...aggregateQuery,
        {
          $skip: (page - 1) * pageSize
        },
        {
          $limit: parseInt(pageSize)
        }
      ]);

      const totalUsersResult = await User.aggregate([
        ...aggregateQuery,
        {
          $count: "total"
        }
      ]);

      totalUsers = totalUsersResult.length > 0 ? totalUsersResult[0].total : 0;

    } else if (type === 'createdAccount') {
      const aggregateQuery = [
        {
          $match: search
        },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "user.id",
            as: "orders"
          }
        },
        {
          $match: {
            "orders.0": { $exists: false }
          }
        }
      ];

      users = await User.aggregate([
        ...aggregateQuery,
        {
          $skip: (page - 1) * pageSize
        },
        {
          $limit: parseInt(pageSize)
        }
      ]);

      const totalUsersResult = await User.aggregate([
        ...aggregateQuery,
        {
          $count: "total"
        }
      ]);

      totalUsers = totalUsersResult.length > 0 ? totalUsersResult[0].total : 0;

    } else {
      users = await User.find(search)
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize));

      totalUsers = await User.countDocuments(search);
    }

    res.json({ users, totalUsers });
    console.log('response :', { users, totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log(error);
  }
};


  const getThisWeekAndLastWeekUserCountComparison = async (req, res) => {
    try {
      // Get the start and end dates for this week and last week
      const today = new Date();
      const endOfWeek = new Date(today);
      endOfWeek.setHours(0, 0, 0, 0); // Set time to the beginning of the day
      const startOfWeek = new Date(endOfWeek);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the first day of the week
  
      const lastWeekStart = new Date(startOfWeek);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7); // Set to the start of the previous week
      const lastWeekEnd = new Date(startOfWeek);
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 1); // Set to the end of the previous week
  
      // MongoDB aggregation pipeline to calculate user count for this week and last week
      const [thisWeekUserCount, lastWeekUserCount] = await Promise.all([
        // Count users for this week
        User.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfWeek, $lt: new Date(endOfWeek.getTime() + 24 * 60 * 60 * 1000) },
            },
          },
          {
            $group: {
              _id: null,
              userCount: { $sum: 1 },
            },
          },
        ]),
  
        // Count users for last week
        User.aggregate([
          {
            $match: {
              createdAt: { $gte: lastWeekStart, $lt: new Date(lastWeekEnd.getTime() + 24 * 60 * 60 * 1000) },
            },
          },
          {
            $group: {
              _id: null,
              userCount: { $sum: 1 },
            },
          },
        ]),
      ]);
  
      // Extract this week's and last week's user counts from the aggregation results
      const thisWeekUserCountValue = thisWeekUserCount.length > 0 ? thisWeekUserCount[0].userCount : 0;
      const lastWeekUserCountValue = lastWeekUserCount.length > 0 ? lastWeekUserCount[0].userCount : 0;
  
      // Calculate percentage change relative to last week's user count
      let percentageChange = 0;
      if (lastWeekUserCountValue !== 0) {
        percentageChange = ((thisWeekUserCountValue - lastWeekUserCountValue) / lastWeekUserCountValue) * 100;
      } else if (thisWeekUserCountValue !== 0) {
        percentageChange = 100; // Assume a 100% increase if last week's count is zero but this week's count is not zero
      }
  
      // Format the comparison result
      const comparisonResult = Number(percentageChange.toFixed(2))
  
      res.json({
        thisWeekUserCount: thisWeekUserCountValue,
        lastWeekUserCount: lastWeekUserCountValue,
        comparison: comparisonResult,
      });
    } catch (error) {
      console.error('Error calculating user count comparison:', error);
      res.status(500).json({ error: 'Error calculating user count comparison' });
    }
  };


  const getUsersCountByDayOfWeek = async (req, res) => {

    // console.log('getUsersCountByDayOfWeek**'); return
    try {
      const usersByDayOfWeek = await User.aggregate([
        {
          $match: {
            role: 'user', // Filter users by role 'user'
            createdAt: { $exists: true }, // Ensure there is a createdAt field for date filtering
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: { date: '$createdAt', timezone: 'America/New_York' } }, // Adjust timezone as per your application needs
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id': 1 } // Sort by day of the week (Sunday to Saturday)
        }
      ]);
  
      // Initialize arrays to store user counts and days
      const userCounts = new Array(7).fill(0);
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
      // Map the aggregation results to the correct day index
      usersByDayOfWeek.forEach((result) => {
        const dayIndex = result._id - 1; // MongoDB $dayOfWeek returns 1 for Sunday, so adjust index
        userCounts[dayIndex] = result.count;
      });

      res.json({ counts: userCounts, days:daysOfWeek });
    } catch (error) {
      console.error('Error fetching user counts by day of week:', error);
      res.status(500).json({ error: 'Error fetching user counts by day of week' });
    }
  };
module.exports = { getUserById, getUserOrders, updateUserById, deleteSellerProfile , fetchPaginatedUsers, getThisWeekAndLastWeekUserCountComparison, getUsersCountByDayOfWeek}