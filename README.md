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

To add and enable the  rule `myrule`, which allow `c:\myapp` to open the listening TCP 2300 port on the Local Area Connection:


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

    
    Manage Windows Firewall rules per interface   
    by Antonio FASANO   
    https://github.com/AntonioFasano/winfire.js   
    
    winfire.js [options]
    Use double quotations for option values containing spaces: /opt:"my val"
    
    /h[elp]                 This help
    /cs | /con-show[:SUB]   Show connection names [containing the substring SUB (ignoring case)]
    /ps | /prof-show        Show active profiles
    /ra | /rule-add:NAME    Add rule NAME       
    /rd | /rule-del:NAME    Remove rule NAME
    /rs | /rule-show[:NAME] Without NAME show rules names, else show details for rule NAME
    /long                   With `/rule-show' use details 
    /grep                   With `/rule-show' use details and prefix each row with rule name + `=='
    /sep                    Separate rules in rule list with `===='
    
    `/rule-add' parameters:
    /blk|/act-block   packets matching rule criteria rule are blocked
    /act-allow        packets matching rule criteria rule are permitted (default)
    /app:APPPATH      traffic generated by app with APPPATH matches this rule. 
                      If `/app' is not given, any program matches this rule.
    /desc:NAME        the rule long decription
    /dir-in           matches inbound network traffic (See Inbound Rules of Advanced Firewall snap-in)
    /dir-out          matches outbound network traffic(See Outbound Rules of Advanced Firewall snap-in)
    /edge             traffic that traverses an edge device, such as a NAT enabled router between
                      the local and remote computer matches this rule. Valid only with /dir-in.
                      Cf. `Allow edge traversal` checkbox in the  Advanced Firewall  snap-in.
    /enab             is the rule is currently enabled?
    /group:NAME       Specifies a group name for a set of rules to modify together 
    /icmptype:LIST    list of ICMP types and codes separated by semicolon.
                      "*" indicates all ICMP types and codes.
    /if|/interf:LIST  Cnnection/interface list as from `/con-show' to which the rule applies
                      Separate multiple values with a comma without extra space
                      If used with `/rule-show', only rules applying to LIST are shown
    /itype-remote     packets passing through a RAS interface types match this rule     
    /itype-lan        packets passing through a lan interface types match this rule     
    /itype-wless      packets passing through a wireless interface types match this rule 
    /itype-all        packets passing through any interface types match this rule (default)
    /la|/local-addr:ADDR  packets matching ADDR match this rule.
                      For inbound packets ADDR is matched againist the Destination IP field.
                      For outbound packets ADDR is matched againist the Source IP field.
                      ADDR can be
                      any:              matches any IP address
                      IPAddress:        matches only the exact IPv4 or IPv6 IP
                      "SUBNET/MASK":  matches any IPv4/IPv6 part of the SUBNET (mandatory quotes)
                                        MASK is the number of bits in the subnet mask or the subnet mask itself.
                      IPStart-IPEnd:     matches any IPv4/IPv6 falling within this range
                      Multiple entries can be specified in quotes and separating them with a comma and no spaces.
                      If `/local-addr' is not given the default is any.
    /lp|/local-port:PORT  packets with matching IP port numbers match this rule.
                      For inbound packets PORT is matched againist the Destination Port IP field.
                      For outbound packets PORT is matched againist the Source Port IP field.
                      PORT can be:
                      any:         matches any value in the port field of the IP packet.
                      Integer(s):  individual numbers from 0 through 65535, a range,
                                   or a comma-separated list of numbers and ranges.
                      rpc:         matches inbound TCP packets that are addressed to the listening socket
                                   of an application that correctly registers the port as an RPC listening
                                   port. A rule with this option must also give /prot-*, dir-* options
                                   and possibly /app or /service options
                      rpc-epmap:   matches inbound TCP packets that are addressed to the dynamic RPC
                                   endpoint mapper service.
                                   It needs the same companion options as `rpc' value' In paricular,
                                   (to ensure only the RPC service can send/receive data) use:,
                                   `/app:%windir%system32svchost.exe /service:rpcss'
                                   If you create a rule /local-port:rpc, then you must also create a rule
                                   with `/local-port:rpc-epmap` enabled, to allow both the incoming request
                                   to the mapper, and the subsequent packets to the ephemeral ports
                                   assigned by the RPC service.
                      Teredo:      Matches inbound UDP packets that contain Teredo packets.
                      iphttps:     Matches inbound TCP packets containing HTTPS with embedded IPv6 packets.
                                   iphttps allows IPv6 packets that would otherwise be blocked if sent by
                                   using Teredo, 6to4, or native IPv6.
                      Multiple entries can be specified in quotes and separating them with a comma and no spaces
                      If `/local-port' is not specified, the default is any
    /prof-domain      The rule is assigned to the domain profile (*)
    /prof-private     The rule is assigned to the private profile(*)
    /prof-public      The rule is assigned to the public profile (*)
                      (*) You can use more `/prof-*' options
                          The rule will be active when the related profiles are active.
                          If a profile is not specified, the rule is active on any profile.
    /tcp|/prot-tcp    packets whose protocol field tcp match this rule
    /udp|/prot-udp    packets whose protocol field udp match this rule
    /icmp4|/prot-icmpv4 packets whose protocol field icmpv4 match this rule
    /icmp6|/prot-icmpv6 packets whose protocol field icmpv6 match this rule
    /ra|/remo-addr:ADDR  packets matching remote ADDR match this rule.
                      for outbound packets ADDR is compared to the Destination IP address field
                      for inbound packets ADDR is compared to the Source IP address field
                      ADDR can be
                      any:          Matches any IP address
                      localsubnet:  Matches any IP address on the same IP subnet as the local computer
                      dns|dhcp|wins|defaultgateway: Matches the IP address of any computer configured as
                                                    dns, dhcp, wins, default gateway on the local computer
                      IPAddress, "SUBNET/MASK", IPStart-IPEnd:  See `/local-addr'
                      Multiple entries can be specified as with `/local-addr'
    /rp|/remo-port:PORT  packets with matching IP port numbers match this rule.
                      For inbound packets PORT is matched againist the Source Port IP field.
                      For outbound packets PORT is matched againist the Destination Port IP field.
                      PORT can be:
                      any:  Matches any value in the port field of the IP packet
                      Integer(s):  individual numbers from 0 through 65535, a range,
                                   or a comma-separated list of numbers and ranges.
                      Multiple entries can be specified in quotes and separating them with a comma and no spaces
                      If `/remo-port' is not specified, the default is any
    /service:SERVICE  traffic generated by service SERVICE matches this rule.
                      SERVICE is the short name from Services snap-in
                      If `/service' is not given, any service matches this rule.
                      If SERVICE is "*", then any service, but  not an application, matches this rule
    
    Examples in Powershell:
    ## Add and show LAN TCP rule for a given application
    $lan=.\winfire /cs:local
    .\winfire /ra:myrule /app:"app path" /tcp /lp:2300 /enab /if:$lan
    .\winfire /rs:myrule
    
    