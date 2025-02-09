"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getDiningHalls } from "@/lib/api";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dynamically import MapView to prevent SSR issues
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function DashboardPage() {
  const [diningHalls, setDiningHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapDestination, setMapDestination] = useState(null);
  const [subscriptions, setSubscriptions] = useState({}); // Stores subscriptions
  const [selectedHall, setSelectedHall] = useState(null);
  const [selectedPreference, setSelectedPreference] = useState("");
  
  const dietaryOptions = ["Vegan", "Vegetarian", "Halal", "Gluten-Free", "No Preference"];

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "🍽️ Welcome! Select a meal preference:\n\n1️⃣ Vegan\n2️⃣ Vegetarian\n3️⃣ Gluten-Free\n4️⃣ Meat" }
  ]);
  const [loadingResponse, setLoadingResponse] = useState(false);

  const sendMessage = async (message) => {
    const preference = parseInt(message); // Ensure it's an integer
  
    if (![1, 2, 3, 4].includes(preference)) {
      setChatMessages((prev) => [...prev, { sender: "bot", text: "Invalid choice. Please select 1, 2, 3, or 4." }]);
      return;
    }
  
    setChatMessages((prev) => [...prev, { sender: "user", text: `Selected: ${message}` }]);
    setLoadingResponse(true);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/meal_contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preference }), // Ensure the JSON body is correctly structured
      });
  
      if (!response.ok) throw new Error("Failed to fetch meal package.");
  
      const data = await response.json();
      setChatMessages((prev) => [...prev, { sender: "bot", text: data.package_summary || "No details available." }]);
    } catch (error) {
      setChatMessages((prev) => [...prev, { sender: "bot", text: "Error fetching meal details. Please try again." }]);
    }
  
    setLoadingResponse(false);
  };
  


  useEffect(() => {
    const fetchDiningHalls = async () => {
      const data = await getDiningHalls();
      setDiningHalls(data);
      setLoading(false);
    };

    fetchDiningHalls();
  }, []);

  // Handle Notify Me button click (Open Modal)
  const handleNotifyMe = (hall) => {
    if (subscriptions[hall.dining_hall_name]) return; // Prevent opening dialog if already subscribed
    setSelectedHall(hall);
    setSelectedPreference(""); // Reset selection
  };

  // Handle Subscription Confirmation
  const handleSubscribe = async () => {
    if (!selectedPreference) {
      alert("Please select a dietary preference.");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: "hacknc1@yopmail.com", // Replace with dynamic user email if available
          subject: `Subscription Alert - ${selectedHall.dining_hall_name}`,
          data: `User subscribed to ${selectedHall.dining_hall_name} with preference: ${selectedPreference}`,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error sending notification: ${errorData.error}`);
        return;
      }
  
      setSubscriptions((prev) => ({
        ...prev,
        [selectedHall.dining_hall_name]: selectedPreference,
      }));
  
      setSelectedHall(null); // Close modal
  
      alert("You have been successfully subscribed!");
    } catch (err) {
      alert(`Error subscribing: ${err.message}`);
    }
  };
  

  // Handle Cancel Notification
  const handleCancelSubscription = (hallName) => {
    setSubscriptions((prev) => {
      const newSubscriptions = { ...prev };
      delete newSubscriptions[hallName];
      return newSubscriptions;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 dark:text-white">Dining Halls</h1>

      {loading ? (
        <p className="text-center text-gray-700 dark:text-gray-300">Loading dining halls...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {diningHalls.map((hall, index) => {
            const [lat, lng] = hall.location.split(",").map(Number);
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <img src={`/images/dining${index + 1}.jpg`} alt={hall.dining_hall_name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{hall.dining_hall_name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">📍 {hall.location}</p>

                  <div className="mt-4 flex space-x-4">
                    {/* Subscription Handling */}
                    {subscriptions[hall.dining_hall_name] ? (
                      <Button
                        className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                        onClick={() => handleCancelSubscription(hall.dining_hall_name)}
                      >
                        Cancel Notification
                      </Button>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            onClick={() => handleNotifyMe(hall)}
                          >
                            Notify Me
                          </Button>
                        </DialogTrigger>
                        {selectedHall && selectedHall.dining_hall_name === hall.dining_hall_name && (
                          <DialogContent className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                Select Dietary Preference for {selectedHall.dining_hall_name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3 mt-4">
                              {dietaryOptions.map((option) => (
                                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="dietaryPreference"
                                    value={option}
                                    checked={selectedPreference === option}
                                    onChange={() => setSelectedPreference(option)}
                                    className="form-radio text-blue-600"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                                </label>
                              ))}
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                              <Button
                                className="bg-gray-500 text-white hover:bg-gray-600"
                                onClick={() => setSelectedHall(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleSubscribe}
                              >
                                Subscribe
                              </Button>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    )}

                    {/* Get Directions Button */}
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                      onClick={() => setMapDestination({ latitude: lat, longitude: lng })}
                    >
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MapView Component - Shows when a destination is set */}
      {mapDestination && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-3/4 h-3/4">
            <button className="text-red-500 text-lg font-bold" onClick={() => setMapDestination(null)}>
              ✖ Close
            </button>
            <MapView destination={mapDestination} />
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6">
        {!showChat ? (
          <Button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700" onClick={() => setShowChat(true)}>
            💬 Chat
          </Button>
        ) : (
          <motion.div className="bg-white dark:bg-gray-900 w-[400px] h-[350px] p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meal Chatbot</h3>
              <button className="text-red-500 font-bold" onClick={() => setShowChat(false)}>✖</button>
            </div>
            <div className="h-52 overflow-y-auto p-2 space-y-2 border-b border-gray-300 dark:border-gray-700">
              {chatMessages.map((msg, index) => (
                <p key={index} className={`p-2 rounded-md ${msg.sender === "bot" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-blue-600 text-white"}`}>
                  {msg.text}
                </p>
              ))}
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4">
              {[1, 2, 3, 4].map((num) => (
                <Button key={num} className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white" onClick={() => sendMessage(num.toString())}>
                  {num}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
