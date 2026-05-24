// app.js
// Core Engine for Kanpur Heritage International School Website

// ── STATE MANAGEMENT & SEEDING ──
let state = {
  settings: {},
  notices: [],
  events: [],
  albums: [],
  achievements: [],
  applications: []
};

const defaultLocale = 'en';
let currentLocale = localStorage.getItem('khis_locale') || defaultLocale;
let adminSession = JSON.parse(sessionStorage.getItem('khis_admin_session')) || null;
let adminRole = adminSession ? adminSession.role : 'Super Admin';
let activeNoticeFilter = 'all';
let activeGalleryFilter = 'all';
let currentCalendarDate = new Date(2026, 5, 1); // Seed to June 2026 as per mock events
let admissionsWizardStep = 1;
let uploadedDocuments = {}; // docName -> filename

// Initialize State from LocalStorage or mockData
function initializeState() {
  const localData = localStorage.getItem('khis_database');
  if (localData) {
    state = JSON.parse(localData);
  } else {
    // Clone from mockData.js (initialMockData)
    state = JSON.parse(JSON.stringify(initialMockData));
    saveState();
  }
}

function saveState() {
  localStorage.setItem('khis_database', JSON.stringify(state));
}

// ── BILINGUAL TRANSLATION DICTIONARY ──
const translationDictionary = {
  // Navigation
  nav_home: { en: "Home", hi: "मुख्य पृष्ठ" },
  nav_about: { en: "About Us", hi: "हमारे बारे में" },
  nav_academics: { en: "Academics", hi: "अकादमिक" },
  nav_activities: { en: "Activities", hi: "गतिविधियाँ" },
  nav_gallery: { en: "Media Gallery", hi: "मीडिया गैलरी" },
  nav_notices: { en: "Notices", hi: "सूचनाएं" },
  nav_achievements: { en: "Achievements", hi: "उपलब्धियां" },
  nav_contact: { en: "Contact", hi: "संपर्क करें" },
  nav_apply: { en: "Apply Now", hi: "आवेदन करें" },
  nav_admin: { en: "Admin Portal", hi: "एडमिन पोर्टल" },

  // Admin Sidebar & Dashboard Overview translations
  admin_overview_title: { en: "CMS Dashboard Overview", hi: "सीएमएस डैशबोर्ड अवलोकन" },
  admin_stat_apps: { en: "Total Applications", hi: "कुल आवेदन" },
  admin_stat_notices: { en: "Active Notices", hi: "सक्रिय सूचनाएं" },
  admin_stat_events: { en: "Calendar Events", hi: "कैलेंडर कार्यक्रम" },
  admin_stat_albums: { en: "Gallery Albums", hi: "गैलरी एलबम" },
  admin_control_title: { en: "Admissions Open/Closed Control", hi: "प्रवेश खुला/बंद नियंत्रण" },
  admin_control_desc: { en: "Toggle the master state of the admissions page and form wizard instantly.", hi: "तुरंत प्रवेश पृष्ठ और फॉर्म विज़ार्ड की मुख्य स्थिति को टॉगल करें।" },
  admin_tier_title: { en: "Administrative Tier Selector (Simulated role switching)", hi: "प्रशासनिक स्तर चयनकर्ता (सिम्युलेटेड भूमिका स्विचिंग)" },
  admin_tier_note: { en: "* Note: Content Editors are restricted from changing Site Settings or database toggles.", hi: "* नोट: सामग्री संपादकों को साइट सेटिंग्स या डेटाबेस टॉगल बदलने से प्रतिबंधित किया गया है।" },
  admin_nav_overview: { en: "Overview", hi: "अवलोकन" },
  admin_nav_notices: { en: "Manage Notices", hi: "सूचनाएं प्रबंधित करें" },
  admin_nav_events: { en: "Manage Events", hi: "कार्यक्रम प्रबंधित करें" },
  admin_nav_apps: { en: "Admissions Form", hi: "प्रवेश फॉर्म" },
  admin_nav_students: { en: "Student Logs", hi: "छात्र लॉग" },
  admin_nav_fees: { en: "Manage Fees", hi: "शुल्क प्रबंधित करें" },
  admin_nav_media: { en: "Media Manager", hi: "मीडिया मैनेजर" },
  admin_nav_faculty: { en: "Manage Faculty", hi: "संकाय प्रबंधित करें" },
  admin_nav_settings: { en: "Site Settings", hi: "साइट सेटिंग्स" },
  admin_nav_logout: { en: "Logout", hi: "लॉगआउट" },

  // Brand Headers
  school_name: { en: "Kanpur Heritage", hi: "कानपुर हेरिटेज" },
  school_sub: { en: "International School", hi: "इंटरनेशनल स्कूल" },
  ticker_title: { en: "Latest Updates", hi: "नवीनतम समाचार" },

  // YouTube Video Carousel
  yt_title: { en: "KHIS TV & Video Gallery", hi: "केएचआईएस टीवी और वीडियो गैलरी" },
  yt_subtitle: { en: "Take a virtual walk through our campus, events, and modern learning facilities.", hi: "हमारे परिसर, कार्यक्रमों और आधुनिक शिक्षण सुविधाओं का एक आभासी दौरा करें।" },
  yt_v1_title: { en: "Official School Campus Tour", hi: "आधिकारिक स्कूल कैंपस टूर" },
  yt_v1_desc: { en: "Explore our top-tier academic blocks, hostels, and learning zones.", hi: "हमारे शीर्ष स्तर के शैक्षणिक ब्लॉक, हॉस्टल और शिक्षण क्षेत्रों का अन्वेषण करें।" },
  yt_v2_title: { en: "Premium Hostel & Boarding Tour", hi: "प्रीमियम हॉस्टल और बोर्डिंग टूर" },
  yt_v2_desc: { en: "A look inside our safe, comfortable, and collaborative student housing.", hi: "हमारे सुरक्षित, आरामदायक और सहयोगात्मक छात्र आवास का एक आंतरिक दृश्य।" },
  yt_v3_title: { en: "GPS Smart Bus System", hi: "जीपीएस स्मार्ट बस प्रणाली" },
  yt_v3_desc: { en: "Discover our modern, secured, and comfortable bus fleet.", hi: "हमारे आधुनिक, सुरक्षित और आरामदायक बस बेड़े की खोज करें।" },
  yt_v4_title: { en: "Advanced Science & STEM Labs", hi: "उन्नत विज्ञान और एसटीईएम प्रयोगशालाएं" },
  yt_v4_desc: { en: "Witness scientific learning models and research laboratories in action.", hi: "वैज्ञानिक शिक्षण मॉडल और अनुसंधान प्रयोगशालाओं को व्यावहारिक रूप से देखें।" },
  yt_v5_title: { en: "Smart Digital Library Tour", hi: "स्मार्ट डिजिटल लाइब्रेरी टूर" },
  yt_v5_desc: { en: "A walkthrough of our reading sections and massive digital archive.", hi: "हमारे पठन अनुभागों और विशाल डिजिटल संग्रह का एक दौरा।" },

  theme_light: { en: "Light", hi: "लाइट" },
  theme_dark: { en: "Dark", hi: "डार्क" },
  theme_system: { en: "System", hi: "सिस्टम" },

  // Hero Section
  hero_apply_btn: { en: "Apply Online", hi: "ऑनलाइन आवेदन" },
  hero_explore_btn: { en: "Explore Campus", hi: "कैंपस देखें" },
  hero_badge_title: { en: "No. 1 School", hi: "नंबर 1 स्कूल" },
  hero_badge_sub: { en: "Kanpur Region", hi: "कानपुर क्षेत्र" },

  // Stats
  stat_years: { en: "Years of Legacy", hi: "वर्षों की विरासत" },
  stat_students: { en: "Active Students", hi: "सक्रिय छात्र" },
  stat_teachers: { en: "Expert Teachers", hi: "अनुभवी शिक्षक" },
  stat_results: { en: "CBSE Success", hi: "सीबीएसई सफलता" },

  // Principal Message Section
  home_principal_title: { en: "Principal's Message", hi: "प्राचार्या का संदेश" },
  btn_read_more: { en: "Read More", hi: "और पढ़ें" },
  home_why_title: { en: "At a Glance", hi: "एक नज़र में" },

  // Why KHIS blocks
  home_why_1_title: { en: "Top Academics & CBSE Curriculum", hi: "सर्वश्रेष्ठ अकादमिक एवं सीबीएसई पाठ्यक्रम" },
  home_why_1_desc: { en: "Structured academic plan designed for deep conceptual understanding.", hi: "गहन वैचारिक समझ के लिए डिज़ाइन की गई संरचित शैक्षणिक योजना।" },
  home_why_2_title: { en: "Holistic Co-curricular Focus", hi: "समग्र सह-पाठ्यक्रम फोकस" },
  home_why_2_desc: { en: "Comprehensive sports complexes, cultural societies, and robotics.", hi: "व्यापक खेल परिसर, सांस्कृतिक समितियाँ और रोबोटिक्स क्लब।" },
  home_why_3_title: { en: "Safe & Modern Infrastructure", hi: "सुरक्षित एवं आधुनिक बुनियादी ढांचा" },
  home_why_3_desc: { en: "24/7 smart surveillance, AC classrooms, and smart transport GPS buses.", hi: "24/7 स्मार्ट निगरानी, एसी कक्षाएं और स्मार्ट जीपीएस बसें।" },

  // About Page
  about_heading: { en: "About Our School", hi: "हमारे स्कूल के बारे में" },
  about_subheading: { en: "Founded on values, driven by innovation, built for academic excellence.", hi: "मूल्यों पर आधारित, नवाचार से प्रेरित, शैक्षणिक उत्कृष्टता के लिए निर्मित।" },
  about_history_title: { en: "Our History", hi: "हमारा इतिहास" },
  about_history_p1: { 
    en: "Established in 2001, Kanpur Heritage International School was born out of a vision to provide standard quality education to the children of Kanpur. Over the past two and a half decades, we have evolved into a leading educational landmark, nurturing young minds to excel globally.",
    hi: "2001 में स्थापित, कानपुर हेरिटेज इंटरनेशनल स्कूल का जन्म कानपुर के बच्चों को विश्वस्तरीय गुणवत्तापूर्ण शिक्षा प्रदान करने के दृष्टिकोण से हुआ था। पिछले ढाई दशकों में, हम वैश्विक स्तर पर उत्कृष्टता प्राप्त करने के लिए युवा दिमागों को पोषित करते हुए एक अग्रणी शैक्षिक मील के पत्थर के रूप में विकसित हुए हैं।"
  },
  about_history_p2: {
    en: "Our campus covers 5 acres of green, student-friendly landscape designed to stimulate creativity, discovery, and sportsmanship. We maintain an optimal student-teacher ratio to ensure individualized feedback and progress.",
    hi: "हमारा परिसर 5 एकड़ के हरे-भरे, छात्र-अनुकूल परिदृश्य में फैला हुआ है जिसे रचनात्मकता, खोज और खेल भावना को बढ़ावा देने के लिए डिज़ाइन किया गया है। हम व्यक्तिगत प्रतिक्रिया और प्रगति सुनिश्चित करने के लिए एक इष्टतम छात्र-शिक्षक अनुपात बनाए रखते हैं।"
  },
  about_vision_title: { en: "Vision & Mission", hi: "दृष्टिकोण और मिशन" },
  about_vision_label: { en: "Vision Statement", hi: "दृष्टिकोण वाक्य" },
  about_vision_p: { en: "To be a pioneer in global education, cultivating moral leaders and responsible citizens.", hi: "वैश्विक शिक्षा में अग्रणी बनना, नैतिक नेताओं और जिम्मेदार नागरिकों को तैयार करना।" },
  about_mission_label: { en: "Mission Statement", hi: "मिशन वाक्य" },
  about_mission_p: { en: "To deliver an integrated, experiential CBSE curriculum, ensuring state-of-the-art facilities.", hi: "अत्याधुनिक सुविधाओं को सुनिश्चित करते हुए एक एकीकृत, अनुभवात्मक सीबीएसई पाठ्यक्रम प्रदान करना।" },
  about_principal_title: { en: "Principal's Address in Full", hi: "प्राचार्या का संपूर्ण संबोधन" },

  // Academics Page
  academics_heading: { en: "Academics at KHIS", hi: "केएचआईएस में अकादमिक" },
  academics_subheading: { en: "We follow a balanced CBSE-aligned academic framework that prioritizes deep thinking.", hi: "हम एक संतुलित सीबीएसई-संरेखित शैक्षणिक ढांचे का पालन करते हैं जो गहन सोच को प्राथमिकता देता है।" },
  acad_curr_title: { en: "Curriculum Structure", hi: "पाठ्यक्रम संरचना" },
  acad_curr_1_title: { en: "Pre-Primary (Nursery - Prep)", hi: "पूर्व-प्राथमिक (नursery - prep)" },
  acad_curr_1_desc: { en: "Play-way and theme-based cognitive development, focusing on motor skills and sensory activities.", hi: "खेल-कूद और थीम-आधारित संज्ञानात्मक विकास, मोटर कौशल और संवेदी गतिविधियों पर ध्यान केंद्रित करना।" },
  acad_curr_2_title: { en: "Primary School (Grades I - V)", hi: "प्राथमिक स्कूल (कक्षा I - V)" },
  acad_curr_2_desc: { en: "Foundational skills in Mathematics, Sciences, English & Hindi, and environmental studies.", hi: "गणित, विज्ञान, अंग्रेजी और हिंदी, और पर्यावरण अध्ययन में बुनियादी कौशल विकास।" },
  acad_curr_3_title: { en: "Middle School (Grades VI - X)", hi: "माध्यमिक स्कूल (कक्षा VI - X)" },
  acad_curr_3_desc: { en: "Experiential labs, language proficiency, computing concepts, coding, and analytical tools.", hi: "अनुभवात्मक प्रयोगशालाएं, भाषा दक्षता, कंप्यूटिंग अवधारणाएं, कोडिंग और विश्लेषणात्मक उपकरण।" },
  acad_curr_4_title: { en: "Senior Secondary (Grades XI - XII)", hi: "उच्च माध्यमिक (कक्षा XI - XII)" },
  acad_curr_4_desc: { en: "Specialized Science, Commerce, and Humanities streams with competitive entrance guidance.", hi: "प्रतियोगी प्रवेश मार्गदर्शन के साथ विशिष्ट विज्ञान, वाणिज्य और मानविकी संकाय।" },
  acad_calendar_title: { en: "Interactive Events Calendar", hi: "इंटरैक्टिव स्कूल कैलेंडर" },
  acad_calendar_sub: { en: "Navigate, inspect, and export school holidays, examinations, and events directly.", hi: "स्कूल की छुट्टियों, परीक्षाओं और कार्यक्रमों को सीधे देखें, जांचें और निर्यात करें।" },
  acad_download_title: { en: "Academic Downloads (Syllabus & Timetables)", hi: "अकादमिक डाउनलोड (पाठ्यक्रम और समय सारणी)" },
  acad_dl_1: { en: "Primary Syllabus (Class I-V)", hi: "प्राथमिक पाठ्यक्रम (कक्षा I-V)" },
  acad_dl_2: { en: "Middle Syllabus (Class VI-VIII)", hi: "माध्यमिक पाठ्यक्रम (कक्षा VI-VIII)" },
  acad_dl_3: { en: "Exam Syllabus (Class IX-XII)", hi: "परीक्षा पाठ्यक्रम (कक्षा IX-XII)" },

  // Activities Page
  activities_heading: { en: "Clubs & Activities", hi: "क्लब और गतिविधियाँ" },
  activities_subheading: { en: "We nurture talent beyond textbooks. Exploring creativity, sports, and tech.", hi: "हम पाठ्यपुस्तकों से परे प्रतिभा को निखारते हैं। रचनात्मकता, खेल और तकनीक की खोज।" },
  act_sports_title: { en: "Sports & Athletics", hi: "खेलकूद और एथलेटिक्स" },
  act_sports_desc: { en: "400m turf running track, indoor badminton, basketball courts, and professional coaches.", hi: "400 मीटर टर्फ रनिंग ट्रैक, इंडोर बैडमिंटन, बास्केटबॉल कोर्ट और पेशेवर कोच।" },
  act_robo_title: { en: "Robotics & Innovation Club", hi: "रोबोटिक्स और इनोवेशन क्लब" },
  act_robo_desc: { en: "Hands-on microcontroller coding, IoT automation sensors, and national science expo projects.", hi: "माइक्रोकंट्रोलर कोडिंग, आईओटी स्वचालन सेंसर और राष्ट्रीय विज्ञान प्रदर्शनी परियोजनाओं पर काम।" },
  act_arts_title: { en: "Performing Arts & Drama", hi: "प्रदर्शन कला और नाटक" },
  act_arts_desc: { en: "Classical Indian dance training, vocal music, instrumental orchestra, and theater groups.", hi: "शास्त्रीय भारतीय नृत्य प्रशिक्षण, गायन संगीत, वाद्य यंत्र ऑर्केस्ट्रा और थिएटर ग्रुप।" },

  // Facilities View
  fac_heading: { en: "School Campus Facilities", hi: "स्कूल कैंपस की सुविधाएं" },
  fac_subheading: { en: "Explore the premium infrastructural design and dynamic learning zones at our state-of-the-art campus.", hi: "हमारे अत्याधुनिक परिसर में प्रीमियम ढांचागत डिजाइन और गतिशील शिक्षण क्षेत्रों का अन्वेषण करें।" },
  fac_c1_title: { en: "Smart Classroom Blocks", hi: "स्मार्ट क्लासरूम ब्लॉक्स" },
  fac_c1_desc: { en: "Fully air-conditioned classrooms equipped with high-definition digital smart boards, ergonomic seating, and multi-modal acoustic soundproofing.", hi: "उच्च परिभाषा वाले डिजिटल स्मार्ट बोर्ड, एर्गोनोमिक बैठने की व्यवस्था और बहु-आयामी ध्वनिरोधी प्रणाली से सुसज्जित पूर्णतः वातानुकूलित कक्षाएं।" },
  fac_c2_title: { en: "Hi-Tech Laboratories", hi: "हाई-टेक प्रयोगशालाएं" },
  fac_c2_desc: { en: "Advanced modular labs for Physics, Chemistry, Biology, and Robotics, housing professional grade apparatuses and certified safety control mechanisms.", hi: "भौतिकी, रसायन विज्ञान, जीव विज्ञान और रोबोटिक्स के लिए उन्नत मॉड्यूलर प्रयोगशालाएं, जिसमें व्यावसायिक ग्रेड के उपकरण और प्रमाणित सुरक्षा नियंत्रण प्रणालियां शामिल हैं।" },
  fac_c3_title: { en: "Central Resource Library", hi: "केंद्रीय संसाधन पुस्तकालय" },
  fac_c3_desc: { en: "Quiet, spacious research hubs indexing 5,000+ classical and scientific volumes, digital reading portals, and modern audio-visual reference bays.", hi: "शांत, विशाल अनुसंधान केंद्र जिसमें 5,000+ शास्त्रीय और वैज्ञानिक पुस्तकें, डिजिटल रीडिंग पोर्टल और आधुनिक ऑडियो-विजुअल संदर्भ सुविधाएं उपलब्ध हैं।" },
  fac_c4_title: { en: "School Transport Fleet", hi: "स्कूल परिवहन बेड़ा" },
  fac_c4_desc: { en: "A GPS-tracked school bus fleet traversing Kanpur, featuring surveillance camera integrations, speed governors, and trained clinical support staff on board.", hi: "कानपुर में चलने वाला जीपीएस-ट्रैक्ड स्कूल बस बेड़ा, जिसमें सुरक्षा कैमरा एकीकरण, गति नियंत्रण और प्रशिक्षित सहयोगी स्टाफ ऑन-बोर्ड शामिल हैं।" },

  // Hostel View
  hostel_heading: { en: "Hostel & Boarding Facilities", hi: "हॉस्टल और बोर्डिंग सुविधाएं" },
  hostel_subheading: { en: "A warm, safe, and academically nourishing home away from home for local and international students.", hi: "स्थानीय और अंतर्राष्ट्रीय छात्रों के लिए घर से दूर एक गर्मजोशी से भरा, सुरक्षित और शैक्षणिक रूप से समृद्ध घर।" },
  hostel_life_title: { en: "Residential Boarding Guidelines", hi: "आवासीय बोर्डिंग दिशानिर्देश" },
  hostel_li1: {
    en: "<i class=\"ti ti-check\" style=\"color:var(--success);\"></i> <strong>Room Structure:</strong> Spacious, well-ventilated double and triple sharing rooms with dedicated study tables and personalized storage cupboards.",
    hi: "<i class=\"ti ti-check\" style=\"color:var(--success);\"></i> <strong>कमरे की संरचना:</strong> समर्पित अध्ययन मेज और व्यक्तिगत भंडारण अलमारी के साथ विशाल, अच्छी तरह हवादार डबल और ट्रिपल शेयरिंग कमरे।"
  },
  hostel_li2: {
    en: "<i class=\"ti ti-check\" style=\"color:var(--success);\"></i> <strong>Hygienic Mess & Nutrition:</strong> A highly hygienic mess kitchen serving fresh, nutritionally balanced vegetarian meals planned by child health experts.",
    hi: "<i class=\"ti ti-check\" style=\"color:var(--success);\"></i> <strong>स्वच्छ भोजन और पोषण:</strong> बाल स्वास्थ्य विशेषज्ञों द्वारा नियोजित ताजा, पोषण संबंधी संतुलित शाकाहारी भोजन परोसने वाला अत्यधिक स्वच्छ मेस रसोईघर।"
  },
  hostel_li3: {
    en: "<i class=\"ti ti-check\" style=\"color:var(--success);\"></i> <strong>Academic Prep Hours:</strong> Mandatory evening study hours monitored closely by resident tutors to support doubts and homework.",
    hi: "<i class=\"ti ti-check\" style=\"color:var(--success);\"></i> <strong>शैक्षणिक तैयारी का समय:</strong> शंकाओं और गृहकार्य में सहायता के लिए निवासी ट्यूटर्स द्वारा बारीकी से निगरानी की जाने वाली अनिवार्य शाम की अध्ययन अवधि।"
  },
  hostel_li4: {
    en: "<i class=\"ti ti-check\" style=\"color:var(--success);\"></i> <strong>24/7 Safety & Healthcare:</strong> Round-the-clock security surveillance, resident wardens, and an on-call physician with a dedicated medical clinic room.",
    hi: "<i class=\"ti ti-check\" style=\"color:var(--success);\"></i> <strong>24/7 सुरक्षा और स्वास्थ्य सेवा:</strong> चौबीसों घंटे सुरक्षा निगरानी, निवासी वार्डन, और एक समर्पित चिकित्सा क्लिनिक कमरे के साथ ऑन-कॉल चिकित्सक।"
  },
  hostel_form_title: { en: "Connect with the Hostel Warden", hi: "छात्रावास वार्डन से संपर्क करें" },
  hostel_form_sub: { en: "Have questions about seat availability, fees, or boarding schedules? Submit a query directly to the hostel administration office.", hi: "सीटों की उपलब्धता, फीस या बोर्डिंग शेड्यूल के बारे में प्रश्न हैं? सीधे छात्रावास प्रशासन कार्यालय को एक पूछताछ भेजें।" },
  lbl_parent_name: { en: "Parent Full Name", hi: "अभिभावक का पूरा नाम" },
  lbl_contact_no: { en: "Contact Number", hi: "संपर्क नंबर" },
  lbl_class: { en: "Select Class Level", hi: "कक्षा स्तर का चयन करें" },
  opt_choose_class: { en: "Choose class", hi: "कक्षा चुनें" },
  btn_submit_query: { en: "Submit Warden Query", hi: "पूछताछ सबमिट करें" },

  // Gallery
  gallery_heading: { en: "School Media Gallery", hi: "स्कूल मीडिया गैलरी" },
  gallery_subheading: { en: "Moments of joy, achievement, and learning at Kanpur Heritage.", hi: "कानपुर हेरिटेज में खुशी, उपलब्धि और सीखने के अनमोल पल।" },
  filter_all: { en: "All", hi: "सभी" },
  filter_sports: { en: "Sports", hi: "खेलकूद" },
  filter_cultural: { en: "Cultural", hi: "सांस्कृतिक" },
  filter_exhibitions: { en: "Exhibitions", hi: "प्रदर्शनी" },
  filter_all_years: { en: "All Years", hi: "सभी वर्ष" },

  // Notices
  notices_heading: { en: "Notices & Circulars", hi: "सूचनाएं और परिपत्र" },
  notices_subheading: { en: "Stay informed with the latest declarations, examinations schedulers, and circulars.", hi: "नवीनतम घोषणाओं, परीक्षा कार्यक्रमों और परिपत्रों के साथ सूचित रहें।" },
  filter_notice_admissions: { en: "Admissions", hi: "प्रवेश" },
  filter_notice_exams: { en: "Examinations", hi: "परीक्षा" },
  filter_notice_circulars: { en: "Circulars", hi: "परिपत्र" },
  filter_notice_events: { en: "Events", hi: "कार्यक्रम" },

  // Achievements
  achievements_heading: { en: "Our Proud Achievements", hi: "हमारी गौरवपूर्ण उपलब्धियां" },
  achievements_subheading: { en: "Celebrating our toppers, champion athletes, and innovators who make us proud.", hi: "हमारे टॉपर्स, चैंपियन एथलीटों और नवप्रवर्तकों का जश्न मनाना जो हमें गौरवान्वित करते हैं।" },

  // Contact
  contact_heading: { en: "Contact Us", hi: "संपर्क करें" },
  contact_subheading: { en: "Have questions? We would love to hear from you. Get in touch with our team.", hi: "कोई सवाल है? हम आपसे सुनना पसंद करेंगे। हमारी टीम से संपर्क करें।" },
  contact_form_title: { en: "General Enquiry Form", hi: "सामान्य पूछताछ फॉर्म" },
  contact_details_title: { en: "School Office Details", hi: "स्कूल कार्यालय का विवरण" },
  office_timings: { en: "Office Hours: Monday - Saturday: 8:00 AM - 2:00 PM", hi: "कार्यालय का समय: सोमवार - शनिवार: सुबह 8:00 बजे - दोपहर 2:00 बजे" },
  lbl_name: { en: "Full Name", hi: "पूरा नाम" },
  lbl_phone: { en: "Phone Number", hi: "फ़ोन नंबर" },
  lbl_email: { en: "Email Address", hi: "ईमेल पता" },
  lbl_subject: { en: "Subject", hi: "विषय" },
  lbl_message: { en: "Your Message", hi: "आपका संदेश" },
  btn_submit_enq: { en: "Send Enquiry", hi: "पूछताछ भेजें" },

  // Admissions Wizard
  closed_title: { en: "Admissions are Currently Closed", hi: "प्रवेश वर्तमान में बंद हैं" },
  closed_desc: { en: "Online registrations for the current academic session have concluded. Please get in touch with the school administration block.", hi: "वर्तमान शैक्षणिक सत्र के लिए ऑनलाइन पंजीकरण समाप्त हो गए हैं। कृपया स्कूल प्रशासन ब्लॉक से संपर्क करें।" },
  btn_inquire_now: { en: "Submit Inquiry", hi: "पूछताछ सबमिट करें" },
  adm_heading: { en: "Online Admission Portal", hi: "ऑनलाइन प्रवेश पोर्टल" },
  adm_subheading: { en: "Please fill in the application form carefully. Fields marked with * are required.", hi: "कृपया आवेदन पत्र सावधानीपूर्वक भरें। * वाले फ़ील्ड अनिवार्य हैं।" },
  adm_s1_label: { en: "Candidate Details", hi: "छात्र विवरण" },
  adm_s2_label: { en: "Parent Information", hi: "अभिभावक विवरण" },
  adm_s3_label: { en: "Document Upload", hi: "दस्तावेज़ अपलोड" },
  adm_s4_label: { en: "Form Review", hi: "फॉर्म समीक्षा" },

  adm_s1_title: { en: "Student Personal Information", hi: "छात्र की व्यक्तिगत जानकारी" },
  adm_s1_name: { en: "Student Full Name", hi: "छात्र का पूरा नाम" },
  adm_s1_dob: { en: "Date of Birth", hi: "जन्म तिथि" },
  adm_s1_gender: { en: "Gender", hi: "लिंग" },
  adm_s1_grade: { en: "Grade Applied For", hi: "प्रवेश के लिए कक्षा" },
  opt_select: { en: "Select gender", hi: "लिंग चुनें" },
  opt_male: { en: "Male", hi: "पुरुष" },
  opt_female: { en: "Female", hi: "महिला" },
  opt_other: { en: "Other", hi: "अन्य" },
  opt_select_grade: { en: "Select grade", hi: "कक्षा चुनें" },

  adm_s2_title: { en: "Parent / Guardian Information", hi: "अभिभावक / संरक्षक की जानकारी" },
  adm_s2_name: { en: "Father / Guardian Full Name", hi: "पिता / अभिभावक का पूरा नाम" },
  adm_s2_mother: { en: "Mother Full Name", hi: "माता का पूरा नाम" },
  adm_s2_phone: { en: "Contact Phone Number", hi: "संपर्क फ़ोन नंबर" },
  adm_s2_email: { en: "Parent Email Address", hi: "अभिभावक का ईमेल पता" },
  adm_s2_address: { en: "Residential Address", hi: "आवासीय पता" },

  adm_s3_title: { en: "Upload Necessary Proofs", hi: "आवश्यक प्रमाण अपलोड करें" },
  adm_s3_sub: { en: "Upload digital files (PDF, JPG, PNG) supporting the application.", hi: "आवेदन के समर्थन में डिजिटल फाइलें (PDF, JPG, PNG) अपलोड करें।" },
  doc_birth: { en: "1. Birth Certificate *", hi: "1. जन्म प्रमाण पत्र *" },
  doc_photo: { en: "2. Candidate Student Photo *", hi: "2. छात्र की फोटो *" },
  doc_click_to_upload: { en: "Click to upload file", hi: "फाइल अपलोड करने के लिए क्लिक करें" },
  doc_formats: { en: "PDF, PNG, JPG up to 2MB", hi: "पीडीएफ, पीएनजी, जेपीजी 2 एमबी तक" },
  doc_formats_img: { en: "JPG, PNG up to 2MB", hi: "जेपीजी, पीएनजी 2 एमबी तक" },

  adm_s4_title: { en: "Review Entered Details", hi: "दर्ज विवरण की समीक्षा करें" },
  adm_s4_sub: { en: "Verify that the details are exactly correct before clicking final submission.", hi: "अंतिम रूप से जमा करने से पहले जांच लें कि विवरण बिल्कुल सही हैं।" },
  
  btn_back: { en: "Back", hi: "पीछे" },
  btn_next: { en: "Next", hi: "आगे" },
  btn_submit_app: { en: "Submit Application", hi: "आवेदन सबमिट करें" },

  receipt_header: { en: "Application Submitted!", hi: "आवेदन सफलतापूर्वक सबमिट हुआ!" },
  receipt_subheader: { en: "Your online admission application has been registered successfully.", hi: "आपका ऑनलाइन प्रवेश आवेदन सफलतापूर्वक पंजीकृत हो गया है।" },
  btn_new_app: { en: "Fill New Application", hi: "नया आवेदन पत्र भरें" },

  // Admin and Footer bottoms
  lbl_admin_pass: { en: "Password", hi: "पासवर्ड" },
  admin_auth_title: { en: "Secure CMS Login", hi: "सुरक्षित सीएमएस लॉगिन" },
  admin_auth_sub: { en: "Enter administrator password to enter dashboard", hi: "डैशबोर्ड में प्रवेश करने के लिए पासवर्ड दर्ज करें" },
  btn_login: { en: "Login Dashboard", hi: "डैशबोर्ड में लॉग इन करें" },
  footer_about: { en: "Dedicated to fostering excellence in conceptual thought, artistic growth, and moral character.", hi: "वैचारिक विचार, कलात्मक विकास और नैतिक चरित्र में उत्कृष्टता को बढ़ावा देने के लिए समर्पित।" },
  footer_links_title: { en: "Quick Pathways", hi: "त्वरित लिंक" },
  footer_contact_title: { en: "Find Our Office", hi: "हमारा कार्यालय" },
  footer_rights: { en: "All rights reserved.", hi: "सर्वाधिकार सुरक्षित।" },
  footer_tagline: { en: "Kanpur, UP", hi: "कानपुर, उत्तर प्रदेश" }
};

