import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Button, Modal, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";

const { Title, Text } = Typography;

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.post(
        "https://kltn-server.vercel.app/api/v1/get-user",
        { email: localStorage.getItem("email") },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = res.data.user;
      setUserData(user);

      // Tìm địa chỉ mặc định
      const defaultAddr = user.addresses.find((addr) => addr.isDefault);
      setDefaultAddress(defaultAddr || null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      message.error("Failed to load user data.");
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      await axios.post(
        "https://kltn-server.vercel.app/api/v1/change-password",
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Password changed successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error("Error changing password:", err);
      message.error("Failed to change password. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 mt-32 bg-white rounded-lg shadow">
        {userData ? (
          <>
            {/* User Information */}
            <Card className="mb-6">
              <Title level={4}>User Information</Title>
              <p>
                <Text strong>Username:</Text> {userData.username}
              </p>
              <p>
                <Text strong>Email:</Text> {userData.email}
              </p>
              <p>
                <Text strong>Role:</Text> {userData.role}
              </p>
              <p>
                <Text strong>Account Status:</Text>{" "}
                {userData.isActive ? "Active" : "Inactive"}
              </p>
              <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                className="mt-4"
              >
                Change Password
              </Button>
            </Card>

            {/* Default Address */}
            <Card className="mb-6">
              <Title level={4}>Default Address</Title>
              {defaultAddress ? (
                <>
                  <p>
                    <Text strong>Full Name:</Text> {defaultAddress.fullName}
                  </p>
                  <p>
                    <Text strong>Phone:</Text> {defaultAddress.phone}
                  </p>
                  <p>
                    <Text strong>Address:</Text> {defaultAddress.address}
                  </p>
                </>
              ) : (
                <p>No default address available.</p>
              )}
              <Button
                type="primary"
                onClick={() => navigate("/address-manager")}
                className="mt-4"
              >
                Manage Addresses
              </Button>
            </Card>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      {/* Modal for Changing Password */}
      <Modal
        title="Change Password"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: "Please enter your new password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Change Password
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;
