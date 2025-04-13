"use client";
import { data } from "../../../../../data/tododata";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const params = useParams();
  const taskId = params.taskId;
  const router = useRouter();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "",
  });

  const handleTaskData = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: e.target.value,
    }));
  };

  useEffect(() => {
    getAllTask();
  }, []);

  const getAllTask = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getTasks/${taskId}`
      );
      setTaskData(response.data[0]);
    } catch (error) {
      console.log("Error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/updateTask/${taskId}`,
        taskData
      );
      toast.success("Edit form successfully");
      router.push("/");
    } catch (error) {
      console.log("Error");
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
          onChange={handleTaskData}
          placeholder="Enter Title"
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
          placeholder="Enter Description"
          onChange={(e) => handleTaskData(e)}
          value={taskData.description}
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
          onChange={(e) => handleTaskData(e)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Status</option>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
        Submit
      </button>
    </form>
  );
}
