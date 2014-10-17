
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


//Pandoc 
exe="pandoc";
try{
  WshShell.Run(exe + " -v", 0, true);
}
catch(e){
  WScript.Echo("Unable to find: " + exe +" to make html docs.");
  WScript.Quit();
}

  WScript.Echo(exe + " " + md +" -o " + dir + "\\readme.html");

WshShell.Run(exe + " " + md +" -o " + dir + "\\readme.html", 1, true);



