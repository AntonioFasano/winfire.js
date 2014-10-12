winfire.js aka winfire
=====================

[github.com/AntonioFasano/winfire.js](https://github.com/AntonioFasano/winfire.js)

This JScript script helps managing Windows Firewall, setting per per interface rules. 

It has been tested under Windows 7.  
Note: You need  elevated privileges to modify Windows Firewall settings and so for `winfire.js` too.


How to run winfire in your favourite shell
---------------------------------

The  command examples presented here are based on the native Windows  PowerShell.
To distingush command lines from their output the former are  are prefixed with `PS>`.  

If you choose another shell modify the commands accordingly.
Whatever your preferences, always *open the chosen shell  with elevated privileges*. 

Assuming that winfire is in your path, the long way to run it is:

    PS> cscript winfire.js /help

This is because by default Windows runs scripts with the GUI based Wscript.
To simplify, you might change the defaults  via:

	PS> $sys="$env:SystemRoot\System32\cscript.cmd"
	PS> echo "@cscript.exe //nologo %*" | out-file -encoding ASCII $sys
	PS> cmd /c ftype jsfile=cscript.cmd "%1" %*
    jsfile=cscript.cmd %1 %*

Now you can run winfire with  the simpler:

    PS> winfire /help


Note that this change is persistent. If you want to restore the original Wscript association, just use:

	PS> cmd /c ftype jsfile=wscript.exe "%1" %*


Sample winfire commands
-----------------------

To add and enable the  rule `myrule`, which allows `c:\myapp` to open the listening TCP 2300 port on the Local Area Connection:


    PS> .\winfire /rule-add:myrule /app:c:\myapp /prot-tcp /local-port:2300 /enab /interf:"Local Area Connection" /desc:"Rule added by winfire"	
	Using profile: Private Profile, Public Profile

   If a profile is not specified, the rule is active on any available profile, hence the command output.

Note the colons after the options and quotations for including spaces.   
It possible to attach to rule to more interfaces with separating names with commas and *no spaces*, e.g.: `/interf:"Local Area Connection,Mobile Broadband Connection"`.

Note: Windows Firewall (and so winfire) accepts more rules with the same name. 

While the long version is often  used in this section, winfire commands can be shortned (see command reference). Omitting the description, the previous line can be also written as:

    PS> .\winfire /ra:myrule /app:c:\myapp /tcp /lp:2300 /enab /if:"Local Area Connection"


The  interface or connection name, which is localised for  your system language, can be found in the Network Connection folder, perhaps opened with `ncpa.cpl` (the word 'connection' is normally preferred when the interface is a modem).

Anyway you can get the full list via:

    PS> .\winfire /con-show

If you don't know the exact name for a connection, but you know it is identified by the substring  'local' (case insensitive), you will get it with:

    PS> .\winfire /con-show:local
	

When you ask for a substring the result(s) will be printed in a  double-double quote style. This makes safe to add a name to a shell variable and pass it as a value for `/interf`.  
Therefore you may add a rule for the local connection, whose full name you don't know, as follows:

    PS> $lan=.\winfire /con-show:local
    PS> .\winfire /ra:myrule /app:c:\myapp /tcp /lp:2300 /enab /if:$lan

The value of $lan will be similar to `""Local Area Connection""`.

__A note to `cmd.exe` shell users__. In `cmd.exe` it is possible (with a complex line) to store the connection name in a LAN variable:

    > for /F "usebackq delims="  %x in (`winfire.js /cs:local`) do set LAN=%x

(Replace `%x` with `%%x` in batch scripts). In this case, pass it to winfire with: `/if:"%LAN%"`


If you want details on the rule just added (and to check winfire did the job properly):

    PS > .\winfire /rule-show:myrule                          
    myrule                                                    
    Description:            Rule added by winfire             
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

    Found 1 time(s) my-tcp-rule       
    Removed one: my-tcp-rule          


To understand the output, note that Windows allows to add more rules with the same name. If you have *n* of them, you have to use `/rule-del`  *n* times. Normally the last rule  added will be removed first. 



Formal Command Reference
------------------------

The following is the output you might get from   winfire `/help` option.  

    
<!-- Local Variables: -->
<!-- mode: markdown -->
<!-- End: -->

<!--  LocalWords:  winfire
 -->
