"use client";
import React, { useEffect, useRef, useState } from "react";
import { Search, Folder, Globe, Code } from "lucide-react";

function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: Search,
      title: "Lightning Fast Search",
      description: "Find any snippet instantly",
    },
    {
      icon: Folder,
      title: "Smart Organization",
      description: "Tags, folders, and collections",
    },
    {
      icon: Globe,
      title: "Universal Access",
      description: "Web, mobile, and soon VSCode",
    },
    {
      icon: Code,
      title: "Syntax Highlighting",
      description: "Support for 100+ languages",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 px-6 max-w-7xl mx-auto">
      <div
        className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl px-6 py-4 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3"
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <Icon className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                <div>
                  <h3 className="text-white font-medium text-sm md:text-base whitespace-nowrap">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
