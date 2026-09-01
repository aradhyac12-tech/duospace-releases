# DuoSpace Releases

Sync the zip and make it available for preview and then 

DUOSPACE — ADMIN RELEASE MANAGER

Secure APK Upload, Play Store, App Store & IPA Distribution

You are working on the existing DuoSpace marketing/launch website from the latest Phase 3.1 implementation.

This is a functional release-management implementation, not a visual redesign.

The existing premium marketing UI is already approved.

DO NOT redesign the landing page.

DO NOT replace the current animation system.

DO NOT modify the existing visual language unless required to connect the release-management functionality.

The goal is to make the launch website capable of receiving and publishing real DuoSpace releases from an authenticated admin interface.

1. REQUIRED FINAL SYSTEM

Implement this architecture:

                    ADMIN
                      │
                      ▼
             Secure Admin Panel
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
     APK Upload             Store Links
          │                       │
          ▼                       ▼
   Supabase Storage          Release DB
          │                       │
          └───────────┬───────────┘
                      ▼
               Published Release
                      │
                      ▼
             Public Marketing Site
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
        APK       Google Play   App Store


The public website must automatically display the currently published release.

The admin must be the only party capable of:

uploading APK

replacing APK

changing APK metadata

adding/changing Google Play URL

adding/changing Apple App Store URL

adding/changing IPA information if required

changing web-app URL

publishing/unpublishing a release

removing/replacing old APK files

2. CRITICAL SECURITY RULE

Never trust the frontend to determine whether somebody is an admin.

Do NOT implement:

if (user.email === "admin@example.com")


as the actual authorization mechanism.

Do NOT hide an admin button and consider that security.

Do NOT put Supabase service-role credentials in the browser.

Do NOT expose service-role keys in:

.env

Vite client variables

JavaScript bundles

frontend source

Authorization must be enforced server-side through Supabase RLS and/or secure Edge Functions.

3. ADMIN MODEL

Inspect the existing DuoSpace authentication and profile schema before implementing anything.

Reuse the existing authenticated-user system.

Determine how the current project represents roles.

If an existing role system exists, use it.

If no appropriate admin role exists, add a minimal role mechanism such as:

profiles.role


with:

user
admin


Do not create a second authentication system.

Do not duplicate users.

4. ADMIN AUTHORIZATION

Create a secure reusable mechanism such as:

isAdmin()


or the equivalent server-side authorization helper.

It must verify the authenticated user's role from the trusted database state.

All privileged operations must verify admin authorization.

This includes:

upload

delete

update

publish

unpublish

release modification

5. DATABASE DESIGN

Inspect the existing Supabase migrations before creating anything.

Create a migration only if required.

Use a release table similar to:

app_releases


Suggested fields:

id
version
build_number
release_notes
apk_storage_path
apk_filename
apk_size_bytes
apk_sha256
google_play_url
apple_app_store_url
ipa_url
web_url
is_published
created_at
updated_at
published_at
created_by


Do not blindly create every field if an existing release table already exists.

Adapt to the existing schema.

6. IMPORTANT: IPA HANDLING

Understand the difference between APK and IPA distribution.

The website may store an IPA reference/upload if the product requires it, but:

Do not falsely imply that a normal browser download of an IPA automatically installs an iOS application.

For normal public distribution:

Android:
APK download
Google Play

iOS:
Apple App Store


If an IPA is uploaded for internal/testing distribution, label it appropriately.

If the project later supports OTA/iOS enterprise/TestFlight-style distribution, implement that separately.

Do not create a fake "Install IPA" experience.

7. SUPABASE STORAGE

Use Supabase Storage for APK files.

Create an appropriate bucket, for example:

duospace-releases


Prefer a controlled/private bucket if the architecture can securely provide download access.

If the bucket is public, enforce:

public read

admin-only write

admin-only update

admin-only delete

The critical rule is:

PUBLIC → READ/DOWNLOAD
ADMIN → WRITE/UPDATE/DELETE


Do not accidentally grant anonymous upload permission.

8. STORAGE PATH STRUCTURE

Use deterministic release paths.

For example:

releases/
  1.0.0/
    duospace-1.0.0.apk


If multiple builds exist:

