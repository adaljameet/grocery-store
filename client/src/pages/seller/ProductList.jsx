import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

function ProductList() {
  const { products, currency, axios, fetchProducts } = useAppContext();
  const [editState, setEditState] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    category: "",
    offerPrice: "",
    quantity: "",
    image: "",
  });

  // ---------- Delete Product Handler ----------
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`http://localhost:8000/api/product/${id}`);
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting product");
    }
  };

  // ---------- Update Product Modal Handlers ----------
  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setUpdateForm({
      name: product.name,
      category: product.category,
      offerPrice: product.offerPrice,
      quantity: product.quantity,
      image: product.images[0] || "",
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setUpdateForm((prev) => ({ ...prev, image: file }));
  };

  const handleSubmitUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("id", selectedProduct._id);
      formData.append("name", updateForm.name);
      formData.append("category", updateForm.category);
      formData.append("offerPrice", updateForm.offerPrice);
      formData.append("quantity", updateForm.quantity);
      if (updateForm.image instanceof File) {
        formData.append("image", updateForm.image);
      }

      const { data } = await axios.put("http://localhost:8000/api/product/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Product updated successfully!");
        setShowModal(false);
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (err) {
      toast.error(err.message || "Error updating product");
    }
  };

  // ---------- Render ----------
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>

        <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                <th className="px-4 py-3 font-semibold truncate">Quantity</th>
                <th className="px-4 py-3 font-semibold truncate text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => {
                const state = editState[product._id] || {
                  value: product.quantity,
                  editing: false,
                };

                return (
                  <tr key={product._id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded overflow-hidden">
                        <img src={product.images[0]} alt="Product" className="w-16" />
                      </div>
                      <span className="truncate max-sm:hidden w-full">{product.name}</span>
                    </td>

                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {currency}
                      {product.offerPrice}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={state.value}               
                          className="w-20 px-2 py-1 border border-gray-400 rounded outline-none text-center"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => openUpdateModal(product)}
                        className="px-3 py-1 bg-primary-dull text-white rounded cursor-pointer"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Update Product Modal ---------- */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Update Product</h3>

            <label className="block mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={updateForm.name}
              onChange={handleFormChange}
              className="w-full mb-3 border px-3 py-2 rounded"
            />

            <label className="block mb-2 text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={updateForm.category}
              onChange={handleFormChange}
              className="w-full mb-3 border px-3 py-2 rounded"
            />

            <label className="block mb-2 text-sm font-medium">Price</label>
            <input
              type="number"
              name="offerPrice"
              value={updateForm.offerPrice}
              onChange={handleFormChange}
              className="w-full mb-3 border px-3 py-2 rounded"
            />

            <label className="block mb-2 text-sm font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={updateForm.quantity}
              onChange={handleFormChange}
              className="w-full mb-3 border px-3 py-2 rounded"
            />

            <label className="block mb-2 text-sm font-medium">Product Image</label>
            <input type="file" onChange={handleImageChange} className="w-full mb-3" />
            {updateForm.image && !(updateForm.image instanceof File) && (
              <img src={updateForm.image} alt="preview" className="w-24 rounded mb-3" />
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdate}
                className="px-4 py-2 bg-primary-dull text-white rounded cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
