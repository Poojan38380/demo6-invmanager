"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Package,
  Users,
  LineChart,
  CheckCircle,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  LayoutDashboard,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import "./styles.css";

const features = [
  {
    icon: <Package className="w-6 h-6" />,
    title: "Never Lose Track of Products Again",
    description:
      "End stockouts and overstocking with real-time SKU tracking, variant management, and smart buffer stock alerts. Know exactly what you have, where it is, and when to reorder.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Stop Guessing Your Stock Levels",
    description:
      "Get crystal-clear visibility into your inventory with real-time tracking, automated alerts, and predictive analytics. Make data-driven decisions that save you money.",
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: "Turn Data into Profit",
    description:
      "Unlock hidden opportunities with advanced analytics, seasonal trends, and stock turnover insights. Make smarter decisions that boost your bottom line.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Streamline Your Supply Chain",
    description:
      "Build stronger relationships with vendors and customers through complete tracking, purchase history, and performance analytics. Optimize your entire supply chain.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "24,999",
    features: [
      "Up to 100 products",
      "Real-time stock tracking",
      "Basic analytics dashboard",
      "Single user access",
      "Email support",
      "Buffer stock alerts",
      "Basic reporting",
      "Mobile-friendly interface",
    ],
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Professional",
    price: "49,999",
    features: [
      "Everything in Starter and...",
      "Up to 500 products",
      "Advanced analytics suite",
      "Up to 5 user accounts",
      "Priority email support",
      "API access",
      "Stock movement history",
      "Vendor & customer tracking",
      "Buffer stock management",
      "Seasonal trend analysis",
      "Custom report builder",
      "Bulk import/export",
    ],
    popular: true,
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: "Enterprise",
    price: "99,999",
    features: [
      "Everything in Professional and...",
      "Unlimited products",
      "Custom reporting engine",
      "Unlimited user accounts",
      "24/7 priority support",
      "Custom integrations",
      "Advanced seasonal analysis",
      "Stock level predictions",
      "Dedicated account manager",
      "Custom workflow automation",
      "Advanced security features",
      "White-label options",
    ],
    icon: <Sparkles className="w-5 h-5" />,
  },
];

// Add free trial messaging
const freeTrialMessage =
  "Transform Your Business Today - Get 30 Days FREE Access to InvManager's Complete Suite!";

// Add FOMO message
const fomoMessage = "🔥 Last 24 Hours: 47 Businesses Started Their FREE Trial!";

// Add trust badges
const trustBadges = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Secure",
    description: "Bank-grade security",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "24/7 Support",
    description: "Always here to help",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Money Back",
    description: "30-day guarantee",
  },
];

