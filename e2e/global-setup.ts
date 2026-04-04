/**
 * Global setup for ShadowyRealm UAT.
 *
 * INSTALL-CONFIG: Wipes all entities and recreates a confirmed test user.
 * Ensures clean state for every UAT run.
 */

import { TEST_USER } from "./fixtures/demo-data";

async function globalSetup() {
  // Read production creds from .env file directly (process.env may be polluted by local Supabase CLI)
  const { readFileSync } = await import("fs");
  const { resolve, dirname } = await import("path");
  const { fileURLToPath } = await import("url");
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const envContent = readFileSync(
    resolve(__dirname, "../../../.env"),
    "utf-8",
  );
  const getEnv = (key: string) =>
    envContent.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1]?.trim();

  const supabaseUrl =
    getEnv("SUPABASE_URL") ?? "https://qgfmwstgkwyqqwyqroav.supabase.co";
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!serviceRoleKey) {
    console.log(
      "SUPABASE_SERVICE_ROLE_KEY not set — skipping test user creation.",
    );
    return;
  }

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };

  // 1. Wipe ALL entities — try SQL first, then REST API as fallback
  console.log("Cleaning all entities from shadowyrealm schema...");
  const dbPassword = getEnv("SUPABASE_DB_PASSWORD");
  const projectRef = supabaseUrl.match(/https:\/\/(\w+)\.supabase/)?.[1];
  let sqlCleanupOk = false;

  if (dbPassword && projectRef) {
    const { execSync } = await import("child_process");
    try {
      execSync(
        `psql "postgresql://postgres.${projectRef}@aws-1-us-east-1.pooler.supabase.com:5432/postgres" -c "DELETE FROM shadowyrealm.entities; ALTER ROLE authenticator SET pgrst.db_schemas TO 'public,graphql_public,blog,shadowyrealm'; NOTIFY pgrst, 'reload config';"`,
        {
          stdio: "pipe",
          timeout: 15000,
          env: { ...process.env, PGPASSWORD: dbPassword },
        },
      );
      console.log("Entities cleaned via SQL.");
      sqlCleanupOk = true;
    } catch (err) {
      console.log(`SQL cleanup failed, falling back to REST API: ${(err as Error).message?.slice(0, 120)}`);
    }
  }

  if (!sqlCleanupOk) {
    // Delete dependent records first (assessments, periods, relationships, audit log), then entities
    for (const table of ["entity_audit_log", "relationships", "assessments", "assessment_periods", "entities"]) {
      const deleteRes = await fetch(`${supabaseUrl}/rest/v1/${table}?id=not.is.null`, {
        method: "DELETE",
        headers: {
          ...headers,
          "Accept-Profile": "shadowyrealm",
          "Content-Profile": "shadowyrealm",
          Prefer: "return=minimal",
        },
      });
      if (!deleteRes.ok) {
        console.log(`  ${table}: ${deleteRes.status} ${await deleteRes.text()}`);
      } else {
        console.log(`  ${table}: cleaned`);
      }
    }
  }

  // 2. Find or create test user, reset password either way
  console.log(`Setting up test user: ${TEST_USER.email}`);

  // Check if user already exists
  let testUserId: string | null = null;
  const listRes = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=100`,
    { headers },
  );
  if (listRes.ok) {
    const listData = await listRes.json();
    const existing = (listData.users ?? []).find(
      (u: { email: string }) => u.email === TEST_USER.email,
    );
    if (existing) testUserId = existing.id;
  }

  if (testUserId) {
    // Update existing user — reset password and ensure email is confirmed
    console.log(`Found existing test user ${testUserId}, resetting password...`);
    const updateRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${testUserId}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          password: TEST_USER.password,
          email_confirm: true,
        }),
      },
    );
    if (!updateRes.ok) {
      const body = await updateRes.text();
      throw new Error(`Failed to update test user: ${updateRes.status} ${body}`);
    }
    console.log("Test user password reset.");
  } else {
    // Create fresh user
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
        email_confirm: true,
      }),
    });
    const createBody = await createRes.json();
    if (!createRes.ok) {
      throw new Error(
        `Failed to create test user: ${createRes.status} ${JSON.stringify(createBody)}`,
      );
    }
    testUserId = createBody.id;
    console.log(`Test user created: ${testUserId}`);
  }

  // Verify login works
  const loginRes = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: getEnv("SUPABASE_ANON_KEY") ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
      }),
    },
  );

  if (!loginRes.ok) {
    const loginBody = await loginRes.text();
    throw new Error(`Login verification failed after user creation: ${loginBody}`);
  }

  console.log("Login verification passed.");
}

export default globalSetup;
