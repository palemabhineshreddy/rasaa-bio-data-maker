# How to Run Rasaa Bio Data Maker

## Prerequisites
- Node.js installed (v18 or higher recommended)
- Terminal / VS Code integrated terminal

---

## Step 1 — Open the project folder in terminal

```bash
cd "/Users/abhineshreddy/AI -Claude Projects/biodata-maker"
```

---

## Step 2 — Install dependencies (first time only)

```bash
npm install
```

---

## Step 3 — Start the development server

```bash
npm run dev
```

You will see:

```
VITE v8.x.x  ready in ~500ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## Other Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production → output goes to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Stop the server

Press **Ctrl + C** in the terminal.

---

## Deploy to AWS (bandhan.app)

Bandhan is hosted on **AWS S3 + CloudFront**. You need the AWS CLI installed and your credentials set up before you can deploy.

---

### One-time setup — install AWS CLI

Check if it's already installed:

```bash
aws --version
```

If not installed, download from: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

---

### Step A — Sign in to AWS from terminal

**Option 1: Access Key (most common)**

Run once to save your credentials locally:

```bash
aws configure
```

It will prompt for 4 things:
```
AWS Access Key ID:     → paste your access key
AWS Secret Access Key: → paste your secret key
Default region name:   → ap-south-1
Default output format: → json
```

Get your Access Key from: AWS Console → top-right username → Security credentials → Access keys → Create access key.

**Option 2: SSO login (if your account uses AWS SSO)**

```bash
aws sso login --profile your-profile-name
```

---

### Step B — Verify you're logged in

```bash
aws sts get-caller-identity
```

You should see your Account ID and user/role name. If you get an error, your credentials are wrong or expired.

---

### Step C — Get your CloudFront Distribution ID

```bash
aws cloudfront list-distributions --query "DistributionList.Items[*].{ID:Id,Domain:DomainName}" --output table
```

Find the row with `bandhan.app` or the CloudFront domain. Copy the **ID** (looks like `E1XXXXXXXXX`).

---

### Step D — Deploy

Run all three commands in order:

```bash
# 1. Build the production files
npm run build

# 2. Upload to S3 (--delete removes old files that no longer exist)
aws s3 sync dist/ s3://bandhan.app --delete

# 3. Clear CloudFront cache so users get the new version immediately
aws cloudfront create-invalidation --distribution-id E1XXXXXXXXX --paths "/*"
```

Replace `E1XXXXXXXXX` with your actual Distribution ID from Step C.

The invalidation takes ~30–60 seconds. After that, bandhan.app is live with the new build.

---

### Full deploy — one copy-paste block

```bash
npm run build && \
aws s3 sync dist/ s3://bandhan.app --delete && \
aws cloudfront create-invalidation --distribution-id E1XXXXXXXXX --paths "/*"
```
