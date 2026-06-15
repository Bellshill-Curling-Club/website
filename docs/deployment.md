# Deployment (Azure Static Web Apps)

## What runs, when, and why

The site is deployed to **Azure Static Web Apps (Free tier)** by **two GitHub Actions workflows** in `.github/workflows/`:

| Workflow file                                              | Triggers                                          | What it does                                                                                                                                                                       |
| ---------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `azure-static-web-apps-salmon-ground-02c903003.yml`        | Push to `main`, PR opened/updated, PR closed       | The main deploy workflow. Contains two jobs (see below).                                                                                                                           |
| `cleanup-stale-previews.yml`                               | Nightly at 03:00 UTC, or **Run workflow** button   | Safety net that deletes preview environments for PRs that are already closed.                                                                                                      |

Inside the main deploy workflow there are two jobs:

1. **Build and Deploy Job** — runs on every push to `main` and every PR open/update. Builds the site (`npm run build` → `dist/`) and uploads it to Azure SWA. For PRs, Azure SWA automatically creates a **preview environment** at `https://salmon-ground-02c903003-<PR#>.<region>.azurestaticapps.net` so reviewers can click a link in the PR conversation.
2. **Close Pull Request Job** — runs when a PR is closed (merged or rejected). Calls the Azure REST API to delete that PR's preview environment so they don't pile up. Waits up to 60 s for the preview build to register, then exits cleanly. If it misses (e.g. you closed before the build finished), the nightly sweeper picks it up.

The nightly sweeper workflow lists every preview environment in the Static Web App, asks GitHub whether each PR is still open, and deletes any whose PR is `closed`. It will skip open PRs and is conservative when a PR's state can't be determined.

> **Why two workflows?** The deploy workflow handles the happy path immediately on PR close. The sweeper exists because GitHub Actions jobs are billed per minute — instead of letting the close-PR job poll for 10 minutes waiting for a slow build, we wait briefly (~60 s) and rely on the nightly run to mop up anything missed. This keeps Actions usage minimal.

## One-time setup

These steps create everything the workflows need to authenticate to Azure. You only do this once per repo.

### 1. Create the Static Web App

1. In the Azure Portal: **Create a resource → Static Web App**.
2. **Plan:** Free. **Source:** GitHub. Pick this repo and the `main` branch.
3. **Build presets:** Astro (or set manually — App location `/`, Output location `dist`, API location blank).
4. **Review + create**.

Azure will:

- Add a workflow file under `.github/workflows/` (this repo already includes a compatible one).
- Add the secret `AZURE_STATIC_WEB_APPS_API_TOKEN_SALMON_GROUND_02C903003` to your GitHub repo automatically — used by the Build and Deploy Job.
- Deploy your site to `https://<random-name>.azurestaticapps.net`.

### 2. Create an Entra ID App Registration (for OIDC auth)

The Close-PR job and the nightly sweeper use **OIDC (workload identity federation)** to call the Azure REST API — no client secrets stored in GitHub.

1. In the Azure Portal: **Microsoft Entra ID → App registrations → New registration**. Any name (e.g. `github-website-deploy`). Click **Register**.
2. From the Overview blade, copy the **Application (client) ID** and the **Directory (tenant) ID** — you'll paste these into GitHub secrets in step 5.

### 3. Grant the App Registration access to the Static Web App

1. In the Azure Portal, open the Static Web App's **resource group** → **Access control (IAM) → Add → Add role assignment**.
2. Role: **Website Contributor** (or **Contributor**). Click **Next**.
3. Members → **Select members** → search for the App Registration name from step 2 → select it.
4. **Review + assign**.

Without this, the workflows will get `Authorization failed` errors when calling the Azure REST API to delete preview environments.

### 4. Add federated credentials on the App Registration

Federated credentials tell Entra ID "trust GitHub-issued tokens for this specific repo/event". Go to the App Registration → **Certificates & secrets → Federated credentials → Add credential**. Pick **GitHub Actions deploying Azure resources** and create **two** credentials:

| Purpose                       | Entity type          | Result (subject claim)                                       |
| ----------------------------- | -------------------- | ------------------------------------------------------------ |
| Push-to-main deploys & scheduled/manual sweeper runs | **Branch** → `main`  | `repo:Bellshill-Curling-Club/website:ref:refs/heads/main` |
| Close-PR cleanup runs         | **Pull request**     | `repo:Bellshill-Curling-Club/website:pull_request`           |

