
// Create markdown and HTML documentation for winfire 
// For  HTML you need "Pandoc" set the its path below 

//Pandoc 
var panexe="pandoc";

//Some objects
var oShell = new ActiveXObject("WScript.Shell"),
    oFS = new ActiveXObject("Scripting.FileSystemObject"),
    scdir = oFS.GetParentFolderName(WScript.ScriptFullName),
    windir= oShell.ExpandEnvironmentStrings( "%WINDIR%"), 
    ForReading = 1, ForWriting = 2, Create=true;

// Find latest jsc compiler
var netfrm=windir.replace(/\\$/, '') + "\\Microsoft.NET\\Framework",
    netvlast, jsc;

if (!oFS.FolderExists(netfrm)){
  WScript.Echo ("Unable to find folder: " + netfrm);
  WScript.Quit(1);
}

var cFld  = oFS.GetFolder(netfrm).SubFolders;
for (var e = new Enumerator(cFld); !e.atEnd(); e.moveNext())
  if( e.item().name.match(/^v/) != null ) netvlast=e.item();

jsc= netvlast + "\\jsc.exe"
if (!oFS.FileExists(jsc)){
  WScript.Echo ("Unable to find jsc compiler");
  WScript.Quit(1);
}


//Build winfire.exe
oShell.Exec(jsc + " /platform:anycpu /out:winfire-any.exe " + scdir + "\\winfire.js"); 
var proc = oShell.Exec(jsc + "  /platform:x64 "            + scdir + "\\winfire.js"); 
while (proc.Status == 0) WScript.Sleep(100);



// Attach the winfire help output to main markdown file
// ----------------------------------------------------
var read= scdir + "\\README.md",
    head=scdir + "\\head.md",
    help = scdir + "\\winfire.exe /help",
    txRead = oFS.OpenTextFile(read, ForWriting, Create),
    txHead = oFS.OpenTextFile(head, ForReading).ReadAll(),
    txHelp = oShell.Exec(help).StdOut.ReadAll();


// Remove Emacs tags
txHead = txHead.replace(/<!-- Local Variables: -->[\S\s]+/m, ""); 

// Make code style
txHelp = txHelp.replace(/^/mg, "    "); 

txRead.Write(txHead + txHelp);
txRead.Close();
WScript.Echo(txHead + txHelp);
WScript.Echo(read);



//Make HTML via Pandoc
//--------------------
try{
  oShell.Run(panexe + " -v", 0, true);
}
catch(e){
  WScript.Echo("Unable to find: " + panexe +" to make html docs.");
  WScript.Quit();
}

//WScript.Echo(panexe + " " + read +" -o " + scdir + "\\readme.html");
oShell.Run(panexe + " " + read +" -o " + scdir + "\\readme.html", 1, true);


//Show compiler path:
WScript.Echo ("jsc used:\n" + jsc);


