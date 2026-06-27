const tokenize = (text = "") =>
  new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9+#. ]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );

export function scoreResumeForJob(student, job) {
  const resumeTokens = tokenize(`${student.resumeText} ${student.skills?.join(" ")}`);
  const requiredSkills = job.skills || [];
  const matchedSkills = requiredSkills.filter((skill) =>
    resumeTokens.has(skill.toLowerCase())
  );
  const skillScore = requiredSkills.length
    ? (matchedSkills.length / requiredSkills.length) * 75
    : 40;
  const cgpaScore = Number(student.cgpa) >= Number(job.requiredCgpa || 0) ? 20 : 8;
  const keywordBonus = tokenize(job.description)
    .values()
    .reduce((score, word) => score + (resumeTokens.has(word) ? 1 : 0), 0);

  return {
    score: Math.min(99, Math.round(skillScore + cgpaScore + Math.min(keywordBonus, 4))),
    matchedSkills,
    missingSkills: requiredSkills.filter((skill) => !matchedSkills.includes(skill)),
    verdict:
      matchedSkills.length >= Math.ceil(requiredSkills.length * 0.7)
        ? "Strong match"
        : "Needs skill improvement"
  };
}
