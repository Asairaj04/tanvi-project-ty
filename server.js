// // server.js
// const express = require('express');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const multer = require('multer')


// const app = express();
// const PORT = 3000;

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());

// // MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',         // your MySQL user
//   password: '',         // your MySQL password (if any)
//   database: 'aggrigator' // database name
// });

// // Test connection
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.message);
//   } else {
//     console.log('Connected to database aggrigator');
//   }
// });



// // Register Patient
// app.post('/register_patient', async (req, res) => {
//   const { name, address, email, password } = req.body;

//   if (!name || !address || !email || !password) {
//     return res.status(400).json({ error: 'All fields are required!' });
//   }

//   try {
//     // Hash password before saving
//     const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10

//     const sql = `
//       INSERT INTO users (name, address, email, password, rid)
//       VALUES (?, ?, ?, ?, ?)
//     `;

//     // rid = 3 → patient role
//     db.query(sql, [name, address, email, hashedPassword, 3], (err, result) => {
//       if (err) {
//         console.error('Error inserting patient:', err.message);
//         return res.status(500).json({ error: 'Failed to register patient' });
//       }
//       res.json({ message: 'Patient registered successfully!', id: result.insertId });
//     });
//   } catch (error) {
//     console.error("Hashing error:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });



// //doctor registration


// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });
// const upload = multer({ storage });

// app.post("/register-doctor", upload.single("certificate"), async (req, res) => {
//   try {
//     const { name, specialization, email, password } = req.body;
//     if (!req.file || !name || !specialization || !email || !password)
//       return res.status(400).json({ error: "All fields are required!" });

//     const hashed = await bcrypt.hash(password, 10);
//     const sql = `INSERT INTO users (name, specialization, email, password, certificate, rid)
//                  VALUES (?, ?, ?, ?, ?, 1)`;

//     db.query(sql, [name, specialization, email, hashed, req.file.filename], (err, result) => {
//       if (err) return res.status(500).json({ error: "Database error" });
//       res.json({ message: "Doctor registered successfully!" });
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// //register receptionist


// app.post('/register-receptionist', async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ error: 'All fields are required!' });
//   }

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const sql = `
//       INSERT INTO users (name, email, password, rid)
//       VALUES (?, ?, ?, ?)
//     `;

//     db.query(sql, [name, email, hashedPassword, 2], (err, result) => {
//       if (err) {
//         console.error('Error inserting receptionist:', err.message);
//         return res.status(500).json({ error: 'Failed to register receptionist' });
//       }
//       res.json({ message: 'Receptionist registered successfully!', id: result.insertId });
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error hashing password' });
//   }
// });



// //login 

// // Login route
// // app.post('/login', (req, res) => {
// //   const { email, password } = req.body;
// //   if (!email || !password) return res.send('Email and password are required');

// //   db.query('SELECT * FROM users WHERE email=? AND password=?',
// //     [email, password],
// //     (err, results) => {
// //       if (err) return res.send('Database error');
// //       if (results.length === 0) return res.send('Invalid email or password');

// //       res.send({
// //         message: 'Login successful',
// //         user: { id: results[0].id, name: results[0].name, rid: results[0].rid }
// //       });
// //     });
// // });


// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
//     if (err) return res.send('Database error');
//     if (results.length === 0) return res.send('Invalid email or password');

//     const user = results[0];

//     bcrypt.compare(password, user.password, (err, match) => {
//       if (match) {
//         res.send({ message: 'Login successful', user });
//       } else {
//         res.send('Invalid email or password');
//       }
//     });
//   });
// });

// /* admin  */

// // Doctor pending requests
// app.get('/admin/doctor-requests', (req, res) => {
//   const sql = `SELECT id, name, specialization FROM users WHERE rid = 1 AND status = 'pending'`;

//   db.query(sql, (err, rows) => {
//     if (err) return res.status(500).json(err);
//     res.json(rows);
//   });
// });

// // Patient pending requests
// app.get('/admin/patient-requests', (req, res) => {
//   const sql = `SELECT id, name, address FROM users WHERE rid = 3 AND status = 'pending'`;

//   db.query(sql, (err, rows) => {
//     if (err) return res.status(500).json(err);
//     res.json(rows);
//   });
// });

