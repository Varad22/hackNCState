"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getHomeData } from "@/lib/api";

export default function Home() {
  const images = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const [homeData, setHomeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getHomeData();
      console.log({data})
      if (data.error) {
        setError(data.error);
      } else {
        setHomeData(data);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Panel Slider */}
      <section
        id="panel"
        className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-800 pt-10 scroll-mt-16"
      >
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-3/4 h-3/4 bg-cover bg-center rounded-md shadow-lg"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
          }}
        ></motion.div>
        <div className="mt-4 flex space-x-4">
          <Button onClick={handlePrev}>Previous</Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </section>

      {/* Blog Space */}
      <section
        id="blogs"
        className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 pt-20 scroll-mt-16"
      >
        <h2 className="text-4xl font-bold text-center mb-6 dark:text-white">
          Recent Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((blog) => (
            <div key={blog} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
              <h3 className="text-xl font-bold mb-2 dark:text-white">Blog Title {blog}</h3>
              <p className="text-gray-600 dark:text-gray-300">This is a brief description of Blog {blog}. Click to read more!</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="min-h-screen p-8 bg-white dark:bg-gray-800 pt-20 scroll-mt-16"
      >
        <h2 className="text-4xl font-bold text-center mb-6 dark:text-white">
          Testimonials
        </h2>
        <div className="flex flex-col items-center space-y-6">
          {[1, 2, 3].map((testimonial) => (
            <motion.div
              key={testimonial}
              whileHover={{ scale: 1.05 }}
              className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-900 p-6 rounded-md shadow-md"
            >
              <p className="text-gray-700 dark:text-gray-300">
                "This is a testimonial from user {testimonial}. I loved the experience!"
              </p>
              <h4 className="mt-4 font-bold dark:text-white">User {testimonial}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
