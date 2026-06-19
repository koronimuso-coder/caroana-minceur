# Read .env.local and deploy to Vercel
$envs = @("production", "preview", "development")

Get-Content .env.local | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line.Split("=", 2)
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            
            # Remove enclosing quotes if any
            if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            elseif ($value.StartsWith("'") -and $value.EndsWith("'")) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            
            foreach ($env in $envs) {
                Write-Host "Adding $key to $env..."
                $valToPush = $value
                if ($key -eq "NEXT_PUBLIC_APP_URL" -and ($env -eq "production" -or $env -eq "preview")) {
                    $valToPush = "https://caroana-minceur.vercel.app"
                }
                
                # Replace newline characters escaped in env file
                $valToPush = $valToPush.Replace("\n", "`n")
                
                # Run vercel env add command
                & vercel env add $key $env --value $valToPush --yes
            }
        }
    }
}