// // Accepted doctors
// app.get('/admin/accepted-doctors', (req, res) => {
//   const sql = `SELECT id, name, specialization FROM users WHERE rid = 1 AND status = 'accepted'`;

//   db.query(sql, (err, rows) => {
//     if (err) return res.status(500).json(err);
//     res.json(rows);
//   });
// });

// // Accepted patients
// app.get('/admin/accepted-patients', (req, res) => {
//   const sql = `SELECT id, name, address FROM users WHERE rid = 3 AND status = 'accepted'`;

//   db.query(sql, (err, rows) => {
//     if (err) return res.status(500).json(err);
//     res.json(rows);
//   });
// });

// // Update status (accept/reject)
// app.put('/admin/update-status/:id', (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;

//   const sql = 'UPDATE users SET status = ? WHERE id = ?';

//   db.query(sql, [status, id], (err) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: 'Status updated successfully' });
//   });
// });


// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT} `);
// });








//old 







// ===============================
// IMPORT PACKAGES
// ===============================
// ===============================
// IMPORT PACKAGES
// ===============================
// const express = require('express');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const multer = require('multer');

// const app = express();
// const PORT = 3000;

// // ===============================
// // MIDDLEWARE
// // ===============================
// app.use(cors());
// app.use(bodyParser.json());
// app.use("/uploads", express.static("uploads"));

// const SECRET_KEY = "tanvi06"; // change in production


// // ===============================
// // MYSQL CONNECTION
// // ===============================
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'aggrigator'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.message);
//   } else {
//     console.log('Connected to database aggrigator');
//     createAdminIfNotExists();
//   }
// });

// // ===============================
// // CREATE DEFAULT ADMIN
// // ===============================
// async function createAdminIfNotExists() {
//   const adminEmail = "admin@gmail.com";
//   const adminPassword = "admin123";

//   db.query("SELECT * FROM users WHERE email = ?", [adminEmail], async (err, results) => {
//     if (err) return console.log("Admin check error:", err.message);

//     if (results.length === 0) {
//       const hashedPassword = await bcrypt.hash(adminPassword, 10);

//       const sql = `
//         INSERT INTO users (name, email, password, rid, status)
//         VALUES (?, ?, ?, ?, ?)
//       `;

//       db.query(sql, ["Admin", adminEmail, hashedPassword, 0, "accepted"], (err) => {
//         if (err) {
//           console.log("Admin creation failed:", err.message);
//         } else {
//           console.log("✅ Default Admin Created");
//         }
//       });
//     } else {
//       console.log("ℹ Admin already exists");
//     }
//   });
// }

// // ===============================
// // REGISTER PATIENT
// // ===============================
// app.post("/register_patient", async (req, res) => {
//   const { name, address, mobile_number, email, password } = req.body;

//   if (!name || !address || !mobile_number || !email || !password) {
//     return res.status(400).json({ message: "All fields are required!" });
//   }

//   try {
//     // Check duplicate email or mobile
//     const checkSql = "SELECT * FROM users WHERE email = ? OR mobile_number = ?";
//     db.query(checkSql, [email, mobile_number], async (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: "Database error" });
//       }

//       if (result.length > 0) {
//         return res.status(400).json({
//           message: "Email or Mobile number already exists"
//         });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const insertSql = `
//         INSERT INTO users 
//         (name, address, mobile_number, email, password, rid, status)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;

//       db.query(
//         insertSql,
//         [name, address, mobile_number, email, hashedPassword, 3, "pending"],
//         (err, result) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({
//               message: "Registration failed"
//             });
//           }

//           res.json({
//             message: "Patient registered successfully!",
//             userId: result.insertId
//           });
//         }
//       );
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ===============================
// // DOCTOR REGISTRATION
// // ===============================
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });
// const upload = multer({ storage });

// app.post("/register-doctor", upload.single("certificate"), async (req, res) => {
//   try {
//     const {
//       name,
//       specialization,
//       address,
//       mobile_number,
//       email,
//       password
//     } = req.body;

//     // Validation
//     if (
//       !req.file ||
//       !name ||
//       !specialization ||
//       !address ||
//       !mobile_number ||
//       !email ||
//       !password
//     ) {
//       return res.status(400).json({ error: "All fields are required!" });
//     }

//     // Hash password
//     const hashed = await bcrypt.hash(password, 10);

