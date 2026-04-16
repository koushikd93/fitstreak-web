import { useState, useEffect, useRef, useCallback } from "react";

const FOOD_DB = [
  { name: "Idli (2 pieces)", cal: 130, protein: 4, carbs: 26, fat: 1, category: "breakfast", region: "South India" },
  { name: "Masala Dosa", cal: 206, protein: 5, carbs: 30, fat: 8, category: "breakfast", region: "South India" },
  { name: "Poha (1 plate)", cal: 180, protein: 4, carbs: 32, fat: 5, category: "breakfast", region: "Central India" },
  { name: "Aloo Paratha", cal: 300, protein: 7, carbs: 40, fat: 13, category: "breakfast", region: "North India" },
  { name: "Upma (1 bowl)", cal: 190, protein: 5, carbs: 28, fat: 7, category: "breakfast", region: "South India" },
  { name: "Chole Bhature (1 plate)", cal: 450, protein: 14, carbs: 55, fat: 20, category: "breakfast", region: "North India" },
  { name: "Puri Sabzi (3 puris)", cal: 380, protein: 9, carbs: 48, fat: 17, category: "breakfast", region: "North India" },
  { name: "Medu Vada (2 pieces)", cal: 220, protein: 8, carbs: 22, fat: 12, category: "breakfast", region: "South India" },
  { name: "Appam with Stew", cal: 250, protein: 6, carbs: 35, fat: 9, category: "breakfast", region: "Kerala" },
  { name: "Puttu & Kadala Curry", cal: 310, protein: 10, carbs: 45, fat: 10, category: "breakfast", region: "Kerala" },
  { name: "Pesarattu", cal: 150, protein: 8, carbs: 20, fat: 4, category: "breakfast", region: "Andhra Pradesh" },
  { name: "Thepla (2 pieces)", cal: 200, protein: 5, carbs: 28, fat: 8, category: "breakfast", region: "Gujarat" },
  { name: "Bread Omelette (2 eggs)", cal: 280, protein: 16, carbs: 24, fat: 14, category: "breakfast", region: "Pan India" },
  { name: "Momos Steamed (6 pcs)", cal: 210, protein: 10, carbs: 28, fat: 6, category: "breakfast", region: "Nepal/NE India" },
  { name: "Roti Tarkari (Nepal)", cal: 320, protein: 9, carbs: 42, fat: 12, category: "breakfast", region: "Nepal" },
  { name: "Hoppers + Egg (Sri Lanka)", cal: 220, protein: 9, carbs: 30, fat: 7, category: "breakfast", region: "Sri Lanka" },
  { name: "Plain Rice (1 cup)", cal: 206, protein: 4, carbs: 45, fat: 0.4, category: "lunch", region: "Pan India" },
  { name: "Rajma Chawal (1 plate)", cal: 420, protein: 16, carbs: 62, fat: 10, category: "lunch", region: "North India" },
  { name: "Chicken Biryani (1 plate)", cal: 490, protein: 28, carbs: 55, fat: 16, category: "lunch", region: "Hyderabad" },
  { name: "Veg Biryani (1 plate)", cal: 350, protein: 8, carbs: 52, fat: 12, category: "lunch", region: "Pan India" },
  { name: "Dal Rice (1 plate)", cal: 360, protein: 14, carbs: 55, fat: 7, category: "lunch", region: "Pan India" },
  { name: "Fish Curry Rice", cal: 400, protein: 24, carbs: 48, fat: 12, category: "lunch", region: "Bengal/Kerala" },
  { name: "Curd Rice (1 bowl)", cal: 230, protein: 7, carbs: 38, fat: 5, category: "lunch", region: "South India" },
  { name: "Sambar Rice", cal: 310, protein: 10, carbs: 50, fat: 6, category: "lunch", region: "South India" },
  { name: "Egg Curry + Rice", cal: 380, protein: 18, carbs: 48, fat: 12, category: "lunch", region: "Pan India" },
  { name: "Mutton Biryani (1 plate)", cal: 550, protein: 32, carbs: 55, fat: 20, category: "lunch", region: "Lucknow" },
  { name: "Khichdi (1 bowl)", cal: 220, protein: 8, carbs: 35, fat: 5, category: "lunch", region: "Pan India" },
  { name: "Chapati (2 pcs)", cal: 140, protein: 5, carbs: 28, fat: 1, category: "lunch", region: "Pan India" },
  { name: "Paneer Butter Masala", cal: 340, protein: 14, carbs: 12, fat: 26, category: "lunch", region: "North India" },
  { name: "Dal Makhani (1 bowl)", cal: 260, protein: 12, carbs: 30, fat: 10, category: "lunch", region: "Punjab" },
  { name: "Butter Chicken", cal: 440, protein: 30, carbs: 10, fat: 32, category: "lunch", region: "Punjab" },
  { name: "Palak Paneer", cal: 280, protein: 14, carbs: 10, fat: 20, category: "lunch", region: "North India" },
  { name: "Aloo Gobi (1 bowl)", cal: 180, protein: 4, carbs: 22, fat: 9, category: "lunch", region: "North India" },
  { name: "Mixed Veg Curry", cal: 160, protein: 4, carbs: 18, fat: 8, category: "lunch", region: "Pan India" },
  { name: "Kadai Chicken", cal: 380, protein: 28, carbs: 8, fat: 26, category: "lunch", region: "North India" },
  { name: "Tandoori Chicken (2 pcs)", cal: 260, protein: 32, carbs: 4, fat: 12, category: "lunch", region: "Punjab" },
  { name: "Naan (1 pc)", cal: 260, protein: 8, carbs: 42, fat: 6, category: "lunch", region: "North India" },
  { name: "Thali - Veg (full)", cal: 620, protein: 18, carbs: 85, fat: 22, category: "lunch", region: "Pan India" },
  { name: "Thali - Non Veg (full)", cal: 780, protein: 35, carbs: 80, fat: 30, category: "lunch", region: "Pan India" },
  { name: "Kottu Roti (Sri Lanka)", cal: 420, protein: 15, carbs: 45, fat: 18, category: "lunch", region: "Sri Lanka" },
  { name: "Hilsa Fish Curry (Bangladesh)", cal: 350, protein: 22, carbs: 8, fat: 26, category: "lunch", region: "Bangladesh" },
  { name: "Dal Bhat (Nepal)", cal: 480, protein: 16, carbs: 72, fat: 10, category: "lunch", region: "Nepal" },
  { name: "Bhutanese Red Rice", cal: 210, protein: 5, carbs: 44, fat: 1, category: "lunch", region: "Bhutan" },
  { name: "Samosa (1 pc)", cal: 150, protein: 3, carbs: 18, fat: 8, category: "snack", region: "Pan India" },
  { name: "Vada Pav", cal: 290, protein: 6, carbs: 36, fat: 14, category: "snack", region: "Mumbai" },
  { name: "Pani Puri (6 pcs)", cal: 180, protein: 3, carbs: 30, fat: 6, category: "snack", region: "Pan India" },
  { name: "Bhel Puri", cal: 200, protein: 4, carbs: 32, fat: 7, category: "snack", region: "Mumbai" },
  { name: "Pakora / Bhajiya (5 pcs)", cal: 250, protein: 5, carbs: 22, fat: 16, category: "snack", region: "Pan India" },
  { name: "Kachori (1 pc)", cal: 190, protein: 4, carbs: 22, fat: 10, category: "snack", region: "Rajasthan" },
  { name: "Dhokla (3 pcs)", cal: 140, protein: 5, carbs: 22, fat: 4, category: "snack", region: "Gujarat" },
  { name: "Roasted Makhana (1 cup)", cal: 90, protein: 3, carbs: 15, fat: 1, category: "snack", region: "Bihar" },
  { name: "Banana Chips (50g)", cal: 260, protein: 1, carbs: 30, fat: 16, category: "snack", region: "Kerala" },
  { name: "Murukku (50g)", cal: 230, protein: 4, carbs: 28, fat: 12, category: "snack", region: "South India" },
  { name: "Egg Puff (1 pc)", cal: 240, protein: 8, carbs: 20, fat: 14, category: "snack", region: "Pan India" },
  { name: "Momos Fried (6 pcs)", cal: 310, protein: 10, carbs: 30, fat: 16, category: "snack", region: "Nepal/NE India" },
  { name: "Sel Roti (Nepal)", cal: 180, protein: 3, carbs: 32, fat: 5, category: "snack", region: "Nepal" },
  { name: "Masala Chai (1 cup)", cal: 80, protein: 2, carbs: 12, fat: 3, category: "drink", region: "Pan India" },
  { name: "Lassi Sweet (1 glass)", cal: 220, protein: 6, carbs: 35, fat: 6, category: "drink", region: "Punjab" },
  { name: "Lassi Salted (1 glass)", cal: 120, protein: 6, carbs: 10, fat: 5, category: "drink", region: "Punjab" },
  { name: "Buttermilk / Chaas", cal: 40, protein: 2, carbs: 5, fat: 1, category: "drink", region: "Pan India" },
  { name: "Mango Lassi", cal: 260, protein: 6, carbs: 42, fat: 7, category: "drink", region: "Pan India" },
  { name: "Filter Coffee (1 cup)", cal: 100, protein: 3, carbs: 14, fat: 4, category: "drink", region: "South India" },
  { name: "Nimbu Pani", cal: 45, protein: 0, carbs: 12, fat: 0, category: "drink", region: "Pan India" },
  { name: "Coconut Water (1 glass)", cal: 45, protein: 1, carbs: 9, fat: 0, category: "drink", region: "Pan India" },
  { name: "Sugarcane Juice", cal: 180, protein: 0, carbs: 44, fat: 0, category: "drink", region: "Pan India" },
  { name: "Thandai (1 glass)", cal: 210, protein: 5, carbs: 30, fat: 8, category: "drink", region: "North India" },
  { name: "Jal Jeera (1 glass)", cal: 30, protein: 0, carbs: 7, fat: 0, category: "drink", region: "Pan India" },
  { name: "Gulab Jamun (2 pcs)", cal: 300, protein: 5, carbs: 42, fat: 12, category: "sweet", region: "Pan India" },
  { name: "Rasgulla (2 pcs)", cal: 230, protein: 5, carbs: 40, fat: 5, category: "sweet", region: "Bengal" },
  { name: "Jalebi (2 pcs)", cal: 250, protein: 2, carbs: 40, fat: 10, category: "sweet", region: "Pan India" },
  { name: "Laddu (1 pc)", cal: 180, protein: 3, carbs: 24, fat: 9, category: "sweet", region: "Pan India" },
  { name: "Halwa (1 bowl)", cal: 320, protein: 4, carbs: 42, fat: 16, category: "sweet", region: "Pan India" },
  { name: "Kheer / Payasam (1 bowl)", cal: 240, protein: 6, carbs: 38, fat: 8, category: "sweet", region: "Pan India" },
  { name: "Barfi (2 pcs)", cal: 200, protein: 4, carbs: 28, fat: 9, category: "sweet", region: "North India" },
  { name: "Sandesh (2 pcs)", cal: 160, protein: 5, carbs: 24, fat: 5, category: "sweet", region: "Bengal" },
  { name: "Mysore Pak (1 pc)", cal: 210, protein: 3, carbs: 22, fat: 13, category: "sweet", region: "Karnataka" },
  { name: "Banana (1 medium)", cal: 105, protein: 1, carbs: 27, fat: 0.4, category: "fruit", region: "Pan India" },
  { name: "Mango (1 cup sliced)", cal: 100, protein: 1, carbs: 25, fat: 0.6, category: "fruit", region: "Pan India" },
  { name: "Apple (1 medium)", cal: 95, protein: 0.5, carbs: 25, fat: 0.3, category: "fruit", region: "Pan India" },
  { name: "Papaya (1 cup)", cal: 62, protein: 1, carbs: 16, fat: 0.4, category: "fruit", region: "Pan India" },
  { name: "Guava (1 medium)", cal: 68, protein: 2.5, carbs: 14, fat: 1, category: "fruit", region: "Pan India" },
  { name: "Watermelon (1 cup)", cal: 46, protein: 1, carbs: 12, fat: 0.2, category: "fruit", region: "Pan India" },
  { name: "Pomegranate (1 cup)", cal: 144, protein: 3, carbs: 33, fat: 2, category: "fruit", region: "Pan India" },
  { name: "Chikoo / Sapota (1 pc)", cal: 83, protein: 0.4, carbs: 20, fat: 1, category: "fruit", region: "Pan India" },
  // North Indian Expanded
  { name: "Chole (1 bowl)", cal: 240, protein: 12, carbs: 32, fat: 8, category: "lunch", region: "North India" },
  { name: "Kadhi Pakora (1 bowl)", cal: 220, protein: 6, carbs: 18, fat: 14, category: "lunch", region: "North India" },
  { name: "Stuffed Paratha (1 pc)", cal: 260, protein: 6, carbs: 34, fat: 12, category: "breakfast", region: "North India" },
  { name: "Gobi Paratha (1 pc)", cal: 240, protein: 5, carbs: 32, fat: 11, category: "breakfast", region: "North India" },
  { name: "Paneer Tikka (6 pcs)", cal: 280, protein: 18, carbs: 8, fat: 20, category: "snack", region: "North India" },
  { name: "Baingan Bharta (1 bowl)", cal: 160, protein: 3, carbs: 14, fat: 10, category: "lunch", region: "North India" },
  { name: "Shahi Paneer", cal: 360, protein: 16, carbs: 14, fat: 28, category: "lunch", region: "North India" },
  { name: "Malai Kofta", cal: 400, protein: 12, carbs: 22, fat: 30, category: "lunch", region: "North India" },
  { name: "Chana Masala (1 bowl)", cal: 230, protein: 12, carbs: 34, fat: 6, category: "lunch", region: "North India" },
  { name: "Dahi Bhalla (3 pcs)", cal: 200, protein: 6, carbs: 28, fat: 8, category: "snack", region: "North India" },
  { name: "Kulcha (1 pc)", cal: 280, protein: 7, carbs: 44, fat: 8, category: "lunch", region: "Punjab" },
  { name: "Rumali Roti (1 pc)", cal: 120, protein: 4, carbs: 22, fat: 2, category: "lunch", region: "North India" },
  { name: "Rabdi (1 bowl)", cal: 280, protein: 8, carbs: 36, fat: 12, category: "sweet", region: "North India" },
  { name: "Matar Paneer (1 bowl)", cal: 300, protein: 14, carbs: 16, fat: 20, category: "lunch", region: "North India" },
  { name: "Dal Tadka (1 bowl)", cal: 200, protein: 10, carbs: 28, fat: 6, category: "lunch", region: "Pan India" },
  { name: "Jeera Rice (1 plate)", cal: 240, protein: 5, carbs: 46, fat: 4, category: "lunch", region: "Pan India" },
  // South Indian Expanded
  { name: "Rava Dosa", cal: 180, protein: 4, carbs: 26, fat: 7, category: "breakfast", region: "South India" },
  { name: "Uttapam (1 pc)", cal: 200, protein: 5, carbs: 30, fat: 6, category: "breakfast", region: "South India" },
  { name: "Bisi Bele Bath (1 plate)", cal: 340, protein: 10, carbs: 52, fat: 10, category: "lunch", region: "Karnataka" },
  { name: "Rasam (1 bowl)", cal: 60, protein: 2, carbs: 10, fat: 1, category: "lunch", region: "South India" },
  { name: "Coconut Chutney (2 tbsp)", cal: 50, protein: 1, carbs: 4, fat: 3, category: "snack", region: "South India" },
  { name: "Pongal (1 bowl)", cal: 260, protein: 8, carbs: 38, fat: 8, category: "breakfast", region: "Tamil Nadu" },
  { name: "Lemon Rice (1 plate)", cal: 280, protein: 5, carbs: 48, fat: 8, category: "lunch", region: "South India" },
  { name: "Tomato Rice (1 plate)", cal: 270, protein: 5, carbs: 46, fat: 7, category: "lunch", region: "South India" },
  { name: "Tamarind Rice (1 plate)", cal: 290, protein: 5, carbs: 50, fat: 8, category: "lunch", region: "South India" },
  { name: "Avial (1 bowl)", cal: 140, protein: 3, carbs: 12, fat: 9, category: "lunch", region: "Kerala" },
  { name: "Thoran (1 bowl)", cal: 120, protein: 3, carbs: 10, fat: 8, category: "lunch", region: "Kerala" },
  { name: "Kerala Fish Fry (2 pcs)", cal: 280, protein: 22, carbs: 10, fat: 18, category: "lunch", region: "Kerala" },
  { name: "Chicken 65 (6 pcs)", cal: 320, protein: 24, carbs: 12, fat: 20, category: "snack", region: "Andhra Pradesh" },
  { name: "Hyderabadi Haleem", cal: 350, protein: 20, carbs: 30, fat: 16, category: "lunch", region: "Hyderabad" },
  // Bihari / Eastern India
  { name: "Litti Chokha (2 pcs)", cal: 380, protein: 10, carbs: 52, fat: 14, category: "lunch", region: "Bihar" },
  { name: "Sattu Paratha (1 pc)", cal: 270, protein: 10, carbs: 36, fat: 10, category: "breakfast", region: "Bihar" },
  { name: "Sattu Sharbat (1 glass)", cal: 120, protein: 6, carbs: 20, fat: 2, category: "drink", region: "Bihar" },
  { name: "Thekua (3 pcs)", cal: 240, protein: 4, carbs: 36, fat: 10, category: "snack", region: "Bihar" },
  { name: "Chura Dahi (1 bowl)", cal: 280, protein: 6, carbs: 42, fat: 10, category: "breakfast", region: "Bihar" },
  { name: "Pua (2 pcs)", cal: 220, protein: 4, carbs: 30, fat: 10, category: "sweet", region: "Bihar" },
  { name: "Aloo Chokha (1 bowl)", cal: 160, protein: 3, carbs: 24, fat: 6, category: "lunch", region: "Bihar" },
  { name: "Machher Jhol (fish curry)", cal: 250, protein: 20, carbs: 10, fat: 14, category: "lunch", region: "Bengal" },
  { name: "Kosha Mangsho", cal: 380, protein: 28, carbs: 8, fat: 26, category: "lunch", region: "Bengal" },
  { name: "Shukto (1 bowl)", cal: 140, protein: 4, carbs: 16, fat: 7, category: "lunch", region: "Bengal" },
  { name: "Mishti Doi (1 bowl)", cal: 180, protein: 5, carbs: 28, fat: 5, category: "sweet", region: "Bengal" },
  { name: "Pitha (2 pcs)", cal: 200, protein: 3, carbs: 32, fat: 7, category: "sweet", region: "Assam/Bengal" },
  // Rajasthani / Gujarati
  { name: "Dal Baati Churma", cal: 520, protein: 14, carbs: 65, fat: 24, category: "lunch", region: "Rajasthan" },
  { name: "Gatte Ki Sabzi", cal: 240, protein: 8, carbs: 22, fat: 14, category: "lunch", region: "Rajasthan" },
  { name: "Ker Sangri", cal: 160, protein: 4, carbs: 18, fat: 8, category: "lunch", region: "Rajasthan" },
  { name: "Pyaaz Kachori (1 pc)", cal: 220, protein: 4, carbs: 26, fat: 12, category: "snack", region: "Rajasthan" },
  { name: "Ghevar (1 pc)", cal: 350, protein: 4, carbs: 48, fat: 16, category: "sweet", region: "Rajasthan" },
  { name: "Undhiyu (1 bowl)", cal: 280, protein: 8, carbs: 30, fat: 14, category: "lunch", region: "Gujarat" },
  { name: "Handvo (1 pc)", cal: 180, protein: 6, carbs: 24, fat: 7, category: "snack", region: "Gujarat" },
  { name: "Fafda Jalebi", cal: 340, protein: 6, carbs: 46, fat: 16, category: "breakfast", region: "Gujarat" },
  { name: "Khandvi (6 rolls)", cal: 150, protein: 5, carbs: 20, fat: 5, category: "snack", region: "Gujarat" },
  // NE India / Nepal / Sri Lanka / Bangladesh expanded
  { name: "Bamboo Shoot Curry", cal: 120, protein: 4, carbs: 12, fat: 6, category: "lunch", region: "NE India" },
  { name: "Pork with Axone", cal: 340, protein: 26, carbs: 6, fat: 24, category: "lunch", region: "Nagaland" },
  { name: "Thukpa (1 bowl)", cal: 280, protein: 12, carbs: 36, fat: 10, category: "lunch", region: "Nepal/Sikkim" },
  { name: "Gundruk Soup", cal: 60, protein: 3, carbs: 8, fat: 1, category: "lunch", region: "Nepal" },
  { name: "Yomari (2 pcs)", cal: 200, protein: 4, carbs: 34, fat: 6, category: "sweet", region: "Nepal" },
  { name: "Chatamari (1 pc)", cal: 220, protein: 8, carbs: 28, fat: 8, category: "lunch", region: "Nepal" },
  { name: "Panta Bhat (Bangladesh)", cal: 180, protein: 4, carbs: 38, fat: 1, category: "breakfast", region: "Bangladesh" },
  { name: "Beef Bhuna (Bangladesh)", cal: 380, protein: 30, carbs: 6, fat: 26, category: "lunch", region: "Bangladesh" },
  { name: "Pitha (Bangladesh, 2 pcs)", cal: 210, protein: 4, carbs: 34, fat: 7, category: "sweet", region: "Bangladesh" },
  { name: "Lamprais (Sri Lanka)", cal: 580, protein: 22, carbs: 65, fat: 24, category: "lunch", region: "Sri Lanka" },
  { name: "Kiribath (Sri Lanka)", cal: 240, protein: 5, carbs: 36, fat: 9, category: "breakfast", region: "Sri Lanka" },
  { name: "Watalappam (Sri Lanka)", cal: 260, protein: 6, carbs: 38, fat: 10, category: "sweet", region: "Sri Lanka" },
  { name: "Ema Datshi (Bhutan)", cal: 200, protein: 8, carbs: 12, fat: 14, category: "lunch", region: "Bhutan" },
  // Street Food
  { name: "Pav Bhaji (1 plate)", cal: 400, protein: 10, carbs: 52, fat: 18, category: "snack", region: "Mumbai" },
  { name: "Dabeli (1 pc)", cal: 200, protein: 4, carbs: 28, fat: 8, category: "snack", region: "Gujarat" },
  { name: "Aloo Tikki (2 pcs)", cal: 220, protein: 5, carbs: 30, fat: 10, category: "snack", region: "North India" },
  { name: "Chole Tikki", cal: 300, protein: 10, carbs: 38, fat: 13, category: "snack", region: "Delhi" },
  { name: "Dahi Puri (6 pcs)", cal: 220, protein: 5, carbs: 32, fat: 8, category: "snack", region: "Mumbai" },
  { name: "Misal Pav", cal: 350, protein: 12, carbs: 44, fat: 14, category: "breakfast", region: "Maharashtra" },
  { name: "Poha Jalebi", cal: 320, protein: 5, carbs: 52, fat: 11, category: "breakfast", region: "Madhya Pradesh" },
  { name: "Frankie / Kathi Roll", cal: 350, protein: 14, carbs: 36, fat: 16, category: "snack", region: "Kolkata" },
  { name: "Chaat Papdi", cal: 180, protein: 4, carbs: 26, fat: 7, category: "snack", region: "Pan India" },
  // Protein foods
  { name: "Boiled Eggs (2 pcs)", cal: 140, protein: 12, carbs: 1, fat: 10, category: "snack", region: "Pan India" },
  { name: "Paneer (100g raw)", cal: 260, protein: 18, carbs: 3, fat: 20, category: "snack", region: "Pan India" },
  { name: "Soya Chunks (1 cup cooked)", cal: 170, protein: 26, carbs: 10, fat: 2, category: "lunch", region: "Pan India" },
  { name: "Sprouts Chaat (1 bowl)", cal: 150, protein: 10, carbs: 22, fat: 3, category: "snack", region: "Pan India" },
  { name: "Chicken Breast Grilled (150g)", cal: 230, protein: 35, carbs: 0, fat: 10, category: "lunch", region: "Pan India" },
  { name: "Fish Tikka (4 pcs)", cal: 200, protein: 28, carbs: 4, fat: 8, category: "snack", region: "Pan India" },
  { name: "Mutton Keema (1 bowl)", cal: 320, protein: 24, carbs: 6, fat: 22, category: "lunch", region: "North India" },
  { name: "Egg Bhurji (2 eggs)", cal: 200, protein: 14, carbs: 4, fat: 14, category: "breakfast", region: "Pan India" },
  { name: "Greek Yogurt (1 cup)", cal: 130, protein: 12, carbs: 8, fat: 5, category: "snack", region: "Pan India" },
  { name: "Peanut Butter Toast (1 pc)", cal: 240, protein: 8, carbs: 24, fat: 14, category: "breakfast", region: "Pan India" },
  { name: "Whey Protein Shake", cal: 120, protein: 24, carbs: 3, fat: 1, category: "drink", region: "Pan India" },
  // Common additions
  { name: "Ghee (1 tbsp)", cal: 120, protein: 0, carbs: 0, fat: 14, category: "snack", region: "Pan India" },
  { name: "Pickle / Achar (1 tbsp)", cal: 30, protein: 0, carbs: 4, fat: 2, category: "snack", region: "Pan India" },
  { name: "Papad Roasted (1 pc)", cal: 40, protein: 2, carbs: 6, fat: 1, category: "snack", region: "Pan India" },
  { name: "Papad Fried (1 pc)", cal: 80, protein: 2, carbs: 6, fat: 5, category: "snack", region: "Pan India" },
  { name: "Raita (1 bowl)", cal: 90, protein: 4, carbs: 8, fat: 4, category: "lunch", region: "Pan India" },
  { name: "Green Salad (1 bowl)", cal: 35, protein: 2, carbs: 6, fat: 0.5, category: "lunch", region: "Pan India" },
  // More fruits
  { name: "Grapes (1 cup)", cal: 104, protein: 1, carbs: 27, fat: 0.2, category: "fruit", region: "Pan India" },
  { name: "Pineapple (1 cup)", cal: 82, protein: 1, carbs: 22, fat: 0.2, category: "fruit", region: "Pan India" },
  { name: "Jackfruit (1 cup)", cal: 155, protein: 3, carbs: 38, fat: 1, category: "fruit", region: "South India" },
  { name: "Litchi (10 pcs)", cal: 66, protein: 1, carbs: 17, fat: 0.4, category: "fruit", region: "Pan India" },
  { name: "Jamun (1 cup)", cal: 62, protein: 1, carbs: 14, fat: 0.3, category: "fruit", region: "Pan India" },
  { name: "Sitaphal / Custard Apple (1 pc)", cal: 136, protein: 2, carbs: 34, fat: 0.6, category: "fruit", region: "Pan India" },
  { name: "Amla / Indian Gooseberry (2 pcs)", cal: 30, protein: 0.5, carbs: 7, fat: 0.1, category: "fruit", region: "Pan India" },
  // More drinks
  { name: "Badam Milk (1 glass)", cal: 200, protein: 7, carbs: 26, fat: 8, category: "drink", region: "Pan India" },
  { name: "Haldi Doodh / Turmeric Milk", cal: 150, protein: 5, carbs: 18, fat: 6, category: "drink", region: "Pan India" },
  { name: "Aam Panna (1 glass)", cal: 90, protein: 0, carbs: 22, fat: 0, category: "drink", region: "North India" },
  { name: "Rooh Afza (1 glass)", cal: 130, protein: 0, carbs: 32, fat: 0, category: "drink", region: "Pan India" },
  { name: "Kanji (1 glass)", cal: 40, protein: 1, carbs: 8, fat: 0, category: "drink", region: "North India" },
  { name: "Solkadhi (1 glass)", cal: 60, protein: 1, carbs: 6, fat: 3, category: "drink", region: "Maharashtra" },
  { name: "Black Coffee (1 cup)", cal: 5, protein: 0, carbs: 1, fat: 0, category: "drink", region: "Pan India" },
  { name: "Green Tea (1 cup)", cal: 2, protein: 0, carbs: 0, fat: 0, category: "drink", region: "Pan India" },
  // More sweets
  { name: "Rasmalai (2 pcs)", cal: 270, protein: 8, carbs: 34, fat: 12, category: "sweet", region: "Bengal" },
  { name: "Kaju Katli (2 pcs)", cal: 200, protein: 4, carbs: 24, fat: 10, category: "sweet", region: "Pan India" },
  { name: "Peda (2 pcs)", cal: 160, protein: 4, carbs: 22, fat: 6, category: "sweet", region: "Pan India" },
  { name: "Malpua (2 pcs)", cal: 300, protein: 5, carbs: 40, fat: 14, category: "sweet", region: "Bihar/Bengal" },
  { name: "Phirni (1 bowl)", cal: 200, protein: 4, carbs: 32, fat: 6, category: "sweet", region: "North India" },
  { name: "Kulfi (1 stick)", cal: 160, protein: 4, carbs: 20, fat: 7, category: "sweet", region: "Pan India" },
  { name: "Imarti (1 pc)", cal: 150, protein: 2, carbs: 24, fat: 6, category: "sweet", region: "North India" },
];

