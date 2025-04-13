"use client";
import { data } from "../../data/tododata";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [todoData, setToDoData] = useState(data);
  const [taskData, setTaskData] = useState([]);
  const router = useRouter();
  const [show, setShow] = useState(false);

  const handleClick = () => {
    router.push("/task/add-task");
  };

  useEffect(() => {
    getAllTask();
  }, []);

  const getAllTask = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getTasks", {
        withCredentials: true,
      });
      setTaskData(response.data);
    } catch (error) {
      console.log("Error");
    }
  };

  const handleShow = () => {
    setShow(!show);
  };

  // const getAllTask = () => {
  //   axios
  //     .get("http://localhost:5000/getTasks")
  //     .then((response) => {
  //       setTaskData(response.data);
  //     })
  //     .catch((error) => {
  //       console.log("Error", error);
  //     });
  // };

  const deleteTask = async (id) => {
    // alert("Are you sure you want to delete this task");

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!isConfirmed) return;
    try {
      const response = await axios.delete(
        `http://localhost:5000/deleteTask/${id}`
      );
      toast.success("Delete task successfully");
      getAllTask();
    } catch (error) {
      console.log("Error");
    }
  };

  return (
    <>
      <div></div>
      <div className="flex justify-center items-center mt-10">
        <button
          className="bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 hover:bg-emerald-600 active:scale-95"
          onClick={() => {
            router.push("/task/add-task");
          }}
        >
          Add To do list
        </button>
      </div>

      <div className="flex justify-center items-center mt-4">
        <table className="border-collapse border border-gray-400 bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">Id</th>
              <th className="border border-gray-400 px-4 py-2">Title</th>
              <th className="border border-gray-400 px-4 py-2">Description</th>
              <th className="border border-gray-400 px-4 py-2">Status</th>
              <th className="border border-gray-400 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {taskData.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-400 px-4 py-2">{item.id}</td>
                <td className="border border-gray-400 px-4 py-2">
                  {item.title}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {item.description}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {item.status == 1
                    ? "pending"
                    : item.status == 2
                    ? "in progress"
                    : "completed"}
                </td>
                <td className="border border-gray-400 px-4 py-2 flex justify-between">
                  <Link href={`/task/edit-task/${item.id}`}>Edit</Link>
                  <button
                    onClick={() => {
                      deleteTask(item.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show ? (
        <button onClick={handleShow}>hello</button>
      ) : (
        <button onClick={handleShow}>bye</button>
      )}
    </>
  );
}