//     const sql = `
//       INSERT INTO users 
//       (name, specialization, address, mobile_number, email, password, certificate, rid, status)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     db.query(
//       sql,
//       [
//         name,
//         specialization,
//         address,
//         mobile_number,
//         email,
//         hashed,
//         req.file.filename,
//         1,               // rid
//         "pending"        // status
//       ],
//       (err, result) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: "Database error" });
//         }

//         res.json({ message: "Doctor registered successfully!" });
//       }
//     );

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ===============================
// // REGISTER RECEPTIONIST
// // ===============================
// app.post('/register-receptionist', async (req, res) => {

//   const { name, address, mobile_number, email, password } = req.body;

//   if (!name || !address || !mobile_number || !email || !password) {
//     return res.status(400).json({ error: 'All fields are required!' });
//   }

//   try {
//     // Check duplicate email or mobile
//     const checkSql = "SELECT * FROM users WHERE email=? OR mobile_number=?";
//     db.query(checkSql, [email, mobile_number], async (err, result) => {

//       if (err)
//         return res.status(500).json({ error: 'Database error' });

//       if (result.length > 0) {
//         return res.status(400).json({
//           error: 'Email or Mobile number already exists'
//         });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const sql = `
//         INSERT INTO users 
//         (name, address, mobile_number, email, password, rid, status)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;

//       db.query(
//         sql,
//         [name, address, mobile_number, email, hashedPassword, 2, "accepted"],
//         (err, result) => {

//           if (err)
//             return res.status(500).json({
//               error: 'Failed to register receptionist'
//             });

//           res.json({
//             message: 'Receptionist registered successfully!',
//             id: result.insertId
//           });
//         }
//       );

//     });

//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }

// });

// // ===============================
// // LOGIN (DOCTOR APPROVAL ONLY)
// // ===============================
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ message: "Email and password are required" });

//   db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {

//     if (err)
//       return res.status(500).json({ message: "Database error" });

//     if (results.length === 0)
//       return res.status(401).json({ message: "Invalid email or password" });

//     const user = results[0];

//     // 🔒 CHECK ONLY DOCTOR STATUS
//     if (user.rid === 1) {

//       if (user.status === "pending") {
//         return res.status(403).json({
//           message: "Your account is waiting for admin approval."
//         });
//       }

//       if (user.status === "rejected") {
//         return res.status(403).json({
//           message: "Your account has been rejected by admin."
//         });
//       }

//       if (user.status !== "accepted") {
//         return res.status(403).json({
//           message: "Doctor account not approved."
//         });
//       }
//     }

//     // ✅ Password Check
//     bcrypt.compare(password, user.password, (err, match) => {

//       if (!match)
//         return res.status(401).json({ message: "Invalid email or password" });

//       res.json({
//         message: "Login successful",
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           rid: user.rid,
//           status: user.status
//         }
//       });
//     });

//   });
// });

// // ===============================
// // ADMIN ROUTES
// // ===============================

//Doctor pending
// app.get('/admin/doctor-requests', (req, res) => {

//   const sql = `
//     SELECT id, name, email, mobile_number, address, specialization, created_at, certificate
//     FROM users
//     WHERE rid = 1 AND status = 'pending'
//   `;

//   db.query(sql, (err, rows) => {
//     if (err) {
//       console.error("Error fetching doctor requests:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     res.json(rows);
//   });

// });



// // ===============================
// // GET ACCEPTED DOCTORS
// // ===============================
// app.get('/admin/accepted-doctors', (req, res) => {

//   const sql = `
//     SELECT id, name, email, mobile_number, address, specialization, created_at, certificate
//     FROM users
//     WHERE rid = 1 AND status = 'accepted'
//   `;

//   db.query(sql, (err, rows) => {
//     if (err) return res.status(500).json(err);
//     res.json(rows);
//   });

// });



// // Update status
// app.put('/admin/update-status/:id', (req, res) => {
//   const id = req.params.id;
//   const status = req.body.status;

//   db.query("UPDATE users SET status = ? WHERE id = ?",
//     [status, id],
//     (err) => {
//       if (err) return res.status(500).json(err);
//       res.json({ message: "Updated successfully" });
//     });
// });

// // ===============================
// // START SERVER
// // ===============================
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });






//new  