// Site-Wide Translation Renderer
function renderTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translationDictionary[key]) {
      const translation = translationDictionary[key][currentLocale];
      if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'email' || el.type === 'tel')) {
        el.placeholder = translation;
      } else {
        el.innerHTML = translation;
      }
    }
  });

  // Dynamic Content Translations (Home text updates)
  const homeTitle = document.getElementById('heroTitle');
  const homeSub = document.getElementById('heroSub');
  if (homeTitle && homeSub) {
    if (currentLocale === 'hi') {
      homeTitle.innerHTML = "प्रेरित <span>उत्कृष्टता</span>,<br>चरित्र का निर्माण";
      homeSub.innerHTML = "हमारे समृद्ध शैक्षिक परिसर में विश्वस्तरीय शिक्षा, वैज्ञानिक प्रणालियों और सांस्कृतिक मूल्यों के साथ कानपुर के युवाओं को सशक्त बनाना।";
    } else {
      homeTitle.innerHTML = "Inspiring <span>Excellence</span>,<br>Nurturing Character";
      homeSub.innerHTML = "Empowering the youth of Kanpur with standard education, scientific learning models, and cultural values at our premium campus.";
    }
  }

  // Address text updates
  const contactAddress = document.getElementById('contactAddressText');
  const footerAddress = document.getElementById('footerAddressText');
  if (contactAddress && footerAddress) {
    contactAddress.innerText = state.settings.contactInfo['address_' + currentLocale];
    footerAddress.innerText = state.settings.contactInfo['address_' + currentLocale];
  }

  // Principal Speech Home translation
  const principalHome = document.getElementById('principalHomeMsg');
  if (principalHome) {
    principalHome.innerText = currentLocale === 'hi'
      ? `"हमारा मानना है कि शिक्षा केवल ज्ञान प्राप्त करना नहीं है, बल्कि करुणा और नवाचार के साथ नेतृत्व करने के लिए एक ठोस चरित्र का निर्माण करना है। सीखने के उज्ज्वल भविष्य में आपका स्वागत है।"`
      : `"We believe that education is not merely acquiring knowledge, but building a solid character to lead with compassion and innovation. Welcome to the future of learning."`;
  }

  // Update dynamic render lists
  renderNoticesTicker();
  renderNoticesBoard();
  renderGalleryAlbums();
  renderAchievements();
  renderEventsAgenda();
  renderCalendarComponent();

  // If in admin dashboard view, sync dashboard labels as well
  if (adminSession) {
    renderAdminDashboardView();
  }
}

