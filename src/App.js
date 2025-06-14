import axios from "axios";
import React, { useRef, useState } from "react";
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
  const responseRef = useRef(null);

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
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-700">TriplyPlan</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Your AI-Powered Trip Planner
          </p>
        </header>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <h2 className="col-span-1 sm:col-span-2 text-lg font-semibold text-blue-700 border-b pb-2">
            Trip Details
          </h2>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              required
              placeholder="e.g. India, Hyd, Goa..."
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Trip Type
            </label>
            <select
              name="tripType"
              value={form.tripType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value="">Select</option>
              <option value="Business">Business</option>
              <option value="Leisure">Leisure</option>
              <option value="Adventure">Adventure</option>
              <option value="Romantic">Romantic</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium mb-1 text-gray-700">
              Traveler Type
            </label>
            <select
              name="travelerType"
              value={form.travelerType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value="">Select</option>
              <option value="Solo">Solo</option>
              <option value="Family">Family</option>
              <option value="Couple">Couple</option>
              <option value="Friends">Friends</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium mb-1 text-gray-700">
              Extra Notes{" "}
              <span className="text-sm text-gray-400">(optional)</span>
            </label>
            <textarea
              name="extraNotes"
              value={form.extraNotes}
              onChange={handleChange}
              placeholder="e.g. allergies, preferences, or special needs"
              className="w-full border border-gray-300 p-2 rounded-lg min-h-[100px]"
            />
          </div>

          <div className="sm:col-span-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Plan"}
            </button>
          </div>
        </form>

        {/* RESPONSE DISPLAY */}
        {response && (
          <div className="bg-white shadow-md rounded-xl p-6" ref={responseRef}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Trip Plan ✈️
            </h2>
            <div className="prose max-w-none text-left text-gray-800">
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
