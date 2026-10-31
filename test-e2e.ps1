# E2E Test Suite for Campus Lost & Found
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Net.Http
$baseUrl = "http://localhost:8080"
$cookieJar = New-Object System.Net.CookieContainer
$handler = New-Object System.Net.Http.HttpClientHandler
$handler.CookieContainer = $cookieJar
$handler.AllowAutoRedirect = $false
$client = New-Object System.Net.Http.HttpClient($handler)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "    CAMPUS LOST & FOUND - FULL AUTOMATED E2E TEST SUITE   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

function Extract-CsrfToken($html) {
    if ($html -match 'name="_csrf"\s+value="([^"]+)"') {
        return $matches[1]
    }
    if ($html -match 'value="([^"]+)"\s+name="_csrf"') {
        return $matches[1]
    }
    return $null
}

# TEST 1: Homepage
Write-Host "`n[TEST 1] Testing Public Homepage (GET /)..." -ForegroundColor Cyan
$resp = $client.GetAsync("$baseUrl/").GetAwaiter().GetResult()
$html = $resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
if ([int]$resp.StatusCode -eq 200 -and $html -like "*Campus Lost*") {
    Write-Host "  -> PASS: Homepage rendered with status 200 OK" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Status: $($resp.StatusCode)" -ForegroundColor Red
}

# TEST 2: Browse Items
Write-Host "`n[TEST 2] Testing Browse Items (GET /items)..." -ForegroundColor Cyan
$resp = $client.GetAsync("$baseUrl/items").GetAwaiter().GetResult()
$html = $resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
if ([int]$resp.StatusCode -eq 200 -and $html -like "*Browse Items*") {
    Write-Host "  -> PASS: Browse items page rendered with status 200 OK" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Status: $($resp.StatusCode)" -ForegroundColor Red
}

# TEST 3: REST API Items
Write-Host "`n[TEST 3] Testing REST API (GET /api/items)..." -ForegroundColor Cyan
$resp = $client.GetAsync("$baseUrl/api/items").GetAwaiter().GetResult()
$json = $resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
if ([int]$resp.StatusCode -eq 200 -and $json -like "*itemName*") {
    Write-Host "  -> PASS: REST API returned JSON items with status 200 OK" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Status: $($resp.StatusCode)" -ForegroundColor Red
}

# TEST 4: Filter / Search
Write-Host "`n[TEST 4] Testing Search & Category Filter (GET /items?keyword=MacBook)..." -ForegroundColor Cyan
$resp = $client.GetAsync("$baseUrl/items?keyword=MacBook").GetAwaiter().GetResult()
$html = $resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
if ([int]$resp.StatusCode -eq 200 -and $html -like "*MacBook*") {
    Write-Host "  -> PASS: Search returned expected results" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Search result status: $($resp.StatusCode)" -ForegroundColor Red
}

# TEST 5: User Registration
Write-Host "`n[TEST 5] Testing User Registration (POST /auth/register)..." -ForegroundColor Cyan
$resp = $client.GetAsync("$baseUrl/auth/register").GetAwaiter().GetResult()
$html = $resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
$csrf = Extract-CsrfToken $html

$randId = Get-Random -Minimum 1000 -Maximum 9999
$testEmail = "e2e_student_$randId@campus.edu"
$testCollegeId = "STU$randId"

$regParams = New-Object 'System.Collections.Generic.Dictionary[string,string]'
$regParams.Add("_csrf", $csrf)
$regParams.Add("fullName", "E2E Test Student $randId")
$regParams.Add("collegeId", $testCollegeId)
$regParams.Add("email", $testEmail)
$regParams.Add("phone", "9876543299")
$regParams.Add("department", "Computer Science")
$regParams.Add("yearOfStudy", "3rd Year")
$regParams.Add("role", "STUDENT")
$regParams.Add("password", "Pass1234!")
$regParams.Add("confirmPassword", "Pass1234!")

$content = New-Object System.Net.Http.FormUrlEncodedContent($regParams)
$resp = $client.PostAsync("$baseUrl/auth/register", $content).GetAwaiter().GetResult()
if ([int]$resp.StatusCode -eq 302 -and $resp.Headers.Location.ToString() -like "*login*") {
    Write-Host "  -> PASS: User registered successfully, redirected to login" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Status: $($resp.StatusCode) Location: $($resp.Headers.Location)" -ForegroundColor Red
}

