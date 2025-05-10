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
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Package className="w-6 h-6" />,
    title: "Product Management",
    description:
      "Comprehensive product tracking with SKU support, variants, and buffer stock management.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Stock Management",
    description:
      "Real-time stock level tracking with buffer alerts and movement history.",
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: "Analytics & Reporting",
    description:
      "Advanced analytics with seasonal trends and stock turnover insights.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Vendor & Customer Management",
    description: "Complete vendor and customer tracking with purchase history.",
  },
];

const pricingPlans = [
  {
    name: "Basic",
    price: "24,999",
    features: [
      "Up to 100 products",
      "Basic stock management",
      "Simple reporting",
      "Single user access",
      "Email support",
    ],
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Professional",
    price: "49,999",
    features: [
      "Up to 500 products",
      "Advanced analytics",
      "Up to 5 user accounts",
      "Priority email support",
      "API access",
    ],
    popular: true,
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: "Enterprise",
    price: "99,999",
    features: [
      "Unlimited products",
      "Custom reporting",
      "Unlimited user accounts",
      "24/7 priority support",
      "Custom integrations",
    ],
    icon: <Sparkles className="w-5 h-5" />,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
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
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  }}
                  className="mr-2 text-indigo-600"
                >
                  <Package className="h-8 w-8" />
                </motion.div>
                <motion.span
                  className="text-2xl font-bold text-indigo-600"
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
              >
                <Link
                  href="/admin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Admin
                  <ExternalLink className="ml-2 h-4 w-4" />
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
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
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
                Transform
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Your
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-indigo-600"
              >
                Inventory Management
              </motion.span>
            </motion.h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Powerful, intuitive, and comprehensive inventory management
              solution for businesses of all sizes.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link
                href="/admin"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"
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
                  Go to Dashboard
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
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Background floating elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute h-20 w-20 rounded-full bg-indigo-100 opacity-70"
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
              className="absolute h-16 w-16 rounded-full bg-indigo-200 opacity-50"
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
              className="absolute h-24 w-24 rounded-full bg-indigo-100 opacity-60"
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
              className="absolute h-12 w-12 rounded-full bg-pink-100 opacity-60"
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
              className="absolute h-16 w-16 rounded-full bg-yellow-100 opacity-60"
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900">
                <motion.span
                  animate={{
                    color: ["#4F46E5", "#6366F1", "#4F46E5"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Powerful
                </motion.span>{" "}
                Features
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to manage your inventory effectively
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
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  className="text-indigo-600 mb-4"
                  whileHover={{ rotate: [0, 15, 0], scale: 1.1 }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                    delay: index * 0.5,
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Choose the plan that&apos;s right for your business
              </p>
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
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className={`p-8 bg-white rounded-lg shadow-lg transition-all duration-300 ${
                  plan.popular ? "ring-2 ring-indigo-600" : ""
                }`}
              >
                {plan.popular && (
                  <motion.span
                    className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4"
                    animate={{
                      scale: [1, 1.05, 1],
                      backgroundColor: [
                        "rgba(237, 233, 254, 1)",
                        "rgba(224, 231, 255, 1)",
                        "rgba(237, 233, 254, 1)",
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                    }}
                  >
                    Most Popular
                  </motion.span>
                )}
                <div className="flex items-center justify-between mb-4">
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
                <div className="mb-6">
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
                    ₹{plan.price}
                  </motion.span>
                  <span className="text-gray-600">/year</span>
                </div>
                <ul className="space-y-4 mb-8">
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
                        className="text-green-500 mr-2"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="#contact"
                    className={`block w-full text-center px-6 py-3 rounded-md font-medium ${
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
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
                className="p-6 bg-white rounded-lg shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="bg-indigo-100 p-3 rounded-full text-indigo-600"
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
                    }}
                  >
                    <Phone className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                    <motion.p
                      className="text-gray-600"
                      whileHover={{ color: "#4F46E5" }}
                    >
                      +918849779702
                    </motion.p>
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
                className="p-6 bg-white rounded-lg shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="bg-indigo-100 p-3 rounded-full text-indigo-600"
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
                      delay: 0.5,
                    }}
                  >
                    <Mail className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                    <motion.p
                      className="text-gray-600"
                      whileHover={{ color: "#4F46E5" }}
                    >
                      poojangoyani@gmail.com
                    </motion.p>
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
                className="inline-block"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(79, 70, 229, 0.2)",
                    "0 0 0 15px rgba(79, 70, 229, 0)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
              >
                <Link
                  href="/admin"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 relative overflow-hidden">
        <motion.div
          className="absolute right-0 top-0 h-40 w-40 bg-indigo-500 rounded-full opacity-50"
          style={{ top: "10%", right: "5%" }}
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
          }}
        />
        <motion.div
          className="absolute left-0 bottom-0 h-60 w-60 bg-indigo-500 rounded-full opacity-30"
          style={{ bottom: "5%", left: "5%" }}
          animate={{
            scale: [1, 1.1, 1],
            y: [0, 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of businesses already using InvManager
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="tel:+918849779702"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow-lg w-full sm:w-auto"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </motion.a>
              <motion.a
                href="mailto:poojangoyani@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow-lg w-full sm:w-auto"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </motion.a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(255, 255, 255, 0.2)",
                    "0 0 0 15px rgba(255, 255, 255, 0)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:bg-opacity-10 w-full"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      repeatDelay: 1,
                    }}
                    className="mr-2"
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                  Go to Dashboard
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
