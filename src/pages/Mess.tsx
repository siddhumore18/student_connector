import React, { useState } from 'react';
import { Calendar, Clock, Star, Check, UtensilsCrossed, Leaf } from 'lucide-react';

const messMenus = [
  {
    id: '1',
    name: 'Central Mess',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    plans: {
      breakfast: 150,
      lunch: 180,
      dinner: 160,
      full: 450,
    },
    todayMenu: {
      breakfast: ['Poha', 'Samosa', 'Tea/Coffee', 'Fruits'],
      lunch: ['Rice', 'Dal', 'Sabji', 'Roti', 'Pickle', 'Curd'],
      dinner: ['Chapati', 'Rajma', 'Aloo Gobhi', 'Rice', 'Sweet'],
    },
    features: ['Vegetarian', 'Jain Options', 'Fresh Ingredients'],
    location: 'Block A, Main Campus',
  },
  {
    id: '2',
    name: 'North Campus Dining',
    rating: 4.3,
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
    plans: {
      breakfast: 140,
      lunch: 170,
      dinner: 150,
      full: 420,
    },
    todayMenu: {
      breakfast: ['Paratha', 'Chole', 'Lassi', 'Pickle'],
      lunch: ['Biryani', 'Raita', 'Curry', 'Salad'],
      dinner: ['Roti', 'Dal Makhani', 'Mixed Veg', 'Rice'],
    },
    features: ['North Indian', 'Organic', 'Late Night Service'],
    location: 'North Campus, Block C',
  },
];

const mealTimes = [
  { id: 'breakfast', name: 'Breakfast', time: '7:00 AM - 10:00 AM', icon: '🌅' },
  { id: 'lunch', name: 'Lunch', time: '12:00 PM - 3:00 PM', icon: '☀️' },
  { id: 'dinner', name: 'Dinner', time: '7:00 PM - 10:00 PM', icon: '🌙' },
];

export default function Mess() {
  const [selectedMess, setSelectedMess] = useState(messMenus[0]);
  const [selectedMeal, setSelectedMeal] = useState('lunch');
  const [showSubscription, setShowSubscription] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Campus Mess Services
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Subscribe to healthy, affordable meal plans and view daily menus from campus mess facilities.
        </p>
      </div>

      {/* Today's Highlight */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl text-white p-8 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Today's Special</h2>
            <p className="text-emerald-100 mb-4">Fresh Biryani with Raita at North Campus Dining</p>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                <Leaf className="w-4 h-4 mr-1" />
                Organic
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                <Star className="w-4 h-4 mr-1" />
                4.3 Rating
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹170</div>
            <div className="text-emerald-100">per meal</div>
          </div>
        </div>
      </div>

      {/* Mess Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Mess Facility</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {messMenus.map((mess) => (
            <div
              key={mess.id}
              onClick={() => setSelectedMess(mess)}
              className={`bg-white rounded-2xl shadow-sm border-2 cursor-pointer transition-all ${
                selectedMess.id === mess.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={mess.image}
                    alt={mess.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{mess.name}</h4>
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">{mess.rating} rating</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{mess.location}</p>
                    <div className="flex flex-wrap gap-2">
                      {mess.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Menu */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Today's Menu - {selectedMess.name}</h3>
            
            {/* Meal Time Selector */}
            <div className="flex space-x-4 mb-6">
              {mealTimes.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => setSelectedMeal(meal.id)}
                  className={`flex-1 p-4 rounded-xl text-center transition-colors ${
                    selectedMeal === meal.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-1">{meal.icon}</div>
                  <div className="font-medium">{meal.name}</div>
                  <div className="text-xs opacity-75">{meal.time}</div>
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-2 gap-4">
              {selectedMess.todayMenu[selectedMeal as keyof typeof selectedMess.todayMenu].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-900">{item}</span>
                </div>
              ))}
            </div>

            {/* Timing Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-2 text-blue-700">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {mealTimes.find(m => m.id === selectedMeal)?.time}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Subscription Plans</h3>
            
            <div className="space-y-4">
              {Object.entries(selectedMess.plans).map(([plan, price]) => (
                <div
                  key={plan}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">{plan}</h4>
                    <span className="text-lg font-bold text-blue-600">₹{price}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Per day</p>
                  <button
                    onClick={() => setShowSubscription(true)}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
              ))}
            </div>

            {/* Monthly Calculation */}
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
              <h4 className="font-medium text-emerald-800 mb-2">Full Plan (Monthly)</h4>
              <div className="text-2xl font-bold text-emerald-600">
                ₹{(selectedMess.plans.full * 30).toLocaleString()}
              </div>
              <p className="text-sm text-emerald-700">Save ₹2,500/month vs individual meals</p>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">What's Included</h4>
              <div className="space-y-2">
                {[
                  'Fresh, hygienic food',
                  'Flexible timing',
                  'Monthly refund policy',
                  'Special diet options',
                  'Weekend variety menu',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Preview */}
      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">This Week's Special Menu</h3>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="font-medium text-gray-900 mb-2">{day}</div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  {index === 0 && 'Chole Bhature'}
                  {index === 1 && 'Pasta Day'}
                  {index === 2 && 'South Indian'}
                  {index === 3 && 'Biryani Special'}
                  {index === 4 && 'Chinese Corner'}
                  {index === 5 && 'Pizza Night'}
                  {index === 6 && 'Traditional Thali'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}