winfire.js
==========

[github.com/AntonioFasano/winfire.js](https://github.com/AntonioFasano/winfire.js)

This JScript script helps managing Windows Firewall, setting per per interface rules. 

It has been tested under Windows 7.  
Note: You need  elevated privileges to modify Windows Firewall settings and so for `winfire.js` too.


To add and enable the  rule `my-tcp-rule`, which opens listening TCP 2300 port on the Local Area Connection:


    winfire.js /rule-add /name:my-tcp-rule /prot-tcp /local-port:2300 /enab /interf:"Local Area Connection" /desc:"Rule added by winfire.js"

Note the colons after the options and quotations for including spaces.   
It possible to attach to rule to more interfaces with separating names with commas and *no spaces*, e.g.: `/interf:"Local Area Connection, Mobile Broadband Connection"`.


The connection name, which is localised based on your system language setting, can be found in the Network Connection folder, perhaps opened with `ncpa.cpl`.  
Anyway you can get the full list  via:

    winfire.js /con-show

If you want to show the connection(s) with a specific substring (case insensitive), e.g. 'local'

    winfire.js /con-show:local

Eventually you can store the connection name identified by a substring in a variable for a cmd.exe batch job:

    for /F "tokens=*" %%i in ('winfire.js /con-show:local') do set LAN=%%i

(replace  `%%` with `%` for interactive use)


If you want details on the rule just added (and the winfire.js did the job):

    winfire.js /rule-show /long:my-tcp-rule`

    my-tcp-rule                                 
    Description:    Rule added by winfire.js    
    Application Name:                           
    Service Name:                               
    Protocol:       TCP                         
    Local Ports:    2300                        
    Remote Ports:   *                           
    LocalAddresses: *                           
    RemoteAddresses:        *                   
    Direction:      In                          
    Enabled:        true                        
    Edge:   false                               
    Action: Allow                               
    Grouping:                                   
    Edge:   false                               
    Interface Types:        All                 
    Interfaces:     Local Area Connection 


To list all the rules relating to a specific connection use:

    winfire.js /rule-show:"Local Area Connection"

which here would return `my-tcp-rule`. 


If you want to list all rules in a grep friendly way:


    winfire.js /rule-show /grep>rules.txt

In this case you get every row, and therefore every rule field, prefixed with the rule name plus `==`.
So you can easily grep `rules.txt` rows and select the rows by rule.

Formal Command Reference
------------------------

The following is the output you might get from   `winfire.js /help`   