const WORKOUTS_DB = [
  { id:1,name:"HIIT Inferno",type:"hiit",duration:15,difficulty:"intermediate",equipment:"bodyweight",xp:80,exercises:[{name:"Jumping Jacks",sets:3,reps:20,rest:15,tip:"Land softly on your feet",anim:"jj"},{name:"Burpees",sets:3,reps:10,rest:20,tip:"Keep core tight through the jump",anim:"burpee"},{name:"Mountain Climbers",sets:3,reps:20,rest:15,tip:"Drive knees to chest rapidly",anim:"mc"},{name:"High Knees",sets:3,reps:30,rest:15,tip:"Pump your arms for momentum",anim:"hk"},{name:"Squat Jumps",sets:3,reps:12,rest:20,tip:"Explode up, land in squat",anim:"squat"}]},
  { id:2,name:"Push-Up Mastery",type:"strength",duration:10,difficulty:"beginner",equipment:"bodyweight",xp:60,exercises:[{name:"Wall Push-Ups",sets:3,reps:15,rest:15,tip:"Keep body straight",anim:"pu"},{name:"Knee Push-Ups",sets:3,reps:12,rest:20,tip:"Lower chest to floor",anim:"pu"},{name:"Standard Push-Ups",sets:3,reps:8,rest:25,tip:"Elbows at 45 degrees",anim:"pu"},{name:"Diamond Push-Ups",sets:2,reps:6,rest:30,tip:"Diamond hand shape",anim:"pu"},{name:"Wide Push-Ups",sets:3,reps:10,rest:20,tip:"Hands wider than shoulders",anim:"pu"}]},
  { id:3,name:"Core Destroyer",type:"strength",duration:12,difficulty:"intermediate",equipment:"bodyweight",xp:70,exercises:[{name:"Plank Hold",sets:3,reps:"30s",rest:15,tip:"Squeeze glutes and brace core",anim:"plank"},{name:"Bicycle Crunches",sets:3,reps:20,rest:15,tip:"Elbow to opposite knee",anim:"crunch"},{name:"Leg Raises",sets:3,reps:12,rest:20,tip:"Lower back pressed to floor",anim:"jj"},{name:"Russian Twists",sets:3,reps:20,rest:15,tip:"Rotate from the torso",anim:"yoga"},{name:"Flutter Kicks",sets:3,reps:30,rest:15,tip:"Legs 6 inches off ground",anim:"mc"}]},
  { id:4,name:"Leg Day Express",type:"strength",duration:15,difficulty:"beginner",equipment:"bodyweight",xp:75,exercises:[{name:"Bodyweight Squats",sets:4,reps:15,rest:15,tip:"Push knees out over toes",anim:"squat"},{name:"Lunges",sets:3,reps:12,rest:20,tip:"Front knee over ankle",anim:"hk"},{name:"Glute Bridges",sets:3,reps:15,rest:15,tip:"Squeeze glutes at top",anim:"plank"},{name:"Calf Raises",sets:3,reps:20,rest:10,tip:"Full range of motion",anim:"squat"},{name:"Wall Sit",sets:3,reps:"30s",rest:20,tip:"Thighs parallel to ground",anim:"plank"}]},
  { id:5,name:"Zen Flow",type:"flexibility",duration:10,difficulty:"beginner",equipment:"bodyweight",xp:50,exercises:[{name:"Cat-Cow Stretch",sets:1,reps:10,rest:5,tip:"Sync with breath",anim:"yoga"},{name:"Downward Dog",sets:1,reps:"30s",rest:5,tip:"Heels toward floor",anim:"yoga"},{name:"Pigeon Pose",sets:1,reps:"30s",rest:5,tip:"Keep hips square",anim:"yoga"},{name:"Forward Fold",sets:1,reps:"45s",rest:5,tip:"Hinge at hips",anim:"yoga"},{name:"Child's Pose",sets:1,reps:"60s",rest:0,tip:"Breathe deeply",anim:"yoga"}]},
  { id:6,name:"Cardio Blitz",type:"hiit",duration:20,difficulty:"advanced",equipment:"bodyweight",xp:100,exercises:[{name:"Burpee Tuck Jumps",sets:4,reps:8,rest:20,tip:"Tuck knees at peak",anim:"burpee"},{name:"Speed Skaters",sets:4,reps:20,rest:15,tip:"Land softly",anim:"hk"},{name:"Plyo Lunges",sets:4,reps:16,rest:20,tip:"Switch legs mid-air",anim:"hk"},{name:"Bear Crawl",sets:3,reps:"20s",rest:20,tip:"Keep hips low",anim:"mc"},{name:"Star Jumps",sets:4,reps:12,rest:15,tip:"Fully extend",anim:"jj"}]},
  { id:7,name:"Morning Energizer",type:"hiit",duration:7,difficulty:"beginner",equipment:"bodyweight",xp:40,exercises:[{name:"Arm Circles",sets:2,reps:20,rest:10,tip:"Big circles, then small",anim:"jj"},{name:"Toe Touches",sets:2,reps:15,rest:10,tip:"Bend at hips",anim:"yoga"},{name:"Marching in Place",sets:2,reps:30,rest:10,tip:"Lift knees high",anim:"hk"},{name:"Jumping Jacks",sets:2,reps:20,rest:15,tip:"Stay light on feet",anim:"jj"}]},
  { id:8,name:"Six-Pack Challenge",type:"strength",duration:15,difficulty:"intermediate",equipment:"bodyweight",xp:85,exercises:[{name:"Sit-Ups",sets:3,reps:20,rest:15,tip:"Engage core, not neck",anim:"crunch"},{name:"Reverse Crunches",sets:3,reps:15,rest:15,tip:"Lift hips toward ceiling",anim:"crunch"},{name:"Side Plank Left",sets:2,reps:"30s",rest:10,tip:"Hips up, body straight",anim:"plank"},{name:"Side Plank Right",sets:2,reps:"30s",rest:10,tip:"Hips up, body straight",anim:"plank"},{name:"V-Ups",sets:3,reps:12,rest:20,tip:"Touch toes at top",anim:"crunch"},{name:"Mountain Climbers",sets:3,reps:30,rest:15,tip:"Fast pace",anim:"mc"}]},
  { id:9,name:"Glute Builder",type:"strength",duration:18,difficulty:"intermediate",equipment:"bodyweight",xp:90,exercises:[{name:"Sumo Squats",sets:4,reps:15,rest:15,tip:"Toes pointed out",anim:"squat"},{name:"Reverse Lunges",sets:3,reps:12,rest:20,tip:"Step back, drop knee",anim:"lunge"},{name:"Single Leg Glute Bridge",sets:3,reps:12,rest:15,tip:"Squeeze at the top",anim:"bridge"},{name:"Donkey Kicks",sets:3,reps:15,rest:10,tip:"Foot to ceiling",anim:"bridge"},{name:"Fire Hydrants",sets:3,reps:12,rest:10,tip:"Hip out to side",anim:"bridge"},{name:"Glute Bridges",sets:3,reps:20,rest:15,tip:"Drive through heels",anim:"bridge"}]},
  { id:10,name:"Tabata Torch",type:"hiit",duration:8,difficulty:"advanced",equipment:"bodyweight",xp:75,exercises:[{name:"Burpees",sets:4,reps:"20s",rest:10,tip:"Maximum effort",anim:"burpee"},{name:"Squat Jumps",sets:4,reps:"20s",rest:10,tip:"Explode up",anim:"squat"},{name:"Push-Ups",sets:4,reps:"20s",rest:10,tip:"As many as possible",anim:"pu"},{name:"Mountain Climbers",sets:4,reps:"20s",rest:10,tip:"Fast feet",anim:"mc"}]},
  { id:11,name:"Beginner Full Body",type:"strength",duration:12,difficulty:"beginner",equipment:"bodyweight",xp:55,exercises:[{name:"Bodyweight Squats",sets:2,reps:10,rest:20,tip:"Sit back into heels",anim:"squat"},{name:"Knee Push-Ups",sets:2,reps:8,rest:20,tip:"Body straight from knees",anim:"pu"},{name:"Glute Bridges",sets:2,reps:12,rest:15,tip:"Lift hips high",anim:"bridge"},{name:"Plank Hold",sets:2,reps:"20s",rest:15,tip:"Don't let hips sag",anim:"plank"},{name:"Marching in Place",sets:2,reps:30,rest:10,tip:"Knees to waist",anim:"hk"}]},
  { id:12,name:"Lower Body Burn",type:"strength",duration:20,difficulty:"intermediate",equipment:"bodyweight",xp:95,exercises:[{name:"Bodyweight Squats",sets:4,reps:20,rest:20,tip:"Full depth",anim:"squat"},{name:"Forward Lunges",sets:3,reps:12,rest:20,tip:"Each leg",anim:"lunge"},{name:"Bulgarian Split Squat",sets:3,reps:10,rest:20,tip:"Back foot elevated",anim:"lunge"},{name:"Curtsy Lunges",sets:3,reps:12,rest:15,tip:"Cross behind",anim:"lunge"},{name:"Wall Sit",sets:2,reps:"45s",rest:30,tip:"Thighs parallel",anim:"plank"},{name:"Calf Raises",sets:3,reps:25,rest:10,tip:"Up on toes",anim:"squat"}]},
  { id:13,name:"Total Body HIIT",type:"hiit",duration:25,difficulty:"advanced",equipment:"bodyweight",xp:120,exercises:[{name:"Jumping Jacks",sets:3,reps:30,rest:15,tip:"Warm up pace",anim:"jj"},{name:"Burpees",sets:4,reps:12,rest:20,tip:"Full body extension",anim:"burpee"},{name:"Push-Ups",sets:3,reps:15,rest:20,tip:"Chest to floor",anim:"pu"},{name:"Squat Jumps",sets:4,reps:15,rest:20,tip:"Land soft",anim:"squat"},{name:"Mountain Climbers",sets:3,reps:40,rest:15,tip:"Knees to chest",anim:"mc"},{name:"Plank to Push-Up",sets:3,reps:10,rest:20,tip:"Up up, down down",anim:"pu"}]},
  { id:14,name:"Yoga Power Flow",type:"flexibility",duration:20,difficulty:"intermediate",equipment:"bodyweight",xp:70,exercises:[{name:"Sun Salutation A",sets:3,reps:5,rest:10,tip:"Flow with breath",anim:"yoga"},{name:"Warrior I",sets:2,reps:"45s",rest:5,tip:"Both legs",anim:"yoga"},{name:"Warrior II",sets:2,reps:"45s",rest:5,tip:"Hips open",anim:"yoga"},{name:"Triangle Pose",sets:2,reps:"30s",rest:5,tip:"Both sides",anim:"yoga"},{name:"Crow Pose",sets:2,reps:"15s",rest:10,tip:"Knees on triceps",anim:"yoga"},{name:"Savasana",sets:1,reps:"120s",rest:0,tip:"Total relaxation",anim:"yoga"}]},
  { id:15,name:"Quick Sweat",type:"hiit",duration:5,difficulty:"beginner",equipment:"bodyweight",xp:30,exercises:[{name:"Jumping Jacks",sets:1,reps:30,rest:10,tip:"Steady pace",anim:"jj"},{name:"High Knees",sets:1,reps:30,rest:10,tip:"Knees up high",anim:"hk"},{name:"Squats",sets:1,reps:15,rest:10,tip:"Full range",anim:"squat"},{name:"Push-Ups",sets:1,reps:10,rest:10,tip:"Modify if needed",anim:"pu"}]},
  { id:16,name:"Arm Sculptor",type:"strength",duration:15,difficulty:"intermediate",equipment:"bodyweight",xp:75,exercises:[{name:"Standard Push-Ups",sets:3,reps:12,rest:20,tip:"Slow and controlled",anim:"pu"},{name:"Diamond Push-Ups",sets:3,reps:8,rest:25,tip:"Triceps focus",anim:"pu"},{name:"Pike Push-Ups",sets:3,reps:10,rest:20,tip:"Shoulders work",anim:"pu"},{name:"Tricep Dips",sets:3,reps:12,rest:20,tip:"Use a chair/edge",anim:"pu"},{name:"Plank Up-Downs",sets:3,reps:10,rest:15,tip:"Forearm to hand",anim:"plank"}]},
  { id:17,name:"Bedtime Stretch",type:"flexibility",duration:8,difficulty:"beginner",equipment:"bodyweight",xp:35,exercises:[{name:"Neck Rolls",sets:2,reps:5,rest:5,tip:"Each direction",anim:"yoga"},{name:"Shoulder Rolls",sets:2,reps:10,rest:5,tip:"Slow and deep",anim:"yoga"},{name:"Spinal Twist",sets:2,reps:"30s",rest:5,tip:"Both sides",anim:"yoga"},{name:"Hamstring Stretch",sets:2,reps:"30s",rest:5,tip:"Each leg",anim:"yoga"},{name:"Child's Pose",sets:1,reps:"60s",rest:0,tip:"Deep breathing",anim:"yoga"}]},
  { id:18,name:"Plank Power",type:"strength",duration:10,difficulty:"intermediate",equipment:"bodyweight",xp:60,exercises:[{name:"Standard Plank",sets:3,reps:"45s",rest:20,tip:"Body straight line",anim:"plank"},{name:"Side Plank Left",sets:2,reps:"30s",rest:15,tip:"Stack feet",anim:"plank"},{name:"Side Plank Right",sets:2,reps:"30s",rest:15,tip:"Stack feet",anim:"plank"},{name:"Plank Shoulder Taps",sets:3,reps:20,rest:15,tip:"Hips stable",anim:"plank"},{name:"Forearm Plank",sets:3,reps:"40s",rest:20,tip:"Elbows under shoulders",anim:"plank"}]},
  // More Beginner workouts
  { id:19,name:"Walking Warm-Up",type:"hiit",duration:5,difficulty:"beginner",equipment:"bodyweight",xp:25,exercises:[{name:"March in Place",sets:2,reps:30,rest:10,tip:"Lift knees high",anim:"hk"},{name:"Arm Swings",sets:2,reps:20,rest:10,tip:"Swing across chest",anim:"jj"},{name:"Side Steps",sets:2,reps:20,rest:10,tip:"Stay light on toes",anim:"hk"},{name:"Toe Touches",sets:2,reps:10,rest:10,tip:"Bend at hips",anim:"yoga"}]},
  { id:20,name:"Gentle Core",type:"strength",duration:8,difficulty:"beginner",equipment:"bodyweight",xp:35,exercises:[{name:"Dead Bug",sets:2,reps:10,rest:15,tip:"Lower back flat",anim:"bridge"},{name:"Bird Dog",sets:2,reps:10,rest:15,tip:"Opposite arm and leg",anim:"plank"},{name:"Glute Bridges",sets:2,reps:12,rest:15,tip:"Squeeze glutes",anim:"bridge"},{name:"Modified Plank",sets:2,reps:"20s",rest:15,tip:"On knees is fine",anim:"plank"}]},
  { id:21,name:"Stretchy Start",type:"flexibility",duration:10,difficulty:"beginner",equipment:"bodyweight",xp:30,exercises:[{name:"Neck Circles",sets:2,reps:8,rest:5,tip:"Slow circles",anim:"yoga"},{name:"Shoulder Rolls",sets:2,reps:10,rest:5,tip:"Forward then back",anim:"yoga"},{name:"Hip Circles",sets:2,reps:8,rest:5,tip:"Hands on hips",anim:"yoga"},{name:"Standing Quad Stretch",sets:2,reps:"20s",rest:5,tip:"Each leg",anim:"yoga"},{name:"Cat-Cow",sets:2,reps:8,rest:5,tip:"Breathe with movement",anim:"yoga"}]},
  { id:22,name:"Easy Cardio",type:"hiit",duration:10,difficulty:"beginner",equipment:"bodyweight",xp:40,exercises:[{name:"Marching",sets:3,reps:30,rest:15,tip:"Pump arms",anim:"hk"},{name:"Step Jacks",sets:3,reps:20,rest:15,tip:"Like jumping jacks but step",anim:"jj"},{name:"Knee Raises",sets:3,reps:20,rest:15,tip:"Alternate legs",anim:"hk"},{name:"Arm Punches",sets:3,reps:30,rest:15,tip:"Jab, cross, repeat",anim:"pu"}]},
  { id:23,name:"Chair Workout",type:"strength",duration:10,difficulty:"beginner",equipment:"bodyweight",xp:45,exercises:[{name:"Seated Leg Raises",sets:3,reps:12,rest:15,tip:"Sit on edge of chair",anim:"crunch"},{name:"Chair Squats",sets:3,reps:10,rest:15,tip:"Touch chair then stand",anim:"squat"},{name:"Incline Push-Ups",sets:3,reps:8,rest:20,tip:"Hands on chair seat",anim:"pu"},{name:"Tricep Dips",sets:3,reps:8,rest:20,tip:"Hands on chair edge",anim:"pu"},{name:"Step-Ups",sets:3,reps:10,rest:15,tip:"Each leg, use chair",anim:"lunge"}]},
  // More Intermediate workouts
  { id:24,name:"Athletic Circuit",type:"hiit",duration:20,difficulty:"intermediate",equipment:"bodyweight",xp:90,exercises:[{name:"High Knees",sets:4,reps:30,rest:15,tip:"Pump arms fast",anim:"hk"},{name:"Push-Ups",sets:3,reps:15,rest:20,tip:"Full range",anim:"pu"},{name:"Jump Squats",sets:3,reps:15,rest:20,tip:"Land soft",anim:"squat"},{name:"Bicycle Crunches",sets:3,reps:24,rest:15,tip:"Slow and controlled",anim:"crunch"},{name:"Lunges",sets:3,reps:16,rest:20,tip:"Alternate legs",anim:"lunge"},{name:"Burpees",sets:3,reps:8,rest:25,tip:"Full extension",anim:"burpee"}]},
  { id:25,name:"Chest & Triceps",type:"strength",duration:15,difficulty:"intermediate",equipment:"bodyweight",xp:80,exercises:[{name:"Standard Push-Ups",sets:4,reps:12,rest:20,tip:"Chest to floor",anim:"pu"},{name:"Close-Grip Push-Ups",sets:3,reps:10,rest:20,tip:"Hands together",anim:"pu"},{name:"Wide Push-Ups",sets:3,reps:12,rest:20,tip:"Hands wide",anim:"pu"},{name:"Tricep Dips",sets:3,reps:12,rest:20,tip:"On chair or bench",anim:"pu"},{name:"Diamond Push-Ups",sets:3,reps:8,rest:25,tip:"Triangle hands",anim:"pu"}]},
  { id:26,name:"Functional Fitness",type:"strength",duration:18,difficulty:"intermediate",equipment:"bodyweight",xp:85,exercises:[{name:"Bear Crawl",sets:3,reps:"20s",rest:20,tip:"Stay low",anim:"mc"},{name:"Crab Walk",sets:3,reps:"20s",rest:20,tip:"Hips high",anim:"bridge"},{name:"Inchworms",sets:3,reps:8,rest:20,tip:"Walk hands out",anim:"plank"},{name:"Single Leg Deadlift",sets:3,reps:10,rest:20,tip:"Each leg",anim:"yoga"},{name:"Pistol Squat Assist",sets:3,reps:6,rest:25,tip:"Hold wall",anim:"squat"}]},
  { id:27,name:"Cardio Kickboxing",type:"hiit",duration:15,difficulty:"intermediate",equipment:"bodyweight",xp:80,exercises:[{name:"Jab-Cross Combo",sets:4,reps:20,rest:15,tip:"Rotate hips",anim:"pu"},{name:"Front Kicks",sets:3,reps:16,rest:15,tip:"Alternate legs",anim:"hk"},{name:"Uppercuts",sets:3,reps:20,rest:15,tip:"Drive from legs",anim:"pu"},{name:"Knee Strikes",sets:3,reps:16,rest:15,tip:"Pull hands down",anim:"hk"},{name:"Bob and Weave",sets:3,reps:20,rest:15,tip:"Duck and move",anim:"squat"}]},
  // More Advanced workouts
  { id:28,name:"Beast Mode HIIT",type:"hiit",duration:25,difficulty:"advanced",equipment:"bodyweight",xp:130,exercises:[{name:"Burpee Broad Jumps",sets:4,reps:8,rest:20,tip:"Jump forward",anim:"burpee"},{name:"Clapping Push-Ups",sets:3,reps:10,rest:25,tip:"Explosive push",anim:"pu"},{name:"Tuck Jumps",sets:4,reps:12,rest:20,tip:"Knees to chest",anim:"squat"},{name:"Mountain Climbers",sets:4,reps:40,rest:15,tip:"Fast and low",anim:"mc"},{name:"Pike Push-Ups",sets:3,reps:12,rest:25,tip:"Hips high, head to floor",anim:"pu"},{name:"Star Jumps",sets:4,reps:15,rest:15,tip:"Full extension",anim:"jj"}]},
  { id:29,name:"Warrior Strength",type:"strength",duration:30,difficulty:"advanced",equipment:"bodyweight",xp:140,exercises:[{name:"Archer Push-Ups",sets:3,reps:8,rest:25,tip:"Extend one arm wide",anim:"pu"},{name:"Pistol Squats",sets:3,reps:6,rest:30,tip:"One leg, full depth",anim:"squat"},{name:"Handstand Hold",sets:3,reps:"20s",rest:30,tip:"Against wall",anim:"plank"},{name:"Dragon Flag",sets:3,reps:5,rest:30,tip:"Control the negative",anim:"crunch"},{name:"L-Sit Hold",sets:3,reps:"15s",rest:25,tip:"On dip bars or floor",anim:"plank"},{name:"One-Arm Push-Up Neg",sets:3,reps:4,rest:30,tip:"Slow down only",anim:"pu"}]},
  { id:30,name:"Sprint Intervals",type:"hiit",duration:15,difficulty:"advanced",equipment:"bodyweight",xp:110,exercises:[{name:"Sprint in Place",sets:5,reps:"20s",rest:20,tip:"100% effort",anim:"hk"},{name:"Burpees",sets:4,reps:10,rest:20,tip:"No rest at top",anim:"burpee"},{name:"Jump Lunges",sets:4,reps:16,rest:20,tip:"Alternate mid-air",anim:"lunge"},{name:"Power Push-Ups",sets:3,reps:12,rest:20,tip:"Push off floor",anim:"pu"}]},
  { id:31,name:"Plyometric Power",type:"hiit",duration:20,difficulty:"advanced",equipment:"bodyweight",xp:120,exercises:[{name:"Box Jumps",sets:4,reps:10,rest:20,tip:"Step up, jump down",anim:"squat"},{name:"Lateral Bounds",sets:4,reps:16,rest:15,tip:"Stick the landing",anim:"hk"},{name:"Depth Jumps",sets:3,reps:8,rest:25,tip:"Step off, explode up",anim:"squat"},{name:"Plyo Push-Ups",sets:3,reps:8,rest:25,tip:"Hands leave floor",anim:"pu"},{name:"Single-Leg Hops",sets:3,reps:10,rest:20,tip:"Each leg",anim:"hk"}]},
  { id:32,name:"Core Annihilator",type:"strength",duration:15,difficulty:"advanced",equipment:"bodyweight",xp:100,exercises:[{name:"Ab Wheel Rollouts",sets:3,reps:10,rest:25,tip:"Full extension",anim:"plank"},{name:"Hanging Leg Raises",sets:3,reps:12,rest:25,tip:"Toes to bar",anim:"crunch"},{name:"Dragon Flags",sets:3,reps:6,rest:30,tip:"Straight body",anim:"crunch"},{name:"Human Flag Prep",sets:3,reps:"10s",rest:30,tip:"Side plank on pole",anim:"plank"},{name:"V-Sit Hold",sets:3,reps:"20s",rest:25,tip:"Legs and torso at 45°",anim:"crunch"}]},
  { id:33,name:"Endurance Circuit",type:"hiit",duration:30,difficulty:"advanced",equipment:"bodyweight",xp:150,exercises:[{name:"Burpees",sets:5,reps:12,rest:15,tip:"Non-stop pace",anim:"burpee"},{name:"Mountain Climbers",sets:5,reps:40,rest:15,tip:"Drive knees fast",anim:"mc"},{name:"Jump Squats",sets:5,reps:20,rest:15,tip:"Quarter squat jump",anim:"squat"},{name:"Push-Up Variations",sets:5,reps:10,rest:15,tip:"Change width each set",anim:"pu"},{name:"High Knees Sprint",sets:5,reps:40,rest:15,tip:"Arms pumping",anim:"hk"},{name:"Plank Jacks",sets:4,reps:20,rest:15,tip:"Jump feet wide",anim:"plank"}]},
  { id:34,name:"Flexibility Master",type:"flexibility",duration:25,difficulty:"advanced",equipment:"bodyweight",xp:90,exercises:[{name:"Deep Squat Hold",sets:3,reps:"60s",rest:15,tip:"Heels flat",anim:"squat"},{name:"Pigeon Pose",sets:2,reps:"60s",rest:10,tip:"Each side",anim:"yoga"},{name:"Pancake Stretch",sets:3,reps:"45s",rest:10,tip:"Legs wide, chest forward",anim:"yoga"},{name:"Bridge Hold",sets:3,reps:"30s",rest:15,tip:"Push hips high",anim:"bridge"},{name:"King Pigeon",sets:2,reps:"30s",rest:15,tip:"Grab back foot",anim:"yoga"},{name:"Splits Progression",sets:2,reps:"45s",rest:15,tip:"Use blocks for support",anim:"yoga"}]},
  { id:35,name:"AMRAP Challenge",type:"hiit",duration:20,difficulty:"advanced",equipment:"bodyweight",xp:125,exercises:[{name:"Burpees",sets:1,reps:10,rest:0,tip:"No rest between moves",anim:"burpee"},{name:"Push-Ups",sets:1,reps:15,rest:0,tip:"Go go go",anim:"pu"},{name:"Air Squats",sets:1,reps:20,rest:0,tip:"Full depth",anim:"squat"},{name:"Sit-Ups",sets:1,reps:15,rest:0,tip:"Touch toes",anim:"crunch"},{name:"Repeat 4 rounds",sets:4,reps:1,rest:60,tip:"Rest 1 min between rounds",anim:"jj"}]},
  { id:36,name:"Advanced Yoga",type:"flexibility",duration:20,difficulty:"advanced",equipment:"bodyweight",xp:85,exercises:[{name:"Sun Salutation B",sets:5,reps:3,rest:5,tip:"Flow with breath",anim:"yoga"},{name:"Crow to Tripod",sets:3,reps:5,rest:15,tip:"Shift weight forward",anim:"yoga"},{name:"Wheel Pose",sets:3,reps:"20s",rest:15,tip:"Push through shoulders",anim:"bridge"},{name:"Firefly Pose",sets:3,reps:"10s",rest:15,tip:"Lift hips high",anim:"yoga"},{name:"Handstand Practice",sets:3,reps:"15s",rest:20,tip:"Kick up against wall",anim:"plank"}]},
];

