"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react"; // Import Trash Icon

export default function VendorDashboard() {
  const [vendorData, setVendorData] = useState(null);
  const [diningHallData, setDiningHallData] = useState(null);
  const [newTotalBoxes, setNewTotalBoxes] = useState("");
  const [addBoxes, setAddBoxes] = useState("");
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);
  const [error, setError] = useState("");

  const fetchVendorData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/vendor/dashboard");
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
      const data = await response.json();

      if (data.user?.length > 0) setVendorData(data.user[0]);
      if (data.hall?.length > 0) setDiningHallData(data.hall[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  // Get the last record (for main display)
  const lastRecord =
    diningHallData?.records?.length > 0
      ? diningHallData.records[diningHallData.records.length - 1]
      : {};

  // Get the selected record from the dropdown (for history display)
  const selectedRecord =
    selectedRecordIndex !== null && diningHallData?.records?.[selectedRecordIndex]
      ? diningHallData.records[selectedRecordIndex]
      : null;

  const handleUpdateTotalBoxes = async (e) => {
    e.preventDefault();
    if (isNaN(newTotalBoxes) || Number(newTotalBoxes) < 0) {
      alert("Please enter a valid number.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/vendor/update_inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dining_hall_name: vendorData.dining_hall,
          total_boxes: Number(newTotalBoxes),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      setDiningHallData((prev) => ({
        ...prev,
        records: prev.records.map((record, index) =>
          index === prev.records.length - 1 ? { ...record, total_boxes: Number(newTotalBoxes) } : record
        ),
      }));
      setNewTotalBoxes("");
    } catch (err) {
      alert(`Error updating total boxes: ${err.message}`);
    }
  };

  const handleIncrementTotalBoxes = async (e) => {
    e.preventDefault();
    if (isNaN(addBoxes) || Number(addBoxes) < 0) {
      alert("Please enter a valid number.");
      return;
    }

    const incrementValue = Number(addBoxes);
    const currentTotal = lastRecord.total_boxes ?? 0;
    const newTotal = currentTotal + incrementValue;

    try {
      const response = await fetch("http://127.0.0.1:5000/vendor/update_inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dining_hall_name: vendorData.dining_hall,
          total_boxes: newTotal,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      setDiningHallData((prev) => ({
        ...prev,
        records: prev.records.map((record, index) =>
          index === prev.records.length - 1 ? { ...record, total_boxes: newTotal } : record
        ),
      }));
      setAddBoxes("");
    } catch (err) {
      alert(`Error updating total boxes: ${err.message}`);
    }
  };

  const handleResetDonatedBoxes = async () => {
    if (!confirm("Are you sure you want to reset today's donated boxes? This cannot be undone.")) return;
  
    try {
      const response = await fetch("http://127.0.0.1:5000/vendor/update_inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dining_hall_name: vendorData.dining_hall,
          total_boxes: lastRecord.total_boxes,
          donated_boxes: 0,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }
  
      const result = await response.json();
      console.log("Reset Response:", result); // Debugging
  
      // ✅ Directly update the state to reflect the new data immediately
      setDiningHallData((prev) => ({
        ...prev,
        records: prev.records.map((record, index) =>
          index === prev.records.length - 1 ? { ...record, donated_boxes: 0 } : record
        ),
      }));
  
      // ✅ Ensure fresh data is fetched after state update
      await fetchVendorData();
    } catch (err) {
      alert(`Error resetting donated boxes: ${err.message}`);
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 dark:text-white">Vendor Dashboard</h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : vendorData && diningHallData ? (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold dark:text-white mb-4">{vendorData?.dining_hall}</h2>

          {/* Last Record Info (Main Display) */}
          <div className="space-y-2">
            <p className="text-lg text-gray-800 dark:text-gray-200">
              <span className="font-semibold">Total Boxes:</span> {lastRecord.total_boxes ?? 0}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-lg text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Donated Boxes:</span> {lastRecord.donated_boxes ?? 0}
              </p>
              {/* <Button
                variant="destructive"
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md"
                onClick={handleResetDonatedBoxes}
              >
                <Trash className="w-5 h-5" />
                <span>Clear Donations</span>
              </Button> */}
            </div>
            <p className="text-lg text-gray-800 dark:text-gray-200">
              <span className="font-semibold">Available Boxes:</span>{" "}
              {Math.max((lastRecord.total_boxes ?? 0) - (lastRecord.donated_boxes ?? 0), 0)}
            </p>
          </div>

          {/* Update & Increment Total Boxes */}
          <form onSubmit={handleUpdateTotalBoxes} className="mt-6">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={newTotalBoxes}
                onChange={(e) => setNewTotalBoxes(e.target.value)}
                placeholder="Enter new total boxes"
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Update Total Boxes
              </Button>
            </div>
          </form>

          <form onSubmit={handleIncrementTotalBoxes} className="mt-6">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={addBoxes}
                onChange={(e) => setAddBoxes(e.target.value)}
                placeholder="Add boxes to current total"
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                Add Boxes
              </Button>
            </div>
          </form>

          {/* Dropdown for History */}
          <div className="mt-6">
            <label className="block text-lg font-bold dark:text-white mb-2">View Past Records:</label>
            <select onChange={(e) => setSelectedRecordIndex(Number(e.target.value))} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
              <option value="">Select a Date</option>
              {diningHallData.records?.map((record, index) => (
                <option key={index} value={index}>{record.date}</option>
              ))}
            </select>
          </div>

          {/* Selected Record Details */}
          {selectedRecord && (
            <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
              <p className="text-lg text-gray-900 dark:text-white">
                <span className="font-bold">Date:</span> {selectedRecord.date}
              </p>
              <p className="text-lg text-gray-900 dark:text-white">
                <span className="font-bold">Total Boxes:</span> {selectedRecord.total_boxes ?? 0}
              </p>
              <p className="text-lg text-gray-900 dark:text-white">
                <span className="font-bold">Donated Boxes:</span> {selectedRecord.donated_boxes ?? 0}
              </p>
              <p className="text-lg text-gray-900 dark:text-white">
                <span className="font-bold">Available Boxes:</span>{" "}
                {Math.max((selectedRecord.total_boxes ?? 0) - (selectedRecord.donated_boxes ?? 0), 0)}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
