import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UtensilsCrossed, Building, ArrowRight, Star, MapPin, Clock } from 'lucide-react';

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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Complete
              <span className="block text-yellow-300">Campus Living Solution</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Find roommates, subscribe to mess services, and discover perfect housing - all in one platform designed for students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/roommates"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/housing"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Housing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Campus Life
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions for all your campus living needs in one convenient platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.href}
                className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                  <span className="font-medium">Learn more</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Students</h2>
            <p className="text-xl text-gray-300">Join thousands of students who found their perfect campus life solution.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
          <p className="text-xl text-gray-600">Real experiences from our community members.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.course}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Campus Life?</h2>
          <p className="text-xl mb-8 text-blue-100">Join CampusConnect today and discover a better way to live on campus.</p>
          <Link
            to="/roommates"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}