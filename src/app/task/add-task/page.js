"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [status, setStatus] = useState("");

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "",
  });
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask();
  };

  const handleTaskData = async (e) => {
    const name = e.target.name;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: e.target.value,
    }));
  };

  const createTask = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/createTask",
        taskData
      );
      setTaskData({
        title: "",
        description: "",
        status: "",
      });
      toast.success("task successfully added");
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg space-y-4 mt-10"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={taskData.title}
          placeholder="Enter Title"
          // onChange={(e) => {
          //   setTaskData((prevData) => ({
          //     ...prevData,
          //     title: e.target.value,
          //   }));
          // }}
          onChange={(e) => {
            handleTaskData(e);
          }}
          // onChange={(e) => {
          //   console.log("e", e.target.value);
          //   setTitle(e.target.value);
          // }}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={taskData.description}
          onChange={(e) => {
            handleTaskData(e);
          }}
          placeholder="Enter Description"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={taskData.status}
          onChange={(e) => {
            handleTaskData(e);
          }}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
        Submit
      </button>
    </form>
  );
}
