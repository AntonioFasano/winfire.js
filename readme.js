
// Create markdown and HTML documentation for winfire 
// For  HTML you need "Pandoc" set the its path below 

//Pandoc 
var panexe="pandoc";


// Attach the winfire help output to main markdown file
var WshShell = new ActiveXObject("WScript.Shell"),
    fso = new ActiveXObject("Scripting.FileSystemObject"),
    dir = fso.GetParentFolderName(WScript.ScriptFullName),
    exe = dir + "\\winfire.js /help",
    md= dir + "\\ReadMe.md",
    head=dir + "\\head.md",
    ForReading = 1, ForWriting = 2, Create=true,
    oMd = fso.OpenTextFile(md, ForWriting, Create);
head = fso.OpenTextFile(head, ForReading).ReadAll();
// Remove Emacs tags
head = head.replace(/<!-- Local Variables: -->[\S\s]+/m, ""); 



var oExec    = WshShell.Exec("cscript.exe //nologo " + exe);
help=oExec.StdOut.ReadAll();


help = help.replace(/^/mg, "    "); 
oMd.Write(head + help);
oMd.Close();
WScript.Echo(head + help);
WScript.Echo(md);



//Make HTML via Pandoc
try{
  WshShell.Run(panexe + " -v", 0, true);
}
catch(e){
  WScript.Echo("Unable to find: " + panexe +" to make html docs.");
  WScript.Quit();
}

  WScript.Echo(panexe + " " + md +" -o " + dir + "\\readme.html");

WshShell.Run(panexe + " " + md +" -o " + dir + "\\readme.html", 1, true);



