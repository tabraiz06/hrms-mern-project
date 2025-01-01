const Candidate = require("../models/Candidate");
const fs = require("fs");
const cloudinary = require("../cloudinaryConfig");
const PDFDocument = require("pdfkit");

// Create Candidate
exports.createCandidate = async (req, res) => {
  try {
    const { name, email, phone, position, experience } = req.body;

    // Check if the file uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Set the file to public after upload
    const fileUrl = req.file.path;

    // Proceed with saving the candidate
    const candidate = await Candidate.create({
      userId: req.user.id,
      name,
      email,
      phone,
      position,
      experience,
      resume: fileUrl,
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ userId: req.user.id });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching candidates" });
  }
};

// Get Candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: "Error fetching candidate" });
  }
};

// Update Candidate
exports.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(candidate);
  } catch (err) {
    res.status(500).json({ message: "Error updating candidate" });
  }
};

// Delete Candidate
exports.deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting candidate" });
  }
};

// Download Resume as PDF
exports.downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    const pdfPath = path.join(__dirname, `../uploads/${candidate.resume}`);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.download(pdfPath);
  } catch (err) {
    res.status(500).json({ message: "Error downloading resume" });
  }
};

// Generate PDF Resume (Optional)
exports.generateResumePDF = async (req, res) => {
  const candidateId = req.params.id;
  const candidate = await Candidate.findById(candidateId);
  if (!candidate)
    return res.status(404).json({ message: "Candidate not found" });

  const doc = new PDFDocument();
  const filePath = path.join(
    __dirname,
    `../uploads/${candidate.name}-resume.pdf`
  );
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);
  doc.fontSize(24).text(`Resume - ${candidate.name}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Email: ${candidate.email}`);
  doc.text(`Phone: ${candidate.phone}`);
  doc.text(`Position: ${candidate.position}`);
  doc.text(`Status: ${candidate.status}`);
  doc.end();

  stream.on("finish", () => {
    res.download(filePath);
  });
};
