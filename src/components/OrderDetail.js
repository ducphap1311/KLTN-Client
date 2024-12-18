import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Modal, Button, message, Input, Form } from "antd";
import { Loading } from "./Loading";
import { Select } from "antd";

const {Option } = Select

export const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal Cancel
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Modal Edit
  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [form] = Form.useForm(); // Ant Design Form
    const [citiesList, setCitiesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);

  useEffect(() => {
    getSingleOrder();
    fetchCities();
  }, []);

  const getSingleOrder = async () => {
    try {
      const response = await fetch(`https://kltn-server.vercel.app/api/v1/orders/${id}`);
      if (!response.ok) {
        throw new Error("Invalid order id");
      }
      const responseData = await response.json();
      const data = responseData.order;
      setOrder(data);
    } catch (error) {
      setOrder();
    }
  };

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const handleConfirmCancel = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://kltn-server.vercel.app/api/v1/orders/${selectedOrderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Cancelled" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      message.success("Order has been cancelled successfully");
      setOrder({ ...order, status: "Cancelled" });
    } catch (error) {
      console.error("Error cancelling order:", error);
      message.error("Failed to cancel the order. Please try again.");
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };
  const fetchCities = async () => {
    try {
      const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
      const responseData = await response.json();
      setCitiesList(responseData);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCityChange = (value) => {
    const selectedCity = citiesList.find((city) => city.name === value);
    setDistrictsList(selectedCity?.districts || []);
    setWardsList([]);
    form.setFieldsValue({ city: value, district: null, ward: null });
  };

  const handleDistrictChange = (value) => {
    const selectedDistrict = districtsList.find((district) => district.name === value);
    setWardsList(selectedDistrict?.wards || []);
    form.setFieldsValue({ district: value, ward: null });
  };

  const handleWardChange = (value) => {
    form.setFieldsValue({ ward: value });
  };
  
  const handleEditClick = (orderId) => {
    setSelectedOrderId(orderId);
    const [addressDetail, ward, district, city] = order.address.split(", ").map((item) => item.trim());
    form.setFieldsValue({
      address: addressDetail,
      phone: order.phone,
      city,
      district,
      ward,
    });
    setDistrictsList(citiesList.find((c) => c.name === city)?.districts || []);
    setWardsList(districtsList.find((d) => d.name === district)?.wards || []);
    setIsEditModalVisible(true);
  };

   const handleConfirmEdit = async () => {
    try {
      const values = await form.validateFields();
      const fullAddress = `${values.address}, ${values.ward}, ${values.district}, ${values.city}`;
      setLoading(true);

      const response = await fetch(
        `https://kltn-server.vercel.app/api/v1/orders/${selectedOrderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: fullAddress,
            phone: values.phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      message.success("Order has been updated successfully");
      setOrder({ ...order, address: fullAddress, phone: values.phone });
    } catch (error) {
      console.error("Error updating order:", error);
      message.error("Failed to update the order. Please try again.");
    } finally {
      setLoading(false);
      setIsEditModalVisible(false);
    }
  };

  if (!order) {
    return <Loading />;
  }

  const date = new Date(order.createdAt);
  const formattedTime = `${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })} - ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })}`;

  const generalInfoColumns = [
    {
      title: "Info Type",
      dataIndex: "infoType",
      key: "infoType",
      render: (text) => (
        <span className="font-medium text-gray-700">{text}</span>
      ),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
  ];

  const generalInfoData = [
    {
      key: "1",
      infoType: "Name",
      details: order.name,
    },
    {
      key: "7",
      infoType: "Phone number",
      details: order.phone,
    },
    {
      key: "2",
      infoType: "Address",
      details: order.address,
    },
    {
      key: "3",
      infoType: "Date",
      details: formattedTime,
    },
    {
      key: "5",
      infoType: "Shipping status",
      details:
        order.status === "Pending" ? (
          <div>
            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
              Pending
            </span>
            <Button
              type="link"
              className="text-red-500 ml-2"
              onClick={() => handleCancelClick(order._id)}
            >
              Cancel
            </Button>
            <Button
              type="link"
              className="text-blue-500 ml-2"
              onClick={() => handleEditClick(order._id)}
            >
              Edit
            </Button>
          </div>
        ) : (
          <span
            className={`px-2 py-1 rounded ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status}{" "}
            {order.status === "Shipping" &&  <span className="text-gray-700 bg-white px-2 py-1 rounded">
              The order has been handed over to the shipping partner. You can
              track the status at{" "}
              <a
                href={`https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                this link
              </a>{" "}
              with the tracking code:{" "}
              <strong className="text-gray-800">{order.trackingCode}</strong>
            </span>}
           
          </span>
        ),
    },
    {
      key: "6",
      infoType: "Payment status",
      details: (
        <span
          className={`px-2 py-1 rounded ${
            order.isPaid
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.isPaid ? <>Paid</> : <>Unpaid</>}
        </span>
      ),
    },
  ];

  const productColumns = [
    {
      title: "Products",
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center space-x-4">
          <Link to={`/products/${record._id}`}>
            <img
              src={record.image}
              alt={record.name}
              className="w-16 h-16 object-cover rounded-md"
            />
          </Link>
          <Link
            to={`/products/${record._id}`}
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            {record.name}
          </Link>
        </div>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (text) => (
        <span className="capitalize text-gray-600">{text}</span>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
      render: (size) => <span className="text-gray-700">{size}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`,
      align: "right",
    },
  ];

  const productData = order.cartItems.map((item) => ({
    key: item._id,
    ...item,
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px] md:mt-24 mt-16">
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Your Order Information
          </h2>
          <Link to="/orders" className="text-blue-600 hover:underline text-sm">
            Back to orders
          </Link>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            General Information
          </h3>
          <Table
            dataSource={generalInfoData}
            columns={generalInfoColumns}
            pagination={false}
            bordered
            className="mb-6"
          />
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Products</h3>
          <Table
            dataSource={productData}
            columns={productColumns}
            pagination={false}
            scroll={{ x: "1000px" }}
          />
        </div>
      </div>
      <Modal
        title="Confirm Cancel Order"
        visible={isModalVisible}
        onOk={handleConfirmCancel}
        confirmLoading={loading}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes, Cancel Order"
        cancelText="No"
      >
        <p>Are you sure you want to cancel this order?</p>
      </Modal>
      <Modal
        title="Edit Order"
        visible={isEditModalVisible}
        onOk={handleConfirmEdit}
        confirmLoading={loading}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Save Changes"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
            <Form.Item label="Detailed Address" name="address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="City" name="city" rules={[{ required: true }]}>
              <Select onChange={handleCityChange}>
                {citiesList.map((city) => (
                  <Option key={city.code} value={city.name}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="District" name="district" rules={[{ required: true }]}>
              <Select onChange={handleDistrictChange} disabled={!districtsList.length}>
                {districtsList.map((district) => (
                  <Option key={district.code} value={district.name}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Ward" name="ward" rules={[{ required: true }]}>
              <Select onChange={handleWardChange} disabled={!wardsList.length}>
                {wardsList.map((ward) => (
                  <Option key={ward.code} value={ward.name}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>

      </Modal>
    </div>
  );
};