releases/
  1.0.0/
    build-100.apk


Do not store every APK as:

latest.apk


because versioned releases are easier to audit and roll back.

9. APK VALIDATION

The admin upload interface must validate:

extension

MIME type where available

file size

filename

version metadata

Only allow:

.apk


for APK upload.

Do not trust MIME type alone.

The extension must also be validated.

10. APK SIZE

Do not hard-code an arbitrary tiny upload limit.

Inspect the current DuoSpace APK size and configure a reasonable Supabase Storage/upload limit.

The UI must show:

Selected file
Size
Version
Upload progress


If the upload is too large:

show a clear error before attempting the upload where possible.

11. APK CHECKSUM

After successful upload, calculate/store:

SHA-256


where practical.

Display in the admin release details:

SHA-256


This is useful for release integrity and debugging.

Do not expose unnecessary internal metadata on the public website.

12. ADMIN RELEASE PAGE

Create an admin-only page such as:

/admin/releases


or integrate into the existing admin area if one already exists.

Do not create a second admin dashboard if the project already has one.

The release manager should contain:

DuoSpace Releases

Current published release
─────────────────────────

Version: 1.2.0
Build: 42
Status: Published

APK
duospace-1.2.0.apk
84.2 MB

Google Play
[configured]

Apple App Store
[configured]

Web
[configured]

─────────────────────────

[Create New Release]


13. CREATE RELEASE UI

Admin should be able to create a release.

Fields:

Version
Build number
Release notes
APK
Google Play URL
Apple App Store URL
Web URL
IPA URL (only if actually required)


Example:

Version
1.2.0

Build
42

Release notes
Bug fixes and improved calling experience.

APK
[Choose APK]

Google Play
https://play.google.com/...

Apple App Store
https://apps.apple.com/...

Web
https://...

IPA
[Optional]


14. URL VALIDATION

Do not accept arbitrary malformed URLs.

Validate:

Google Play

Expected domain:

play.google.com


Apple App Store

Expected domain:

apps.apple.com


Web

Require:

https://


IPA

If an external distribution URL is supplied:

require HTTPS.

Do not silently rewrite URLs.

Show a validation error.

15. URL SECURITY

Do not allow:

javascript:
data:
file:


or other dangerous schemes.

Only allow expected HTTPS URLs.

Do not render admin-supplied HTML.

Render URLs as attributes after validation.

16. DRAFT VS PUBLISHED

This is important.

Do not immediately publish every edit.

Use:

Draft
Published
Archived


or a similarly simple state system.

Workflow:

Create Release
      ↓
Draft
      ↓
Admin reviews
      ↓
Publish
      ↓
Public website updates


Only ONE release should normally be published at a time.

Enforce this at the database/application level rather than relying only on UI logic.

17. PUBLISHING

When admin clicks:

Publish Release


perform an atomic/safe operation:

current published release
        ↓
unpublish
        ↓
new release
        ↓
publish


Avoid a state where two releases appear simultaneously as "current".

Use a transaction/RPC or equivalent safe server-side mechanism where appropriate.

18. PUBLIC RELEASE API

The public marketing website must query only the published release.

Do not fetch all releases into the public frontend.

Use a safe query/view such as:

get_published_release


or:

SELECT ...
FROM app_releases
WHERE is_published = true
LIMIT 1


Expose only fields required by the public website.

Do not expose:

created_by

internal admin metadata

private storage paths

internal audit data

unpublished releases

unless genuinely required.

19. PUBLIC WEBSITE INTEGRATION

Replace the current static release/download configuration only where appropriate.

The current architecture:

downloadLinks.ts


is good and should not simply be deleted.

Refactor it into a fallback/configuration layer if needed.

The public website should obtain:

version
APK
Google Play
App Store
Web


from the published release.

20. FALLBACK BEHAVIOR

If the backend cannot be reached:

the marketing site must still remain visually usable.

Do not break the entire page because the release API failed.

Use a safe fallback:

Download options temporarily unavailable


or the existing configured fallback URLs if available.

Do not show stale links as current unless they are intentionally configured as fallback data.

21. CACHING

Do not hammer Supabase on every animation/render.

Fetch release metadata once.

