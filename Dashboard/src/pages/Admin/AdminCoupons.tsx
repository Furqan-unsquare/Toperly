import React, { useEffect, useState } from "react";
import axios from "axios";

interface Course {
  _id: string;
  title: string;
}

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number | string;
  course: Course | null;
  expiryDate: string;
  usageLimit: number | string;
  usedCount: number;
}

const AdminCoupons = () => {
  const [courses, setCourses] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    course: "",
    expiryDate: "",
    usageLimit: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const fetchCourses = async () => {
    const res = await axios.get("http://192.168.1.29:5000/api/courses");
    setCourses(res.data);
  };

  const fetchCoupons = async () => {
    const res = await axios.get("http://192.168.1.29:5000/api/coupons");
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCourses();
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`http://192.168.1.29:5000/api/coupons/${editingId}`, {
          ...form,
          course: form.course === "all" ? null : form.course,
        });
        setNotification({
          message: "Coupon updated successfully!",
          type: "success",
        });
      } else {
        await axios.post("http://192.168.1.29:5000/api/coupons", {
          ...form,
          course: form.course === "all" ? null : form.course,
        });
        setNotification({
          message: "Coupon created successfully!",
          type: "success",
        });
      }
      setForm({
        code: "",
        discountPercentage: "10",
        course: "",
        expiryDate: "",
        usageLimit: "",
      });
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      setNotification({ message: "An error occurred!", type: "error" });
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      course: coupon.course ? coupon.course._id : "all",
      expiryDate: coupon.expiryDate.slice(0, 10),
      usageLimit: coupon.usageLimit,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setLoading(true);
      try {
        await axios.delete(`http://192.168.1.29:5000/api/coupons/${id}`);
        setNotification({
          message: "Coupon deleted successfully!",
          type: "success",
        });
        fetchCoupons();
      } catch (err) {
        setNotification({ message: "An error occurred!", type: "error" });
        console.error(err);
      } finally {
        setLoading(false);
        setTimeout(() => setNotification({ message: "", type: "" }), 3000);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Coupons</h2>

      {notification.message && (
        <div
          className={`p-4 mb-4 rounded ${
            notification.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            placeholder="Coupon Code"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="discountPercentage"
            value={form.discountPercentage}
            onChange={handleChange}
            placeholder="Discount %"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={1}
            max={100}
          />
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Course</option>
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="usageLimit"
            value={form.usageLimit}
            onChange={handleChange}
            min={1}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Usage Limit"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
        >
          {loading ? (
            <div className="loader"></div>
          ) : editingId ? (
            "Update Coupon"
          ) : (
            "Create Coupon"
          )}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          All Coupons
        </h3>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-gray-700">Code</th>
                  <th className="border px-4 py-2 text-gray-700">Discount %</th>
                  <th className="border px-4 py-2 text-gray-700">Course</th>
                  <th className="border px-4 py-2 text-gray-700">Expiry</th>
                  <th className="border px-4 py-2 text-gray-700">Used/Limit</th>
                  <th className="border px-4 py-2 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{coupon.code}</td>
                    <td className="border px-4 py-2">
                      {coupon.discountPercentage}%
                    </td>
                    <td className="border px-4 py-2">
                      {coupon.course ? coupon.course.title : "All Courses"}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-500">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