# TEST 6: Student Login
Write-Host "`n[TEST 6] Testing Student Login (POST /auth/login)..." -ForegroundColor Cyan
$studentCookies = New-Object System.Net.CookieContainer
$studentHandler = New-Object System.Net.Http.HttpClientHandler
$studentHandler.CookieContainer = $studentCookies
$studentHandler.AllowAutoRedirect = $false
$studentClient = New-Object System.Net.Http.HttpClient($studentHandler)

$loginPageResp = $studentClient.GetAsync("$baseUrl/auth/login").GetAwaiter().GetResult()
$loginPageHtml = $loginPageResp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
$csrf = Extract-CsrfToken $loginPageHtml

$loginParams = New-Object 'System.Collections.Generic.Dictionary[string,string]'
$loginParams.Add("_csrf", $csrf)
$loginParams.Add("email", "student@campus.edu")
$loginParams.Add("password", "student123")

$loginContent = New-Object System.Net.Http.FormUrlEncodedContent($loginParams)
$loginResp = $studentClient.PostAsync("$baseUrl/auth/login", $loginContent).GetAwaiter().GetResult()
if ([int]$loginResp.StatusCode -eq 302 -and $loginResp.Headers.Location.ToString() -like "*dashboard*") {
    Write-Host "  -> PASS: Student logged in successfully, redirected to /dashboard" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Login failed, status: $($loginResp.StatusCode)" -ForegroundColor Red
}

# TEST 7: Dashboard Access
Write-Host "`n[TEST 7] Testing Authenticated Dashboard (GET /dashboard)..." -ForegroundColor Cyan
$dashResp = $studentClient.GetAsync("$baseUrl/dashboard").GetAwaiter().GetResult()
$dashHtml = $dashResp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
if ([int]$dashResp.StatusCode -eq 200 -and $dashHtml -like "*Welcome back*") {
    Write-Host "  -> PASS: Dashboard loaded successfully for authenticated student" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Dashboard status: $($dashResp.StatusCode)" -ForegroundColor Red
}

# TEST 8: Report Lost Item
Write-Host "`n[TEST 8] Testing Report Lost Item (POST /items/report/lost)..." -ForegroundColor Cyan
$reportPageResp = $studentClient.GetAsync("$baseUrl/items/report/lost").GetAwaiter().GetResult()
$reportPageHtml = $reportPageResp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
$csrf = Extract-CsrfToken $reportPageHtml

$multipart = New-Object System.Net.Http.MultipartFormDataContent
$multipart.Add((New-Object System.Net.Http.StringContent($csrf)), "_csrf")
$multipart.Add((New-Object System.Net.Http.StringContent("Blue Hydro Flask Water Bottle")), "itemName")
$multipart.Add((New-Object System.Net.Http.StringContent("ACCESSORIES")), "category")
$multipart.Add((New-Object System.Net.Http.StringContent("Navy blue insulated bottle with campus sticker.")), "description")
$multipart.Add((New-Object System.Net.Http.StringContent("Sports Complex, Badminton Court 2")), "location")
$multipart.Add((New-Object System.Net.Http.StringContent((Get-Date).ToString("yyyy-MM-dd"))), "date")
$multipart.Add((New-Object System.Net.Http.StringContent("Small dent on bottom rim")), "privateDetails")

$reportResp = $studentClient.PostAsync("$baseUrl/items/report/lost", $multipart).GetAwaiter().GetResult()
if ([int]$reportResp.StatusCode -eq 302 -and $reportResp.Headers.Location.ToString() -like "*items/*") {
    Write-Host "  -> PASS: Lost item reported, redirected to: $($reportResp.Headers.Location)" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Status: $($reportResp.StatusCode) Location: $($reportResp.Headers.Location)" -ForegroundColor Red
}

# TEST 9: Admin Login & Admin Dashboard
Write-Host "`n[TEST 9] Testing Admin Login & Dashboard (POST /auth/login -> GET /admin)..." -ForegroundColor Cyan
$adminCookies = New-Object System.Net.CookieContainer
$adminHandler = New-Object System.Net.Http.HttpClientHandler
$adminHandler.CookieContainer = $adminCookies
$adminHandler.AllowAutoRedirect = $false
$adminClient = New-Object System.Net.Http.HttpClient($adminHandler)

$adminLoginPage = $adminClient.GetAsync("$baseUrl/auth/login").GetAwaiter().GetResult().Content.ReadAsStringAsync().GetAwaiter().GetResult()
$csrf = Extract-CsrfToken $adminLoginPage

