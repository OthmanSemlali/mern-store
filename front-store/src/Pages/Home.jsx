import { FeaturedProducts, Hero, Categories } from "../Components";
import Services from "../Components/Services";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Categories />
      {/* <Services /> */}
    </main>
  );
};

export default HomePage;
