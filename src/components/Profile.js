import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Spin, Select } from "antd";

const { Option } = Select;

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Loading cho form
  const [fetching, setFetching] = useState(true); // Loading khi lấy dữ liệu
  const [userData, setUserData] = useState(null); // Dữ liệu người dùng

  // Dữ liệu cho City, District, Ward
  const [citiesList, setCitiesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        // Lấy dữ liệu profile từ server
        const profileResponse = await fetch("/api/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!profileResponse.ok) throw new Error("Failed to fetch profile data");
        const profileData = await profileResponse.json();

        setUserData(profileData);
        form.setFieldsValue(profileData); // Đổ dữ liệu vào form

        // Lấy danh sách cities
        const citiesResponse = await fetch("https://example.com/api/cities");
        if (!citiesResponse.ok) throw new Error("Failed to fetch cities data");
        const citiesData = await citiesResponse.json();
        setCitiesList(citiesData);

        // Tự động cập nhật districts và wards nếu có giá trị mặc định
        const defaultCity = citiesData.find((city) => city.name === profileData.city);
        setDistrictsList(defaultCity?.districts || []);

        const defaultDistrict = defaultCity?.districts.find(
          (district) => district.name === profileData.district
        );
        setWardsList(defaultDistrict?.wards || []);
      } catch (error) {
        message.error("Failed to load data.");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [form]);

  // Handle city change
  const handleCityChange = (value) => {
    const selectedCity = citiesList.find((city) => city.name === value);
    setDistrictsList(selectedCity?.districts || []);
    setWardsList([]);
    form.setFieldsValue({ city: value, district: "", ward: "" });
  };

  // Handle district change
  const handleDistrictChange = (value) => {
    const selectedDistrict = districtsList.find(
      (district) => district.name === value
    );
    setWardsList(selectedDistrict?.wards || []);
    form.setFieldsValue({ district: value, ward: "" });
  };

  // Handle ward change
  const handleWardChange = (value) => {
    form.setFieldsValue({ ward: value });
  };

  // Handle form submission
  const handleSave = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to update profile.");
      message.success("Profile updated successfully!");
    } catch (error) {
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl shadow-md bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={userData}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                pattern: /^(\+84|0)\d{9,10}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Select
              placeholder="Select your city"
              onChange={handleCityChange}
              allowClear
            >
              {citiesList.map((city) => (
                <Option key={city.name} value={city.name}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="district"
            label="District"
            rules={[{ required: districtsList.length > 0 }]}
          >
            <Select
              placeholder="Select your district"
              onChange={handleDistrictChange}
              allowClear
              disabled={districtsList.length === 0}
            >
              {districtsList.map((district) => (
                <Option key={district.name} value={district.name}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ward"
            label="Ward"
            rules={[{ required: wardsList.length > 0 }]}
          >
            <Select
              placeholder="Select your ward"
              onChange={handleWardChange}
              allowClear
              disabled={wardsList.length === 0}
            >
              {wardsList.map((ward) => (
                <Option key={ward.name} value={ward.name}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="addressDetail" label="Address">
            <Input placeholder="Enter your detailed address" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