const CHALLENGES_DB = [
  {id:1,name:"100 Push-Up Challenge",desc:"100 push-ups daily",days:30,icon:"\u{1F4AA}",participants:2847,xpReward:500},
  {id:2,name:"Plank Warrior",desc:"5 min plank daily",days:14,icon:"\u{1F9D8}",participants:1523,xpReward:300},
  {id:3,name:"10K Steps Daily",desc:"Walk 10,000 steps",days:21,icon:"\u{1F6B6}",participants:4102,xpReward:400},
  {id:4,name:"Morning Stretch",desc:"10-min stretch AM",days:7,icon:"\u{1F305}",participants:987,xpReward:150},
  {id:5,name:"HIIT Monster",desc:"20 min HIIT 5x/week",days:30,icon:"\u{1F525}",participants:1876,xpReward:600},
];

const BADGES_DB = [
  {id:"first_flame",name:"First Flame",icon:"\u{1F525}",desc:"First workout"},
  {id:"streak_7",name:"Streak Starter",icon:"\u26A1",desc:"7-day streak"},
  {id:"streak_30",name:"Iron Will",icon:"\u{1F6E1}\uFE0F",desc:"30-day streak"},
  {id:"xp_1000",name:"XP Hunter",icon:"\u{1F48E}",desc:"1,000 XP"},
  {id:"xp_5000",name:"XP Legend",icon:"\u{1F451}",desc:"5,000 XP"},
  {id:"age_test",name:"Age Defier",icon:"\u{1F9EC}",desc:"Fitness Age Test"},
  {id:"challenge_1",name:"Challenger",icon:"\u{1F3C6}",desc:"Join a challenge"},
  {id:"workouts_10",name:"Dedicated",icon:"\u{1F4AA}",desc:"10 workouts"},
  {id:"food_tracker",name:"Nutrition Nerd",icon:"\u{1F957}",desc:"Log 10 foods"},
  {id:"early_bird",name:"Early Adopter",icon:"\u{1F423}",desc:"First users"},
];

const LEADERBOARD = [
  {name:"Aarav K.",xp:12450,streak:47,avatar:"\u{1F3CB}\uFE0F"},{name:"Priya S.",xp:11200,streak:42,avatar:"\u{1F9D8}"},{name:"Rahul M.",xp:9870,streak:38,avatar:"\u{1F4AA}"},{name:"Sneha R.",xp:8540,streak:33,avatar:"\u{1F3C3}"},{name:"Arjun D.",xp:7200,streak:28,avatar:"\u26A1"},{name:"Diya P.",xp:6800,streak:25,avatar:"\u{1F525}"},{name:"Karan V.",xp:5430,streak:21,avatar:"\u{1F3AF}"},{name:"Ananya G.",xp:4100,streak:17,avatar:"\u2728"},
];

const MOTIV = {
  cricket:[
    "\u{1F3CF} \"I am not talented, I am obsessed.\" — Virat Kohli",
    "\u{1F3CF} \"The process is more important than the result.\" — MS Dhoni",
    "\u{1F3CF} \"People throw stones at you and you convert them into milestones.\" — Sachin Tendulkar",
    "\u{1F3CF} \"I have always believed that process is more important than results.\" — Rahul Dravid",
    "\u{1F3CF} \"Self-belief and hard work will always earn you success.\" — Virat Kohli",
    "\u{1F3CF} \"You don't play for revenge, you play for respect.\" — MS Dhoni",
    "\u{1F3CF} \"It's important to learn and not repeat the same mistakes.\" — Sachin Tendulkar",
    "\u{1F3CF} \"I just keep it simple. Watch the ball and play the ball.\" — Sachin Tendulkar",
    "\u{1F3CF} \"Fitness is not about being better than someone else. It's about being better than you used to be.\" — Virat Kohli",
    "\u{1F3CF} \"When people start throwing stones at you, you turn them into milestones.\" — Sachin Tendulkar",
    "\u{1F3CF} \"The best way to take wickets is to bowl well.\" — Glenn McGrath",
    "\u{1F3CF} \"Cricket is a team game. If you want fame for yourself, go play an individual sport.\" — Sourav Ganguly",
    "\u{1F3CF} \"If you keep your fitness, you don't need to worry about age.\" — Wasim Akram",
    "\u{1F3CF} \"Age is just a number. It's your fitness and attitude that define you.\" — Sachin Tendulkar",
    "\u{1F3CF} \"Hard work beats talent when talent doesn't work hard.\" — Rahul Dravid",
    "\u{1F3CF} \"I believe in giving my best every single day in practice.\" — Rohit Sharma",
    "\u{1F3CF} \"I want to be the fittest cricketer India has ever produced.\" — Virat Kohli",
    "\u{1F3CF} \"Enjoy the game and chase your dreams.\" — Sachin Tendulkar",
    "\u{1F3CF} \"When you aim for perfection, you discover it's a moving target.\" — Ben Stokes",
    "\u{1F3CF} \"Discipline is the bridge between goals and accomplishment.\" — Ricky Ponting",
    "\u{1F3CF} \"Stay hungry, stay foolish, stay fit.\" — Jasprit Bumrah on his training philosophy",
    "\u{1F3CF} \"Cricket taught me the value of patience and persistence.\" — Anil Kumble",
    "\u{1F3CF} \"Consistency comes from discipline, not motivation.\" — Steve Waugh",
    "\u{1F3CF} \"If you don't have confidence, you'll always find a way not to win.\" — Carl Hooper",
    "\u{1F3CF} \"Your body is your most important piece of equipment in cricket.\" — AB de Villiers",
  ],
  football:[
    "\u26BD \"I'm not the best because of talent. I'm the best because of my mentality.\" — Cristiano Ronaldo",
    "\u26BD \"You have to fight to reach your dream. You have to sacrifice and work hard for it.\" — Lionel Messi",
    "\u26BD \"I don't have time for hobbies. At the end of the day, I treat my job as a hobby. It's something I love doing.\" — David Beckham",
    "\u26BD \"I always want more. Whether it's a goal, an assist, I'm not satisfied.\" — Cristiano Ronaldo",
    "\u26BD \"I start early, and I stay late, day after day, year after year.\" — Cristiano Ronaldo",
    "\u26BD \"Impossible is nothing.\" — Pelé",
    "\u26BD \"Success is no accident. It is hard work, perseverance, learning, studying, sacrifice.\" — Pelé",
    "\u26BD \"The secret is to believe in your dreams; in your potential that you can be like your star.\" — Neymar",
    "\u26BD \"Football is not just about scoring goals. It's about winning together.\" — Sunil Chhetri",
    "\u26BD \"When you want to succeed as bad as you want to breathe, then you'll be successful.\" — Zlatan Ibrahimovi\u0107",
    "\u26BD \"I am living my dream. Never stop dreaming.\" — Kylian Mbappé",
    "\u26BD \"The more difficult the victory, the greater the happiness in winning.\" — Pelé",
    "\u26BD \"Every season is a new opportunity.\" — Mohamed Salah",
    "\u26BD \"A penalty is a cowardly way to score. — Pelé",
    "\u26BD \"I've failed over and over again in my life and that is why I succeed.\" — Thierry Henry",
    "\u26BD \"Talent without working hard is nothing.\" — Cristiano Ronaldo",
    "\u26BD \"Your love makes me strong. Your hate makes me unstoppable.\" — Cristiano Ronaldo",
    "\u26BD \"You can overcome anything, if and only if you love something enough.\" — Lionel Messi",
    "\u26BD \"Football is a collective sport. One person alone cannot win.\" — Zinedine Zidane",
    "\u26BD \"The ball is round, the game lasts 90 minutes, and everything else is just theory.\" — Sepp Herberger",
    "\u26BD \"Dream big and never give up.\" — Sunil Chhetri to young Indian athletes",
    "\u26BD \"It took me 17 years and 114 days to become an overnight success.\" — Lionel Messi",
    "\u26BD \"I am proof that hard work can take you anywhere in the world.\" — Mohamed Salah",
    "\u26BD \"I don't need the best hairstyle or the best body. Just give me a ball at my feet.\" — Lionel Messi",
    "\u26BD \"If you want to be the best, you have to do things other people aren't willing to do.\" — Erling Haaland",
  ],
  tennis:[
    "\u{1F3BE} \"I play each point like my life depends on it.\" — Rafael Nadal",
    "\u{1F3BE} \"If you don't practice you don't deserve to win.\" — Andre Agassi",
    "\u{1F3BE} \"There is no way around the hard work. Embrace it.\" — Roger Federer",
    "\u{1F3BE} \"I fear no one, but I respect everyone.\" — Rafael Nadal",
    "\u{1F3BE} \"I try to be the best version of myself, not the best version of anyone else.\" — Novak Djokovic",
    "\u{1F3BE} \"You always want to quit when it's hard. Don't.\" — Serena Williams",
    "\u{1F3BE} \"A champion is defined not by their wins but by how they recover when they fall.\" — Serena Williams",
    "\u{1F3BE} \"The only way to do it is to do it.\" — Billie Jean King",
    "\u{1F3BE} \"You have to believe in yourself when no one else does.\" — Serena Williams",
    "\u{1F3BE} \"I've always considered myself the best and the top.\" — Novak Djokovic",
    "\u{1F3BE} \"Just believe in yourself. Even if you don't, pretend that you do and at some point, you will.\" — Venus Williams",
    "\u{1F3BE} \"What makes something special is not just what you have to gain, but what you feel there is to lose.\" — Andre Agassi",
    "\u{1F3BE} \"I didn't have talent. I had tenacity.\" — Rafael Nadal",
    "\u{1F3BE} \"As long as I keep working hard, the results will come.\" — Rafael Nadal",
    "\u{1F3BE} \"Every match is a new beginning.\" — Roger Federer",
    "\u{1F3BE} \"Concentration is the ability to think about absolutely nothing when it is absolutely necessary.\" — Roger Federer",
    "\u{1F3BE} \"You just can't beat the person who never gives up.\" — Babe Ruth (shared by Djokovic)",
    "\u{1F3BE} \"I've grown most not from victories, but from setbacks.\" — Roger Federer (Dartmouth speech 2024)",
    "\u{1F3BE} \"Tennis is a mental game. Everyone is fit, everyone hits great shots.\" — Novak Djokovic",
    "\u{1F3BE} \"The difference between a good player and a great one is mental strength.\" — Steffi Graf",
    "\u{1F3BE} \"Nutrition and rest are as important as training itself.\" — Novak Djokovic",
    "\u{1F3BE} \"Pressure is a privilege.\" — Billie Jean King",
    "\u{1F3BE} \"The body achieves what the mind believes.\" — Sania Mirza",
    "\u{1F3BE} \"I was born to play tennis.\" — Maria Sharapova",
    "\u{1F3BE} \"My ambition is to do what I enjoy, and I enjoy winning.\" — Roger Federer",
  ],
  athletics:[
    "\u{1F3C3} \"I don't think limits.\" — Usain Bolt",
    "\u{1F3C3} \"Dreams are free. Goals have a cost.\" — Usain Bolt",
    "\u{1F3C3} \"I trained 4 years to run 9 seconds and people give up when they don't see results in 2 months.\" — Usain Bolt",
    "\u{1F3C3} \"The real purpose of running isn't to win a race. It's to test the limits of the human heart.\" — Bill Bowerman",
    "\u{1F3C3} \"Run when you can, walk if you have to, crawl if you must; just never give up.\" — Dean Karnazes",
    "\u{1F3C3} \"The miracle isn't that I finished. The miracle is that I had the courage to start.\" — John Bingham",
    "\u{1F3C3} \"For me, losing a pet was harder than losing a gold medal.\" — P.T. Usha on priorities",
    "\u{1F3C3} \"Gold medals aren't really made of gold. They're made of sweat, determination, and hard-to-find alloy called guts.\" — Dan Gable",
    "\u{1F3C3} \"Pain is temporary. Quitting lasts forever.\" — Lance Armstrong (on running mindset)",
    "\u{1F3C3} \"There is no shortcut to success. Just hard work and determination.\" — Neeraj Chopra",
    "\u{1F3C3} \"If you want to become the best runner you can be, start now.\" — Carl Lewis",
    "\u{1F3C3} \"Never underestimate the power of dreams and the influence of the human spirit.\" — Wilma Rudolph",
    "\u{1F3C3} \"The body does not want you to do this. As you run, it tells you to stop but the mind clings on.\" — Eliud Kipchoge",
    "\u{1F3C3} \"No human is limited.\" — Eliud Kipchoge",
    "\u{1F3C3} \"Only the disciplined ones are free in life.\" — Eliud Kipchoge",
    "\u{1F3C3} \"Make sure your worst enemy doesn't live between your own two ears.\" — Laird Hamilton",
    "\u{1F3C3} \"I always loved running. It was something you could do by yourself and under your own power.\" — Jesse Owens",
    "\u{1F3C3} \"Running is about finding your inner peace, and so is a life well lived.\" — Dean Karnazes",
    "\u{1F3C3} \"Hard work has made it easy. That is my secret.\" — Nadia Comaneci",
    "\u{1F3C3} \"My main aim is to enjoy my game and keep performing consistently.\" — Neeraj Chopra",
    "\u{1F3C3} \"Champions keep playing until they get it right.\" — Billie Jean King",
    "\u{1F3C3} \"You can't put a limit on anything.\" — Michael Johnson",
    "\u{1F3C3} \"I hated every minute of training, but I said don't quit.\" — Muhammad Ali (on fitness discipline)",
    "\u{1F3C3} \"Set your goals high, and don't stop till you get there.\" — Bo Jackson",
    "\u{1F3C3} \"The will to win means nothing without the will to prepare.\" — Juma Ikangaa",
  ],
  default:[
    "\u{1F525} Your only competition is yesterday's you. Every rep counts.",
    "\u{1F4AA} Sweat now, flex later. Consistency beats intensity.",
    "\u26A1 1% better every single day. That's 37x better in a year.",
    "\u{1F3C6} Champions train on the days they don't feel like it.",
    "\u{1F48E} Pain today = strength tomorrow. Push through.",
    "\u2705 Don't stop when tired. Stop when done.",
    "\u{1F680} Small steps still move you forward. Keep going.",
    "\u{1F4AA} The only bad workout is the one that didn't happen.",
    "\u{1F525} Discipline is choosing between what you want now and what you want most.",
    "\u26A1 It's not about having time. It's about making time.",
  ]
};

const REELS = [
  {id:1,title:"5-Min Ab Burner",trainer:"MadFit",views:"24M",likes:"580K",gradient:"linear-gradient(135deg,#FF6B35,#E94560)",exercises:["Crunches x20","Plank 30s","Leg Raises x15","Twists x20"],duration:"5:00",workoutId:8},
  {id:2,title:"No-Equipment HIIT",trainer:"growwithjo",views:"18M",likes:"320K",gradient:"linear-gradient(135deg,#667eea,#764ba2)",exercises:["Burpees x10","Jump Squats x15","High Knees 30s","Climbers x20"],duration:"15:00",workoutId:1},
  {id:3,title:"Morning Yoga Flow",trainer:"Yoga With Adriene",views:"31M",likes:"410K",gradient:"linear-gradient(135deg,#11998e,#38ef7d)",exercises:["Sun Salutation x5","Warrior II 30s","Tree Pose 20s","Savasana 60s"],duration:"10:00",workoutId:14},
  {id:4,title:"Upper Body No Equipment",trainer:"THENX",views:"12M",likes:"290K",gradient:"linear-gradient(135deg,#fc5c7d,#6a82fb)",exercises:["Push-Ups x15","Diamond x10","Dips x12","Shoulder Taps x20"],duration:"8:00",workoutId:16},
  {id:5,title:"Leg Day at Home",trainer:"Pamela Reif",views:"19M",likes:"340K",gradient:"linear-gradient(135deg,#f093fb,#f5576c)",exercises:["Squats x20","Lunges x16","Bridges x15","Wall Sit 45s"],duration:"10:00",workoutId:12},
  {id:6,title:"Full Body Fat Burn",trainer:"JERICH0",views:"42M",likes:"890K",gradient:"linear-gradient(135deg,#FA8BFF,#2BD2FF 50%,#2BFF88)",exercises:["Jumping Jacks x30","Squats x20","Push-Ups x15","Burpees x10"],duration:"20:00",workoutId:13},
  {id:7,title:"Glute Builder Blast",trainer:"Krissy Cela",views:"15M",likes:"245K",gradient:"linear-gradient(135deg,#fa709a,#fee140)",exercises:["Sumo Squats x15","Lunges x12","Bridges x15","Donkey Kicks x15"],duration:"18:00",workoutId:9},
  {id:8,title:"Tabata Torch",trainer:"FitnessBlender",views:"9M",likes:"180K",gradient:"linear-gradient(135deg,#a8edea,#fed6e3)",exercises:["Burpees 20s","Squat Jumps 20s","Push-Ups 20s","Climbers 20s"],duration:"8:00",workoutId:10},
  {id:9,title:"Beginner's First Workout",trainer:"FitWithAnu",views:"7M",likes:"125K",gradient:"linear-gradient(135deg,#84fab0,#8fd3f4)",exercises:["Squats x10","Knee Push-Ups x8","Bridges x12","Plank 20s"],duration:"12:00",workoutId:11},
  {id:10,title:"Six-Pack Challenge",trainer:"Athlean-X",views:"33M",likes:"510K",gradient:"linear-gradient(135deg,#f5576c,#f093fb)",exercises:["Sit-Ups x20","Reverse Crunches x15","Side Plank","V-Ups x12"],duration:"15:00",workoutId:8},
  {id:11,title:"Lower Body Burn",trainer:"Heather Robertson",views:"21M",likes:"380K",gradient:"linear-gradient(135deg,#43e97b,#38f9d7)",exercises:["Squats x20","Forward Lunges x12","Bulgarian Split","Wall Sit 45s"],duration:"20:00",workoutId:12},
  {id:12,title:"Total Body HIIT",trainer:"Self Magazine",views:"27M",likes:"460K",gradient:"linear-gradient(135deg,#fa8bff,#2bd2ff)",exercises:["Jumping Jacks x30","Burpees x12","Push-Ups x15","Squat Jumps x15"],duration:"25:00",workoutId:13},
  {id:13,title:"Power Yoga Flow",trainer:"Boho Beautiful",views:"14M",likes:"230K",gradient:"linear-gradient(135deg,#48c6ef,#6f86d6)",exercises:["Sun Salutation x5","Warrior I","Triangle","Crow Pose"],duration:"20:00",workoutId:14},
  {id:14,title:"Quick 5-Min Sweat",trainer:"FitWithRosie",views:"11M",likes:"195K",gradient:"linear-gradient(135deg,#fdfcfb,#e2d1c3)",exercises:["Jacks x30","High Knees x30","Squats x15","Push-Ups x10"],duration:"5:00",workoutId:15},
  {id:15,title:"Arm Sculptor",trainer:"Madeleine Abeid",views:"8M",likes:"140K",gradient:"linear-gradient(135deg,#ff9a9e,#fad0c4)",exercises:["Push-Ups x12","Diamond x8","Pike x10","Tricep Dips x12"],duration:"15:00",workoutId:16},
  {id:16,title:"Bedtime Stretch",trainer:"Yoga Strala",views:"6M",likes:"95K",gradient:"linear-gradient(135deg,#a18cd1,#fbc2eb)",exercises:["Neck Rolls x5","Spinal Twist","Hamstring","Child's Pose"],duration:"8:00",workoutId:17},
  {id:17,title:"Plank Power Hour",trainer:"NerdFitness",views:"5M",likes:"82K",gradient:"linear-gradient(135deg,#ffecd2,#fcb69f)",exercises:["Plank 45s","Side Plank","Shoulder Taps x20","Forearm Plank"],duration:"10:00",workoutId:18},
  {id:18,title:"Morning Energizer",trainer:"FitWithKavya",views:"4M",likes:"68K",gradient:"linear-gradient(135deg,#a1c4fd,#c2e9fb)",exercises:["Arm Circles","Toe Touches","Marching","Jumping Jacks"],duration:"7:00",workoutId:7},
];

