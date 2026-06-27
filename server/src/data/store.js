export const store = {
  students: [
    {
      id: "stu-1",
      name: "Aarav Sharma",
      email: "aarav@campus.edu",
      branch: "Computer Science",
      cgpa: 8.7,
      skills: ["React", "Node.js", "MongoDB", "JavaScript", "DSA"],
      resumeText:
        "Full stack developer skilled in React, Node.js, Express, MongoDB, REST APIs, JavaScript, data structures, algorithms and campus project management systems.",
      applications: ["app-1"]
    },
    {
      id: "stu-2",
      name: "Nisha Verma",
      email: "nisha@campus.edu",
      branch: "Information Technology",
      cgpa: 8.2,
      skills: ["Java", "Spring Boot", "SQL", "DSA", "APIs"],
      resumeText:
        "Backend developer with Java, Spring Boot, SQL, REST APIs, DSA practice, authentication systems and payment workflow projects.",
      applications: []
    },
    {
      id: "stu-3",
      name: "Kabir Mehta",
      email: "kabir@campus.edu",
      branch: "Electronics and Communication",
      cgpa: 7.6,
      skills: ["Python", "Machine Learning", "React", "Data Analysis"],
      resumeText:
        "Built Python machine learning models, React dashboards, data analysis notebooks and prediction tools for campus research.",
      applications: []
    }
  ],
  companies: [
    {
      id: "cmp-1",
      name: "Nexora Labs",
      industry: "AI SaaS",
      location: "Bengaluru",
      description: "Builds AI workflow products for enterprise hiring and analytics."
    },
    {
      id: "cmp-2",
      name: "FinEdge Systems",
      industry: "FinTech",
      location: "Hyderabad",
      description: "Creates secure financial automation platforms."
    }
  ],
  jobs: [
    {
      id: "job-1",
      companyId: "cmp-1",
      title: "MERN Stack Developer Intern",
      package: "8 LPA",
      location: "Bengaluru",
      type: "Internship + PPO",
      requiredCgpa: 7,
      skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
      description: "Work on production dashboards, APIs, and placement analytics."
    },
    {
      id: "job-2",
      companyId: "cmp-2",
      title: "Software Engineer Trainee",
      package: "6.5 LPA",
      location: "Hyderabad",
      type: "Full-time",
      requiredCgpa: 7.5,
      skills: ["JavaScript", "DSA", "SQL", "APIs"],
      description: "Build reliable backend services and solve data-heavy product problems."
    }
  ],
  applications: [
    {
      id: "app-1",
      studentId: "stu-1",
      jobId: "job-1",
      status: "Shortlisted",
      matchScore: 94,
      appliedAt: "2026-06-20"
    }
  ],
  tests: [
    {
      id: "test-1",
      jobId: "job-1",
      title: "MERN Coding Assessment",
      durationMinutes: 45,
      questions: [
        {
          id: "q-1",
          title: "Two Sum",
          prompt:
            "Write a function twoSum(nums, target) that returns the indices of two numbers adding up to target.",
          starterCode: "function twoSum(nums, target) {\n  // your code here\n}\n\nconsole.log(twoSum([2,7,11,15], 9));",
          expectedOutput: "[0,1]"
        },
        {
          id: "q-2",
          title: "Validate Brackets",
          prompt:
            "Write a function isValid(s) that returns true when brackets are balanced.",
          starterCode: "function isValid(s) {\n  // your code here\n}\n\nconsole.log(isValid('()[]{}'));",
          expectedOutput: "true"
        }
      ]
    }
  ],
  submissions: []
};

export const byId = (items, id) => items.find((item) => item.id === id);