// Toggle language
function toggleLanguage(toggleContainer) {
  currentLocale = currentLocale === 'en' ? 'hi' : 'en';
  localStorage.setItem('khis_locale', currentLocale);
  
  const enBtn = document.getElementById('lang-en');
  const hiBtn = document.getElementById('lang-hi');
  if (enBtn && hiBtn) {
    if (currentLocale === 'en') {
      enBtn.classList.add('active');
      hiBtn.classList.remove('active');
    } else {
      hiBtn.classList.add('active');
      enBtn.classList.remove('active');
    }
  }
  renderTranslations();
}

// Initialize active state on buttons
function syncLanguageSelector() {
  const enBtn = document.getElementById('lang-en');
  const hiBtn = document.getElementById('lang-hi');
  if (enBtn && hiBtn) {
    if (currentLocale === 'en') {
      enBtn.classList.add('active');
      hiBtn.classList.remove('active');
    } else {
      hiBtn.classList.add('active');
      enBtn.classList.remove('active');
    }
  }
}

// ── NAVIGATION & ROUTER ──
let isScrollingFromNav = false; // Flag to prevent scroll listener from changing active states during navigation

function handleRouteChange() {
  let hash = window.location.hash || '#/home';
  const matchedRoute = hash.replace('#/', '');

  // Active navigation link tracking
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('javascript:')) return;
    const route = href.replace('#/', '');
    if (route === matchedRoute) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Set active states on dropdown triggers based on sub-routes
  const dropdownAbout = document.getElementById('dropdownAboutTrigger');
  if (dropdownAbout) {
    if (['about', 'director'].includes(matchedRoute)) {
      dropdownAbout.classList.add('active');
    } else {
      dropdownAbout.classList.remove('active');
    }
  }

  const dropdownAcademics = document.getElementById('dropdownAcademicsTrigger');
  if (dropdownAcademics) {
    if (['academics', 'results', 'fees-schedule', 'faculties-list'].includes(matchedRoute)) {
      dropdownAcademics.classList.add('active');
    } else {
      dropdownAcademics.classList.remove('active');
    }
  }

  const publicScroller = document.getElementById('public-scroller');
  const adminView = document.getElementById('view-admin');
  const admissionsView = document.getElementById('view-admissions');
  const facilitiesView = document.getElementById('view-facilities');
  const hostelView = document.getElementById('view-hostel');

  if (matchedRoute === 'admin') {
    if (publicScroller) publicScroller.classList.remove('active');
    if (admissionsView) admissionsView.classList.remove('active');
    if (facilitiesView) facilitiesView.classList.remove('active');
    if (hostelView) hostelView.classList.remove('active');
    if (adminView) {
      adminView.classList.add('active');
      renderAdminDashboardView();
    }
    window.scrollTo({ top: 0 });
  } else if (matchedRoute === 'admissions') {
    if (publicScroller) publicScroller.classList.remove('active');
    if (adminView) adminView.classList.remove('active');
    if (facilitiesView) facilitiesView.classList.remove('active');
    if (hostelView) hostelView.classList.remove('active');
    if (admissionsView) {
      admissionsView.classList.add('active');
      setupAdmissionsView();
    }
    window.scrollTo({ top: 0 });
  } else if (matchedRoute === 'facilities') {
    if (publicScroller) publicScroller.classList.remove('active');
    if (adminView) adminView.classList.remove('active');
    if (admissionsView) admissionsView.classList.remove('active');
    if (hostelView) hostelView.classList.remove('active');
    if (facilitiesView) {
      facilitiesView.classList.add('active');
    }
    window.scrollTo({ top: 0 });
  } else if (matchedRoute === 'hostel') {
    if (publicScroller) publicScroller.classList.remove('active');
    if (adminView) adminView.classList.remove('active');
    if (admissionsView) admissionsView.classList.remove('active');
    if (facilitiesView) facilitiesView.classList.remove('active');
    if (hostelView) {
      hostelView.classList.add('active');
    }
    window.scrollTo({ top: 0 });
  } else {
    if (adminView) adminView.classList.remove('active');
    if (admissionsView) admissionsView.classList.remove('active');
    if (facilitiesView) facilitiesView.classList.remove('active');
    if (hostelView) hostelView.classList.remove('active');
    if (publicScroller) {
      publicScroller.classList.add('active');
    }

    // Scroll to target section
    const targetSec = document.getElementById('sec-' + matchedRoute);
    if (targetSec) {
      isScrollingFromNav = true;
      const headerHeight = document.querySelector('.main-header').offsetHeight || 80;
      const topOffset = targetSec.getBoundingClientRect().top + window.scrollY - headerHeight - 15;
      
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
      
      // Release scroll block after smooth scroll finishes
      setTimeout(() => {
        isScrollingFromNav = false;
      }, 800);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// Active section tracker on manual scroll
window.addEventListener('scroll', () => {
  if (isScrollingFromNav) return;
  
  const matchedRoute = (window.location.hash || '#/home').replace('#/', '');
  if (matchedRoute === 'admin' || matchedRoute === 'admissions') return; // Don't track active states on admin or admissions views

  const sections = document.querySelectorAll('.scroll-section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentActive = 'home';
  const headerHeight = document.querySelector('.main-header').offsetHeight || 80;
  
  sections.forEach(sec => {
    const top = sec.offsetTop - headerHeight - 120;
    if (window.scrollY >= top) {
      currentActive = sec.id.replace('sec-', '');
    }
  });

  // Highlight active link matching scroll section
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('javascript:')) return;
    const route = href.replace('#/', '');
    if (route === currentActive) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Set active states on dropdown triggers based on scrolled section
  const dropdownAbout = document.getElementById('dropdownAboutTrigger');
  if (dropdownAbout) {
    if (['about', 'director'].includes(currentActive)) {
      dropdownAbout.classList.add('active');
    } else {
      dropdownAbout.classList.remove('active');
    }
  }

  const dropdownAcademics = document.getElementById('dropdownAcademicsTrigger');
  if (dropdownAcademics) {
    if (['academics', 'results', 'fees-schedule', 'faculties-list'].includes(currentActive)) {
      dropdownAcademics.classList.add('active');
    } else {
      dropdownAcademics.classList.remove('active');
    }
  }
});


function toggleMobileMenu() {
  const menu = document.getElementById('navMenu');
  const icon = document.getElementById('hamburgerIcon');
  if (menu && icon) {
    menu.classList.toggle('active');
    if (menu.classList.contains('active')) {
      icon.className = 'ti ti-x';
    } else {
      icon.className = 'ti ti-menu-2';
    }
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('navMenu');
  const icon = document.getElementById('hamburgerIcon');
  if (menu && icon) {
    menu.classList.remove('active');
    icon.className = 'ti ti-menu-2';
  }
}

// ── HERO SLIDESHOW LOGIC ──
let slideshowIntervalId = null;
let currentSlideIndex = 0;

window.setHeroSlide = function(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length || !dots.length) return;

  // Clamp index within bounds
  currentSlideIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    if (i === currentSlideIndex) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  dots.forEach((dot, i) => {
    if (i === currentSlideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Reset autoplay timer
  resetSlideshowTimer();
};

function resetSlideshowTimer() {
  if (slideshowIntervalId) {
    clearInterval(slideshowIntervalId);
  }
  slideshowIntervalId = setInterval(() => {
    window.setHeroSlide(currentSlideIndex + 1);
  }, 3500);
}

function startHeroSlideshow() {
  resetSlideshowTimer();
}

// ── YOUTUBE CAROUSEL & MODAL LOGIC ──
let currentYtSlideIndex = 0;
let ytCarouselIntervalId = null;

window.slideYtCarousel = function(direction) {
  const track = document.getElementById('ytCarouselTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.yt-card');
  if (!cards.length) return;
  
  const cardWidth = cards[0].offsetWidth + 20; // width + gap
  const viewportWidth = track.parentElement.offsetWidth;
  const maxVisibleCards = Math.floor(viewportWidth / cardWidth) || 1;
  const maxIndex = cards.length - maxVisibleCards;
  
  currentYtSlideIndex = Math.max(0, Math.min(maxIndex, currentYtSlideIndex + direction));
  const offset = -currentYtSlideIndex * cardWidth;
  track.style.transform = `translateX(${offset}px)`;
  
  // Reset and restart autoplay timer
  if (ytCarouselIntervalId) {
    clearInterval(ytCarouselIntervalId);
    startYtCarouselAutoplay();
  }
};

function startYtCarouselAutoplay() {
  if (ytCarouselIntervalId) clearInterval(ytCarouselIntervalId);
  ytCarouselIntervalId = setInterval(() => {
    const track = document.getElementById('ytCarouselTrack');
    if (!track) return;
    const cards = track.querySelectorAll('.yt-card');
    if (!cards.length) return;
    
    const cardWidth = cards[0].offsetWidth + 20;
    const viewportWidth = track.parentElement.offsetWidth;
    const maxVisibleCards = Math.floor(viewportWidth / cardWidth) || 1;
    const maxIndex = cards.length - maxVisibleCards;
    
    if (currentYtSlideIndex >= maxIndex) {
      currentYtSlideIndex = 0;
    } else {
      currentYtSlideIndex++;
    }
    
    const offset = -currentYtSlideIndex * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
  }, 4500);
}

window.openYtVideoModal = function(url) {
  const modal = document.getElementById('ytVideoModal');
  const iframe = document.getElementById('ytVideoPlayerIframe');
  if (modal && iframe) {
    iframe.src = url;
    modal.classList.add('active');
  }
};

window.closeYtVideoModal = function() {
  const modal = document.getElementById('ytVideoModal');
  const iframe = document.getElementById('ytVideoPlayerIframe');
  if (modal && iframe) {
    iframe.src = '';
    modal.classList.remove('active');
  }
};

// ── TICKER & NOTICE BOARD ──
function renderNoticesTicker() {
  const tickerTrack = document.getElementById('noticeTickerTrack');
  if (!tickerTrack) return;
  
  // Filter active notices
  const recentNotices = state.notices.slice(0, 4);
  let html = '';
  
  // Duplicate notices inside to ensure continuous looping without visual gaps
  const loopNotices = [...recentNotices, ...recentNotices];
  
  loopNotices.forEach(n => {
    const title = currentLocale === 'hi' ? n.title_hi : n.title_en;
    const newBadge = n.isNew ? `<span class="new-badge">New</span>` : '';
    html += `
      <a href="#/notices" class="ticker-item">
        ${newBadge} ${title}
      </a>
    `;
  });
  tickerTrack.innerHTML = html;
}

function renderNoticesBoard() {
  const noticesContainer = document.getElementById('noticesFullBoard');
  if (!noticesContainer) return;

  const filteredNotices = activeNoticeFilter === 'all'
    ? state.notices
    : state.notices.filter(n => n.category.toLowerCase() === activeNoticeFilter.toLowerCase());

  if (filteredNotices.length === 0) {
    noticesContainer.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--slate);" data-i18n="no_notices">No announcements match this filter.</div>`;
    return;
  }

  let html = '';
  filteredNotices.forEach(n => {
    const title = currentLocale === 'hi' ? n.title_hi : n.title_en;
    const content = currentLocale === 'hi' ? n.content_hi : n.content_en;
    const isNewClass = n.isNew ? 'new-notice' : '';
    const categoryLower = n.category.toLowerCase();
    
    html += `
      <div class="notice-item ${isNewClass}">
        <div class="notice-header-row">
          <div class="notice-meta">
            <span class="notice-badge ${categoryLower}">${n.category}</span>
            <span class="notice-date">${formatDisplayDate(n.date)}</span>
          </div>
          ${n.isNew ? `<span class="badge badge-warn" style="margin:0; padding:2px 8px; font-size:9.5px;">NEW</span>` : ''}
        </div>
        <h3 class="notice-title">${title}</h3>
        <p class="notice-body">${content}</p>
      </div>
    `;
  });
  noticesContainer.innerHTML = html;
}

// Notice Board Category Tabs Toggles
function setupNoticeFilters() {
  const buttons = document.querySelectorAll('#noticeFilterBtnWrap .filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeNoticeFilter = btn.getAttribute('data-category');
      renderNoticesBoard();
    });
  });
}

// ── INTERACTIVE MONTHLY CALENDAR COMPONENT ──
function renderCalendarComponent() {
  const grid = document.getElementById('calendarDaysGrid');
  const label = document.getElementById('calMonthYearLabel');
  if (!grid || !label) return;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  // Set header label
  const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthNamesHi = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  label.innerText = currentLocale === 'hi' ? `${monthNamesHi[month]} ${year}` : `${monthNamesEn[month]} ${year}`;

  grid.innerHTML = '';

  // Header row day labels
  const daysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysHi = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
  const activeDays = currentLocale === 'hi' ? daysHi : daysEn;
  
  activeDays.forEach(d => {
    const dLabel = document.createElement('div');
    dLabel.className = 'calendar-day-label';
    dLabel.innerText = d;
    grid.appendChild(dLabel);
  });

  // Calculate month limits
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Empty cells for alignment
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell empty-cell';
    grid.appendChild(emptyCell);
  }

  // Render day cells
  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    
    // Check if cell is today
    const checkDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (checkDateStr === todayStr) {
      cell.classList.add('today-cell');
    }

    cell.innerHTML = `<span style="z-index: 2;">${day}</span>`;

    // Filter events on this date
    const dayEvents = state.events.filter(e => e.date === checkDateStr);
    if (dayEvents.length > 0) {
      cell.classList.add('has-event');
      const dotRow = document.createElement('div');
      dotRow.className = 'calendar-event-dot-row';
      dayEvents.forEach(e => {
        const dot = document.createElement('span');
        dot.className = `cal-dot ${e.category.toLowerCase()}`;
        dotRow.appendChild(dot);
      });
      cell.appendChild(dotRow);

      // Event click trigger
      cell.addEventListener('click', () => {
        openCalendarEventDetailModal(dayEvents[0]); // Open first event detail
      });
    }

    grid.appendChild(cell);
  }
}

