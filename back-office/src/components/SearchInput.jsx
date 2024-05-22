import { Input } from "@material-tailwind/react";

export const SearchInput = () => {

    return (
  
      <div className="">
        <Input
          type="text"
          placeholder="search by name"
          className="!border !border-gray-300 bg-white text-gray-900  "
          labelProps={{
            className: "hidden",
          }}
          containerProps={{ className: "min-w-[100px]" }}
        />
      </div>
    );
  }