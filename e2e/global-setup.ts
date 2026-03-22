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

  // 1. Wipe ALL entities via direct SQL (bypasses PostgREST schema config issues)
  console.log("Cleaning all entities from shadowyrealm schema via SQL...");
  const dbPassword = getEnv("SUPABASE_DB_PASSWORD");
  const projectRef = supabaseUrl.match(/https:\/\/(\w+)\.supabase/)?.[1];

  console.log(`DB: pw=${dbPassword ? 'set' : 'unset'}, ref=${projectRef}, url=${supabaseUrl?.slice(0, 30)}`);
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
      console.log("Entities cleaned and PostgREST schemas updated via SQL.");
    } catch (err) {
      console.log(`SQL cleanup warning: ${(err as Error).message?.slice(0, 200)}`);
    }
  } else {
    // Fallback to REST API
    console.log("No DB password — falling back to REST API for cleanup...");
    const deleteRes = await fetch(`${supabaseUrl}/rest/v1/entities?id=gt.0`, {
      method: "DELETE",
      headers: {
        ...headers,
        "Accept-Profile": "shadowyrealm",
        "Content-Profile": "shadowyrealm",
        Prefer: "return=minimal",
      },
    });
    if (!deleteRes.ok) {
      console.log(`Entity cleanup: ${deleteRes.status} ${await deleteRes.text()}`);
    }
  }

  // 2. Delete ALL users matching the test email (handles duplicates)
  console.log(`Setting up test user: ${TEST_USER.email}`);
  const listRes = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=100`,
    { headers },
  );

  if (listRes.ok) {
    const listData = await listRes.json();
    const matchingUsers = (listData.users ?? []).filter(
      (u: { email: string }) => u.email === TEST_USER.email,
    );
    for (const user of matchingUsers) {
      console.log(`Deleting old test user ${user.id}...`);
      await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
        method: "DELETE",
        headers,
      });
    }
    if (matchingUsers.length > 0) {
      console.log(`Deleted ${matchingUsers.length} old test user(s).`);
    }
  }

  // 3. Create fresh user with confirmed email
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

  console.log(
    `Test user created: ${createBody.id}, confirmed: ${createBody.email_confirmed_at}`,
  );

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
