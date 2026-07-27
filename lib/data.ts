export const portfolioData = {
  name: "Aashray J Pramod",
  titles: ["B.Tech CSE (AI & ML)", "Web Developer", "UI/UX", "Tech Lead"],
  bio: "BTech CSE (AI & ML) student passionate about building impactful digital products through web development, AI-based problem solving, and design-driven thinking. Experienced in developing production-ready applications, leading technical teams, and executing projects in fast-paced collaborative environments.",
  contactEmail: "aashrayjpramod@gmail.com",
  socials: {
    github: "https://github.com",
    linkedin: "https://www.linkedin.com/in/aashray-j-pramod-",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com"
  },
  
  education: {
    institution: "College of Engineering Attingal",
    location: "Trivandrum, Kerala",
    degree: "BTech in Computer Science and Engineering with Artificial Intelligence and Machine Learning",
    duration: "Sep 2023 - May 2027",
    cgpa: "8.5"
  },

  experience: [
    {
      id: "1",
      role: "Chairperson",
      company: "IEEE IAS SBC",
      duration: "Mar 2025 — Mar 2026",
      description: "Led planning and execution of 10+ technical workshops and collaborated with national IEEE branches for awareness campaigns.",
      tech: ["Leadership", "Event Management", "Collaboration"]
    },
    {
      id: "2",
      role: "Chairperson",
      company: "ISTE Student Chapter",
      duration: "Jun 2025 — Jun 2026",
      description: "Managed a team of 25+ students, coordinated weekly tech sessions and events.",
      tech: ["Team Management", "Public Speaking"]
    },
    {
      id: "3",
      role: "Documentation Lead",
      company: "Alchemy IEDC",
      duration: "Feb 2025 — Feb 2026",
      description: "Drafted structured reports, proposals, and strategies for innovation programs.",
      tech: ["Technical Documentation", "Strategy"]
    }
  ],

  projects: [
    {
      id: "1",
      title: "MicroCleanse",
      description: "Developed a Python and OpenCV-based image analysis system to detect and quantify microplastics in water samples during a 48-hour IEEE hackathon (.hack():2024 by IEEE MACE SB).",
      tech: ["Python", "OpenCV", "Image Analysis"],
      link: "#",
      colSpan: "md:col-span-2",
    },
    {
      id: "2",
      title: "Al Afiya Medical Platform",
      description: "Engineered and deployed a production-grade healthcare distributor platform for Al Afiya Medical Supplies LLC using Next.js. Built a dynamic, SEO-optimized UI to showcase 10k+ medical SKUs across B2B/B2C sectors with lightning-fast static rendering and high Lighthouse performance scores.",
      tech: ["Next.js", "React.js", "Tailwind CSS", "SEO"],
      link: "https://www.afiyamed.com",
      image: "/projects/afiyamed.png",
      colSpan: "md:col-span-2",
    }
  ],

  skills: [
    { 
      category: "Programming Languages", 
      icon: "Code",
      items: ["Python", "C", "JavaScript", "HTML", "CSS"] 
    },
    { 
      category: "Frameworks & Tech", 
      icon: "Cpu",
      items: ["Next.js", "React.js", "OpenCV", "SEO Optimization"] 
    },
    { 
      category: "Tools & Platforms", 
      icon: "Database",
      items: ["GitHub", "VS Code", "PyCharm", "Figma", "Git"] 
    },
    { 
      category: "Core Areas", 
      icon: "Users",
      items: ["Web Development", "AI/ML", "Computer Vision", "UI/UX Design"] 
    }
  ],

  achievements: [
    {
      title: "First Prize - College Level",
      event: "NASA Space Apps Challenge 2025",
      description: "Served as Backend Developer and System Integrator, designing and integrating core application logic and data flow between modules."
    },
    {
      title: "Best Marketing Strategy Winner",
      event: "ENIGMA '23, Alchemy IEDC",
      description: "Recognized among 50+ teams at a state-level startup conclave for developing a compelling marketing strategy and pitch for a sustainable innovation."
    },
    {
      title: "AI Internship",
      event: "Academor",
      description: "Hands-on projects in Python, data handling, and supervised learning models (Feb 2024 - Mar 2024)."
    }
  ],

  // Keeping reviews for UI continuity if needed
  reviews: [
    {
      id: "1",
      name: "NASA Space Apps Judge",
      role: "Hackathon 2025",
      text: "Aashray's system integration skills and backend logic were critical to their first-place finish at the college level."
    },
    {
      id: "2",
      name: "ENIGMA '23 Jury",
      role: "Alchemy IEDC",
      text: "Presented an incredibly compelling marketing strategy. Stood out easily among 50+ competing teams."
    }
  ]
};
