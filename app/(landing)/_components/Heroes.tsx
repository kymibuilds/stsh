import React from "react";

function Heroes() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-5xl font-bold tracking-tight mb-4">Stash Your Snippets</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
        Save, organize, and access your code snippets effortlessly — all in one place.
      </p>
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition">
          Get Started
        </button>
        <button className="px-6 py-3 border border-gray-400 rounded-xl text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white transition">
          Learn More
        </button>
      </div>
    </section>
  );
}

export default Heroes;
