import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Input,
} from "@material-tailwind/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { z } from "zod";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import queryString from "query-string";
import { PaginationControls } from "@/components";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import TableRowLoader from "@/components/loaders/TableRowLoader";

const categorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export function Categories({ setFilter }) {
  const parsed = queryString.parse(location.search);

  const filters = useMemo(() => ({ ...parsed }), [parsed]);
  const { page, q: searchQuery } = filters;
  const navigate = useNavigate();
  const [totalCategories, setTotalCategories] = useState();

  const [Data, SetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [oldCategory, setOldCategory] = useState({});
  const [addCategoryName, setAddCategoryName] = useState("");
  const [addCategoryImage, setAddCategoryImage] = useState(null);
  const [addCategoryImageUrl, setAddCategoryImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoadind] = useState(false);
  const toggleForm = (category) => {
    setShowForm(!showForm);
    setOldCategory({
      name: category.name,
      id: category.id,
      imageUrl: category.imageUrl,
    });
    setErrorMsg("");
  };

  const toggleDelete = (category) => {
    setShowDeleteForm(!showDeleteForm);
    setOldCategory({ id: category.id });
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setAddCategoryName("");
    setAddCategoryImage(null);
    setAddCategoryImageUrl("");
    setErrorMsg("");
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file); // Ensure the field name is 'image'

    setUploading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setUploading(false);
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image: ", error);
      setUploading(false);
      return "";
    }
  };

  const confirmEdit = async (e) => {
    e.preventDefault();

    const validation = categorySchema.safeParse(oldCategory);
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    if (oldCategory.image) {
      const imageUrl = await handleImageUpload(oldCategory.image);
      oldCategory.imageUrl = imageUrl;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/categories/${oldCategory.id}`,
        oldCategory,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const updatedCategory = response.data;
      const updatedData = Data.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category,
      );

      SetData(updatedData);
      toast.success("Category updated successfully");

      setIsLoading(false);
    } catch (error) {
      console.log("error updating category: ", error);
      toast.error("Failed to update category");
      setIsLoading(false);
    }
    setShowForm(!showForm);

    setIsLoading(false);
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/categories/${oldCategory.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      SetData((prev) => prev.filter((ctg) => ctg.id !== oldCategory.id));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.log("error deleting category:", error);
      toast.error("Failed to delete category");
    }
    setShowDeleteForm(!showDeleteForm);
  };

  const AddCategory = async (e) => {
    e.preventDefault();

    const validationResult = categorySchema.safeParse({
      name: addCategoryName,
      imageUrl: addCategoryImageUrl,
    });
    if (!validationResult.success) {
      setErrorMsg(validationResult.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const imageUrl = await handleImageUpload(addCategoryImage);
      const response = await axios.post(
        "http://localhost:3000/api/categories/create",
        { name: addCategoryName, imageUrl: imageUrl },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const createdCtg = response.data;
      SetData((e) => [...e, createdCtg]);
      toast.success("Category added successfully");

      setIsLoading(false);
    } catch (error) {
      console.log("error adding category", error);
      toast.error("Failed to add category");
      setIsLoading(false);
    }
    setShowAddForm(!showAddForm);
    setAddCategoryName("");
    setAddCategoryImage(null);
    setAddCategoryImageUrl("");
    setIsLoading(false);
  };

  const fetchData = async (searchQuery, page = 1) => {
    setDataLoadind(true);
    try {
      let getCategories = await axios.get(
        `http://localhost:3000/api/categories/fetchPaginatedCategories?searchQuery=${searchQuery}&page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const { data, totalCategories } = getCategories.data.response;
      SetData(data);
      setFilteredData(data);
      setTotalCategories(totalCategories);

      setDataLoadind(false);
    } catch (error) {
      console.error("error fetching categories:", error);
      toast.error("Failed to fetch categories");
      // setDataLoadind(false)
    }
  };

  useEffect(() => {
    fetchData(searchQuery, page);
  }, [page, searchQuery]);

  const updateFilters = useCallback(
    debounce(({ target }) => {
      setFilter(target.name, target.value);
    }, 300),
    [setFilter],
  );

  const handleSearchInputChange = (e) => {
    updateFilters(e);
  };

  const handleImageChange = (e, setImage, setImageUrl) => {
    const file = e.target.files[0];
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col gap-12 mt-12 mb-8">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="flex items-center justify-between p-6 mb-8 space-x-4 overflow-auto"
        >
          <Typography
            variant="h6"
            color="white"
            ripple="light"
            className="flex items-center"
          >
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleAddForm}
            >
              <PlusCircleIcon className="w-8 h-8 text-gray-200" />
              <span className="text-lg text-gray-200">Add Category</span>
            </div>
          </Typography>

          <Typography className="flex items-center space-x-4">
            <Input
              type="text"
              name="q"
              placeholder="Search by name"
              className="!border !border-gray-300 bg-white text-gray-900 shadow-lg ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{ className: "hidden" }}
              containerProps={{ className: "min-w-[200px]" }}
              onChange={handleSearchInputChange}
            />
          </Typography>
        </CardHeader>

        <CardBody className="p-6">
          <div className="flex flex-col gap-4">
            {dataLoading ? (
              <>
                <TableRowLoader />
                <TableRowLoader />
                <TableRowLoader />
              </>
            ) : (
              Data.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border-b border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={category.imageUrl}
                      alt={category.name}
                      size="sm"
                      variant="rounded"
                    />
                    <Typography variant="h6" className="text-gray-800">
                      {category.name}
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-4">
                    <PencilSquareIcon
                      className="w-6 h-6 text-gray-800 cursor-pointer"
                      onClick={() => toggleForm(category)}
                    />
                    <TrashIcon
                      className="w-6 h-6 text-red-900 cursor-pointer"
                      onClick={() => toggleDelete(category)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      <PaginationControls
        navigate={navigate}
        totalItems={totalCategories}
        currentPage={page}
      />

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl">Edit Category</h2>
            <form onSubmit={confirmEdit}>
              <div className="mb-4">
                <label className="block text-gray-700">Category Name</label>
                <input
                  type="text"
                  value={oldCategory.name}
                  onChange={(e) =>
                    setOldCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(
                      e,
                      (file) =>
                        setOldCategory((prev) => ({
                          ...prev,
                          image: file,
                        })),
                      (url) =>
                        setOldCategory((prev) => ({
                          ...prev,
                          imageUrl: url,
                        })),
                    )
                  }
                />
                {oldCategory.imageUrl && (
                  <img
                    src={oldCategory.imageUrl}
                    alt={oldCategory.name}
                    className="h-40 max-w-full mt-2 rounded-lg"
                  />
                )}
              </div>
              {errorMsg && <div className="text-red-500">{errorMsg}</div>}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg focus:outline-none hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
                >
                  Update {loading ? <ButtonLoader /> : null}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl">Confirm Deletion</h2>
            <form onSubmit={confirmDelete}>
              <p className="text-gray-700">
                Are you sure you want to delete this category?
              </p>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteForm(!showDeleteForm)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg focus:outline-none hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-red-500 rounded-lg focus:outline-none hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl">Add New Category</h2>
            <form onSubmit={AddCategory}>
              <div className="mb-4">
                <label className="block text-gray-700">Category Name</label>
                <input
                  type="text"
                  value={addCategoryName}
                  onChange={(e) => setAddCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(
                      e,
                      setAddCategoryImage,
                      setAddCategoryImageUrl,
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-500"
                />
                {addCategoryImageUrl && (
                  <img
                    src={addCategoryImageUrl}
                    alt="Category Preview"
                    className="h-40 max-w-full mt-2 rounded-lg"
                  />
                )}
              </div>
              {errorMsg && <div className="text-red-500">{errorMsg}</div>}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg focus:outline-none hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
                >
                  Add {loading ? <ButtonLoader /> : null}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
