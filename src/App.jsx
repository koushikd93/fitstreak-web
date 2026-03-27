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
];

const WORKOUTS_DB = [
  { id:1,name:"HIIT Inferno",type:"hiit",duration:15,difficulty:"intermediate",equipment:"bodyweight",xp:80,exercises:[{name:"Jumping Jacks",sets:3,reps:20,rest:15,tip:"Land softly on your feet",anim:"jj"},{name:"Burpees",sets:3,reps:10,rest:20,tip:"Keep core tight through the jump",anim:"burpee"},{name:"Mountain Climbers",sets:3,reps:20,rest:15,tip:"Drive knees to chest rapidly",anim:"mc"},{name:"High Knees",sets:3,reps:30,rest:15,tip:"Pump your arms for momentum",anim:"hk"},{name:"Squat Jumps",sets:3,reps:12,rest:20,tip:"Explode up, land in squat",anim:"squat"}]},
  { id:2,name:"Push-Up Mastery",type:"strength",duration:10,difficulty:"beginner",equipment:"bodyweight",xp:60,exercises:[{name:"Wall Push-Ups",sets:3,reps:15,rest:15,tip:"Keep body straight",anim:"pu"},{name:"Knee Push-Ups",sets:3,reps:12,rest:20,tip:"Lower chest to floor",anim:"pu"},{name:"Standard Push-Ups",sets:3,reps:8,rest:25,tip:"Elbows at 45 degrees",anim:"pu"},{name:"Diamond Push-Ups",sets:2,reps:6,rest:30,tip:"Diamond hand shape",anim:"pu"},{name:"Wide Push-Ups",sets:3,reps:10,rest:20,tip:"Hands wider than shoulders",anim:"pu"}]},
  { id:3,name:"Core Destroyer",type:"strength",duration:12,difficulty:"intermediate",equipment:"bodyweight",xp:70,exercises:[{name:"Plank Hold",sets:3,reps:"30s",rest:15,tip:"Squeeze glutes and brace core",anim:"plank"},{name:"Bicycle Crunches",sets:3,reps:20,rest:15,tip:"Elbow to opposite knee",anim:"crunch"},{name:"Leg Raises",sets:3,reps:12,rest:20,tip:"Lower back pressed to floor",anim:"jj"},{name:"Russian Twists",sets:3,reps:20,rest:15,tip:"Rotate from the torso",anim:"yoga"},{name:"Flutter Kicks",sets:3,reps:30,rest:15,tip:"Legs 6 inches off ground",anim:"mc"}]},
  { id:4,name:"Leg Day Express",type:"strength",duration:15,difficulty:"beginner",equipment:"bodyweight",xp:75,exercises:[{name:"Bodyweight Squats",sets:4,reps:15,rest:15,tip:"Push knees out over toes",anim:"squat"},{name:"Lunges",sets:3,reps:12,rest:20,tip:"Front knee over ankle",anim:"hk"},{name:"Glute Bridges",sets:3,reps:15,rest:15,tip:"Squeeze glutes at top",anim:"plank"},{name:"Calf Raises",sets:3,reps:20,rest:10,tip:"Full range of motion",anim:"squat"},{name:"Wall Sit",sets:3,reps:"30s",rest:20,tip:"Thighs parallel to ground",anim:"plank"}]},
  { id:5,name:"Zen Flow",type:"flexibility",duration:10,difficulty:"beginner",equipment:"bodyweight",xp:50,exercises:[{name:"Cat-Cow Stretch",sets:1,reps:10,rest:5,tip:"Sync with breath",anim:"yoga"},{name:"Downward Dog",sets:1,reps:"30s",rest:5,tip:"Heels toward floor",anim:"yoga"},{name:"Pigeon Pose",sets:1,reps:"30s",rest:5,tip:"Keep hips square",anim:"yoga"},{name:"Forward Fold",sets:1,reps:"45s",rest:5,tip:"Hinge at hips",anim:"yoga"},{name:"Child's Pose",sets:1,reps:"60s",rest:0,tip:"Breathe deeply",anim:"yoga"}]},
  { id:6,name:"Cardio Blitz",type:"hiit",duration:20,difficulty:"advanced",equipment:"bodyweight",xp:100,exercises:[{name:"Burpee Tuck Jumps",sets:4,reps:8,rest:20,tip:"Tuck knees at peak",anim:"burpee"},{name:"Speed Skaters",sets:4,reps:20,rest:15,tip:"Land softly",anim:"hk"},{name:"Plyo Lunges",sets:4,reps:16,rest:20,tip:"Switch legs mid-air",anim:"hk"},{name:"Bear Crawl",sets:3,reps:"20s",rest:20,tip:"Keep hips low",anim:"mc"},{name:"Star Jumps",sets:4,reps:12,rest:15,tip:"Fully extend",anim:"jj"}]},
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

const MOTIV = ["\u{1F525} Your only competition is yesterday's you","\u{1F4AA} Sweat now, flex later","\u26A1 1% better every single day","\u{1F3C6} Champions train, losers complain","\u{1F48E} Pain today = strength tomorrow","\u2705 Don't stop when tired. Stop when done","\u{1F680} Small steps still move forward"];

const REELS = [
  {id:1,title:"5-Min Ab Burner",trainer:"Coach Ravi",views:"24K",likes:"2.4K",gradient:"linear-gradient(135deg,#FF6B35,#E94560)",anim:"crunch",exercises:["Crunches x20","Plank 30s","Leg Raises x15","Twists x20"],duration:"5:00"},
  {id:2,title:"No-Equipment HIIT",trainer:"Priya Fitness",views:"18K",likes:"1.8K",gradient:"linear-gradient(135deg,#667eea,#764ba2)",anim:"burpee",exercises:["Burpees x10","Jump Squats x15","High Knees 30s","Climbers x20"],duration:"7:00"},
  {id:3,title:"Morning Yoga Flow",trainer:"Zen Studios",views:"31K",likes:"3.1K",gradient:"linear-gradient(135deg,#11998e,#38ef7d)",anim:"yoga",exercises:["Sun Salutation x5","Warrior II 30s","Tree Pose 20s","Savasana 60s"],duration:"10:00"},
  {id:4,title:"Upper Body Blast",trainer:"FitWithArjun",views:"12K",likes:"1.2K",gradient:"linear-gradient(135deg,#fc5c7d,#6a82fb)",anim:"pu",exercises:["Push-Ups x15","Diamond x10","Dips x12","Shoulder Taps x20"],duration:"8:00"},
  {id:5,title:"Leg Day Home",trainer:"StrongLegs Co",views:"9K",likes:"900",gradient:"linear-gradient(135deg,#f093fb,#f5576c)",anim:"squat",exercises:["Squats x20","Lunges x16","Bridges x15","Wall Sit 45s"],duration:"12:00"},
  {id:6,title:"Full Body Burn",trainer:"FitStreak",views:"42K",likes:"4.5K",gradient:"linear-gradient(135deg,#FA8BFF,#2BD2FF 50%,#2BFF88)",anim:"jj",exercises:["Jumping Jacks x30","Squats x20","Push-Ups x15","Burpees x10"],duration:"15:00"},
];

function ExAnim({type,size=200}){
  const[f,setF]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setF(x=>(x+1)%60),50);return()=>clearInterval(iv)},[]);
  const p=f/60,b=Math.sin(p*Math.PI*2),ab=Math.abs(b),s=size,cx=s/2,cy=s/2,hr=s*.06,bt=cy-s*.18,bb=cy+s*.05;
  const figs={
    jj:()=>{const as=ab*s*.22,ls=ab*s*.15,jh=ab*s*.06;return <g transform={`translate(0,${-jh})`}><circle cx={cx} cy={bt-hr-4} r={hr} fill="#FF6B35"/><line x1={cx} y1={bt} x2={cx} y2={bb} stroke="#FF6B35" strokeWidth={3} strokeLinecap="round"/><line x1={cx} y1={bt+10} x2={cx-as} y2={bt-as*.8} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bt+10} x2={cx+as} y2={bt-as*.8} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb} x2={cx-ls} y2={bb+s*.2} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb} x2={cx+ls} y2={bb+s*.2} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/></g>},
    burpee:()=>{const ph=p<.33?0:p<.66?1:2;if(ph===0){const t=p/.33,sq=t*s*.1;return <g><circle cx={cx} cy={bt-hr-4+sq} r={hr} fill="#E94560"/><line x1={cx} y1={bt+sq} x2={cx} y2={bb+sq*.5} stroke="#E94560" strokeWidth={3} strokeLinecap="round"/><line x1={cx} y1={bb+sq*.5} x2={cx-12} y2={bb+s*.18} stroke="#E94560" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb+sq*.5} x2={cx+12} y2={bb+s*.18} stroke="#E94560" strokeWidth={2.5} strokeLinecap="round"/></g>}else if(ph===1)return <g><circle cx={cx-s*.15} cy={cy-2} r={hr} fill="#E94560"/><line x1={cx-s*.12} y1={cy} x2={cx+s*.18} y2={cy} stroke="#E94560" strokeWidth={3} strokeLinecap="round"/><line x1={cx+s*.18} y1={cy} x2={cx+s*.18} y2={cy+s*.15} stroke="#E94560" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx+s*.14} y1={cy} x2={cx+s*.14} y2={cy+s*.15} stroke="#E94560" strokeWidth={2.5} strokeLinecap="round"/></g>;const jh=Math.sin((p-.66)/.34*Math.PI)*s*.12;return <g transform={`translate(0,${-jh})`}><circle cx={cx} cy={bt-hr-8} r={hr} fill="#E94560"/><line x1={cx} y1={bt-4} x2={cx} y2={bb} stroke="#E94560" strokeWidth={3} strokeLinecap="round"/><line x1={cx} y1={bt+6} x2={cx-18} y2={bt-16} stroke="#E94560" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bt+6} x2={cx+18} y2={bt-16} stroke="#E94560" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb} x2={cx-10} y2={bb+s*.18} stroke="#E94560" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb} x2={cx+10} y2={bb+s*.18} stroke="#E94560" strokeWidth={2.5} strokeLinecap="round"/></g>},
    squat:()=>{const d=ab*s*.1;return <g><circle cx={cx} cy={bt-hr-4+d} r={hr} fill="#667eea"/><line x1={cx} y1={bt+d} x2={cx} y2={bb+d*.6} stroke="#667eea" strokeWidth={3} strokeLinecap="round"/><line x1={cx} y1={bt+8+d} x2={cx-20} y2={bt+13+d} stroke="#667eea" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bt+8+d} x2={cx+20} y2={bt+13+d} stroke="#667eea" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb+d*.6} x2={cx-14} y2={bb+s*.19} stroke="#667eea" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb+d*.6} x2={cx+14} y2={bb+s*.19} stroke="#667eea" strokeWidth={2.5} strokeLinecap="round"/></g>},
    mc:()=>{const sw=b>0,kd=ab*s*.14;return <g><circle cx={cx-s*.15} cy={cy-6} r={hr} fill="#38ef7d"/><line x1={cx-s*.12} y1={cy-2} x2={cx+s*.12} y2={cy+6} stroke="#38ef7d" strokeWidth={3} strokeLinecap="round"/><line x1={cx-s*.08} y1={cy} x2={cx-s*.2} y2={cy+s*.1} stroke="#38ef7d" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx+s*.12} y1={cy+6} x2={cx+(sw?0:s*.12)} y2={cy+6+(sw?s*.16:kd)} stroke="#38ef7d" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx+s*.12} y1={cy+6} x2={cx+(!sw?0:s*.12)} y2={cy+6+(!sw?s*.16:kd)} stroke="#38ef7d" strokeWidth={2.5} strokeLinecap="round"/></g>},
    pu:()=>{const d=ab*s*.05;return <g><circle cx={cx-s*.18} cy={cy-4+d} r={hr} fill="#fc5c7d"/><line x1={cx-s*.14} y1={cy+d} x2={cx+s*.14} y2={cy+d+2} stroke="#fc5c7d" strokeWidth={3} strokeLinecap="round"/><line x1={cx-s*.08} y1={cy+d-2} x2={cx-s*.14} y2={cy+s*.12+d} stroke="#fc5c7d" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx+s*.08} y1={cy+d+1} x2={cx+s*.14} y2={cy+s*.12+d} stroke="#fc5c7d" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx+s*.14} y1={cy+d+2} x2={cx+s*.22} y2={cy+d+s*.12} stroke="#fc5c7d" strokeWidth={2.5} strokeLinecap="round"/></g>},
    plank:()=>{const sh=Math.sin(f*.5);return <g transform={`translate(0,${sh})`}><circle cx={cx-s*.18} cy={cy-2} r={hr} fill="#f093fb"/><line x1={cx-s*.14} y1={cy} x2={cx+s*.18} y2={cy+2} stroke="#f093fb" strokeWidth={3} strokeLinecap="round"/><line x1={cx-s*.08} y1={cy-1} x2={cx-s*.12} y2={cy+s*.1} stroke="#f093fb" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx+s*.18} y1={cy+2} x2={cx+s*.18} y2={cy+s*.1} stroke="#f093fb" strokeWidth={2.5} strokeLinecap="round"/></g>},
    yoga:()=>{const sw=Math.sin(p*Math.PI*2)*5;return <g><circle cx={cx+sw*.3} cy={bt-hr-8} r={hr} fill="#11998e"/><line x1={cx+sw*.2} y1={bt-4} x2={cx} y2={bb} stroke="#11998e" strokeWidth={3} strokeLinecap="round"/><line x1={cx+sw*.2} y1={bt+6} x2={cx-22+sw} y2={bt-6} stroke="#11998e" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx+sw*.2} y1={bt+6} x2={cx+22+sw} y2={bt-6} stroke="#11998e" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb} x2={cx-16} y2={bb+s*.18} stroke="#11998e" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb} x2={cx+16} y2={bb+s*.18} stroke="#11998e" strokeWidth={2.5} strokeLinecap="round"/></g>},
    hk:()=>{const lu=b>0,kh=ab*s*.12;return <g><circle cx={cx} cy={bt-hr-6-kh*.2} r={hr} fill="#FF6B35"/><line x1={cx} y1={bt-2-kh*.2} x2={cx} y2={bb} stroke="#FF6B35" strokeWidth={3} strokeLinecap="round"/><line x1={cx} y1={bb} x2={lu?cx-4:cx-10} y2={lu?bb-kh:bb+s*.18} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bb} x2={!lu?cx+4:cx+10} y2={!lu?bb-kh:bb+s*.18} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bt+6} x2={cx-16} y2={bt+12+(lu?-8:8)} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx} y1={bt+6} x2={cx+16} y2={bt+12+(!lu?-8:8)} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/></g>},
    crunch:()=>{const a=ab*20;return <g><circle cx={cx-10} cy={cy-a*.3} r={hr} fill="#FF6B35"/><line x1={cx-6} y1={cy-a*.2+6} x2={cx+5} y2={cy+14} stroke="#FF6B35" strokeWidth={3} strokeLinecap="round"/><line x1={cx+5} y1={cy+14} x2={cx+20} y2={cy+s*.12} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/><line x1={cx+5} y1={cy+14} x2={cx-10} y2={cy+s*.12} stroke="#FF6B35" strokeWidth={2.5} strokeLinecap="round"/></g>},
  };
  return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{display:"block"}}><defs><radialGradient id="gbg"><stop offset="0%" stopColor="#FF6B3510"/><stop offset="100%" stopColor="transparent"/></radialGradient></defs><circle cx={cx} cy={cy} r={s*.38} fill="url(#gbg)"/>{(figs[type]||figs.jj)()}</svg>
}

