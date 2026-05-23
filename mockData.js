// mockData.js
// Preloaded bilingual datasets for Kanpur Heritage International School (KHIS)

const initialMockData = {
  settings: {
    admissionsOpen: true,
    contactInfo: {
      phone: "+91 512 298 7654",
      email: "info@kanpurheritage.edu.in",
      address_en: "12/A, Mall Road, VIP Road Crossing, Kanpur, Uttar Pradesh - 208001",
      address_hi: "12/ए, मॉल रोड, वीआईपी रोड क्रॉसिंग, कानपुर, उत्तर प्रदेश - 208001",
      mapPin: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.2982845648797!2d80.34720967520775!3d26.478335076910685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47087b7a6357%3A0xe5f9b4b0ed1bf1!2sMall%20Rd%2C%20Kanpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1716480000000!5m2!1sen!2sin"
    }
  },

  notices: [
    {
      id: "n-1",
      date: "2026-05-22",
      category: "Admissions",
      title_en: "Admissions Open for Academic Year 2026-27",
      title_hi: "शैक्षणिक वर्ष 2026-27 के लिए प्रवेश प्रारंभ",
      content_en: "Online applications are now being accepted for Grades Nursery to IX and Grade XI. The last date to submit forms along with required documents is June 15, 2026. Entrance assessment details will be sent via email.",
      content_hi: "नर्सरी से कक्षा IX और कक्षा XI के लिए ऑनलाइन आवेदन अब स्वीकार किए जा रहे हैं। आवश्यक दस्तावेजों के साथ फॉर्म जमा करने की अंतिम तिथि 15 जून, 2026 है। प्रवेश परीक्षा का विवरण ईमेल द्वारा भेजा जाएगा।",
      isNew: true
    },
    {
      id: "n-2",
      date: "2026-05-20",
      category: "Examinations",
      title_en: "Schedule for Periodic Test 1 - Grades I to XII",
      title_hi: "आवधिक परीक्षा 1 की समय सारणी - कक्षा I से XII",
      content_en: "The Periodic Test 1 will commence from July 6, 2026. Detailed subject-wise syllabus and date sheet have been uploaded in the Academics tab. Attendance is mandatory for all students.",
      content_hi: "आवधिक परीक्षा 1 (Periodic Test 1) 6 जुलाई, 2026 से शुरू होगी। विस्तृत विषय-वार पाठ्यक्रम और डेट शीट एकेडमिक्स टैब में अपलोड कर दी गई है। सभी छात्रों के लिए उपस्थिति अनिवार्य है।",
      isNew: true
    },
    {
      id: "n-3",
      date: "2026-05-15",
      category: "Circulars",
      title_en: "Change in School Timings for Summer Season",
      title_hi: "ग्रीष्म ऋतु के लिए स्कूल के समय में परिवर्तन",
      content_en: "In view of the rising temperature, school timings will change from May 25, 2026. New timings: Nursery to Prep: 7:30 AM to 11:30 AM; Grades I to XII: 7:30 AM to 1:00 PM. Please ensure buses are boarded on time.",
      content_hi: "बढ़ते तापमान को देखते हुए 25 मई, 2026 से स्कूल के समय में बदलाव किया जाएगा। नया समय: नर्सरी से प्रेप: सुबह 7:30 बजे से 11:30 बजे तक; कक्षा I से XII: सुबह 7:30 बजे से दोपहर 1:00 बजे तक। कृपया समय पर बस में चढ़ना सुनिश्चित करें।",
      isNew: false
    },
    {
      id: "n-4",
      date: "2026-05-10",
      category: "Events",
      title_en: "Annual Science & Art Exhibition 'Kriti 2026'",
      title_hi: "वार्षिक विज्ञान एवं कला प्रदर्शनी 'कृति 2026'",
      content_en: "Kanpur Heritage International School is hosting its annual exhibition 'Kriti 2026' on October 14, 2026. Parents are cordially invited to witness our young innovators' working models and artistic masterworks.",
      content_hi: "कानपुर हेरिटेज इंटरनेशनल स्कूल 14 अक्टूबर, 2026 को अपनी वार्षिक प्रदर्शनी 'कृति 2026' की मेजबानी कर रहा है। अभिभावकों को हमारे युवा नवप्रवर्तकों के वर्किंग मॉडल और कलात्मक कृतियों को देखने के लिए सादर आमंत्रित किया जाता है।",
      isNew: false
    }
  ],

  events: [
    {
      id: "e-1",
      date: "2026-05-24", // Tomorrow
      category: "Meeting",
      title_en: "Parent-Teacher Meeting (PTM)",
      title_hi: "अभिभावक-शिक्षक बैठक (PTM)",
      location_en: "School Assembly Hall",
      location_hi: "स्कूल असेंबली हॉल",
      description_en: "Interaction with class teachers to discuss the academic planning and initial assessment scores of the new session. Timings: 8:30 AM - 12:00 PM.",
      description_hi: "नए सत्र के शैक्षणिक नियोजन और प्रारंभिक मूल्यांकन अंकों पर चर्चा करने के लिए कक्षा शिक्षकों के साथ बैठक। समय: सुबह 8:30 बजे - दोपहर 12:00 बजे।"
    },
    {
      id: "e-2",
      date: "2026-06-05",
      category: "Holiday",
      title_en: "World Environment Day Celebration",
      title_hi: "विश्व पर्यावरण दिवस समारोह",
      location_en: "School Botanical Garden",
      location_hi: "स्कूल बॉटनिकल गार्डन",
      description_en: "Plantation drive and anti-plastic campaign by students. Special assembly hosted by the Eco Club.",
      description_hi: "छात्रों द्वारा वृक्षारोपण अभियान और प्लास्टिक-विरोधी अभियान। इको क्लब द्वारा विशेष सभा का आयोजन।"
    },
    {
      id: "e-3",
      date: "2026-06-21",
      category: "Activity",
      title_en: "International Yoga Day Workshop",
      title_hi: "अंतर्राष्ट्रीय योग दिवस कार्यशाला",
      location_en: "Indoor Sports Arena",
      location_hi: "इंडोर स्पोर्ट्स एरिना",
      description_en: "A morning yoga session conducted by professional instructors for students, staff, and parents. Warmups start at 6:45 AM.",
      description_hi: "छात्रों, कर्मचारियों और अभिभावकों के लिए पेशेवर प्रशिक्षकों द्वारा आयोजित एक सुबह का योग सत्र। वार्मअप सुबह 6:45 बजे शुरू होगा।"
    },
    {
      id: "e-4",
      date: "2026-06-25",
      category: "Holiday",
      title_en: "Summer Vacation Commences",
      title_hi: "ग्रीष्मकालीन अवकाश प्रारंभ",
      location_en: "Campus-wide",
      location_hi: "पूरा परिसर",
      description_en: "School will close for summer breaks from June 25 to July 26, 2026. Holiday homework and project guidelines will be shared by respective subject teachers.",
      description_hi: "स्कूल 25 जून से 26 जुलाई, 2026 तक गर्मियों की छुट्टियों के लिए बंद रहेगा। अवकाश गृहकार्य और परियोजना दिशा-निर्देश संबंधित विषय शिक्षकों द्वारा साझा किए जाएंगे।"
    },
    {
      id: "e-5",
      date: "2026-08-15",
      category: "Celebration",
      title_en: "Independence Day Celebration",
      title_hi: "स्वतंत्रता दिवस समारोह",
      location_en: "Front Lawn",
      location_hi: "मुख्य लॉन",
      description_en: "Flag hoisting ceremony, national anthem, march past, and a series of patriotic cultural performances by students of middle and senior wings.",
      description_hi: "ध्वजारोहण समारोह, राष्ट्रगान, मार्च पास्ट और मिडल व सीनियर विंग के छात्रों द्वारा देशभक्तिपूर्ण सांस्कृतिक प्रस्तुतियाँ।"
    }
  ],

  albums: [
    {
      id: "al-1",
      year: "2026",
      category: "Sports",
      title_en: "Annual Inter-House Athletics Meet",
      title_hi: "वार्षिक इंटर-हाउस एथलेटिक्स मीट",
      coverImage: "assets/sports_cover.jpg",
      description_en: "Highlights from the competitive track & field events, relays, tug-of-war, and champion trophy distributions.",
      description_hi: "प्रतिस्पर्धी ट्रैक और फील्ड इवेंट, रिले दौड़, रस्साकशी और चैंपियन ट्रॉफी वितरण की मुख्य विशेषताएं।",
      images: [
        { url: "assets/sports_1.jpg", caption_en: "100m Dash Finals", caption_hi: "100 मीटर दौड़ फाइनल" },
        { url: "assets/sports_2.jpg", caption_en: "High Jump Champion", caption_hi: "हाई जंप चैंपियन" },
        { url: "assets/sports_3.jpg", caption_en: "March Past by Houses", caption_hi: "हाउसों द्वारा मार्च पास्ट" },
        { url: "assets/sports_4.jpg", caption_en: "Trophy Ceremony", caption_hi: "ट्रॉफी वितरण समारोह" }
      ]
    },
    {
      id: "al-2",
      year: "2026",
      category: "Cultural",
      title_en: "Annual Day Gala 'Tarang 2026'",
      title_hi: "वार्षिक दिवस समारोह 'तरंग 2026'",
      coverImage: "assets/annual_day_cover.jpg",
      description_en: "A magnificent display of theater, classical orchestrations, classical dance, and modern musical dramas.",
      description_hi: "रंगमंच, शास्त्रीय संगीत वादन, शास्त्रीय नृत्य और आधुनिक संगीत नाटकों का एक शानदार प्रदर्शन।",
      images: [
        { url: "assets/cultural_1.jpg", caption_en: "Inaugural Kathak Performance", caption_hi: "उद्घाटन कथक नृत्य" },
        { url: "assets/cultural_2.jpg", caption_en: "William Shakespeare Play Adaptation", caption_hi: "विलियम शेक्सपियर नाटक का रूपांतरण" },
        { url: "assets/cultural_3.jpg", caption_en: "Senior School Choir", caption_hi: "सीनियर स्कूल क्वायर" },
        { url: "assets/cultural_4.jpg", caption_en: "Finale Folk Dance Fusion", caption_hi: "समापन लोक नृत्य फ्यूजन" }
      ]
    },
    {
      id: "al-3",
      year: "2025",
      category: "Exhibitions",
      title_en: "National Level Science & Tech Expo",
      title_hi: "राष्ट्रीय स्तर की विज्ञान और तकनीक प्रदर्शनी",
      coverImage: "assets/science_cover.jpg",
      description_en: "Innovative working models, AI automation projects, smart city designs, and biotechnology solutions developed by KHIS innovators.",
      description_hi: "केएचआईएस के नवप्रवर्तकों द्वारा विकसित अभिनव वर्किंग मॉडल, एआई ऑटोमेशन प्रोजेक्ट, स्मार्ट सिटी डिजाइन और जैव प्रौद्योगिकी समाधान।",
      images: [
        { url: "assets/science_1.jpg", caption_en: "Working Robotics Hand Showcase", caption_hi: "वर्किंग रोबोटिक्स हैंड का प्रदर्शन" },
        { url: "assets/science_2.jpg", caption_en: "Hydroponics Agriculture Prototype", caption_hi: "हाइड्रोपोनिक्स कृषि का प्रोटोटाइप" },
        { url: "assets/science_3.jpg", caption_en: "Smart Traffic Management Demo", caption_hi: "स्मार्ट ट्रैफिक मैनेजमेंट डेमो" }
      ]
    }
  ],

  achievements: [
    {
      id: "ac-1",
      year: "2025-26",
      category: "Academics",
      title_en: "City Topper in CBSE Class XII Board Exams",
      title_hi: "सीबीएसई कक्षा XII बोर्ड परीक्षा में सिटी टॉपर",
      winner_en: "Ananya Dixit (99.2% - Humanities Stream)",
      winner_hi: "अनन्या दीक्षित (99.2% - मानविकी संकाय)",
      details_en: "Ananya secured perfect 100 in History and Political Science, ranking 1st in the entire Kanpur region. She is now pursuing Economics Hons at Lady Shri Ram College, Delhi.",
      details_hi: "अनन्या ने इतिहास और राजनीति विज्ञान में पूरे 100 अंक हासिल किए, और पूरे कानपुर क्षेत्र में प्रथम स्थान प्राप्त किया। वह अब लेडी श्री राम कॉलेज, दिल्ली से इकोनॉमिक्स ऑनर्स की पढ़ाई कर रही हैं।"
    },
    {
      id: "ac-2",
      year: "2025",
      category: "Sports",
      title_en: "Gold Medal in State Swimming Championship",
      title_hi: "राज्य तैराकी चैंपियनशिप में स्वर्ण पदक",
      winner_en: "Aarav Mishra (Under-17 50m Breaststroke)",
      winner_hi: "आरव मिश्रा (अंडर-17 50 मीटर ब्रेस्टस्ट्रोक)",
      details_en: "Aarav shattered the state record clocking 29.85 seconds, winning gold and qualifying for the School Games Federation of India (SGFI) Nationals.",
      details_hi: "आरव ने 29.85 सेकंड का समय निकालकर राज्य का रिकॉर्ड तोड़ दिया, स्वर्ण पदक जीता और स्कूल गेम्स फेडरेशन ऑफ इंडिया (SGFI) नेशनल के लिए क्वालीफाई किया।"
    },
    {
      id: "ac-3",
      year: "2026",
      category: "Science & Innovation",
      title_en: "1st Prize in National IIT-Kanpur Robo-Con",
      title_hi: "राष्ट्रीय आईआईटी-कानपुर रोबो-कॉन में प्रथम पुरस्कार",
      winner_en: "KHIS Robotics Club Team 'Alpha'",
      winner_hi: "केएचआईएस रोबोटिक्स क्लब टीम 'अल्फा'",
      details_en: "The team designed an autonomous agricultural weed-puller robot that won the highest innovation award at IIT Kanpur's annual youth tech conclave.",
      details_hi: "टीम ने एक स्वायत्त कृषि वीड-पुलर (खरपतवार उखाड़ने वाला) रोबोट डिजाइन किया जिसने आईआईटी कानपुर के वार्षिक युवा तकनीकी सम्मेलन में सर्वोच्च नवाचार पुरस्कार जीता।"
    }
  ],

  applications: [
    {
      refNo: "KHIS-2026-1082",
      studentName: "Vihaan Sharma",
      dob: "2018-04-12",
      gender: "Male",
      grade: "Grade 3",
      parentName: "Rajesh Sharma",
      parentEmail: "rajesh.sharma@gmail.com",
      phone: "+91 98765 43210",
      address: "Flat 402, Ganga Heights, Swaroop Nagar, Kanpur",
      documents: ["Birth Certificate", "Previous Report Card", "Student Photo"],
      status: "Under Review",
      dateSubmitted: "2026-05-22"
    },
    {
      refNo: "KHIS-2026-1043",
      studentName: "Prisha Gupta",
      dob: "2021-09-05",
      gender: "Female",
      grade: "Nursery",
      parentName: "Amit Gupta",
      parentEmail: "amit.gupta@yahoo.com",
      phone: "+91 87654 32109",
      address: "15/67, Civil Lines, Near Green Park Stadium, Kanpur",
      documents: ["Birth Certificate", "Student Photo"],
      status: "Approved",
      dateSubmitted: "2026-05-20"
    }
  ]
};

window.initialMockData = initialMockData;

