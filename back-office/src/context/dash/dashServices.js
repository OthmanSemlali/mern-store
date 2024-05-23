import { loadCardTodaysOrdersSuccess, loadCardTodaysRevenueSuccess, loadCardTotalRevenueSuccess, loadCardWeekUsersSuccess, loadChartOrdersByMonth, loadChartSalesByMonth, loadChartUsersByDay } from "./dashContext";

export const fetchCardsData = async (dispatch) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/getTodayAndYesterdayRevenueComparison`
        );
  
        if (!response.ok) {
       
         console.error('getTodayAndYesterdayRevenueComparison Err')
        }

        const response2 = await fetch(
            `http://localhost:3000/api/orders/getTodayAndYesterdayOrderCountComparison`
          );
    
          if (!response2.ok) {
         
           console.error('getTodayAndYesterdayOrderCountComparison Err')
          }
  

          const response3 = await fetch(
            `http://localhost:3000/api/users/getThisWeekAndLastWeekUserCountComparison`
          );
    
          if (!response3.ok) {
         
           console.error('getThisWeekAndLastWeekUserCountComparison Err')
          }
  

          const response4 = await fetch(
            `http://localhost:3000/api/orders/getTotalRevenue`
          );
    
          if (!response4.ok) {
         
           console.error('getTotalRevenue Err')
          }


        const data = await response.json();

        const data2 = await response2.json();
        const data3 = await response3.json();
        const data4 = await response4.json();

        if(data){
            loadCardTodaysRevenueSuccess(dispatch, data)
        }

        if(data2){
            loadCardTodaysOrdersSuccess(dispatch, data2)
        }

        if(data3){
            loadCardWeekUsersSuccess(dispatch, data3)
        }

        if(data4){
            loadCardTotalRevenueSuccess(dispatch, data4)
        }

        // if(data5){
        //   loadChartOrdersByMonth(dispatch, data5)
        // }
        
      } catch (error) {
        console.log("Error: Something went wrong while RevDay Card", error);
      }
    }

    export const fetchChartsData = async (dispatch) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/getOrderCountsByMonth`
        );
  
        if (!response.ok) {
       
         console.error('getOrderCountsByMonth Err')
        }

        const response2 = await fetch(
            `http://localhost:3000/api/orders/getSalesRevenueByMonth`
          );
    
          if (!response2.ok) {
         
           console.error('getSalesRevenueByMonth Err')
          }
  

          const response3 = await fetch(
            `http://localhost:3000/api/users/getUsersCountByDayOfWeek`
          );
          
          if(!response3.ok){
            console.error('getUsersCountByDayOfWeek');
          }
        
        const data = await response.json();

        const data2 = await response2.json();
        const data3 = await response3.json();

        console.log('data ', data)
        console.log('data1 ', data2)
        console.log('data3 ', data3)
  


        if(data){
          loadChartOrdersByMonth(dispatch, data)
        }

        if(data2){
          loadChartSalesByMonth(dispatch, data2)
        }

        if(data3){
          loadChartUsersByDay(dispatch, data3)
        }
        
      } catch (error) {
        console.log("Error: Something went wrong while fetch chart data", error);
      }
    }

    