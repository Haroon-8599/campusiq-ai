import { PrismaClient, Role, BookmarkCollection } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const STATES_DATA = [
  { name: "Delhi", code: "DL", cities: ["New Delhi", "North Delhi", "South Delhi"] },
  { name: "Maharashtra", code: "MH", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"] },
  { name: "Karnataka", code: "KA", cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"] },
  { name: "Tamil Nadu", code: "TN", cities: ["Chennai", "Coimbatore", "Tiruchirappalli", "Madurai", "Salem"] },
  { name: "Telangana", code: "TS", cities: ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad"] },
  { name: "Uttar Pradesh", code: "UP", cities: ["Kanpur", "Varanasi", "Lucknow", "Noida", "Prayagraj", "Ghaziabad"] },
  { name: "West Bengal", code: "WB", cities: ["Kolkata", "Kharagpur", "Durgapur", "Siliguri", "Howrah"] },
  { name: "Rajasthan", code: "RJ", cities: ["Jaipur", "Pilani", "Jodhpur", "Kota", "Udaipur"] },
  { name: "Gujarat", code: "GJ", cities: ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara", "Rajkot"] },
  { name: "Kerala", code: "KL", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"] },
  { name: "Madhya Pradesh", code: "MP", cities: ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain"] },
  { name: "Punjab", code: "PB", cities: ["Chandigarh", "Mohali", "Patiala", "Jalandhar", "Amritsar"] },
  { name: "Haryana", code: "HR", cities: ["Gurugram", "Faridabad", "Rohtak", "Kurukshetra", "Panipat"] },
  { name: "Uttarakhand", code: "UK", cities: ["Roorkee", "Dehradun", "Pantnagar", "Haldwani"] },
  { name: "Bihar", code: "BR", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"] },
  { name: "Odisha", code: "OD", cities: ["Bhubaneswar", "Rourkela", "Cuttack", "Sambalpur"] },
  { name: "Andhra Pradesh", code: "AP", cities: ["Visakhapatnam", "Tirupati", "Vijayawada", "Guntur"] },
  { name: "Assam", code: "AS", cities: ["Guwahati", "Silchar", "Dibrugarh", "Tezpur"] },
  { name: "Himachal Pradesh", code: "HP", cities: ["Mandi", "Shimla", "Hamirpur", "Dharamshala"] },
  { name: "Jharkhand", code: "JH", cities: ["Ranchi", "Dhanbad", "Jamshedpur", "Bokaro"] },
  { name: "Goa", code: "GA", cities: ["Panaji", "Vasco da Gama", "Margao", "Ponda"] },
  { name: "Chhattisgarh", code: "CG", cities: ["Raipur", "Bilaspur", "Bhilai", "Durg"] },
];

const RECRUITERS_DATA = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", tier: "Tier 1" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", tier: "Tier 1" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", tier: "Tier 1" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", tier: "Tier 1" },
  { name: "Nvidia", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg", tier: "Tier 1" },
  { name: "Goldman Sachs", logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg", tier: "Tier 1" },
  { name: "McKinsey & Company", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/McKinsey_and_Company_Mark.svg", tier: "Tier 1" },
  { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png", tier: "Tier 1" },
  { name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png", tier: "Tier 1" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg", tier: "Tier 1" },
  { name: "Qualcomm", logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Qualcomm_logo.svg", tier: "Tier 1" },
  { name: "Morgan Stanley", logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Morgan_Stanley_Logo_1.svg", tier: "Tier 1" },
  { name: "Atlassian", logo: "https://upload.wikimedia.org/wikipedia/commons/0/01/Atlassian_logo.svg", tier: "Tier 1" },
  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg", tier: "Tier 1" },
  { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg", tier: "Tier 2" },
  { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg", tier: "Tier 2" },
  { name: "Samsung R&D", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", tier: "Tier 2" },
  { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg", tier: "Tier 2" },
  { name: "PwC", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg", tier: "Tier 2" },
  { name: "Flipkart", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg", tier: "Tier 2" },
  { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg", tier: "Tier 2" },
  { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg", tier: "Tier 3" },
  { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", tier: "Tier 3" },
  { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg", tier: "Tier 3" },
  { name: "Cognizant", logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg", tier: "Tier 3" },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg", tier: "Tier 3" }
];

const PREMIER_COLLEGES = [
  { name: "Indian Institute of Technology Bombay", shortName: "IIT Bombay", slug: "iit-bombay", state: "Maharashtra", city: "Mumbai", type: "IIT", ownership: "Public", nirf: 3, naac: "A++", est: 1958, size: 550, feesMin: 220000, feesMax: 250000, avgPkg: 23.5, highPkg: 168.0, rate: 98, rating: 4.9 },
  { name: "Indian Institute of Technology Delhi", shortName: "IIT Delhi", slug: "iit-delhi", state: "Delhi", city: "New Delhi", type: "IIT", ownership: "Public", nirf: 2, naac: "A++", est: 1961, size: 325, feesMin: 225000, feesMax: 260000, avgPkg: 25.8, highPkg: 200.0, rate: 97.5, rating: 4.9 },
  { name: "Indian Institute of Technology Madras", shortName: "IIT Madras", slug: "iit-madras", state: "Tamil Nadu", city: "Chennai", type: "IIT", ownership: "Public", nirf: 1, naac: "A++", est: 1959, size: 620, feesMin: 215000, feesMax: 245000, avgPkg: 22.8, highPkg: 132.0, rate: 96.8, rating: 4.95 },
  { name: "Indian Institute of Technology Kanpur", shortName: "IIT Kanpur", slug: "iit-kanpur", state: "Uttar Pradesh", city: "Kanpur", type: "IIT", ownership: "Public", nirf: 4, naac: "A++", est: 1959, size: 1055, feesMin: 220000, feesMax: 250000, avgPkg: 21.6, highPkg: 147.0, rate: 96.2, rating: 4.88 },
  { name: "Indian Institute of Technology Kharagpur", shortName: "IIT Kharagpur", slug: "iit-kharagpur", state: "West Bengal", city: "Kharagpur", type: "IIT", ownership: "Public", nirf: 5, naac: "A++", est: 1951, size: 2100, feesMin: 210000, feesMax: 240000, avgPkg: 20.9, highPkg: 135.0, rate: 95.8, rating: 4.85 },
  { name: "Indian Institute of Technology Roorkee", shortName: "IIT Roorkee", slug: "iit-roorkee", state: "Uttarakhand", city: "Roorkee", type: "IIT", ownership: "Public", nirf: 6, naac: "A++", est: 1847, size: 365, feesMin: 215000, feesMax: 245000, avgPkg: 19.8, highPkg: 130.0, rate: 95.1, rating: 4.82 },
  { name: "Indian Institute of Technology Guwahati", shortName: "IIT Guwahati", slug: "iit-guwahati", state: "Assam", city: "Guwahati", type: "IIT", ownership: "Public", nirf: 7, naac: "A++", est: 1994, size: 700, feesMin: 210000, feesMax: 240000, avgPkg: 19.2, highPkg: 120.0, rate: 94.7, rating: 4.80 },
  { name: "Indian Institute of Technology Hyderabad", shortName: "IIT Hyderabad", slug: "iit-hyderabad", state: "Telangana", city: "Hyderabad", type: "IIT", ownership: "Public", nirf: 8, naac: "A++", est: 2008, size: 576, feesMin: 220000, feesMax: 250000, avgPkg: 20.4, highPkg: 125.0, rate: 95.0, rating: 4.83 },
  { name: "National Institute of Technology Tiruchirappalli", shortName: "NIT Trichy", slug: "nit-trichy", state: "Tamil Nadu", city: "Tiruchirappalli", type: "NIT", ownership: "Public", nirf: 9, naac: "A++", est: 1964, size: 800, feesMin: 145000, feesMax: 175000, avgPkg: 15.6, highPkg: 52.8, rate: 93.4, rating: 4.75 },
  { name: "National Institute of Technology Karnataka, Surathkal", shortName: "NIT Surathkal", slug: "nit-surathkal", state: "Karnataka", city: "Mangaluru", type: "NIT", ownership: "Public", nirf: 12, naac: "A++", est: 1960, size: 295, feesMin: 150000, feesMax: 180000, avgPkg: 16.2, highPkg: 54.0, rate: 94.1, rating: 4.78 },
  { name: "National Institute of Technology Rourkela", shortName: "NIT Rourkela", slug: "nit-rourkela", state: "Odisha", city: "Rourkela", type: "NIT", ownership: "Public", nirf: 16, naac: "A++", est: 1961, size: 647, feesMin: 140000, feesMax: 170000, avgPkg: 14.8, highPkg: 48.0, rate: 92.5, rating: 4.70 },
  { name: "National Institute of Technology Warangal", shortName: "NIT Warangal", slug: "nit-warangal", state: "Telangana", city: "Warangal", type: "NIT", ownership: "Public", nirf: 21, naac: "A++", est: 1959, size: 256, feesMin: 145000, feesMax: 175000, avgPkg: 15.1, highPkg: 50.0, rate: 93.0, rating: 4.72 },
  { name: "Birla Institute of Technology and Science, Pilani", shortName: "BITS Pilani", slug: "bits-pilani", state: "Rajasthan", city: "Pilani", type: "BITS", ownership: "Private", nirf: 25, naac: "A", est: 1964, size: 328, feesMin: 490000, feesMax: 540000, avgPkg: 20.7, highPkg: 60.7, rate: 96.5, rating: 4.86 },
  { name: "BITS Pilani, Goa Campus", shortName: "BITS Goa", slug: "bits-goa", state: "Goa", city: "Vasco da Gama", type: "BITS", ownership: "Private", nirf: 30, naac: "A", est: 2004, size: 180, feesMin: 490000, feesMax: 540000, avgPkg: 19.5, highPkg: 58.0, rate: 95.8, rating: 4.82 },
  { name: "BITS Pilani, Hyderabad Campus", shortName: "BITS Hyderabad", slug: "bits-hyderabad", state: "Telangana", city: "Hyderabad", type: "BITS", ownership: "Private", nirf: 32, naac: "A", est: 2008, size: 200, feesMin: 490000, feesMax: 540000, avgPkg: 19.1, highPkg: 57.0, rate: 95.2, rating: 4.80 },
  { name: "International Institute of Information Technology, Hyderabad", shortName: "IIIT Hyderabad", slug: "iiit-hyderabad", state: "Telangana", city: "Hyderabad", type: "IIIT", ownership: "Private", nirf: 55, naac: "A++", est: 1998, size: 66, feesMin: 380000, feesMax: 420000, avgPkg: 32.0, highPkg: 102.0, rate: 99.0, rating: 4.92 },
  { name: "International Institute of Information Technology, Bangalore", shortName: "IIIT Bangalore", slug: "iiit-bangalore", state: "Karnataka", city: "Bengaluru", type: "IIIT", ownership: "Private", nirf: 74, naac: "A+", est: 1999, size: 9, feesMin: 360000, feesMax: 400000, avgPkg: 26.5, highPkg: 65.0, rate: 98.0, rating: 4.85 },
  { name: "Indraprastha Institute of Information Technology Delhi", shortName: "IIIT Delhi", slug: "iiit-delhi", state: "Delhi", city: "New Delhi", type: "IIIT", ownership: "State", nirf: 63, naac: "A", est: 2008, size: 25, feesMin: 400000, feesMax: 450000, avgPkg: 23.7, highPkg: 51.3, rate: 97.0, rating: 4.81 },
  { name: "Delhi Technological University", shortName: "DTU", slug: "delhi-technological-university", state: "Delhi", city: "New Delhi", type: "State", ownership: "State", nirf: 29, naac: "A", est: 1941, size: 164, feesMin: 190000, feesMax: 220000, avgPkg: 15.3, highPkg: 82.0, rate: 92.0, rating: 4.65 },
  { name: "Netaji Subhas University of Technology", shortName: "NSUT", slug: "nsut-delhi", state: "Delhi", city: "New Delhi", type: "State", ownership: "State", nirf: 60, naac: "A", est: 1983, size: 145, feesMin: 185000, feesMax: 215000, avgPkg: 14.8, highPkg: 75.0, rate: 91.5, rating: 4.62 },
  { name: "College of Engineering, Pune", shortName: "COEP", slug: "coep-pune", state: "Maharashtra", city: "Pune", type: "State", ownership: "State", nirf: 73, naac: "A+", est: 1854, size: 36, feesMin: 110000, feesMax: 140000, avgPkg: 11.2, highPkg: 50.5, rate: 90.5, rating: 4.58 },
  { name: "Veermata Jijabai Technological Institute", shortName: "VJTI Mumbai", slug: "vjti-mumbai", state: "Maharashtra", city: "Mumbai", type: "State", ownership: "State", nirf: 82, naac: "A+", est: 1887, size: 16, feesMin: 95000, feesMax: 125000, avgPkg: 11.8, highPkg: 62.0, rate: 91.2, rating: 4.60 },
  { name: "RV College of Engineering", shortName: "RVCE Bangalore", slug: "rvce-bangalore", state: "Karnataka", city: "Bengaluru", type: "Private", ownership: "Private", nirf: 96, naac: "A++", est: 1963, size: 52, feesMin: 280000, feesMax: 350000, avgPkg: 12.5, highPkg: 64.0, rate: 93.0, rating: 4.68 },
  { name: "Vellore Institute of Technology", shortName: "VIT Vellore", slug: "vit-vellore", state: "Tamil Nadu", city: "Salem", type: "Private", ownership: "Private", nirf: 11, naac: "A++", est: 1984, size: 372, feesMin: 320000, feesMax: 490000, avgPkg: 9.8, highPkg: 102.0, rate: 89.5, rating: 4.55 },
  { name: "Thapar Institute of Engineering & Technology", shortName: "Thapar University", slug: "thapar-patiala", state: "Punjab", city: "Patiala", type: "Private", ownership: "Private", nirf: 20, naac: "A+", est: 1956, size: 250, feesMin: 390000, feesMax: 460000, avgPkg: 11.5, highPkg: 45.0, rate: 91.0, rating: 4.62 },
  { name: "Manipal Institute of Technology", shortName: "MIT Manipal", slug: "mit-manipal", state: "Karnataka", city: "Mangaluru", type: "Private", ownership: "Private", nirf: 61, naac: "A++", est: 1957, size: 313, feesMin: 385000, feesMax: 480000, avgPkg: 10.8, highPkg: 54.0, rate: 90.0, rating: 4.58 }
];

const COLLEGE_NAME_PREFIXES = [
  "National Institute of Technology",
  "Indian Institute of Information Technology",
  "State University College of Engineering",
  "Govt. Engineering College",
  "Institute of Technology & Science",
  "Dr. APJ Abdul Kalam Institute of Technology",
  "Sardar Patel Institute of Technology",
  "Swami Vivekananda Engineering College",
  "Maharaja Agrasen Institute of Technology",
  "Birla Institute of Applied Sciences",
  "St. Xavier's Institute of Engineering",
  "Aryabhatta Institute of Technology",
  "CV Raman Global University",
  "Techno India Institute of Engineering",
  "Jaypee Institute of Information Technology",
  "BMS College of Engineering",
  "PES University Faculty of Engineering",
  "Kalinga Institute of Industrial Technology",
  "Amrita School of Engineering",
  "SRM Institute of Science and Technology"
];

const COLLEGE_NAME_SUFFIXES = [
  "Campus of Excellence",
  "School of Computing & AI",
  "Institute of Advanced Research",
  "Center for Digital Innovation",
  "Academy of Engineering",
  "College of Engineering & Sciences",
  "Polytechnic & Research Campus",
  "Institute of Modern Technology",
  "School of Applied Sciences",
  "Faculty of Applied Engineering"
];

const DEGREES_DATA = [
  { degree: "B.Tech", duration: 4, exam: "JEE Main", branches: ["Computer Science and Engineering", "Artificial Intelligence & Data Science", "Electronics and Communication", "Electrical and Electronics", "Mechanical Engineering", "Civil Engineering", "Biotechnology", "Information Technology"] },
  { degree: "M.Tech", duration: 2, exam: "GATE", branches: ["Computer Science", "VLSI Design", "Data Analytics", "Structural Engineering"] },
  { degree: "MBA", duration: 2, exam: "CAT", branches: ["Finance", "Marketing", "Business Analytics", "Operations & Supply Chain"] },
  { degree: "B.Sc", duration: 3, exam: "CUET", branches: ["Data Science", "Physics", "Computer Applications", "Mathematics"] }
];

async function main() {
  console.log("🚀 Starting comprehensive database seed for CampusIQ AI...");

  // 1. Clean existing records in sequence
  await prisma.recentlyViewed.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.review.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.collegeRecruiter.deleteMany();
  await prisma.recruiter.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.city.deleteMany();
  await prisma.state.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleared existing database tables.");

  // 2. Seed Default Users
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const studentHashed = await bcrypt.hash("student123", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "CampusIQ Staff Admin",
      email: "admin@campusiq.ai",
      password: hashedPassword,
      role: Role.ADMIN,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      bio: "Chief Academic Officer & Platform Moderator at CampusIQ AI."
    }
  });

  const studentUser = await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "student@campusiq.ai",
      password: studentHashed,
      role: Role.STUDENT,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      bio: "Aspiring software engineer preparing for JEE Advanced & Bitsat.",
      graduationYear: 2028,
      profile: {
        create: {
          tenthPercentage: 96.4,
          twelfthPercentage: 94.8,
          category: "General",
          gender: "Male",
          homeState: "Maharashtra",
          budgetMax: 1500000,
          preferredExams: ["JEE Main", "JEE Advanced", "BITSAT"],
          preferredBranches: ["Computer Science and Engineering", "Artificial Intelligence & Data Science"],
          preferredStates: ["Maharashtra", "Karnataka", "Delhi", "Telangana"],
          badges: ["Early Adopter", "AI Match Pioneer", "Verified Student"]
        }
      }
    }
  });

  console.log("👤 Created Admin and Student test accounts.");

  // 3. Seed States and Cities
  const stateMap: Record<string, string> = {};
  const cityMap: Record<string, string> = {};
  const allCityIds: string[] = [];

  for (const s of STATES_DATA) {
    const createdState = await prisma.state.create({
      data: {
        name: s.name,
        code: s.code,
      }
    });
    stateMap[s.name] = createdState.id;

    for (const cityName of s.cities) {
      const createdCity = await prisma.city.create({
        data: {
          name: cityName,
          stateId: createdState.id
        }
      });
      cityMap[`${cityName}_${s.name}`] = createdCity.id;
      allCityIds.push(createdCity.id);
    }
  }
  console.log(`📍 Seeded ${STATES_DATA.length} States and ${allCityIds.length} Educational Hub Cities.`);

  // 4. Seed Recruiters
  const recruiterIds: string[] = [];
  for (const rec of RECRUITERS_DATA) {
    const created = await prisma.recruiter.create({
      data: rec
    });
    recruiterIds.push(created.id);
  }
  console.log(`💼 Seeded ${recruiterIds.length} Global Recruiters.`);

  // 5. Generate 1,020+ Colleges Programmatically
  console.log("🎓 Generating and inserting 1,000+ realistic colleges...");

  const collegesToInsert: any[] = [];
  const slugsSet = new Set<string>();

  // Add premier colleges first
  for (const p of PREMIER_COLLEGES) {
    slugsSet.add(p.slug);
    const stateId = stateMap[p.state];
    const cityId = cityMap[`${p.city}_${p.state}`];
    collegesToInsert.push({
      name: p.name,
      shortName: p.shortName,
      slug: p.slug,
      collegeType: p.type,
      ownership: p.ownership,
      establishedYear: p.est,
      campusSizeAcres: p.size,
      hostelAvailable: true,
      nirfRank: p.nirf,
      naacRating: p.naac,
      overallRating: p.rating,
      reviewCount: Math.floor(Math.random() * 450) + 120,
      feesMin: p.feesMin,
      feesMax: p.feesMax,
      avgPackageLpa: p.avgPkg,
      highestPackageLpa: p.highPkg,
      placementRate: p.rate,
      address: `Campus Avenue, ${p.city}, ${p.state}`,
      website: `https://${p.slug}.ac.in`,
      logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.shortName)}&backgroundColor=131c31,0f172a&textColor=38bdf8`,
      bannerUrl: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80`,
      overview: `${p.name} (${p.shortName}) is recognized as one of India's preeminent institutions for higher learning and technical excellence. Ranked #${p.nirf} by the National Institutional Ranking Framework (NIRF), the campus fosters ground-breaking research, world-class entrepreneurship hubs, and high-impact industry collaboration.`,
      isFeatured: true,
      stateId,
      cityId
    });
  }

  // Generate procedural realistic colleges up to 1,025
  const collegeTypes = ["IIT", "NIT", "IIIT", "Central", "State", "Private"];
  let index = PREMIER_COLLEGES.length + 1;

  while (collegesToInsert.length < 1025) {
    const randomStateObj = STATES_DATA[Math.floor(Math.random() * STATES_DATA.length)];
    const randomCity = randomStateObj.cities[Math.floor(Math.random() * randomStateObj.cities.length)];
    const prefix = COLLEGE_NAME_PREFIXES[Math.floor(Math.random() * COLLEGE_NAME_PREFIXES.length)];
    const suffix = COLLEGE_NAME_SUFFIXES[Math.floor(Math.random() * COLLEGE_NAME_SUFFIXES.length)];
    const type = collegeTypes[Math.floor(Math.random() * collegeTypes.length)];
    const ownership = type === "Private" ? "Private" : "Public";

    const fullName = `${prefix}, ${randomCity} (${suffix})`;
    let slug = `${prefix}-${randomCity}-${index}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (slugsSet.has(slug)) {
      slug = `${slug}-${index}`;
    }
    slugsSet.add(slug);

    const estYear = 1960 + Math.floor(Math.random() * 62);
    const feesMin = type === "Private" ? 220000 + Math.floor(Math.random() * 200000) : 60000 + Math.floor(Math.random() * 90000);
    const feesMax = feesMin + (type === "Private" ? 180000 + Math.floor(Math.random() * 150000) : 70000 + Math.floor(Math.random() * 50000));
    const avgPkg = Number((4.5 + Math.random() * 14.5).toFixed(1));
    const highPkg = Number((avgPkg * (1.8 + Math.random() * 2.5)).toFixed(1));
    const nirf = index <= 200 ? index : null;
    const rating = Number((3.6 + Math.random() * 1.3).toFixed(1));

    const stateId = stateMap[randomStateObj.name];
    const cityId = cityMap[`${randomCity}_${randomStateObj.name}`];

    collegesToInsert.push({
      name: fullName,
      shortName: `${prefix.split(" ").map(w => w[0]).join("")} ${randomCity}`,
      slug: slug,
      collegeType: type,
      ownership: ownership,
      establishedYear: estYear,
      campusSizeAcres: Math.floor(Math.random() * 180) + 25,
      hostelAvailable: Math.random() > 0.1,
      nirfRank: nirf,
      naacRating: rating > 4.5 ? "A++" : rating > 4.2 ? "A+" : rating > 3.9 ? "A" : "B++",
      overallRating: rating,
      reviewCount: Math.floor(Math.random() * 150) + 15,
      feesMin: feesMin,
      feesMax: feesMax,
      avgPackageLpa: avgPkg,
      highestPackageLpa: highPkg,
      placementRate: Number((75 + Math.random() * 23).toFixed(1)),
      address: `Tech Knowledge Park, ${randomCity}, ${randomStateObj.name}`,
      website: `https://${slug}.edu.in`,
      logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(randomCity + index)}&backgroundColor=0f172a,131c31&textColor=38bdf8`,
      bannerUrl: `https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80`,
      overview: `${fullName} is a premier destination offering transformative undergraduate and postgraduate technical degree programs in ${randomCity}. With cutting-edge innovation labs, active campus entrepreneurship cells, and accredited faculty, the institute prepares future leaders.`,
      isFeatured: nirf !== null && nirf <= 30,
      stateId,
      cityId
    });

    index++;
  }

  // Batch insert colleges in chunks of 100 for safety and speed
  console.log(`📦 Inserting ${collegesToInsert.length} colleges into PostgreSQL...`);
  const chunkSize = 100;
  const createdColleges: any[] = [];

  for (let i = 0; i < collegesToInsert.length; i += chunkSize) {
    const chunk = collegesToInsert.slice(i, i + chunkSize);
    for (const c of chunk) {
      const created = await prisma.college.create({
        data: c
      });
      createdColleges.push(created);
    }
    console.log(`  Inserted ${Math.min(i + chunkSize, collegesToInsert.length)} / ${collegesToInsert.length} colleges...`);
  }

  console.log(`✅ Successfully seeded ${createdColleges.length} colleges!`);

  // 6. Seed Courses, Placements, Reviews, and Recruiters
  console.log("📚 Seeding Courses, Placements, Reviews, and Recruiters for colleges...");

  let courseCount = 0;
  let placementCount = 0;

  for (let i = 0; i < createdColleges.length; i++) {
    const col = createdColleges[i];

    // Seed Courses for every college
    const collegeDegreeSet = i < 30 ? DEGREES_DATA : [DEGREES_DATA[0]]; // top colleges get B.Tech, M.Tech, MBA, B.Sc
    for (const deg of collegeDegreeSet) {
      for (const branch of deg.branches) {
        let cutoffGen = col.nirfRank ? col.nirfRank * 350 + Math.floor(Math.random() * 2000) : 15000 + Math.floor(Math.random() * 60000);
        await prisma.course.create({
          data: {
            collegeId: col.id,
            name: `${deg.degree} in ${branch}`,
            degree: deg.degree,
            branch: branch,
            durationYears: deg.duration,
            annualTuition: col.feesMin + Math.floor(Math.random() * 20000),
            seats: 60 + Math.floor(Math.random() * 60),
            cutoffGeneral: cutoffGen,
            cutoffObc: Math.floor(cutoffGen * 1.3),
            cutoffSc: Math.floor(cutoffGen * 2.2),
            cutoffSt: Math.floor(cutoffGen * 3.5),
            entranceExam: deg.exam
          }
        });
        courseCount++;
      }
    }

    // Seed Placements for top 150 colleges (and every 4th college)
    if (i < 150 || i % 4 === 0) {
      for (const year of [2024, 2023, 2022]) {
        const factor = year === 2024 ? 1.0 : year === 2023 ? 0.92 : 0.84;
        await prisma.placement.create({
          data: {
            collegeId: col.id,
            year: year,
            avgPackage: Number((col.avgPackageLpa * factor).toFixed(1)),
            medianPackage: Number((col.avgPackageLpa * factor * 0.88).toFixed(1)),
            highestPackage: Number((col.highestPackageLpa * factor).toFixed(1)),
            placementPercentage: Math.min(99, Number((col.placementRate * factor).toFixed(1))),
            totalOffers: 250 + Math.floor(Math.random() * 800),
            topSectors: ["Product Software", "FinTech", "Consulting", "Core Engineering", "Data Analytics"]
          }
        });
        placementCount++;
      }
    }

    // Link Recruiters (4-8 per college for first 100 colleges)
    if (i < 100) {
      const selectedRecruiters = recruiterIds.slice(0, 4 + (i % 6));
      for (const rId of selectedRecruiters) {
        await prisma.collegeRecruiter.create({
          data: {
            collegeId: col.id,
            recruiterId: rId
          }
        });
      }

      // Seed Reviews
      await prisma.review.create({
        data: {
          collegeId: col.id,
          userId: studentUser.id,
          rating: col.overallRating,
          academicRating: Math.min(5, col.overallRating + 0.1),
          infrastructureRating: Math.min(5, col.overallRating - 0.1),
          campusLifeRating: Math.min(5, col.overallRating),
          placementRating: Math.min(5, col.overallRating + 0.2),
          title: `Incredible exposure, brilliant peers, and world-class faculty at ${col.shortName}`,
          pros: "Outstanding coding culture, top tech companies visit campus annually, generous research grants, vibrant cultural fests.",
          cons: "Academic grading can be demanding and rigorous during midterms.",
          verified: true,
          helpfulCount: Math.floor(Math.random() * 45) + 10
        }
      });

      // Seed Scholarships
      await prisma.scholarship.create({
        data: {
          collegeId: col.id,
          title: "Merit-cum-Means Excellence Scholarship",
          amount: "100% Tuition Waiver + Living Stipend",
          eligibilityCriteria: "Family income under 5 LPA and top 10% batch academic percentile.",
          deadline: "October 15, 2026"
        }
      });
      await prisma.scholarship.create({
        data: {
          collegeId: col.id,
          title: "Women in STEM Innovation Grant",
          amount: "₹1,20,000 / year",
          eligibilityCriteria: "Female students enrolled in computing, robotics, or engineering fields.",
          deadline: "November 30, 2026"
        }
      });
    }
  }

  console.log(`✅ Seeded ${courseCount} courses across colleges.`);
  console.log(`✅ Seeded ${placementCount} historical placement records.`);

  // 7. Seed Initial Student Bookmarks
  const topThree = createdColleges.slice(0, 3);
  for (const c of topThree) {
    await prisma.bookmark.create({
      data: {
        userId: studentUser.id,
        collegeId: c.id,
        collection: BookmarkCollection.DREAM,
        notes: "Targeting CSE branch. Need JEE Advanced rank under 500."
      }
    });
  }

  // 8. Seed Community Questions & Answers
  const q1 = await prisma.question.create({
    data: {
      userId: studentUser.id,
      collegeId: createdColleges[0].id,
      title: "How does the branch change policy work at IIT Bombay for CSE/EE?",
      content: "I want to understand the minimum SPI / CGPA required in the first year to switch to Computer Science or Electrical Engineering, and how competitive the cutoffs are.",
      tags: ["IIT Bombay", "Branch Change", "Academics", "CSE"],
      views: 420,
      upvotes: 38
    }
  });

  await prisma.answer.create({
    data: {
      questionId: q1.id,
      userId: adminUser.id,
      content: "Branch change requires being in the top batch percentile with typically a CGPA of 9.8+ for CSE and 9.5+ for EE. Note that seats are strictly capped at 10% of total sanctioned strength.",
      upvotes: 24,
      isAccepted: true
    }
  });

  const q2 = await prisma.question.create({
    data: {
      userId: studentUser.id,
      collegeId: createdColleges[8].id,
      title: "Is NIT Trichy CSE comparable to newer IITs for software placements?",
      content: "Comparing NIT Trichy Computer Science with newer generation IITs (IIT Mandi, IIT Ropar). How do placement opportunities and internship stipends compare?",
      tags: ["NIT Trichy", "Placements", "CSE", "Comparison"],
      views: 650,
      upvotes: 52
    }
  });

  await prisma.answer.create({
    data: {
      questionId: q2.id,
      userId: adminUser.id,
      content: "Yes, NIT Trichy CSE has an extraordinary alumni network and 50+ year legacy. Top algorithmic trading firms and Silicon Valley tech giants recruit actively with average CSE CTC exceeding 24 LPA.",
      upvotes: 31,
      isAccepted: true
    }
  });

  console.log("💬 Seeded Community discussions and verified answers.");
  console.log("🎉 Database seeding completed successfully with 1,000+ realistic colleges!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
