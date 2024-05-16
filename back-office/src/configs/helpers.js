export function formatDate(dateString )  {


    const dateObject = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDate = dateObject.toLocaleDateString('en-US', options);
    return formattedDate;


}