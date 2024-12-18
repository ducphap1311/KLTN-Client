import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { List, Card, Button, Modal, Input, Form, Select, message, Tooltip } from "antd";
import { Skeleton } from "antd"; 

const { Option } = Select;

const AddressCheckout = ({
  handleOrder,
  addresses,
  setAddresses,
  buttonLoading,
  selectedPayment
}) => {
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [citiesList, setCitiesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true); 
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken?.id;
  const [editLoading, setEditLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  useEffect(() => {
    if (userId) {
      fetchAddresses();
      getCitiesInformations();
    }
  }, [userId]);

  const fetchAddresses = async () => {
    setIsLoading(true); // Bắt đầu tải
    try {
      const res = await axios.get(
        `https://kltn-server.vercel.app/api/v1/users/${userId}/addresses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses(res.data.addresses.filter((address) => address.isDefault));
      setIsLoading(false); // Kết thúc tải
    } catch (err) {
      console.error("Error fetching addresses:", err);
      message.error("Failed to fetch addresses.");
      setIsLoading(false); // Kết thúc tải
    }
  };

  const getCitiesInformations = async () => {
    try {
      const response = await fetch(
        "https://provinces.open-api.vn/api/?depth=3"
      );
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
    const selectedDistrict = districtsList.find(
      (district) => district.name === value
    );
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
        await axios.post(
          `https://kltn-server.vercel.app/api/v1/users/${userId}/addresses`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success("Address added successfully!");
      }
      fetchAddresses();
      setIsModalVisible(false);
      setEditingAddress(null);
      form.resetFields();
      setAddLoading(false)
    } catch (err) {
      console.error("Error saving address:", err);
      message.error("Failed to save address.");
      setAddLoading(false)
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

    // Tìm danh sách districts và wards từ city và district
    const selectedCity = citiesList.find((c) => c.name === city);
    const selectedDistrict = selectedCity?.districts.find((d) => d.name === district);

    setDistrictsList(selectedCity?.districts || []);
    setWardsList(selectedDistrict?.wards || []);
  } else {
    form.resetFields();
    setDistrictsList([]);
    setWardsList([]);
  }
};


  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      {isLoading ? (
        // Hiển thị Skeleton khi đang tải dữ liệu
        <Skeleton active title={false} paragraph={{ rows: 4 }} />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={addresses}
          renderItem={(address) => (
            <List.Item>
              <Card
                title={address.fullName}
                extra={
                  <Button type="link" onClick={() => showModal(address)}>
                    Edit
                  </Button>
                }
                className={`${address.isDefault ? "border-blue-500" : ""} border`}
              >
                <p className="text-base">
                  <span className="font-semibold">Phone</span> {address.phone}
                </p>
                <p className="text-base">
                  <span className="font-semibold">Address</span>:{" "}
                  {address.address}
                </p>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Button type="primary" className={`mt-6 ${addresses[0]?.address ? "hidden": ""}`} onClick={() => showModal(null)}>
        Add New Address
      </Button>
      <Tooltip title={addresses[0]?.address ? "" : "You have to add address to continues"}>
        <Button
          className="w-full bg-blue-500 text-white py-5 text-base mt-3"
          type="submit"
          disabled={selectedPayment === "paypal" ? true: false}
          loading={buttonLoading}
          onClick={() => handleOrder({
            name: addresses[0]?.fullName,
            address: addresses[0]?.address,
            phone: addresses[0]?.phone,
            isPaid: false,
          })}
        >
          Place Your Order
        </Button>
      </Tooltip>
      <Modal
        title={editingAddress ? "Edit Address" : "Add Address"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveAddress}>
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
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address Detail"
            name="address"
            rules={[
              { required: true, message: "Please enter your address detail" },
            ]}
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
                <Option key={city.code} value={city.name}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="District"
            name="district"
            rules={[{ required: true, message: "Please select your district" }]}
          >
            <Select
              onChange={handleDistrictChange}
              disabled={!districtsList.length}
            >
              {districtsList.map((district) => (
                <Option key={district.code} value={district.name}>
                  {district.name}
                </Option>
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
                <Option key={ward.code} value={ward.name}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={addLoading}>
            {editingAddress ? "Save Changes" : "Add Address"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressCheckout;
