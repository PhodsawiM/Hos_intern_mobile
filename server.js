const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
// Simple request logger to debug incoming requests and routes
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.path}`);
    next();
});
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false
    }
);


sequelize.authenticate()
    .then(() => console.log("✅ MariaDB Connected"))
    .catch(err => console.log("❌ MariaDB Error: ", err));

const Screening = sequelize.define('Screening', {
    age: {
        type: DataTypes.INTEGER
    },
    gender: {
        type: DataTypes.STRING
    },
    smoker: {
        type: DataTypes.STRING
    },
    chronic: {
        type: DataTypes.STRING
    },
    cough2w: {
        type: DataTypes.STRING
    },
    coughBlood: {
        type: DataTypes.STRING
    },
    coughL2w: {
        type: DataTypes.STRING
    },
    weightLoss: {
        type: DataTypes.STRING
    },
    fever: {
        type: DataTypes.STRING
    },
    nightSweat: {
        type: DataTypes.STRING
    },
    contact: {
        type: DataTypes.STRING
    },
    history: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.INTEGER
    },
    deviceName: {
        type: DataTypes.STRING
    },
    deviceOs: {
        type: DataTypes.STRING
    },
    deviceId: {
        type: DataTypes.STRING
    },
    // ----------------------
    
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
});

// HealthResult Model for DM and HT screening
const HealthResult = sequelize.define('HealthResult', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resultType: {
        type: DataTypes.ENUM('DM', 'HT'),
        allowNull: false
    },
    riskLevel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    riskCategory: {
        type: DataTypes.STRING
    },
    fbsValue: {
        type: DataTypes.FLOAT
    },
    hba1cValue: {
        type: DataTypes.FLOAT
    },
    meanGlucoseValue: {
        type: DataTypes.FLOAT
    },
    systolicBP: {
        type: DataTypes.INTEGER
    },
    diastolicBP: {
        type: DataTypes.INTEGER
    },
    consentGiven: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// TaiResult Model for TAI App (DM and HT screening)
// const TaiResult = sequelize.define('TaiResult', {
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true
//     },
//     deviceId: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     resultType: {
//         type: DataTypes.ENUM('DM', 'HT'),
//         allowNull: false
//     },
//     riskLevel: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     riskCategory: {
//         type: DataTypes.STRING
//     },
//     fbsValue: {
//         type: DataTypes.FLOAT
//     },
//     hba1cValue: {
//         type: DataTypes.FLOAT
//     },
//     meanGlucoseValue: {
//         type: DataTypes.FLOAT
//     },
//     systolicBP: {
//         type: DataTypes.INTEGER
//     },
//     diastolicBP: {
//         type: DataTypes.INTEGER
//     },
//     consentGiven: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: true
//     },
//     timestamp: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     },
//     createdAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     }
// });


const TaiResult = sequelize.define('TaiResult', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    creatinine: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: false
    },
    egfrResult: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    tailevel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deviceId: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});



// CVRisk Model for Cardiovascular Risk (From HuaChai App)
const CVRisk = sequelize.define('CVRisk', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    deviceId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    age: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    smoker: {
        type: DataTypes.STRING,
        allowNull: false
    },
    diabetes: {
        type: DataTypes.STRING,
        allowNull: false
    },
    systolicBP: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    isUsingBlood: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    cholesterol: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    waist: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    riskPercent: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    riskLevel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

sequelize.sync({ alter: true }) 
    .then(() => console.log("✅ Database Updated"));

// ✅ Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/save', async (req, res) => {
    try {
        console.log("Received Data:", req.body); 
        const newRecord = await Screening.create(req.body);

        res.status(200).json({ 
            status: 'success', 
            message: 'บันทึกข้อมูลเรียบร้อย',
            data: newRecord
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// ✅ Health Result Endpoint (DM/HT)
app.post('/api/health-result/save', async (req, res) => {
    try {
        console.log("📥 Received health result:", req.body);
        
        if (!HealthResult) {
            console.error("❌ HealthResult model not defined!");
            return res.status(500).json({ error: 'Model not initialized' });
        }

        const newResult = await HealthResult.create({
            deviceId: req.body.deviceId || 'unknown',
            resultType: req.body.resultType || 'DM',
            riskLevel: req.body.riskLevel || 0,
            riskCategory: req.body.riskCategory,
            fbsValue: req.body.fbsValue,
            hba1cValue: req.body.hba1cValue,
            meanGlucoseValue: req.body.meanGlucoseValue,
            systolicBP: req.body.systolicBP,
            diastolicBP: req.body.diastolicBP,
            consentGiven: req.body.consentGiven || true
        });

        console.log("✅ Saved to database:", newResult.id);

        res.status(201).json({
            status: 'success',
            message: 'บันทึกผลลัพธ์เรียบร้อย',
            data: {
                id: newResult.id,
                resultType: newResult.resultType,
                riskLevel: newResult.riskLevel,
                createdAt: newResult.createdAt
            }
        });
    } catch (error) {
        console.error("❌ Error saving health result:", error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// // ✅ Tai Result Endpoint (DM/HT) - For TAI App
// app.post('/api/tai-result/save', async (req, res) => {
//     try {
//         console.log("📥 Received tai result:", req.body);
        
//         if (!TaiResult) {
//             console.error("❌ TaiResult model not defined!");
//             return res.status(500).json({ error: 'Model not initialized' });
//         }

//         const newResult = await TaiResult.create({
//             deviceId: req.body.deviceId || 'unknown',
//             resultType: req.body.resultType || 'DM',
//             riskLevel: req.body.riskLevel || 0,
//             riskCategory: req.body.riskCategory,
//             fbsValue: req.body.fbsValue,
//             hba1cValue: req.body.hba1cValue,
//             meanGlucoseValue: req.body.meanGlucoseValue,
//             systolicBP: req.body.systolicBP,
//             diastolicBP: req.body.diastolicBP,
//             consentGiven: req.body.consentGiven || true
//         });

//         console.log("✅ Saved to database:", newResult.id);

//         res.status(201).json({
//             status: 'success',
//             message: 'บันทึกผลลัพธ์เรียบร้อย',
//             data: {
//                 id: newResult.id,
//                 resultType: newResult.resultType,
//                 riskLevel: newResult.riskLevel,
//                 createdAt: newResult.createdAt
//             }
//         });
//     } catch (error) {
//         console.error("❌ Error saving tai result:", error);
//         res.status(500).json({ 
//             status: 'error', 
//             message: error.message 
//         });
//     }
// });



// ✅ Tai Result Endpoint - CKD (TAI App)
app.post('/api/tai-result/save', async (req, res) => {
    try {
        console.log("📥 Received tai result:", req.body);

        if (!TaiResult) {
            console.error("❌ TaiResult model not defined!");
            return res.status(500).json({ error: 'Model not initialized' });
        }
        console.log("Creating TaiResult with data:", {req: req.body});
        const newResult = await TaiResult.create({
            date: req.body.date,
            age: req.body.age,
            creatinine: req.body.creatinine,
            weight: req.body.weight,
            egfrResult: req.body.result,
            tailevel: req.body.level,
            deviceId: req.body.deviceId || 'unknown'
        });

        console.log("✅ Saved to database:", newResult.id);

        res.status(201).json({
            status: 'success',
            message: 'บันทึกผล CKD เรียบร้อย',
            data: {
                id: newResult.id,
                egfrResult: newResult.egfrResult,
                createdAt: newResult.createdAt
            }
        });
    } catch (error) {
        console.error("❌ Error saving tai result:", error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});




// ✅ CV Risk Endpoint - For HuaChai App (Cardiovascular Risk Calculation)
app.post('/api/cv-risk/save', async (req, res) => {
    try {
        console.log("📥 Received CV Risk data:", req.body);
        
        if (!CVRisk) {
            console.error("❌ CVRisk model not defined!");
            return res.status(500).json({ error: 'Model not initialized' });
        }

        const newRisk = await CVRisk.create({
            deviceId: req.body.deviceId || 'unknown',
            age: req.body.age,
            gender: req.body.gender,
            smoker: req.body.smoker,
            diabetes: req.body.diabetes,
            systolicBP: req.body.systolicBP,
            isUsingBlood: req.body.isUsingBlood || false,
            cholesterol: req.body.cholesterol || null,
            waist: req.body.waist || null,
            height: req.body.height || null,
            riskPercent: req.body.riskPercent,
            riskLevel: req.body.riskLevel
        });

        console.log("✅ Saved CV Risk to database:", newRisk.id);

        res.status(201).json({
            status: 'success',
            message: 'บันทึกข้อมูลความเสี่ยงหัวใจเรียบร้อย',
            data: {
                id: newRisk.id,
                age: newRisk.age,
                riskPercent: newRisk.riskPercent,
                riskLevel: newRisk.riskLevel,
                createdAt: newRisk.createdAt
            }
        });
    } catch (error) {
        console.error("❌ Error saving CV risk:", error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// รัน Server ที่ Port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
});