Both share the same Issuer (`https://token.actions.githubusercontent.com`) and Audience (`api://AzureADTokenExchange`).

**Why two?** GitHub OIDC tokens have different `subject` claims depending on what triggered the workflow:

- Pushes, scheduled (`cron`) runs, and manual `workflow_dispatch` runs all use `ref:refs/heads/<default-branch>` — so the **Branch → `main`** credential covers all three.
- PR-triggered runs (including the close-PR job) **always** use `pull_request`, regardless of the target branch — hence the second credential.

If a credential is missing you'll see `AADSTS700213: No matching federated identity record found for presented assertion subject '…'` — the error tells you the exact subject value to add.

### 5. Add GitHub repository secrets

**Settings → Secrets and variables → Actions → Secrets tab → New repository secret**:

| Secret                  | Value                                                              | Used by                              |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| `AZURE_CLIENT_ID`       | Application (client) ID from step 2                                | Close-PR job, nightly sweeper        |
| `AZURE_TENANT_ID`       | Directory (tenant) ID from step 2                                  | Close-PR job, nightly sweeper        |
| `AZURE_SUBSCRIPTION_ID` | Your Azure subscription ID                                         | Close-PR job, nightly sweeper        |

(`AZURE_STATIC_WEB_APPS_API_TOKEN_SALMON_GROUND_02C903003` was added automatically in step 1 — leave it alone.)

### 6. Add GitHub repository variables

**Settings → Secrets and variables → Actions → Variables tab → New repository variable** (note: _Variables_, not Secrets):

| Variable                   | Value                                                       |
| -------------------------- | ----------------------------------------------------------- |
| `AZURE_SWA_NAME`           | The Static Web App resource name (e.g. `bellshillcc-web-dev`) |
| `AZURE_SWA_RESOURCE_GROUP` | The resource group containing the Static Web App            |

Find both with:

```bash
az staticwebapp list --query "[].{name:name, rg:resourceGroup}" -o table
```

The Close-PR job has a `Validate inputs` step that fails fast with a clear message if either variable is missing — so a misconfigured repo is obvious instead of silently passing an empty `--name ""` to the Azure CLI.

## Running the cleanup sweeper manually

Useful after testing, or if you want to clear an environment without waiting for 03:00 UTC.

1. **Actions → Cleanup stale SWA preview environments → Run workflow**.
2. Pick a branch (any branch — the workflow file must exist on `main` for the button to appear).
3. **Run workflow**.

The job lists every preview build, checks each PR's state on GitHub, and deletes the ones whose PR is `closed`.

## Custom domain

In your Static Web App resource → **Custom domains → Add** → follow the CNAME instructions for your DNS provider. SSL certificates are issued automatically.

## Subsequent deployments

Every push to `main` triggers a deploy. Every pull request gets a temporary preview URL. PR previews are cleaned up automatically by the close-PR job (with the nightly sweeper as a safety net).

## Troubleshooting

| Symptom                                                                                                    | Likely cause / fix                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AADSTS700213: No matching federated identity record found for presented assertion subject '…'`            | A federated credential is missing on the App Registration for that subject. Copy the subject from the error and add it (see step 4 above).                                                      |
| `Login failed with Error: Using auth-type: SERVICE_PRINCIPAL. Not all values are present.`                 | One of `AZURE_CLIENT_ID` / `AZURE_TENANT_ID` / `AZURE_SUBSCRIPTION_ID` is missing or empty in repo secrets (step 5).                                                                            |
| `ERROR: Static site was '' not found in subscription.`                                                     | `AZURE_SWA_NAME` or `AZURE_SWA_RESOURCE_GROUP` repo variable is missing or empty (step 6). The `Validate inputs` step should catch this — if it didn't, check the variable was actually saved.   |
| Close-PR job prints `No preview environment for PR #N (branch '...') appeared within 60s.`                | Build hadn't finished registering the preview env in time. The nightly sweeper will catch it — or run it manually from Actions.                                                                  |
| `Authorization failed` when deleting a build                                                               | The App Registration doesn't have **Website Contributor** / **Contributor** on the SWA's resource group (step 3).                                                                                |

To see the raw list of preview environments in your SWA at any time:

```bash
az rest --method GET --url "https://management.azure.com/subscriptions/$(az account show --query id -o tsv)/resourceGroups/<your-rg>/providers/Microsoft.Web/staticSites/<your-swa>/builds?api-version=2022-03-01" --query "value[].{name:name, branch:sourceBranch, prTitle:pullRequestTitle, status:status}" -o table
```