// Add key benefits
const keyBenefits = [
  "Reduce stockouts by up to 95%",
  "Cut inventory costs by 30%",
  "Save 15+ hours per week",
  "Increase profit margins by 25%",
  "Eliminate manual data entry",
  "Make data-driven decisions",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Sticky CTA */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-lg z-50 py-3 border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">
              Ready to transform your inventory management?
            </p>
            <p className="text-sm text-gray-600">
              Start your FREE 30-day trial now!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.a
              href="https://wa.me/+918849779702"
              target="_blank"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{
                    rotate: 360,
                    transition: { duration: 0.5 },
                  }}
                  animate={{
                    rotate: 360,
                    boxShadow: [
                      "0 0 0 0 rgba(79, 70, 229, 0)",
                      "0 0 0 8px rgba(79, 70, 229, 0.2)",
                      "0 0 0 0 rgba(79, 70, 229, 0)",
                    ],
                  }}
                  transition={{
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    boxShadow: { duration: 2, repeat: Infinity },
                  }}
                  className="mr-2 text-indigo-600 p-2 rounded-full"
                >
                  <Package className="h-7 w-7" />
                </motion.div>
                <motion.span
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  animate={{
                    textShadow: [
                      "0px 0px 0px rgba(79, 70, 229, 0)",
                      "0px 0px 10px rgba(79, 70, 229, 0.3)",
                      "0px 0px 0px rgba(79, 70, 229, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  InvManager
                </motion.span>
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(79, 70, 229, 0.2)",
                    "0 0 0 10px rgba(79, 70, 229, 0)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70 blur-sm"
                  animate={{
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Link
                  href="/admin"
                  className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <span>Go to Admin</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="ml-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10"
          >
            {/* FOMO Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-block"
            >
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full shadow-lg">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                  className="flex items-center space-x-2"
                >
                  <span className="animate-pulse">⚡</span>
                  <span>{fomoMessage}</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block relative"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.h1
                className="text-5xl md:text-6xl font-bold text-gray-900 relative"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Stop Losing Money
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  to
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  Poor Inventory Management
                </motion.span>
              </motion.h1>
            </motion.div>
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {freeTrialMessage}
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="relative inline-block"
            >
              <motion.div
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75 blur-sm"
                animate={{
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <Link
                href="https://wa.me/+918849779702"
                target="_blank"
                className="relative inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"
              >
                <motion.span
                  animate={{
                    x: [0, 3, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                >
                  Claim Your FREE 30-Day Trial Now
                </motion.span>
                <motion.div
                  animate={{
                    x: [0, 3, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Link>
            </motion.div>
            <motion.p
              className="mt-4 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              ⭐️ Trusted by 500+ businesses across India
            </motion.p>
          </motion.div>

          {/* Background floating elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute h-20 w-20 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 opacity-70"
              style={{ top: "15%", left: "10%" }}
              animate={{
                y: [0, 30, 0],
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 10,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute h-16 w-16 rounded-full bg-gradient-to-r from-indigo-200 to-blue-200 opacity-50"
              style={{ top: "60%", right: "15%" }}
              animate={{
                y: [0, -40, 0],
                rotate: [0, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 12,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute h-24 w-24 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 opacity-60"
              style={{ bottom: "10%", left: "20%" }}
              animate={{
                y: [0, 25, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 8,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute h-12 w-12 rounded-full bg-gradient-to-r from-pink-100 to-red-100 opacity-60"
              style={{ top: "35%", right: "25%" }}
              animate={{
                y: [0, -15, 0],
                x: [0, 15, 0],
                rotate: [0, 15, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 9,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute h-16 w-16 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 opacity-60"
              style={{ bottom: "30%", right: "10%" }}
              animate={{
                y: [0, 20, 0],
                x: [0, -10, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 7,
                repeatType: "reverse",
              }}
            />

            {/* Add subtle grid pattern for depth */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {/* Add animated dots pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="3" cy="3" r="1" fill="#4F46E5" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

        {/* Background decorative elements */}
        <motion.div
          className="absolute -left-24 top-20 w-64 h-64 rounded-full bg-indigo-50"
          animate={{
            scale: [0.9, 1.1, 0.9],
            rotate: [0, 5, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
          }}
        />
        <motion.div
          className="absolute -right-24 bottom-20 w-80 h-80 rounded-full bg-purple-50"
          animate={{
            scale: [1.1, 0.9, 1.1],
            rotate: [0, -5, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative inline-block"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-indigo-100 opacity-30 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <h2 className="text-3xl font-bold text-gray-900 relative">
                <motion.span
                  animate={{
                    color: ["#4F46E5", "#6366F1", "#4F46E5"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Solve Your Biggest
                </motion.span>{" "}
                Inventory Problems
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Stop losing money to poor inventory management. Start making
                data-driven decisions today.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icon with animations */}
                <motion.div
                  className="relative text-indigo-600 mb-4 inline-block bg-indigo-50 p-3 rounded-lg"
                  whileHover={{ rotate: [0, 15, 0], scale: 1.1 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    backgroundColor: [
                      "rgba(238, 242, 255, 1)",
                      "rgba(224, 231, 255, 1)",
                      "rgba(238, 242, 255, 1)",
                    ],
                  }}
                  transition={{
                    scale: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                      delay: index * 0.5,
                    },
                    backgroundColor: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 3,
                      delay: index * 0.3,
                    },
                  }}
                >
                  {feature.icon}
                </motion.div>

                {/* Title with hover animation */}
                <motion.h3
                  className="text-xl font-semibold mb-2 relative z-10"
                  whileHover={{ color: "#4F46E5", scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.title}
                </motion.h3>

                {/* Description with hover effect */}
                <p className="text-gray-600 relative z-10 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Subtle arrow indicator that appears on hover */}
                <motion.div
                  className="absolute bottom-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ x: 3 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Trust Badges Section after Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="text-indigo-600"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    {badge.icon}
                  </motion.div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      {badge.title}
                    </h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Key Benefits Section before Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900"
            >
              Real Results, Real Numbers
            </motion.h2>
            <p className="mt-4 text-lg text-gray-600">
              See what InvManager can do for your business
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {keyBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
                <span className="text-lg text-gray-800 font-medium">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

        {/* Background decorative elements */}
        <motion.div
          className="absolute -right-32 top-20 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100"
          animate={{
            scale: [0.95, 1.05, 0.95],
            rotate: [0, 5, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
          }}
        />
        <motion.div
          className="absolute -left-32 bottom-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-50 to-purple-100"
          animate={{
            scale: [1.05, 0.95, 1.05],
            rotate: [0, -5, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                animate={{
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                }}
                style={{
                  backgroundSize: "300% 100%",
                }}
              >
                Invest in Your Business Growth
              </motion.h2>
              <p className="mt-4 text-lg text-gray-600">
                Choose the plan that fits your business needs. All plans include
                our 30-day FREE trial.
              </p>
              <motion.div
                className="mt-6 inline-block"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  Save up to ₹50,000 with yearly billing
                </div>
              </motion.div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow:
                    "0 25px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)",
                }}
                className={`p-8 bg-white rounded-xl shadow-lg transition-all duration-300 relative overflow-hidden ${
                  plan.popular ? "ring-2 ring-indigo-600" : ""
                }`}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50 to-white opacity-0 hover:opacity-40 transition-opacity duration-500"></div>

                {/* Popular tag with animation */}
                {plan.popular && (
                  <motion.div
                    className="absolute -top-3 -right-12 w-40 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rotate-45 flex items-center justify-center shadow-lg"
                    animate={{
                      backgroundColor: [
                        "rgba(79, 70, 229, 1)",
                        "rgba(99, 102, 241, 1)",
                        "rgba(79, 70, 229, 1)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <motion.span
                      className="text-xs font-semibold uppercase tracking-wider text-white"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                    >
                      Most Popular
                    </motion.span>
                  </motion.div>
                )}

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <motion.div
                    className="p-2 bg-indigo-50 rounded-full text-indigo-600"
                    whileHover={{ rotate: 15 }}
                    animate={{
                      scale: [1, 1.1, 1],
                      backgroundColor: [
                        "rgba(238, 242, 255, 1)",
                        "rgba(224, 231, 255, 1)",
                        "rgba(238, 242, 255, 1)",
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                      delay: index * 0.3,
                    }}
                  >
                    {plan.icon}
                  </motion.div>
                </div>
                <div className="mb-6 relative z-10">
                  <div className="flex items-baseline">
                    <span className="text-gray-400 mr-1">₹</span>
                    <motion.span
                      className="text-4xl font-bold"
                      animate={{
                        color: plan.popular
                          ? ["#4F46E5", "#6366F1", "#4F46E5"]
                          : "#1F2937",
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                      }}
                    >
                      {plan.price}
                    </motion.span>
                    <span className="text-gray-600 ml-1">/year</span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                          : "bg-gray-300"
                      }`}
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    />
                  </div>
                </div>
                <ul className="space-y-4 mb-8 relative z-10">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.1 + index * 0.1,
                      }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`mr-2 ${
                          plan.popular ? "text-indigo-500" : "text-green-500"
                        }`}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative z-10"
                >
                  <Link
                    href="https://wa.me/+918849779702"
                    target="_blank"
                    className={`block w-full text-center px-6 py-3 rounded-md font-medium relative overflow-hidden group ${
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {plan.popular && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{
                          backgroundPosition: [
                            "0% center",
                            "100% center",
                            "0% center",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                        style={{
                          backgroundSize: "200% 100%",
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center">
                      Start Your FREE Demo
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="ml-1"
                      >
                        <ArrowRight className="h-4 w-4 inline" />
                      </motion.span>
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-indigo opacity-[0.02] pointer-events-none"></div>
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-50"
          animate={{
            scale: [0.9, 1.1, 0.9],
            rotate: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
          }}
        />
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-purple-50"
          animate={{
            scale: [1.1, 0.9, 1.1],
            rotate: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Contact us directly to get started with InvManager
              </p>
            </motion.div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-70"></div>
                <div className="flex items-center space-x-4 relative z-10">
                  <motion.div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full text-white"
                    whileHover={{ rotate: 15 }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                    }}
                  >
                    <Phone className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                    <motion.a
                      href="tel:+918849779702"
                      className="text-gray-600 hover:text-indigo-600 transition-colors"
                      whileHover={{ color: "#4F46E5" }}
                    >
                      +918849779702
                    </motion.a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-70"></div>
                <div className="flex items-center space-x-4 relative z-10">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-full text-white"
                    whileHover={{ rotate: 15 }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                      delay: 0.5,
                    }}
                  >
                    <Mail className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                    <motion.a
                      href="mailto:poojangoyani@gmail.com"
                      className="text-gray-600 hover:text-indigo-600 transition-colors"
                      whileHover={{ color: "#4F46E5" }}
                    >
                      poojangoyani@gmail.com
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block relative"
              >
                <motion.div
                  className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70 blur-sm"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                />
                <Link
                  href="/admin"
                  className="relative inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg"
                >
                  <motion.span
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                    }}
                  >
                    Go to Admin Dashboard
                  </motion.span>
                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                    }}
                  >
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose InvManager?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  For Business Owners
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Complete visibility of your inventory</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Reduce costs and increase profits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Make data-driven decisions</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  For Operations Teams
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Automate manual processes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Real-time stock updates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Streamlined workflows</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {/* Simplified animated gradient overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_75%)]"></div>
          </div>

          {/* Simplified animated circles */}
          <motion.div
            className="absolute right-0 top-0 h-40 w-40 bg-white rounded-full opacity-20"
            style={{ top: "10%", right: "5%" }}
            animate={{
              scale: [1, 1.2, 1],
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute left-0 bottom-0 h-60 w-60 bg-white rounded-full opacity-10"
            style={{ bottom: "5%", left: "5%" }}
            animate={{
              scale: [1, 0.9, 1],
              y: [0, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut",
            }}
          />

          {/* Simplified moving light beam */}
          <motion.div
            className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 -skew-y-6"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "linear",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              className="text-4xl font-bold text-white mb-4"
              animate={{
                textShadow: [
                  "0px 0px 0px rgba(255,255,255,0)",
                  "0px 0px 10px rgba(255,255,255,0.3)",
                  "0px 0px 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Don&apos;t Let Poor Inventory Management Cost You Another Day!
            </motion.h2>
            <motion.p
              className="text-xl text-indigo-100 mb-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Join 500+ successful businesses that have transformed their
              inventory management with InvManager. Start your FREE 30-day trial
              today and see the difference!
            </motion.p>
            <motion.div
              className="mb-8 inline-block"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="animate-pulse">⏰</span>
                  <span>
                    Limited Time Offer: Get 2 Months FREE with Annual Plan
                  </span>
                </div>
              </div>
            </motion.div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="https://wa.me/+918849779702"
                target="_blank"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative inline-flex items-center px-8 py-3 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow-xl w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white opacity-70"></div>
                <motion.div
                  className="mr-2 relative z-10"
                  animate={{
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <Phone className="h-5 w-5" />
                </motion.div>
                <span className="relative z-10">Start Your FREE Trial Now</span>
              </motion.a>
              <motion.a
                href="mailto:poojangoyani@gmail.com"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative inline-flex items-center px-8 py-3 text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 shadow-xl w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70"></div>
                <motion.div
                  className="mr-2 relative z-10"
                  animate={{
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <Mail className="h-5 w-5" />
                </motion.div>
                <span className="relative z-10">Schedule a Demo</span>
              </motion.a>
            </div>
            <motion.p
              className="mt-6 text-sm text-indigo-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              ⭐️ 98% of businesses see ROI within the first month
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
