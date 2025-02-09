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
  const [predictedBoxes, setPredictedBoxes] = useState([]);
  const [dates, setDates] = useState([]);

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
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict");
      if (!response.ok) throw new Error("Failed to fetch prophecies");

      const data = await response.json();

      if (data.predicted_total_boxes && data.dates) {
        setPredictedBoxes(data.predicted_total_boxes);
        setDates(data.dates);
      } else {
        console.error("Invalid response structure:", data);
      }
    } catch (err) {
      console.error("Error fetching prophecies:", err);
    }
  };

  const lastRecord =
    diningHallData?.records?.length > 0
      ? diningHallData.records[diningHallData.records.length - 1]
      : {};

  const selectedRecord =
    selectedRecordIndex !== null && diningHallData?.records?.[selectedRecordIndex]
      ? diningHallData.records[selectedRecordIndex]
      : null;

  const handleUpdateTotalBoxes = async (e) => {
    e.preventDefault();
    if (isNaN(newTotalBoxes) || Number(newTotalBoxes) < 0) {
      alert("Enter a valid number, Keeper.");
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

      if (!response.ok) throw new Error("Failed to update provisions.");

      setDiningHallData((prev) => ({
        ...prev,
        records: prev.records.map((record, index) =>
          index === prev.records.length - 1 ? { ...record, total_boxes: Number(newTotalBoxes) } : record
        ),
      }));
      setNewTotalBoxes("");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleIncrementTotalBoxes = async (e) => {
    e.preventDefault();
    if (isNaN(addBoxes) || Number(addBoxes) < 0) {
      alert("Enter a valid number, Keeper.");
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

      if (!response.ok) throw new Error("Failed to increase provisions.");

      setDiningHallData((prev) => ({
        ...prev,
        records: prev.records.map((record, index) =>
          index === prev.records.length - 1 ? { ...record, total_boxes: newTotal } : record
        ),
      }));
      setAddBoxes("");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleResetDonatedBoxes = async () => {
    if (!confirm("Are you sure you wish to revoke today’s bestowal?")) return;

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

      if (!response.ok) throw new Error("Failed to reset bestowed provisions.");

      setDiningHallData((prev) => ({
        ...prev,
        records: prev.records.map((record, index) =>
          index === prev.records.length - 1 ? { ...record, donated_boxes: 0 } : record
        ),
      }));

      await fetchVendorData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 dark:text-white">Vendor’s Guildhall</h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : vendorData && diningHallData ? (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold dark:text-white mb-4">{vendorData?.dining_hall}</h2>

          {/* Last Record Info */}
          <div className="space-y-2">
            <p className="text-lg text-gray-800 dark:text-gray-200">
              <span className="font-semibold">Total Provisions:</span> {lastRecord.total_boxes ?? 0}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-lg text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Provisions Bestowed:</span> {lastRecord.donated_boxes ?? 0}
              </p>
              {/* <Button
                variant="destructive"
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md"
                onClick={handleResetDonatedBoxes}
              >
                <Trash className="w-5 h-5" />
                <span>Revoke Bestowal</span>
              </Button> */}
            </div>
            <p className="text-lg text-gray-800 dark:text-gray-200">
              <span className="font-semibold">Provisions Remaining:</span> {Math.max((lastRecord.total_boxes ?? 0) - (lastRecord.donated_boxes ?? 0), 0)}
            </p>
          </div>

          {/* Update Total Provisions */}
          <form onSubmit={handleUpdateTotalBoxes} className="mt-6">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={newTotalBoxes}
                onChange={(e) => setNewTotalBoxes(e.target.value)}
                placeholder="Enter updated total provisions"
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Update Provisions
              </Button>
            </div>
          </form>

          {/* Increment Provisions */}
          <form onSubmit={handleIncrementTotalBoxes} className="mt-6">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={addBoxes}
                onChange={(e) => setAddBoxes(e.target.value)}
                placeholder="Add provisions"
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                Increase Provisions
              </Button>
            </div>
          </form>

          {/* Chronicles of the Keep */}
          <div className="mt-6">
            <label className="block text-lg font-bold dark:text-white mb-2">Chronicles of the Keep:</label>
            <select
              onChange={(e) => setSelectedRecordIndex(Number(e.target.value))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="">Summon a Chronicle</option>
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
                <span className="font-bold">Total Provisions:</span> {selectedRecord.total_boxes ?? 0}
              </p>
              <p className="text-lg text-gray-900 dark:text-white">
                <span className="font-bold">Provisions Bestowed:</span> {selectedRecord.donated_boxes ?? 0}
              </p>
              <p className="text-lg text-gray-900 dark:text-white">
                <span className="font-bold">Provisions Remaining:</span> {Math.max((selectedRecord.total_boxes ?? 0) - (selectedRecord.donated_boxes ?? 0), 0)}
              </p>
            </div>
          )}

          {/* Prophecy of Provisions */}
          <div className="mt-6 bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Prophecy of Provisions</h3>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Divined supplies for the feasting days ahead.
            </p>

            <div className="mt-4">
              {predictedBoxes.length > 0 ? (
                predictedBoxes.map((prediction, index) => (
                  <p key={index} className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {dates[index]}: {parseFloat(prediction).toFixed(2)} provisions
                  </p>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Prophecies loading...</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