function ExAnim({type,size=200,showLabel=false,color="auto"}){
  const[f,setF]=useState(0);
  const uid=useRef(Math.random().toString(36).slice(2,7)).current;
  useEffect(()=>{const iv=setInterval(()=>setF(x=>(x+1)%120),33);return()=>clearInterval(iv)},[]);
  const p=f/120,b=Math.sin(p*Math.PI*2),ab=Math.abs(b),s=size,cx=s/2,cy=s/2;
  const colors={jj:"#FF6B35",burpee:"#E94560",squat:"#667eea",mc:"#38ef7d",pu:"#fc5c7d",plank:"#f093fb",yoga:"#11998e",hk:"#FF6B35",crunch:"#E94560",lunge:"#667eea",bridge:"#38ef7d"};
  const c=color==="auto"?(colors[type]||"#FF6B35"):color;
  const c2=c+"40";
  // Body dimensions
  const hr=s*.065,bw=s*.035;
  const headY=cy-s*.2,shoulderY=headY+hr+s*.04,hipY=cy+s*.06,kneeOff=s*.16,footOff=s*.28;
  
  function limb(x1,y1,x2,y2,w=bw){return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round"/>}
  function joint(x,y,r=bw*.6){return <circle cx={x} cy={y} r={r} fill={c}/>}
  
  const figs={
    jj:()=>{const as=ab*s*.24,ls=ab*s*.17,jh=ab*s*.07;const hy=headY-jh;
      return <g><circle cx={cx} cy={hy} r={hr} fill={c}/>{joint(cx,hy+hr+2)}{limb(cx,hy+hr+2,cx,hipY-jh)}{limb(cx,shoulderY-jh,cx-as,shoulderY-as*.7-jh)}{limb(cx,shoulderY-jh,cx+as,shoulderY-as*.7-jh)}{limb(cx,hipY-jh,cx-ls,hipY+footOff-jh)}{limb(cx,hipY-jh,cx+ls,hipY+footOff-jh)}{joint(cx-as,shoulderY-as*.7-jh,3)}{joint(cx+as,shoulderY-as*.7-jh,3)}{joint(cx-ls,hipY+footOff-jh,3)}{joint(cx+ls,hipY+footOff-jh,3)}</g>},
    burpee:()=>{const ph=p<.3?0:p<.55?1:p<.8?2:3;
      if(ph===0){const t=p/.3,sq=t*s*.12;return <g><circle cx={cx} cy={headY+sq} r={hr} fill={c}/>{limb(cx,headY+sq+hr,cx,hipY+sq*.5)}{limb(cx,shoulderY+sq,cx-16,shoulderY+sq+12)}{limb(cx,shoulderY+sq,cx+16,shoulderY+sq+12)}{limb(cx,hipY+sq*.5,cx-14,hipY+footOff)}{limb(cx,hipY+sq*.5,cx+14,hipY+footOff)}</g>}
      if(ph===1){const pp=(p-.3)/.25;const pushD=Math.sin(pp*Math.PI)*s*.04;return <g><circle cx={cx-s*.17} cy={cy-2+pushD} r={hr} fill={c}/>{limb(cx-s*.14,cy+pushD,cx+s*.16,cy+2+pushD)}{limb(cx-s*.07,cy-2+pushD,cx-s*.13,cy+s*.1+pushD)}{limb(cx+s*.07,cy+pushD,cx+s*.13,cy+s*.1+pushD)}{limb(cx+s*.16,cy+2+pushD,cx+s*.24,cy+pushD+s*.1)}</g>}
      if(ph===2){const t=(p-.55)/.25,sq=(1-t)*s*.1;return <g><circle cx={cx} cy={headY+sq} r={hr} fill={c}/>{limb(cx,headY+sq+hr,cx,hipY+sq*.4)}{limb(cx,shoulderY+sq,cx-14,shoulderY+sq+10)}{limb(cx,shoulderY+sq,cx+14,shoulderY+sq+10)}{limb(cx,hipY+sq*.4,cx-14,hipY+footOff)}{limb(cx,hipY+sq*.4,cx+14,hipY+footOff)}</g>}
      const jh=Math.sin((p-.8)/.2*Math.PI)*s*.14;return <g><circle cx={cx} cy={headY-jh} r={hr} fill={c}/>{limb(cx,headY-jh+hr,cx,hipY-jh)}{limb(cx,shoulderY-jh,cx-20,shoulderY-18-jh)}{limb(cx,shoulderY-jh,cx+20,shoulderY-18-jh)}{limb(cx,hipY-jh,cx-10,hipY+footOff-jh)}{limb(cx,hipY-jh,cx+10,hipY+footOff-jh)}</g>},
    squat:()=>{const d=ab*s*.12;return <g><circle cx={cx} cy={headY+d} r={hr} fill={c}/>{limb(cx,headY+d+hr,cx,hipY+d*.6)}{limb(cx,shoulderY+d,cx-20,shoulderY+d+8)}{limb(cx,shoulderY+d,cx+20,shoulderY+d+8)}{limb(cx,hipY+d*.6,cx-16,hipY+footOff)}{limb(cx,hipY+d*.6,cx+16,hipY+footOff)}{joint(cx,hipY+d*.6,4)}{joint(cx-16,hipY+footOff,3)}{joint(cx+16,hipY+footOff,3)}</g>},
    mc:()=>{const sw=b>0,kd=ab*s*.16;return <g><circle cx={cx-s*.17} cy={cy-8} r={hr} fill={c}/>{limb(cx-s*.13,cy-4,cx+s*.14,cy+4)}{limb(cx-s*.07,cy-2,cx-s*.18,cy+s*.08)}{limb(cx+s*.14,cy+4,cx+(sw?-2:s*.14),cy+4+(sw?s*.18:kd))}{limb(cx+s*.14,cy+4,cx+(!sw?-2:s*.14),cy+4+(!sw?s*.18:kd))}{joint(cx+(sw?-2:s*.14),cy+4+(sw?s*.18:kd),3)}{joint(cx+(!sw?-2:s*.14),cy+4+(!sw?s*.18:kd),3)}</g>},
    pu:()=>{const d=ab*s*.06;return <g><circle cx={cx-s*.19} cy={cy-5+d} r={hr} fill={c}/>{limb(cx-s*.15,cy+d-1,cx+s*.16,cy+d+2)}{limb(cx-s*.08,cy+d-3,cx-s*.15,cy+s*.11+d)}{limb(cx+s*.09,cy+d,cx+s*.15,cy+s*.11+d)}{limb(cx+s*.16,cy+d+2,cx+s*.24,cy+d+s*.1)}{joint(cx-s*.15,cy+s*.11+d,3)}{joint(cx+s*.15,cy+s*.11+d,3)}</g>},
    plank:()=>{const sh=Math.sin(f*.3)*1.5;return <g transform={`translate(0,${sh})`}><circle cx={cx-s*.19} cy={cy-3} r={hr} fill={c}/>{limb(cx-s*.15,cy,cx+s*.2,cy+2)}{limb(cx-s*.09,cy-2,cx-s*.13,cy+s*.09)}{limb(cx+s*.2,cy+2,cx+s*.2,cy+s*.09)}{joint(cx-s*.13,cy+s*.09,3)}{joint(cx+s*.2,cy+s*.09,3)}</g>},
    yoga:()=>{const sw=Math.sin(p*Math.PI*2)*6;return <g><circle cx={cx+sw*.3} cy={headY-6} r={hr} fill={c}/>{limb(cx+sw*.2,headY+hr-4,cx,hipY)}{limb(cx+sw*.2,shoulderY-2,cx-24+sw,shoulderY-14)}{limb(cx+sw*.2,shoulderY-2,cx+24+sw,shoulderY-14)}{limb(cx,hipY,cx-18,hipY+footOff)}{limb(cx,hipY,cx+18,hipY+footOff)}{joint(cx-24+sw,shoulderY-14,3)}{joint(cx+24+sw,shoulderY-14,3)}</g>},
    hk:()=>{const lu=b>0,kh=ab*s*.14;return <g><circle cx={cx} cy={headY-kh*.2} r={hr} fill={c}/>{limb(cx,headY-kh*.2+hr,cx,hipY)}{limb(cx,hipY,lu?cx-5:cx-12,lu?hipY-kh+10:hipY+footOff)}{limb(cx,hipY,!lu?cx+5:cx+12,!lu?hipY-kh+10:hipY+footOff)}{limb(cx,shoulderY,cx-18,shoulderY+(lu?-10:10))}{limb(cx,shoulderY,cx+18,shoulderY+(!lu?-10:10))}</g>},
    crunch:()=>{const a=ab*22;return <g><circle cx={cx-12} cy={cy-a*.3} r={hr} fill={c}/>{limb(cx-8,cy-a*.2+6,cx+6,cy+16)}{limb(cx-8,cy-a*.2+10,cx-24,cy-a*.15)}{limb(cx-8,cy-a*.2+10,cx+8,cy-a*.15)}{limb(cx+6,cy+16,cx+22,cy+s*.11)}{limb(cx+6,cy+16,cx-12,cy+s*.11)}</g>},
    lunge:()=>{const d=ab*s*.1;return <g><circle cx={cx} cy={headY+d*.5} r={hr} fill={c}/>{limb(cx,headY+d*.5+hr,cx,hipY+d*.3)}{limb(cx,shoulderY+d*.3,cx-16,shoulderY+d*.3+6)}{limb(cx,shoulderY+d*.3,cx+16,shoulderY+d*.3+6)}{limb(cx,hipY+d*.3,cx-20,hipY+footOff)}{limb(cx,hipY+d*.3,cx+14,hipY+footOff)}{joint(cx-20,hipY+footOff,3)}{joint(cx+14,hipY+footOff,3)}</g>},
    bridge:()=>{const lift=ab*s*.08;return <g><circle cx={cx-s*.15} cy={cy+s*.06-lift*.3} r={hr} fill={c}/>{limb(cx-s*.1,cy+s*.06-lift*.2,cx+s*.05,cy+s*.04-lift)}{limb(cx+s*.05,cy+s*.04-lift,cx+s*.18,cy+s*.12)}{limb(cx+s*.05,cy+s*.04-lift,cx-s*.08,cy+s*.12)}{joint(cx+s*.18,cy+s*.12,3)}{joint(cx-s*.08,cy+s*.12,3)}</g>},
  };
  const render=figs[type]||figs.jj;
  const phase=Math.floor(p*4)%4;
  const phaseDot=(i)=>({cx:cx-12+i*8,cy:hipY+footOff+16,r:i===phase?3:2,fill:i===phase?c:"#ffffff30"});
  
  return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{display:"block"}}>
    <defs>
      <radialGradient id={`g${uid}`}><stop offset="0%" stopColor={c2}/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <filter id={`b${uid}`}><feGaussianBlur stdDeviation="3"/></filter>
    </defs>
    <circle cx={cx} cy={cy} r={s*.4} fill={`url(#g${uid})`}/>
    <g filter={`url(#b${uid})`} opacity={0.3}>{render()}</g>
    {render()}
    <circle {...phaseDot(0)}/><circle {...phaseDot(1)}/><circle {...phaseDot(2)}/><circle {...phaseDot(3)}/>
    {showLabel&&<text x={cx} y={s-8} fill="#ffffff80" fontSize={10} textAnchor="middle" fontFamily="Arial">{type.toUpperCase()}</text>}
  </svg>
}

const load=async()=>{try{const r=await window.storage.get("fs-v4");return r?JSON.parse(r.value):null}catch{return null}};
const save=async s=>{try{await window.storage.set("fs-v4",JSON.stringify(s))}catch{}};
const DU={name:"",goal:"",level:"",duration:15,gender:"",sport:"cricket",xp:0,streak:0,longestStreak:0,freezeTokens:1,lastActiveDate:null,lastOpenedDate:null,workoutsCompleted:0,totalMinutes:0,badges:["early_bird"],fitnessAge:0,realAge:0,joinedChallenges:[],shares:0,completedWorkoutIds:[],foodLog:[],foodLogTotal:0,steps:0,stepsGoal:10000,runKm:0,sleepHours:0,sleepGoal:8,sleepLog:[],activityLog:[],onboarded:false};

