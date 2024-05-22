import { Button } from "@material-tailwind/react";


export function PaginationControls({ currentPage = 1, navigate, totalItems }) {
  const totalPages = Math.ceil(totalItems / 6);

  const page = parseInt(currentPage);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;


  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  const paginate = (page) => {
    if (!page) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);

    const newParamsString = params.toString();

    const newUrl = `${window.location.pathname}${
      newParamsString ? "?" + newParamsString : ""
    }`;

    navigate(newUrl);
  };

  if(totalPages <= 1){
    return 
  }
  return (
    <>

<div className="flex justify-between">

<Button
 disabled={isFirstPage}
 onClick={() => paginate(prevPage)}>
  Previous

</Button>



<Button
    disabled={isLastPage}
    onClick={() => paginate(nextPage)}
>
Next

</Button>
</div>



    </>
  );
}

export default PaginationControls;