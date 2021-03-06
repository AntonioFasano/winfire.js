winfire.js aka winfire
=====================

[github.com/AntonioFasano/winfire.js](https://github.com/AntonioFasano/winfire.js)

Winfire helps managing Windows Firewall, setting  per interface rules.  
You can use it interactively or inside your own scripts for creating Windows Firewall rules.


Winfire has been tested under Windows 7. It is based on
[Windows Firewall with Advanced Security Interfaces](http://msdn.microsoft.com/en-us/library/windows/desktop/ff956124). The minimum supported client for this API is Windows Vista and  the minimum supported server is Windows Server 2008. Winfire is based on JScript for Microsoft .NET Framework.

Note: You need  elevated privileges to modify Windows Firewall settings and so for `winfire`.


How to run winfire in your favourite shell
------------------------------------------

The  command examples presented here are based on the native Windows  PowerShell.
To distinguish command lines from their output the former are  are prefixed with `PS>`.  

If you choose another shell modify the commands accordingly.
Whatever your preferences, always *open the chosen shell  with elevated privileges*. 

The best way for most users should be  to run `winfire.exe` 64 bit executable. In case you are still on a 32 bit system, turn to `winfire-any.exe`.



### Build your own winfire executable

To  make `winfire.js` into an executable, assuming that `winfire.js` is in your current directory, use:


	PS> C:\Windows\Microsoft.NET\Framework64\v<last-version>\jsc.exe .\winfire.js

Replace `<last-version>` with the last version available in you system. You may get it straight via the shell auto-completion. Anyway, if you have changed the default Windows installation, print the available .Net directories with (they all start with a 'v'):

	PS> dir $env:windir\Microsoft.NET\Framework64\v*

Note that there is also an x86-folder `Microsoft.NET\Framework` 

As an alternative, to find `jsc.exe` path you may use:

	PS> cscript.exe buildme.js /find 

With:

	PS> cscript.exe buildme.js  

You will build a Win64 exe, an any-platform exe and create the `readme.html` doc, which requires [pandoc](johnmacfarlane.net/pandoc/) availability on your system. 


After building `winfire.exe`,  try if it works with:

    PS> winfire /help


You may want to use also the `netcat.ps1` unit test (see see [Sample script](#sample-script) ahead).


### winfire.js as a WSH script

While you may find the best way to use winfire is to run its executable version, the source code is engineered in such a way that you can  also run the JScript source `winfire.js` as a `cscript`-script via Microsoft Windows Scripting Host (WSH).


If for some reason you prefer to run winfire.js as WSH script, assuming that winfire is in your path, the *long* way to run it querying for help is:

    PS> cscript winfire.js /help

This is because by default Windows runs scripts with the GUI based `WScript` engine.
To simplify, you might change the defaults  via:

	PS> $sys="$env:SystemRoot\System32\cscript.cmd"
	PS> echo "@cscript.exe //nologo %*" | out-file -encoding ASCII $sys
	PS> cmd /c ftype jsfile=cscript.cmd "%1" %*
    jsfile=cscript.cmd %1 %*

Now you can run winfire with  the simpler:

    PS> winfire /help

_Beware_: use `winfire.js`, if you have also `winfire.exe` in your path.

Note that the change of default engine is persistent. If you want to restore the original `WScript` association, just use:

	PS> cmd /c ftype jsfile=wscript.exe "%1" %*


### More on the differences between winfire.js and winfire.exe

`winfire.js` code is written so that it can be run as a WSH script or compiled with the  Microsoft `jsc` compiler, which is already on your system.

Building `winfire.exe` is a matter of seconds. So, even  assuming you need to adapt often the script for some special needs, it is  convenient to recompile it again.

When you run the script via WSH, it is interpreted, so it will be a tad slower; beside you are using an older version version of the JScript language, confront the last line of `winfire.js /help` and `winfire.exe /help` to learn about the version in use. 

If you call `winfire` (no extension), when you have both `.js` and `.exe` available in your path, the latter will have the precedence.



Getting started with winfire commands
-------------------------------------

To add and enable the  rule `myrule`, which allows `c:\myapp` to open the listening TCP 2300 port on the Local Area Connection:


    PS> .\winfire /rule-add:myrule /app:c:\myapp /prot-tcp /local-port:2300 /enab /interf:"Local Area Connection"	
	Using profile: Private Profile, Public Profile

   If a profile is not specified, the rule is active on any available profile, hence the command output.

Note the colons after the options and quotations for including spaces.   
It possible to attach to rule to more interfaces with separating names with commas and *no spaces*, e.g.: `/interf:"Local Area Connection,Mobile Broadband Connection"`.

Note: Windows Firewall (and so winfire) accepts more rules with the same name. 

While here I will mostly use  long version commands,  winfire commands can be shortened (see command reference). Indeed the previous line can be also written as:

    PS> .\winfire /ra:myrule /app:c:\myapp /tcp /lp:2300 /enab /if:"Local Area Connection"


The  interface or connection name, which is localised for  your system language, can be found in the Network Connection folder, perhaps opened with `ncpa.cpl` (the word 'connection' is normally preferred when the interface is a modem).

Anyway you can get the full list via:

    PS> .\winfire /con-show

If you don't know the exact name for a connection, but you know it is identified by the substring  'local' (case insensitive), you will get it with:

    PS> .\winfire /con-show:local
	

Therefore you may add a rule for the local connection, whose full name you don't know, as follows:

    PS> $lan=.\winfire /con-show:local
    PS> .\winfire /ra:myrule /app:c:\myapp /tcp /lp:2300 /enab /if:$lan

If you want details on the rule just added (and to check winfire did the job properly):

    PS > .\winfire /rule-show:myrule                          
    myrule                                                    
    Description:            Created by winfire                
    Profiles:               Private Profile, Public Profile   
    Application Name:       c:\myapp                          
    Service Name:                                             
    Protocol:               TCP                               
    Local Ports:            2300                              
    Remote Ports:           *                                 
    LocalAddresses:         *                                 
    RemoteAddresses:        *                                 
    Direction:              In                                
    Enabled:                true                              
    Edge Traversal:         false                             
    Action:                 Allow                             
    Grouping:                                                 
    Interface Types:        All                               
    Interfaces:             Local Area Connection 


You can customise the  "Created by winfire" line via the `/desc:DESC` option.  
If there are more rules  with the same name, the last added will be displayed first. 

To list all the rules relating to a specific connection use:

    PS> .\winfire /rule-show:$lan 

where `$lan` is the variable set before for the local connection.  
This command will return `myrule` and possibly other rules associated with this connection. 


To  list all rules in a grep friendly way you use `/rule-show /grep`. This will give  a detailed rule list (like with `/long`) where every row is  prefixed with the rule name plus `==`.
For example here:

    PS> .\winfire /rule-show /grep | grep "^Windows Media Player.*==Description"

You grep-filter the output by rules whose name starts with `Windows Media Player` and by the rows containing the  `Description` field. 

Note that I assume you have some grep utility in your path. If you don't, try the Windows standard `find`.


To delete the rule just created:

    PS> .\winfire /rule-del:myrule  

    Found 1 time(s) myrule       
    Removed one: myrule          


To understand the output, remember  that Windows allows to add more rules with the same name. If you have *n* of them, you have to use `/rule-del`  *n* times. Normally the last rule  added will be removed first. 


### A sample script

Given its command line nature, winfire fits to be added to scripts for adding firewall rules.

Have a look at `netcat.ps1`.  It is an interactive unit test script,  which will authorise `netcat` network tool to open and start a chat via the [VirtualBox](http://virtualbox.org) Virtual interface ([host-only](https://www.virtualbox.org/manual/ch06.html#network_hostonly)) and deny the port access via the other interfaces, e.g. LAN, Wi-Fi.

[Netcat](http://wikipedia.org/wiki/Netcat) is a classic net testing tool already available out of the box in Linux.
For Windows you may use the [Cygwin](https://cygwin.com/packages) version or  a native executable,  such as the one coming with [nmap](http://nmap.org/) application.

Note that under Linux/Cygwin netcat name is `nc`, while in Windows it is normally `ncat.exe`.



Formal Command Reference
------------------------

The following is the output you might get from   winfire `/help` option.  

    
<!-- Local Variables: -->
<!-- mode: markdown -->
<!-- End: -->

<!--  LocalWords:  winfire JScript API js PowerShell grep exe WSH
 -->
<!--  LocalWords:  substring
 -->
