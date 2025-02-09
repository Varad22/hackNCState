"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState(null);
  const [diningHallData, setDiningHallData] = useState(null);
  const [newDonatedBoxes, setNewDonatedBoxes] = useState("");
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/employee/dashboard");
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
        const data = await response.json();

        if (data.user?.length > 0) setEmployeeData(data.user[0]); 
        if (data.hall?.length > 0) setDiningHallData(data.hall[0]); 

        console.log("Employee Data:", data.user[0]);
        console.log("Dining Hall Data:", data.hall[0]);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmployeeData();
  }, []);

  const lastRecord =
    diningHallData?.records?.length > 0
      ? diningHallData.records[diningHallData.records.length - 1]
      : {}; // Get the last record safely

    const handleUpdateDonatedBoxes = async (e) => {
      e.preventDefault();
      const availableBoxes = Math.max((lastRecord.total_boxes ?? 0) - (lastRecord.donated_boxes ?? 0), 0);
    
      if (isNaN(newDonatedBoxes) || Number(newDonatedBoxes) < 0) {
        alert("Please enter a valid number.");
        return;
      }
    
      if (Number(newDonatedBoxes) > availableBoxes) {
        alert(`You cannot donate more than ${availableBoxes} available boxes.`);
        return;
      }
    
      try {
        const response = await fetch("http://127.0.0.1:5000/employee/update_inventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dining_hall_name: employeeData.dining_hall,
            donated_boxes: Number(lastRecord.donated_boxes ?? 0) + Number(newDonatedBoxes), // Add to existing donated count
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData.error);
          alert(`Error: ${errorData.error}`);
          return;
        }
    
        const result = await response.json();
        if (result.message === "Donated boxes updated successfully") {
          setDiningHallData((prev) => ({
            ...prev,
            records: prev.records.map((record, index) =>
              index === prev.records.length - 1
                ? { ...record, donated_boxes: (record.donated_boxes ?? 0) + Number(newDonatedBoxes) }
                : record
            ),
          }));
          setNewDonatedBoxes(""); // Clear input field
        } else {
          alert(result.error);
        }
      } catch (err) {
        alert(`Error updating donated boxes: ${err.message}`);
      }
    };
      

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 dark:text-white">Employee Dashboard</h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : employeeData && diningHallData ? (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold dark:text-white mb-4">
            {employeeData?.dining_hall || "Select a Dining Hall"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Email: {employeeData?.email || "Not Available"}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Username: {employeeData?.username || "Not Available"}
          </p>

          {/* Boxes Info */}
          <div className="space-y-2">
            <p className="text-lg text-gray-800 dark:text-gray-200">
              Total Boxes: <span className="font-bold">{lastRecord.total_boxes ?? 0}</span>
            </p>
            <p className="text-lg text-gray-800 dark:text-gray-200">
              Donated Boxes: <span className="font-bold">{lastRecord.donated_boxes ?? 0}</span>
            </p>
            <p className="text-lg text-gray-800 dark:text-gray-200">
              Available Boxes:{" "}
              <span className="font-bold">
                {Math.max((lastRecord.total_boxes ?? 0) - (lastRecord.donated_boxes ?? 0), 0)}
              </span>
            </p>
          </div>

          {/* Update Donated Boxes Form */}
          <form onSubmit={handleUpdateDonatedBoxes} className="mt-6">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={newDonatedBoxes}
                onChange={(e) => setNewDonatedBoxes(e.target.value)}
                placeholder="Enter donated boxes"
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <Button
                type="submit"
                className="bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
              >
                Update Donated Boxes
              </Button>
            </div>
          </form>

          {/* Dropdown to View All Records */}
          <div className="mt-6">
            <label className="block text-lg font-bold dark:text-white mb-2">
              View Past Inventory Records:
            </label>
            <select
              onChange={(e) => setSelectedRecordIndex(Number(e.target.value))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a Date</option>
              {diningHallData.records?.map((record, index) => (
                <option key={index} value={index}>
                  {record.date}
                </option>
              ))}
            </select>

            {/* Display selected record details */}
            {selectedRecordIndex !== null && diningHallData.records?.[selectedRecordIndex] && (
              <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
                <p className="text-lg text-gray-900 dark:text-white">
                  <span className="font-bold">Date:</span>{" "}
                  {diningHallData.records[selectedRecordIndex].date}
                </p>
                <p className="text-lg text-gray-900 dark:text-white">
                  <span className="font-bold">Total Boxes:</span>{" "}
                  {diningHallData.records[selectedRecordIndex].total_boxes}
                </p>
                <p className="text-lg text-gray-900 dark:text-white">
                  <span className="font-bold">Donated Boxes:</span>{" "}
                  {diningHallData.records[selectedRecordIndex].donated_boxes}
                </p>
                <p className="text-lg text-gray-900 dark:text-white">
                  <span className="font-bold">Available Boxes:</span>{" "}
                  {Math.max(
                    diningHallData.records[selectedRecordIndex].total_boxes -
                      diningHallData.records[selectedRecordIndex].donated_boxes,
                    0
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-700 dark:text-gray-300">Loading employee data...</p>
      )}
    </div>
  );
}
