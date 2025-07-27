import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UtensilsCrossed, Building, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const features = [
  {
    icon: Users,
    title: 'Find Perfect Roommates',
    description: 'Connect with compatible roommates based on lifestyle, budget, and preferences.',
    href: '/roommates',
    color: 'bg-blue-500',
  },
  {
    icon: UtensilsCrossed,
    title: 'Mess Services',
    description: 'Subscribe to meal plans and view daily menus from campus mess facilities.',
    href: '/mess',
    color: 'bg-emerald-500',
  },
  {
    icon: Building,
    title: 'Housing Solutions',
    description: 'Discover apartments, PGs, and shared accommodations near your campus.',
    href: '/housing',
    color: 'bg-orange-500',
  },
];

const stats = [
  { label: 'Active Students', value: '2,500+' },
  { label: 'Successful Matches', value: '800+' },
  { label: 'Housing Options', value: '150+' },
  { label: 'Mess Partners', value: '25+' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    course: 'B.Tech CSE',
    text: 'Found my perfect roommate through CampusConnect. The matching system really works!',
    rating: 5,
  },
  {
    name: 'Arjun Patel',
    course: 'MBA',
    text: 'The mess subscription service saved me so much time. Great quality food!',
    rating: 5,
  },
  {
    name: 'Sneha Gupta',
    course: 'M.Sc Physics',
    text: 'Found a great PG near campus with all amenities. Highly recommend!',
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-emerald-700 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-6"
          >
            Your Complete <span className="block text-yellow-300">Campus Living Solution</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto"
          >
            Find roommates, subscribe to mess services, and discover perfect housing - all in one platform designed for students.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/roommates" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 shadow-lg transition">
              Get Started <ArrowRight className="inline ml-2 w-5 h-5" />
            </Link>
            <Link to="/housing" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition">
              Explore Housing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2 className="text-4xl font-bold text-gray-900 mb-4" variants={fadeInUp}>
            Everything You Need for Campus Life
          </motion.h2>
          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto" variants={fadeInUp}>
            Comprehensive solutions for all your campus living needs in one convenient platform.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link to={feature.href} className="text-blue-600 font-medium flex items-center group-hover:text-blue-800 transition">
                  Learn more <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}

        </div>

        
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold mb-4">Trusted by Students</h2>
          <p className="text-lg text-gray-400">Join thousands of students who found their perfect campus life solution.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-yellow-400 mb-1">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-4xl font-bold mb-4 text-gray-900">
            What Students Say
          </motion.h2>
          <motion.p variants={fadeInUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-lg text-gray-600">
            Real experiences from our community members.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
              variants={fadeInUp}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{t.text}"</p>
              <div>
                <div className="font-semibold text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.course}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-emerald-700 text-white py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Campus Life?</h2>
          <p className="text-lg text-blue-100 mb-8">Join CampusConnect today and discover a better way to live on campus.</p>
          <Link to="/roommates" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition shadow-lg">
            Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
        
      </section>
      
    </div>
    
  );
}
