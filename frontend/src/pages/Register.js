import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    /* Email validation */

    if (!email.toLowerCase().endsWith("@iiitl.ac.in")) {
      alert("Please register using your IIITL college email");
      return;
    }

    try {

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          name,
          email,
          password
        },
        { withCredentials: true }
      );

      alert("Registration successful");

      navigate("/login");

    } catch (error) {

      alert(error.response?.data?.message || "Registration failed");

    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="College Email (example: mcs24007@iiitl.ac.in)"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>

      </form>

    </div>

  );

}

export default Register;