Cache it appropriately for the page lifecycle.

Do not connect release fetching to scroll animation.

22. DOWNLOAD CTA

The existing premium DownloadCTA must remain visually unchanged.

Only replace its data source.

The CTA should continue to look exactly like the approved Phase 3.1 implementation.

When data exists:

Download APK
Google Play
App Store
Open Web


When data does not exist:

Coming soon


Do not change the animation choreography merely to implement the backend.

23. PLATFORM DETECTION

Preserve the existing:

guessPlatform()


behavior.

Use release data.

Android:

prioritize APK/Google Play.

iOS:

prioritize App Store.

Desktop:

show Web + available mobile options.

Do not hide other platforms unnecessarily.

24. APK DOWNLOAD

When the user clicks:

Download APK


the website should use the currently published APK.

Do not hardcode:

latest.apk


Use the published release's actual storage/download reference.

If using signed URLs:

generate them securely.

Do not put a service-role token into the browser.

25. SIGNED URL EXPIRATION

If the bucket is private and signed URLs are used:

do not generate a very short-lived URL that expires while the user is downloading.

Use a sensible expiry.

If a permanent public download URL is preferable for the launch website, use a public-read bucket with admin-only mutation controls.

Choose the simplest secure architecture compatible with the current Supabase project.

26. ADMIN UPLOAD UX

The upload process should feel polished.

Show:

Choose APK
     ↓
Validate
     ↓
Upload
     ↓
Calculate metadata
     ↓
Release saved
     ↓
Ready to publish


During upload:

Uploading APK
██████████████░░░░
72%


Do not freeze the page.

Handle:

cancellation where feasible

failed upload

retry

duplicate filename

network interruption

27. REPLACE APK

Admin must be able to replace an APK on a draft release.

Do not allow accidental modification of a published release without an explicit confirmation.

Prefer:

Published release
        ↓
Create new release


rather than silently changing the production artifact.

28. DELETE RELEASE

Only admins can delete releases.

Do not allow deletion of the currently published release without a replacement/confirmation.

If possible, prefer archive behavior over destructive deletion.

Do not delete the underlying APK if another release references it.

29. RELEASE HISTORY

Provide a simple history:

1.2.0     Published
1.1.1     Archived
1.1.0     Archived
1.0.0     Archived


Admin can inspect each release.

Public users cannot see unpublished releases.

30. ADMIN AUDIT INFORMATION

For each release, keep:

created_at
updated_at
published_at
created_by


If the existing project already has an audit/logging mechanism, integrate with it.

Do not create unnecessary duplicate audit infrastructure.

31. DATABASE RLS

This is mandatory.

Implement RLS policies appropriate to the actual schema.

Conceptually:

Public

SELECT published release only


Authenticated non-admin

NO release mutation


Admin

SELECT
INSERT
UPDATE
DELETE


as required.

Do not implement admin authorization solely in React.

32. STORAGE RLS/POLICIES

Storage must follow the same principle.

Anonymous/public:

download/read


Admin:

insert
update
delete


Authenticated normal user:

no upload
no delete


Test these policies with different user roles if possible.

33. EDGE FUNCTION OPTION

If the existing Supabase architecture already uses Edge Functions for privileged operations, prefer that pattern.

For example:

publish-release
create-release-download-url
admin-release-management


Do not introduce Edge Functions unnecessarily if normal RLS can safely handle the operation.

Use the simplest secure implementation consistent with the existing backend.

34. NO SERVICE ROLE IN FRONTEND

Search the final source for:

SUPABASE_SERVICE_ROLE_KEY
service_role


The service role must never be shipped to the browser.

If an Edge Function requires it:

keep it server-side only.

35. ADMIN ROUTE PROTECTION

The admin route should:

Verify authentication.

Verify admin role.

Render the admin UI only after authorization.

Redirect unauthorized users.

But remember:

route protection is UX, not the security boundary.

Database/storage policies remain the actual security boundary.

36. ADMIN UI DESIGN

The admin interface does not need the cinematic marketing animation.

It should be:

clean

fast

functional

responsive

easy to operate from Android

readable

error-resistant

The user should be able to publish an APK from their phone.

Prioritize:

Upload
Edit
Preview
Publish


