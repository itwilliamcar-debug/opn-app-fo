$ErrorActionPreference = "Continue"
Write-Host "== OPN : liberation ports ==" -ForegroundColor Cyan
foreach ($p in 3000, 5173, 6001, 8002) {
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
Write-Host "== Serveurs arretes ==" -ForegroundColor Green
