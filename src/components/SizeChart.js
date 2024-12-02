import React from "react";
import { Table } from "antd";

const sizeChart = [
  { eur: "35", length: "211 ~ 219 mm" },
  { eur: "36", length: "220 ~ 228 mm" },
  { eur: "37", length: "229 ~ 233 mm" },
  { eur: "38", length: "234 ~ 238 mm" },
    { eur: "39", length: "244 ~ 248 mm" },
  { eur: "41", length: "249 ~ 258 mm" },
  { eur: "42", length: "259 ~ 263 mm" },
  { eur: "43", length: "264 ~ 268 mm" },
  { eur: "44", length: "269 ~ 278 mm" },
  { eur: "45", length: "279 ~ 288 mm" },
];

 const SizeChart = () => {
  // Tạo các cột (columns) với header động từ dữ liệu EUR
  const columns = sizeChart.map((item) => ({
    title: `${item.eur}`,
    dataIndex: item.eur,
    key: item.eur,
    align: "center",
  }));

  // Tổ chức lại dữ liệu cho bảng (chỉ có một hàng hiển thị chiều dài)
  const data = [
    sizeChart.reduce((acc, item) => {
      acc[item.eur] = item.length; // Thêm key là EUR, value là Foot Length
      return acc;
    }, {}),
  ];

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-lg font-bold mb-4">Size Chart</h3>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false} // Tắt phân trang
        bordered
        scroll={{
          x: "max-content"
        }
        }
        className="border border-gray-300 rounded-lg text-sm"
      />
    </div>
  );
};

export default SizeChart
