import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { List, Card, Button, Modal, Input, Form, Select, message, Spin } from "antd";
import { Navbar } from "./Navbar";

const { Option } = Select;

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); 
  const [citiesList, setCitiesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken?.id;
  const [addLoading, setAddLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [defaultLoading, setDefaultLoading] = useState(false)
  useEffect(() => {
    if (userId) {
      fetchAddresses();
      getCitiesInformations();
    }
  }, [userId]);

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`https://kltn-server.vercel.app/api/v1/users/${userId}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses);
      setLoading(false)
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setLoading(false)
      message.error("Failed to fetch addresses.");
    }
  };

  const getCitiesInformations = async () => {
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
    form.setFieldsValue({ city: value, district: "", ward: "" });
  };

  const handleDistrictChange = (value) => {
    const selectedDistrict = districtsList.find((district) => district.name === value);
    setWardsList(selectedDistrict?.wards || []);
    form.setFieldsValue({ district: value, ward: "" });
  };

  const handleWardChange = (value) => {
    form.setFieldsValue({ ward: value });
  };

  const handleSaveAddress = async (values) => {
    setAddLoading(true)
    const fullAddress = `${values.address}, ${values.ward}, ${values.district}, ${values.city}`;
    const payload = {
      fullName: values.fullName,
      phone: values.phone,
      address: fullAddress,
    };

    try {
      if (editingAddress) {
        await axios.put(
          `https://kltn-server.vercel.app/api/v1/users/${userId}/addresses/${editingAddress._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Address updated successfully!");
      } else {
        await axios.post(`https://kltn-server.vercel.app/api/v1/users/${userId}/addresses`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Address added successfully!");
      }
      fetchAddresses();
      setIsModalVisible(false);
      setEditingAddress(null);
      form.resetFields();
      setAddLoading(false)
    } catch (err) {
      console.error("Error saving address:", err);
      setAddLoading(false)
      message.error("Failed to save address.");
    }
  };

  const handleSetDefault = async (addressId) => {
    setDefaultLoading(true)
    try {
      await axios.put(
        `https://kltn-server.vercel.app/api/v1/users/${userId}/addresses/${addressId}/set-default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Default address updated!");
      fetchAddresses();
      setDefaultLoading(false)
    } catch (err) {
      console.error("Error setting default address:", err);
      setDefaultLoading(false)
      message.error("Failed to set default address.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    setDeleteLoading(true)
    try {
      await axios.delete(`https://kltn-server.vercel.app/api/v1/users/${userId}/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Address deleted successfully!");
      fetchAddresses();
      setDeleteLoading(false)
    } catch (err) {
      console.error("Error deleting address:", err);
      setDeleteLoading(false)
      message.error("Failed to delete address.");
    }
  };

 const showModal = (address) => {
  setEditingAddress(address);
  setIsModalVisible(true);

  if (address) {
    const [addressDetail, ward, district, city] = address.address
      .split(", ")
      .map((item) => item.trim());
    
    // Đặt giá trị vào form
    form.setFieldsValue({
      fullName: address.fullName,
      phone: address.phone,
      address: addressDetail,
      ward,
      district,
      city,
    });

    // Tìm danh sách districts từ city
    const selectedCity = citiesList.find((c) => c.name === city);
    setDistrictsList(selectedCity?.districts || []);

    // Tìm danh sách wards từ district
    const selectedDistrict = selectedCity?.districts.find((d) => d.name === district);
    setWardsList(selectedDistrict?.wards || []);
  } else {
    form.resetFields();
    setDistrictsList([]);
    setWardsList([]);
  }
};

  return (
    <>
    <Navbar />
    {loading ? (
        // Hiển thị hiệu ứng loading khi toàn bộ trang đang tải
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ): 
    <div className="max-w-5xl mx-auto mt-32 p-4 bg-white rounded-lg shadow">
      
      <h2 className="text-xl font-semibold mb-4">Manage Addresses</h2>

      <List
        grid={{
                gutter: 40,
                xs: 1, // Responsive: 1 column on small screens
                sm: 2, // 2 columns on medium screens
                md: 2,
                lg: 2, // 2 columns on larger screens
                xl: 3
              }}
        dataSource={addresses}
        renderItem={(address) => (
          <List.Item>
            <Card
              title={address.fullName}
              extra={<Button type="link" onClick={() => showModal(address)}>Edit</Button>}
              className={`${address.isDefault ? "border-green-500" : "border-gray-500"} border`}
            >
              <p>Phone: {address.phone}</p>
              <p>Address: {address.address}</p>
              <div className="mt-2 flex justify-between">
                {!address.isDefault && (
                  <Button type="primary" onClick={() => handleSetDefault(address._id)}>Set Default</Button>
                )}
                {address.isDefault && <p className="text-green-500 font-semibold">Default Address</p>}
                <Button danger onClick={() => handleDeleteAddress(address._id)} >Delete</Button>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Button
        type="primary"
        className="mt-6"
        onClick={() => showModal(null)}
      >
        Add New Address
      </Button>

      <Modal
        title={editingAddress ? "Edit Address" : "Add Address"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveAddress}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter your phone number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address Detail"
            name="address"
            rules={[{ required: true, message: "Please enter your address detail" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please select your city" }]}
          >
            <Select onChange={handleCityChange}>
              {citiesList.map((city) => (
                <Option key={city.code} value={city.name}>{city.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="District"
            name="district"
            rules={[{ required: true, message: "Please select your district" }]}
          >
            <Select onChange={handleDistrictChange} disabled={!districtsList.length}>
              {districtsList.map((district) => (
                <Option key={district.code} value={district.name}>{district.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ward"
            name="ward"
            rules={[{ required: true, message: "Please select your ward" }]}
          >
            <Select onChange={handleWardChange} disabled={!wardsList.length}>
              {wardsList.map((ward) => (
                <Option key={ward.code} value={ward.name}>{ward.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={addLoading}>
            {editingAddress ? "Save Changes" : "Add Address"}
          </Button>
        </Form>
      </Modal>
    </div>
}
    </>
  );
};

export default AddressManager;
