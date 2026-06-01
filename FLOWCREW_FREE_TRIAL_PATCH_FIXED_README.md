# FlowCrew fixed one-lead trial patch

Use this fixed script instead of the previous one. It avoids the template-literal syntax error in `apply-flowcrew-trial.js`.

From PowerShell in `C:\Users\mauri\Desktop\FlowCrew\flowcrew`:

```powershell
$node = (Get-ChildItem "C:\Users\mauri\Desktop\FlowCrew\.tools" -Recurse -Filter node.exe | Select-Object -First 1).FullName
$nodeDir = Split-Path $node
$env:Path = "$nodeDir;$env:Path"

& $node .\apply-flowcrew-trial-fixed.js
& "$nodeDir\npm.cmd" run lint
& "$nodeDir\npm.cmd" run build
```
