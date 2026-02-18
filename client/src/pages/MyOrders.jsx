import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

function MyOrders() {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency, axios, user } = useAppContext();

  // ✅ Fetch user orders
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:8000/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load orders automatically when user logs in
  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  // ✅ Manual refresh button
  const handleRefresh = () => {
    fetchMyOrders();
    toast.success("Orders refreshed!");
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
       <div className="md:p-10 p-4 space-y-4">
        <div className="flex justify-between items-center gap-4 w-full">
          <p className="text-2xl font-medium uppercase">My Orders</p>
        </div>
        <div className="w-16 h-0.5 bg-primary-dull rounded-full"></div>
      </div>

      {/* ✅ Loading state */}
      {loading && (
        <p className="text-gray-500 text-center py-10">Loading your orders...</p>
      )}

      {/* ✅ Empty state */}
      {!loading && myOrders.length === 0 && (
        <p className="text-gray-500 text-center py-10">
          You have no orders yet.
        </p>
      )}

      {/* ✅ Orders list */}
      {!loading &&
        myOrders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
          >
            <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
              <span>OrderId: {order._id}</span>
              <span>Payment: {order.paymentType}</span>
              <span>
                Total Amount: {currency}
                {order.amount}
              </span>
            </p>

            {order.items.map((item, i) => (
              <div
                key={i}
                className={`relative bg-white text-gray-500/70 ${
                  order.items.length !== i + 1 && "border-b"
                } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <img
                      src={item.product?.images?.[0] || ""}
                      alt={item.product?.name || "Product"}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-medium text-gray-800">
                      {item.product?.name || "Unnamed Product"}
                    </h2>
                    <p>Category: {item.product?.category || "N/A"}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                  <p>Quantity: {item.quantity || "1"}</p>
                  <p>Status: {order.status || "Processing"}</p>
                  <p>
                    Date:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <p className="text-primary-dull text-lg font-medium">
                  Amount: {currency}
                  {item.product?.offerPrice
                    ? item.product.offerPrice * item.quantity
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default MyOrders;