function navigateCalendar(offset) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset);
  renderCalendarComponent();
}

function openCalendarEventDetailModal(event) {
  const modal = document.getElementById('calendarEventModal');
  const title = document.getElementById('calModalTitle');
  const date = document.getElementById('calModalDate');
  const loc = document.getElementById('calModalLocation');
  const desc = document.getElementById('calModalDesc');
  const exportBtn = document.getElementById('calModalExportBtn');

  if (!modal || !title || !date || !loc || !desc || !exportBtn) return;

  const eventTitle = currentLocale === 'hi' ? event.title_hi : event.title_en;
  const eventLoc = currentLocale === 'hi' ? event.location_hi : event.location_en;
  const eventDesc = currentLocale === 'hi' ? event.description_hi : event.description_en;

  title.innerText = eventTitle;
  date.innerText = formatDisplayDate(event.date);
  loc.innerText = eventLoc;
  desc.innerText = eventDesc;

  // Add click to download ICS
  exportBtn.onclick = () => downloadICSFile(event);

  modal.classList.add('active');
}

function closeCalendarEventModal() {
  const modal = document.getElementById('calendarEventModal');
  if (modal) modal.classList.remove('active');
}

// Export calendar event as highly professional ICS file in JS
function downloadICSFile(event) {
  const title = currentLocale === 'hi' ? event.title_hi : event.title_en;
  const description = currentLocale === 'hi' ? event.description_hi : event.description_en;
  const location = currentLocale === 'hi' ? event.location_hi : event.location_en;
  
  // Format date: 2026-05-24 -> 20260524
  const dateFormatted = event.date.replace(/-/g, '');
  const uid = `event-${event.id}@kanpurheritage.edu.in`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kanpur Heritage International School//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dateFormatted}T090000Z`,
    `DTSTART:${dateFormatted}T090000`,
    `DTEND:${dateFormatted}T140000`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.setAttribute('download', `${title.replace(/\s+/g, '_')}_event.ics`);
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  URL.revokeObjectURL(url);
}