// ===============================
// IMPORT PACKAGES
// ===============================
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
const PORT = 3000;
const SECRET_KEY = "tanvi06"; // change in production


const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id:"rzp_test_SK4Bmk88FD8W5g",
  key_secret:"tit9A4beUdAiScAc8JvStEM2"
});

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// ===============================
// MYSQL CONNECTION
// ===============================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "aggrigator",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL");
    createAdminIfNotExists();
  }
});

// ===============================
// CREATE DEFAULT ADMIN
// ===============================
async function createAdminIfNotExists() {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";

  db.query("SELECT * FROM users WHERE email = ?", [adminEmail], async (err, result) => {
    if (err) return console.log("Admin check error:", err.message);

    if (result.length === 0) {
      const hashed = await bcrypt.hash(adminPassword, 10);

      const sql = `
        INSERT INTO users (name, email, password, rid, status)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(sql, ["Admin", adminEmail, hashed, 0, "accepted"], (err) => {
        if (err) console.log("Admin creation failed:", err.message);
        else console.log("✅ Default Admin Created");
      });
    } else {
      console.log("ℹ Admin already exists");
    }
  });
}

// ===============================
// JWT VERIFY MIDDLEWARE
// ===============================
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(403).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token" });

    req.user = decoded;
    next();
  });
}

// ===============================
// REGISTER PATIENT
// ===============================
app.post("/register_patient", async (req, res) => {
  const { name, address, mobile_number, email, password } = req.body;

  if (!name || !address || !mobile_number || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  db.query(
    "SELECT * FROM users WHERE email=? OR mobile_number=?",
    [email, mobile_number],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.length > 0)
        return res.status(400).json({ message: "Email or mobile already exists" });

      const hashed = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO users
        (name, address, mobile_number, email, password, rid, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [name, address, mobile_number, email, hashed, 3, "pending"],
        (err, result) => {
          if (err)
            return res.status(500).json({ message: "Registration failed" });

          res.json({
            message: "Patient registered successfully",
            userId: result.insertId,
          });
        }
      );
    }
  );
});

// ===============================
// DOCTOR REGISTRATION
// ===============================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.post("/register-doctor", upload.single("certificate"), async (req, res) => {
  const { name, specialization, address, mobile_number, email, password } = req.body;

  if (!req.file || !name || !specialization || !address || !mobile_number || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const hashed = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users
    (name, specialization, address, mobile_number, email, password, certificate, rid, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, specialization, address, mobile_number, email, hashed, req.file.filename, 1, "pending"],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Doctor registration failed" });

      res.json({ message: "Doctor registered successfully" });
    }
  );
});

// ===============================
// LOGIN WITH JWT
// ===============================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = result[0];

    // Doctor approval check
    if (user.rid === 1 && user.status !== "accepted") {
      return res.status(403).json({
        message: "Doctor account not approved by admin",
      });
    }

    bcrypt.compare(password, user.password, (err, match) => {
      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, rid: user.rid },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token: token,
      });
    });
  });
});

// ===============================
// GET LOGGED IN USER PROFILE
// ===============================
app.get("/profile", verifyToken, (req, res) => {
  db.query(
    "SELECT id, name, email, address, mobile_number, rid, status FROM users WHERE id = ?",
    [req.user.id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Database error" });

      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      res.json(result[0]);
    }
  );
});

// ===============================
// ADMIN ROUTES (Protected)
// ===============================
// app.get("/admin/doctor-requests", verifyToken, (req, res) => {
//   if (req.user.rid !== 0)
//     return res.status(403).json({ message: "Access denied" });

//   db.query(
//     "SELECT id,name,email,specialization,status FROM users WHERE rid=1 AND status='pending'",
//     (err, rows) => {
//       if (err)
//         return res.status(500).json({ message: "Database error" });
//       res.json(rows);
//     }
//   );
// });

// app.put("/admin/update-status/:id", verifyToken, (req, res) => {
//   if (req.user.rid !== 0)
//     return res.status(403).json({ message: "Access denied" });

//   const { status } = req.body;
//   const { id } = req.params;

//   db.query(
//     "UPDATE users SET status=? WHERE id=?",
//     [status, id],
//     (err) => {
//       if (err)
//         return res.status(500).json({ message: "Update failed" });

//       res.json({ message: "Status updated successfully" });
//     }
//   );
// });



app.get('/admin/doctor-requests', (req, res) => {

  const sql = `
    SELECT id, name, email, mobile_number, address, specialization, created_at, certificate
    FROM users
    WHERE rid = 1 AND status = 'pending'
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error fetching doctor requests:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(rows);
  });

});



