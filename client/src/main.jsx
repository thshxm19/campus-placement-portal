import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Code2,
  FileSearch,
  GraduationCap,
  LineChart,
  Plus,
  Send,
  Sparkles,
  Users
} from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const fallback = {
  students: [
    {
      id: "stu-1",
      name: "Aarav Sharma",
      email: "aarav@campus.edu",
      branch: "Computer Science",
      cgpa: 8.7,
      skills: ["React", "Node.js", "MongoDB", "JavaScript", "DSA"],
      resumeText: "Full stack developer skilled in React, Node.js, Express, MongoDB, REST APIs, JavaScript, data structures and algorithms."
    },
    {
      id: "stu-2",
      name: "Nisha Verma",
      email: "nisha@campus.edu",
      branch: "Information Technology",
      cgpa: 8.2,
      skills: ["Java", "Spring Boot", "SQL", "DSA", "APIs"],
      resumeText: "Backend developer with Java, Spring Boot, SQL, REST APIs, DSA practice and authentication systems."
    },
    {
      id: "stu-3",
      name: "Kabir Mehta",
      email: "kabir@campus.edu",
      branch: "Electronics and Communication",
      cgpa: 7.6,
      skills: ["Python", "Machine Learning", "React", "Data Analysis"],
      resumeText: "Built Python machine learning models, React dashboards and prediction tools for campus research."
    }
  ],
  companies: [
    {
      id: "cmp-1",
      name: "Nexora Labs",
      industry: "AI SaaS",
      location: "Bengaluru",
      description: "Builds AI workflow products for enterprise hiring and analytics."
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
      companyId: "cmp-1",
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
          prompt: "Write a function twoSum(nums, target) that returns the indices of two numbers adding up to target.",
          starterCode: "function twoSum(nums, target) {\n  // your code here\n}\n\nconsole.log(twoSum([2,7,11,15], 9));"
        },
        {
          id: "q-2",
          title: "Validate Brackets",
          prompt: "Write a function isValid(s) that returns true when brackets are balanced.",
          starterCode: "function isValid(s) {\n  // your code here\n}\n\nconsole.log(isValid('()[]{}'));"
        }
      ]
    }
  ]
};

async function api(path, options) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

function localScore(student, job) {
  const resume = `${student.resumeText} ${student.skills.join(" ")}`.toLowerCase();
  const matchedSkills = job.skills.filter((skill) => resume.includes(skill.toLowerCase()));
  const skillScore = (matchedSkills.length / job.skills.length) * 75;
  const cgpaScore = student.cgpa >= job.requiredCgpa ? 20 : 8;
  return {
    score: Math.min(99, Math.round(skillScore + cgpaScore)),
    matchedSkills,
    missingSkills: job.skills.filter((skill) => !matchedSkills.includes(skill)),
    verdict: matchedSkills.length >= Math.ceil(job.skills.length * 0.7) ? "Strong match" : "Needs skill improvement"
  };
}