function renderEventsAgenda() {
  const agendaList = document.getElementById('agendaList');
  if (!agendaList) return;

  // Filter 4 upcoming events starting from today
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = state.events
    .filter(e => e.date >= '2026-05-20') // Keep anchored near seed date
    .sort((a,b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  let html = '';
  upcomingEvents.forEach(e => {
    const title = currentLocale === 'hi' ? e.title_hi : e.title_en;
    const desc = currentLocale === 'hi' ? e.description_hi : e.description_en;
    html += `
      <div class="agenda-item">
        <div class="agenda-meta">
          <span>${formatDisplayDate(e.date)}</span>
          <span style="text-transform:uppercase; color:var(--orange);">${e.category}</span>
        </div>
        <h4 class="agenda-title">${title}</h4>
        <p class="agenda-desc">${desc}</p>
        <button class="agenda-export-btn" onclick="downloadICSFile(${JSON.stringify(e).replace(/"/g, '&quot;')})">
          <i class="ti ti-download"></i> Add to Calendar
        </button>
      </div>
    `;
  });
  agendaList.innerHTML = html;
}

// ── MEDIA GALLERY & ALBUMS ──
function renderGalleryAlbums() {
  const container = document.getElementById('albumsContainer');
  if (!container) return;

  const filteredAlbums = activeGalleryFilter === 'all'
    ? state.albums
    : state.albums.filter(al => al.category.toLowerCase() === activeGalleryFilter.toLowerCase());

  if (filteredAlbums.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--slate);">No albums found.</div>`;
    return;
  }

  let html = '';
  filteredAlbums.forEach(al => {
    const title = currentLocale === 'hi' ? al.title_hi : al.title_en;
    const desc = currentLocale === 'hi' ? al.description_hi : al.description_en;
    
    // Simulate beautiful Cover Image gradients if paths fail
    html += `
      <div class="album-card" onclick="openAlbumLightboxModal(${JSON.stringify(al).replace(/"/g, '&quot;')})">
        <div class="album-image-wrapper">
          <div class="hero-frame-bg" style="background-image: linear-gradient(135deg, rgba(26,26,46,0.1), rgba(26,26,46,0.6)), url('${al.coverImage}');"></div>
          <span style="font-size:32px; z-index:1;">🖼️</span>
          <span class="album-badge">${al.year}</span>
          <span class="album-photo-count"><i class="ti ti-photo"></i> ${al.images.length} Photos</span>
        </div>
        <div class="album-content">
          <h3 class="album-title">${title}</h3>
          <p class="album-desc">${desc}</p>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function setupGalleryFilters() {
  const buttons = document.querySelectorAll('#galleryFilterBtnWrap .filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeGalleryFilter = btn.getAttribute('data-category');
      renderGalleryAlbums();
    });
  });
}

function filterGalleryAlbums() {
  const yearSelect = document.getElementById('galleryYearFilter');
  if (!yearSelect) return;
  const yearVal = yearSelect.value;
  
  const allAlbums = state.albums;
  const container = document.getElementById('albumsContainer');
  if (!container) return;

  const filtered = allAlbums.filter(al => {
    const matchesCat = activeGalleryFilter === 'all' || al.category.toLowerCase() === activeGalleryFilter.toLowerCase();
    const matchesYear = yearVal === 'all' || al.year === yearVal;
    return matchesCat && matchesYear;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--slate);">No albums found.</div>`;
    return;
  }

  let html = '';
  filtered.forEach(al => {
    const title = currentLocale === 'hi' ? al.title_hi : al.title_en;
    const desc = currentLocale === 'hi' ? al.description_hi : al.description_en;
    html += `
      <div class="album-card" onclick="openAlbumLightboxModal(${JSON.stringify(al).replace(/"/g, '&quot;')})">
        <div class="album-image-wrapper">
          <div class="hero-frame-bg" style="background-image: linear-gradient(135deg, rgba(26,26,46,0.1), rgba(26,26,46,0.6)), url('${al.coverImage}');"></div>
          <span style="font-size:32px; z-index:1;">🖼️</span>
          <span class="album-badge">${al.year}</span>
          <span class="album-photo-count"><i class="ti ti-photo"></i> ${al.images.length} Photos</span>
        </div>
        <div class="album-content">
          <h3 class="album-title">${title}</h3>
          <p class="album-desc">${desc}</p>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// Lightbox modal carousel for albums
function openAlbumLightboxModal(album) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  if (!modal || !img || !caption) return;

  // Render the first image in the album
  const firstImage = album.images[0];
  img.src = firstImage.url;
  caption.innerText = currentLocale === 'hi' ? firstImage.caption_hi : firstImage.caption_en;

  // Optional: support album slide loop on image click
  let currentIndex = 0;
  img.style.cursor = 'pointer';
  img.onclick = () => {
    currentIndex = (currentIndex + 1) % album.images.length;
    const nextImg = album.images[currentIndex];
    img.src = nextImg.url;
    caption.innerText = currentLocale === 'hi' ? nextImg.caption_hi : nextImg.caption_en;
  };

  modal.classList.add('active');
}

function closeLightboxModal() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
}

// ── PROUD ACHIEVEMENTS ──
function renderAchievements() {
  const container = document.getElementById('achievementsContainer');
  if (!container) return;

  let html = '';
  state.achievements.forEach(ac => {
    const title = currentLocale === 'hi' ? ac.title_hi : ac.title_en;
    const winner = currentLocale === 'hi' ? ac.winner_hi : ac.winner_en;
    const desc = currentLocale === 'hi' ? ac.details_hi : ac.details_en;
    
    html += `
      <div class="ach-card">
        <span class="ach-year">${ac.year} · ${ac.category}</span>
        <h3 class="ach-title">${title}</h3>
        <span class="ach-winner">${winner}</span>
        <p class="ach-desc">${desc}</p>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ── ONLINE ADMISSIONS FORM WIZARD ──
function setupAdmissionsView() {
  const closedScreen = document.getElementById('admissionsClosedScreen');
  const openScreen = document.getElementById('admissionsOpenScreen');
  const receiptScreen = document.getElementById('admissionsReceiptScreen');

  if (!closedScreen || !openScreen || !receiptScreen) return;

  receiptScreen.style.display = 'none';

  if (state.settings.admissionsOpen) {
    closedScreen.style.display = 'none';
    openScreen.style.display = 'block';
    resetAdmissionWizard();
  } else {
    closedScreen.style.display = 'block';
    openScreen.style.display = 'none';
  }
}

function resetAdmissionWizard() {
  admissionsWizardStep = 1;
  uploadedDocuments = {};
  document.getElementById('admissionApplicationForm').reset();
  
  const uploadList = document.getElementById('uploadedFilesList');
  if (uploadList) {
    uploadList.innerHTML = '';
    uploadList.style.display = 'none';
  }
  
  const birthBtn = document.getElementById('lbl-birthCert');
  const photoBtn = document.getElementById('lbl-studentPhoto');
  if (birthBtn) birthBtn.innerText = currentLocale === 'hi' ? "फाइल अपलोड करने के लिए क्लिक करें" : "Click to upload file";
  if (photoBtn) photoBtn.innerText = currentLocale === 'hi' ? "फाइल अपलोड करने के लिए क्लिक करें" : "Click to upload file";

  updateWizardVisuals();
}

function updateWizardVisuals() {
  // Update form active sections
  for (let i = 1; i <= 4; i++) {
    const stepCard = document.getElementById('formStep-' + i);
    const stepBubble = document.getElementById('wStep-' + i);
    if (stepCard) {
      if (i === admissionsWizardStep) {
        stepCard.classList.add('active');
      } else {
        stepCard.classList.remove('active');
      }
    }
    if (stepBubble) {
      stepBubble.className = 'wizard-step';
      if (i < admissionsWizardStep) {
        stepBubble.classList.add('completed');
      } else if (i === admissionsWizardStep) {
        stepBubble.classList.add('active');
      }
    }
  }

  // Update progress bar width
  const progress = document.getElementById('wizardProgress');
  if (progress) {
    progress.style.width = ((admissionsWizardStep - 1) / 3 * 100) + '%';
  }

  // Update button visibility
  const backBtn = document.getElementById('wizardBackBtn');
  const nextBtn = document.getElementById('wizardNextBtn');
  const submitBtn = document.getElementById('wizardSubmitBtn');

  if (backBtn && nextBtn && submitBtn) {
    backBtn.style.visibility = admissionsWizardStep === 1 ? 'hidden' : 'visible';
    
    if (admissionsWizardStep === 4) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
      renderAdmissionsReviewSummary();
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }
  }
}

// Field validation rules per wizard step
function validateWizardStep(step) {
  if (step === 1) {
    const name = document.getElementById('admStudentName').value.trim();
    const dob = document.getElementById('admStudentDOB').value;
    const gender = document.getElementById('admStudentGender').value;
    const grade = document.getElementById('admGradeApplied').value;

    if (name.length < 3) {
      alert(currentLocale === 'hi' ? "कृपया छात्र का पूरा नाम (कम से कम 3 अक्षर) दर्ज करें।" : "Please enter a valid student name (minimum 3 letters).");
      return false;
    }
    if (!dob) {
      alert(currentLocale === 'hi' ? "कृपया जन्म तिथि चुनें।" : "Please select Date of Birth.");
      return false;
    }
    if (!gender) {
      alert(currentLocale === 'hi' ? "कृपया लिंग का चयन करें।" : "Please select gender.");
      return false;
    }
    if (!grade) {
      alert(currentLocale === 'hi' ? "कृपया कक्षा का चयन करें।" : "Please select a grade.");
      return false;
    }
  } else if (step === 2) {
    const father = document.getElementById('admParentName').value.trim();
    const mother = document.getElementById('admMotherName').value.trim();
    const phone = document.getElementById('admPhone').value.trim();
    const email = document.getElementById('admEmail').value.trim();
    const address = document.getElementById('admAddress').value.trim();

    if (father.length < 3) {
      alert(currentLocale === 'hi' ? "कृपया पिता का पूरा नाम दर्ज करें।" : "Please enter a valid Father's name.");
      return false;
    }
    if (mother.length < 3) {
      alert(currentLocale === 'hi' ? "कृपया माता का पूरा नाम दर्ज करें।" : "Please enter a valid Mother's name.");
      return false;
    }
    if (phone.length < 10) {
      alert(currentLocale === 'hi' ? "कृपया एक मान्य 10 अंकों का फोन नंबर दर्ज करें।" : "Please enter a valid 10-digit phone number.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert(currentLocale === 'hi' ? "कृपया एक मान्य ईमेल पता दर्ज करें।" : "Please enter a valid email address.");
      return false;
    }
    if (address.length < 8) {
      alert(currentLocale === 'hi' ? "कृपया अपना पूरा आवासीय पता दर्ज करें।" : "Please enter a complete residential address.");
      return false;
    }
  } else if (step === 3) {
    if (!uploadedDocuments['birthCert']) {
      alert(currentLocale === 'hi' ? "कृपया जन्म प्रमाण पत्र अपलोड करें।" : "Please upload the Birth Certificate.");
      return false;
    }
    if (!uploadedDocuments['studentPhoto']) {
      alert(currentLocale === 'hi' ? "कृपया छात्र की फोटो अपलोड करें।" : "Please upload the Student Photo.");
      return false;
    }
  }
  return true;
}

function navigateWizard(offset) {
  if (offset === 1) {
    if (!validateWizardStep(admissionsWizardStep)) return;
    admissionsWizardStep = Math.min(4, admissionsWizardStep + 1);
  } else {
    admissionsWizardStep = Math.max(1, admissionsWizardStep - 1);
  }
  updateWizardVisuals();
}

// Simulated file selector upload callback
function triggerMockUpload(docType) {
  // Simulate clicking a file and selecting a dummy proof file
  const mockFiles = {
    birthCert: ["birth_certificate_scan.pdf", "birth_cert_official.png"],
    studentPhoto: ["aarav_passport_size.jpg", "student_portrait.png"]
  };
  
  const chosenArray = mockFiles[docType];
  const selectedName = chosenArray[Math.floor(Math.random() * chosenArray.length)];

  uploadedDocuments[docType] = selectedName;

  // Update label
  const label = document.getElementById('lbl-' + docType);
  if (label) {
    label.innerHTML = `<span style="color:var(--success); font-weight:700;"><i class="ti ti-circle-check"></i> ${selectedName}</span>`;
  }

  // Render attachment list
  renderAttachmentList();
}

function renderAttachmentList() {
  const list = document.getElementById('uploadedFilesList');
  if (!list) return;

  list.innerHTML = '';
  const keys = Object.keys(uploadedDocuments);
  if (keys.length === 0) {
    list.style.display = 'none';
    return;
  }

  list.style.display = 'flex';
  keys.forEach(k => {
    const row = document.createElement('div');
    row.className = 'uploaded-file-row';
    const labelText = k === 'birthCert' ? 'Birth Certificate' : 'Student Photo';
    row.innerHTML = `
      <span class="uploaded-file-name"><i class="ti ti-paperclip"></i> ${labelText}: ${uploadedDocuments[k]}</span>
      <button type="button" class="remove-file-btn" onclick="removeUploadedDoc('${k}')"><i class="ti ti-trash"></i></button>
    `;
    list.appendChild(row);
  });
}

function removeUploadedDoc(key) {
  delete uploadedDocuments[key];
  const label = document.getElementById('lbl-' + key);
  if (label) {
    label.innerText = currentLocale === 'hi' ? "फाइल अपलोड करने के लिए क्लिक करें" : "Click to upload file";
  }
  renderAttachmentList();
}

// Generate Wizard Step 4 Summary
function renderAdmissionsReviewSummary() {
  const box = document.getElementById('admissionReviewBox');
  if (!box) return;

  const sName = document.getElementById('admStudentName').value;
  const sDob = document.getElementById('admStudentDOB').value;
  const sGender = document.getElementById('admStudentGender').value;
  const sGrade = document.getElementById('admGradeApplied').value;
  
  const pName = document.getElementById('admParentName').value;
  const pMother = document.getElementById('admMotherName').value;
  const pPhone = document.getElementById('admPhone').value;
  const pEmail = document.getElementById('admEmail').value;
  const pAddr = document.getElementById('admAddress').value;

  box.innerHTML = `
    <div class="review-section-title">${currentLocale === 'hi' ? 'छात्र का व्यक्तिगत विवरण' : 'Student Candidate Information'}</div>
    <div class="review-grid">
      <div class="review-label">${currentLocale === 'hi' ? 'पूरा नाम' : 'Full Name'}:</div><div class="review-val">${sName}</div>
      <div class="review-label">${currentLocale === 'hi' ? 'जन्म तिथि' : 'DOB'}:</div><div class="review-val">${formatDisplayDate(sDob)}</div>
      <div class="review-label">${currentLocale === 'hi' ? 'लिंग' : 'Gender'}:</div><div class="review-val">${sGender}</div>
      <div class="review-label">${currentLocale === 'hi' ? 'प्रवेश कक्षा' : 'Class Grade'}:</div><div class="review-val">${sGrade}</div>
    </div>

    <div class="review-section-title" style="margin-top:20px;">${currentLocale === 'hi' ? 'माता-पिता / अभिभावक का विवरण' : 'Parent & Address Information'}</div>
    <div class="review-grid">
      <div class="review-label">${currentLocale === 'hi' ? 'पिता का नाम' : 'Father Name'}:</div><div class="review-val">${pName}</div>
      <div class="review-label">${currentLocale === 'hi' ? 'माता का नाम' : 'Mother Name'}:</div><div class="review-val">${pMother}</div>
      <div class="review-label">${currentLocale === 'hi' ? 'फोन नंबर' : 'Phone'}:</div><div class="review-val">${pPhone}</div>
      <div class="review-label">${currentLocale === 'hi' ? 'ईमेल आईडी' : 'Email Address'}:</div><div class="review-val">${pEmail}</div>
      <div class="review-label">${currentLocale === 'hi' ? 'आवासीय पता' : 'Home Address'}:</div><div class="review-val">${pAddr}</div>
    </div>

    <div class="review-section-title" style="margin-top:20px;">${currentLocale === 'hi' ? 'अपलोड किए गए दस्तावेज़' : 'Attached Digital Documents'}</div>
    <div class="review-grid">
      <div class="review-label">Birth Proof:</div><div class="review-val">${uploadedDocuments['birthCert']}</div>
      <div class="review-label">Photo Card:</div><div class="review-val">${uploadedDocuments['studentPhoto']}</div>
    </div>
  `;
}

// Final submission logic
async function handleAdmissionSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('admStudentName').value.trim();
  const dob = document.getElementById('admStudentDOB').value;
  const gender = document.getElementById('admStudentGender').value;
  const classLevel = document.getElementById('admGradeApplied').value;
  const fatherName = document.getElementById('admParentName').value.trim();
  const motherName = document.getElementById('admMotherName').value.trim();
  const contactNo = document.getElementById('admPhone').value.trim();
  const email = document.getElementById('admEmail').value.trim();
  const address = document.getElementById('admAddress').value.trim();
  const academicYear = "2025-26";

  try {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        fatherName,
        motherName,
        address,
        contactNo,
        academicYear,
        classLevel
      })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to submit admission application.");
      return;
    }

    // Render receipt layout
    renderSubmissionReceipt({
      refNo: data.referenceId,
      studentName: data.name,
      grade: data.classLevel,
      parentName: data.fatherName,
      phone: data.contactNo,
      dateSubmitted: data.createdAt
    });

    // Transition screens
    document.getElementById('admissionsOpenScreen').style.display = 'none';
    document.getElementById('admissionsReceiptScreen').style.display = 'block';

    alert(currentLocale === 'hi' 
      ? `आवेदन सफलतापूर्वक दर्ज किया गया! संदर्भ संख्या: ${data.referenceId}` 
      : `Application Registered! Reference Number: ${data.referenceId}`
    );
  } catch (error) {
    console.error('Admission submit error:', error);
    alert("Connection to backend database failed.");
  }
}

function renderSubmissionReceipt(app) {
  const container = document.getElementById('receiptCardContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="receipt-icon">🎉</div>
    <h3 style="font-size: 16px; margin-bottom: 5px;">Reference Application ID</h3>
    <div class="receipt-ref">${app.refNo}</div>
    <p style="font-size:12px; color:var(--slate); margin-bottom:15px;" data-i18n="receipt_p_note">Save this reference number for checking admission eligibility results.</p>
    
    <div class="receipt-details">
      <div class="receipt-row">
        <span class="receipt-label">Student Name:</span>
        <span>${app.studentName}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Applied Grade:</span>
        <span>${app.grade}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Parent Name:</span>
        <span>${app.parentName}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Contact Phone:</span>
        <span>${app.phone}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Date Submitted:</span>
        <span>${formatDisplayDate(app.dateSubmitted)}</span>
      </div>
    </div>
    
    <button class="btn btn-secondary" onclick="window.print()" style="padding:6px 14px; font-size:11px; width:100%;"><i class="ti ti-printer"></i> Print Receipt Card</button>
  `;
}

function resetAdmissionPortal() {
  document.getElementById('admissionsReceiptScreen').style.display = 'none';
  document.getElementById('admissionsOpenScreen').style.display = 'block';
  resetAdmissionWizard();
}

// Simulated Enquiry Form submit
function handleEnquirySubmit(event) {
  event.preventDefault();
  const name = document.getElementById('enqName').value;
  alert(currentLocale === 'hi' 
    ? `धन्यवाद ${name}, आपकी पूछताछ स्कूल कार्यालय को भेज दी गई है।` 
    : `Thank you ${name}, your enquiry has been submitted. Our admissions counselor will call you back shortly.`
  );
  document.getElementById('enquiryForm').reset();
}

function handleWardenInquiry(event) {
  event.preventDefault();
  const parentName = document.getElementById('wardenParentName').value.trim();
  const contact = document.getElementById('wardenContact').value.trim();
  const className = document.getElementById('wardenClass').value;
  const query = document.getElementById('wardenQuery').value.trim();

  alert(`Thank you, Mr./Ms. ${parentName}. Your inquiry regarding class ${className} boarding has been successfully received by the hostel warden. We will contact you at ${contact} shortly.`);
  event.target.reset();
}

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api';

const MEDIA_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : '';

function getAuthHeader() {
  const token = sessionStorage.getItem('khis_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();
  const pass = document.getElementById('adminPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password: pass })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Incorrect username or password.");
      return;
    }

    sessionStorage.setItem('khis_token', data.token);
    adminSession = { loggedIn: true, username: data.username, role: data.role, time: new Date().getTime() };
    sessionStorage.setItem('khis_admin_session', JSON.stringify(adminSession));
    adminRole = data.role;

    document.getElementById('adminAuthScreen').style.display = 'none';
    document.getElementById('adminDashboardLayout').style.display = 'grid';
    
    switchAdminSubView('admin-ov', document.querySelector('[data-view="admin-ov"]'));
    renderAdminDashboardView();
  } catch (error) {
    console.error('Admin login error:', error);
    alert("Connection to backend database failed. Make sure server.js is running.");
  }
}

function handleAdminLogout() {
  adminSession = null;
  sessionStorage.removeItem('khis_admin_session');
  sessionStorage.removeItem('khis_token');
  document.getElementById('adminAuthScreen').style.display = 'block';
  document.getElementById('adminDashboardLayout').style.display = 'none';
  window.location.hash = '#/home';
}

async function renderAdminDashboardView() {
  if (!adminSession) {
    document.getElementById('adminAuthScreen').style.display = 'block';
    document.getElementById('adminDashboardLayout').style.display = 'none';
    return;
  }

  // Real-time JWT Token Verification (demands credentials if token expired/invalid)
  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: getAuthHeader()
    });
    if (!res.ok) {
      console.warn("Session expired or token invalid. Clearing session...");
      handleAdminLogout();
      return;
    }
  } catch (error) {
    console.error("Failed to verify session token with server:", error);
    handleAdminLogout();
    return;
  }

  document.getElementById('adminAuthScreen').style.display = 'none';
  document.getElementById('adminDashboardLayout').style.display = 'grid';

  // Sync profile details
  if (currentLocale === 'hi') {
    document.getElementById('adminUserDisplayName').innerText = adminRole === 'Super Admin' ? 'मुख्य प्रशासक' : 'सामग्री संपादक';
    document.getElementById('adminUserDisplayRole').innerText = adminRole === 'Super Admin' ? 'सुपर एडमिन' : 'कंटेंट एडिटर';
  } else {
    document.getElementById('adminUserDisplayName').innerText = adminRole === 'Super Admin' ? 'Super Administrator' : 'Content Editor';
    document.getElementById('adminUserDisplayRole').innerText = adminRole;
  }

  // Sync general statistics counters
  document.getElementById('statAppCount').innerText = state.applications.length;
  document.getElementById('statNoticeCount').innerText = state.notices.length;
  document.getElementById('statEventCount').innerText = state.events.length;
  document.getElementById('statAlbumCount').innerText = state.albums.length;

  // Sync admissions switch toggle
  const toggle = document.getElementById('admissionsStatusToggle');
  if (toggle) {
    toggle.checked = state.settings.admissionsOpen;
    // Disable admissions toggle if content editor
    if (adminRole === 'Content Editor') {
      toggle.disabled = true;
    } else {
      toggle.disabled = false;
    }
  }

  // Populate tables
  renderAdminNoticesTable();
  renderAdminEventsTable();
  renderAdminApplicationsTable();
}

function switchAdminSubView(viewId, sidebarBtn) {
  // Set active sidebar button styling
  const btns = document.querySelectorAll('.admin-sidebar-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (sidebarBtn) sidebarBtn.classList.add('active');

  // Toggle active view panel
  const panels = document.querySelectorAll('.admin-view-panel');
  panels.forEach(p => {
    if (p.id === viewId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  // Lazy-load data based on sub-view
  if (viewId === 'admin-apps') {
    loadAdminApplications();
  } else if (viewId === 'admin-students') {
    loadAdminStudents();
  } else if (viewId === 'admin-fees') {
    loadAdminFees();
  } else if (viewId === 'admin-media') {
    loadAdminMedia();
  } else if (viewId === 'admin-faculty') {
    loadAdminFaculties();
  }

  // Guard settings form based on role
  if (viewId === 'admin-settings') {
    const settingsCard = document.getElementById('adminSettingsFormCard');
    if (adminRole === 'Content Editor') {
      settingsCard.style.opacity = '0.5';
      settingsCard.style.pointerEvents = 'none';
      alert("Notice: Content Editors do not have clearance to modify System Settings.");
    } else {
      settingsCard.style.opacity = '1';
      settingsCard.style.pointerEvents = 'all';
    }
  }
}

// Access tier setter callback
function setAdminTier(role) {
  adminRole = role;
  
  // Update state buttons active highlights
  const filterBtns = document.querySelectorAll('#admin-ov .filter-btn');
  filterBtns.forEach(btn => {
    if (btn.innerText === role) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderAdminDashboardView();
  alert(`Access Tier changed to: ${role}`);
}

// Toggles Admission Switch in real-time
function toggleAdmissionsStatusState(isOpen) {
  if (adminRole === 'Content Editor') {
    alert("Insufficient clearance: Only Super Admin can toggle admission cycles.");
    document.getElementById('admissionsStatusToggle').checked = state.settings.admissionsOpen;
    return;
  }

  state.settings.admissionsOpen = isOpen;
  saveState();
  
  const word = isOpen ? "OPENED" : "CLOSED";
  alert(`Master Admissions portal is now ${word} in real-time.`);
  
  // Instantly sync the admissions public view if already open
  setupAdmissionsView();
}

// Admin Notices CRUD Table
function renderAdminNoticesTable() {
  const tbody = document.getElementById('adminNoticesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  state.notices.forEach(n => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDisplayDate(n.date)}</td>
      <td><span class="notice-badge ${n.category.toLowerCase()}" style="font-size:10px;">${n.category}</span></td>
      <td style="font-weight:700;">${n.title_en}</td>
      <td style="color:var(--slate);">${n.title_hi}</td>
      <td style="text-align:right;">
        <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--danger); border-color:transparent;" onclick="deleteNoticeItem('${n.id}')"><i class="ti ti-trash"></i> Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openNoticeModal() {
  document.getElementById('adminNoticeForm').reset();
  // Pre-seed today
  document.getElementById('notDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('adminNoticeModal').classList.add('active');
}

function closeNoticeModal() {
  document.getElementById('adminNoticeModal').classList.remove('active');
}

function saveNoticeItem(event) {
  event.preventDefault();
  
  const newNotice = {
    id: 'n-' + (state.notices.length + 10),
    date: document.getElementById('notDate').value,
    category: document.getElementById('notCategory').value,
    title_en: document.getElementById('notTitleEn').value.trim(),
    title_hi: document.getElementById('notTitleHi').value.trim(),
    content_en: document.getElementById('notContentEn').value.trim(),
    content_hi: document.getElementById('notContentHi').value.trim(),
    isNew: true
  };

  state.notices.unshift(newNotice);
  saveState();
  closeNoticeModal();
  renderAdminDashboardView();
  renderTranslations(); // Re-render public notice boards
  alert("Notice published successfully!");
}

function deleteNoticeItem(id) {
  if (confirm("Are you sure you want to delete this notice announcement?")) {
    state.notices = state.notices.filter(n => n.id !== id);
    saveState();
    renderAdminDashboardView();
    renderTranslations();
  }
}

// Admin Events CRUD Table
function renderAdminEventsTable() {
  const tbody = document.getElementById('adminEventsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  state.events.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDisplayDate(e.date)}</td>
      <td><span style="font-size:10px; font-weight:700; color:var(--orange); text-transform:uppercase;">${e.category}</span></td>
      <td style="font-weight:700;">${e.title_en}</td>
      <td style="color:var(--slate);">${e.location_en}</td>
      <td style="text-align:right;">
        <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--danger); border-color:transparent;" onclick="deleteEventItem('${e.id}')"><i class="ti ti-trash"></i> Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openEventModal() {
  document.getElementById('adminEventForm').reset();
  document.getElementById('eveDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('adminEventModal').classList.add('active');
}

function closeEventModal() {
  document.getElementById('adminEventModal').classList.remove('active');
}

function saveEventItem(event) {
  event.preventDefault();

  const newEvent = {
    id: 'e-' + (state.events.length + 10),
    date: document.getElementById('eveDate').value,
    category: document.getElementById('eveCategory').value,
    title_en: document.getElementById('eveTitleEn').value.trim(),
    title_hi: document.getElementById('eveTitleHi').value.trim(),
    location_en: document.getElementById('eveLocEn').value.trim(),
    location_hi: document.getElementById('eveLocHi').value.trim(),
    description_en: document.getElementById('eveDescEn').value.trim(),
    description_hi: document.getElementById('eveDescHi').value.trim()
  };

  state.events.push(newEvent);
  saveState();
  closeEventModal();
  renderAdminDashboardView();
  renderTranslations();
  alert("Calendar event created successfully!");
}

function deleteEventItem(id) {
  if (confirm("Are you sure you want to remove this event from calendar?")) {
    state.events = state.events.filter(e => e.id !== id);
    saveState();
    renderAdminDashboardView();
    renderTranslations();
  }
}

// Admin Applications Registry Manager
async function loadAdminApplications() {
  const tbody = document.getElementById('adminApplicationsTableBody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--slate);">Loading applications...</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/students`, {
      headers: getAuthHeader()
    });

    const applications = await res.json();
    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--danger);">Failed to load registry.</td></tr>`;
      return;
    }

    if (applications.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--slate);">No admission applications found.</td></tr>`;
      return;
    }

    state.applications = applications;

    let html = '';
    applications.forEach(app => {
      let statusClass = 'status-pending';
      if (app.status.toLowerCase() === 'approved') statusClass = 'status-approved';
      if (app.status.toLowerCase() === 'rejected') statusClass = 'status-rejected';
      if (app.status.toLowerCase() === 'under review') statusClass = 'status-review';

      html += `
        <tr>
          <td style="font-family:var(--font-heading); font-weight:800; color:var(--orange);">${app.referenceId}</td>
          <td style="font-weight:700;">${app.name}</td>
          <td>${app.classLevel}</td>
          <td>${app.contactNo}</td>
          <td>${formatDisplayDate(app.createdAt)}</td>
          <td><span class="admin-badge ${statusClass}">${app.status}</span></td>
          <td style="text-align:right; display:flex; justify-content:flex-end; gap:6px;">
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="viewApplicationDetailCard('${app.referenceId}')"><i class="ti ti-eye"></i> View</button>
            <select class="form-input" style="padding: 2px 6px; font-size:11px; border-radius:6px; cursor:pointer;" onchange="updateApplicationStatus(${app.id}, this.value)">
              <option value="" disabled selected>Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approve</option>
              <option value="Rejected">Reject</option>
            </select>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  } catch (error) {
    console.error('Error loading admin applications:', error);
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--danger);">Error connecting to database.</td></tr>`;
  }
}

