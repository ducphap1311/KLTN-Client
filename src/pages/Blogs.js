import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Typography,
  Tag,
  Input,
  message as antMessage,
  Tooltip,
  Spin,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const { Title } = Typography;
const { Search } = Input;

const ClientBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://kltn-server.vercel.app/api/v1/blogs");
      setBlogs(response.data.data);
      setFilteredBlogs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      antMessage.error("Failed to fetch blogs.");
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(value.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredBlogs(filtered);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-[#1b2635] md:pt-20 pt-12">
        <div className="container mx-auto max-w-[1100px] px-6 py-20">
          <Title
            level={2}
            className="text-center text-gray-900 dark:text-gray-200 mb-8"
          >
            Latest Blogs
          </Title>

          <Search
            placeholder="Search blogs by title or tags"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="mb-6 w-full max-w-md mx-auto"
            allowClear
          />

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Spin size="large" tip="Loading blogs..." />
            </div>
          ) : (
            <List
              grid={{
                gutter: 40,
                xs: 1, // Responsive: 1 column on small screens
                sm: 2, // 2 columns on medium screens
                md: 2,
                lg: 2, // 2 columns on larger screens
                xl: 2
              }}
              dataSource={filteredBlogs}
              renderItem={(blog) => (
                <List.Item>
                  <Tooltip title={blog.content}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={blog.title}
                        src={blog.image || "/placeholder.jpg"}
                        className="rounded-t-md h-[200px] object-cover"
                      />
                    }
                    className="rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    <Title level={4} className="text-gray-800 dark:text-gray-100">
                      {blog.title}
                    </Title>
                      <p className="truncate text-gray-600 dark:text-gray-300">
                        {blog.content.slice(0, 100)}...
                      </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <Tag key={tag} color="blue">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      By {blog.author}
                    </p>
                  </Card>
                      </Tooltip>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientBlog;