// ===============================
// GET ACCEPTED DOCTORS
// ===============================
app.get('/admin/accepted-doctors', (req, res) => {

  const sql = `
    SELECT id, name, email, mobile_number, address, specialization, created_at, certificate
    FROM users
    WHERE rid = 1 AND status = 'accepted'
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });

});



// Update status
app.put('/admin/update-status/:id', (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  db.query("UPDATE users SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated successfully" });
    });
});


// ===============================
// GET DOCTOR PROFILE
// ===============================
app.get("/doctor/profile", verifyToken, (req, res) => {

  if (req.user.rid !== 1)
    return res.status(403).json({ message: "Access denied. Doctor only." });

  const sql = `
    SELECT id, name, email, address, mobile_number, 
           availability, start_time, end_time
    FROM users 
    WHERE id = ?
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error" });

    if (result.length === 0)
      return res.status(404).json({ message: "Doctor not found" });

    res.json(result[0]);
  });

});

// ===============================
// UPDATE DOCTOR PROFILE
// ===============================
app.put("/doctor/update-profile", verifyToken, (req, res) => {

  if (req.user.rid !== 1)
    return res.status(403).json({ message: "Access denied. Doctor only." });

  const { availability, startTime, endTime } = req.body;

  if (!availability)
    return res.status(400).json({ message: "Availability required" });

  const sql = `
    UPDATE users 
    SET availability = ?, 
        start_time = ?, 
        end_time = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [availability, startTime || null, endTime || null, req.user.id],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Update failed" });

      res.json({ message: "Profile updated successfully" });
    }
  );

});


//doctor available show  to patient


// ===============================
// GET AVAILABLE DOCTORS (PATIENT)
// ===============================
app.get("/patient/available/doctors", verifyToken, (req, res) => {

  // Allow only patient (rid = 3)
  if (req.user.rid !== 3) {
    return res.status(403).json({ message: "Access denied" });
  }

  const sql = `
    SELECT id, name, specialization, start_time, end_time
    FROM users
    WHERE rid = 1
      AND status = 'accepted'
      AND availability = 'ON'
  `;

  db.query(sql, (err, rows) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(rows);
  });

});


// ===============================
// GET SINGLE DOCTOR BY ID (PATIENT VIEW)
// ===============================
app.get("/patient/doctor/:id", verifyToken, (req, res) => {
  const doctorId = req.params.id;

  // Only allow patient
  if (req.user.rid !== 3) {
    return res.status(403).json({ message: "Access denied" });
  }

  const sql = `
    SELECT id, name, specialization, start_time, end_time, availability
    FROM users
    WHERE rid = 1
      AND status = 'accepted'
      AND id = ?
  `;

  db.query(sql, [doctorId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(rows[0]);
  });
});


// ======================================
// BOOK APPOINTMENT
// ======================================
// ======================================
// BOOK APPOINTMENT (ONLY ONE ACTIVE)
// ======================================
app.post("/patient/book-appointment", verifyToken, (req,res)=>{

  if(req.user.rid !== 3){
    return res.status(403).json({ message:"Patient access only" });
  }

  const { doctorId, date, time, symptoms } = req.body;
  const patientId = req.user.id;

  if(!doctorId || !date || !time || !symptoms){
    return res.status(400).json({ message:"All fields required" });
  }

  // ✅ STEP 1: CHECK IF PATIENT ALREADY HAS ACTIVE APPOINTMENT
  const checkPatientSql = `
    SELECT * FROM appointments
    WHERE patient_id = ?
      AND status IN ('pending','accepted')
  `;

  db.query(checkPatientSql,[patientId],(err,patientResult)=>{

    if(err)
      return res.status(500).json({ message:"Database error" });

    if(patientResult.length > 0){
      return res.status(400).json({
        message:"You already have an active appointment. Complete it first."
      });
    }

    // ✅ STEP 2: CHECK IF SLOT IS TAKEN BY SOMEONE ELSE
    const checkSlotSql = `
      SELECT * FROM appointments
      WHERE doctor_id = ?
        AND appointment_date = ?
        AND appointment_time = ?
        AND status IN ('pending','accepted')
    `;

    db.query(checkSlotSql,[doctorId,date,time],(err,slotResult)=>{

      if(err)
        return res.status(500).json({ message:"Database error" });

      if(slotResult.length > 0){
        return res.status(400).json({ message:"Time slot already booked" });
      }

      // ✅ STEP 3: INSERT APPOINTMENT
      const insertSql = `
        INSERT INTO appointments
        (patient_id, doctor_id, appointment_date, appointment_time, symptoms)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(insertSql,
        [patientId, doctorId, date, time, symptoms],
        (err)=>{

          if(err)
            return res.status(500).json({ message:"Booking failed" });

          res.json({ message:"Appointment booked successfully" });
        });

    });

  });

});

