param(
    [string]$DbPassword = $env:SPRING_DATASOURCE_PASSWORD,
    [string]$DbUser = $env:SPRING_DATASOURCE_USERNAME,
    [string]$DbUrl = $env:SPRING_DATASOURCE_URL
)

# Campus Lost & Found - PowerShell Application Runner
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "              CAMPUS LOST & FOUND - SPRING BOOT APP                " -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Load .env file if present
if (Test-Path "$projectRoot\.env") {
    Write-Host "[CONFIG] Loading environment from .env file..." -ForegroundColor Cyan
    Get-Content "$projectRoot\.env" | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $name = $parts[0].Trim()
            $val = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($name, $val, [System.EnvironmentVariableTarget]::Process)
        }
    }
}

if ($DbPassword) { $env:SPRING_DATASOURCE_PASSWORD = $DbPassword }
if ($DbUser) { $env:SPRING_DATASOURCE_USERNAME = $DbUser }
if ($DbUrl) { $env:SPRING_DATASOURCE_URL = $DbUrl }

if (-not $env:SPRING_DATASOURCE_PASSWORD) {
    $env:SPRING_DATASOURCE_PASSWORD = "root"
}
if (-not $env:SPRING_DATASOURCE_USERNAME) {
    $env:SPRING_DATASOURCE_USERNAME = "root"
}

# 1. Check Java
try {
    $javaVer = java -version 2>&1 | Select-Object -First 1
    Write-Host "[OK] Java runtime: $javaVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Java is not installed or not in PATH. Please install Java 17+." -ForegroundColor Red
    exit 1
}

# 2. Check MySQL Port 3306
$tcpClient = New-Object System.Net.Sockets.TcpClient
$portOpen = $false
try {
    $tcpClient.Connect("127.0.0.1", 3306)
    Write-Host "[OK] MySQL Server is ACTIVE on port 3306." -ForegroundColor Green
    $portOpen = $true
    $tcpClient.Close()
} catch {
    Write-Host "[WARNING] MySQL Server is NOT listening on localhost:3306." -ForegroundColor Yellow
    Write-Host "          Spring Boot will report HikariPool connection failure if MySQL is down." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "          To start MySQL:" -ForegroundColor White
    Write-Host "          1. Check Windows Services (services.msc) for 'MySQL80' and click Start." -ForegroundColor White
    Write-Host "          2. Or run: 'net start MySQL80' in an Administrator command prompt." -ForegroundColor White
    Write-Host "          3. Or start XAMPP / MariaDB if installed." -ForegroundColor White
    Write-Host ""
}

# 3. Compile sources if needed
if (-not (Test-Path "target\classes\com\campuslostfound\CampusLostFoundApplication.class")) {
    Write-Host "[BUILD] Compiling Java classes..." -ForegroundColor Cyan
    $m2Repo = "$env:USERPROFILE\.m2\repository"
    $jars = (Get-ChildItem -Path $m2Repo -Recurse -Filter "*.jar" | 
        Where-Object { 
            $_.FullName -notmatch "slf4j-api-1\.7" -and 
            $_.FullName -notmatch "spring-core-6\.0" -and 
            $_.FullName -notmatch "spring-jcl-6\.0" -and 
            $_.FullName -notmatch "jackson-.*-2\.14" -and 
            $_.FullName -notmatch "maven-" -and 
            $_.FullName -notmatch "plexus-"
        } | Select-Object -ExpandProperty FullName) -join ";"
    
    mkdir -Force "target\classes" | Out-Null
    $sources = (Get-ChildItem -Path "src\main\java" -Recurse -Filter "*.java" | Select-Object -ExpandProperty FullName)
    javac -cp $jars -d target\classes -parameters $sources
    Copy-Item -Path "src\main\resources\*" -Destination "target\classes\" -Recurse -Force
    Write-Host "[BUILD] Compilation complete." -ForegroundColor Green
}

# 4. Launch Spring Boot
if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Host "[START] Launching via Maven..." -ForegroundColor Cyan
    mvn spring-boot:run
} else {
    Write-Host "[START] Launching Spring Boot with Java 17..." -ForegroundColor Cyan
    $m2Repo = "$env:USERPROFILE\.m2\repository"
    $jars = (Get-ChildItem -Path $m2Repo -Recurse -Filter "*.jar" | 
        Where-Object { 
            $_.FullName -notmatch "slf4j-api-1\.7" -and 
            $_.FullName -notmatch "spring-core-6\.0" -and 
            $_.FullName -notmatch "spring-jcl-6\.0" -and 
            $_.FullName -notmatch "jackson-.*-2\.14" -and 
            $_.FullName -notmatch "maven-" -and 
            $_.FullName -notmatch "plexus-"
        } | Select-Object -ExpandProperty FullName) -join ";"
    $cp = "target\classes;" + $jars
    
    Write-Host "[INFO] Opening application at http://localhost:8080 once booted." -ForegroundColor Green
    java -cp $cp "com.campuslostfound.CampusLostFoundApplication"
}
