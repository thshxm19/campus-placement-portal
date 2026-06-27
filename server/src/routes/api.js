import express from "express";
import { byId, store } from "../data/store.js";
import { scoreResumeForJob } from "../services/matcher.js";

const router = express.Router();
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "campus-placement-portal" });
});

router.get("/students/:id/dashboard", (req, res) => {
  const student = byId(store.students, req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const enrichedApplications = store.applications
    .filter((app) => app.studentId === student.id)
    .map((app) => {
      const job = byId(store.jobs, app.jobId);
      const company = byId(store.companies, job?.companyId);
      return { ...app, job, company };
    });

  const recommendedJobs = store.jobs.map((job) => ({
    ...job,
    company: byId(store.companies, job.companyId),
    match: scoreResumeForJob(student, job)
  }));

  res.json({ student, applications: enrichedApplications, recommendedJobs });
});

router.get("/companies", (_req, res) => {
  res.json(store.companies);
});

router.get("/students", (_req, res) => {
  res.json(store.students);
});

router.post("/students", (req, res) => {
  const student = {
    id: makeId("stu"),
    name: req.body.name,
    email: req.body.email,
    branch: req.body.branch,
    cgpa: Number(req.body.cgpa || 0),
    skills: String(req.body.skills || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    resumeText: req.body.resumeText || "",
    applications: []
  };
  store.students.unshift(student);
  res.status(201).json(student);
});

router.get("/companies/:id/portal", (req, res) => {
  const company = byId(store.companies, req.params.id);
  if (!company) return res.status(404).json({ message: "Company not found" });

  const jobs = store.jobs
    .filter((job) => job.companyId === company.id)
    .map((job) => ({
      ...job,
      applicants: store.applications
        .filter((app) => app.jobId === job.id)
        .map((app) => ({
          ...app,
          student: byId(store.students, app.studentId)
        }))
    }));

  res.json({ company, jobs });
});

router.get("/jobs", (_req, res) => {
  res.json(
    store.jobs.map((job) => ({
      ...job,
      company: byId(store.companies, job.companyId)
    }))
  );
});

router.post("/jobs", (req, res) => {
  const job = {
    id: makeId("job"),
    companyId: req.body.companyId || "cmp-1",
    title: req.body.title,
    package: req.body.package,
    location: req.body.location,
    type: req.body.type,
    requiredCgpa: Number(req.body.requiredCgpa || 0),
    skills: String(req.body.skills || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    description: req.body.description
  };
  store.jobs.unshift(job);
  res.status(201).json(job);
});

router.post("/applications", (req, res) => {
  const student = byId(store.students, req.body.studentId || "stu-1");
  const job = byId(store.jobs, req.body.jobId);
  if (!student || !job) return res.status(400).json({ message: "Invalid student or job" });

  const match = scoreResumeForJob(student, job);
  const application = {
    id: makeId("app"),
    studentId: student.id,
    jobId: job.id,
    status: match.score >= 70 ? "Shortlisted" : "Applied",
    matchScore: match.score,
    appliedAt: new Date().toISOString().slice(0, 10)
  };
  store.applications.unshift(application);
  res.status(201).json(application);
});

router.post("/match", (req, res) => {
  const student = byId(store.students, req.body.studentId || "stu-1");
  const job = byId(store.jobs, req.body.jobId);
  if (!student || !job) return res.status(400).json({ message: "Invalid student or job" });

  res.json(scoreResumeForJob(student, job));
});

router.get("/analytics", (_req, res) => {
  const totalApplicants = new Set(store.applications.map((app) => app.studentId)).size;
  const shortlisted = store.applications.filter((app) => app.status === "Shortlisted").length;
  const averageMatch = store.applications.length
    ? Math.round(
        store.applications.reduce((sum, app) => sum + app.matchScore, 0) /
          store.applications.length
      )
    : 0;
  const skillDemand = store.jobs
    .flatMap((job) => job.skills)
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

  res.json({
    totalStudents: store.students.length,
    totalCompanies: store.companies.length,
    totalJobs: store.jobs.length,
    totalApplicants,
    shortlisted,
    averageMatch,
    topSkills: Object.entries(skillDemand)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([skill, count]) => ({ skill, count }))
  });
});

router.get("/tests", (_req, res) => {
  res.json(store.tests);
});

router.post("/tests/:id/submit", (req, res) => {
  const test = byId(store.tests, req.params.id);
  if (!test) return res.status(404).json({ message: "Test not found" });

  const answers = req.body.answers || {};
  const total = test.questions.length;
  const solved = test.questions.filter((question) => {
    const answer = String(answers[question.id] || "").toLowerCase();
    return answer.includes("return") && answer.length > 25;
  }).length;
  const submission = {
    id: makeId("sub"),
    testId: test.id,
    studentId: req.body.studentId || "stu-1",
    solved,
    total,
    score: Math.round((solved / total) * 100),
    submittedAt: new Date().toISOString()
  };
  store.submissions.unshift(submission);
  res.status(201).json(submission);
});

export default router;
