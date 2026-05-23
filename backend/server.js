const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'save_school_secret_key_2026_raj';

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Set up public upload directories for static local fallback serving
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

// ── MULTER UPLOAD CONFIGURATION ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ── CLOUDINARY CONFIGURATION ──
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary successfully initialized.');
} else {
  console.log('Cloudinary not configured. Defaulting to local file system uploading.');
}

// Media upload utility
async function uploadMedia(file, category) {
  if (hasCloudinary) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `khis_${category}`,
        resource_type: 'auto'
      });
      // Clean up local temp file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload failure, resorting to local path:', error);
    }
  }
  // Local path fallback
  return {
    url: `/uploads/${file.filename}`,
    publicId: file.filename
  };
}

// Media delete utility
async function deleteMedia(publicId) {
  if (hasCloudinary && publicId.startsWith('khis_')) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.error('Cloudinary delete failure:', error);
    }
  }
  // Local file delete
  const filePath = path.join(uploadsDir, publicId);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

// ── AUTHENTICATION MIDDLEWARE ──
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Access token invalid or expired' });
    req.user = user;
    next();
  });
};

// ── REST API ROUTES ──

// 1. Auth Login API
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server authentication failed' });
  }
});

// 2. Student Records APIs (Year-wise / Class-wise)
app.get('/api/students', authenticateToken, async (req, res) => {
  const { academicYear, classLevel } = req.query;
  
  const filter = {};
  if (academicYear) filter.academicYear = academicYear;
  if (classLevel) filter.classLevel = classLevel;

  try {
    const students = await prisma.student.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    res.json(students);
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ error: 'Failed to retrieve students' });
  }
});

// 3. Public Student Registration Application
app.post('/api/students', async (req, res) => {
  const { name, fatherName, motherName, address, contactNo, academicYear, classLevel } = req.body;

  if (!name || !fatherName || !motherName || !address || !contactNo || !academicYear || !classLevel) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const referenceId = 'KHIS-' + Date.now().toString().slice(-4) + '-' + Math.floor(1000 + Math.random() * 9000);
    const newStudent = await prisma.student.create({
      data: {
        name,
        fatherName,
        motherName,
        address,
        contactNo,
        academicYear,
        classLevel,
        referenceId
      }
    });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// 4. Update Student Application Status
app.put('/api/students/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Under Review', 'Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid admission status value' });
  }

  try {
    const updated = await prisma.student.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// 5. Delete Student Application
app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.student.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student record' });
  }
});

// 6. Public Fee Structure API
app.get('/api/fees', async (req, res) => {
  const { medium } = req.query;
  const filter = {};
  if (medium) filter.medium = medium;

  try {
    const fees = await prisma.feeStructure.findMany({
      where: filter,
      orderBy: { id: 'asc' }
    });
    res.json(fees);
  } catch (error) {
    console.error('Fetch fees error:', error);
    res.status(500).json({ error: 'Failed to fetch fee structures' });
  }
});

// 7. Manageable Admin Fee Structure API
app.put('/api/fees/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { tuitionFee, admissionFee, developmentFee, annualCharges } = req.body;

  try {
    const updated = await prisma.feeStructure.update({
      where: { id: parseInt(id) },
      data: {
        tuitionFee: parseFloat(tuitionFee),
        admissionFee: parseFloat(admissionFee),
        developmentFee: parseFloat(developmentFee),
        annualCharges: parseFloat(annualCharges)
      }
    });
    res.json(updated);
  } catch (error) {
    console.error('Update fee error:', error);
    res.status(500).json({ error: 'Failed to update fee record' });
  }
});

// 8. Media Upload / Management APIs
app.get('/api/media', async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;

  try {
    const media = await prisma.media.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    res.json(media);
  } catch (error) {
    console.error('Fetch media error:', error);
    res.status(500).json({ error: 'Failed to fetch media assets' });
  }
});

app.post('/api/media', authenticateToken, upload.single('file'), async (req, res) => {
  const { category, title } = req.body;
  if (!req.file || !category) {
    return res.status(400).json({ error: 'File and category are required fields' });
  }

  try {
    const result = await uploadMedia(req.file, category);
    const newMedia = await prisma.media.create({
      data: {
        publicId: result.publicId,
        url: result.url,
        category,
        title: title || ''
      }
    });
    res.status(201).json(newMedia);
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(500).json({ error: 'Failed to upload media asset' });
  }
});

app.delete('/api/media/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.media.findUnique({ where: { id: parseInt(id) } });
    if (!item) return res.status(404).json({ error: 'Media asset not found' });

    await deleteMedia(item.publicId);
    await prisma.media.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Media asset deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Failed to delete media asset' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`KHIS fullstack backend listening on http://localhost:${PORT}`);
});
