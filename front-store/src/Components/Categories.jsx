import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Categories() {
  const [categories, setCategories] = useState([]);
  const defaultImage =
    "https://www.marazzitile.co.uk/app/uploads/2023/10/Marazzi_Contract_Home.jpg";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("oops Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?page=1&category=${category.name}`);
  };

  return (
    <Wrapper className="section">
      <div className="title">
        <h2>Collections by Category</h2>
        <div className="underline"></div>
        <p>
          Discover the ceramic and porcelain stoneware collections, ideal for
          all spaces, indoors and outdoors.
        </p>
      </div>
      <div className="section-center featured">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            onClick={() => handleCategoryClick(category)}
          >
            <img src={category.image || defaultImage} alt={category.name} />
            <h3>{category.name}</h3>
          </CategoryCard>
        ))}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  padding: 5rem 0;
  background: #f7f7f7;

  h2 {
    margin-bottom: 1rem;
  }
  .underline {
    margin: 0 auto;
    margin-bottom: 2rem;
  }
  .p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 1.5rem;

  }

  .section-center {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  
  @media (max-width: 768px) {

    .title{

    }
    h2 {
      font-size: 1.5rem; /* Adjust font size for mobile size */
    }

    .underline {
      margin-bottom: 1rem; /* Adjust margin for mobile size */
    }

    .p {
      font-size: 1rem; /* Adjust font size for mobile size */
      margin-bottom: 1rem; /* Adjust margin for mobile size */
    }
  }
`;

const CategoryCard = styled.div`
  background: white;
  border-radius: 0.25rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 80%; /* Adjust the width as needed */
    height: 200px; /* Maintain aspect ratio */
    margin: 1rem 0; /* Add margin to create space around the image */
    object-fit: cover;
  }


  h3 {
    margin: 1rem 0;
    font-size: 1.5rem;
    color: #333;
  }
`;

export default Categories;
