import "./Dashboard.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "font-awesome/css/font-awesome.min.css";
import Header from "../components/header";
import Footer from "../components/footer";
import LoadingComponent from "../components/loading";
import { useParams, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { username } = useParams();
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const handlenav = () => {
    nav("/createProblem");
  };
  const handleAlluser = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get("http://localhost:5000/api/allusers");
      setUsers(response.data.users);
      setLoading(false);
      setIsClicked(true);
    } catch (error) {
      setError(error.message);
      if (error.response.status === 401) {
        setError("You are not authorized. Please log in first.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(
          `http://localhost:5000/api/user/${username}`
        );
        setUser(response.data.user);
        if (response.data.user.role === 1) setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  const getTimePassed = (createdAt) => {
    const userCreatedAt = new Date(createdAt);
    const currentTime = new Date();

    const timeDifference = currentTime.getTime() - userCreatedAt.getTime();
    const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return `${daysPassed}`;
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    const userToEdit = users.find((user) => user._id === userId);
    setEditedUser({
      ...userToEdit,
    });
  };

  const handleUpdateUser = async (userId) => {
    try {
      axios.defaults.withCredentials = true;
      const { name, userName, email, role } = editedUser;
      await axios.put(`http://localhost:5000/api/user/edit/${userId}`, {
        name,
        userName,
        email,
        role,
      });
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, name, userName, email, role } : user
        )
      );
      setEditingUserId(null);
      setEditedUser({});
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      axios.defaults.withCredentials = true;
      await axios.delete(
        `http://localhost:5000/api/admin/user/delete/${userId}`
      );
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
    }
  };

  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <div class="dark:bg-black">
        {loading ? (
          <LoadingComponent />
        ) : user ? (
          <div className="font-mono container mt-5 mb-5">
            <div className="font-mono row no-gutters">
              <div className="font-mono col-md-4 col-lg-4">
                <img
                  src={`https://robohash.org/${user.name}?size=300x300`}
                  alt={user.name}
                />
              </div>
              <div className="font-mono col-md-8 col-lg-8">
                <div className="font-mono d-flex flex-column">
                  <div className="font-mono d-flex flex-row justify-content-between align-items-center p-5 bg-dark text-white">
                    <h3 className="font-mono display-5">{user.name}</h3>
                    <h5 className="font-mono display-10">{user.userName}</h5>
                  </div>

                  <div className="font-mono p-3 bg-black text-white"></div>
                  <div className="font-mono d-flex flex-row text-white">
                    <div className="font-mono p-3 bg-primary text-center skill-block">
                      <h6>User Since</h6>
                      <h4>{getTimePassed(user.createdAt)}</h4>
                      <h6>days</h6>
                    </div>
                    <div className="font-mono p-3 bg-secondary text-center skill-block">
                      <h6>Questions Solved</h6>
                      <h4>{user.questionsSolved}</h4>
                    </div>
                    <div className="font-mono p-3 bg-success text-center skill-block">
                      <h6>Points Earned</h6>
                      <h4>{user.pointsEarned}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No user found</p>
        )}
      </div>
      <>
        {isAdmin && (
          <>
            <p className="font-mono text-xl font-bold text-left m-6 text-blue-900">
              Admin corner
            </p>

            <div className="font-mono text-center m-4 w-50 flex flex-row">
              <button
                className="font-mono btn btn-primary btn-sm ml-5"
                onClick={handleAlluser}
                style={{ fontSize: "1.2rem" }}
              >
                Get All Users
              </button>
              <button
                className="font-mono btn btn-primary btn-sm ml-5"
                onClick={handlenav}
                style={{ fontSize: "1.2rem" }}
              >
                Create Problem
              </button>
            </div>

            {isClicked && (
              <>
                <div className="font-mono flex flex-wrap">
                  <div className="w-full xl:w-8/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-white text-blueGray-700">
                      <div className="px-6 py-4 border-0">
                        <div className="flex flex-wrap items-center">
                          <div className="relative w-full max-w-full flex-grow flex-1">
                            <h3 className="font-mono font-bold text-lg text-blueGray-700">
                              All Users
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="block w-full overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                          <thead>
                            <tr>
                              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-mono font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">
                                Serial No
                              </th>
                              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-mono font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">
                                Name
                              </th>
                              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-mono font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">
                                Username
                              </th>
                              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-mono font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">
                                Email
                              </th>
                              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-mono font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">
                                Role
                              </th>
                              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-mono font-bold text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user, index) => (
                              <tr key={user._id}>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  <div className="flex items-center">
                                    <span className="ml-3 font-mono font-bold">
                                      {index + 1}
                                    </span>
                                  </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  <div className="flex items-center">
                                    {editingUserId === user._id ? (
                                      <input
                                        type="text"
                                        name="name"
                                        value={editedUser.name || ""}
                                        onChange={handleInputChange}
                                        className="form-control"
                                      />
                                    ) : (
                                      <span className="ml-3 font-mono font-bold">
                                        {user.name}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  <div className="flex items-center">
                                    {editingUserId === user._id ? (
                                      <input
                                        type="text"
                                        name="userName"
                                        value={editedUser.userName || ""}
                                        onChange={handleInputChange}
                                        className="form-control"
                                      />
                                    ) : (
                                      user.userName
                                    )}
                                  </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  <div className="flex items-center">
                                    <i className="mr-2 text-emerald-500"></i>
                                    {editingUserId === user._id ? (
                                      <input
                                        type="email"
                                        name="email"
                                        value={editedUser.email || ""}
                                        onChange={handleInputChange}
                                        className="form-control"
                                      />
                                    ) : (
                                      user.email
                                    )}
                                  </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  <div className="flex items-center">
                                    {editingUserId === user._id ? (
                                      <select
                                        name="role"
                                        value={editedUser.role || ""}
                                        onChange={handleInputChange}
                                        className="form-control"
                                      >
                                        <option value="0">User</option>
                                        <option value="1">Admin</option>
                                      </select>
                                    ) : user.role === 0 ? (
                                      "User"
                                    ) : (
                                      "Admin"
                                    )}
                                  </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  <div className="flex items-center">
                                    {editingUserId === user._id ? (
                                      <>
                                        <button
                                          className="btn btn-sm btn-success mr-2"
                                          onClick={() =>
                                            handleUpdateUser(user._id)
                                          }
                                        >
                                          Save
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={() => setEditingUserId(null)}
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          className="btn btn-sm btn-primary mr-2"
                                          onClick={() =>
                                            handleEditUser(user._id)
                                          }
                                        >
                                          Edit
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={() =>
                                            handleDeleteUser(user._id)
                                          }
                                        >
                                          Delete
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </>
      <Footer />
    </>
  );
};

export default Dashboard;