export default function App(){
  const[u,setU]=useState(DU);
  const[scr,setScr]=useState("loading");
  const[tab,setTab]=useState("home");
  const[pop,setPop]=useState(null);
  const[wa,setWa]=useState(null);
  const[fts,setFts]=useState(0);
  const[ftd,setFtd]=useState({});
  const[xpa,setXpa]=useState(null);
  const[ri,setRi]=useState(0);
  const[rp,setRp]=useState(false);
  const[lt,setLt]=useState("weekly");
  const[ei,setEi]=useState(0);
  const[tm,setTm]=useState(0);
  const[tr,setTr]=useState(false);
  const[fs,setFs]=useState("");
  const[fc,setFc]=useState("all");
  const[at,setAt]=useState("walk");
  const[si,setSi]=useState("");
  const[rni,setRni]=useState("");
  const[sli,setSli]=useState("");
  const[os,setOs]=useState(0);
  const[od,setOd]=useState({name:"",goal:"",level:"",duration:15});
  const[reelExIdx,setReelExIdx]=useState(0);
  const[manualFood,setManualFood]=useState({name:"",cuisine:"",grams:"",cal:""});
  const[pedoActive,setPedoActive]=useState(false);
  const[liveSteps,setLiveSteps]=useState(0);
  const[runActive,setRunActive]=useState(false);
  const[runDist,setRunDist]=useState(0);
  const[runTime,setRunTime]=useState(0);
  // Pro plan state
  const[isPro,setIsPro]=useState(()=>{try{return localStorage.getItem("fs-pro")==="1"}catch{return false}});
  const[showPaywall,setShowPaywall]=useState(false);
  const[paywallFeature,setPaywallFeature]=useState("");
  const[chatMessages,setChatMessages]=useState(()=>{try{return JSON.parse(localStorage.getItem("fs-chat")||"[]")}catch{return[]}});
  const[chatInput,setChatInput]=useState("");
  const[chatLoading,setChatLoading]=useState(false);
  const[dailyReport,setDailyReport]=useState(null);
  const[weeklyReport,setWeeklyReport]=useState(null);
  const[reportLoading,setReportLoading]=useState(false);
  const[workoutAnalysis,setWorkoutAnalysis]=useState(null);
  const[heartRate,setHeartRate]=useState({resting:"",max:""});
  const[bodyMeasurements,setBodyMeasurements]=useState(()=>{try{return JSON.parse(localStorage.getItem("fs-measurements")||"{}")}catch{return{}}});
  // AI Food Scanner + Posture Analyzer
  const[scanLoading,setScanLoading]=useState(false);
  const[scanResult,setScanResult]=useState(null);
  const[postureResult,setPostureResult]=useState(null);
  const[postureLoading,setPostureLoading]=useState(false);
  const[goalTarget,setGoalTarget]=useState(()=>{try{return JSON.parse(localStorage.getItem("fs-goal")||"null")}catch{return null}});
  const[proView,setProView]=useState("home");
  const[savedReels,setSavedReels]=useState(()=>{try{return JSON.parse(localStorage.getItem("fs-saved-reels")||"[]")}catch{return[]}});
  const[likedReels,setLikedReels]=useState(()=>{try{return JSON.parse(localStorage.getItem("fs-liked-reels")||"[]")}catch{return[]}});
  const[myRoutine,setMyRoutine]=useState(()=>{try{return JSON.parse(localStorage.getItem("fs-routine")||"[]")}catch{return[]}});
  const[homeView,setHomeView]=useState("today");
  const[showRoutine,setShowRoutine]=useState(false);
  const[wFilter,setWFilter]=useState("beginner");
  const pedometerRef=useRef({lastMag:0,stepThreshold:1.2,cooldown:0});
  const geoWatchRef=useRef(null);
  const runTimerRef=useRef(null);
  const lastPosRef=useRef(null);
  const touchStartRef=useRef({x:0,y:0,time:0});
  const wakeLockRef=useRef(null);
  const runDistRef=useRef(0);
  const tmr=useRef(null);

  useEffect(()=>{(async()=>{const s=await load();if(s&&s.onboarded){
    const td=new Date().toDateString();
    const la=s.lastActiveDate?new Date(s.lastActiveDate).toDateString():null;
    const lod=s.lastOpenedDate?new Date(s.lastOpenedDate).toDateString():null;
    const yd=new Date(Date.now()-864e5).toDateString();
    
    // Streak logic: only based on workout completion date
    if(la&&la!==td&&la!==yd){s.freezeTokens>0?s.freezeTokens--:(s.streak=0)}
    
    // Reset daily counters ONLY if last opened date differs from today
    // This prevents resets on every refresh
    if(lod&&lod!==td){
      s.foodLog=[];s.foodLogTotal=0;s.steps=0;s.runKm=0;s.sleepHours=0;
    }
    
    // Always update lastOpenedDate to today so next refresh won't reset
    s.lastOpenedDate=new Date().toISOString();
    
    setU({...DU,...s});setScr("app");
  }else setScr("onboarding")})()},[]);
  useEffect(()=>{if(u.onboarded)save(u)},[u]);
  useEffect(()=>{if(tr&&tm>0){tmr.current=setTimeout(()=>setTm(t=>t-1),1e3)}else if(tm===0&&tr)setTr(false);return()=>clearTimeout(tmr.current)},[tm,tr]);

  const axp=useCallback(a=>{const m=u.streak>=30?2:u.streak>=7?1.5:1;const t=Math.round(a*m);setXpa(t);setTimeout(()=>setXpa(null),2e3);setU(x=>{const nx=x.xp+t;const nb=[...x.badges];if(nx>=1e3&&!nb.includes("xp_1000"))nb.push("xp_1000");if(nx>=5e3&&!nb.includes("xp_5000"))nb.push("xp_5000");return{...x,xp:nx,badges:nb}})},[u.streak]);

  const cw=useCallback(w=>{const td=new Date().toDateString();setU(x=>{const la=x.lastActiveDate?new Date(x.lastActiveDate).toDateString():null;const ns=la===td?x.streak:x.streak+1;const nb=[...x.badges];const nc=x.workoutsCompleted+1;if(nc>=1&&!nb.includes("first_flame"))nb.push("first_flame");if(nc>=10&&!nb.includes("workouts_10"))nb.push("workouts_10");if(ns>=7&&!nb.includes("streak_7"))nb.push("streak_7");if(ns>=30&&!nb.includes("streak_30"))nb.push("streak_30");return{...x,streak:ns,longestStreak:Math.max(x.longestStreak,ns),lastActiveDate:new Date().toISOString(),workoutsCompleted:nc,totalMinutes:x.totalMinutes+w.duration,badges:nb,completedWorkoutIds:[...x.completedWorkoutIds,w.id]}});axp(w.xp);setWa(null);setEi(0);setPop({type:"complete",w})},[axp]);

  const cfa=useCallback(d=>{const{pushups,flexibility,heartRate,weight,height,age}=d;const bmi=weight/((height/100)**2);const ps=Math.min(pushups/25,1)*30;const fls=Math.min(flexibility/40,1)*20;const hs=Math.min(Math.max(1-(heartRate-50)/60,0),1)*30;const bs=Math.min(Math.max(1-Math.abs(bmi-22)/10,0),1)*20;return Math.max(15,Math.min(Math.round(age-(ps+fls+hs+bs-50)*.4),age+20))},[]);

  const addFood=f=>{setU(x=>{const nl=[{...f,date:new Date().toISOString(),id:Date.now()},...(x.foodLog||[])];const nb=[...x.badges];if(nl.length>=10&&!nb.includes("food_tracker"))nb.push("food_tracker");return{...x,foodLog:nl,foodLogTotal:(x.foodLogTotal||0)+f.cal,badges:nb}});axp(5);setPop({type:"food",f})};

  const logAct=(type,val)=>{const v=Number(val);const e={type,value:v,date:new Date().toISOString()};setU(x=>{const nl=[e,...(x.activityLog||[])];if(type==="walk")return{...x,steps:(x.steps||0)+v,activityLog:nl};if(type==="run")return{...x,runKm:Math.round(((x.runKm||0)+v)*100)/100,activityLog:nl};if(type==="sleep")return{...x,sleepHours:v,sleepLog:[e,...(x.sleepLog||[]).slice(0,6)],activityLog:nl};return x});axp(type==="sleep"?10:15)};

  // ── Wake Lock to keep screen on during tracking ──
  const requestWakeLock=async()=>{
    try{
      if("wakeLock" in navigator){
        wakeLockRef.current=await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release",()=>{});
      }
    }catch(e){console.warn("Wake lock failed:",e)}
  };
  const releaseWakeLock=async()=>{
    try{
      if(wakeLockRef.current){
        await wakeLockRef.current.release();
        wakeLockRef.current=null;
      }
    }catch(e){}
  };

  // ── Accelerometer pedometer ──
  const startPedometer=()=>{
    if(!window.DeviceMotionEvent){alert("Step counter not supported on this device.");return}
    // Request permission on iOS 13+
    if(typeof DeviceMotionEvent.requestPermission==="function"){
      DeviceMotionEvent.requestPermission().then(r=>{if(r==="granted")initPedometer();else alert("Motion sensor permission denied.")}).catch(()=>alert("Motion sensor permission error."));
    }else{initPedometer()}
  };
  const initPedometer=()=>{
    setPedoActive(true);setLiveSteps(0);
    requestWakeLock(); // Keep screen on while counting
    const ref=pedometerRef.current;ref.cooldown=0;ref.lastMag=9.8;
    const handler=(e)=>{
      const a=e.accelerationIncludingGravity;if(!a)return;
      const mag=Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z);
      const diff=Math.abs(mag-ref.lastMag);ref.lastMag=mag;
      if(ref.cooldown>0){ref.cooldown--;return}
      if(diff>ref.stepThreshold){setLiveSteps(s=>s+1);ref.cooldown=8}
    };
    window.addEventListener("devicemotion",handler);
    pedometerRef.current.handler=handler;
  };
  const stopPedometer=()=>{
    if(pedometerRef.current.handler)window.removeEventListener("devicemotion",pedometerRef.current.handler);
    releaseWakeLock();
    setPedoActive(false);
    setLiveSteps(currentSteps=>{
      if(currentSteps>0)logAct("walk",currentSteps);
      return 0;
    });
  };

  // ── GPS run tracker — uses ref so distance stays accurate ──
  const startRun=()=>{
    if(!navigator.geolocation){alert("GPS not available.");return}
    setRunActive(true);setRunDist(0);setRunTime(0);
    runDistRef.current=0;lastPosRef.current=null;
    requestWakeLock(); // Keep screen on during run
    geoWatchRef.current=navigator.geolocation.watchPosition(
      (pos)=>{
        const{latitude:lat,longitude:lon,accuracy}=pos.coords;
        // Skip very inaccurate readings (>50m accuracy)
        if(accuracy>50)return;
        if(lastPosRef.current){
          const d=haversine(lastPosRef.current.lat,lastPosRef.current.lon,lat,lon);
          // Accept movement between 1m and 200m per reading (filter GPS jitter and jumps)
          if(d>0.001&&d<0.2){
            runDistRef.current=Math.round((runDistRef.current+d)*1000)/1000;
            setRunDist(runDistRef.current);
          }
        }
        lastPosRef.current={lat,lon};
      },
      (err)=>{
        console.warn("GPS error:",err);
        if(err.code===1)alert("Location permission denied. Enable GPS in your browser settings.");
        if(err.code===2)alert("GPS signal not available. Move to an open area.");
      },
      {enableHighAccuracy:true,maximumAge:0,timeout:15000}
    );
    runTimerRef.current=setInterval(()=>setRunTime(t=>t+1),1000);
  };
  const stopRun=()=>{
    if(geoWatchRef.current)navigator.geolocation.clearWatch(geoWatchRef.current);
    if(runTimerRef.current)clearInterval(runTimerRef.current);
    releaseWakeLock();
    setRunActive(false);
    const finalDist=runDistRef.current;
    if(finalDist>0)logAct("run",finalDist);
    runDistRef.current=0;
  };
  const haversine=(lat1,lon1,lat2,lon2)=>{const R=6371;const dLat=(lat2-lat1)*Math.PI/180;const dLon=(lon2-lon1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))};
  const fmtTime=(s)=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  // ── Reels interactions: like, save, share, add to routine ──
  const toggleLikeReel=(reel)=>{
    setLikedReels(prev=>{
      const exists=prev.includes(reel.id);
      const next=exists?prev.filter(id=>id!==reel.id):[...prev,reel.id];
      try{localStorage.setItem("fs-liked-reels",JSON.stringify(next))}catch{}
      return next;
    });
    if(!likedReels.includes(reel.id))axp(2);
  };
  const toggleSaveReel=(reel)=>{
    setSavedReels(prev=>{
      const exists=prev.find(r=>r.id===reel.id);
      const next=exists?prev.filter(r=>r.id!==reel.id):[...prev,reel];
      try{localStorage.setItem("fs-saved-reels",JSON.stringify(next))}catch{}
      return next;
    });
  };
  const addReelToRoutine=(reel)=>{
    setMyRoutine(prev=>{
      if(prev.find(r=>r.id===reel.id)){setPop({type:"already",msg:"Already in your routine!"});return prev}
      const next=[...prev,{...reel,addedAt:Date.now()}];
      try{localStorage.setItem("fs-routine",JSON.stringify(next))}catch{}
      setPop({type:"added",r:reel});
      axp(5);
      return next;
    });
  };
  const removeFromRoutine=(reelId)=>{
    setMyRoutine(prev=>{
      const next=prev.filter(r=>r.id!==reelId);
      try{localStorage.setItem("fs-routine",JSON.stringify(next))}catch{}
      return next;
    });
  };
  const shareReel=async(reel)=>{
    const text=`Check out "${reel.title}" workout on FitStreak! 💪 ${reel.duration} • ${reel.trainer}`;
    if(navigator.share){
      try{await navigator.share({title:reel.title,text,url:window.location.href})}catch{}
    }else{
      try{await navigator.clipboard.writeText(text);setPop({type:"copied"})}catch{}
    }
  };

  // ── PRO FEATURE GATING ──
  const requirePro=(featureName)=>{
    if(isPro)return true;
    setPaywallFeature(featureName);
    setShowPaywall(true);
    return false;
  };

  // ── RAZORPAY PAYMENT (with demo mode) ──
  // Set RAZORPAY_ENABLED=true after creating Razorpay account and adding key
  const RAZORPAY_ENABLED=false;
  const RAZORPAY_KEY="rzp_test_YOUR_KEY_HERE"; // Replace with real key from razorpay.com
  
  const handlePayment=async(plan)=>{
    if(!RAZORPAY_ENABLED){
      // Demo mode: show waitlist message
      alert(`🎉 You're on the waitlist for FitStreak Pro!\n\nWe'll email you the moment Pro launches with a 50% early-bird discount.\n\nFor now, all your progress is saved. Keep building that streak!`);
      // For demo: actually grant Pro access so user can test features
      setIsPro(true);
      try{localStorage.setItem("fs-pro","1")}catch{}
      setShowPaywall(false);
      return;
    }
    // Real Razorpay integration
    if(!window.Razorpay){
      const script=document.createElement("script");
      script.src="https://checkout.razorpay.com/v1/checkout.js";
      script.onload=()=>processPayment(plan);
      document.body.appendChild(script);
    }else{
      processPayment(plan);
    }
  };
  
  const processPayment=async(plan)=>{
    const amount=plan==="monthly"?9900:59900; // in paise
    try{
      // In production, create order on backend first
      const resp=await fetch("/api/create-order",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({amount,plan})
      });
      const order=await resp.json();
      if(!order.id){alert("Payment setup failed. Try again.");return}
      const options={
        key:RAZORPAY_KEY,
        amount,
        currency:"INR",
        name:"FitStreak Pro",
        description:plan==="monthly"?"Monthly Pro Subscription":"Annual Pro Subscription",
        order_id:order.id,
        handler:(response)=>{
          // Payment successful
          setIsPro(true);
          try{localStorage.setItem("fs-pro","1")}catch{}
          setShowPaywall(false);
          alert("🎉 Welcome to FitStreak Pro! All AI features unlocked.");
        },
        prefill:{name:u.name},
        theme:{color:"#FF6B35"}
      };
      const rzp=new window.Razorpay(options);
      rzp.open();
    }catch(e){alert("Payment failed. Try again.")}
  };

  // ── AI COACH CHAT ──
  const sendChatMessage=async(message)=>{
    if(!message.trim()||chatLoading)return;
    const userMsg={role:"user",content:message,time:Date.now()};
    const newMessages=[...chatMessages,userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);
    try{localStorage.setItem("fs-chat",JSON.stringify(newMessages))}catch{}
    try{
      const userContext=`User context: Name=${u.name||"User"}, Goal=${u.goal||"general fitness"}, Level=${u.level||"beginner"}, Streak=${u.streak||0} days, Total XP=${u.xp||0}, Today's steps=${u.steps||0}, Today's calories=${u.foodLogTotal||0}`;
      const resp=await fetch("/api/ai-coach",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message,context:userContext,history:newMessages.slice(-6).map(m=>({role:m.role,content:m.content}))})
      });
      const data=await resp.json();
      if(data.error){
        const errMsg={role:"assistant",content:"Sorry, I'm having trouble right now. Try again in a moment.",time:Date.now()};
        setChatMessages([...newMessages,errMsg]);
      }else{
        const aiMsg={role:"assistant",content:data.reply,time:Date.now()};
        const updated=[...newMessages,aiMsg];
        setChatMessages(updated);
        try{localStorage.setItem("fs-chat",JSON.stringify(updated))}catch{}
      }
    }catch(e){
      const errMsg={role:"assistant",content:"Connection failed. Check your internet and try again.",time:Date.now()};
      setChatMessages([...newMessages,errMsg]);
    }
    setChatLoading(false);
  };

  // ── DAILY/WEEKLY REPORT GENERATOR ──
  const generateReport=async(type)=>{
    setReportLoading(true);
    try{
      const userData={
        name:u.name,goal:u.goal,level:u.level,
        streak:u.streak,xp:u.xp,
        steps:u.steps||0,runKm:u.runKm||0,sleepHours:u.sleepHours||0,
        caloriesEaten:u.foodLogTotal||0,
        workoutsCompleted:u.workoutsCompleted||0,
        recentFoods:(u.foodLog||[]).slice(0,5).map(f=>f.name),
        recentActivities:(u.activityLog||[]).slice(0,7).map(a=>`${a.type}:${a.value}`),
        heartRateResting:heartRate.resting,heartRateMax:heartRate.max,
        measurements:bodyMeasurements
      };
      const resp=await fetch("/api/generate-report",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({type,userData})
      });
      const data=await resp.json();
      if(data.error){
        if(type==="daily")setDailyReport({error:data.error});
        else setWeeklyReport({error:data.error});
      }else{
        if(type==="daily")setDailyReport(data.report);
        else setWeeklyReport(data.report);
      }
    }catch(e){
      const errReport={error:"Could not generate report. Try again."};
      if(type==="daily")setDailyReport(errReport);
      else setWeeklyReport(errReport);
    }
    setReportLoading(false);
  };

  // ── WORKOUT ANALYSIS ──
  const analyzeWorkout=async(workout)=>{
    try{
      const resp=await fetch("/api/analyze-workout",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          workoutName:workout.name,
          exercises:workout.exercises.map(e=>e.name),
          duration:workout.duration,
          difficulty:workout.difficulty,
          userLevel:u.level,
          userGoal:u.goal,
          totalWorkoutsCompleted:u.workoutsCompleted||0
        })
      });
      const data=await resp.json();
      if(data.analysis)setWorkoutAnalysis(data.analysis);
    }catch(e){console.error(e)}
  };

  // Save measurements
  const saveMeasurements=(m)=>{
    setBodyMeasurements(m);
    try{localStorage.setItem("fs-measurements",JSON.stringify(m))}catch{}
  };

  // Save goal
  const saveGoal=(g)=>{
    setGoalTarget(g);
    try{localStorage.setItem("fs-goal",JSON.stringify(g))}catch{}
  };

  // ── AI FOOD SCANNER — photo → calorie estimate ──
  const scanFood=async(file)=>{
    if(!file||scanLoading)return;
    setScanLoading(true);setScanResult(null);
    try{
      const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file)});
      const resp=await fetch("/api/scan-food",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({image:base64,mimeType:file.type||"image/jpeg"})
      });
      const data=await resp.json();
      if(data.error){setScanResult({error:data.error})}
      else{setScanResult(data)}
    }catch(e){setScanResult({error:"Scan failed. Try again."})}
    setScanLoading(false);
  };

  // ── AI POSTURE ANALYZER — photo → form feedback ──
  const analyzePosture=async(file,exerciseName)=>{
    if(!file||postureLoading)return;
    setPostureLoading(true);setPostureResult(null);
    try{
      const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file)});
      const resp=await fetch("/api/analyze-posture",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({image:base64,mimeType:file.type||"image/jpeg",exerciseName})
      });
      const data=await resp.json();
      if(data.error){setPostureResult({error:data.error})}
      else{setPostureResult(data)}
    }catch(e){setPostureResult({error:"Analysis failed. Try again."})}
    setPostureLoading(false);
  };

  // ── LOADING ──
  if(scr==="loading")return <div style={AS}><div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>{"\u26A1"}</div><p style={{color:"#b0b0b8"}}>Loading FitStreak...</p></div></div></div>;

  // ── ONBOARDING ──
  if(scr==="onboarding"){const steps=[
    <div key="0" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:32,textAlign:"center"}}><div style={{fontSize:72,marginBottom:16}}>{"\u26A1"}</div><h1 style={{fontSize:42,fontWeight:800,background:"linear-gradient(135deg,#FF6B35,#E94560)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8,letterSpacing:-1}}>FitStreak</h1><p style={{fontSize:18,color:"#b0b0b8",marginBottom:48,maxWidth:280,lineHeight:1.5}}>Your fitness, gamified. Streaks, XP, compete.</p><button onClick={()=>setOs(1)} style={BP}>Get Started →</button></div>,
    <div key="1" style={OS}><p style={OL}>What should we call you?</p><input value={od.name} onChange={e=>setOd(d=>({...d,name:e.target.value}))} placeholder="Your name" style={IS}/><button disabled={!od.name.trim()} onClick={()=>setOs(2)} style={{...BP,opacity:od.name.trim()?1:.4}}>Next →</button></div>,
    <div key="2" style={OS}><p style={OL}>Your main goal?</p>{["Lose Fat \u{1F525}","Build Muscle \u{1F4AA}","Get Flexible \u{1F9D8}","Stay Active \u26A1"].map(g=><button key={g} onClick={()=>{setOd(d=>({...d,goal:g}));setOs(3)}} style={{...CB,background:od.goal===g?"#FF6B35":"#1A1A2E",color:od.goal===g?"#fff":"#aaa"}}>{g}</button>)}</div>,
    <div key="3" style={OS}><p style={OL}>Fitness level?</p>{[["Beginner \u{1F331}","beginner"],["Intermediate \u{1F4AB}","intermediate"],["Advanced \u{1F3C6}","advanced"]].map(([l,v])=><button key={v} onClick={()=>{setOd(d=>({...d,level:v}));setOs(4)}} style={{...CB,background:od.level===v?"#FF6B35":"#1A1A2E",color:od.level===v?"#fff":"#aaa"}}>{l}</button>)}</div>,
    <div key="4" style={OS}><p style={OL}>Workout duration?</p>{[5,10,15,20,30].map(d=><button key={d} onClick={()=>{setOd(x=>({...x,duration:d}));setOs(5)}} style={{...CB,background:od.duration===d?"#FF6B35":"#1A1A2E",color:od.duration===d?"#fff":"#aaa"}}>{d} min</button>)}</div>,
    <div key="5" style={{...OS,textAlign:"center"}}><div style={{fontSize:64,marginBottom:16}}>{"\u{1F680}"}</div><h2 style={{fontSize:28,fontWeight:800,color:"#fff",marginBottom:8}}>You're set, {od.name}!</h2><p style={{color:"#b0b0b8",marginBottom:32,fontSize:15}}>Let's build an unbreakable streak.</p><button onClick={()=>{setU({...DU,...od,onboarded:true});setScr("app")}} style={BP}>Start My Journey {"\u26A1"}</button></div>,
  ];return <div style={AS}><div style={G1}/><div style={G2}/>{steps[os]}</div>}

  // ── HOME — with Today/Week/Month stat tabs ──
  const Home=()=>{
    const h=new Date().getHours();
    const gr=h<12?"Good morning":h<17?"Good afternoon":"Good evening";
    const sportMotivs=MOTIV[u.sport]||MOTIV.default;
    const q=sportMotivs[new Date().getDate()%sportMotivs.length];
    const rec=WORKOUTS_DB.filter(w=>w.difficulty===u.level||w.difficulty==="beginner").slice(0,4);
    const tc=u.foodLogTotal||0;
    const today=new Date().toDateString();
    
    // Calculate stats based on viewMode (today/week/month)
    const log=u.activityLog||[];
    const now=Date.now();
    const dayMs=86400000;
    const periodMs=homeView==="today"?dayMs:homeView==="week"?dayMs*7:dayMs*30;
    const cutoff=now-periodMs;
    
    const filteredLog=log.filter(a=>new Date(a.date).getTime()>=cutoff);
    const periodSteps=homeView==="today"?(u.steps||0):filteredLog.filter(a=>a.type==="walk").reduce((sum,a)=>sum+Number(a.value||0),0);
    const periodRun=homeView==="today"?(u.runKm||0):filteredLog.filter(a=>a.type==="run").reduce((sum,a)=>sum+Number(a.value||0),0);
    const sleepEntries=filteredLog.filter(a=>a.type==="sleep");
    const periodSleep=homeView==="today"?(u.sleepHours||0):sleepEntries.length>0?(sleepEntries.reduce((sum,a)=>sum+Number(a.value||0),0)/sleepEntries.length):0;
    const periodCals=homeView==="today"?tc:filteredLog.length>0?(tc*(homeView==="week"?7:30)):0; // estimated
    
    const stepsGoal=homeView==="today"?10000:homeView==="week"?70000:300000;
    const runGoal=homeView==="today"?5:homeView==="week"?25:100;
    
    return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <p style={{fontSize:13,color:"#9a9aa2",marginBottom:2}}>{gr}</p>
          <h1 style={{fontSize:24,fontWeight:800,color:"#fff"}}>{u.name} {"\u270C\uFE0F"}</h1>
        </div>
        <div style={{display:"flex",gap:6}}>
          <div style={SP}><span style={{fontSize:14}}>{"\u{1F525}"}</span><span style={{fontSize:14,fontWeight:700,color:"#FF6B35"}}>{u.streak}</span></div>
          <div style={SP}><span style={{fontSize:14}}>{"\u26A1"}</span><span style={{fontSize:14,fontWeight:700,color:"#E94560"}}>{u.xp.toLocaleString()}</span></div>
        </div>
      </div>

      {/* General Motivational Quote — rotates daily */}
      <div style={{background:"linear-gradient(135deg,#1A1A2E,#16213E)",borderRadius:16,padding:16,marginBottom:16,border:"1px solid #ffffff08"}}>
        <p style={{fontSize:14,color:"#eaeaea",lineHeight:1.6,fontStyle:"italic"}}>{MOTIV.default[new Date().getDate()%MOTIV.default.length]}</p>
      </div>

      {/* Streak Card */}
      <div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:20,padding:20,marginBottom:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,fontSize:120,opacity:.1}}>{"\u{1F525}"}</div>
        <p style={{fontSize:11,color:"#ffffffcc",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Current Streak</p>
        <div style={{display:"flex",alignItems:"baseline",gap:6}}>
          <span style={{fontSize:46,fontWeight:900,color:"#fff"}}>{u.streak}</span>
          <span style={{fontSize:16,color:"#ffffffcc"}}>days</span>
        </div>
        <div style={{display:"flex",gap:14,marginTop:10}}>
          <div><span style={{fontSize:11,color:"#ffffffcc"}}>Longest</span><p style={{fontSize:15,fontWeight:700,color:"#fff"}}>{u.longestStreak}d</p></div>
          <div><span style={{fontSize:11,color:"#ffffffcc"}}>Freeze</span><p style={{fontSize:15,fontWeight:700,color:"#fff"}}>{u.freezeTokens}{"\u{1F9CA}"}</p></div>
          <div><span style={{fontSize:11,color:"#ffffffcc"}}>Multiplier</span><p style={{fontSize:15,fontWeight:700,color:"#fff"}}>{u.streak>=30?"2x":u.streak>=7?"1.5x":"1x"}</p></div>
        </div>
      </div>

      {/* TIME PERIOD TABS */}
      <div style={{display:"flex",gap:6,marginBottom:12,background:"#12121A",padding:4,borderRadius:12,border:"1px solid #ffffff08"}}>
        {[["today","Today"],["week","This Week"],["month","This Month"]].map(([id,label])=>
          <button key={id} onClick={()=>setHomeView(id)} style={{flex:1,background:homeView===id?"linear-gradient(135deg,#FF6B35,#E94560)":"transparent",border:"none",borderRadius:8,padding:"8px 4px",color:homeView===id?"#fff":"#b0b0b8",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>{label}</button>
        )}
      </div>

      {/* STATS GRID — adapts to selected period */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {/* Steps */}
        <button onClick={()=>setTab("activity")} style={{...MC,padding:"14px 12px",alignItems:"flex-start",textAlign:"left"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",marginBottom:4}}>
            <span style={{fontSize:18}}>{"\u{1F6B6}"}</span>
            <span style={{fontSize:9,color:"#b0b0b8",textTransform:"uppercase",fontWeight:600}}>{homeView}</span>
          </div>
          <span style={{fontSize:22,fontWeight:800,color:"#38ef7d"}}>{Math.round(periodSteps).toLocaleString()}</span>
          <span style={{fontSize:10,color:"#b0b0b8",marginTop:2}}>steps · goal {(stepsGoal/1000)}K</span>
          <div style={{width:"100%",height:4,background:"#1A1A2E",borderRadius:2,marginTop:6}}>
            <div style={{width:`${Math.min((periodSteps/stepsGoal)*100,100)}%`,height:"100%",background:"#38ef7d",borderRadius:2}}/>
          </div>
        </button>
        {/* Run */}
        <button onClick={()=>{setTab("activity");setAt("run")}} style={{...MC,padding:"14px 12px",alignItems:"flex-start",textAlign:"left"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",marginBottom:4}}>
            <span style={{fontSize:18}}>{"\u{1F3C3}"}</span>
            <span style={{fontSize:9,color:"#b0b0b8",textTransform:"uppercase",fontWeight:600}}>{homeView}</span>
          </div>
          <span style={{fontSize:22,fontWeight:800,color:"#FF6B35"}}>{periodRun.toFixed(1)}</span>
          <span style={{fontSize:10,color:"#b0b0b8",marginTop:2}}>km · goal {runGoal}km</span>
          <div style={{width:"100%",height:4,background:"#1A1A2E",borderRadius:2,marginTop:6}}>
            <div style={{width:`${Math.min((periodRun/runGoal)*100,100)}%`,height:"100%",background:"#FF6B35",borderRadius:2}}/>
          </div>
        </button>
        {/* Sleep */}
        <button onClick={()=>{setTab("activity");setAt("sleep")}} style={{...MC,padding:"14px 12px",alignItems:"flex-start",textAlign:"left"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",marginBottom:4}}>
            <span style={{fontSize:18}}>{"\u{1F634}"}</span>
            <span style={{fontSize:9,color:"#b0b0b8",textTransform:"uppercase",fontWeight:600}}>{homeView==="today"?"last":"avg"}</span>
          </div>
          <span style={{fontSize:22,fontWeight:800,color:"#667eea"}}>{periodSleep.toFixed(1)}h</span>
          <span style={{fontSize:10,color:"#b0b0b8",marginTop:2}}>sleep · goal 8h</span>
          <div style={{width:"100%",height:4,background:"#1A1A2E",borderRadius:2,marginTop:6}}>
            <div style={{width:`${Math.min((periodSleep/8)*100,100)}%`,height:"100%",background:"#667eea",borderRadius:2}}/>
          </div>
        </button>
        {/* Calories */}
        <button onClick={()=>setTab("food")} style={{...MC,padding:"14px 12px",alignItems:"flex-start",textAlign:"left"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",marginBottom:4}}>
            <span style={{fontSize:18}}>{"\u{1F37D}\uFE0F"}</span>
            <span style={{fontSize:9,color:"#b0b0b8",textTransform:"uppercase",fontWeight:600}}>{homeView}</span>
          </div>
          <span style={{fontSize:22,fontWeight:800,color:"#f093fb"}}>{Math.round(periodCals).toLocaleString()}</span>
          <span style={{fontSize:10,color:"#b0b0b8",marginTop:2}}>kcal eaten</span>
          <div style={{width:"100%",height:4,background:"#1A1A2E",borderRadius:2,marginTop:6}}>
            <div style={{width:`${Math.min((periodCals/(2000*(homeView==="today"?1:homeView==="week"?7:30)))*100,100)}%`,height:"100%",background:"#f093fb",borderRadius:2}}/>
          </div>
        </button>
      </div>

      {/* Daily Sport Motivation */}
      <div style={{background:"linear-gradient(135deg,#1A1A2E,#16213E)",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #ffffff08"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:10,color:"#667eea",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Daily {u.sport==="cricket"?"Cricket":u.sport==="football"?"Football":u.sport==="tennis"?"Tennis":u.sport==="athletics"?"Athletics":"Fitness"} Motivation</span>
          <span style={{fontSize:10,color:"#9a9aa2"}}>Day {new Date().getDate()}</span>
        </div>
        <p style={{fontSize:13,color:"#eaeaea",lineHeight:1.6}}>{q}</p>
      </div>

      {/* Fitness Age CTA */}
      {u.fitnessAge===0?
        <button onClick={()=>{setFts(1);setFtd({});setTab("ft")}} style={{width:"100%",background:"linear-gradient(135deg,#667eea,#764ba2)",border:"none",borderRadius:16,padding:16,textAlign:"left",cursor:"pointer",marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <p style={{fontSize:10,color:"#ffffffcc",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5}}>Viral Challenge</p>
              <p style={{fontSize:17,fontWeight:800,color:"#fff",marginTop:4}}>Check Your Fitness Age {"\u{1F9EC}"}</p>
              <p style={{fontSize:12,color:"#ffffffcc",marginTop:2}}>60s test · Share with friends</p>
            </div>
            <span style={{fontSize:28}}>{"\u2192"}</span>
          </div>
        </button>
      :<div style={{background:"#1A1A2E",borderRadius:14,padding:14,marginBottom:18,border:"1px solid #ffffff08"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{fontSize:11,color:"#b0b0b8",textTransform:"uppercase",letterSpacing:1}}>Fitness Age</p>
            <div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:2}}>
              <span style={{fontSize:30,fontWeight:900,color:u.fitnessAge<u.realAge?"#38ef7d":"#E94560"}}>{u.fitnessAge}</span>
              <span style={{fontSize:13,color:"#b0b0b8"}}>vs {u.realAge}</span>
            </div>
          </div>
          <button onClick={()=>{setFts(1);setFtd({});setTab("ft")}} style={{background:"#ffffff10",border:"1px solid #ffffff15",borderRadius:10,padding:"6px 12px",color:"#eaeaea",fontSize:12,cursor:"pointer"}}>Retake →</button>
        </div>
      </div>}

      {/* Recommended Workouts */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <h2 style={{fontSize:17,fontWeight:700,color:"#fff"}}>Recommended for You</h2>
        <span style={{fontSize:11,color:"#b0b0b8"}}>{rec.length} workouts</span>
      </div>
      {rec.map(w=>
        <button key={w.id} onClick={()=>{setWa(w);setEi(0);setTab("wo")}} style={WR}>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:14,fontWeight:700,color:"#fff"}}>{w.name}</p>
            <p style={{fontSize:11,color:"#b0b0b8",marginTop:2}}>{w.duration}m · {w.difficulty} · +{w.xp}XP</p>
          </div>
          <div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:10,padding:"7px 14px",flexShrink:0}}>
            <span style={{color:"#fff",fontSize:12,fontWeight:700}}>Start</span>
          </div>
        </button>
      )}
      
      {/* All Workouts — Categorized */}
      <div style={{marginBottom:10,marginTop:20}}>
        <h2 style={{fontSize:17,fontWeight:700,color:"#fff"}}>All Workouts</h2>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12,background:"#12121A",padding:4,borderRadius:12,border:"1px solid #ffffff08"}}>
        {[["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]].map(([id,label])=>
          <button key={id} onClick={()=>setWFilter(id)} style={{flex:1,background:wFilter===id?(id==="beginner"?"#38ef7d":id==="intermediate"?"linear-gradient(135deg,#FF6B35,#E94560)":"linear-gradient(135deg,#E94560,#764ba2)"):"transparent",border:"none",borderRadius:8,padding:"8px 2px",color:wFilter===id?(id==="beginner"?"#0A0A0F":"#fff"):"#b0b0b8",fontSize:11,fontWeight:700,cursor:"pointer"}}>{label}</button>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {WORKOUTS_DB.filter(w=>w.difficulty===wFilter).map(w=>
          <button key={w.id} onClick={()=>{setWa(w);setEi(0);setTab("wo")}} style={{...WC,padding:14}}>
            <div style={{fontSize:24,marginBottom:6}}>{w.type==="hiit"?"\u{1F525}":w.type==="strength"?"\u{1F4AA}":"\u{1F9D8}"}</div>
            <p style={{fontSize:13,fontWeight:700,color:"#fff",lineHeight:1.3}}>{w.name}</p>
            <p style={{fontSize:11,color:"#b0b0b8",marginTop:3}}>{w.duration}m · +{w.xp}XP</p>
            <div style={{display:"flex",gap:4,marginTop:6}}>
              <span style={{fontSize:9,background:w.difficulty==="beginner"?"#38ef7d20":w.difficulty==="intermediate"?"#FF6B3520":"#E9456020",color:w.difficulty==="beginner"?"#38ef7d":w.difficulty==="intermediate"?"#FF6B35":"#E94560",padding:"2px 6px",borderRadius:6,fontWeight:600}}>{w.difficulty}</span>
            </div>
          </button>
        )}
      </div>
    </div>;
  };

  // ── WORKOUT PLAYER ──
  const Workout=()=>{if(!wa){setTab("home");return null}const ex=wa.exercises[ei];const pr=((ei+1)/wa.exercises.length)*100;
  return <div style={{minHeight:"100vh",background:"#0A0A0F",padding:"20px 16px",position:"relative",zIndex:1}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><button onClick={()=>{setWa(null);setTab("home")}} style={BB}>← Back</button><span style={{fontSize:13,color:"#b0b0b8"}}>{ei+1}/{wa.exercises.length}</span></div>
    <div style={{background:"#1A1A2E",borderRadius:6,height:5,marginBottom:20,overflow:"hidden"}}><div style={{width:`${pr}%`,height:"100%",background:"linear-gradient(90deg,#FF6B35,#E94560)",borderRadius:6,transition:"width .5s"}}/></div>
    <h1 style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:2}}>{wa.name}</h1>
    <p style={{fontSize:13,color:"#b0b0b8",marginBottom:16}}>{wa.duration}m · {wa.exercises.length} exercises</p>
    <div style={{background:"linear-gradient(135deg,#1A1A2E,#0F3460)",borderRadius:20,padding:24,marginBottom:16,textAlign:"center",border:"1px solid #ffffff10"}}>
      <p style={{fontSize:12,color:"#FF6B35",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Current Exercise</p>
      <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><ExAnim type={ex.anim||"jj"} size={140}/></div>
      <h2 style={{fontSize:24,fontWeight:900,color:"#fff",marginBottom:10}}>{ex.name}</h2>
      <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:14}}>
        <div><span style={{fontSize:22,fontWeight:800,color:"#FF6B35"}}>{ex.sets}</span><p style={{fontSize:11,color:"#b0b0b8"}}>Sets</p></div>
        <div><span style={{fontSize:22,fontWeight:800,color:"#E94560"}}>{ex.reps}</span><p style={{fontSize:11,color:"#b0b0b8"}}>Reps</p></div>
        <div><span style={{fontSize:22,fontWeight:800,color:"#667eea"}}>{ex.rest}s</span><p style={{fontSize:11,color:"#b0b0b8"}}>Rest</p></div>
      </div>
      <div style={{background:"#ffffff08",borderRadius:10,padding:10}}><p style={{fontSize:12,color:"#ccc"}}>{"\u{1F4A1}"} {ex.tip}</p></div>
        <a href={`https://m.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}+exercise+proper+form`} target="_blank" rel="noopener noreferrer" style={{display:"block",marginTop:10,background:"#FF000020",border:"1px solid #FF000040",borderRadius:10,padding:"8px 14px",textAlign:"center",textDecoration:"none",color:"#ff4444",fontSize:13,fontWeight:600}}>{"\u25B6"} Watch Exercise Demo on YouTube</a>
        {/* AI Posture Analyzer */}
        <div style={{marginTop:10}}>
          <label style={{display:"block",background:isPro?"linear-gradient(135deg,#38ef7d,#11998e)":"#1A1A2E",borderRadius:10,padding:"10px 14px",textAlign:"center",cursor:isPro?"pointer":"default",border:isPro?"none":"1px solid #ffffff15"}}>
            <span style={{color:isPro?"#0A0A0F":"#b0b0b8",fontSize:13,fontWeight:700}}>{postureLoading?"Analyzing form...":"\u{1F4F7} AI Form Check — Snap Your Posture"}</span>
            {isPro&&<input type="file" accept="image/*" capture="environment" onChange={e=>{if(e.target.files[0])analyzePosture(e.target.files[0],ex.name)}} style={{display:"none"}}/>}
            {!isPro&&<span onClick={e=>{e.preventDefault();requirePro("AI Posture Analysis")}} style={{display:"block",fontSize:10,color:"#9a9aa2",marginTop:2}}>Pro feature — tap to unlock</span>}
          </label>
          {postureResult&&!postureResult.error&&<div style={{marginTop:8,background:"#11998e15",border:"1px solid #11998e30",borderRadius:10,padding:12}}>
            <p style={{fontSize:13,fontWeight:700,color:"#38ef7d",marginBottom:6}}>{"\u{1F3AF}"} Form Analysis: {postureResult.score}/10</p>
            <p style={{fontSize:12,color:"#fff",lineHeight:1.5,marginBottom:6}}>{postureResult.feedback}</p>
            {postureResult.corrections&&<div style={{background:"#FF6B3515",border:"1px solid #FF6B3530",borderRadius:8,padding:8,marginTop:6}}>
              <p style={{fontSize:11,fontWeight:700,color:"#FF6B35",marginBottom:4}}>{"\u26A0\uFE0F"} Corrections:</p>
              <p style={{fontSize:11,color:"#fff",lineHeight:1.5}}>{postureResult.corrections}</p>
            </div>}
            <button onClick={()=>setPostureResult(null)} style={{marginTop:8,background:"none",border:"none",color:"#9a9aa2",fontSize:11,cursor:"pointer"}}>Dismiss</button>
          </div>}
          {postureResult&&postureResult.error&&<p style={{fontSize:12,color:"#E94560",marginTop:6}}>{postureResult.error}</p>}
        </div>
    </div>
    <div style={{textAlign:"center",marginBottom:20}}>{tr?<div><p style={{fontSize:13,color:"#b0b0b8",marginBottom:6}}>Rest Timer</p><span style={{fontSize:44,fontWeight:900,color:"#FF6B35"}}>{tm}s</span></div>:<button onClick={()=>{setTm(ex.rest);setTr(true)}} style={{background:"#1A1A2E",border:"1px solid #FF6B35",borderRadius:12,padding:"9px 22px",color:"#FF6B35",fontSize:13,fontWeight:600,cursor:"pointer"}}>Start Rest Timer ({ex.rest}s)</button>}</div>
    <div style={{display:"flex",gap:10}}>{ei>0&&<button onClick={()=>setEi(i=>i-1)} style={{...BS,flex:1}}>← Previous</button>}{ei<wa.exercises.length-1?<button onClick={()=>{setEi(i=>i+1);setTr(false)}} style={{...BP,flex:1}}>Next Exercise →</button>:<button onClick={()=>cw(wa)} style={{...BP,flex:1,background:"linear-gradient(135deg,#38ef7d,#11998e)"}}>Complete {"\u2705"}</button>}</div>
  </div>};

  // ── FITNESS TEST ──
  const FTest=()=>{const ss=[null,{l:"Your Age",k:"age",p:"22",un:"years"},{l:"Height",k:"height",p:"170",un:"cm"},{l:"Weight",k:"weight",p:"65",un:"kg"},{l:"Push-ups in 30s",k:"pushups",p:"15",un:"reps"},{l:"Sit & Reach",k:"flexibility",p:"25",un:"cm"},{l:"Resting Heart Rate",k:"heartRate",p:"72",un:"BPM"}];
  if(fts===7){const fa=cfa(ftd);const diff=ftd.age-fa;const iy=diff>0;if(u.fitnessAge!==fa)setTimeout(()=>{setU(x=>{const nb=[...x.badges];if(!nb.includes("age_test"))nb.push("age_test");return{...x,fitnessAge:fa,realAge:ftd.age,badges:nb}});axp(30)},100);
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",position:"relative",zIndex:1}}><div style={{background:"linear-gradient(135deg,#1A1A2E,#0F3460)",borderRadius:24,padding:28,width:"100%",maxWidth:360,border:"1px solid #ffffff10",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-40,right:-40,fontSize:100,opacity:.1}}>{"\u{1F9EC}"}</div><p style={{fontSize:11,color:"#b0b0b8",textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>Your Fitness Age</p><div style={{fontSize:64,fontWeight:900,color:iy?"#38ef7d":"#E94560",lineHeight:1,marginBottom:8}}>{fa}</div><p style={{fontSize:15,color:"#aaa",marginBottom:18}}>{iy?`\u{1F389} ${diff} years younger!`:`Body feels ${Math.abs(diff)}y older`}</p><div style={{background:"#ffffff08",borderRadius:12,padding:14,marginBottom:18,textAlign:"left"}}>{[["Age",ftd.age],["Push-ups",ftd.pushups],["HR",ftd.heartRate+" BPM"],["BMI",(ftd.weight/((ftd.height/100)**2)).toFixed(1)]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{color:"#b0b0b8",fontSize:12}}>{l}</span><span style={{color:"#fff",fontSize:12,fontWeight:600}}>{v}</span></div>)}</div><button onClick={()=>{setU(x=>({...x,shares:x.shares+1}));setPop({type:"share",fa})}} style={{...BP,width:"100%",marginBottom:8,background:"linear-gradient(135deg,#667eea,#764ba2)"}}>Share {"\u{1F4E4}"}</button><button onClick={()=>setTab("home")} style={{...BS,width:"100%"}}>Back</button></div></div>}
  const step=ss[fts];
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",zIndex:1}}>
    <button onClick={()=>fts===1?setTab("home"):setFts(s=>s-1)} style={{...BB,alignSelf:"flex-start",marginBottom:28}}>← Back</button>
    <div style={{width:"100%",maxWidth:360}}>
      <div style={{display:"flex",gap:4,marginBottom:28}}>{[1,2,3,4,5,6].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=fts?"#FF6B35":"#1A1A2E"}}/>)}</div>
      <p style={{fontSize:13,color:"#FF6B35",fontWeight:600,marginBottom:6}}>Step {fts}/6</p>
      <h2 style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:20}}>{step.l}</h2>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:28}}><input type="text" inputMode="numeric" pattern="[0-9]*" value={ftd[step.k]||""} onChange={e=>setFtd(d=>({...d,[step.k]:Number(e.target.value)}))} placeholder={`e.g. ${step.p}`} style={{...IS,flex:1}} autoFocus/><span style={{color:"#b0b0b8",fontSize:13,minWidth:36}}>{step.un}</span></div>
      <button disabled={!ftd[step.k]} onClick={()=>setFts(s=>s+1)} style={{...BP,width:"100%",opacity:ftd[step.k]?1:.4}}>{fts===6?"See My Fitness Age \u{1F9EC}":"Next →"}</button>
    </div>
  </div>};

  // ── EXPLORE REELS — ANIMATED FOLLOW ALONG ──
  const Explore=()=>{
    const r=REELS[ri];const anims=["jj","burpee","squat","mc","pu","plank","yoga","hk","crunch","lunge"];
    const currentEx=r.exercises[reelExIdx%r.exercises.length];
    const isLiked=likedReels.includes(r.id);
    const isSaved=savedReels.find(s=>s.id===r.id);
    const inRoutine=myRoutine.find(rt=>rt.id===r.id);
    
    // Show My Routine view
    if(showRoutine){
      return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1,minHeight:"100vh"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button onClick={()=>setShowRoutine(false)} style={BB}>{"\u2190"}</button>
          <h1 style={{fontSize:22,fontWeight:800,color:"#fff"}}>My Routine {"\u{1F4CB}"}</h1>
        </div>
        {myRoutine.length===0?<div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:48,marginBottom:12}}>{"\u{1F4CB}"}</div>
          <p style={{fontSize:15,color:"#fff",fontWeight:600,marginBottom:8}}>No workouts saved yet</p>
          <p style={{fontSize:13,color:"#b0b0b8",marginBottom:20}}>Add workouts from Explore to build your routine</p>
          <button onClick={()=>setShowRoutine(false)} style={{...BP,padding:"12px 24px"}}>Browse Workouts</button>
        </div>:
        <div>
          <p style={{fontSize:13,color:"#b0b0b8",marginBottom:14}}>{myRoutine.length} workout{myRoutine.length>1?"s":""} in your routine</p>
          {myRoutine.map((rt,idx)=>{
            const linkedWorkout=WORKOUTS_DB.find(w=>w.id===rt.workoutId);
            return <div key={rt.id} style={{background:"#12121A",border:"1px solid #ffffff10",borderRadius:14,padding:14,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:2}}>{rt.title}</p>
                  <p style={{fontSize:11,color:"#b0b0b8"}}>{rt.duration} · @{rt.trainer}</p>
                </div>
                <button onClick={()=>removeFromRoutine(rt.id)} style={{background:"#E9456020",border:"1px solid #E9456040",borderRadius:8,padding:"4px 10px",color:"#E94560",fontSize:11,cursor:"pointer"}}>Remove</button>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                {rt.exercises.slice(0,4).map((ex,i)=><span key={i} style={{background:"#1A1A2E",borderRadius:6,padding:"3px 8px",fontSize:10,color:"#b0b0b8"}}>{ex}</span>)}
              </div>
              {linkedWorkout&&<button onClick={()=>{setWa(linkedWorkout);setEi(0);setTab("wo");setShowRoutine(false)}} style={{...BP,width:"100%",fontSize:13,padding:"10px"}}>{"\u{1F4AA}"} Start This Workout</button>}
            </div>
          })}
        </div>}
      </div>;
    }
    
    return <div style={{height:"100vh",position:"relative",overflow:"hidden"}}><div style={{height:"100%",background:r.gradient,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:24,paddingBottom:100,position:"relative"}}>
      {/* Header with Back button */}
      <div style={{position:"absolute",top:16,left:16,right:16,display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:5}}>
        <button onClick={()=>setTab("home")} style={{background:"#00000060",border:"1px solid #ffffff30",borderRadius:10,padding:"8px 12px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",gap:4}}>{"\u2190"} Back</button>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#ffffffcc",background:"#00000050",padding:"4px 8px",borderRadius:8}}>{ri+1}/{REELS.length}</span>
          <button onClick={()=>setShowRoutine(true)} style={{background:"#00000060",border:"1px solid #ffffff30",borderRadius:8,padding:"5px 10px",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",backdropFilter:"blur(10px)"}}>{"\u{1F4CB}"} Routine ({myRoutine.length})</button>
        </div>
      </div>
      <div style={{position:"absolute",top:60,right:16,background:"#00000060",borderRadius:8,padding:"4px 10px",zIndex:5,backdropFilter:"blur(10px)"}}>
        <span style={{color:"#fff",fontSize:12,fontWeight:600}}>{"\u23F1"} {r.duration}</span>
      </div>

      {/* Main Content Area */}
      <div style={{position:"absolute",top:"12%",left:0,right:0,display:"flex",flexDirection:"column",alignItems:"center",zIndex:3}}>
        {rp ? (
          <div style={{textAlign:"center",width:"90%",maxWidth:360}}>
            <div style={{background:"#00000030",borderRadius:20,padding:"16px 0",marginBottom:12,backdropFilter:"blur(8px)"}}>
              <ExAnim type={anims[(ri+reelExIdx)%anims.length]} size={180} showLabel={false} />
            </div>
            <div style={{background:"#00000040",borderRadius:12,padding:10,marginBottom:10,backdropFilter:"blur(8px)"}}>
              <p style={{fontSize:11,color:"#ffffffaa",textTransform:"uppercase",letterSpacing:1.5,marginBottom:4}}>Now Showing</p>
              <p style={{fontSize:18,fontWeight:800,color:"#fff"}}>{currentEx}</p>
            </div>
            <div style={{textAlign:"left",padding:"0 8px",maxHeight:120,overflowY:"auto"}}>
              {r.exercises.map((ex,i) => (
                <button key={i} onClick={()=>setReelExIdx(i)} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,width:"100%",background:i===reelExIdx%r.exercises.length?"#ffffff20":"transparent",borderRadius:8,padding:"6px 10px",border:"none",cursor:"pointer"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:i===reelExIdx%r.exercises.length?"#fff":"#ffffff30",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:11,fontWeight:700,color:i===reelExIdx%r.exercises.length?"#000":"#fff"}}>{i+1}</span>
                  </div>
                  <span style={{color:i===reelExIdx%r.exercises.length?"#fff":"#ffffffcc",fontSize:13,fontWeight:i===reelExIdx%r.exercises.length?700:500}}>{ex}</span>
                </button>
              ))}
            </div>
            <button onClick={()=>setRp(false)} style={{marginTop:10,background:"#ffffff15",border:"1px solid #ffffff30",borderRadius:10,padding:"8px 20px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Stop Demo</button>
          </div>
        ) : (
          <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>{setRp(true);setReelExIdx(0)}}>
            <div style={{background:"#00000025",borderRadius:20,padding:20,marginBottom:12,backdropFilter:"blur(4px)",width:260,margin:"0 auto"}}>
              <ExAnim type={anims[ri%anims.length]} size={170} showLabel={false} />
            </div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#ffffff25",borderRadius:50,padding:"10px 24px",backdropFilter:"blur(10px)",border:"1px solid #ffffff30"}}>
              <span style={{fontSize:18}}>{"\u25B6"}</span>
              <span style={{color:"#fff",fontSize:14,fontWeight:700}}>Follow Along</span>
            </div>
            <p style={{color:"#ffffffbb",fontSize:11,marginTop:6}}>Tap to see exercises</p>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div style={{position:"relative",zIndex:4}}>
        <h2 style={{fontSize:21,fontWeight:900,color:"#fff",marginBottom:3}}>{r.title}</h2>
        <p style={{fontSize:12,color:"#ffffffcc",marginBottom:8}}>@{r.trainer} · {r.views} views</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>
          {r.exercises.slice(0,3).map((ex,i) => <span key={i} style={{background:"#ffffff20",borderRadius:8,padding:"3px 8px",fontSize:10,color:"#fff"}}>{ex}</span>)}
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>addReelToRoutine(r)} disabled={!!inRoutine} style={{flex:1,background:inRoutine?"#38ef7d40":"#ffffff20",backdropFilter:"blur(10px)",border:`1px solid ${inRoutine?"#38ef7d80":"#ffffff30"}`,borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:12,fontWeight:700,cursor:inRoutine?"default":"pointer"}}>{inRoutine?"\u2713 In Routine":"+ Add to Routine"}</button>
          <button onClick={()=>{const w=WORKOUTS_DB.find(x=>x.id===r.workoutId)||WORKOUTS_DB[0];setWa(w);setEi(0);setTab("wo")}} style={{flex:1,background:"#ffffff40",backdropFilter:"blur(10px)",border:"1px solid #ffffff40",borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>{"\u{1F4AA}"} Start</button>
        </div>
      </div>

      {/* Side actions — all functional */}
      <div style={{position:"absolute",right:12,bottom:130,display:"flex",flexDirection:"column",gap:14,alignItems:"center",zIndex:5}}>
        <button onClick={()=>toggleLikeReel(r)} style={{background:"none",border:"none",cursor:"pointer",textAlign:"center"}}>
          <div style={{fontSize:26,filter:isLiked?"none":"grayscale(0.3)"}}>{isLiked?"\u2764\uFE0F":"\u{1F90D}"}</div>
          <span style={{fontSize:10,color:"#ffffffcc",fontWeight:600}}>{isLiked?(parseInt(r.likes)+1)+(r.likes.includes("M")?"M":"K"):r.likes}</span>
        </button>
        <button onClick={()=>setPop({type:"comments",r})} style={{background:"none",border:"none",cursor:"pointer",textAlign:"center"}}>
          <div style={{fontSize:26}}>{"\u{1F4AC}"}</div>
          <span style={{fontSize:10,color:"#ffffffcc",fontWeight:600}}>189</span>
        </button>
        <button onClick={()=>shareReel(r)} style={{background:"none",border:"none",cursor:"pointer",textAlign:"center"}}>
          <div style={{fontSize:26}}>{"\u{1F4E4}"}</div>
          <span style={{fontSize:10,color:"#ffffffcc",fontWeight:600}}>Share</span>
        </button>
        <button onClick={()=>toggleSaveReel(r)} style={{background:"none",border:"none",cursor:"pointer",textAlign:"center"}}>
          <div style={{fontSize:26}}>{isSaved?"\u{1F516}":"\u{1F4D1}"}</div>
          <span style={{fontSize:10,color:isSaved?"#FFD700":"#ffffffcc",fontWeight:600}}>{isSaved?"Saved":"Save"}</span>
        </button>
      </div>
    </div>
    {/* Swipe navigation */}
    <div style={{position:"absolute",bottom:75,left:0,right:0,display:"flex",justifyContent:"center",gap:10,zIndex:6}}>
      <button disabled={ri===0} onClick={()=>{setRi(i=>i-1);setRp(false);setReelExIdx(0)}} style={{...SB,opacity:ri===0?.3:1}}>{"\u2191"}</button>
      <button disabled={ri===REELS.length-1} onClick={()=>{setRi(i=>i+1);setRp(false);setReelExIdx(0)}} style={{...SB,opacity:ri===REELS.length-1?.3:1}}>{"\u2193"}</button>
    </div></div>;
  };

  // ── FOOD TRACKER — Manual Entry + AI Lookup + Database ──
  const Food=()=>{const cats=["all","breakfast","lunch","snack","drink","sweet","fruit"];const ff=FOOD_DB.filter(f=>(fc==="all"||f.category===fc)&&(!fs||f.name.toLowerCase().includes(fs.toLowerCase())||f.region.toLowerCase().includes(fs.toLowerCase())));const tl=u.foodLog||[];const tots=tl.reduce((a,f)=>({cal:a.cal+f.cal,protein:a.protein+(f.protein||0),carbs:a.carbs+(f.carbs||0),fat:a.fat+(f.fat||0)}),{cal:0,protein:0,carbs:0,fat:0});
  return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><button onClick={()=>setTab("home")} style={BB}>{"\u2190"}</button><h1 style={{fontSize:22,fontWeight:800,color:"#fff"}}>Food Tracker {"\u{1F37D}\uFE0F"}</h1></div>
    {/* Daily Summary */}
    <div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:18,padding:20,marginBottom:18,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.1}}>{"\u{1F37D}\uFE0F"}</div><p style={{fontSize:11,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Today's Intake</p><div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:10}}><span style={{fontSize:42,fontWeight:900,color:"#fff"}}>{tots.cal}</span><span style={{fontSize:15,color:"#ffffffcc"}}>/ 2000 kcal</span></div><div style={{background:"#ffffff30",borderRadius:6,height:8,marginBottom:12,overflow:"hidden"}}><div style={{width:`${Math.min((tots.cal/2e3)*100,100)}%`,height:"100%",background:"#fff",borderRadius:6,transition:"width .3s"}}/></div><div style={{display:"flex",gap:16}}><div><span style={{fontSize:11,color:"#ffffffaa"}}>Protein</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{tots.protein}g</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Carbs</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{tots.carbs}g</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Fat</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{tots.fat}g</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Items</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{tl.length}</p></div></div></div>

    {/* AI Food Scanner — Pro Feature */}
    <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:16,padding:2,marginBottom:14}}>
      <div style={{background:"#0e0e18",borderRadius:14,padding:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div><p style={{fontSize:14,fontWeight:700,color:"#fff"}}>{"\u{1F4F7}"} AI Food Scanner</p><p style={{fontSize:11,color:"#b0b0b8"}}>Take a photo — AI calculates calories</p></div>
          {!isPro&&<span style={{fontSize:10,color:"#667eea",fontWeight:600,background:"#667eea20",padding:"3px 8px",borderRadius:6}}>PRO</span>}
        </div>
        <label style={{display:"block",background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:10,padding:"12px 16px",textAlign:"center",cursor:isPro?"pointer":"default",opacity:isPro?1:.6}}>
          <span style={{color:"#fff",fontSize:13,fontWeight:700}}>{scanLoading?"Analyzing...":"\u{1F4F8} Scan Your Food"}</span>
          {isPro&&<input type="file" accept="image/*" capture="environment" onChange={e=>{if(e.target.files[0])scanFood(e.target.files[0])}} style={{display:"none"}}/>}
          {!isPro&&<span onClick={e=>{e.preventDefault();requirePro("AI Food Scanner")}} style={{display:"block",fontSize:10,color:"#ffffffcc",marginTop:4}}>Tap to unlock</span>}
        </label>
        {scanResult&&!scanResult.error&&<div style={{marginTop:12,background:"#1A1A2E",borderRadius:12,padding:14,border:"1px solid #667eea30"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div>
              <p style={{fontSize:15,fontWeight:700,color:"#fff"}}>{scanResult.name}</p>
              <p style={{fontSize:11,color:"#b0b0b8"}}>{scanResult.portion} · P:{scanResult.protein}g C:{scanResult.carbs}g F:{scanResult.fat}g</p>
            </div>
            <span style={{fontSize:18,fontWeight:800,color:"#667eea"}}>{scanResult.cal} kcal</span>
          </div>
          <button onClick={()=>{addFood({name:scanResult.name,cal:scanResult.cal,protein:scanResult.protein,carbs:scanResult.carbs,fat:scanResult.fat,region:"AI Scan"});setScanResult(null)}} style={{...BP,width:"100%",fontSize:13,padding:"10px"}}>{"\u2705"} Add to Food Log</button>
        </div>}
        {scanResult&&scanResult.error&&<p style={{fontSize:12,color:"#E94560",marginTop:8}}>{scanResult.error}</p>}
      </div>
    </div>

    {/* Manual Food Entry */}
    <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #ffffff08"}}>
      <p style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:10}}>{"\u270D\uFE0F"} Add Food Manually</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
        <input value={manualFood.name} onChange={e=>setManualFood(f=>({...f,name:e.target.value}))} placeholder="Food name" type="text" style={{...IS,fontSize:13,padding:"8px 10px"}} />
        <input value={manualFood.cuisine} onChange={e=>setManualFood(f=>({...f,cuisine:e.target.value}))} placeholder="Cuisine (optional)" type="text" style={{...IS,fontSize:13,padding:"8px 10px"}} />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
        <input value={manualFood.grams} onChange={e=>setManualFood(f=>({...f,grams:e.target.value}))} placeholder="Grams" type="text" inputMode="numeric" pattern="[0-9]*" style={{...IS,fontSize:13,padding:"8px 10px"}} />
        <input value={manualFood.cal} onChange={e=>setManualFood(f=>({...f,cal:e.target.value}))} placeholder="Calories (kcal)" type="text" inputMode="numeric" pattern="[0-9]*" style={{...IS,fontSize:13,padding:"8px 10px"}} />
      </div>
      <button onClick={()=>{if(manualFood.name&&manualFood.cal>0){addFood({name:`${manualFood.name}${manualFood.grams?` (${manualFood.grams}g)`:""}`,cal:Number(manualFood.cal),protein:0,carbs:0,fat:0,category:"snack",region:manualFood.cuisine||"Custom"});setManualFood({name:"",cuisine:"",grams:"",cal:""})}}} disabled={!manualFood.name||!manualFood.cal} style={{...BP,width:"100%",fontSize:13,padding:"10px",opacity:manualFood.name&&manualFood.cal?1:.4}}>Add to Log {"\u2795"}</button>
    </div>

    {/* Search Database */}
    <div style={{position:"relative",marginBottom:12}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>{"\u{1F50D}"}</span><input value={fs} onChange={e=>setFs(e.target.value)} placeholder="Search 200+ foods, region..." style={{...IS,paddingLeft:40}}/></div>
    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:14}}>{cats.map(c=><button key={c} onClick={()=>setFc(c)} style={{background:fc===c?"#FF6B35":"#1A1A2E",border:"none",borderRadius:10,padding:"6px 14px",color:fc===c?"#fff":"#b0b0b8",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{c==="all"?"All":c[0].toUpperCase()+c.slice(1)}</button>)}</div>
    <div style={{maxHeight:300,overflowY:"auto"}}>{ff.slice(0,30).map((f,i)=><div key={i} style={{background:"#12121A",border:"1px solid #ffffff08",borderRadius:12,padding:12,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{flex:1,minWidth:0}}><p style={{fontSize:14,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</p><p style={{fontSize:11,color:"#b0b0b8",marginTop:2}}>{f.region} · P:{f.protein}g C:{f.carbs}g F:{f.fat}g</p></div><div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}><span style={{fontSize:14,fontWeight:700,color:"#FF6B35"}}>{f.cal}</span><button onClick={()=>addFood(f)} style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",border:"none",borderRadius:8,width:32,height:32,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div></div>)}{ff.length===0&&<p style={{textAlign:"center",color:"#9a9aa2",padding:32,fontSize:14}}>No foods found</p>}</div>
    {tl.length>0&&<div style={{marginTop:20}}><h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:10}}>Today's Log ({tl.length})</h3>{tl.slice(0,10).map((f,i)=><div key={f.id||i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #ffffff08"}}><span style={{fontSize:13,color:"#ccc"}}>{f.name}</span><span style={{fontSize:13,color:"#FF6B35",fontWeight:600}}>{f.cal} kcal</span></div>)}</div>}
  </div>};

  // ── ACTIVITY TRACKER — Sensors Enabled ──
  const Activity=()=>{const sl=u.sleepLog||[];const totalSteps=(u.steps||0)+liveSteps;
  return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><button onClick={()=>{if(pedoActive)stopPedometer();if(runActive)stopRun();setTab("home")}} style={BB}>{"\u2190"}</button><h1 style={{fontSize:22,fontWeight:800,color:"#fff"}}>Activity Tracker</h1></div>
    <div style={{display:"flex",gap:6,marginBottom:20}}>{[["walk","\u{1F6B6} Walk"],["run","\u{1F3C3} Run"],["sleep","\u{1F634} Sleep"]].map(([id,label])=><button key={id} onClick={()=>setAt(id)} style={{flex:1,background:at===id?(id==="walk"?"#38ef7d":id==="run"?"#FF6B35":"#667eea"):"#1A1A2E",border:"none",borderRadius:12,padding:"10px 4px",color:at===id?(id==="sleep"?"#fff":"#0A0A0F"):"#b0b0b8",fontSize:13,fontWeight:700,cursor:"pointer"}}>{label}</button>)}</div>

    {/* WALK — Accelerometer Pedometer */}
    {at==="walk"&&<div>
      <div style={{background:"linear-gradient(135deg,#11998e,#38ef7d)",borderRadius:20,padding:24,marginBottom:16,textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.15}}>{"\u{1F6B6}"}</div><p style={{fontSize:11,color:"#000000aa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Today's Steps</p><div style={{fontSize:52,fontWeight:900,color:"#0A0A0F"}}>{totalSteps.toLocaleString()}</div><p style={{fontSize:14,color:"#0A0A0F99",marginBottom:12}}>Goal: 10,000</p><div style={{background:"#00000020",borderRadius:8,height:10,overflow:"hidden",maxWidth:260,margin:"0 auto"}}><div style={{width:`${Math.min((totalSteps/1e4)*100,100)}%`,height:"100%",background:"#0A0A0F",borderRadius:8}}/></div><p style={{fontSize:12,color:"#0A0A0F88",marginTop:8}}>{"\u2248"} {(totalSteps*.000762).toFixed(1)} km · {"\u2248"} {Math.round(totalSteps*.04)} kcal</p>
      {pedoActive&&<div style={{marginTop:12,background:"#00000020",borderRadius:10,padding:8}}><p style={{fontSize:12,color:"#0A0A0F",fontWeight:700}}>{"\u{1F7E2}"} Counting live... {liveSteps} new steps</p><p style={{fontSize:10,color:"#0A0A0Faa",marginTop:2}}>{"\u{1F4F1}"} Keep app open. Screen will stay on automatically.</p></div>}
      </div>
      {/* Auto step counter */}
      <div style={{marginBottom:16}}>
        {!pedoActive?<button onClick={startPedometer} style={{...BP,width:"100%",background:"linear-gradient(135deg,#11998e,#38ef7d)",color:"#0A0A0F",fontSize:14,padding:"14px"}}>{"\u{1F6B6}"} Start Step Counter (Auto)</button>
        :<button onClick={stopPedometer} style={{...BP,width:"100%",background:"#E94560",fontSize:14,padding:"14px"}}>{"\u23F9"} Stop & Save {liveSteps} Steps</button>}
        <p style={{fontSize:11,color:"#9a9aa2",marginTop:6,textAlign:"center"}}>Uses your phone's motion sensor to count steps automatically</p>
      </div>
      {/* Manual add */}
      <p style={{fontSize:13,color:"#aaa",marginBottom:8}}>Or add manually:</p>
      <div style={{display:"flex",gap:8,marginBottom:14}}><input type="text" inputMode="numeric" pattern="[0-9]*" value={si} onChange={e=>setSi(e.target.value)} placeholder="Steps" style={{...IS,flex:1}}/><button onClick={()=>{if(si>0){logAct("walk",si);setSi("")}}} disabled={!si||si<=0} style={{...BP,opacity:si>0?1:.4,padding:"12px 20px"}}>+ Add</button></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{[1e3,2e3,5e3,8e3,1e4].map(v=><button key={v} onClick={()=>logAct("walk",v)} style={{background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:10,padding:"8px 14px",color:"#38ef7d",fontSize:12,fontWeight:600,cursor:"pointer"}}>{v.toLocaleString()}</button>)}</div>
    </div>}

    {/* RUN — GPS Tracker */}
    {at==="run"&&<div>
      <div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:20,padding:24,marginBottom:16,textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.15}}>{"\u{1F3C3}"}</div>
      {runActive?<><p style={{fontSize:11,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{"\u{1F7E2}"} Run in Progress</p><div style={{fontSize:52,fontWeight:900,color:"#fff"}}>{runDist.toFixed(2)}</div><p style={{fontSize:16,color:"#ffffffcc"}}>km</p><div style={{display:"flex",justifyContent:"center",gap:20,marginTop:10}}><div><span style={{fontSize:11,color:"#ffffffaa"}}>Time</span><p style={{fontSize:18,fontWeight:700,color:"#fff"}}>{fmtTime(runTime)}</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Pace</span><p style={{fontSize:18,fontWeight:700,color:"#fff"}}>{runDist>=0.1?(runTime/60/runDist).toFixed(1)+" min/km":"--"}</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Calories</span><p style={{fontSize:18,fontWeight:700,color:"#fff"}}>{Math.round(runDist*62)}</p></div></div><p style={{fontSize:11,color:"#ffffffaa",marginTop:10}}>{"\u{1F4F1}"} Keep app open & screen on</p></>
      :<><p style={{fontSize:11,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Total Distance</p><div style={{fontSize:52,fontWeight:900,color:"#fff"}}>{(u.runKm||0).toFixed(1)}</div><p style={{fontSize:16,color:"#ffffffcc"}}>km</p><p style={{fontSize:12,color:"#ffffffaa",marginTop:8}}>{"\u2248"} {Math.round((u.runKm||0)*62)} kcal burned</p></>}
      </div>
      {/* GPS run tracker */}
      <div style={{marginBottom:16}}>
        {!runActive?<button onClick={startRun} style={{...BP,width:"100%",background:"linear-gradient(135deg,#FF6B35,#E94560)",fontSize:14,padding:"14px"}}>{"\u{1F3C3}"} Start Run (GPS Tracking)</button>
        :<button onClick={stopRun} style={{...BP,width:"100%",background:"#E94560",fontSize:14,padding:"14px"}}>{"\u23F9"} Stop & Save Run ({runDist.toFixed(2)} km)</button>}
        <p style={{fontSize:11,color:"#9a9aa2",marginTop:6,textAlign:"center"}}>Uses GPS to track your running distance in real-time</p>
      </div>
      <p style={{fontSize:13,color:"#aaa",marginBottom:8}}>Or add manually:</p>
      <div style={{display:"flex",gap:8,marginBottom:14}}><input type="text" inputMode="decimal" pattern="[0-9.]*" value={rni} onChange={e=>setRni(e.target.value)} placeholder="km" style={{...IS,flex:1}}/><button onClick={()=>{if(rni>0){logAct("run",rni);setRni("")}}} disabled={!rni||rni<=0} style={{...BP,opacity:rni>0?1:.4,padding:"12px 20px"}}>+ Add</button></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{[1,2,3,5,10].map(v=><button key={v} onClick={()=>logAct("run",v)} style={{background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:10,padding:"8px 14px",color:"#FF6B35",fontSize:12,fontWeight:600,cursor:"pointer"}}>{v} km</button>)}</div>
    </div>}

    {/* SLEEP — Manual with history */}
    {at==="sleep"&&<div>
      <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:20,padding:24,marginBottom:20,textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.15}}>{"\u{1F634}"}</div><p style={{fontSize:11,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Last Night</p><div style={{fontSize:52,fontWeight:900,color:"#fff"}}>{u.sleepHours||0}</div><p style={{fontSize:16,color:"#ffffffcc"}}>hours</p><p style={{fontSize:12,color:"#ffffffaa",marginTop:8}}>{(u.sleepHours||0)>=8?"\u2705 Goal met!":((8-(u.sleepHours||0)).toFixed(1)+"h short")}</p></div>
      <div style={{display:"flex",gap:8,marginBottom:14}}><input type="text" inputMode="decimal" pattern="[0-9.]*" value={sli} onChange={e=>setSli(e.target.value)} placeholder="Hours slept" style={{...IS,flex:1}}/><button onClick={()=>{if(sli>0){logAct("sleep",sli);setSli("")}}} disabled={!sli||sli<=0} style={{...BP,opacity:sli>0?1:.4,padding:"12px 20px",background:"linear-gradient(135deg,#667eea,#764ba2)"}}>Log</button></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>{[4,5,6,7,8,9].map(v=><button key={v} onClick={()=>logAct("sleep",v)} style={{background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:10,padding:"8px 14px",color:"#667eea",fontSize:12,fontWeight:600,cursor:"pointer"}}>{v}h</button>)}</div>
      {sl.length>0&&<div><h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:10}}>Sleep History</h3><div style={{display:"flex",gap:6,alignItems:"flex-end",height:120,padding:"0 4px"}}>{sl.slice(0,7).reverse().map((s,i)=>{const pc=(s.value/12)*100;return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><span style={{fontSize:10,color:"#aaa"}}>{s.value}h</span><div style={{width:"100%",height:`${pc}%`,minHeight:8,background:s.value>=8?"linear-gradient(to top,#667eea,#764ba2)":"linear-gradient(to top,#E94560,#E9456080)",borderRadius:6}}/><span style={{fontSize:9,color:"#9a9aa2"}}>{new Date(s.date).toLocaleDateString([],{weekday:"short"})}</span></div>})}</div></div>}
    </div>}
    {(u.activityLog||[]).length>0&&<div style={{marginTop:24}}><h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:10}}>Recent</h3>{(u.activityLog||[]).slice(0,8).map((a,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #ffffff08"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:16}}>{a.type==="walk"?"\u{1F6B6}":a.type==="run"?"\u{1F3C3}":"\u{1F634}"}</span><span style={{fontSize:13,color:"#ccc"}}>{a.type==="walk"?Number(a.value).toLocaleString()+" steps":a.type==="run"?a.value+" km":a.value+"h sleep"}</span></div><span style={{fontSize:11,color:"#9a9aa2"}}>{new Date(a.date).toLocaleDateString()}</span></div>)}</div>}
  </div>};

  // ── PRO TAB — AI FEATURES HUB ──
  const Pro=()=>{
    return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
        <button onClick={()=>{setTab("home");setProView("home")}} style={BB}>{"\u2190"}</button>
        <h1 style={{fontSize:22,fontWeight:800,color:"#fff"}}>FitStreak Pro {isPro?"\u{1F451}":"\u{1F512}"}</h1>
      </div>
      
      {!isPro && <div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:18,padding:20,marginBottom:18,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.15}}>{"\u{1F451}"}</div>
        <p style={{fontSize:11,color:"#ffffffcc",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Unlock AI Power</p>
        <h2 style={{fontSize:24,fontWeight:900,color:"#fff",marginBottom:8}}>FitStreak Pro</h2>
        <p style={{fontSize:13,color:"#ffffffdd",marginBottom:14}}>AI Coach • Smart Reports • Workout Analysis • Body Tracking</p>
        <button onClick={()=>{setPaywallFeature("Pro Plan");setShowPaywall(true)}} style={{background:"#fff",border:"none",borderRadius:12,padding:"12px 24px",color:"#FF6B35",fontSize:14,fontWeight:800,cursor:"pointer"}}>Upgrade to Pro {"\u2192"}</button>
      </div>}
      
      {isPro && <div style={{background:"linear-gradient(135deg,#38ef7d,#11998e)",borderRadius:18,padding:18,marginBottom:18,textAlign:"center"}}>
        <p style={{fontSize:12,color:"#0A0A0Faa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5}}>{"\u{1F451}"} Pro Member</p>
        <p style={{fontSize:18,fontWeight:800,color:"#0A0A0F",marginTop:4}}>All features unlocked</p>
      </div>}

      {proView==="home" && <div>
        {/* Feature Grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
          <button onClick={()=>{if(requirePro("AI Coach"))setProView("chat")}} style={{background:"#12121A",border:"1px solid #667eea30",borderRadius:14,padding:14,textAlign:"left",cursor:"pointer"}}>
            <div style={{fontSize:28,marginBottom:8}}>{"\u{1F4AC}"}</div>
            <p style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>AI Coach</p>
            <p style={{fontSize:11,color:"#b0b0b8"}}>Ask anything about fitness</p>
          </button>
          <button onClick={()=>{if(requirePro("Daily Report"))setProView("daily")}} style={{background:"#12121A",border:"1px solid #FF6B3530",borderRadius:14,padding:14,textAlign:"left",cursor:"pointer"}}>
            <div style={{fontSize:28,marginBottom:8}}>{"\u{1F4CA}"}</div>
            <p style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>Daily Report</p>
            <p style={{fontSize:11,color:"#b0b0b8"}}>AI analysis of your day</p>
          </button>
          <button onClick={()=>{if(requirePro("Weekly Report"))setProView("weekly")}} style={{background:"#12121A",border:"1px solid #38ef7d30",borderRadius:14,padding:14,textAlign:"left",cursor:"pointer"}}>
            <div style={{fontSize:28,marginBottom:8}}>{"\u{1F4C8}"}</div>
            <p style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>Weekly Report</p>
            <p style={{fontSize:11,color:"#b0b0b8"}}>Track weekly progress</p>
          </button>
          <button onClick={()=>{if(requirePro("Body Tracking"))setProView("body")}} style={{background:"#12121A",border:"1px solid #f093fb30",borderRadius:14,padding:14,textAlign:"left",cursor:"pointer"}}>
            <div style={{fontSize:28,marginBottom:8}}>{"\u{1F4AA}"}</div>
            <p style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>Body Stats</p>
            <p style={{fontSize:11,color:"#b0b0b8"}}>Heart rate & measurements</p>
          </button>
          <button onClick={()=>{if(requirePro("Goal Tracker"))setProView("goal")}} style={{background:"#12121A",border:"1px solid #FFD70030",borderRadius:14,padding:14,textAlign:"left",cursor:"pointer"}}>
            <div style={{fontSize:28,marginBottom:8}}>{"\u{1F3AF}"}</div>
            <p style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>Goal Tracker</p>
            <p style={{fontSize:11,color:"#b0b0b8"}}>Set & achieve targets</p>
          </button>
          <button onClick={()=>{if(isPro)alert("You have 3 freeze tokens!");else{setPaywallFeature("Streak Freeze");setShowPaywall(true)}}} style={{background:"#12121A",border:"1px solid #11998e30",borderRadius:14,padding:14,textAlign:"left",cursor:"pointer"}}>
            <div style={{fontSize:28,marginBottom:8}}>{"\u{1F9CA}"}</div>
            <p style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>Streak Freeze</p>
            <p style={{fontSize:11,color:"#b0b0b8"}}>3 tokens/month</p>
          </button>
        </div>
      </div>}

      {/* AI Coach Chat */}
      {proView==="chat" && <div>
        <button onClick={()=>setProView("home")} style={{...BB,marginBottom:14}}>{"\u2190"} Back</button>
        <div style={{background:"#12121A",borderRadius:14,padding:14,minHeight:400,maxHeight:480,overflowY:"auto",marginBottom:14,border:"1px solid #ffffff08"}}>
          {chatMessages.length===0 && <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:48,marginBottom:12}}>{"\u{1F4AC}"}</div>
            <p style={{fontSize:15,color:"#fff",fontWeight:600,marginBottom:8}}>Hi {u.name||"there"}! I'm your AI Coach.</p>
            <p style={{fontSize:13,color:"#b0b0b8",lineHeight:1.5}}>Ask me anything about workouts, diet, recovery, or fitness goals.</p>
            <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:6}}>
              {["How do I build muscle fast?","Best diet for fat loss?","Why am I not losing weight?","Suggest a workout for today"].map((q,i)=>
                <button key={i} onClick={()=>sendChatMessage(q)} style={{background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:10,padding:"8px 12px",color:"#b0b0b8",fontSize:12,cursor:"pointer",textAlign:"left"}}>{"\u{1F4A1}"} {q}</button>
              )}
            </div>
          </div>}
          {chatMessages.map((m,i)=><div key={i} style={{marginBottom:12,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",background:m.role==="user"?"linear-gradient(135deg,#FF6B35,#E94560)":"#1A1A2E",color:"#fff",borderRadius:14,padding:"10px 14px",fontSize:13,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{m.content}</div>
          </div>)}
          {chatLoading && <div style={{display:"flex",justifyContent:"flex-start"}}>
            <div style={{background:"#1A1A2E",borderRadius:14,padding:"10px 14px",fontSize:13,color:"#b0b0b8"}}>{"\u{1F914}"} Thinking...</div>
          </div>}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendChatMessage(chatInput)}} placeholder="Ask your AI coach..." type="text" style={{...IS,flex:1,fontSize:14}} />
          <button onClick={()=>sendChatMessage(chatInput)} disabled={!chatInput.trim()||chatLoading} style={{...BP,padding:"12px 18px",opacity:chatInput.trim()&&!chatLoading?1:.5}}>{"\u2192"}</button>
        </div>
        {chatMessages.length>0 && <button onClick={()=>{setChatMessages([]);try{localStorage.removeItem("fs-chat")}catch{}}} style={{marginTop:10,background:"none",border:"none",color:"#9a9aa2",fontSize:11,cursor:"pointer"}}>Clear chat history</button>}
      </div>}

      {/* Daily Report */}
      {proView==="daily" && <div>
        <button onClick={()=>setProView("home")} style={{...BB,marginBottom:14}}>{"\u2190"} Back</button>
        <h2 style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>{"\u{1F4CA}"} Daily Smart Report</h2>
        <p style={{fontSize:12,color:"#b0b0b8",marginBottom:14}}>AI analyzes your day and gives you actionable insights for tomorrow</p>
        {!dailyReport && <button onClick={()=>generateReport("daily")} disabled={reportLoading} style={{...BP,width:"100%",padding:"14px"}}>{reportLoading?"Generating report...":"Generate Today's Report \u{1F9E0}"}</button>}
        {dailyReport && dailyReport.error && <div style={{background:"#E9456015",border:"1px solid #E9456030",borderRadius:12,padding:14}}><p style={{color:"#E94560",fontSize:13}}>{dailyReport.error}</p><button onClick={()=>generateReport("daily")} style={{...BP,marginTop:10,width:"100%"}}>Try Again</button></div>}
        {dailyReport && !dailyReport.error && <div>
          <div style={{background:"linear-gradient(135deg,#1A1A2E,#0F3460)",borderRadius:16,padding:18,marginBottom:14,border:"1px solid #ffffff10"}}>
            <p style={{fontSize:11,color:"#FF6B35",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>Your Day</p>
            <p style={{fontSize:14,color:"#fff",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{dailyReport.summary}</p>
          </div>
          <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #38ef7d20"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#38ef7d",marginBottom:8}}>{"\u2705"} What's Working</p>
            <p style={{fontSize:13,color:"#fff",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{dailyReport.wins}</p>
          </div>
          <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #FF6B3520"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#FF6B35",marginBottom:8}}>{"\u26A1"} Areas to Improve</p>
            <p style={{fontSize:13,color:"#fff",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{dailyReport.improvements}</p>
          </div>
          <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #667eea20"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#667eea",marginBottom:8}}>{"\u{1F3AF}"} Tomorrow's Plan</p>
            <p style={{fontSize:13,color:"#fff",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{dailyReport.tomorrow}</p>
          </div>
          <button onClick={()=>setDailyReport(null)} style={{...BS,width:"100%",marginTop:10}}>Generate New Report</button>
        </div>}
      </div>}

      {/* Weekly Report */}
      {proView==="weekly" && <div>
        <button onClick={()=>setProView("home")} style={{...BB,marginBottom:14}}>{"\u2190"} Back</button>
        <h2 style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>{"\u{1F4C8}"} Weekly Progress Report</h2>
        <p style={{fontSize:12,color:"#b0b0b8",marginBottom:14}}>Comprehensive AI analysis of your week's progress and trends</p>
        {!weeklyReport && <button onClick={()=>generateReport("weekly")} disabled={reportLoading} style={{...BP,width:"100%",padding:"14px"}}>{reportLoading?"Analyzing your week...":"Generate Weekly Report \u{1F4CA}"}</button>}
        {weeklyReport && weeklyReport.error && <div style={{background:"#E9456015",border:"1px solid #E9456030",borderRadius:12,padding:14}}><p style={{color:"#E94560",fontSize:13}}>{weeklyReport.error}</p><button onClick={()=>generateReport("weekly")} style={{...BP,marginTop:10,width:"100%"}}>Try Again</button></div>}
        {weeklyReport && !weeklyReport.error && <div>
          <div style={{background:"linear-gradient(135deg,#1A1A2E,#0F3460)",borderRadius:16,padding:18,marginBottom:14,border:"1px solid #ffffff10"}}>
            <p style={{fontSize:11,color:"#38ef7d",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>Week Overview</p>
            <p style={{fontSize:14,color:"#fff",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{weeklyReport.summary}</p>
          </div>
          <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #38ef7d20"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#38ef7d",marginBottom:8}}>{"\u{1F3C6}"} Key Achievements</p>
            <p style={{fontSize:13,color:"#fff",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{weeklyReport.wins}</p>
          </div>
          <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #667eea20"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#667eea",marginBottom:8}}>{"\u{1F4CA}"} Trends & Patterns</p>
            <p style={{fontSize:13,color:"#fff",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{weeklyReport.trends}</p>
          </div>
          <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #FF6B3520"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#FF6B35",marginBottom:8}}>{"\u{1F3AF}"} Next Week's Focus</p>
            <p style={{fontSize:13,color:"#fff",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{weeklyReport.nextWeek}</p>
          </div>
          <button onClick={()=>setWeeklyReport(null)} style={{...BS,width:"100%",marginTop:10}}>Generate New Report</button>
        </div>}
      </div>}

      {/* Body Stats */}
      {proView==="body" && <div>
        <button onClick={()=>setProView("home")} style={{...BB,marginBottom:14}}>{"\u2190"} Back</button>
        <h2 style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:14}}>{"\u{1F4AA}"} Body Stats</h2>
        
        <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #ffffff08"}}>
          <p style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:10}}>{"\u2764\uFE0F"} Heart Rate</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <p style={{fontSize:11,color:"#b0b0b8",marginBottom:4}}>Resting (BPM)</p>
              <input value={heartRate.resting} onChange={e=>setHeartRate(h=>({...h,resting:e.target.value}))} placeholder="60" type="text" inputMode="numeric" style={{...IS,fontSize:14,padding:"10px"}} />
            </div>
            <div>
              <p style={{fontSize:11,color:"#b0b0b8",marginBottom:4}}>Max during workout</p>
              <input value={heartRate.max} onChange={e=>setHeartRate(h=>({...h,max:e.target.value}))} placeholder="160" type="text" inputMode="numeric" style={{...IS,fontSize:14,padding:"10px"}} />
            </div>
          </div>
        </div>

        <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #ffffff08"}}>
          <p style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:10}}>{"\u{1F4CF}"} Body Measurements (cm)</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["chest","Chest"],["waist","Waist"],["hips","Hips"],["arms","Arms"],["thighs","Thighs"],["weight","Weight (kg)"]].map(([k,l])=>
              <div key={k}>
                <p style={{fontSize:11,color:"#b0b0b8",marginBottom:4}}>{l}</p>
                <input value={bodyMeasurements[k]||""} onChange={e=>saveMeasurements({...bodyMeasurements,[k]:e.target.value})} type="text" inputMode="decimal" style={{...IS,fontSize:14,padding:"10px"}} />
              </div>
            )}
          </div>
        </div>
        <p style={{fontSize:11,color:"#9a9aa2",textAlign:"center"}}>Update weekly to track muscle growth & progress</p>
      </div>}

      {/* Goal Tracker */}
      {proView==="goal" && <div>
        <button onClick={()=>setProView("home")} style={{...BB,marginBottom:14}}>{"\u2190"} Back</button>
        <h2 style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:14}}>{"\u{1F3AF}"} Goal Tracker</h2>
        
        {!goalTarget && <div style={{background:"#12121A",borderRadius:14,padding:14,border:"1px solid #ffffff08"}}>
          <p style={{fontSize:13,color:"#b0b0b8",marginBottom:14}}>What's your fitness goal?</p>
          {["Lose 5kg in 60 days","Gain 3kg muscle in 90 days","Run a 5K in 30 days","Do 50 push-ups in 30 days","Build daily workout habit"].map(g=>
            <button key={g} onClick={()=>saveGoal({title:g,startDate:new Date().toISOString(),progress:0})} style={{display:"block",width:"100%",background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:10,padding:"12px 14px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:8,textAlign:"left"}}>{"\u{1F3AF}"} {g}</button>
          )}
        </div>}
        
        {goalTarget && <div>
          <div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:16,padding:18,marginBottom:14}}>
            <p style={{fontSize:11,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Current Goal</p>
            <p style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:10}}>{goalTarget.title}</p>
            <div style={{background:"#ffffff20",borderRadius:8,height:8,overflow:"hidden"}}>
              <div style={{width:`${goalTarget.progress||0}%`,height:"100%",background:"#fff",borderRadius:8}}/>
            </div>
            <p style={{fontSize:12,color:"#ffffffcc",marginTop:6}}>{goalTarget.progress||0}% complete · Started {new Date(goalTarget.startDate).toLocaleDateString()}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button onClick={()=>saveGoal({...goalTarget,progress:Math.min((goalTarget.progress||0)+10,100)})} style={{...BP,padding:"12px"}}>+10% Done</button>
            <button onClick={()=>{saveGoal(null);setProView("goal")}} style={{...BS,padding:"12px"}}>Change Goal</button>
          </div>
        </div>}
      </div>}
    </div>;
  };

  // ── PAYWALL MODAL ──
  const Paywall=()=>{
    if(!showPaywall)return null;
    return <div style={{position:"fixed",inset:0,background:"#000000dd",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:"#0e0e18",borderRadius:20,padding:24,maxWidth:380,width:"100%",border:"1px solid #FF6B3530",position:"relative"}}>
        <button onClick={()=>setShowPaywall(false)} style={{position:"absolute",top:12,right:12,background:"#1A1A2E",border:"none",borderRadius:8,width:32,height:32,color:"#fff",fontSize:18,cursor:"pointer"}}>{"\u2715"}</button>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:48,marginBottom:8}}>{"\u{1F451}"}</div>
          <h2 style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:4}}>Unlock {paywallFeature}</h2>
          <p style={{fontSize:13,color:"#b0b0b8"}}>Upgrade to FitStreak Pro</p>
        </div>
        
        <div style={{background:"#12121A",borderRadius:12,padding:14,marginBottom:14}}>
          <p style={{fontSize:12,color:"#b0b0b8",marginBottom:10,fontWeight:600}}>EVERYTHING IN PRO:</p>
          {["\u{1F4AC} AI Coach Chat (unlimited)","\u{1F4CA} Daily Smart Reports","\u{1F4C8} Weekly Progress Reports","\u{1F4AA} Body Measurement Tracking","\u{1F3AF} Custom Goal Tracker","\u2764\uFE0F Heart Rate Logging","\u{1F9CA} 3 Streak Freeze tokens/month","\u{1F6AB} Ad-free experience","\u{1F451} Exclusive Pro badge"].map((f,i)=>
            <p key={i} style={{fontSize:12,color:"#fff",marginBottom:6,display:"flex",alignItems:"center",gap:6}}><span style={{color:"#38ef7d"}}>{"\u2713"}</span> {f}</p>
          )}
        </div>

        {/* Pricing options */}
        <button onClick={()=>handlePayment("yearly")} style={{display:"block",width:"100%",background:"linear-gradient(135deg,#FF6B35,#E94560)",border:"none",borderRadius:14,padding:"14px",cursor:"pointer",marginBottom:8,position:"relative"}}>
          <div style={{position:"absolute",top:-8,right:12,background:"#38ef7d",color:"#0A0A0F",fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:8}}>BEST VALUE • 50% OFF</div>
          <p style={{fontSize:11,color:"#ffffffcc",fontWeight:600,marginBottom:2}}>ANNUAL PLAN</p>
          <p style={{fontSize:20,fontWeight:900,color:"#fff"}}>{"\u20B9"}599<span style={{fontSize:13,fontWeight:600,color:"#ffffffcc"}}>/year</span></p>
          <p style={{fontSize:11,color:"#ffffffcc",marginTop:2}}>Just {"\u20B9"}1.64/day · Save {"\u20B9"}589</p>
        </button>
        <button onClick={()=>handlePayment("monthly")} style={{display:"block",width:"100%",background:"#1A1A2E",border:"1px solid #ffffff20",borderRadius:14,padding:"14px",cursor:"pointer",marginBottom:10}}>
          <p style={{fontSize:11,color:"#b0b0b8",fontWeight:600,marginBottom:2}}>MONTHLY PLAN</p>
          <p style={{fontSize:18,fontWeight:800,color:"#fff"}}>{"\u20B9"}99<span style={{fontSize:13,fontWeight:600,color:"#b0b0b8"}}>/month</span></p>
        </button>
        
        <p style={{fontSize:10,color:"#9a9aa2",textAlign:"center",lineHeight:1.5}}>{!RAZORPAY_ENABLED?"\u{1F389} Pre-launch: Join the waitlist and get instant access to test all Pro features for free!":"Secure payment via Razorpay \u2022 Cancel anytime"}</p>
      </div>
    </div>;
  };

  // ── CHALLENGES ──
  const Challenges=()=><div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
    <h1 style={{fontSize:24,fontWeight:800,color:"#fff",marginBottom:4}}>Challenges</h1><p style={{fontSize:13,color:"#b0b0b8",marginBottom:20}}>Compete & earn XP</p>
    <div style={{background:"linear-gradient(135deg,#1A1A2E,#16213E)",borderRadius:16,padding:18,marginBottom:20,border:"1px solid #ffffff08"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{fontSize:15,fontWeight:700,color:"#fff"}}>{"\u{1F3C6}"} Leaderboard</h3><div style={{display:"flex",gap:4}}>{["weekly","alltime"].map(t=><button key={t} onClick={()=>setLt(t)} style={{background:lt===t?"#FF6B35":"transparent",border:"none",borderRadius:8,padding:"3px 10px",color:lt===t?"#fff":"#b0b0b8",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t==="weekly"?"Weekly":"All"}</button>)}</div></div>
      <div style={{background:"#FF6B3515",border:"1px solid #FF6B3530",borderRadius:10,padding:10,marginBottom:10,display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,fontWeight:700,color:"#FF6B35"}}>#{LEADERBOARD.filter(l=>l.xp>u.xp).length+1}</span><span style={{fontSize:13,fontWeight:600,color:"#fff"}}>{u.name} (You)</span></div><span style={{fontSize:12,color:"#FF6B35",fontWeight:600}}>{u.xp.toLocaleString()} XP</span></div>
      {LEADERBOARD.slice(0,5).map((e,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<4?"1px solid #ffffff08":"none"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,fontWeight:700,color:i<3?["#FFD700","#C0C0C0","#CD7F32"][i]:"#b0b0b8",minWidth:18}}>#{i+1}</span><span style={{fontSize:14}}>{e.avatar}</span><span style={{fontSize:13,color:"#ccc"}}>{e.name}</span></div><span style={{fontSize:12,color:"#aaa",fontWeight:600}}>{e.xp.toLocaleString()}</span></div>)}
    </div>
    <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:12}}>Active Challenges</h3>
    {CHALLENGES_DB.map(ch=>{const j=u.joinedChallenges.includes(ch.id);return <div key={ch.id} style={{background:"#12121A",border:"1px solid #ffffff08",borderRadius:14,padding:14,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:10,alignItems:"center",flex:1,minWidth:0}}><span style={{fontSize:28}}>{ch.icon}</span><div style={{minWidth:0}}><p style={{fontSize:14,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.name}</p><p style={{fontSize:11,color:"#b0b0b8"}}>{ch.days}d · {ch.participants.toLocaleString()} · +{ch.xpReward}XP</p></div></div><button onClick={()=>{if(!j){setU(x=>{const nb=[...x.badges];if(!nb.includes("challenge_1"))nb.push("challenge_1");return{...x,joinedChallenges:[...x.joinedChallenges,ch.id],badges:nb}});axp(20)}}} style={{background:j?"#ffffff10":"linear-gradient(135deg,#FF6B35,#E94560)",border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontSize:11,fontWeight:700,cursor:j?"default":"pointer",flexShrink:0}}>{j?"Joined \u2713":"Join"}</button></div>})}
  </div>;

  // ── PROFILE ──
  const Stats=()=>{const ub=BADGES_DB.filter(b=>u.badges.includes(b.id));const lb=BADGES_DB.filter(b=>!u.badges.includes(b.id));
  return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
    <div style={{textAlign:"center",marginBottom:24}}><div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#E94560)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:28}}>{u.name[0]?.toUpperCase()}</div><h1 style={{fontSize:20,fontWeight:800,color:"#fff"}}>{u.name}</h1><p style={{fontSize:12,color:"#b0b0b8"}}>{u.goal} · {u.level}</p></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:24}}>{[{l:"Workouts",v:u.workoutsCompleted,i:"\u{1F4AA}"},{l:"XP",v:u.xp.toLocaleString(),i:"\u26A1"},{l:"Streak",v:u.streak+"d",i:"\u{1F525}"},{l:"Minutes",v:u.totalMinutes,i:"\u23F1\uFE0F"},{l:"Badges",v:ub.length,i:"\u{1F3C5}"},{l:"Fit Age",v:u.fitnessAge||"?",i:"\u{1F9EC}"}].map((s,i)=><div key={i} style={{background:"#12121A",borderRadius:12,padding:12,textAlign:"center",border:"1px solid #ffffff08"}}><div style={{fontSize:22,marginBottom:4}}>{s.i}</div><p style={{fontSize:18,fontWeight:800,color:"#fff"}}>{s.v}</p><p style={{fontSize:10,color:"#b0b0b8"}}>{s.l}</p></div>)}</div>
    <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:12}}>{"\u{1F3C5}"} Badges ({ub.length}/{BADGES_DB.length})</h3>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>{ub.map(b=><div key={b.id} style={{background:"#12121A",borderRadius:12,padding:12,textAlign:"center",border:"1px solid #FF6B3530"}}><div style={{fontSize:26,marginBottom:2}}>{b.icon}</div><p style={{fontSize:10,fontWeight:700,color:"#fff"}}>{b.name}</p></div>)}{lb.map(b=><div key={b.id} style={{background:"#0A0A0F",borderRadius:12,padding:12,textAlign:"center",border:"1px solid #ffffff08",opacity:.35}}><div style={{fontSize:26,marginBottom:2,filter:"grayscale(1)"}}>{b.icon}</div><p style={{fontSize:10,fontWeight:700,color:"#b0b0b8"}}>{b.name}</p></div>)}</div>
    <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:14,padding:18,marginBottom:18}}><h3 style={{fontSize:15,fontWeight:800,color:"#fff",marginBottom:4}}>Invite Friends {"\u2728"}</h3><p style={{fontSize:12,color:"#ffffffcc",marginBottom:10}}>5 invites = 1 month Pro free!</p><div style={{background:"#ffffff20",borderRadius:10,padding:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,fontWeight:700,color:"#fff",letterSpacing:2}}>FITSTREAK-{u.name.toUpperCase().slice(0,4)}</span><button onClick={()=>setPop({type:"copied"})} style={{background:"#ffffff30",border:"none",borderRadius:8,padding:"5px 12px",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>Copy</button></div></div>
    <div style={{background:"#12121A",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #ffffff08"}}>
      <p style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:10}}>{"\u{1F3C3}"} Your Favorite Sport</p>
      <p style={{fontSize:11,color:"#b0b0b8",marginBottom:10}}>Daily motivation based on your sport</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {[["cricket","\u{1F3CF} Cricket"],["football","\u26BD Football"],["tennis","\u{1F3BE} Tennis"],["athletics","\u{1F3C3} Athletics"]].map(([id,label])=>
          <button key={id} onClick={()=>setU(x=>({...x,sport:id}))} style={{flex:"1 0 45%",background:u.sport===id?"linear-gradient(135deg,#FF6B35,#E94560)":"#1A1A2E",border:u.sport===id?"none":"1px solid #ffffff15",borderRadius:10,padding:"10px 8px",color:u.sport===id?"#fff":"#b0b0b8",fontSize:13,fontWeight:700,cursor:"pointer"}}>{label}</button>
        )}
      </div>
    </div>
    <button onClick={()=>{if(confirm("Reset all data?")){setU({...DU});setScr("onboarding");setOs(0)}}} style={{width:"100%",background:"transparent",border:"1px solid #E9456030",borderRadius:12,padding:10,color:"#E94560",fontSize:12,cursor:"pointer"}}>Reset Account</button>
  </div>};

  // ── POPUP ──
  const Popup=()=>{if(!pop)return null;return <div onClick={()=>setPop(null)} style={{position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:24}}><div onClick={e=>e.stopPropagation()} style={{background:"#12121A",borderRadius:20,padding:28,textAlign:"center",maxWidth:340,width:"100%",border:"1px solid #ffffff10"}}>
    {pop.type==="complete"&&<><div style={{fontSize:56}}>{"\u{1F389}"}</div><h2 style={{fontSize:22,fontWeight:900,color:"#fff",margin:"10px 0 6px"}}>Workout Complete!</h2><p style={{fontSize:13,color:"#b0b0b8",marginBottom:16}}>{pop.w.name} — +{pop.w.xp} XP</p><button onClick={()=>setPop(null)} style={{...BP,width:"100%"}}>Continue</button></>}
    {pop.type==="share"&&<><div style={{fontSize:56}}>{"\u{1F4E4}"}</div><h2 style={{fontSize:18,fontWeight:800,color:"#fff",margin:"10px 0"}}>Share Fitness Age!</h2><div style={{background:"linear-gradient(135deg,#1A1A2E,#0F3460)",borderRadius:16,padding:18,marginBottom:14}}><p style={{color:"#b0b0b8",fontSize:11}}>My Fitness Age</p><p style={{fontSize:44,fontWeight:900,color:"#38ef7d"}}>{pop.fa}</p><p style={{fontSize:12,color:"#aaa"}}>Beat me? {"\u{1F9EC}"}</p></div><p style={{fontSize:11,color:"#9a9aa2",marginBottom:14}}>Screenshot & share!</p><button onClick={()=>setPop(null)} style={{...BP,width:"100%"}}>Done</button></>}
    {pop.type==="copied"&&<><div style={{fontSize:44}}>{"\u2705"}</div><h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:"8px 0"}}>Copied!</h2><button onClick={()=>setPop(null)} style={{...BS,width:"100%",marginTop:12}}>Close</button></>}
    {pop.type==="added"&&<><div style={{fontSize:44}}>{"\u2705"}</div><h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:"8px 0"}}>Added to Routine!</h2><p style={{fontSize:12,color:"#b0b0b8",marginBottom:8}}>{pop.r?.title} saved · +5 XP</p><button onClick={()=>setPop(null)} style={{...BS,width:"100%",marginTop:12}}>Close</button></>}
    {pop.type==="already"&&<><div style={{fontSize:44}}>{"\u{1F4CB}"}</div><h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:"8px 0"}}>Already in Routine</h2><p style={{fontSize:12,color:"#b0b0b8"}}>{pop.msg||"This workout is already saved"}</p><button onClick={()=>setPop(null)} style={{...BS,width:"100%",marginTop:12}}>OK</button></>}
    {pop.type==="comments"&&<><div style={{fontSize:44}}>{"\u{1F4AC}"}</div><h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:"8px 0"}}>Comments</h2><div style={{textAlign:"left",maxHeight:200,overflowY:"auto",marginBottom:12}}>{[{n:"Aarav K.",t:"This burned my legs! 🔥",a:"\u{1F3CB}\uFE0F"},{n:"Priya S.",t:"Done 3 times this week, feeling stronger",a:"\u{1F9D8}"},{n:"Rahul M.",t:"Great form tips, thanks!",a:"\u{1F4AA}"},{n:"Sneha R.",t:"Perfect for beginners 💪",a:"\u{1F3C3}"}].map((c,i)=><div key={i} style={{display:"flex",gap:8,padding:"8px 0",borderBottom:"1px solid #ffffff08"}}><span style={{fontSize:18}}>{c.a}</span><div style={{flex:1}}><p style={{fontSize:12,fontWeight:700,color:"#fff"}}>{c.n}</p><p style={{fontSize:11,color:"#b0b0b8"}}>{c.t}</p></div></div>)}</div><button onClick={()=>setPop(null)} style={{...BS,width:"100%",marginTop:8}}>Close</button></>}
    {pop.type==="food"&&<><div style={{fontSize:44}}>{"\u{1F37D}\uFE0F"}</div><h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:"8px 0"}}>Food Logged! +5 XP</h2><p style={{fontSize:13,color:"#FF6B35",fontWeight:600}}>{pop.f?.name} — {pop.f?.cal} kcal</p><button onClick={()=>setPop(null)} style={{...BS,width:"100%",marginTop:12}}>Close</button></>}
  </div></div>};

  const Nav=()=>{if(["wo","ft","food","activity","pro"].includes(tab))return null;return <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#0A0A0Fee",backdropFilter:"blur(12px)",borderTop:"1px solid #ffffff08",display:"flex",justifyContent:"space-around",padding:"6px 0 10px",zIndex:50}}>{[{id:"home",i:"\u{1F3E0}",l:"Home"},{id:"explore",i:"\u{1F3AC}",l:"Explore"},{id:"pro",i:"\u{1F451}",l:"Pro AI"},{id:"challenges",i:"\u{1F3C6}",l:"Compete"},{id:"stats",i:"\u{1F4CA}",l:"Profile"}].map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"4px 10px"}}><span style={{fontSize:20,filter:tab===t.id?"none":"grayscale(1)",opacity:tab===t.id?1:.5,transition:"all .2s"}}>{t.i}</span><span style={{fontSize:9,fontWeight:600,color:tab===t.id?"#FF6B35":"#b0b0b8"}}>{t.l}</span></button>)}</div>};

  // Swipe-right gesture for back navigation
  const handleTouchStart=(e)=>{const t=e.touches[0];touchStartRef.current={x:t.clientX,y:t.clientY,time:Date.now()}};
  const handleTouchEnd=(e)=>{
    const start=touchStartRef.current;if(!start.time)return;
    const t=e.changedTouches[0];const dx=t.clientX-start.x;const dy=t.clientY-start.y;const dt=Date.now()-start.time;
    // Must be: started near left edge, dragged right > 70px, mostly horizontal, fast enough
    if(start.x<50&&dx>70&&Math.abs(dy)<60&&dt<500){
      // Back navigation based on current tab
      if(tab==="wo"){setWa(null);setTab("home")}
      else if(tab==="ft"){setTab("home")}
      else if(tab==="food"){setTab("home")}
      else if(tab==="pro"){if(proView!=="home")setProView("home");else setTab("home")}
      else if(tab==="activity"){if(pedoActive)stopPedometer();if(runActive)stopRun();setTab("home")}
      else if(tab!=="home"){setTab("home")}
    }
    touchStartRef.current={x:0,y:0,time:0};
  };

  return <div style={AS} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}><style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{background:#0A0A0F;overflow-x:hidden}input:focus{outline:none}button:active{transform:scale(.97)}@keyframes xpFloat{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-120%) scale(1.3)}}@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes scanLine{0%{top:15%;opacity:0}50%{opacity:1}100%{top:85%;opacity:0}}::-webkit-scrollbar{display:none}`}</style>
    <div style={G1}/><div style={G2}/>
    {tab==="home"&&Home()}{tab==="explore"&&Explore()}{tab==="challenges"&&Challenges()}{tab==="stats"&&Stats()}{tab==="wo"&&Workout()}{tab==="ft"&&FTest()}{tab==="food"&&Food()}{tab==="activity"&&Activity()}{tab==="pro"&&Pro()}
    {Paywall()}
    {Nav()}{Popup()}
    {xpa&&<div style={{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%,-50%)",zIndex:200,animation:"xpFloat 2s ease-out forwards",pointerEvents:"none"}}><div style={{fontSize:32,fontWeight:900,color:"#FF6B35",textShadow:"0 0 30px #FF6B3560"}}>+{xpa} XP</div></div>}
  </div>
}

const AS={width:"100%",maxWidth:430,margin:"0 auto",minHeight:"100vh",background:"#0A0A0F",color:"#EAEAEA",fontFamily:"'Outfit',sans-serif",position:"relative",overflow:"hidden"};
const G1={position:"fixed",top:-200,right:-200,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0};
const G2={position:"fixed",bottom:-150,left:-150,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(233,69,96,.05) 0%,transparent 70%)",pointerEvents:"none",zIndex:0};
const BP={background:"linear-gradient(135deg,#FF6B35,#E94560)",border:"none",borderRadius:14,padding:"13px 24px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all .2s"};
const BS={background:"#1A1A2E",border:"1px solid #ffffff20",borderRadius:14,padding:"13px 24px",color:"#eaeaea",fontSize:15,fontWeight:600,cursor:"pointer"};
const BB={background:"#1A1A2E",border:"1px solid #ffffff20",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",padding:"10px 14px",borderRadius:10,display:"inline-flex",alignItems:"center",gap:6,minHeight:40,minWidth:40};
const IS={background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:12,padding:"12px 14px",color:"#fff",fontSize:16,fontWeight:600,width:"100%",fontFamily:"Outfit,sans-serif"};
const OS={display:"flex",flexDirection:"column",justifyContent:"center",minHeight:"100vh",padding:32};
const OL={fontSize:20,fontWeight:700,color:"#fff",marginBottom:18};
const CB={border:"1px solid #ffffff15",borderRadius:14,padding:"13px 18px",fontSize:15,fontWeight:600,cursor:"pointer",marginBottom:8,width:"100%",textAlign:"left"};
const SP={background:"#1A1A2E",borderRadius:10,padding:"5px 10px",display:"flex",alignItems:"center",gap:4};
const MC={background:"#12121A",borderRadius:14,padding:"10px 8px",textAlign:"center",border:"1px solid #ffffff08",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer"};
const WR={width:"100%",background:"#12121A",border:"1px solid #ffffff08",borderRadius:14,padding:14,marginBottom:8,cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"};
const WC={background:"#12121A",border:"1px solid #ffffff08",borderRadius:14,padding:12,cursor:"pointer",textAlign:"left"};
const SB={background:"#00000060",border:"none",borderRadius:50,width:42,height:42,color:"#fff",fontSize:16,cursor:"pointer"};