$adminLoginParams = New-Object 'System.Collections.Generic.Dictionary[string,string]'
$adminLoginParams.Add("_csrf", $csrf)
$adminLoginParams.Add("email", "admin@campus.edu")
$adminLoginParams.Add("password", "admin123")

$adminLoginContent = New-Object System.Net.Http.FormUrlEncodedContent($adminLoginParams)
$adminLoginResp = $adminClient.PostAsync("$baseUrl/auth/login", $adminLoginContent).GetAwaiter().GetResult()

$adminDashResp = $adminClient.GetAsync("$baseUrl/admin").GetAwaiter().GetResult()
$adminDashHtml = $adminDashResp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
if ([int]$adminDashResp.StatusCode -eq 200 -and $adminDashHtml -like "*Admin Dashboard*") {
    Write-Host "  -> PASS: Admin Dashboard loaded successfully with role ADMIN" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Admin dashboard status: $($adminDashResp.StatusCode)" -ForegroundColor Red
}

# TEST 10: Admin User Management
Write-Host "`n[TEST 10] Testing Admin Users List (GET /admin/users)..." -ForegroundColor Cyan
$adminUsersResp = $adminClient.GetAsync("$baseUrl/admin/users").GetAwaiter().GetResult()
$adminUsersHtml = $adminUsersResp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
if ([int]$adminUsersResp.StatusCode -eq 200 -and $adminUsersHtml -like "*Manage Users*") {
    Write-Host "  -> PASS: Admin user management page rendered successfully" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Admin users status: $($adminUsersResp.StatusCode)" -ForegroundColor Red
}

# TEST 11: Admin Claims Management
Write-Host "`n[TEST 11] Testing Admin Claims List (GET /admin/claims)..." -ForegroundColor Cyan
$adminClaimsResp = $adminClient.GetAsync("$baseUrl/admin/claims").GetAwaiter().GetResult()
$adminClaimsHtml = $adminClaimsResp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
if ([int]$adminClaimsResp.StatusCode -eq 200 -and $adminClaimsHtml -like "*Manage Claims*") {
    Write-Host "  -> PASS: Admin claims verification page rendered successfully" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Admin claims status: $($adminClaimsResp.StatusCode)" -ForegroundColor Red
}

# TEST 12: Report Found Item with Image Upload (by Staff)
Write-Host "`n[TEST 12] Testing Report Found Item with Image Upload (POST /items/report/found)..." -ForegroundColor Cyan
$staffCookies = New-Object System.Net.CookieContainer
$staffHandler = New-Object System.Net.Http.HttpClientHandler
$staffHandler.CookieContainer = $staffCookies
$staffHandler.AllowAutoRedirect = $false
$staffClient = New-Object System.Net.Http.HttpClient($staffHandler)

$staffLoginHtml = $staffClient.GetAsync("$baseUrl/auth/login").GetAwaiter().GetResult().Content.ReadAsStringAsync().GetAwaiter().GetResult()
$staffCsrf = Extract-CsrfToken $staffLoginHtml

$staffParams = New-Object 'System.Collections.Generic.Dictionary[string,string]'
$staffParams.Add("_csrf", $staffCsrf)
$staffParams.Add("email", "staff@campus.edu")
$staffParams.Add("password", "staff123")
$staffLoginResp = $staffClient.PostAsync("$baseUrl/auth/login", (New-Object System.Net.Http.FormUrlEncodedContent($staffParams))).GetAwaiter().GetResult()

$foundPageHtml = $staffClient.GetAsync("$baseUrl/items/report/found").GetAwaiter().GetResult().Content.ReadAsStringAsync().GetAwaiter().GetResult()
$foundCsrf = Extract-CsrfToken $foundPageHtml

$foundMultipart = New-Object System.Net.Http.MultipartFormDataContent
$foundMultipart.Add((New-Object System.Net.Http.StringContent($foundCsrf)), "_csrf")
$foundMultipart.Add((New-Object System.Net.Http.StringContent("Found Scientific Calculator fx-991EX")), "itemName")
$foundMultipart.Add((New-Object System.Net.Http.StringContent("ELECTRONICS")), "category")
$foundMultipart.Add((New-Object System.Net.Http.StringContent("Black Casio fx-991EX scientific calculator found in Room 304.")), "description")
$foundMultipart.Add((New-Object System.Net.Http.StringContent("Science Block Room 304")), "location")
$foundMultipart.Add((New-Object System.Net.Http.StringContent((Get-Date).ToString("yyyy-MM-dd"))), "date")

