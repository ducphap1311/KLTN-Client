import React, { useEffect, useState } from "react";
import { Card, List, Typography, Tag, Input, message as antMessage, Tooltip } from "antd";
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
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://kltn-server.vercel.app/api/v1/blogs");
      setBlogs(response.data.data);
      setFilteredBlogs(response.data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      antMessage.error("Failed to fetch blogs.");
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = blogs.filter((blog) =>
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
    <div className="min-h-screen bg-gray-100 dark:bg-[#1b2635] pt-20">
      <div className="container mx-auto max-w-[1100px] px-6 py-20">
        <Title level={2} className="text-center text-gray-900 dark:text-gray-200">
          {/* Blogs */}
        </Title>
        <Search
          placeholder="Search blogs by title or tags"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="mb-6 w-full max-w-md mx-auto"
        />

        <List
          grid={{ gutter: 50, column: 2 }}
          dataSource={filteredBlogs}
          renderItem={(blog) => (
            <List.Item>
              <Card
                hoverable
                cover={<img alt={blog.title} src={blog.image || "/placeholder.jpg"} />}
                // onClick={() => navigate(`/blogs/${blog._id}`)}
              >
                <Title level={4}>{blog.title}</Title>
                <Tooltip title={blog.content}>
                <p className="truncate">{blog.content.slice(0, 100)}...</p>

                </Tooltip>
                <div className="mt-2">
                  {blog.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">By {blog.author}</p>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
    <Footer />
    </div>

  );
};

export default ClientBlog;
