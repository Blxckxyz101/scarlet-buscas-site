param(
  [int]$Port = 8000
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $PWD on $prefix (CTRL+C to stop)"
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $path = $req.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrEmpty($path)) { $path = 'index.html' }
    $local = Join-Path -Path (Get-Location) -ChildPath $path
    if (Test-Path $local) {
      $bytes = [System.IO.File]::ReadAllBytes($local)
      $res.ContentLength64 = $bytes.Length
      switch ([IO.Path]::GetExtension($local).ToLower()) {
        '.html' { $res.ContentType = 'text/html' }
        '.css'  { $res.ContentType = 'text/css' }
        '.js'   { $res.ContentType = 'application/javascript' }
        '.png'  { $res.ContentType = 'image/png' }
        '.jpg'  { $res.ContentType = 'image/jpeg' }
        '.jpeg' { $res.ContentType = 'image/jpeg' }
        '.svg'  { $res.ContentType = 'image/svg+xml' }
        '.json' { $res.ContentType = 'application/json' }
        default { $res.ContentType = 'application/octet-stream' }
      }
      $res.OutputStream.Write($bytes,0,$bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $res.ContentType = 'text/plain'
      $res.OutputStream.Write($msg,0,$msg.Length)
    }
    $res.OutputStream.Close()
    $res.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
