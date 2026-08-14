# Recorta o miolo claro (nota + foto do aluno) dos screenshots em cards/,
# descartando margens roxas, logos, bordas pretas variáveis e a barra de
# "navegador" no topo do post, e salva em fotos/ ampliado 2x (bicúbico de alta
# qualidade, para não serrilhar em telas de alta densidade).
# Uso: powershell -File recortar-cards.ps1  (rodar de qualquer lugar; caminhos são relativos ao script)
Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot "cards"
$dst = Join-Path $PSScriptRoot "fotos"
New-Item -ItemType Directory -Force $dst | Out-Null

Get-ChildItem "$src\*.png" | ForEach-Object {
  $bmp = [System.Drawing.Bitmap]::new($_.FullName)
  $w = $bmp.Width; $h = $bmp.Height
  $step = 2

  # Conta pixels "claros" (fundo bege do card) por linha e por coluna.
  $rows = New-Object int[] $h
  $cols = New-Object int[] $w
  for ($y = 0; $y -lt $h; $y += $step) {
    for ($x = 0; $x -lt $w; $x += $step) {
      $p = $bmp.GetPixel($x, $y)
      $b = ([int]$p.R + [int]$p.G + [int]$p.B) / 3
      if ($b -gt 175) { $rows[$y]++; $cols[$x]++ }
    }
  }

  # O card branco é a região onde >30% dos pixels da linha/coluna são claros;
  # isso exclui a moldura roxa, o logo e a faixa azul-marinho do nome.
  $rowThr = 0.30 * ($w / $step)
  $colThr = 0.30 * ($h / $step)

  $top = -1; $bottom = -1
  for ($y = 0; $y -lt $h; $y += $step) {
    if ($rows[$y] -gt $rowThr) { if ($top -lt 0) { $top = $y }; $bottom = $y }
  }
  $left = -1; $right = -1
  for ($x = 0; $x -lt $w; $x += $step) {
    if ($cols[$x] -gt $colThr) { if ($left -lt 0) { $left = $x }; $right = $x }
  }

  if ($top -lt 0 -or $left -lt 0) {
    Write-Output ("SKIP (sem regiao clara): " + $_.Name)
    $bmp.Dispose()
    return
  }

  # Pula a barra de "navegador" ("> DESTAQUES 2026  ooo") no topo do card.
  # A altura da barra varia um pouco entre posts; 9,5% da largura cobre todos.
  $barra = [int][Math]::Round(0.095 * ($right - $left + 1))
  $top += $barra

  $cw = $right - $left + 1
  $ch = $bottom - $top + 1
  $rect = [System.Drawing.Rectangle]::new($left, $top, $cw, $ch)

  # Amplia 2x com interpolação bicúbica de alta qualidade.
  $out = [System.Drawing.Bitmap]::new($cw * 2, $ch * 2)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($bmp, [System.Drawing.Rectangle]::new(0, 0, $cw * 2, $ch * 2), $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()

  $out.Save((Join-Path $dst $_.Name), [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose(); $bmp.Dispose()
  Write-Output ("{0}: {1}x{2} -> {3}x{4} (2x de {5}x{6})" -f $_.Name, $w, $h, ($cw * 2), ($ch * 2), $cw, $ch)
}
