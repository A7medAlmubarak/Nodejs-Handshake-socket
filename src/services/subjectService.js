const { Model, Op } = require("../database/config");

// Service to get all subjects
async function getAllSubjects() {
  try {
    const subjects = await Model.Subject.findAll();
    return subjects;
  } catch (error) {
    throw error;
  }
}

// Service to get subjects for a specific user
async function getUserSubjects(userId) {
  try {
    const user = await Model.User.findByPk(userId, { include: Subject });
    if (!user) {
      throw new Error('User not found');
    }
    return user.Subjects;
  } catch (error) {
    throw error;
  }
}

// Service to store a new subject
async function storeSubject(name, UserId) {
  try {
    console.log("insideServ", UserId)
    const subject = await Model.Subject.create({name, UserId});
  } catch (error) {
    throw error;
  }
}

// Service to submit a mark for a subject
async function submitMark(subjectId, mark) {
  try {
    const subject = await Model.Subject.findByPk(subjectId);
    if (!subject) {
      throw new Error('Subject not found');
    }

    // Assuming 'mark' is a field in the Subject model
    subject.mark = mark;

    await subject.save();
    return subject;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllSubjects,
  getUserSubjects,
  storeSubject,
  submitMark,
};