function renderAdminApplicationsTable() {
  loadAdminApplications();
}

function viewApplicationDetailCard(referenceId) {
  const app = state.applications.find(a => a.referenceId === referenceId);
  if (!app) return;

  const modal = document.getElementById('adminAppDetailModal');
  const body = document.getElementById('adminAppDetailBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3 style="color:var(--orange); font-size:16px;">Reference Number: ${app.referenceId}</h3>
      <span class="admin-badge status-pending" style="padding:4px 10px; font-size:12px;">${app.status}</span>
    </div>
    
    <div class="review-box">
      <div class="review-section-title">1. Student Details</div>
      <div class="review-grid">
        <div class="review-label">Full Name:</div><div class="review-val">${app.name}</div>
        <div class="review-label">Applied Session:</div><div class="review-val">${app.academicYear}</div>
        <div class="review-label">Applied Grade:</div><div class="review-val">${app.classLevel}</div>
      </div>
    </div>

    <div class="review-box">
      <div class="review-section-title">2. Parent & Contact details</div>
      <div class="review-grid">
        <div class="review-label">Father Name:</div><div class="review-val">${app.fatherName}</div>
        <div class="review-label">Mother Name:</div><div class="review-val">${app.motherName}</div>
        <div class="review-label">Contact Phone:</div><div class="review-val">${app.contactNo}</div>
        <div class="review-label">Home Address:</div><div class="review-val">${app.address}</div>
      </div>
    </div>

    <div class="review-box">
      <div class="review-section-title">3. Registration Proofs</div>
      <div class="uploaded-files-list" style="display:flex; margin:0;">
        <span class="uploaded-file-row" style="margin:0;"><i class="ti ti-circle-check" style="color:var(--success);"></i> Attachment Proof: Digital Application Record Verified</span>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeAppDetailModal() {
  const modal = document.getElementById('adminAppDetailModal');
  if (modal) modal.classList.remove('active');
}

async function updateApplicationStatus(id, statusVal) {
  try {
    const res = await fetch(`${API_BASE}/students/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status: statusVal })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to update status.");
      return;
    }

    alert(`Application Status for ${data.referenceId} has been changed to: ${statusVal}`);
    loadAdminApplications();
  } catch (error) {
    console.error('Error updating application status:', error);
    alert("Connection error. Failed to update status.");
  }
}

// EXPORT TO EXCEL COMPATIBLE CSV DOWNLOADER
function exportApplicationsToCSV() {
  if (state.applications.length === 0) {
    alert("Database is currently empty. No entries to export.");
    return;
  }

  // Construct CSV Header
  const csvHeaders = ["Reference Number", "Student Name", "Date of Birth", "Gender", "Grade Applied For", "Parent Name", "Parent Email", "Phone", "Residential Address", "Status", "Date Submitted"];
  
  // Construct CSV Rows
  const csvRows = state.applications.map(app => {
    return [
      app.refNo,
      escapeCSVValue(app.studentName),
      app.dob,
      app.gender,
      app.grade,
      escapeCSVValue(app.parentName),
      app.parentEmail,
      app.phone,
      escapeCSVValue(app.address),
      app.status,
      app.dateSubmitted
    ].join(',');
  });

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.setAttribute('download', `admission_applications_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  URL.revokeObjectURL(url);
}

function escapeCSVValue(val) {
  if (!val) return '""';
  // Wrap in quotes if it contains commas or newlines
  const str = String(val).replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

// Update settings details (Super Admin Only)
function handleSettingsUpdate(event) {
  event.preventDefault();
  
  if (adminRole === 'Content Editor') {
    alert("Clearance check failed: Only Super Admin can change settings.");
    return;
  }

  const phone = document.getElementById('setPhone').value.trim();
  const email = document.getElementById('setEmail').value.trim();
  const addressEn = document.getElementById('setAddressEn').value.trim();
  const addressHi = document.getElementById('setAddressHi').value.trim();
  const mapSource = document.getElementById('setMapPin').value.trim();

  state.settings.contactInfo = {
    phone: phone,
    email: email,
    address_en: addressEn,
    address_hi: addressHi,
    mapPin: mapSource
  };

  saveState();

  // Update public contact page details in real-time
  document.getElementById('schoolMapEmbed').src = mapSource;
  
  alert("School profile settings updated successfully across the entire site!");
  
  renderTranslations(); // Re-render translations
}

// ── SYSTEM THEME ENGINE ──
let currentThemeSetting = 'system'; // 'light' | 'dark' | 'system'

window.toggleThemeDropdown = function() {
  const dropdown = document.getElementById('themeDropdown');
  if (dropdown) dropdown.classList.toggle('active');
};

// Close dropdown on click outside
window.addEventListener('click', (e) => {
  const selector = document.querySelector('.theme-selector');
  const dropdown = document.getElementById('themeDropdown');
  if (selector && dropdown && !selector.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

window.changeTheme = function(theme) {
  currentThemeSetting = theme;
  localStorage.setItem('khis_theme', theme);
  applyThemeSetting();
  
  const dropdown = document.getElementById('themeDropdown');
  if (dropdown) dropdown.classList.remove('active');
};

function applyThemeSetting() {
  const root = document.documentElement;
  const icon = document.getElementById('themeIcon');
  let effectiveTheme = currentThemeSetting;
  
  if (currentThemeSetting === 'system') {
    const isDarkOS = window.matchMedia('(prefers-color-scheme: dark)').matches;
    effectiveTheme = isDarkOS ? 'dark' : 'light';
  }
  
  if (effectiveTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  
  // Update icon in navbar
  if (icon) {
    if (currentThemeSetting === 'light') {
      icon.className = 'ti ti-sun';
    } else if (currentThemeSetting === 'dark') {
      icon.className = 'ti ti-moon';
    } else {
      icon.className = 'ti ti-device-laptop';
    }
  }
}

// Watch system OS color scheme changes if set to system
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (currentThemeSetting === 'system') {
    applyThemeSetting();
  }
});

function initializeTheme() {
  const savedTheme = localStorage.getItem('khis_theme') || 'system';
  currentThemeSetting = savedTheme;
  applyThemeSetting();
}

// ── UTILITY HELPERS ──
function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  if (currentLocale === 'hi') {
    // Basic custom Hindi formatting
    const hindiMonths = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
    return `${dateObj.getDate()} ${hindiMonths[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  }
  return dateObj.toLocaleDateString('en-US', options);
}

// State variables for bilingual fee structures
let currentPublicFeeMedium = 'English';
let currentAdminFeeMedium = 'English';

async function loadPublicFees() {
  const tbody = document.getElementById('publicFeeStructureTableBody');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/fees?medium=${currentPublicFeeMedium}`);
    const fees = await res.json();
    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--danger);">Failed to load fees.</td></tr>`;
      return;
    }

    if (fees.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--slate);">No fee records found.</td></tr>`;
      return;
    }

    let html = '';
    fees.forEach(f => {
      const totalFirstQuarter = f.admissionFee + (f.tuitionFee * 3) + f.developmentFee + f.annualCharges;
      html += `
        <tr>
          <td style="font-weight:700; color:var(--navy);">${f.classLevel}</td>
          <td>₹${f.admissionFee.toLocaleString('en-IN')}</td>
          <td>₹${f.tuitionFee.toLocaleString('en-IN')} / Mo</td>
          <td>₹${f.developmentFee.toLocaleString('en-IN')}</td>
          <td>₹${f.annualCharges.toLocaleString('en-IN')}</td>
          <td style="font-weight:800; color:var(--orange);">₹${totalFirstQuarter.toLocaleString('en-IN')}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  } catch (error) {
    console.error('Error loading public fees:', error);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--danger);">Error connecting to backend database.</td></tr>`;
  }
}

async function loadAdminFees() {
  const tbody = document.getElementById('adminFeesTableBody');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/fees?medium=${currentAdminFeeMedium}`);
    const fees = await res.json();
    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--danger);">Failed to load fee records.</td></tr>`;
      return;
    }

    if (fees.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--slate);">No fee records found.</td></tr>`;
      return;
    }

    let html = '';
    fees.forEach(f => {
      html += `
        <tr id="fee-row-${f.id}">
          <td style="font-weight:700; vertical-align: middle;">${f.classLevel}</td>
          <td><input type="number" class="form-input" style="padding: 4px 8px; font-size:12px; margin:0;" id="fee-adm-${f.id}" value="${f.admissionFee}"></td>
          <td><input type="number" class="form-input" style="padding: 4px 8px; font-size:12px; margin:0;" id="fee-tui-${f.id}" value="${f.tuitionFee}"></td>
          <td><input type="number" class="form-input" style="padding: 4px 8px; font-size:12px; margin:0;" id="fee-dev-${f.id}" value="${f.developmentFee}"></td>
          <td><input type="number" class="form-input" style="padding: 4px 8px; font-size:12px; margin:0;" id="fee-ann-${f.id}" value="${f.annualCharges}"></td>
          <td style="text-align:center; vertical-align: middle;">
            <button class="btn btn-primary" style="padding: 4px 10px; font-size:11px;" onclick="saveAdminFee(${f.id})"><i class="ti ti-device-floppy"></i> Save</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  } catch (error) {
    console.error('Error loading admin fees:', error);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--danger);">Connection error.</td></tr>`;
  }
}

async function saveAdminFee(id) {
  const admissionFee = parseFloat(document.getElementById(`fee-adm-${id}`).value);
  const tuitionFee = parseFloat(document.getElementById(`fee-tui-${id}`).value);
  const developmentFee = parseFloat(document.getElementById(`fee-dev-${id}`).value);
  const annualCharges = parseFloat(document.getElementById(`fee-ann-${id}`).value);

  if (isNaN(admissionFee) || isNaN(tuitionFee) || isNaN(developmentFee) || isNaN(annualCharges)) {
    alert("Please enter valid numeric values for all fee fields.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/fees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ admissionFee, tuitionFee, developmentFee, annualCharges })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to update fee record.");
      return;
    }

    alert(`Fee structure for ${data.classLevel} updated successfully!`);
    loadPublicFees();
    loadAdminFees();
  } catch (error) {
    console.error('Error saving admin fee:', error);
    alert("Failed to save changes. Check database connection.");
  }
}

function changePublicFeeMedium(medium) {
  currentPublicFeeMedium = medium;
  
  // Update active tab styles
  const tabs = document.querySelectorAll('.medium-tabs-public .btn-medium-tab');
  tabs.forEach(tab => {
    if (tab.id === `public-fee-tab-${medium}`) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  loadPublicFees();
}

function changeAdminFeeMedium(medium) {
  currentAdminFeeMedium = medium;

  // Update active tab styles
  const tabs = document.querySelectorAll('.medium-tabs-admin .btn-medium-tab');
  tabs.forEach(tab => {
    if (tab.id === `admin-fee-tab-${medium}`) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  loadAdminFees();
}

async function loadPublicGalleryDbMedia() {
  try {
    const res = await fetch(`${API_BASE}/media`);
    const media = await res.json();
    if (!res.ok) return;

    // Filter out previously injected dynamic database albums from state.albums to avoid duplicates
    state.albums = state.albums.filter(al => !al.id.startsWith('db-'));

    // Filter and group dynamic media items from Neon tech PostgreSQL
    const sportsImages = media.filter(m => m.category === 'gallery-sports');
    const culturalImages = media.filter(m => m.category === 'gallery-cultural');
    const exhibitionImages = media.filter(m => m.category === 'gallery-exhibitions');

    if (sportsImages.length > 0) {
      state.albums.push({
        id: "db-sports",
        year: "2026",
        category: "Sports",
        title_en: "Live Inter-Sports Day Updates",
        title_hi: "लाइव इंटर-स्पोर्ट्स डे अपडेट",
        coverImage: sportsImages[0].url.startsWith('/') ? MEDIA_BASE + sportsImages[0].url : sportsImages[0].url,
        description_en: "Recent track, field, and athletics photos uploaded dynamically by administrators.",
        description_hi: "प्रशासकों द्वारा गतिशील रूप से अपलोड की गई हालिया ट्रैक, फील्ड और एथलेटिक्स तस्वीरें।",
        images: sportsImages.map(img => ({
          url: img.url.startsWith('/') ? MEDIA_BASE + img.url : img.url,
          caption_en: img.title || 'Live Sports Capture',
          caption_hi: img.title || 'लाइव स्पोर्ट्स कैप्चर'
        }))
      });
    }

    if (culturalImages.length > 0) {
      state.albums.push({
        id: "db-cultural",
        year: "2026",
        category: "Cultural",
        title_en: "Annual Function Live Highlights",
        title_hi: "वार्षिक समारोह लाइव मुख्य विशेषताएं",
        coverImage: culturalImages[0].url.startsWith('/') ? MEDIA_BASE + culturalImages[0].url : culturalImages[0].url,
        description_en: "Live stage performances, classical dance, and annual day moments uploaded directly.",
        description_hi: "लाइव स्टेज प्रदर्शन, शास्त्रीय नृत्य और वार्षिक दिवस के क्षण सीधे अपलोड किए गए।",
        images: culturalImages.map(img => ({
          url: img.url.startsWith('/') ? MEDIA_BASE + img.url : img.url,
          caption_en: img.title || 'Annual Function Capture',
          caption_hi: img.title || 'वार्षिक समारोह कैप्चर'
        }))
      });
    }

    if (exhibitionImages.length > 0) {
      state.albums.push({
        id: "db-exhibitions",
        year: "2026",
        category: "Exhibitions",
        title_en: "Exhibitions & Projects Live",
        title_hi: "प्रदर्शनियां और प्रोजेक्ट्स लाइव",
        coverImage: exhibitionImages[0].url.startsWith('/') ? MEDIA_BASE + exhibitionImages[0].url : exhibitionImages[0].url,
        description_en: "Live science expo and academic models showcase uploaded in real-time.",
        description_hi: "वास्तविक समय में अपलोड किए गए लाइव विज्ञान एक्सपो और शैक्षणिक मॉडल का प्रदर्शन।",
        images: exhibitionImages.map(img => ({
          url: img.url.startsWith('/') ? MEDIA_BASE + img.url : img.url,
          caption_en: img.title || 'Exhibition Showcase',
          caption_hi: img.title || 'प्रदर्शनी लाइव'
        }))
      });
    }

    // Dynamic handling for custom gallery categories
    const defaultGalleryCats = ['gallery-sports', 'gallery-cultural', 'gallery-exhibitions'];
    const customCategories = JSON.parse(localStorage.getItem('khis_custom_media_categories')) || [];
    
    // Find all unique custom gallery categories in the fetched media
    const allGalleryCats = [...new Set(media.map(m => m.category).filter(cat => cat.startsWith('gallery-') && !defaultGalleryCats.includes(cat)))];

    allGalleryCats.forEach(catValue => {
      const catImages = media.filter(m => m.category === catValue);
      if (catImages.length > 0) {
        const matchedCustom = customCategories.find(c => c.value === catValue);
        const catLabel = matchedCustom ? matchedCustom.label : catValue.replace('gallery-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        state.albums.push({
          id: `db-${catValue}`,
          year: "2026",
          category: catLabel,
          title_en: `${catLabel} Moments`,
          title_hi: `${catLabel} के क्षण`,
          coverImage: catImages[0].url.startsWith('/') ? MEDIA_BASE + catImages[0].url : catImages[0].url,
          description_en: `Photos from ${catLabel} events uploaded dynamically by administrators.`,
          description_hi: `प्रशासकों द्वारा गतिशील रूप से अपलोड की गई ${catLabel} कार्यक्रमों की तस्वीरें।`,
          images: catImages.map(img => ({
            url: img.url.startsWith('/') ? MEDIA_BASE + img.url : img.url,
            caption_en: img.title || `${catLabel} Capture`,
            caption_hi: img.title || `${catLabel} कैप्चर`
          }))
        });
      }
    });

    // Call the core albums grid rendering
    renderGalleryAlbums();
  } catch (error) {
    console.error('Error grouping database gallery albums:', error);
  }
}

async function loadPublicVideos() {
  const track = document.getElementById('ytCarouselTrack');
  if (!track) return;

  try {
    const res = await fetch(`${API_BASE}/media?category=video-gallery`);
    const media = await res.json();
    if (!res.ok) return;

    // Standard static videos from mockup
    const staticVideos = [
      {
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        cover: 'assets/campus_cover.jpg',
        title: 'Official School Campus Tour',
        desc: 'Explore our top-tier academic blocks, hostels, and learning zones.'
      },
      {
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        cover: 'assets/hostel.jpg',
        title: 'Premium Hostel & Boarding Tour',
        desc: 'A look inside our safe, comfortable, and collaborative student housing.'
      },
      {
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        cover: 'assets/bus.jpg',
        title: 'GPS Smart Bus System',
        desc: 'Discover our modern, secured, and comfortable bus fleet.'
      },
      {
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        cover: 'assets/labs.jpg',
        title: 'Advanced Computer & STEM Labs',
        desc: 'Witness student coding, experimentations, and IoT robotics zones.'
      }
    ];

    let html = '';
    
    // Render dynamic videos from database first
    media.forEach(m => {
      const isDirectVideo = m.url.endsWith('.mp4') || m.url.endsWith('.webm') || m.url.endsWith('.ogg');
      const videoUrl = m.url.startsWith('/') ? MEDIA_BASE + m.url : m.url;
      const isImage = !isDirectVideo;
      const coverUrl = isImage ? videoUrl : 'assets/campus_cover.jpg';

      html += `
        <div class="yt-card" onclick="openYtVideoModal('${videoUrl}')">
          <div class="yt-thumb" style="background-image: url('${coverUrl}');">
            <div class="yt-play-btn"><i class="ti ti-player-play-filled"></i></div>
          </div>
          <div class="yt-caption">
            <h4>${m.title || 'Live Campus Video'}</h4>
            <p>${m.title ? 'Dynamic walk-through uploaded by administrator.' : 'Live campus highlight.'}</p>
          </div>
        </div>
      `;
    });

    // Render standard YouTube videos
    staticVideos.forEach(v => {
      html += `
        <div class="yt-card" onclick="openYtVideoModal('${v.url}')">
          <div class="yt-thumb" style="background-image: url('${v.cover}');">
            <div class="yt-play-btn"><i class="ti ti-player-play-filled"></i></div>
          </div>
          <div class="yt-caption">
            <h4>${v.title}</h4>
            <p>${v.desc}</p>
          </div>
        </div>
      `;
    });

    track.innerHTML = html;
  } catch (error) {
    console.error('Error loading public videos in carousel:', error);
  }
}

async function loadAdminStudents() {
  const tbody = document.getElementById('adminStudentsTableBody');
  if (!tbody) return;

  const academicYear = document.getElementById('filterStudentYear').value;
  const classLevel = document.getElementById('filterStudentClass').value;

  tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--slate);">Loading student records...</td></tr>`;

  try {
    let query = `?academicYear=${academicYear}`;
    if (classLevel && classLevel !== 'all') {
      query += `&classLevel=${classLevel}`;
    }

    const res = await fetch(`${API_BASE}/students${query}`, {
      headers: getAuthHeader()
    });
    
    const students = await res.json();
    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--danger);">${students.error || "Failed to load student registers."}</td></tr>`;
      return;
    }

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--slate);">No student admissions found for session ${academicYear}${classLevel !== 'all' ? ` in ${classLevel}` : ''}.</td></tr>`;
      return;
    }

    let html = '';
    students.forEach(s => {
      let statusClass = 'status-pending';
      if (s.status.toLowerCase() === 'approved') statusClass = 'status-approved';
      if (s.status.toLowerCase() === 'rejected') statusClass = 'status-rejected';
      if (s.status.toLowerCase() === 'under review') statusClass = 'status-review';

      html += `
        <tr>
          <td style="font-family:var(--font-heading); font-weight:800; color:var(--orange);">${s.referenceId}</td>
          <td style="font-weight:700;">${s.name}</td>
          <td>${s.fatherName}</td>
          <td>${s.motherName}</td>
          <td>${s.contactNo}</td>
          <td>${s.classLevel}</td>
          <td><span class="admin-badge ${statusClass}">${s.status}</span></td>
          <td>
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--danger); border-color:transparent;" onclick="deleteStudent(${s.id})"><i class="ti ti-trash"></i> Delete</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  } catch (error) {
    console.error('Error loading admin students:', error);
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--danger);">Connection error. Make sure server is running.</td></tr>`;
  }
}

async function deleteStudent(id) {
  if (!confirm("Are you sure you want to permanently delete this student record?")) return;

  try {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete student record.");
      return;
    }

    alert("Student record deleted successfully.");
    loadAdminStudents();
  } catch (error) {
    console.error('Error deleting student:', error);
    alert("Connection error. Failed to delete student.");
  }
}

async function loadAdminMedia() {
  const grid = document.getElementById('adminMediaGrid');
  if (!grid) return;

  const category = document.getElementById('mediaFilterCategory').value;
  grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--slate);">Loading assets...</div>`;

  try {
    let query = '';
    if (category && category !== 'all') {
      query = `?category=${category}`;
    }

    const res = await fetch(`${API_BASE}/media${query}`);
    const media = await res.json();
    
    if (!res.ok) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--danger);">Failed to load media.</div>`;
      return;
    }

    if (media.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--slate);">No media assets uploaded yet.</div>`;
      return;
    }

    let html = '';
    media.forEach(m => {
      const isVideo = m.url.endsWith('.mp4') || m.url.endsWith('.webm') || m.url.endsWith('.ogg');
      const mediaTag = isVideo 
        ? `<video src="${m.url.startsWith('/') ? MEDIA_BASE + m.url : m.url}" style="width:100%; height:110px; object-fit:cover; border-radius:6px;" muted autoplay loop></video>`
        : `<img src="${m.url.startsWith('/') ? MEDIA_BASE + m.url : m.url}" style="width:100%; height:110px; object-fit:cover; border-radius:6px;">`;

      html += `
        <div class="card" style="padding:10px; display:flex; flex-direction:column; gap:8px;">
          ${mediaTag}
          <div style="font-size:11px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${m.title || 'No Title'}">${m.title || 'Untitled'}</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="notice-badge ${m.category}" style="font-size:9px; padding:2px 6px;">${m.category}</span>
            <button class="btn btn-secondary" style="padding:2px 6px; font-size:10px; color:var(--danger); border-color:transparent;" onclick="deleteMediaAsset(${m.id})"><i class="ti ti-trash"></i> Delete</button>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;
  } catch (error) {
    console.error('Error loading media:', error);
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--danger);">Connection error. Make sure server is running.</div>`;
  }
}

