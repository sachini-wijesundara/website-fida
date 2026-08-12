const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    process.env[match[1]] = val;
  }
});
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: { encrypt: process.env.DB_ENCRYPT === 'true', trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' }
};

const SOLUTION_DETAILS = {
  "SMART HRIS": {
    title: "HR,", subtitle: "Reimagined",
    description: "A modern connected workforce platform that unifies HR and payroll into a single, automated platform — building a better way to manage your workforce with transparency and control.",
    features: ["Full HRIS capabilities", "Manager self service", "Real-time reporting"],
    image: "/images/solutions_images/smarthris.png", furtherDetailsName: "Smart HRIS",
  },
  "FIDA Task Manager": {
    title: "Workflows,", subtitle: "Streamlined",
    description: "Streamline project workflows with intelligent task prioritization and real-time team synchronization across your entire organization.",
    features: ["Intelligent task prioritization", "Real-time team sync", "Visual workflow tracking"],
    image: "/images/solutions_images/taskmanager.png", furtherDetailsName: "Fida Task Manager",
  },
  "Access Control & Attendance": {
    title: "Attendance,", subtitle: "Simplified",
    description: "Enterprise-grade biometric security and automated attendance tracking for high-traffic environments and secure facilities.",
    features: ["Biometric security integration", "Automated attendance tracking", "Secure facility control"],
    image: "/images/solutions_images/attendance.png", furtherDetailsName: "Access Control & Attendance",
  },
  "FIDA Helpdesk System": {
    title: "Support,", subtitle: "Reengineered",
    description: "Resolution-focused support infrastructure designed for rapid deployment and high customer satisfaction rates.",
    features: ["Rapid ticket resolution", "Resolution-focused workflows", "High customer satisfaction"],
    image: "/images/solutions_images/helpdesk.png", furtherDetailsName: "Fida Helpdesk System",
  },
  "FIDA Business Consultancy": {
    title: "Strategy,", subtitle: "Executed",
    description: "Strategic advisory and digital transformation expertise to scale your enterprise operations with precision and clarity.",
    features: ["Strategic business advisory", "Digital transformation roadmap", "Scaled enterprise operations"],
    image: "/images/solutions_images/bpo&services.png", furtherDetailsName: "Fida Business Consultancy",
  }
};

const BASE_TEMPLATE = {
  features_section: {
    title: "Built for Enterprise Efficiency",
    cards: [
      {
        title: "Core Management",
        description: "The foundation of your organization, digitized. Manage multiple companies and departments, maintain complete employee profiles, and keep every document organized and accessible.",
        iconBg: "#3b82f6", iconText: "white", image: "/images/solutions_images/smarthrispic1.png"
      },
      {
        title: "Time & Payroll",
        description: "Payroll that runs itself. Attendance tracking, online salary processing, loan management, and increments — accurate and on schedule, every cycle.",
        iconBg: "#dbeafe", iconText: "#2563eb", image: "/images/solutions_images/smarthrispic2.png"
      },
      {
        title: "Employee Experience",
        description: "HR that employees actually engage with. A self-service portal, smart SMS/email alerts, meal tracking, benefits, and welfare deduction schemes — all in employees' hands.",
        iconBg: "#0d9488", iconText: "white", image: ""
      },
      {
        title: "Growth, Performance & Insights",
        description: "Develop your workforce and see the full picture. Performance tracking, training, recruitment, and promotions — backed by live dashboards, reports, and complete asset management.",
        iconBg: "#fecdd3", iconText: "#e11d48", image: ""
      }
    ]
  },
  stats: {
    percentage: "70%",
    title: "Reduction in manual HR work",
    description: "Measured across payroll, attendance, and employee-record processes — from single-department teams to multi-company enterprises.",
    before_text: "Before Smart HRIS, HR teams spent their time on manual payroll runs, paper-based leave requests, and scattered employee records — treated as a back-office cost, not a function that adds value.",
    after_text: "Payroll, attendance, records, and performance — now managed on one platform, with employees empowered to access their own data."
  },
  bottom_text: "HR shifted from cost centre to profit engine - automated, self-service, and fully in your control."
};

async function run() {
  let pool;
  try {
    pool = await sql.connect(config);
    console.log("Connected to DB.");

    // Add template_data column
    console.log("Adding template_data column to Solutions...");
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Solutions') AND name = 'template_data')
      ALTER TABLE Solutions ADD template_data NVARCHAR(MAX);
    `);

    // Fetch solutions and update with default JSON
    const solutionsResult = await pool.request().query('SELECT id, title FROM Solutions');
    for (const sol of solutionsResult.recordset) {
      let heroData = SOLUTION_DETAILS["SMART HRIS"];
      
      // Match by title
      for (const key of Object.keys(SOLUTION_DETAILS)) {
         if (sol.title.includes(key)) {
            heroData = SOLUTION_DETAILS[key];
            break;
         }
      }

      const templateData = {
        hero: heroData,
        ...BASE_TEMPLATE
      };

      await pool.request()
        .input('id', sql.Int, sol.id)
        .input('template_data', sql.NVarChar(sql.MAX), JSON.stringify(templateData))
        .query('UPDATE Solutions SET template_data = @template_data WHERE id = @id');
      console.log(`Updated template_data for ${sol.title}`);
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    if (pool) pool.close();
  }
}
run();