over decorative animation.

37. ADMIN MOBILE SUPPORT

The admin release manager must work on:

Android Chrome
iOS Safari
Desktop Chrome
Desktop Safari


especially Android.

The APK upload control must work properly on mobile file pickers.

Do not require desktop-only drag/drop.

38. RELEASE PREVIEW

Before publishing, show:

Release Preview

DuoSpace 1.2.0
Build 42

APK
84.2 MB

Google Play
Configured

App Store
Configured

Web
Configured

[Publish Release]


This lets the admin catch mistakes.

39. PUBLISH CONFIRMATION

Before publishing:

Publish DuoSpace 1.2.0?

This will replace the currently published release.

APK: configured
Google Play: configured
App Store: configured
Web: configured

[Cancel]
[Publish]


Do not use an instant destructive publish action.

40. PUBLIC RELEASE REFRESH

After publishing a new release:

the public marketing website should obtain the new metadata without requiring a source-code change.

For example:

Admin uploads 1.2.0
        ↓
Publish
        ↓
Marketing site
        ↓
Download buttons now point to 1.2.0


No redeployment should be required merely to change release URLs.

41. RELEASE VALIDATION BEFORE PUBLISH

Do not let an admin accidentally publish an unusable release.

At minimum:

APK

Required if APK distribution is intended.

Google Play

Optional if not launched yet.

App Store

Optional if not launched yet.

Web

Optional depending on product requirements.

The UI should clearly distinguish:

Configured
Missing
Invalid


Do not force every platform to be configured if it isn't launched yet.

42. APK FILE VALIDATION

Where technically practical, verify that the uploaded file is actually an APK rather than merely trusting:

filename.endsWith(".apk")


At minimum validate ZIP/APK structure.

If Android build tooling is available server-side, deeper validation may be considered.

Do not add a heavy Android toolchain to the web server solely for this unless necessary.

43. RELEASE NOTES

Allow optional release notes.

Public website does not need to show them in the hero unless desired.

Admin should be able to retain them for release history.

44. CURRENT VERSION

The public website should display the current version only if the existing design calls for it.

Do not add a large version badge simply because version data now exists.

The premium visual design takes priority.

45. ERROR STATES

Design clear states for:

No published release
Failed to load release
APK unavailable
Store link unavailable
Invalid link
Upload failed
Permission denied
Session expired
Publish failed


Do not expose raw Supabase/database errors to the public.

Admin errors can be more descriptive but should still be readable.

46. SECURITY REVIEW

After implementation, inspect:

frontend
migrations
storage policies
RLS
Edge Functions
environment variables


Look specifically for:

service-role exposure

admin checks only on frontend

unrestricted storage upload

unrestricted storage deletion

anonymous database mutation

arbitrary URL schemes

XSS through release notes/URLs

leaked private storage paths

authorization bypass

Fix any found issues before completion.

47. DO NOT BREAK THE MARKETING SITE

After adding the release manager:

verify that:

Hero remains unchanged

FeatureShowcase remains unchanged

SceneBridge remains unchanged

DeviceMockup remains unchanged

BuiltForTwo remains unchanged

Privacy remains unchanged

DownloadCTA animation remains unchanged

MarketingNav remains unchanged

footer remains unchanged

Only the data powering DownloadCTA should change.

48. ENVIRONMENT VARIABLES

Inspect existing .env configuration.

Do not create unnecessary frontend secrets.

Client-side Supabase configuration may remain public as intended.

Never expose:

SUPABASE_SERVICE_ROLE_KEY


or equivalent privileged credentials.

Document only the safe required variables.

49. MIGRATIONS

Create proper Supabase migrations.

Do not manually instruct the user to edit production database tables through the dashboard if the schema can be represented as a migration.

Include:

table

indexes

RLS

policies

admin role mechanism

storage policies where appropriate

Use the project's existing migration conventions.

50. BUILD/TEST

Run the available checks.

At minimum:

npm run lint
npm run typecheck
npm run build


If dependencies are unavailable because of the known sandbox restriction, report the exact blocker.

Do not fabricate successful test results.

Also inspect the generated source for accidental:

service_role
SUPABASE_SERVICE_ROLE_KEY