function populateMediaCategories() {
  const mediaCategorySelect = document.getElementById('mediaCategory');
  const mediaFilterCategorySelect = document.getElementById('mediaFilterCategory');
  
  if (!mediaCategorySelect || !mediaFilterCategorySelect) return;

  const defaultCategories = [
    { value: "gallery-cultural", label: "School Media Gallery (Annual Function / Cultural)" },
    { value: "gallery-sports", label: "School Media Gallery (Inter Sports Day / Sports)" },
    { value: "gallery-exhibitions", label: "School Media Gallery (Exhibitions)" },
    { value: "video-gallery", label: "TV & Video Gallery (Videos / Highlights)" },
    { value: "slideshow", label: "Hero Slideshow" },
    { value: "facilities", label: "School Facilities" },
    { value: "hostel", label: "Hostel Facilities" }
  ];

  const customCategories = JSON.parse(localStorage.getItem('khis_custom_media_categories')) || [];
  const allCategories = [...defaultCategories, ...customCategories];

  // Populate upload select
  let uploadHtml = '';
  allCategories.forEach((cat, index) => {
    uploadHtml += `<option value="${cat.value}" ${index === 0 ? 'selected' : ''}>${cat.label}</option>`;
  });
  mediaCategorySelect.innerHTML = uploadHtml;

  // Populate filter select
  let filterHtml = '<option value="all" selected>All Categories</option>';
  allCategories.forEach(cat => {
    filterHtml += `<option value="${cat.value}">${cat.label}</option>`;
  });
  mediaFilterCategorySelect.innerHTML = filterHtml;
}

