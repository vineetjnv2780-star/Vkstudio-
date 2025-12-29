import React from 'react';

export interface WorkEntry {
  id: string;
  date: string;
  
  // Customer Details
  customerName?: string;
  fatherName?: string;
  mobileNumber?: string;
  customerPhoto?: string; // Base64 string

  // Vehicle Details
  bikeNumber?: string;
  engineNumber?: string;
  chassisNumber?: string;
  vehiclePhoto?: string; // Base64 string

  // Insurance Details
  insuranceStart?: string;
  insuranceEnd?: string;
  thirdPartyStart?: string;
  thirdPartyEnd?: string;

  // KYC
  kycPhotos?: string[]; // Array of Base64 strings

  // Permanent Address
  permanentAddress?: string;
  permanentLandmark?: string;
  permanentPhotos?: string[];

  // Correspondence Address
  correspondenceAddress?: string;
  correspondenceLandmark?: string;
  correspondencePhotos?: string[];

  // Bike Location
  bikeLocationAddress?: string;
  bikeLocationLandmark?: string;
  bikeLocationPhotos?: string[];
  
  // Legacy/Generic fields (kept for backward compatibility if needed)
  title?: string;
  description?: string;
  category?: string;
  amount?: number;
}

export enum AppRoute {
  HOME = '/',
  FLASHLIGHT = '/flashlight',
  CALCULATOR = '/calculator',
  WORK = '/work',
}

export interface NavigationItem {
  name: string;
  route: AppRoute;
  icon: React.ReactNode;
  color: string;
}