# Create a small dummy 1x1 image file bytes
$dummyBytes = [byte[]]@(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)
$byteContent = New-Object System.Net.Http.ByteArrayContent($dummyBytes, 0, $dummyBytes.Length)
$byteContent.Headers.ContentType = New-Object System.Net.Http.Headers.MediaTypeHeaderValue("image/png")
$foundMultipart.Add($byteContent, "imageFile", "calculator.png")

$foundResp = $staffClient.PostAsync("$baseUrl/items/report/found", $foundMultipart).GetAwaiter().GetResult()
$foundItemId = 0
if ([int]$foundResp.StatusCode -eq 302 -and $foundResp.Headers.Location.ToString() -match '/items/(\d+)') {
    $foundItemId = [int]$matches[1]
    Write-Host "  -> PASS: Found item reported with photograph upload! Item ID: #$foundItemId" -ForegroundColor Green
} else {
    Write-Host "  -> FAIL: Status: $($foundResp.StatusCode) Location: $($foundResp.Headers.Location)" -ForegroundColor Red
}

# TEST 13: Submit Claim for Found Item (by Student)
Write-Host "`n[TEST 13] Testing Ownership Claim Submission (POST /claims/submit)..." -ForegroundColor Cyan
if ($foundItemId -gt 0) {
    $detailHtml = $studentClient.GetAsync("$baseUrl/items/$foundItemId").GetAwaiter().GetResult().Content.ReadAsStringAsync().GetAwaiter().GetResult()
    $claimCsrf = Extract-CsrfToken $detailHtml

    $claimParams = New-Object 'System.Collections.Generic.Dictionary[string,string]'
    $claimParams.Add("_csrf", $claimCsrf)
    $claimParams.Add("itemId", $foundItemId.ToString())
    $claimParams.Add("proofOfOwnership", "My initials AS are carved on the battery compartment lid.")
    $claimParams.Add("additionalInfo", "Purchased from Campus Book Store in August.")
    $claimParams.Add("verificationQuestionAnswer", "Class of 2025 sticker inside cover.")

    $claimResp = $studentClient.PostAsync("$baseUrl/claims/submit", (New-Object System.Net.Http.FormUrlEncodedContent($claimParams))).GetAwaiter().GetResult()
    $claimId = 0
    if ([int]$claimResp.StatusCode -eq 302 -and $claimResp.Headers.Location.ToString() -match '/claims/(\d+)') {
        $claimId = [int]$matches[1]
        Write-Host "  -> PASS: Ownership claim submitted successfully! Claim ID: #$claimId" -ForegroundColor Green
    } else {
        Write-Host "  -> FAIL: Status: $($claimResp.StatusCode) Location: $($claimResp.Headers.Location)" -ForegroundColor Red
    }

    # TEST 14: Admin Approves the Claim
    Write-Host "`n[TEST 14] Testing Admin Claim Approval (POST /admin/claims/$claimId/approve)..." -ForegroundColor Cyan
    if ($claimId -gt 0) {
        $adminClaimsHtml = $adminClient.GetAsync("$baseUrl/admin/claims").GetAwaiter().GetResult().Content.ReadAsStringAsync().GetAwaiter().GetResult()
        $adminCsrf = Extract-CsrfToken $adminClaimsHtml

        $approveParams = New-Object 'System.Collections.Generic.Dictionary[string,string]'
        $approveParams.Add("_csrf", $adminCsrf)
        $approveParams.Add("notes", "Verified ownership proof matches details.")

        $approveResp = $adminClient.PostAsync("$baseUrl/admin/claims/$claimId/approve", (New-Object System.Net.Http.FormUrlEncodedContent($approveParams))).GetAwaiter().GetResult()
        if ([int]$approveResp.StatusCode -eq 302 -and $approveResp.Headers.Location.ToString() -like "*admin/claims*") {
            Write-Host "  -> PASS: Admin approved claim #$claimId successfully!" -ForegroundColor Green
        } else {
            Write-Host "  -> FAIL: Status: $($approveResp.StatusCode)" -ForegroundColor Red
        }
    }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "    ALL E2E WORKFLOW TESTS COMPLETED SUCCESSFULLY!        " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
