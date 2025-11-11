"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Thank you for contacting us! We’ll get back soon.");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(data.message || "❌ Failed to send message.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-gray-800">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Header Section */}
        <motion.section
          className="relative text-white text-center py-20 px-6 shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          style={{
            backgroundImage: "url('/images/about-poster.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.div
            className="absolute inset-0  backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          ></motion.div>

          <motion.div
            className="relative z-10 max-w-3xl mx-auto text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-black/30 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-lg">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-gray-100">
                We’d love to hear from you! Whether you have a question about
                our products, orders, or anything else — our team is ready to
                help.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Contact Info + Form */}
        <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Left Side - Info */}
          <motion.div
            className="flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[#BB4D00]">Get in Touch</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Reach out to us for any queries, feedback, or custom orders. Our
              team will get back to you as soon as possible.
            </p>

            <div className="mt-6 space-y-5 text-gray-700 text-lg">
              <ContactItem
                icon={<FaMapMarkerAlt className="text-[#BB4D00]" />}
                label="Address"
                text="P.No.8, S.No.5, Ground Floor, Naina Vihar, Rampura Road, Sanganer, Jaipur-302029"
              />
              <ContactItem
                icon={<FaPhoneAlt className="text-[#BB4D00]" />}
                label="Phone"
                text="+91 9414446467 , 9414545230"
              />
              <ContactItem
                icon={<FaEnvelope className="text-[#BB4D00]" />}
                label="Email"
                text="Suswastikspices@gmail.com"
              />
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-[#BB4D00] mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <SocialIcon Icon={FaFacebookF} link="https://facebook.com" />
                <SocialIcon Icon={FaInstagram} link="https://instagram.com" />
                <SocialIcon Icon={FaTwitter} link="https://twitter.com" />
                <SocialIcon
                  Icon={FaWhatsapp}
                  link="https://wa.me/919876543210"
                />
                <SocialIcon Icon={FaYoutube} link="https://youtube.com" />
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-[#BB4D00] mb-8">
              Send a Message
            </h3>

            <div className="space-y-5">
              <FormField
                label="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                required
              />
              <FormField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
              />
              <FormField
                label="Contact Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                required
              />
              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BB4D00] resize-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#BB4D00] text-white hover:bg-[#9b3d00] hover:shadow-lg"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </motion.form>
        </section>

        {/* Map Section */}
        <section className="mt-16 pb-20 px-6">
          <h2 className="text-3xl font-semibold text-center text-[#BB4D00] mb-10">
            Find Us on the Map
          </h2>

          <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-orange-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d13537.56558730756!2d75.753063!3d26.82197!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDQ5JzE5LjEiTiA3NcKwNDUnMjAuMyJF!5e1!3m2!1sen!2sin!4v1762772246005!5m2!1sen!2sin"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </>
  );
}

/* --- Reusable Input Field --- */
function FormField({ label, name, type, value, onChange, ...props }) {
  return (
    <div>
      <label className="block font-medium mb-2 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BB4D00] shadow-sm"
      />
    </div>
  );
}

/* --- Contact Info Item --- */
function ContactItem({ icon, label, text }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-orange-100 rounded-full">{icon}</div>
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600 text-[15px] leading-snug">{text}</p>
      </div>
    </div>
  );
}

/* --- Social Icon --- */
function SocialIcon({ Icon, link }) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#BB4D00] text-white p-3 rounded-full shadow-md hover:bg-[#a03f00] transition-all transform hover:scale-110 hover:shadow-lg"
    >
      <Icon size={20} />
    </Link>
  );
}
