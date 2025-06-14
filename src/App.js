import axios from "axios";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

// Format date to dd-mm-yyyy
const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

function App() {
  const [form, setForm] = useState({
    destination: "",
    tripType: "",
    startDate: "",
    endDate: "",
    travelerType: "",
    extraNotes: "",
  });

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");

    // Validate date logic
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setResponse("❌ End Date must be greater than or equal to Start Date.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        startDate: formatDate(form.startDate),
        endDate: formatDate(form.endDate),
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/plan`,
        payload
      );
      setResponse(res.data.response);
    } catch (err) {
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white p-4">
      <div className="max-w-3xl mx-auto text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">TriplyPlan</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Plan smarter, travel better.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
        >
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Trip Type</label>
            <select
              name="tripType"
              value={form.tripType}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded-lg"
            >
              <option value="">Select</option>
              <option value="Business">Business</option>
              <option value="Leisure">Leisure</option>
              <option value="Adventure">Adventure</option>
              <option value="Romantic">Romantic</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col items-center sm:col-span-2">
            <label className="mb-1 font-medium text-gray-700 text-center">
              Traveler Type
            </label>
            <select
              name="travelerType"
              value={form.travelerType}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded-lg w-full sm:w-72"
            >
              <option value="">Select</option>
              <option value="Solo">Solo</option>
              <option value="Family">Family</option>
              <option value="Couple">Couple</option>
              <option value="Friends">Friends</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              Extra Notes{" "}
              <span className="text-sm text-gray-400">(optional)</span>
            </label>
            <textarea
              name="extraNotes"
              value={form.extraNotes}
              onChange={handleChange}
              placeholder="e.g. Any medical conditions, allergies, or preferences..."
              className="border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div className="sm:col-span-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Plan"}
            </button>
          </div>
        </form>

        {response && (
          <div className="mt-8 p-4 sm:p-6 bg-gray-50 border rounded-lg font-sans text-sm sm:text-base overflow-x-auto text-left">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
              Your Trip Plan
            </h2>
            <div className="prose max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      {...props}
                      className="mb-2 whitespace-pre-line leading-relaxed text-sm sm:text-base"
                    />
                  ),
                }}
              >
                {response}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
