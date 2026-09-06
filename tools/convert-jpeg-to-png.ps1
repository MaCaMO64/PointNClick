Add-Type -AssemblyName System.Drawing
$dir = Join-Path $PSScriptRoot "..\games\ring-and-wrong\art\chars"
$files = Get-ChildItem -Path $dir -Filter "*.jpeg" -File
foreach ($f in $files) {
  Write-Host "Converting $($f.Name)..."
  $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName)
  $w = $bmp.Width; $h = $bmp.Height
  # For Bongo, clear MASTER-STIL text in bottom strip before conversion
  if ($f.BaseName -ieq "bongo_sheet") {
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $mag = [System.Drawing.Color]::FromArgb(255,0,255)
    $brush = New-Object System.Drawing.SolidBrush($mag)
    $g.FillRectangle($brush, 0, $h - 60, $w, 60)
    $g.Dispose(); $brush.Dispose()
  }
  for ($y=0; $y -lt $h; $y++) {
    for ($x=0; $x -lt $w; $x++) {
      $c = $bmp.GetPixel($x,$y)
      $dist = [Math]::Abs($c.R-255) + $c.G + [Math]::Abs($c.B-255)
      if ($dist -lt 80) {
        $bmp.SetPixel($x,$y, [System.Drawing.Color]::FromArgb(255,0,255))
      }
    }
  }
  $pngPath = Join-Path $dir ($f.BaseName.ToLower() + ".png")
  $bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host " -> $($pngPath | Split-Path -Leaf) ($([math]::Round((Get-Item $pngPath).Length/1KB))kB)"
}
Write-Host "Done. Run: node tools/build-chars.js"