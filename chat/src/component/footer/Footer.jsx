import React from "react";
import { Twitter, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">MentorHub</h3>
          <p className="text-gray-400 max-w-sm">
            Connect with top mentors worldwide, accelerate your career, and
            achieve your goals.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold text-white mb-3">Company</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="/"
                className="hover:text-green-400 transition-colors duration-300"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/"
                className="hover:text-green-400 transition-colors duration-300"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="/"
                className="hover:text-green-400 transition-colors duration-300"
              >
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold text-white mb-3">Follow Us</h4>
          <div className="flex gap-4">
            <a
              href="/"
              className="p-2 rounded-full hover:bg-green-500 transition-colors duration-300"
            >
              <Twitter className="w-5 h-5 text-white" />
            </a>
            <a
              href="/"
              className="p-2 rounded-full hover:bg-green-500 transition-colors duration-300"
            >
              <Linkedin className="w-5 h-5 text-white" />
            </a>
            <a
              href="/"
              className="p-2 rounded-full hover:bg-green-500 transition-colors duration-300"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10"></div>

      {/* Copyright */}
      <p className="text-center text-gray-500 mt-6 text-sm">
        &copy; {new Date().getFullYear()} MentorHub. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
