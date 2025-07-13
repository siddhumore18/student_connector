export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'student' | 'admin';
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  gender: 'male' | 'female' | 'any';
  budget: {
    min: number;
    max: number;
  };
  lifestyle: 'quiet' | 'social' | 'moderate';
  cleanliness: 'neat' | 'average' | 'flexible';
  smoking: boolean;
  pets: boolean;
}

export interface RoommateProfile {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  location: string;
  budget: number;
  availableFrom: string;
  preferences: UserPreferences;
  contactInfo: {
    whatsapp?: string;
    telegram?: string;
  };
  verified: boolean;
  createdAt: string;
}

export interface Housing {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'pg' | 'hostel';
  location: string;
  rent: number;
  deposit: number;
  amenities: string[];
  images: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  available: boolean;
  createdAt: string;
}

export interface MessMenu {
  id: string;
  date: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
  specialNote?: string;
}

export interface MessSubscription {
  id: string;
  userId: string;
  plan: 'breakfast' | 'lunch' | 'dinner' | 'full';
  price: number;
  startDate: string;
  endDate: string;
  active: boolean;
}
export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio: string;
  course: string;
  year: string;
  college: string;
  preferences: UserPreferences;
  verified: boolean;
  createdAt: string;
}

export interface MessProvider {
  id: string;
  providerName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  menuSample: string;
  pricing: {
    breakfast: number;
    lunch: number;
    dinner: number;
    full: number;
  };
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface HousingListing {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'pg' | 'hostel';
  location: string;
  rent: number;
  deposit: number;
  amenities: string[];
  images: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  ownerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}