// Doctor Accept Appointment
app.put("/doctor/accept/:id", verifyToken, (req, res) => {

  if (req.user.rid !== 1) {
    return res.status(403).json({ message: "Access denied" });
  }

  const appointmentId = req.params.id;

  const meetingLink = `https://meet.jit.si/appointment_${appointmentId}_${Date.now()}`;

  const sql = `
    UPDATE appointments 
    SET status = 'accepted',
        meeting_link = ?
    WHERE id = ?
  `;

  db.query(sql, [meetingLink, appointmentId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    res.json({
      message: "Appointment accepted",
      meeting_link: meetingLink
    });
  });
});

// Doctor Complete Appointment
// -------------------
app.put("/doctor/complete/:id", verifyToken, (req, res) => {

  const id = req.params.id;

  db.query(
    "UPDATE appointments SET status='completed' WHERE id=?",
    [id],
    err => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ message: "Appointment completed" });
    }
  );

});

// =============================
// Doctor View Own Appointments (SECURE)
// =============================
// app.get("/doctor/appointments", verifyToken, (req, res) => {

//   if (req.user.rid !== 1) {
//     return res.status(403).json({ message: "Doctor access only" });
//   }

//   const sql = `
//     SELECT a.*, u.name as patient_name
//     FROM appointments a
//     JOIN users u ON a.patient_id = u.id
//     WHERE a.doctor_id = ?
//     ORDER BY appointment_date, appointment_time
//   `;

//   db.query(sql, [req.user.id], (err, result) => {
//     if (err)
//       return res.status(500).json({ message: "Database error" });

//     res.json(result);
//   });

// });



// -------------------
// DOCTOR APPOINTMENTS
// -------------------
app.get("/doctor/appointments", verifyToken, (req, res) => {

  // Allow only doctor (rid = 1)
  if (req.user.rid !== 1) {
    return res.status(403).json({ message: "Access denied" });
  }

  const doctorId = req.user.id;

  const sql = `
    SELECT 
      a.id,
      a.appointment_date,
      a.appointment_time,
      a.symptoms,
      a.status,
      a.meeting_link,
      a.meeting_started,
      u.name AS patient_name,
      IFNULL(p.payment_status,'not_paid') AS payment_status
    FROM appointments a
    JOIN users u ON a.patient_id = u.id
    LEFT JOIN payments p ON p.appointment_id = a.id
    WHERE a.doctor_id = ?
    ORDER BY a.id DESC
  `;

  db.query(sql, [doctorId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);
  });

});



// ===============================
// GET BLOCKED SLOTS (Patient)
// ===============================
app.get("/patient/blocked-slots/:doctorId/:date", verifyToken, (req,res)=>{

  if(req.user.rid !== 3){
    return res.status(403).json({ message:"Patient access only" });
  }

  const { doctorId, date } = req.params;

  const sql = `
    SELECT appointment_time
    FROM appointments
    WHERE doctor_id = ?
      AND appointment_date = ?
      AND status IN ('pending','accepted')
  `;

  db.query(sql,[doctorId,date],(err,result)=>{

    if(err)
      return res.status(500).json({ message:"Database error" });

    res.json(result);
  });

});


//order route 

