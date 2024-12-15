import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Button, Modal, Input, Form, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import {jwtDecode} from "jwt-decode";

const { Title, Text } = Typography;

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditUsernameModalVisible, setIsEditUsernameModalVisible] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true); // Loading cho toàn bộ trang
  const [isLoadingChangePassword, setIsLoadingChangePassword] = useState(false); // Loading cho nút đổi mật khẩu
  const [isLoadingManageAddresses, setIsLoadingManageAddresses] = useState(false); // Loading cho nút quản lý địa chỉ
  const [isLoadingEditUsername, setIsLoadingEditUsername] = useState(false); // Loading cho nút edit username
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editUsernameForm] = Form.useForm();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoadingPage(true); // Bật loading cho trang
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
    } finally {
      setIsLoadingPage(false); // Tắt loading cho trang
    }
  };

  const handlePasswordChange = async (values) => {
    setIsLoadingChangePassword(true);
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
    } finally {
      setIsLoadingChangePassword(false);
    }
  };

  const handleManageAddresses = () => {
    setIsLoadingManageAddresses(true);
    navigate("/address-manager");
    setTimeout(() => {
      setIsLoadingManageAddresses(false); // Reset trạng thái sau khi navigation hoàn thành
    }, 500); // Giả lập thời gian xử lý
  };

  const handleEditUsername = async (values) => {
    setIsLoadingEditUsername(true);
    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.id;

    try {
      await axios.patch(
        `https://kltn-server.vercel.app/api/v1/user/${userId}`,
        { username: values.username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Username updated successfully!");
      setIsEditUsernameModalVisible(false);
      fetchUserData(); // Refresh user data
      localStorage.setItem("username", values.username)
    } catch (err) {
      console.error("Error updating username:", err);
      message.error("Failed to update username. Please try again.");
    } finally {
      setIsLoadingEditUsername(false);
      editUsernameForm.resetFields();
    }
  };

  return (
    <>
      <Navbar />
      {isLoadingPage ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-4 mt-32 bg-white rounded-lg shadow">
          {/* User Information */}
          <Card className="mb-6">
            <Title level={4}>User Information</Title>
            <div className="flex items-center justify-between">
              <p>
                <Text strong>Username:</Text> {userData?.username}
              </p>
              <Button
                type="link"
                onClick={() => setIsEditUsernameModalVisible(true)}
              >
                Edit
              </Button>
            </div>
            <p>
              <Text strong>Email:</Text> {userData?.email}
            </p>
            <p>
              <Text strong>Role:</Text> {userData?.role}
            </p>
            <p>
              <Text strong>Account Status:</Text>{" "}
              {userData?.isActive ? "Active" : "Inactive"}
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
              onClick={handleManageAddresses}
              className="mt-4"
              loading={isLoadingManageAddresses}
            >
              Manage Addresses
            </Button>
          </Card>
        </div>
      )}

      {/* Modal for Changing Password */}
      <Modal
        title="Change Password"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handlePasswordChange}>
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
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={isLoadingChangePassword}
          >
            Change Password
          </Button>
        </Form>
      </Modal>

      {/* Modal for Editing Username */}
      <Modal
        title="Edit Username"
        visible={isEditUsernameModalVisible}
        onCancel={() => setIsEditUsernameModalVisible(false)}
        footer={null}
      >
        <Form form={editUsernameForm} layout="vertical" onFinish={handleEditUsername}>
          <Form.Item
            label="New Username"
            name="username"
            rules={[{ required: true, message: "Please enter your new username" }]}
          >
            <Input />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={isLoadingEditUsername}
          >
            Save Changes
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;
