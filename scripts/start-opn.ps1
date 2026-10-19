# OPN Digital Hub - demarrage rapide (sans WMI lent)
# Usage: powershell -ExecutionPolicy Bypass -File scripts\start-opn.ps1

$ErrorActionPreference = "Continue"
$Frontend = Split-Path -Parent $PSScriptRoot
$Root = Split-Path -Parent $Frontend
$Backend = Join-Path $Root "Backend"

Write-Host "== OPN : liberation ports ==" -ForegroundColor Cyan
foreach ($p in 8002, 8011, 8012, 8013, 8014, 8015, 3000, 5173, 6001) {
  $lines = netstat -ano | Select-String ":$p\s+.*LISTENING"
  foreach ($line in $lines) {
    $parts = ($line.ToString() -split '\s+') | Where-Object { $_ -ne '' }
    $procId = $parts[-1]
    if ($procId -match '^\d+$' -and [int]$procId -gt 0) {
      cmd /c "taskkill /F /PID $procId >nul 2>&1"
      Write-Host "  free port $p (pid $procId)"
    }
  }
}

# Tuer aussi les workers PHP orphelins eventuels
Get-Process php -ErrorAction SilentlyContinue | ForEach-Object {
  cmd /c "taskkill /F /PID $($_.Id) >nul 2>&1"
}

Start-Sleep -Seconds 2

if (-not (Test-Path (Join-Path $Backend "artisan"))) {
  Write-Host "ERREUR - Backend introuvable: $Backend" -ForegroundColor Red
  exit 1
}

Write-Host "== OPN : cache Laravel ==" -ForegroundColor Cyan
Push-Location $Backend
php artisan cache:clear 2>$null
php artisan config:clear 2>$null
Pop-Location

Write-Host "== OPN : cluster API (5 workers) ==" -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "scripts/opn-api-cluster.mjs" -WorkingDirectory $Frontend -WindowStyle Minimized

Write-Host "== OPN : Vite frontend (port 3000) ==" -ForegroundColor Cyan
$npmCmd = "npm.cmd"
$npmResolved = Get-Command npm.cmd -ErrorAction SilentlyContinue
if ($npmResolved) { $npmCmd = $npmResolved.Source }
Start-Process -FilePath $npmCmd -ArgumentList "run","dev","--","--host","127.0.0.1","--port","3000" -WorkingDirectory $Frontend -WindowStyle Minimized

Write-Host "== Verification (attente workers) ==" -ForegroundColor Cyan
$apiOk = $false
$viteOk = $false
for ($i = 1; $i -le 18; $i++) {
  Start-Sleep -Seconds 2
  if (-not $apiOk) {
    try {
      $up = Invoke-WebRequest -Uri "http://127.0.0.1:8002/up" -UseBasicParsing -TimeoutSec 4
      if ($up.StatusCode -eq 200) {
        $apiOk = $true
        Write-Host "  API  : 200 (essai $i)" -ForegroundColor Green
      }
    } catch {
      Write-Host "  API  : attente... ($i/18)" -ForegroundColor Yellow
    }
  }
  if (-not $viteOk) {
    try {
      $v = Invoke-WebRequest -Uri "http://127.0.0.1:3000/" -UseBasicParsing -TimeoutSec 3
      if ($v.StatusCode -eq 200) {
        $viteOk = $true
        Write-Host "  Vite : 200 (essai $i)" -ForegroundColor Green
      }
    } catch { }
  }
  if ($apiOk -and $viteOk) { break }
}

if (-not $apiOk) { Write-Host "  API  : DOWN" -ForegroundColor Red }
if (-not $viteOk) { Write-Host "  Vite : DOWN" -ForegroundColor Red }

if ($apiOk) {
  try {
    $body = @{ email = "daf@opn.ga" } | ConvertTo-Json
    $demo = Invoke-RestMethod -Uri "http://127.0.0.1:8002/api/v1/auth/demo-quick" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 12
    if ($demo.success) {
      Write-Host "  Demo : OK" -ForegroundColor Green
    } else {
      Write-Host "  Demo : FAIL $($demo.message)" -ForegroundColor Yellow
    }
  } catch {
    Write-Host "  Demo : FAIL $($_.Exception.Message)" -ForegroundColor Yellow
  }
}

Start-Process "chrome" "http://127.0.0.1:3000/"
if ($apiOk -and $viteOk) {
  Write-Host "OK - ouvrez Acces Intranet et reconnectez-vous." -ForegroundColor Green
} else {
  Write-Host "ATTENTION - API ou Vite pas prets. Relancez npm run start:opn." -ForegroundColor Red
  exit 1
}
