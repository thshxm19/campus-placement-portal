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

async function api(path, options) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
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
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
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
    await api("/applications", {
      method: "POST",
      body: JSON.stringify({ studentId: "stu-1", jobId })
    });
    await load();
  };

  const createJob = async (job) => {
    await api("/jobs", { method: "POST", body: JSON.stringify(job) });
    await load();
  };

  const submitTest = (testId, answers) =>
    api(`/tests/${testId}/submit`, {
      method: "POST",
      body: JSON.stringify({ studentId: "stu-1", answers })
    });

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
      {!loading && active === "student" && student && <StudentDashboard data={student} onApply={apply} />}
      {!loading && active === "company" && company && <CompanyPortal data={company} onCreateJob={createJob} />}
      {!loading && active === "test" && <CodingTest tests={tests} onSubmit={submitTest} />}
      {!loading && active === "admin" && analytics && <AdminAnalytics analytics={analytics} students={students} />}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
