param(
    [string]$Password
)

Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "           MySQL Database Connection & Credential Verifier          " -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Load .env if present
if (-not $Password -and (Test-Path "$projectRoot\.env")) {
    Get-Content "$projectRoot\.env" | ForEach-Object {
        $line = $_.Trim()
        if ($line.StartsWith("SPRING_DATASOURCE_PASSWORD=")) {
            $Password = $line.Substring("SPRING_DATASOURCE_PASSWORD=".Length).Trim()
        }
    }
}

if (-not $Password) {
    $securePwd = Read-Host -Prompt "Enter MySQL root password to test" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePwd)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

$m2Repo = "$env:USERPROFILE\.m2\repository"
$mysqlDriver = Get-ChildItem -Path $m2Repo -Recurse -Filter "mysql-connector-j-*.jar" | Select-Object -First 1 -ExpandProperty FullName

if (-not $mysqlDriver) {
    Write-Host "[ERROR] mysql-connector-j jar not found in $m2Repo" -ForegroundColor Red
    exit 1
}

Write-Host "[TEST] Connecting to MySQL on localhost:3306 as user 'root'..." -ForegroundColor Cyan

# Compile runner on the fly
$javaCode = @"
import java.sql.*;
public class DbCheck {
    public static void main(String[] args) {
        String pwd = args.length > 0 ? args[0] : "";
        String url = "jdbc:mysql://localhost:3306/?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(url, "root", pwd);
            System.out.println("AUTH_SUCCESS");
            Statement stmt = conn.createStatement();
            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS campus_lost_found CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            System.out.println("DATABASE_READY");
            conn.close();
            System.exit(0);
        } catch (SQLException e) {
            if (e.getErrorCode() == 1045) {
                System.out.println("AUTH_DENIED: Access denied for user 'root'@'localhost'");
            } else {
                System.out.println("SQL_ERROR: " + e.getMessage());
            }
            System.exit(1);
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            System.exit(2);
        }
    }
}
"@

$tempJava = "$env:TEMP\DbCheck.java"
$tempClass = "$env:TEMP"
[System.IO.File]::WriteAllText($tempJava, $javaCode)

& "C:\Program Files\Java\jdk-17\bin\javac.exe" -cp $mysqlDriver -d $tempClass $tempJava
$result = & "C:\Program Files\Java\jdk-17\bin\java.exe" -cp "$tempClass;$mysqlDriver" DbCheck "$Password"

Remove-Item $tempJava -ErrorAction SilentlyContinue
Remove-Item "$tempClass\DbCheck.class" -ErrorAction SilentlyContinue

if ($result -contains "AUTH_SUCCESS") {
    Write-Host "[SUCCESS] Authenticated successfully with MySQL Server!" -ForegroundColor Green
    Write-Host "[SUCCESS] Database 'campus_lost_found' verified / created." -ForegroundColor Green
    Write-Host ""
    $save = Read-Host "Save these working credentials to local .env file? (Y/N)"
    if ($save -eq "Y" -or $save -eq "y") {
        $envContent = @"
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/campus_lost_found?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=$Password
PORT=8080
"@
        [System.IO.File]::WriteAllText("$projectRoot\.env", $envContent)
        Write-Host "[OK] Saved to .env (ignored by Git for security)." -ForegroundColor Green
    }
} elseif ($result -match "AUTH_DENIED") {
    Write-Host "[FAILED] Access denied for user 'root'@'localhost'." -ForegroundColor Red
    Write-Host "         The password you entered is incorrect for your MySQL root user." -ForegroundColor Yellow
} else {
    Write-Host "[RESULT] $result" -ForegroundColor Yellow
}

