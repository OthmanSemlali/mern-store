// import { useFilterContext } from "../context/filter_context";
// import GridView from "./GridView";
// import ListView from "./ListView";
// import Loading from "./Loading";
// import SkeletonGridView from "./skeletons/SkeletonGridView";
// import SkeletonListView from "./skeletons/SkeletonListView";
// import SkeletonProduct from "./skeletons/SkeletonProduct";

import { useSelector } from "react-redux";
import ListView from "./ListView";
import GridView from "./GridView";

const ProductList = () => {
//   const {
//     filtred_products: products,
//     grid_view,
//     all_products_loading: loading,
//   } = useFilterContext();

  const {products, products_loading, totaProducts} = useSelector((store) => store.product)
  const {productsView} = useSelector((store)=>store.theme)

//   if (loading && grid_view) {
//     return <SkeletonGridView />;
//   }
//   if (loading && !grid_view) {
//     return <SkeletonListView />;
//   }
  if (totaProducts == 0) {
    return (
      <h5 style={{ textTransform: "none" }}>
        Sorry, no products matched your search..
      </h5>
    );
  }
  if (productsView == 'list') {
    return (
      <>
        <ListView products={products} />
      </>
    );
  }
  return (
    <>
    
      <GridView products={products} />
    </>
  );

// return (
//     <ListView products={products} />

// )
};

export default ProductList;
