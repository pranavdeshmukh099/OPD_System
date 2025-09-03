const jwt2 = require("jsonwebtoken");
const User2 = require("../models/User");
const Doctor = require("../models/Doctor");
const Audit = require("../models/AuditLog");


function sign(u) {
  return jwt2.sign(
    { id: u._id.toString(), role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}


async function bootstrapAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const pass = process.env.ADMIN_PASSWORD;
    if (!email || !pass) return;

    const exists = await User2.findOne({ email });
    if (!exists) {
      const admin = await User2.create({
        name: "Super Admin",
        email,
        password: pass,
        role: "Admin",
      });

      console.log("👑 Seeded Admin:", email);

      await Audit.create({
        actor: admin._id,
        action: "SEED_ADMIN",
        entityType: "User",
        entityId: admin._id.toString(),
        meta: { email },
      });
    }
  } catch (err) {
    console.error("Error bootstrapping admin:", err);
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User2.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = sign(user);

    await Audit.create({
      actor: user._id,
      action: "LOGIN",
      entityType: "User",
      entityId: user._id.toString(),
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


async function createDoctor(req, res) {
  try {
    const { name, email, password, specialization, capacityPerSlot, bufferMinutes } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExists = await User2.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User2.create({
      name,
      email,
      password,
      role: "Doctor",
    });

    const doc = await Doctor.create({
      user: user._id,
      specialization,
      capacityPerSlot,
      bufferMinutes,
    });

    await Audit.create({
      actor: req.user?.id,
      action: "CREATE_DOCTOR",
      entityType: "Doctor",
      entityId: doc._id.toString(),
      meta: { email },
    });

    return res.status(201).json({
      user: { id: user._id, name, email, role: "Doctor" },
      doctor: doc,
    });
  } catch (err) {
    console.error("Error creating doctor:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


async function createStaff(req, res) {
  try {
    const { name, email, password, forDoctorId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExists = await User2.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User2.create({
      name,
      email,
      password,
      role: "Staff",
    });

    if (forDoctorId) {
      await Doctor.findByIdAndUpdate(forDoctorId, {
        $addToSet: { assignedStaff: user._id },
      });
    }

    await Audit.create({
      actor: req.user?.id,
      action: "CREATE_STAFF",
      entityType: "User",
      entityId: user._id.toString(),
      meta: { forDoctorId },
    });

    return res
      .status(201)
      .json({ user: { id: user._id, name, email, role: "Staff" } });
  } catch (err) {
    console.error("Error creating staff:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { login, createDoctor, createStaff, bootstrapAdmin };