function promptAddNewCategory() {
  const catName = prompt("Enter the name of the new media category:");
  if (!catName || catName.trim() === '') return;

  const trimmedName = catName.trim();
  // Create a safe value slug (e.g. "gallery-independence-day")
  const catValue = "gallery-" + trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const customCategories = JSON.parse(localStorage.getItem('khis_custom_media_categories')) || [];
  
  // Prevent duplicate values
  if (customCategories.some(c => c.value === catValue)) {
    alert("This category already exists!");
    return;
  }

  customCategories.push({ value: catValue, label: trimmedName });
  localStorage.setItem('khis_custom_media_categories', JSON.stringify(customCategories));

  populateMediaCategories();
  alert(`Category "${trimmedName}" has been added successfully!`);
}

async function handleMediaUpload(event) {
  event.preventDefault();

  const title = document.getElementById('mediaTitle').value.trim();
  const category = document.getElementById('mediaCategory').value;
  const fileInput = document.getElementById('mediaFile');

  if (fileInput.files.length === 0) {
    alert("Please select a media file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('file', fileInput.files[0]);

  const submitBtn = document.getElementById('mediaUploadSubmitBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="ti ti-loader"></i> Uploading...`;
  }

  try {
    const res = await fetch(`${API_BASE}/media`, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to upload media asset.");
      return;
    }

    alert("Media asset uploaded successfully!");
    document.getElementById('adminMediaUploadForm').reset();
    loadAdminMedia();
    loadPublicGalleryDbMedia();
    loadPublicVideos();
  } catch (error) {
    console.error('Error uploading media:', error);
    alert("Connection error. Failed to upload.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="ti ti-upload"></i> Upload Asset`;
    }
  }
}

async function deleteMediaAsset(id) {
  if (!confirm("Are you sure you want to permanently delete this media asset?")) return;

  try {
    const res = await fetch(`${API_BASE}/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete media asset.");
      return;
    }

    alert("Media asset deleted successfully.");
    loadAdminMedia();
    loadPublicGalleryDbMedia();
    loadPublicVideos();
  } catch (error) {
    console.error('Error deleting media:', error);
    alert("Connection error. Failed to delete.");
  }
}

async function loadPublicFaculties() {
  const grid = document.getElementById('publicFacultiesGrid');
  if (!grid) return;

  try {
    const res = await fetch(`${API_BASE}/faculties`);
    const faculties = await res.json();
    if (!res.ok) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--danger);">Failed to load faculties list.</div>`;
      return;
    }

    if (faculties.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--slate);">No faculty members listed.</div>`;
      return;
    }

    let html = '';
    faculties.forEach(f => {
      let bgClass = 'var(--orange)';
      if (f.avatar === '👨‍🔬') bgClass = 'var(--amber)';
      if (f.avatar === '👩‍💻') bgClass = 'var(--sunburst)';
      if (f.avatar === '👨‍💻') bgClass = 'var(--night)';

      html += `
        <div class="fac-card" style="background:var(--offwhite); border:1px solid var(--border); padding:16px; border-radius:var(--radius); text-align:center; transition:var(--transition);">
          <div style="width:90px; height:90px; border-radius:50%; background:${bgClass}; color:var(--white); display:flex; align-items:center; justify-content:center; font-size:40px; margin:0 auto 12px;">${f.avatar || '🧑‍🏫'}</div>
          <h4 style="font-size:14.5px; font-weight:800; margin-bottom:2px;">${f.name}</h4>
          <p style="font-size:11.5px; color:var(--orange); font-weight:700; margin-bottom:8px;">${f.designation}</p>
          <p style="font-size:11px; color:var(--slate);">${f.qualification}</p>
        </div>
      `;
    });
    grid.innerHTML = html;
  } catch (error) {
    console.error('Error loading faculties list:', error);
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--danger);">Connection error. Failed to load faculty roster.</div>`;
  }
}

async function loadAdminFaculties() {
  const tbody = document.getElementById('adminFacultyTableBody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--slate);">Loading roster records...</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/faculties`);
    const faculties = await res.json();
    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--danger);">Failed to retrieve faculty records.</td></tr>`;
      return;
    }

    if (faculties.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--slate);">No faculty members listed in the registry.</td></tr>`;
      return;
    }

    let html = '';
    faculties.forEach(f => {
      html += `
        <tr>
          <td style="font-size:24px; text-align:center; vertical-align: middle;">${f.avatar || '🧑‍🏫'}</td>
          <td style="font-weight:700; vertical-align: middle;">${f.name}</td>
          <td style="vertical-align: middle;">${f.designation}</td>
          <td style="vertical-align: middle;">${f.qualification}</td>
          <td style="text-align:center; vertical-align: middle;">
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--danger); border-color:transparent;" onclick="deleteFacultyMember(${f.id})"><i class="ti ti-trash"></i> Delete</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  } catch (error) {
    console.error('Error loading admin faculties:', error);
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--danger);">Connection error. Failed to load roster.</td></tr>`;
  }
}

async function handleAdminAddFaculty(event) {
  event.preventDefault();

  const name = document.getElementById('facName').value.trim();
  const designation = document.getElementById('facDesignation').value.trim();
  const qualification = document.getElementById('facQualification').value.trim();
  const avatar = document.getElementById('facAvatar').value;

  if (!name || !designation || !qualification) {
    alert('Please fill in all mandatory fields.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/faculties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ name, designation, qualification, avatar })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to add faculty member.');
      return;
    }

    alert(`Faculty member "${data.name}" added successfully to the registry!`);
    document.getElementById('adminAddFacultyForm').reset();
    loadAdminFaculties();
    loadPublicFaculties();
  } catch (error) {
    console.error('Error adding faculty member:', error);
    alert('Connection error. Failed to add faculty member.');
  }
}

async function deleteFacultyMember(id) {
  if (!confirm('Are you sure you want to permanently delete this faculty member?')) return;

  try {
    const res = await fetch(`${API_BASE}/faculties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to delete faculty member.');
      return;
    }

    alert('Faculty member deleted successfully.');
    loadAdminFaculties();
    loadPublicFaculties();
  } catch (error) {
    console.error('Error deleting faculty member:', error);
    alert('Connection error. Failed to delete.');
  }
}

function revealFeeStructure(forceState) {
  const tableWrap = document.getElementById('publicFeeTableWrap');
  const btnWrap = document.getElementById('feeRevealBtnWrap');
  if (!tableWrap || !btnWrap) return;

  const isVisible = tableWrap.style.display === 'block';
  const shouldShow = typeof forceState === 'boolean' ? forceState : !isVisible;

  if (shouldShow) {
    tableWrap.style.display = 'block';
    tableWrap.style.opacity = '0';
    btnWrap.style.display = 'none';
    
    // Smooth transition fade-in
    setTimeout(() => {
      tableWrap.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      tableWrap.style.opacity = '1';
    }, 50);
  } else {
    tableWrap.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    tableWrap.style.opacity = '0';
    
    setTimeout(() => {
      tableWrap.style.display = 'none';
      btnWrap.style.display = 'block';
    }, 300);
  }
}

// Administrative student addition modal handlers
function openAddStudentModal() {
  const modal = document.getElementById('adminAddStudentModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeAddStudentModal() {
  const modal = document.getElementById('adminAddStudentModal');
  if (modal) {
    modal.classList.remove('active');
  }
  const form = document.getElementById('adminAddStudentForm');
  if (form) {
    form.reset();
  }
}

async function handleSaveNewStudent(event) {
  event.preventDefault();

  const name = document.getElementById('stdName').value.trim();
  const fatherName = document.getElementById('stdFather').value.trim();
  const motherName = document.getElementById('stdMother').value.trim();
  const address = document.getElementById('stdAddress').value.trim();
  const contactNo = document.getElementById('stdContact').value.trim();
  const academicYear = document.getElementById('stdYear').value;
  const classLevel = document.getElementById('stdClass').value;

  if (!name || !fatherName || !motherName || !address || !contactNo) {
    alert("All required fields must be filled!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        fatherName,
        motherName,
        address,
        contactNo,
        academicYear,
        classLevel
      })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to add student details.");
      return;
    }

    alert(`Student record created successfully!\nReference ID: ${data.referenceId}`);
    closeAddStudentModal();
    loadAdminStudents(); // Reload the registers in admin panel
  } catch (error) {
    console.error("Error adding student record:", error);
    alert("Connection error. Failed to add student.");
  }
}

// Bind to window to allow HTML inline onClick handlers to find these
window.loadAdminStudents = loadAdminStudents;
window.deleteStudent = deleteStudent;
window.saveAdminFee = saveAdminFee;
window.handleMediaUpload = handleMediaUpload;
window.deleteMediaAsset = deleteMediaAsset;
window.handleWardenInquiry = handleWardenInquiry;
window.loadAdminMedia = loadAdminMedia;
window.revealFeeStructure = revealFeeStructure;
window.changePublicFeeMedium = changePublicFeeMedium;
window.changeAdminFeeMedium = changeAdminFeeMedium;
window.openAddStudentModal = openAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;
window.handleSaveNewStudent = handleSaveNewStudent;
window.loadPublicGalleryDbMedia = loadPublicGalleryDbMedia;
window.loadPublicVideos = loadPublicVideos;
window.loadPublicFaculties = loadPublicFaculties;
window.loadAdminFaculties = loadAdminFaculties;
window.handleAdminAddFaculty = handleAdminAddFaculty;
window.deleteFacultyMember = deleteFacultyMember;
window.populateMediaCategories = populateMediaCategories;
window.promptAddNewCategory = promptAddNewCategory;

// ── INITIAL LAUNCH ON WINDOW LOAD ──
window.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeState();
  syncLanguageSelector();
  
  // Router hash checks
  window.addEventListener('hashchange', handleRouteChange);
  
  // Render full initial views
  handleRouteChange();
  renderTranslations();
  
  // Setup click filters
  setupNoticeFilters();
  setupGalleryFilters();
  
  // Start Hero Slideshow autoplay
  startHeroSlideshow();

  // Start YouTube Video Carousel autoplay
  startYtCarouselAutoplay();

  // Load public fee table dynamically
  loadPublicFees();

  // Populate dynamic media categories block
  populateMediaCategories();
  
  // Load dynamic database media for gallery and videos
  loadPublicGalleryDbMedia();
  loadPublicVideos();
  loadPublicFaculties();
  
  // Add dropdown toggle click listeners for both desktop and mobile
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentDropdown = trigger.closest('.nav-item-dropdown');
      if (parentDropdown) {
        const isOpen = parentDropdown.classList.contains('active');
        // Close all other dropdowns
        document.querySelectorAll('.nav-item-dropdown').forEach(d => {
          if (d !== parentDropdown) {
            d.classList.remove('active');
          }
        });
        if (isOpen) {
          parentDropdown.classList.remove('active');
        } else {
          parentDropdown.classList.add('active');
        }
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item-dropdown')) {
      document.querySelectorAll('.nav-item-dropdown').forEach(d => {
        d.classList.remove('active');
      });
    }
  });
});

