import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function PaginationControls({ currentPage = 1, totalProducts }) {
  const navigate = useNavigate();
  const totalPages = Math.ceil(totalProducts / 6);

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
        console.log('params', newUrl)


    navigate(newUrl);
  };
 
  if(totalPages <= 1){
    return null;
  }

  return (
    <>
      <ButtonWrapper>
        <PaginationButton 
          disabled={isFirstPage}
          onClick={() => paginate(prevPage)}
          className="float-left"
        >
          Previous
        </PaginationButton>

        <PaginationButton
          disabled={isLastPage}
          onClick={() => paginate(nextPage)}
          className="float-right"
        >
          Next &gt;
        </PaginationButton>
      </ButtonWrapper>
    </>
  );
}

export default PaginationControls;

const ButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  display: inline-block;
  padding: 0.5rem 1rem;
  font-weight: 600;
  background-color: ${props => props.disabled ? '#e0e0e0' : 'white'};
  color: ${props => props.disabled ? '#9e9e9e' : '#374151'};
  border: 1px solid ${props => props.disabled ? '#bdbdbd' : '#d1d5db'};
  border-radius: 0.25rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.disabled ? '#e0e0e0' : '#f3f4f6'};
  }

  &.float-left {
    float: left;
    margin-right: 0.5rem;
  }

  &.float-right {
    float: right;
    margin-left: 0.5rem;
  }
`;

const PaginationButton = ({ disabled, onClick, children }) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
