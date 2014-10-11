
var fso = new ActiveXObject("Scripting.FileSystemObject"),
    dir = fso.GetParentFolderName(WScript.ScriptFullName),
    exe = dir + "\\winfire.js /help",
    md= dir + "\\ReadMe.md",
    head=dir + "\\head.md",
    ForReading = 1, ForWriting = 2, Create=true,
    oMd = fso.OpenTextFile(md, ForWriting, Create);
head = fso.OpenTextFile(head, ForReading).ReadAll();
// Remove Emacs tags
head = head.replace(/<!-- Local Variables: -->[\S\s]+/m, ""); 



var WshShell = new ActiveXObject("WScript.Shell");
var oExec    = WshShell.Exec("cscript.exe //nologo " + exe);
help=oExec.StdOut.ReadAll();


help = help.replace(/^/mg, "    "); 
oMd.Write(head + help);
oMd.Close();
WScript.Echo(head + help);
WScript.Echo(md);
