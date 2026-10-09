import { getDbConnection } from "@/lib/db";

let dbObjectsEnsured = false;

export const defaultTermsHeader = {
  id: 1,
  title: "FIDA Global Website Terms and Conditions",
  subtitle: "Privacy Notice and Cookie Policy",
  company_version: "FIDA Global (Private) Limited | Version 1.0 | Draft for Board approval",
  website_url: "https://www.fidaglobal.com/",
  effective_date: "05th August -2026.",
  intro_text: "These Terms explain how visitors may use our corporate website and AI assistant, how we handle website information and enquiries, and how visitors can control optional cookies and communications. They apply to this website; commercial products and customer systems are governed by their separate agreements."
};

export async function ensureHeaderDbObjects(pool: any) {
  if (dbObjectsEnsured) return;

  // 1. Ensure Table
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TermsHeaderSettings')
    BEGIN
        CREATE TABLE TermsHeaderSettings (
            id INT PRIMARY KEY DEFAULT 1,
            title NVARCHAR(255) NOT NULL DEFAULT 'FIDA Global Website Terms and Conditions',
            subtitle NVARCHAR(255) NULL,
            company_version NVARCHAR(255) NULL,
            website_url NVARCHAR(255) NULL,
            effective_date NVARCHAR(100) NULL,
            intro_text NVARCHAR(MAX) NULL,
            updated_at DATETIME DEFAULT GETDATE()
        );

        INSERT INTO TermsHeaderSettings (id, title, subtitle, company_version, website_url, effective_date, intro_text)
        VALUES (
            1,
            'FIDA Global Website Terms and Conditions',
            'Privacy Notice and Cookie Policy',
            'FIDA Global (Private) Limited | Version 1.0 | Draft for Board approval',
            'https://www.fidaglobal.com/',
            '05th August -2026.',
            'These Terms explain how visitors may use our corporate website and AI assistant, how we handle website information and enquiries, and how visitors can control optional cookies and communications. They apply to this website; commercial products and customer systems are governed by their separate agreements.'
        );
    END
  `);

  // 2. Ensure Stored Procedures
  await pool.request().query(`
    -- sp_GetTermsHeader
    IF OBJECT_ID('sp_GetTermsHeader', 'P') IS NULL
        EXEC('CREATE PROCEDURE sp_GetTermsHeader AS BEGIN SET NOCOUNT ON; END');
  `);
  await pool.request().query(`
    ALTER PROCEDURE sp_GetTermsHeader
    AS
    BEGIN
        SET NOCOUNT ON;
        SELECT TOP 1 id, title, subtitle, company_version, website_url, effective_date, intro_text, updated_at
        FROM TermsHeaderSettings
        WHERE id = 1;
    END
  `);

  await pool.request().query(`
    -- sp_UpsertTermsHeader
    IF OBJECT_ID('sp_UpsertTermsHeader', 'P') IS NULL
        EXEC('CREATE PROCEDURE sp_UpsertTermsHeader AS BEGIN SET NOCOUNT ON; END');
  `);
  await pool.request().query(`
    ALTER PROCEDURE sp_UpsertTermsHeader
        @Title NVARCHAR(255),
        @Subtitle NVARCHAR(255) = NULL,
        @CompanyVersion NVARCHAR(255) = NULL,
        @WebsiteUrl NVARCHAR(255) = NULL,
        @EffectiveDate NVARCHAR(100) = NULL,
        @IntroText NVARCHAR(MAX) = NULL
    AS
    BEGIN
        SET NOCOUNT ON;
        IF EXISTS (SELECT 1 FROM TermsHeaderSettings WHERE id = 1)
        BEGIN
            UPDATE TermsHeaderSettings
            SET title = @Title,
                subtitle = @Subtitle,
                company_version = @CompanyVersion,
                website_url = @WebsiteUrl,
                effective_date = @EffectiveDate,
                intro_text = @IntroText,
                updated_at = GETDATE()
            WHERE id = 1;
        END
        ELSE
        BEGIN
            INSERT INTO TermsHeaderSettings (id, title, subtitle, company_version, website_url, effective_date, intro_text, updated_at)
            VALUES (1, @Title, @Subtitle, @CompanyVersion, @WebsiteUrl, @EffectiveDate, @IntroText, GETDATE());
        END

        SELECT TOP 1 id, title, subtitle, company_version, website_url, effective_date, intro_text, updated_at
        FROM TermsHeaderSettings
        WHERE id = 1;
    END
  `);

  dbObjectsEnsured = true;
}

export async function fetchTermsHeaderFromDb() {
  try {
    const pool = await getDbConnection();
    await ensureHeaderDbObjects(pool);

    const result = await pool.request().execute("sp_GetTermsHeader");
    if (result.recordset && result.recordset.length > 0) {
      return result.recordset[0];
    }
  } catch (error) {
    console.error("fetchTermsHeaderFromDb error:", error);
  }
  return defaultTermsHeader;
}