function buildFallbackState(seed = fallback) {
  const student = seed.students[0];
  const recommendedJobs = seed.jobs.map((job) => ({
    ...job,
    company: seed.companies.find((company) => company.id === job.companyId),
    match: localScore(student, job)
  }));
  const applications = seed.applications.map((app) => {
    const job = seed.jobs.find((item) => item.id === app.jobId);
    return {
      ...app,
      job,
      company: seed.companies.find((company) => company.id === job.companyId)
    };
  });
  const company = seed.companies[0];
  const jobs = seed.jobs
    .filter((job) => job.companyId === company.id)
    .map((job) => ({
      ...job,
      applicants: seed.applications
        .filter((app) => app.jobId === job.id)
        .map((app) => ({
          ...app,
          student: seed.students.find((item) => item.id === app.studentId)
        }))
    }));
  const skillDemand = seed.jobs.flatMap((job) => job.skills).reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});
  return {
    student: { student, applications, recommendedJobs },
    company: { company, jobs },
    tests: seed.tests,
    students: seed.students,
    analytics: {
      totalStudents: seed.students.length,
      totalCompanies: seed.companies.length,
      totalJobs: seed.jobs.length,
      totalApplicants: new Set(seed.applications.map((app) => app.studentId)).size,
      shortlisted: seed.applications.filter((app) => app.status === "Shortlisted").length,
      averageMatch: Math.round(seed.applications.reduce((sum, app) => sum + app.matchScore, 0) / seed.applications.length),
      topSkills: Object.entries(skillDemand).map(([skill, count]) => ({ skill, count }))
    }
  };
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="stat">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StudentDashboard({ data, onApply }) {
  const topMatch = data.recommendedJobs?.[0]?.match?.score || 0;

  return (
    <section className="view-grid">
      <div className="panel intro-panel">
        <div>
          <p className="eyebrow">Student Dashboard</p>
          <h1>{data.student.name}</h1>
          <p>
            {data.student.branch} student with CGPA {data.student.cgpa}. Resume profile
            is ready for automated shortlisting.
          </p>
        </div>
        <div className="skill-row">
          {data.student.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="stats-row">
        <Stat icon={BriefcaseBusiness} label="Applications" value={data.applications.length} />
        <Stat icon={Sparkles} label="Top AI Match" value={`${topMatch}%`} />
        <Stat icon={CheckCircle2} label="Shortlists" value={data.applications.filter((a) => a.status === "Shortlisted").length} />
      </div>

      <div className="panel wide">
        <div className="section-title">
          <FileSearch size={20} />
          <h2>AI Resume Matching</h2>
        </div>
        <div className="job-list">
          {data.recommendedJobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div>
                <h3>{job.title}</h3>
                <p>{job.company.name} • {job.location} • {job.package}</p>
                <div className="skill-row compact">
                  {job.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </div>
              <div className="match-box">
                <strong>{job.match.score}%</strong>
                <span>{job.match.verdict}</span>
                <button onClick={() => onApply(job.id)}>
                  <Send size={16} />
                  Apply
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="section-title">
          <BarChart3 size={20} />
          <h2>Application Tracker</h2>
        </div>
        {data.applications.map((app) => (
          <div className="timeline-item" key={app.id}>
            <strong>{app.job.title}</strong>
            <span>{app.company.name}</span>
            <em>{app.status} • {app.matchScore}% match</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function CompanyPortal({ data, onCreateJob }) {
  const [form, setForm] = useState({
    title: "",
    package: "",
    location: "",
    type: "Full-time",
    requiredCgpa: 7,
    skills: "",
    description: ""
  });

  const submit = (event) => {
    event.preventDefault();
    onCreateJob({ ...form, companyId: data.company.id });
    setForm({ ...form, title: "", package: "", location: "", skills: "", description: "" });
  };

  return (
    <section className="view-grid">
      <div className="panel intro-panel">
        <div>
          <p className="eyebrow">Company Portal</p>
          <h1>{data.company.name}</h1>
          <p>{data.company.description}</p>
        </div>
        <div className="stats-row inline">
          <Stat icon={BriefcaseBusiness} label="Open Roles" value={data.jobs.length} />
          <Stat icon={Users} label="Applicants" value={data.jobs.reduce((sum, job) => sum + job.applicants.length, 0)} />
        </div>
      </div>

      <div className="panel">
        <div className="section-title">
          <Plus size={20} />
          <h2>Post a Job</h2>
        </div>
        <form className="job-form" onSubmit={submit}>
          {["title", "package", "location", "skills"].map((field) => (
            <input
              key={field}
              placeholder={field === "skills" ? "Skills comma separated" : field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          ))}
          <input
            type="number"
            step="0.1"
            placeholder="Required CGPA"
            value={form.requiredCgpa}
            onChange={(e) => setForm({ ...form, requiredCgpa: e.target.value })}
          />
          <textarea
            placeholder="Job description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <button>
            <Plus size={16} />
            Create Job
          </button>
        </form>
      </div>

      <div className="panel wide">
        <div className="section-title">
          <Building2 size={20} />
          <h2>Hiring Pipeline</h2>
        </div>
        {data.jobs.map((job) => (
          <article className="job-card" key={job.id}>
            <div>
              <h3>{job.title}</h3>
              <p>{job.type} • {job.package} • CGPA {job.requiredCgpa}+</p>
              <div className="skill-row compact">
                {job.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
            <div className="applicant-list">
              {job.applicants.length ? job.applicants.map((applicant) => (
                <span key={applicant.id}>{applicant.student.name}: {applicant.status}</span>
              )) : <span>No applicants yet</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CodingTest({ tests, onSubmit }) {
  const test = tests[0];
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  if (!test) return null;

  const submit = async () => {
    const response = await onSubmit(test.id, answers);
    setResult(response);
  };

  return (
    <section className="view-grid single">
      <div className="panel intro-panel">
        <div>
          <p className="eyebrow">Online Coding Test</p>
          <h1>{test.title}</h1>
          <p>{test.durationMinutes} minutes • Auto evaluation demo enabled</p>
        </div>
        {result && <div className="score-pill">{result.score}% score</div>}
      </div>
      {test.questions.map((question) => (
        <div className="panel code-panel" key={question.id}>
          <h2>{question.title}</h2>
          <p>{question.prompt}</p>
          <textarea
            spellCheck="false"
            value={answers[question.id] || question.starterCode}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
          />
        </div>
      ))}
      <button className="submit-test" onClick={submit}>
        <Code2 size={18} />
        Submit Test
      </button>
    </section>
  );
}

function AdminAnalytics({ analytics, students }) {
  return (
    <section className="view-grid">
      <div className="panel intro-panel">
        <div>
          <p className="eyebrow">Placement Analytics</p>
          <h1>College Placement Cell</h1>
          <p>Live hiring overview across companies, student profiles, applications, and skill demand.</p>
        </div>
        <div className="stats-row inline">
          <Stat icon={GraduationCap} label="Students" value={analytics.totalStudents} />
          <Stat icon={Building2} label="Companies" value={analytics.totalCompanies} />
        </div>
      </div>

      <div className="stats-row">
        <Stat icon={BriefcaseBusiness} label="Open Jobs" value={analytics.totalJobs} />
        <Stat icon={Users} label="Applicants" value={analytics.totalApplicants} />
        <Stat icon={CheckCircle2} label="Shortlisted" value={analytics.shortlisted} />
        <Stat icon={Sparkles} label="Avg Match" value={`${analytics.averageMatch}%`} />
      </div>

      <div className="panel">
        <div className="section-title">
          <LineChart size={20} />
          <h2>Top Skill Demand</h2>
        </div>
        <div className="skill-meter-list">
          {analytics.topSkills.map((item) => (
            <div className="skill-meter" key={item.skill}>
              <span>{item.skill}</span>
              <div><i style={{ width: `${Math.min(100, item.count * 34)}%` }} /></div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="section-title">
          <Users size={20} />
          <h2>Student Talent Pool</h2>
        </div>
        {students.map((student) => (
          <div className="timeline-item" key={student.id}>
            <strong>{student.name}</strong>
            <span>{student.branch} • CGPA {student.cgpa}</span>
            <em>{student.skills.join(", ")}</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [active, setActive] = useState("student");
  const [student, setStudent] = useState(null);
  const [company, setCompany] = useState(null);
  const [tests, setTests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [offlineDemo, setOfflineDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [studentData, companyData, testData, analyticsData, studentsData] = await Promise.all([
        api("/students/stu-1/dashboard"),
        api("/companies/cmp-1/portal"),
        api("/tests"),
        api("/analytics"),
        api("/students")
      ]);
      setStudent(studentData);
      setCompany(companyData);
      setTests(testData);
      setAnalytics(analyticsData);
      setStudents(studentsData);
      setOfflineDemo(false);
    } catch (error) {
      console.warn("API unavailable, using hosted demo data", error);
      const demo = buildFallbackState();
      setStudent(demo.student);
      setCompany(demo.company);
      setTests(demo.tests);
      setAnalytics(demo.analytics);
      setStudents(demo.students);
      setOfflineDemo(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    load().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, []);

  const tabs = useMemo(
    () => [
      ["student", GraduationCap, "Student"],
      ["company", Building2, "Company"],
      ["test", Code2, "Coding Test"],
      ["admin", LineChart, "Analytics"]
    ],
    []
  );

  const apply = async (jobId) => {
    if (offlineDemo) {
      const demo = buildFallbackState({
        ...fallback,
        applications: [
          {
            id: `app-${Date.now()}`,
            studentId: "stu-1",
            jobId,
            status: "Applied",
            matchScore: 88,
            appliedAt: new Date().toISOString().slice(0, 10)
          },
          ...fallback.applications
        ]
      });
      setStudent(demo.student);
      setCompany(demo.company);
      setAnalytics(demo.analytics);
      return;
    }
    await api("/applications", {
      method: "POST",
      body: JSON.stringify({ studentId: "stu-1", jobId })
    });
    await load();
  };

  const createJob = async (job) => {
    if (offlineDemo) {
      const nextJob = {
        ...job,
        id: `job-${Date.now()}`,
        skills: job.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        requiredCgpa: Number(job.requiredCgpa)
      };
      const demo = buildFallbackState({ ...fallback, jobs: [nextJob, ...fallback.jobs] });
      setStudent(demo.student);
      setCompany(demo.company);
      setAnalytics(demo.analytics);
      return;
    }
    await api("/jobs", { method: "POST", body: JSON.stringify(job) });
    await load();
  };

  const submitTest = (testId, answers) => {
    if (offlineDemo) {
      const test = tests.find((item) => item.id === testId);
      const solved = test.questions.filter((question) => String(answers[question.id] || "").includes("return")).length;
      return Promise.resolve({
        id: `sub-${Date.now()}`,
        testId,
        studentId: "stu-1",
        solved,
        total: test.questions.length,
        score: Math.round((solved / test.questions.length) * 100),
        submittedAt: new Date().toISOString()
      });
    }
    return api(`/tests/${testId}/submit`, {
      method: "POST",
      body: JSON.stringify({ studentId: "stu-1", answers })
    });
  };

  return (
    <main>
      <nav>
        <div className="brand">
          <GraduationCap size={28} />
          <span>Campus Placement Portal</span>
        </div>
        <div className="tabs">
          {tabs.map(([id, Icon, label]) => (
            <button className={active === id ? "active" : ""} key={id} onClick={() => setActive(id)}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {loading && <div className="loading">Loading placement workspace...</div>}
      {!loading && offlineDemo && <div className="demo-banner">Hosted demo mode: frontend is live, backend API runs locally or on your server.</div>}
      {!loading && active === "student" && student && <StudentDashboard data={student} onApply={apply} />}
      {!loading && active === "company" && company && <CompanyPortal data={company} onCreateJob={createJob} />}
      {!loading && active === "test" && <CodingTest tests={tests} onSubmit={submitTest} />}
      {!loading && active === "admin" && analytics && <AdminAnalytics analytics={analytics} students={students} />}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