app.post("/patient/create-order", verifyToken, async (req,res)=>{

  if(req.user.rid !== 3)
    return res.status(403).json({ message:"Patient access only" });

  const { doctorId } = req.body;
  const patientId = req.user.id;

  if(!doctorId)
    return res.status(400).json({ message:"DoctorId required" });

  const amount = 200;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt_" + Date.now()
  };

  try{

    const order = await razorpay.orders.create(options);

    db.query(`
      INSERT INTO payments
      (patient_id, doctor_id, razorpay_order_id, amount)
      VALUES (?,?,?,?)
    `,[patientId, doctorId, order.id, amount],
    (err)=>{
      if(err){
        console.log("DB Insert Error:", err);
        return res.status(500).json({ message:"Payment insert failed" });
      }

      res.json(order);
    });

  }catch(err){
    console.log("Razorpay Error:", err);
    res.status(500).json({ message:"Order creation failed" });
  }

});


//verify payment

app.post("/patient/verify-payment", verifyToken, (req,res)=>{

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    doctorId,
    date,
    time,
    symptoms
  } = req.body;

  const patientId = req.user.id;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "tit9A4beUdAiScAc8JvStEM2")
    .update(body.toString())
    .digest("hex");

  if(expectedSignature !== razorpay_signature){
    return res.status(400).json({ message:"Invalid signature" });
  }

  // STEP 1: Insert appointment
  db.query(`
    INSERT INTO appointments
    (patient_id, doctor_id, appointment_date, appointment_time, symptoms)
    VALUES (?,?,?,?,?)
  `,[patientId, doctorId, date, time, symptoms],
  (err,result)=>{

      if(err)
        return res.status(500).json({ message:"Appointment insert failed" });

      const appointmentId = result.insertId;

      // STEP 2: Update payment with appointment_id + paid status
      db.query(`
        UPDATE payments
        SET razorpay_payment_id=?,
            razorpay_signature=?,
            payment_status='paid',
            appointment_id=?
        WHERE razorpay_order_id=?
      `,
      [razorpay_payment_id, razorpay_signature, appointmentId, razorpay_order_id],
      (err2)=>{

          if(err2)
            return res.status(500).json({ message:"Payment update failed" });

          res.json({ message:"Payment successful & appointment booked" });

      });

  });

});


// ===============================
// PATIENT COMPLETED APPOINTMENTS
// ===============================
app.get("/patient/completed-appointments", verifyToken, (req, res) => {

  if (req.user.rid !== 3) {
    return res.status(403).json({ message: "Patient access only" });
  }

  const sql = `
    SELECT 
      a.id,
      a.appointment_date,
      a.appointment_time,
      a.symptoms,
      u.name AS doctor_name,
      u.specialization
    FROM appointments a
    JOIN users u ON a.doctor_id = u.id
    WHERE a.patient_id = ?
      AND a.status = 'completed'
    ORDER BY a.appointment_date DESC
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error" });

    res.json(result);
  });

});


//doctor start meeting.

app.post("/doctor/start-meeting", verifyToken, (req, res) => {

  if (req.user.rid !== 1) {
    return res.status(403).json({ message: "Access denied" });
  }

  const { appointmentId } = req.body;

  if (!appointmentId) {
    return res.status(400).json({ message: "Appointment ID missing" });
  }

  const sql = `
    UPDATE appointments
    SET meeting_started = 1
    WHERE id = ?
  `;

  db.query(sql, [appointmentId], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Now get the existing meeting link
    db.query(
      "SELECT meeting_link FROM appointments WHERE id = ?",
      [appointmentId],
      (err2, rows) => {

        if (err2) {
          return res.status(500).json({ message: "DB error" });
        }

        res.json({
          message: "Meeting started",
          room: rows[0].meeting_link
        });

      }
    );

  });

});


//upcomming appointment


app.get("/patient/upcoming", verifyToken, (req, res) => {

  if (req.user.rid !== 3) {
    return res.status(403).json({ message: "Access denied" });
  }

  const patientId = req.user.id;

  const sql = `
    SELECT 
      a.id,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.meeting_link,
      a.meeting_started,
      u.name AS doctor_name
    FROM appointments a
    JOIN users u ON a.doctor_id = u.id
    WHERE a.patient_id = ?
      AND a.status = 'accepted'
    ORDER BY a.id DESC
    LIMIT 1
  `;

  db.query(sql, [patientId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length === 0) {
      return res.json(null);
    }

    res.json(result[0]);
  });
});


// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});