const load=async()=>{try{const r=await window.storage.get("fs-v4");return r?JSON.parse(r.value):null}catch{return null}};
const save=async s=>{try{await window.storage.set("fs-v4",JSON.stringify(s))}catch{}};
const DU={name:"",goal:"",level:"",duration:15,xp:0,streak:0,longestStreak:0,freezeTokens:1,lastActiveDate:null,workoutsCompleted:0,totalMinutes:0,badges:["early_bird"],fitnessAge:0,realAge:0,joinedChallenges:[],shares:0,completedWorkoutIds:[],foodLog:[],foodLogTotal:0,steps:0,stepsGoal:10000,runKm:0,sleepHours:0,sleepGoal:8,sleepLog:[],activityLog:[],onboarded:false};

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
  const[camOn,setCamOn]=useState(false);
  const[scanning,setScanning]=useState(false);
  const[scanResult,setScanResult]=useState(null);
  const[scanError,setScanError]=useState(null);
  const[capturedImg,setCapturedImg]=useState(null);
  const videoRef=useRef(null);
  const canvasRef=useRef(null);
  const streamRef=useRef(null);
  const tmr=useRef(null);

  useEffect(()=>{(async()=>{const s=await load();if(s&&s.onboarded){const td=new Date().toDateString();const la=s.lastActiveDate?new Date(s.lastActiveDate).toDateString():null;const yd=new Date(Date.now()-864e5).toDateString();if(la&&la!==td&&la!==yd){s.freezeTokens>0?s.freezeTokens--:(s.streak=0)}const ll=s.foodLog?.[0]?.date;if(ll&&new Date(ll).toDateString()!==td){s.foodLog=[];s.foodLogTotal=0}setU({...DU,...s});setScr("app")}else setScr("onboarding")})()},[]);
  useEffect(()=>{if(u.onboarded)save(u)},[u]);
  useEffect(()=>{if(tr&&tm>0){tmr.current=setTimeout(()=>setTm(t=>t-1),1e3)}else if(tm===0&&tr)setTr(false);return()=>clearTimeout(tmr.current)},[tm,tr]);

  const axp=useCallback(a=>{const m=u.streak>=30?2:u.streak>=7?1.5:1;const t=Math.round(a*m);setXpa(t);setTimeout(()=>setXpa(null),2e3);setU(x=>{const nx=x.xp+t;const nb=[...x.badges];if(nx>=1e3&&!nb.includes("xp_1000"))nb.push("xp_1000");if(nx>=5e3&&!nb.includes("xp_5000"))nb.push("xp_5000");return{...x,xp:nx,badges:nb}})},[u.streak]);

  const cw=useCallback(w=>{const td=new Date().toDateString();setU(x=>{const la=x.lastActiveDate?new Date(x.lastActiveDate).toDateString():null;const ns=la===td?x.streak:x.streak+1;const nb=[...x.badges];const nc=x.workoutsCompleted+1;if(nc>=1&&!nb.includes("first_flame"))nb.push("first_flame");if(nc>=10&&!nb.includes("workouts_10"))nb.push("workouts_10");if(ns>=7&&!nb.includes("streak_7"))nb.push("streak_7");if(ns>=30&&!nb.includes("streak_30"))nb.push("streak_30");return{...x,streak:ns,longestStreak:Math.max(x.longestStreak,ns),lastActiveDate:new Date().toISOString(),workoutsCompleted:nc,totalMinutes:x.totalMinutes+w.duration,badges:nb,completedWorkoutIds:[...x.completedWorkoutIds,w.id]}});axp(w.xp);setWa(null);setEi(0);setPop({type:"complete",w})},[axp]);

  const cfa=useCallback(d=>{const{pushups,flexibility,heartRate,weight,height,age}=d;const bmi=weight/((height/100)**2);const ps=Math.min(pushups/25,1)*30;const fls=Math.min(flexibility/40,1)*20;const hs=Math.min(Math.max(1-(heartRate-50)/60,0),1)*30;const bs=Math.min(Math.max(1-Math.abs(bmi-22)/10,0),1)*20;return Math.max(15,Math.min(Math.round(age-(ps+fls+hs+bs-50)*.4),age+20))},[]);

  const addFood=f=>{setU(x=>{const nl=[{...f,date:new Date().toISOString(),id:Date.now()},...(x.foodLog||[])];const nb=[...x.badges];if(nl.length>=10&&!nb.includes("food_tracker"))nb.push("food_tracker");return{...x,foodLog:nl,foodLogTotal:(x.foodLogTotal||0)+f.cal,badges:nb}});axp(5);setPop({type:"food",f})};

  const logAct=(type,val)=>{const v=Number(val);const e={type,value:v,date:new Date().toISOString()};setU(x=>{const nl=[e,...(x.activityLog||[])];if(type==="walk")return{...x,steps:(x.steps||0)+v,activityLog:nl};if(type==="run")return{...x,runKm:Math.round(((x.runKm||0)+v)*100)/100,activityLog:nl};if(type==="sleep")return{...x,sleepHours:v,sleepLog:[e,...(x.sleepLog||[]).slice(0,6)],activityLog:nl};return x});axp(type==="sleep"?10:15)};

  const startCam=async()=>{
    setScanResult(null);setScanError(null);setCapturedImg(null);
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:640},height:{ideal:480}}});
      streamRef.current=stream;setCamOn(true);
      setTimeout(()=>{if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.play().catch(()=>{})}},100);
    }catch(e){setScanError("Camera access denied. Please allow camera permissions.");console.error(e)}
  };

  const stopCam=()=>{
    if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null}
    setCamOn(false)
  };

  const capturePhoto=()=>{
    if(!videoRef.current||!canvasRef.current)return null;
    const v=videoRef.current;const c=canvasRef.current;
    c.width=v.videoWidth||640;c.height=v.videoHeight||480;
    const ctx=c.getContext("2d");ctx.drawImage(v,0,0,c.width,c.height);
    return c.toDataURL("image/jpeg",0.8);
  };

  const scanFood=async()=>{
    const imgData=capturePhoto();
    if(!imgData){setScanError("Could not capture photo. Try again.");return}
    setCapturedImg(imgData);stopCam();setScanning(true);setScanError(null);
    try{
      const base64=imgData.split(",")[1];
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:"image/jpeg",data:base64}},
            {type:"text",text:`Identify every food item visible in this image. For EACH item, estimate its nutritional content per typical serving as shown. Return ONLY a JSON array (no markdown, no backticks, no explanation) where each element has these exact keys: "name" (string, include portion like "1 plate" or "1 cup"), "cal" (number, kcal), "protein" (number, grams), "carbs" (number, grams), "fat" (number, grams), "category" (one of: "breakfast","lunch","snack","drink","sweet","fruit"), "region" (string, cuisine origin e.g. "North India","South India","Pan India","Nepal","Sri Lanka","Italian","Chinese","Japanese","American" etc). If you see a common Indian/South Asian dish, use its local name. If no food is visible, return: [{"name":"No food detected","cal":0,"protein":0,"carbs":0,"fat":0,"category":"snack","region":"N/A"}]. Return ONLY the JSON array.`}
          ]}]
        })
      });
      const data=await resp.json();
      const text=data.content?.map(c=>c.text||"").join("")||"";
      const clean=text.replace(/```json|```/g,"").trim();
      const items=JSON.parse(clean);
      if(Array.isArray(items)&&items.length>0){
        setScanResult(items.filter(i=>i.cal>0));
        if(items[0].name==="No food detected")setScanError("No food detected in the image. Try pointing the camera at food.")
      }else{setScanError("Could not identify food. Try a clearer photo.")}
    }catch(e){console.error(e);setScanError("AI analysis failed. Try again or add food manually.")}
    setScanning(false)
  };

  // ── LOADING ──
  if(scr==="loading")return <div style={AS}><div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>{"\u26A1"}</div><p style={{color:"#888"}}>Loading FitStreak...</p></div></div></div>;

  // ── ONBOARDING ──
  if(scr==="onboarding"){const steps=[
    <div key="0" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:32,textAlign:"center"}}><div style={{fontSize:72,marginBottom:16}}>{"\u26A1"}</div><h1 style={{fontSize:42,fontWeight:800,background:"linear-gradient(135deg,#FF6B35,#E94560)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8,letterSpacing:-1}}>FitStreak</h1><p style={{fontSize:18,color:"#888",marginBottom:48,maxWidth:280,lineHeight:1.5}}>Your fitness, gamified. Streaks, XP, compete.</p><button onClick={()=>setOs(1)} style={BP}>Get Started →</button></div>,
    <div key="1" style={OS}><p style={OL}>What should we call you?</p><input value={od.name} onChange={e=>setOd(d=>({...d,name:e.target.value}))} placeholder="Your name" style={IS}/><button disabled={!od.name.trim()} onClick={()=>setOs(2)} style={{...BP,opacity:od.name.trim()?1:.4}}>Next →</button></div>,
    <div key="2" style={OS}><p style={OL}>Your main goal?</p>{["Lose Fat \u{1F525}","Build Muscle \u{1F4AA}","Get Flexible \u{1F9D8}","Stay Active \u26A1"].map(g=><button key={g} onClick={()=>{setOd(d=>({...d,goal:g}));setOs(3)}} style={{...CB,background:od.goal===g?"#FF6B35":"#1A1A2E",color:od.goal===g?"#fff":"#aaa"}}>{g}</button>)}</div>,
    <div key="3" style={OS}><p style={OL}>Fitness level?</p>{[["Beginner \u{1F331}","beginner"],["Intermediate \u{1F4AB}","intermediate"],["Advanced \u{1F3C6}","advanced"]].map(([l,v])=><button key={v} onClick={()=>{setOd(d=>({...d,level:v}));setOs(4)}} style={{...CB,background:od.level===v?"#FF6B35":"#1A1A2E",color:od.level===v?"#fff":"#aaa"}}>{l}</button>)}</div>,
    <div key="4" style={OS}><p style={OL}>Workout duration?</p>{[5,10,15,20,30].map(d=><button key={d} onClick={()=>{setOd(x=>({...x,duration:d}));setOs(5)}} style={{...CB,background:od.duration===d?"#FF6B35":"#1A1A2E",color:od.duration===d?"#fff":"#aaa"}}>{d} min</button>)}</div>,
    <div key="5" style={{...OS,textAlign:"center"}}><div style={{fontSize:64,marginBottom:16}}>{"\u{1F680}"}</div><h2 style={{fontSize:28,fontWeight:800,color:"#fff",marginBottom:8}}>You're set, {od.name}!</h2><p style={{color:"#888",marginBottom:32,fontSize:15}}>Let's build an unbreakable streak.</p><button onClick={()=>{setU({...DU,...od,onboarded:true});setScr("app")}} style={BP}>Start My Journey {"\u26A1"}</button></div>,
  ];return <div style={AS}><div style={G1}/><div style={G2}/>{steps[os]}</div>}

  // ── HOME ──
  const Home=()=>{const h=new Date().getHours();const gr=h<12?"Good morning":h<17?"Good afternoon":"Good evening";const q=MOTIV[new Date().getDate()%MOTIV.length];const rec=WORKOUTS_DB.filter(w=>w.difficulty===u.level||w.difficulty==="beginner").slice(0,3);const tc=u.foodLogTotal||0;
  return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div><p style={{fontSize:14,color:"#666",marginBottom:2}}>{gr}</p><h1 style={{fontSize:26,fontWeight:800,color:"#fff"}}>{u.name} {"\u270C\uFE0F"}</h1></div><div style={{display:"flex",gap:8}}><div style={SP}><span style={{fontSize:14}}>{"\u{1F525}"}</span><span style={{fontSize:15,fontWeight:700,color:"#FF6B35"}}>{u.streak}</span></div><div style={SP}><span style={{fontSize:14}}>{"\u26A1"}</span><span style={{fontSize:15,fontWeight:700,color:"#E94560"}}>{u.xp.toLocaleString()}</span></div></div></div>
    <div style={{background:"linear-gradient(135deg,#1A1A2E,#16213E)",borderRadius:16,padding:18,marginBottom:18,border:"1px solid #ffffff08"}}><p style={{fontSize:14,color:"#ccc",lineHeight:1.6,fontStyle:"italic"}}>{q}</p></div>
    <div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:20,padding:22,marginBottom:18,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-30,right:-30,fontSize:120,opacity:.1}}>{"\u{1F525}"}</div><p style={{fontSize:11,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Current Streak</p><div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:48,fontWeight:900,color:"#fff"}}>{u.streak}</span><span style={{fontSize:16,color:"#ffffffcc"}}>days</span></div><div style={{display:"flex",gap:16,marginTop:10}}><div><span style={{fontSize:11,color:"#ffffffaa"}}>Longest</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{u.longestStreak}d</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Freeze</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{u.freezeTokens}{"\u{1F9CA}"}</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Multi</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{u.streak>=30?"2x":u.streak>=7?"1.5x":"1x"}</p></div></div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
      <button onClick={()=>setTab("activity")} style={MC}><span style={{fontSize:20}}>{"\u{1F6B6}"}</span><span style={{fontSize:18,fontWeight:800,color:"#38ef7d"}}>{(u.steps||0).toLocaleString()}</span><span style={{fontSize:10,color:"#888"}}>steps</span><div style={{width:"100%",height:3,background:"#1A1A2E",borderRadius:2,marginTop:4}}><div style={{width:`${Math.min(((u.steps||0)/1e4)*100,100)}%`,height:"100%",background:"#38ef7d",borderRadius:2}}/></div></button>
      <button onClick={()=>setTab("food")} style={MC}><span style={{fontSize:20}}>{"\u{1F37D}\uFE0F"}</span><span style={{fontSize:18,fontWeight:800,color:"#FF6B35"}}>{tc}</span><span style={{fontSize:10,color:"#888"}}>kcal</span><div style={{width:"100%",height:3,background:"#1A1A2E",borderRadius:2,marginTop:4}}><div style={{width:`${Math.min((tc/2e3)*100,100)}%`,height:"100%",background:"#FF6B35",borderRadius:2}}/></div></button>
      <button onClick={()=>{setTab("activity");setAt("sleep")}} style={MC}><span style={{fontSize:20}}>{"\u{1F634}"}</span><span style={{fontSize:18,fontWeight:800,color:"#667eea"}}>{u.sleepHours||0}h</span><span style={{fontSize:10,color:"#888"}}>sleep</span><div style={{width:"100%",height:3,background:"#1A1A2E",borderRadius:2,marginTop:4}}><div style={{width:`${Math.min(((u.sleepHours||0)/8)*100,100)}%`,height:"100%",background:"#667eea",borderRadius:2}}/></div></button>
    </div>
    {u.fitnessAge===0?<button onClick={()=>{setFts(1);setFtd({});setTab("ft")}} style={{width:"100%",background:"linear-gradient(135deg,#667eea,#764ba2)",border:"none",borderRadius:16,padding:18,textAlign:"left",cursor:"pointer",marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontSize:10,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5}}>Viral Challenge</p><p style={{fontSize:18,fontWeight:800,color:"#fff",marginTop:4}}>Check Your Fitness Age {"\u{1F9EC}"}</p><p style={{fontSize:12,color:"#ffffffbb",marginTop:2}}>60s test · Share with friends</p></div><span style={{fontSize:32}}>{"\u2192"}</span></div></button>:<div style={{background:"#1A1A2E",borderRadius:16,padding:18,marginBottom:18,border:"1px solid #ffffff08"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontSize:11,color:"#888",textTransform:"uppercase",letterSpacing:1}}>Fitness Age</p><div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:2}}><span style={{fontSize:32,fontWeight:900,color:u.fitnessAge<u.realAge?"#38ef7d":"#E94560"}}>{u.fitnessAge}</span><span style={{fontSize:13,color:"#888"}}>vs {u.realAge}</span></div></div><button onClick={()=>{setFts(1);setFtd({});setTab("ft")}} style={{background:"#ffffff10",border:"1px solid #ffffff15",borderRadius:10,padding:"6px 12px",color:"#aaa",fontSize:12,cursor:"pointer"}}>Retake →</button></div></div>}
    <h2 style={{fontSize:17,fontWeight:700,color:"#fff",marginBottom:12}}>Recommended</h2>
    {rec.map(w=><button key={w.id} onClick={()=>{setWa(w);setEi(0);setTab("wo")}} style={WR}><div><p style={{fontSize:15,fontWeight:700,color:"#fff"}}>{w.name}</p><p style={{fontSize:12,color:"#888",marginTop:2}}>{w.duration}m · {w.difficulty} · +{w.xp}XP</p></div><div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:10,padding:"7px 14px"}}><span style={{color:"#fff",fontSize:12,fontWeight:700}}>Start</span></div></button>)}
    <h2 style={{fontSize:17,fontWeight:700,color:"#fff",marginBottom:12,marginTop:20}}>All Workouts</h2>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{WORKOUTS_DB.map(w=><button key={w.id} onClick={()=>{setWa(w);setEi(0);setTab("wo")}} style={WC}><div style={{fontSize:26,marginBottom:6}}>{w.type==="hiit"?"\u{1F525}":w.type==="strength"?"\u{1F4AA}":"\u{1F9D8}"}</div><p style={{fontSize:13,fontWeight:700,color:"#fff"}}>{w.name}</p><p style={{fontSize:11,color:"#888",marginTop:2}}>{w.duration}m · +{w.xp}XP</p></button>)}</div>
  </div>};

  // ── WORKOUT PLAYER ──
  const Workout=()=>{if(!wa){setTab("home");return null}const ex=wa.exercises[ei];const pr=((ei+1)/wa.exercises.length)*100;
  return <div style={{minHeight:"100vh",background:"#0A0A0F",padding:"20px 16px",position:"relative",zIndex:1}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><button onClick={()=>{setWa(null);setTab("home")}} style={BB}>← Back</button><span style={{fontSize:13,color:"#888"}}>{ei+1}/{wa.exercises.length}</span></div>
    <div style={{background:"#1A1A2E",borderRadius:6,height:5,marginBottom:20,overflow:"hidden"}}><div style={{width:`${pr}%`,height:"100%",background:"linear-gradient(90deg,#FF6B35,#E94560)",borderRadius:6,transition:"width .5s"}}/></div>
    <h1 style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:2}}>{wa.name}</h1>
    <p style={{fontSize:13,color:"#888",marginBottom:16}}>{wa.duration}m · {wa.exercises.length} exercises</p>
    <div style={{background:"linear-gradient(135deg,#1A1A2E,#0F3460)",borderRadius:20,padding:24,marginBottom:16,textAlign:"center",border:"1px solid #ffffff10"}}>
      <p style={{fontSize:12,color:"#FF6B35",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Current Exercise</p>
      <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><ExAnim type={ex.anim||"jj"} size={140}/></div>
      <h2 style={{fontSize:24,fontWeight:900,color:"#fff",marginBottom:10}}>{ex.name}</h2>
      <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:14}}>
        <div><span style={{fontSize:22,fontWeight:800,color:"#FF6B35"}}>{ex.sets}</span><p style={{fontSize:11,color:"#888"}}>Sets</p></div>
        <div><span style={{fontSize:22,fontWeight:800,color:"#E94560"}}>{ex.reps}</span><p style={{fontSize:11,color:"#888"}}>Reps</p></div>
        <div><span style={{fontSize:22,fontWeight:800,color:"#667eea"}}>{ex.rest}s</span><p style={{fontSize:11,color:"#888"}}>Rest</p></div>
      </div>
      <div style={{background:"#ffffff08",borderRadius:10,padding:10}}><p style={{fontSize:12,color:"#ccc"}}>{"\u{1F4A1}"} {ex.tip}</p></div>
    </div>
    <div style={{textAlign:"center",marginBottom:20}}>{tr?<div><p style={{fontSize:13,color:"#888",marginBottom:6}}>Rest Timer</p><span style={{fontSize:44,fontWeight:900,color:"#FF6B35"}}>{tm}s</span></div>:<button onClick={()=>{setTm(ex.rest);setTr(true)}} style={{background:"#1A1A2E",border:"1px solid #FF6B35",borderRadius:12,padding:"9px 22px",color:"#FF6B35",fontSize:13,fontWeight:600,cursor:"pointer"}}>Start Rest Timer ({ex.rest}s)</button>}</div>
    <div style={{display:"flex",gap:10}}>{ei>0&&<button onClick={()=>setEi(i=>i-1)} style={{...BS,flex:1}}>← Previous</button>}{ei<wa.exercises.length-1?<button onClick={()=>{setEi(i=>i+1);setTr(false)}} style={{...BP,flex:1}}>Next Exercise →</button>:<button onClick={()=>cw(wa)} style={{...BP,flex:1,background:"linear-gradient(135deg,#38ef7d,#11998e)"}}>Complete {"\u2705"}</button>}</div>
  </div>};

  // ── FITNESS TEST ──
  const FTest=()=>{const ss=[null,{l:"Your Age",k:"age",p:"22",un:"years"},{l:"Height",k:"height",p:"170",un:"cm"},{l:"Weight",k:"weight",p:"65",un:"kg"},{l:"Push-ups in 30s",k:"pushups",p:"15",un:"reps"},{l:"Sit & Reach",k:"flexibility",p:"25",un:"cm"},{l:"Resting Heart Rate",k:"heartRate",p:"72",un:"BPM"}];
  if(fts===7){const fa=cfa(ftd);const diff=ftd.age-fa;const iy=diff>0;if(u.fitnessAge!==fa)setTimeout(()=>{setU(x=>{const nb=[...x.badges];if(!nb.includes("age_test"))nb.push("age_test");return{...x,fitnessAge:fa,realAge:ftd.age,badges:nb}});axp(30)},100);
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",position:"relative",zIndex:1}}><div style={{background:"linear-gradient(135deg,#1A1A2E,#0F3460)",borderRadius:24,padding:28,width:"100%",maxWidth:360,border:"1px solid #ffffff10",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-40,right:-40,fontSize:100,opacity:.1}}>{"\u{1F9EC}"}</div><p style={{fontSize:11,color:"#888",textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>Your Fitness Age</p><div style={{fontSize:64,fontWeight:900,color:iy?"#38ef7d":"#E94560",lineHeight:1,marginBottom:8}}>{fa}</div><p style={{fontSize:15,color:"#aaa",marginBottom:18}}>{iy?`\u{1F389} ${diff} years younger!`:`Body feels ${Math.abs(diff)}y older`}</p><div style={{background:"#ffffff08",borderRadius:12,padding:14,marginBottom:18,textAlign:"left"}}>{[["Age",ftd.age],["Push-ups",ftd.pushups],["HR",ftd.heartRate+" BPM"],["BMI",(ftd.weight/((ftd.height/100)**2)).toFixed(1)]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{color:"#888",fontSize:12}}>{l}</span><span style={{color:"#fff",fontSize:12,fontWeight:600}}>{v}</span></div>)}</div><button onClick={()=>{setU(x=>({...x,shares:x.shares+1}));setPop({type:"share",fa})}} style={{...BP,width:"100%",marginBottom:8,background:"linear-gradient(135deg,#667eea,#764ba2)"}}>Share {"\u{1F4E4}"}</button><button onClick={()=>setTab("home")} style={{...BS,width:"100%"}}>Back</button></div></div>}
  const step=ss[fts];
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",zIndex:1}}>
    <button onClick={()=>fts===1?setTab("home"):setFts(s=>s-1)} style={{...BB,alignSelf:"flex-start",marginBottom:28}}>← Back</button>
    <div style={{width:"100%",maxWidth:360}}>
      <div style={{display:"flex",gap:4,marginBottom:28}}>{[1,2,3,4,5,6].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=fts?"#FF6B35":"#1A1A2E"}}/>)}</div>
      <p style={{fontSize:13,color:"#FF6B35",fontWeight:600,marginBottom:6}}>Step {fts}/6</p>
      <h2 style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:20}}>{step.l}</h2>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:28}}><input type="number" value={ftd[step.k]||""} onChange={e=>setFtd(d=>({...d,[step.k]:Number(e.target.value)}))} placeholder={`e.g. ${step.p}`} style={{...IS,flex:1}} autoFocus/><span style={{color:"#888",fontSize:13,minWidth:36}}>{step.un}</span></div>
      <button disabled={!ftd[step.k]} onClick={()=>setFts(s=>s+1)} style={{...BP,width:"100%",opacity:ftd[step.k]?1:.4}}>{fts===6?"See My Fitness Age \u{1F9EC}":"Next →"}</button>
    </div>
  </div>};

  // ── EXPLORE REELS ──
  const Explore=()=>{const r=REELS[ri];
  return <div style={{height:"100vh",position:"relative",overflow:"hidden"}}><div style={{height:"100%",background:r.gradient,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:24,paddingBottom:100,position:"relative"}}>
    <div style={{position:"absolute",top:16,left:16,right:16,display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:5}}><h3 style={{fontSize:16,fontWeight:800,color:"#fff"}}>Explore</h3><span style={{fontSize:12,color:"#ffffffaa"}}>{ri+1}/{REELS.length}</span></div>
    <div style={{position:"absolute",top:50,right:16,background:"#00000050",borderRadius:8,padding:"4px 10px",zIndex:5}}><span style={{color:"#fff",fontSize:12,fontWeight:600}}>{"\u23F1"} {r.duration}</span></div>
    <div onClick={()=>setRp(p=>!p)} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-60%)",textAlign:"center",cursor:"pointer",zIndex:3}}>
      {rp?<div><ExAnim type={r.anim} size={220}/><p style={{color:"#ffffffcc",fontSize:13,marginTop:4}}>Tap to pause</p></div>:
      <div><div style={{width:80,height:80,borderRadius:"50%",background:"#ffffff30",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",border:"2px solid #ffffff50"}}><span style={{fontSize:36,marginLeft:4}}>{"\u25B6"}</span></div><p style={{color:"#ffffffbb",fontSize:13}}>Tap to play workout</p></div>}
    </div>
    {rp&&<div style={{position:"absolute",top:80,left:16,zIndex:5}}>{r.exercises.map((ex,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,animation:`slideIn .3s ease ${i*.1}s both`}}><div style={{width:6,height:6,borderRadius:"50%",background:"#ffffff80"}}/><span style={{color:"#ffffffdd",fontSize:13,fontWeight:500}}>{ex}</span></div>)}</div>}
    <div style={{position:"relative",zIndex:4}}><h2 style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:3}}>{r.title}</h2><p style={{fontSize:13,color:"#ffffffcc",marginBottom:10}}>@{r.trainer} · {r.views} views</p><div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>{r.exercises.map((ex,i)=><span key={i} style={{background:"#ffffff20",borderRadius:8,padding:"3px 8px",fontSize:11,color:"#fff"}}>{ex}</span>)}</div><button onClick={()=>setPop({type:"added",r})} style={{background:"#ffffff20",backdropFilter:"blur(10px)",border:"1px solid #ffffff30",borderRadius:12,padding:"9px 18px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Add to Routine</button></div>
    <div style={{position:"absolute",right:14,bottom:120,display:"flex",flexDirection:"column",gap:18,alignItems:"center",zIndex:5}}>{[["\u2764\uFE0F",r.likes],["\u{1F4AC}","189"],["\u{1F4E4}","Share"],["\u{1F516}","Save"]].map(([i,l])=><div key={i} style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:22}}>{i}</div><span style={{fontSize:10,color:"#ffffffaa"}}>{l}</span></div>)}</div>
  </div>
  <div style={{position:"absolute",bottom:75,left:0,right:0,display:"flex",justifyContent:"center",gap:10,zIndex:6}}>
    <button disabled={ri===0} onClick={()=>{setRi(i=>i-1);setRp(false)}} style={{...SB,opacity:ri===0?.3:1}}>{"\u2191"}</button>
    <button disabled={ri===REELS.length-1} onClick={()=>{setRi(i=>i+1);setRp(false)}} style={{...SB,opacity:ri===REELS.length-1?.3:1}}>{"\u2193"}</button>
  </div></div>};

  // ── FOOD TRACKER WITH AI CAMERA SCANNER ──
  const Food=()=>{const cats=["all","breakfast","lunch","snack","drink","sweet","fruit"];const ff=FOOD_DB.filter(f=>(fc==="all"||f.category===fc)&&(!fs||f.name.toLowerCase().includes(fs.toLowerCase())||f.region.toLowerCase().includes(fs.toLowerCase())));const tl=u.foodLog||[];const tots=tl.reduce((a,f)=>({cal:a.cal+f.cal,protein:a.protein+f.protein,carbs:a.carbs+f.carbs,fat:a.fat+f.fat}),{cal:0,protein:0,carbs:0,fat:0});
  return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><button onClick={()=>{stopCam();setTab("home")}} style={BB}>{"\u2190"}</button><h1 style={{fontSize:22,fontWeight:800,color:"#fff"}}>Food Tracker {"\u{1F37D}\uFE0F"}</h1></div>
    <div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:18,padding:20,marginBottom:18,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.1}}>{"\u{1F37D}\uFE0F"}</div><p style={{fontSize:11,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Today's Intake</p><div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:10}}><span style={{fontSize:42,fontWeight:900,color:"#fff"}}>{tots.cal}</span><span style={{fontSize:15,color:"#ffffffcc"}}>/ 2000 kcal</span></div><div style={{background:"#ffffff30",borderRadius:6,height:8,marginBottom:12,overflow:"hidden"}}><div style={{width:`${Math.min((tots.cal/2e3)*100,100)}%`,height:"100%",background:"#fff",borderRadius:6,transition:"width .3s"}}/></div><div style={{display:"flex",gap:16}}><div><span style={{fontSize:11,color:"#ffffffaa"}}>Protein</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{tots.protein}g</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Carbs</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{tots.carbs}g</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Fat</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{tots.fat}g</p></div><div><span style={{fontSize:11,color:"#ffffffaa"}}>Items</span><p style={{fontSize:16,fontWeight:700,color:"#fff"}}>{tl.length}</p></div></div></div>

    {/* AI Camera Scanner Section */}
    <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:16,padding:2,marginBottom:18}}>
      <div style={{background:"#0e0e18",borderRadius:14,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>{"\u{1F4F7}"}</span>
            <div>
              <p style={{fontSize:15,fontWeight:700,color:"#fff"}}>AI Food Scanner</p>
              <p style={{fontSize:11,color:"#888"}}>Point camera at food to scan calories</p>
            </div>
          </div>
          {!camOn && !capturedImg && <button onClick={startCam} style={{background:"linear-gradient(135deg,#667eea,#764ba2)",border:"none",borderRadius:10,padding:"8px 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Scan {"\u{1F4F7}"}</button>}
        </div>

        {/* Camera View */}
        {camOn && <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:12,background:"#000"}}>
          <video ref={videoRef} autoPlay playsInline muted style={{width:"100%",height:240,objectFit:"cover",display:"block",borderRadius:12}} />
          <canvas ref={canvasRef} style={{display:"none"}} />
          {/* Scan overlay frame */}
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
            <div style={{width:"70%",height:"70%",border:"2px dashed #ffffff60",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <p style={{color:"#ffffffaa",fontSize:12,fontWeight:600,textShadow:"0 1px 4px #000"}}>Position food here</p>
            </div>
          </div>
          {/* Corner markers */}
          <div style={{position:"absolute",top:30,left:"15%",width:20,height:20,borderTop:"3px solid #667eea",borderLeft:"3px solid #667eea",borderRadius:"4px 0 0 0"}} />
          <div style={{position:"absolute",top:30,right:"15%",width:20,height:20,borderTop:"3px solid #667eea",borderRight:"3px solid #667eea",borderRadius:"0 4px 0 0"}} />
          <div style={{position:"absolute",bottom:30,left:"15%",width:20,height:20,borderBottom:"3px solid #667eea",borderLeft:"3px solid #667eea",borderRadius:"0 0 0 4px"}} />
          <div style={{position:"absolute",bottom:30,right:"15%",width:20,height:20,borderBottom:"3px solid #667eea",borderRight:"3px solid #667eea",borderRadius:"0 0 4px 0"}} />
          {/* Scanning line animation */}
          <div style={{position:"absolute",top:0,left:"15%",right:"15%",height:2,background:"linear-gradient(90deg,transparent,#667eea,transparent)",animation:"scanLine 2s ease-in-out infinite"}} />
          <div style={{display:"flex",gap:8,position:"absolute",bottom:12,left:0,right:0,justifyContent:"center"}}>
            <button onClick={scanFood} style={{background:"linear-gradient(135deg,#667eea,#764ba2)",border:"none",borderRadius:50,width:56,height:56,color:"#fff",fontSize:24,cursor:"pointer",boxShadow:"0 4px 20px #667eea60",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u{1F4F7}"}</button>
            <button onClick={stopCam} style={{background:"#ffffff20",border:"1px solid #ffffff30",borderRadius:50,width:56,height:56,color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
          </div>
        </div>}

        {/* Captured image preview while scanning */}
        {capturedImg && scanning && <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:12}}>
          <img src={capturedImg} alt="Captured food" style={{width:"100%",height:200,objectFit:"cover",borderRadius:12,opacity:0.6}} />
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#00000060",borderRadius:12}}>
            <div style={{width:40,height:40,border:"3px solid #667eea",borderTop:"3px solid transparent",borderRadius:"50%",animation:"spin 1s linear infinite",marginBottom:12}} />
            <p style={{color:"#fff",fontSize:14,fontWeight:600}}>Analyzing food with AI...</p>
            <p style={{color:"#ffffffaa",fontSize:12,marginTop:4}}>Identifying items & calories</p>
          </div>
        </div>}

        {/* Scan Results */}
        {scanResult && scanResult.length > 0 && <div style={{marginTop:4}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <p style={{fontSize:14,fontWeight:700,color:"#38ef7d"}}>{"\u2705"} Found {scanResult.length} item{scanResult.length>1?"s":""}</p>
            <button onClick={()=>{setScanResult(null);setCapturedImg(null)}} style={{color:"#888",fontSize:12,background:"none",border:"none",cursor:"pointer"}}>Clear</button>
          </div>
          {capturedImg && <img src={capturedImg} alt="Scanned" style={{width:"100%",height:120,objectFit:"cover",borderRadius:10,marginBottom:10,border:"1px solid #ffffff15"}} />}
          {scanResult.map((item,i)=> <div key={i} style={{background:"#1A1A2E",borderRadius:12,padding:12,marginBottom:8,border:"1px solid #667eea30"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:14,fontWeight:700,color:"#fff"}}>{item.name}</p>
                <p style={{fontSize:11,color:"#888",marginTop:2}}>{item.region} · P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g</p>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <span style={{fontSize:15,fontWeight:800,color:"#667eea"}}>{item.cal} kcal</span>
                <button onClick={()=>{addFood(item);setScanResult(r=>r.filter((_,j)=>j!==i))}} style={{background:"linear-gradient(135deg,#38ef7d,#11998e)",border:"none",borderRadius:8,width:32,height:32,color:"#0A0A0F",fontSize:16,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            </div>
          </div>)}
          <button onClick={()=>{scanResult.forEach(item=>{if(item.cal>0)addFood(item)});setScanResult(null);setCapturedImg(null)}} style={{...BP,width:"100%",marginTop:4,background:"linear-gradient(135deg,#667eea,#764ba2)",fontSize:13,padding:"10px 16px"}}>Add All Items ({scanResult.reduce((a,i)=>a+i.cal,0)} kcal) {"\u{1F4E5}"}</button>
        </div>}

        {/* Scan Error */}
        {scanError && <div style={{background:"#E9456015",border:"1px solid #E9456030",borderRadius:10,padding:12,marginTop:8}}>
          <p style={{fontSize:13,color:"#E94560"}}>{scanError}</p>
          <button onClick={()=>{setScanError(null);setCapturedImg(null);startCam()}} style={{color:"#667eea",fontSize:12,fontWeight:600,background:"none",border:"none",cursor:"pointer",marginTop:6}}>Try Again {"\u2192"}</button>
        </div>}
      </div>
    </div>

    <div style={{position:"relative",marginBottom:12}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>{"\u{1F50D}"}</span><input value={fs} onChange={e=>setFs(e.target.value)} placeholder="Search food, region..." style={{...IS,paddingLeft:40}}/></div>
    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:14}}>{cats.map(c=><button key={c} onClick={()=>setFc(c)} style={{background:fc===c?"#FF6B35":"#1A1A2E",border:"none",borderRadius:10,padding:"6px 14px",color:fc===c?"#fff":"#888",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{c==="all"?"All":c[0].toUpperCase()+c.slice(1)}</button>)}</div>
    <div style={{maxHeight:320,overflowY:"auto"}}>{ff.slice(0,30).map((f,i)=><div key={i} style={{background:"#12121A",border:"1px solid #ffffff08",borderRadius:12,padding:12,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{flex:1,minWidth:0}}><p style={{fontSize:14,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</p><p style={{fontSize:11,color:"#888",marginTop:2}}>{f.region} · P:{f.protein}g C:{f.carbs}g F:{f.fat}g</p></div><div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}><span style={{fontSize:14,fontWeight:700,color:"#FF6B35"}}>{f.cal}</span><button onClick={()=>addFood(f)} style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",border:"none",borderRadius:8,width:32,height:32,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button></div></div>)}{ff.length===0&&<p style={{textAlign:"center",color:"#666",padding:32,fontSize:14}}>No foods found</p>}</div>
    {tl.length>0&&<div style={{marginTop:20}}><h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:10}}>Today's Log ({tl.length})</h3>{tl.slice(0,10).map((f,i)=><div key={f.id||i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #ffffff08"}}><span style={{fontSize:13,color:"#ccc"}}>{f.name}</span><span style={{fontSize:13,color:"#FF6B35",fontWeight:600}}>{f.cal} kcal</span></div>)}</div>}
  </div>};

  // ── ACTIVITY TRACKER ──
  const Activity=()=>{const sl=u.sleepLog||[];
  return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><button onClick={()=>setTab("home")} style={BB}>{"\u2190"}</button><h1 style={{fontSize:22,fontWeight:800,color:"#fff"}}>Activity Tracker</h1></div>
    <div style={{display:"flex",gap:6,marginBottom:20}}>{[["walk","\u{1F6B6} Walk"],["run","\u{1F3C3} Run"],["sleep","\u{1F634} Sleep"]].map(([id,label])=><button key={id} onClick={()=>setAt(id)} style={{flex:1,background:at===id?(id==="walk"?"#38ef7d":id==="run"?"#FF6B35":"#667eea"):"#1A1A2E",border:"none",borderRadius:12,padding:"10px 4px",color:at===id?(id==="sleep"?"#fff":"#0A0A0F"):"#888",fontSize:13,fontWeight:700,cursor:"pointer"}}>{label}</button>)}</div>
    {at==="walk"&&<div>
      <div style={{background:"linear-gradient(135deg,#11998e,#38ef7d)",borderRadius:20,padding:24,marginBottom:20,textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.15}}>{"\u{1F6B6}"}</div><p style={{fontSize:11,color:"#000000aa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Today's Steps</p><div style={{fontSize:52,fontWeight:900,color:"#0A0A0F"}}>{(u.steps||0).toLocaleString()}</div><p style={{fontSize:14,color:"#0A0A0F99",marginBottom:12}}>Goal: 10,000</p><div style={{background:"#00000020",borderRadius:8,height:10,overflow:"hidden",maxWidth:260,margin:"0 auto"}}><div style={{width:`${Math.min(((u.steps||0)/1e4)*100,100)}%`,height:"100%",background:"#0A0A0F",borderRadius:8}}/></div><p style={{fontSize:12,color:"#0A0A0F88",marginTop:8}}>{"\u2248"} {((u.steps||0)*.000762).toFixed(1)} km · {"\u2248"} {Math.round((u.steps||0)*.04)} kcal</p></div>
      <div style={{display:"flex",gap:8,marginBottom:14}}><input type="number" value={si} onChange={e=>setSi(e.target.value)} placeholder="Steps" style={{...IS,flex:1}}/><button onClick={()=>{if(si>0){logAct("walk",si);setSi("")}}} disabled={!si||si<=0} style={{...BP,opacity:si>0?1:.4,padding:"12px 20px"}}>+ Add</button></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{[1e3,2e3,5e3,8e3,1e4].map(v=><button key={v} onClick={()=>logAct("walk",v)} style={{background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:10,padding:"8px 14px",color:"#38ef7d",fontSize:12,fontWeight:600,cursor:"pointer"}}>{v.toLocaleString()}</button>)}</div>
    </div>}
    {at==="run"&&<div>
      <div style={{background:"linear-gradient(135deg,#FF6B35,#E94560)",borderRadius:20,padding:24,marginBottom:20,textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.15}}>{"\u{1F3C3}"}</div><p style={{fontSize:11,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Total Distance</p><div style={{fontSize:52,fontWeight:900,color:"#fff"}}>{(u.runKm||0).toFixed(1)}</div><p style={{fontSize:16,color:"#ffffffcc"}}>km</p><p style={{fontSize:12,color:"#ffffffaa",marginTop:8}}>{"\u2248"} {Math.round((u.runKm||0)*62)} kcal burned</p></div>
      <div style={{display:"flex",gap:8,marginBottom:14}}><input type="number" step="0.1" value={rni} onChange={e=>setRni(e.target.value)} placeholder="km" style={{...IS,flex:1}}/><button onClick={()=>{if(rni>0){logAct("run",rni);setRni("")}}} disabled={!rni||rni<=0} style={{...BP,opacity:rni>0?1:.4,padding:"12px 20px"}}>+ Add</button></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{[1,2,3,5,10].map(v=><button key={v} onClick={()=>logAct("run",v)} style={{background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:10,padding:"8px 14px",color:"#FF6B35",fontSize:12,fontWeight:600,cursor:"pointer"}}>{v} km</button>)}</div>
    </div>}
    {at==="sleep"&&<div>
      <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:20,padding:24,marginBottom:20,textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.15}}>{"\u{1F634}"}</div><p style={{fontSize:11,color:"#ffffffaa",fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Last Night</p><div style={{fontSize:52,fontWeight:900,color:"#fff"}}>{u.sleepHours||0}</div><p style={{fontSize:16,color:"#ffffffcc"}}>hours</p><p style={{fontSize:12,color:"#ffffffaa",marginTop:8}}>{(u.sleepHours||0)>=8?"\u2705 Goal met!":((8-(u.sleepHours||0)).toFixed(1)+"h short")}</p></div>
      <div style={{display:"flex",gap:8,marginBottom:14}}><input type="number" step="0.5" value={sli} onChange={e=>setSli(e.target.value)} placeholder="Hours" style={{...IS,flex:1}}/><button onClick={()=>{if(sli>0){logAct("sleep",sli);setSli("")}}} disabled={!sli||sli<=0} style={{...BP,opacity:sli>0?1:.4,padding:"12px 20px",background:"linear-gradient(135deg,#667eea,#764ba2)"}}>Log</button></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>{[4,5,6,7,8,9].map(v=><button key={v} onClick={()=>logAct("sleep",v)} style={{background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:10,padding:"8px 14px",color:"#667eea",fontSize:12,fontWeight:600,cursor:"pointer"}}>{v}h</button>)}</div>
      {sl.length>0&&<div><h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:10}}>Sleep History</h3><div style={{display:"flex",gap:6,alignItems:"flex-end",height:120,padding:"0 4px"}}>{sl.slice(0,7).reverse().map((s,i)=>{const pc=(s.value/12)*100;return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><span style={{fontSize:10,color:"#aaa"}}>{s.value}h</span><div style={{width:"100%",height:`${pc}%`,minHeight:8,background:s.value>=8?"linear-gradient(to top,#667eea,#764ba2)":"linear-gradient(to top,#E94560,#E9456080)",borderRadius:6}}/><span style={{fontSize:9,color:"#666"}}>{new Date(s.date).toLocaleDateString([],{weekday:"short"})}</span></div>})}</div></div>}
    </div>}
    {(u.activityLog||[]).length>0&&<div style={{marginTop:24}}><h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:10}}>Recent</h3>{(u.activityLog||[]).slice(0,8).map((a,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #ffffff08"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:16}}>{a.type==="walk"?"\u{1F6B6}":a.type==="run"?"\u{1F3C3}":"\u{1F634}"}</span><span style={{fontSize:13,color:"#ccc"}}>{a.type==="walk"?Number(a.value).toLocaleString()+" steps":a.type==="run"?a.value+" km":a.value+"h sleep"}</span></div><span style={{fontSize:11,color:"#666"}}>{new Date(a.date).toLocaleDateString()}</span></div>)}</div>}
  </div>};

  // ── CHALLENGES ──
  const Challenges=()=><div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
    <h1 style={{fontSize:24,fontWeight:800,color:"#fff",marginBottom:4}}>Challenges</h1><p style={{fontSize:13,color:"#888",marginBottom:20}}>Compete & earn XP</p>
    <div style={{background:"linear-gradient(135deg,#1A1A2E,#16213E)",borderRadius:16,padding:18,marginBottom:20,border:"1px solid #ffffff08"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{fontSize:15,fontWeight:700,color:"#fff"}}>{"\u{1F3C6}"} Leaderboard</h3><div style={{display:"flex",gap:4}}>{["weekly","alltime"].map(t=><button key={t} onClick={()=>setLt(t)} style={{background:lt===t?"#FF6B35":"transparent",border:"none",borderRadius:8,padding:"3px 10px",color:lt===t?"#fff":"#888",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t==="weekly"?"Weekly":"All"}</button>)}</div></div>
      <div style={{background:"#FF6B3515",border:"1px solid #FF6B3530",borderRadius:10,padding:10,marginBottom:10,display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,fontWeight:700,color:"#FF6B35"}}>#{LEADERBOARD.filter(l=>l.xp>u.xp).length+1}</span><span style={{fontSize:13,fontWeight:600,color:"#fff"}}>{u.name} (You)</span></div><span style={{fontSize:12,color:"#FF6B35",fontWeight:600}}>{u.xp.toLocaleString()} XP</span></div>
      {LEADERBOARD.slice(0,5).map((e,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<4?"1px solid #ffffff08":"none"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,fontWeight:700,color:i<3?["#FFD700","#C0C0C0","#CD7F32"][i]:"#888",minWidth:18}}>#{i+1}</span><span style={{fontSize:14}}>{e.avatar}</span><span style={{fontSize:13,color:"#ccc"}}>{e.name}</span></div><span style={{fontSize:12,color:"#aaa",fontWeight:600}}>{e.xp.toLocaleString()}</span></div>)}
    </div>
    <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:12}}>Active Challenges</h3>
    {CHALLENGES_DB.map(ch=>{const j=u.joinedChallenges.includes(ch.id);return <div key={ch.id} style={{background:"#12121A",border:"1px solid #ffffff08",borderRadius:14,padding:14,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:10,alignItems:"center",flex:1,minWidth:0}}><span style={{fontSize:28}}>{ch.icon}</span><div style={{minWidth:0}}><p style={{fontSize:14,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.name}</p><p style={{fontSize:11,color:"#888"}}>{ch.days}d · {ch.participants.toLocaleString()} · +{ch.xpReward}XP</p></div></div><button onClick={()=>{if(!j){setU(x=>{const nb=[...x.badges];if(!nb.includes("challenge_1"))nb.push("challenge_1");return{...x,joinedChallenges:[...x.joinedChallenges,ch.id],badges:nb}});axp(20)}}} style={{background:j?"#ffffff10":"linear-gradient(135deg,#FF6B35,#E94560)",border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontSize:11,fontWeight:700,cursor:j?"default":"pointer",flexShrink:0}}>{j?"Joined \u2713":"Join"}</button></div>})}
  </div>;

  // ── PROFILE ──
  const Stats=()=>{const ub=BADGES_DB.filter(b=>u.badges.includes(b.id));const lb=BADGES_DB.filter(b=>!u.badges.includes(b.id));
  return <div style={{padding:"20px 16px 100px",position:"relative",zIndex:1}}>
    <div style={{textAlign:"center",marginBottom:24}}><div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#E94560)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:28}}>{u.name[0]?.toUpperCase()}</div><h1 style={{fontSize:20,fontWeight:800,color:"#fff"}}>{u.name}</h1><p style={{fontSize:12,color:"#888"}}>{u.goal} · {u.level}</p></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:24}}>{[{l:"Workouts",v:u.workoutsCompleted,i:"\u{1F4AA}"},{l:"XP",v:u.xp.toLocaleString(),i:"\u26A1"},{l:"Streak",v:u.streak+"d",i:"\u{1F525}"},{l:"Minutes",v:u.totalMinutes,i:"\u23F1\uFE0F"},{l:"Badges",v:ub.length,i:"\u{1F3C5}"},{l:"Fit Age",v:u.fitnessAge||"?",i:"\u{1F9EC}"}].map((s,i)=><div key={i} style={{background:"#12121A",borderRadius:12,padding:12,textAlign:"center",border:"1px solid #ffffff08"}}><div style={{fontSize:22,marginBottom:4}}>{s.i}</div><p style={{fontSize:18,fontWeight:800,color:"#fff"}}>{s.v}</p><p style={{fontSize:10,color:"#888"}}>{s.l}</p></div>)}</div>
    <h3 style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:12}}>{"\u{1F3C5}"} Badges ({ub.length}/{BADGES_DB.length})</h3>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>{ub.map(b=><div key={b.id} style={{background:"#12121A",borderRadius:12,padding:12,textAlign:"center",border:"1px solid #FF6B3530"}}><div style={{fontSize:26,marginBottom:2}}>{b.icon}</div><p style={{fontSize:10,fontWeight:700,color:"#fff"}}>{b.name}</p></div>)}{lb.map(b=><div key={b.id} style={{background:"#0A0A0F",borderRadius:12,padding:12,textAlign:"center",border:"1px solid #ffffff08",opacity:.35}}><div style={{fontSize:26,marginBottom:2,filter:"grayscale(1)"}}>{b.icon}</div><p style={{fontSize:10,fontWeight:700,color:"#888"}}>{b.name}</p></div>)}</div>
    <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:14,padding:18,marginBottom:18}}><h3 style={{fontSize:15,fontWeight:800,color:"#fff",marginBottom:4}}>Invite Friends {"\u2728"}</h3><p style={{fontSize:12,color:"#ffffffcc",marginBottom:10}}>5 invites = 1 month Pro free!</p><div style={{background:"#ffffff20",borderRadius:10,padding:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,fontWeight:700,color:"#fff",letterSpacing:2}}>FITSTREAK-{u.name.toUpperCase().slice(0,4)}</span><button onClick={()=>setPop({type:"copied"})} style={{background:"#ffffff30",border:"none",borderRadius:8,padding:"5px 12px",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>Copy</button></div></div>
    <button onClick={()=>{if(confirm("Reset all data?")){setU({...DU});setScr("onboarding");setOs(0)}}} style={{width:"100%",background:"transparent",border:"1px solid #E9456030",borderRadius:12,padding:10,color:"#E94560",fontSize:12,cursor:"pointer"}}>Reset Account</button>
  </div>};

  // ── POPUP ──
  const Popup=()=>{if(!pop)return null;return <div onClick={()=>setPop(null)} style={{position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:24}}><div onClick={e=>e.stopPropagation()} style={{background:"#12121A",borderRadius:20,padding:28,textAlign:"center",maxWidth:340,width:"100%",border:"1px solid #ffffff10"}}>
    {pop.type==="complete"&&<><div style={{fontSize:56}}>{"\u{1F389}"}</div><h2 style={{fontSize:22,fontWeight:900,color:"#fff",margin:"10px 0 6px"}}>Workout Complete!</h2><p style={{fontSize:13,color:"#888",marginBottom:16}}>{pop.w.name} — +{pop.w.xp} XP</p><button onClick={()=>setPop(null)} style={{...BP,width:"100%"}}>Continue</button></>}
    {pop.type==="share"&&<><div style={{fontSize:56}}>{"\u{1F4E4}"}</div><h2 style={{fontSize:18,fontWeight:800,color:"#fff",margin:"10px 0"}}>Share Fitness Age!</h2><div style={{background:"linear-gradient(135deg,#1A1A2E,#0F3460)",borderRadius:16,padding:18,marginBottom:14}}><p style={{color:"#888",fontSize:11}}>My Fitness Age</p><p style={{fontSize:44,fontWeight:900,color:"#38ef7d"}}>{pop.fa}</p><p style={{fontSize:12,color:"#aaa"}}>Beat me? {"\u{1F9EC}"}</p></div><p style={{fontSize:11,color:"#666",marginBottom:14}}>Screenshot & share!</p><button onClick={()=>setPop(null)} style={{...BP,width:"100%"}}>Done</button></>}
    {pop.type==="copied"&&<><div style={{fontSize:44}}>{"\u2705"}</div><h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:"8px 0"}}>Copied!</h2><button onClick={()=>setPop(null)} style={{...BS,width:"100%",marginTop:12}}>Close</button></>}
    {pop.type==="added"&&<><div style={{fontSize:44}}>{"\u2705"}</div><h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:"8px 0"}}>Added to Routine!</h2><button onClick={()=>setPop(null)} style={{...BS,width:"100%",marginTop:12}}>Close</button></>}
    {pop.type==="food"&&<><div style={{fontSize:44}}>{"\u{1F37D}\uFE0F"}</div><h2 style={{fontSize:16,fontWeight:700,color:"#fff",margin:"8px 0"}}>Food Logged! +5 XP</h2><p style={{fontSize:13,color:"#FF6B35",fontWeight:600}}>{pop.f?.name} — {pop.f?.cal} kcal</p><button onClick={()=>setPop(null)} style={{...BS,width:"100%",marginTop:12}}>Close</button></>}
  </div></div>};

  const Nav=()=>{if(["wo","ft","food","activity"].includes(tab))return null;return <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#0A0A0Fee",backdropFilter:"blur(12px)",borderTop:"1px solid #ffffff08",display:"flex",justifyContent:"space-around",padding:"6px 0 10px",zIndex:50}}>{[{id:"home",i:"\u{1F3E0}",l:"Home"},{id:"explore",i:"\u{1F3AC}",l:"Explore"},{id:"challenges",i:"\u{1F3C6}",l:"Compete"},{id:"stats",i:"\u{1F4CA}",l:"Profile"}].map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"4px 12px"}}><span style={{fontSize:20,filter:tab===t.id?"none":"grayscale(1)",opacity:tab===t.id?1:.5,transition:"all .2s"}}>{t.i}</span><span style={{fontSize:9,fontWeight:600,color:tab===t.id?"#FF6B35":"#888"}}>{t.l}</span></button>)}</div>};

  return <div style={AS}><style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{background:#0A0A0F;overflow-x:hidden}input:focus{outline:none}button:active{transform:scale(.97)}@keyframes xpFloat{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-120%) scale(1.3)}}@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes scanLine{0%{top:15%;opacity:0}50%{opacity:1}100%{top:85%;opacity:0}}::-webkit-scrollbar{display:none}`}</style>
    <div style={G1}/><div style={G2}/>
    {tab==="home"&&<Home/>}{tab==="explore"&&<Explore/>}{tab==="challenges"&&<Challenges/>}{tab==="stats"&&<Stats/>}{tab==="wo"&&<Workout/>}{tab==="ft"&&<FTest/>}{tab==="food"&&<Food/>}{tab==="activity"&&<Activity/>}
    <Nav/><Popup/>
    {xpa&&<div style={{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%,-50%)",zIndex:200,animation:"xpFloat 2s ease-out forwards",pointerEvents:"none"}}><div style={{fontSize:32,fontWeight:900,color:"#FF6B35",textShadow:"0 0 30px #FF6B3560"}}>+{xpa} XP</div></div>}
  </div>
}

const AS={width:"100%",maxWidth:430,margin:"0 auto",minHeight:"100vh",background:"#0A0A0F",color:"#EAEAEA",fontFamily:"'Outfit',sans-serif",position:"relative",overflow:"hidden"};
const G1={position:"fixed",top:-200,right:-200,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0};
const G2={position:"fixed",bottom:-150,left:-150,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(233,69,96,.05) 0%,transparent 70%)",pointerEvents:"none",zIndex:0};
const BP={background:"linear-gradient(135deg,#FF6B35,#E94560)",border:"none",borderRadius:14,padding:"13px 24px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all .2s"};
const BS={background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:14,padding:"13px 24px",color:"#aaa",fontSize:15,fontWeight:600,cursor:"pointer"};
const BB={background:"none",border:"none",color:"#888",fontSize:14,cursor:"pointer",padding:"4px 0"};
const IS={background:"#1A1A2E",border:"1px solid #ffffff15",borderRadius:12,padding:"12px 14px",color:"#fff",fontSize:16,fontWeight:600,width:"100%",fontFamily:"Outfit,sans-serif"};
const OS={display:"flex",flexDirection:"column",justifyContent:"center",minHeight:"100vh",padding:32};
const OL={fontSize:20,fontWeight:700,color:"#fff",marginBottom:18};
const CB={border:"1px solid #ffffff15",borderRadius:14,padding:"13px 18px",fontSize:15,fontWeight:600,cursor:"pointer",marginBottom:8,width:"100%",textAlign:"left"};
const SP={background:"#1A1A2E",borderRadius:10,padding:"5px 10px",display:"flex",alignItems:"center",gap:4};
const MC={background:"#12121A",borderRadius:14,padding:"10px 8px",textAlign:"center",border:"1px solid #ffffff08",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer"};
const WR={width:"100%",background:"#12121A",border:"1px solid #ffffff08",borderRadius:14,padding:14,marginBottom:8,cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"};
const WC={background:"#12121A",border:"1px solid #ffffff08",borderRadius:14,padding:12,cursor:"pointer",textAlign:"left"};
const SB={background:"#00000060",border:"none",borderRadius:50,width:42,height:42,color:"#fff",fontSize:16,cursor:"pointer"};