exposure.

51. MANUAL TEST MATRIX

Test these scenarios:

Anonymous visitor

Can:

view marketing site

read published release

download published APK

open Google Play

open App Store

Cannot:

access admin

upload

edit

delete

publish

Normal authenticated user

Can:

use normal DuoSpace functionality

Cannot:

upload release

edit release

publish release

delete APK

Admin

Can:

create release

upload APK

edit draft

configure links

preview

publish

archive old release

52. RELEASE TEST

Perform this complete flow:

Admin login
    ↓
Create 1.2.0
    ↓
Upload APK
    ↓
Add Google Play URL
    ↓
Add App Store URL
    ↓
Add Web URL
    ↓
Save draft
    ↓
Preview
    ↓
Publish
    ↓
Open public marketing website
    ↓
Verify version
    ↓
Verify APK button
    ↓
Verify Google Play button
    ↓
Verify App Store button
    ↓
Verify Web button


No source-code modification should be necessary during this process.

53. REAL PHONE VALIDATION

This directly addresses the final Phase 3.1 question:

"Does it remain this polished on a real phone, with real assets, real links and real scrolling?"

After implementation, test the public website on an actual Android phone.

At minimum verify:

Hero
↓
scroll
↓
Ecosystem
↓
feature transitions
↓
BuiltForTwo
↓
Privacy
↓
DownloadCTA


Check:

60fps-feeling scrolling

no horizontal overflow

no accidental taps

no broken sticky scenes

correct device composition

correct download buttons

actual APK download

actual Play Store link

actual App Store link

Do not consider desktop-only testing sufficient.

54. REAL ASSET VALIDATION

Use the actual current DuoSpace assets.

Verify:

logos

icons

screenshots

app UI

APK

version

store URLs

The marketing site should not show placeholder product content at launch.

55. FINAL ADMIN EXPERIENCE

The finished system should make your future release process extremely simple:

New DuoSpace version
        ↓
Open /admin/releases
        ↓
Upload APK
        ↓
Paste Play Store link
        ↓
Paste App Store link
        ↓
Paste Web link
        ↓
Preview
        ↓
Publish
        ↓
Done


No code editing.

No Vite rebuild merely to change URLs.

No manual database editing.

No frontend source modification.

56. IMPORTANT: KEEP CURRENT DESIGN

The existing Phase 3.1 marketing design is approved.

Do not turn the admin functionality into a reason to change:

colors

animation

typography

hero

feature sections

privacy scene

CTA choreography

The release manager is backend/product functionality.

The public launch site remains the cinematic experience already implemented.

57. FINAL REPORT

After implementation report:

Database

tables added/modified

migrations

RLS policies

Storage

bucket

upload policy

download policy

delete policy

Admin

route

authorization

release workflow

Public site

release data integration

download behavior

fallback behavior

Security

admin enforcement

service-role exposure check

storage security

URL validation

Testing

Report actual:

lint

typecheck

build

RLS testing

upload testing

public download testing

If blocked, state exactly why.

Real-device validation

Report whether the website was actually tested on a physical Android/iOS device.

Do not claim this was tested if the environment cannot perform it.

FINAL QUALITY BAR

The final DuoSpace launch system should behave like this:

                         ADMIN
                           │
                           ▼
                 Upload DuoSpace APK
                           │
                           ▼
                  Add store links
                           │
                           ▼
                       Preview
                           │
                           ▼
                       Publish
                           │
                           ▼
                 ┌──────────────────┐
                 │ Published Release│
                 └────────┬─────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
             APK      Google Play   App Store
              │           │           │
              └───────────┼───────────┘
                          ▼
                  Premium DuoSpace
                   Launch Website


The key principle is:

Admin controls the release. The public website consumes the release.

Never let the public control the release.

Never expose privileged credentials.

Never require code changes for a normal app release.

Preserve the existing Phase 3.1 visual experience.

Implement the release-management functionality cleanly, securely and with minimal impact on the marketing UI.

Begin by auditing the existing authentication, Supabase schema, storage configuration and current downloadLinks.ts implementation before writing any new database or frontend code.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fefcb128-0fbd-43a3-8d96-3e1b00d2db1c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
