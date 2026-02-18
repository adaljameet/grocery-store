// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";
import toast from "react-hot-toast";

function Orders() {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Error handling helper
  const getErrorMessage = (error) => {
    if (error?.response) {
      return `Server ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
    }
    if (error?.request) {
      return "No response received — network, CORS, or server is down.";
    }
    return error?.message || "Unknown error";
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:8000/api/order/seller");
      if (data?.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data?.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Delete all orders
  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL orders?")) return;
    try {
      setDeleting(true);
      const { data } = await axios.delete("http://localhost:8000/api/order");
      if (data?.success) {
        toast.success("All orders deleted successfully!");
        setOrders([]);
      } else {
        toast.error(data?.message || "Failed to delete all orders");
      }
    } catch (error) {
      console.error("Error deleting all orders:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <h2 className="text-lg font-medium">Orders List</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteAll}
              disabled={deleting || orders.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete All"}
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500 text-center py-10">Loading orders...</p>}
        {!loading && orders.length === 0 && <p className="text-gray-500 text-center py-10">No orders found.</p>}

        {orders.map((order, index) => (
          <div
            key={order._id || index}
            className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300 relative"
          >
            {/* Product Info */}
            <div className="flex gap-5 max-w-80">
              <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="Order Icon" />
              <div>
                {order.items?.map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <p className="font-medium">
                      {item.product?.name || "Unnamed Product"}{" "}
                      <span className="text-primary">x {item.quantity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="text-sm md:text-base text-black/60">
              <p className="text-black/80">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <p>
                {order.address?.street}, {order.address?.city}
              </p>
              <p>
                {order.address?.state}, {order.address?.zipcode}, {order.address?.country}
              </p>
              <p>{order.address?.phone}</p>
            </div>

            {/* Amount */}
            <p className="font-medium text-lg my-auto">
              {currency}
              {order.amount}
            </p>

            {/* Payment Info */}
            <div className="flex flex-col text-sm md:text-base text-black/60">
              <p>Method: {order.paymentType || "N/A"}</p>
              <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
              <p>
                Payment:{" "}
                <span
                  className={`font-semibold ${
                    order.isPaid === true ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {order.isPaid === true ? "Paid" : "Pending"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
