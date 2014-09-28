
// Windows Firewall with Advanced Security Interfaces
// http://msdn.microsoft.com/en-us/library/windows/desktop/aa366458%28v=vs.85%29.aspx

// VBScript samples
// http://msdn.microsoft.com/en-us/library/windows/desktop/ff956129%28v=vs.85%29.aspx

// C/C++ 
// http://msdn.microsoft.com/en-us/library/windows/desktop/ff956128%28v=vs.85%29.aspx


/***********
  USAGE
***********/

var 
HEAD="\
Manage Windows Firewall rules per interface\n\
by Antonio FASANO\n\
https://github.com/AntonioFasano/winfire.js\n\
\n",

HELP=" connection-name [options]\n\
Use double quotations for option values containing spaces: /opt:\"my val\"\n\
\n\
/h[elp]           This help\n\
/con-show[:SUB]   Show connection names [containing the substring SUB (ignoring case)]\n\
/prof-show        Show active profiles\n\
/rule-add         Add rule            \n\
/rule-del:NAME    Remove rule NAME\n\
/rule-show[:NAME] Show rules names [only if specific for interface/connection NAME]\n\
/long[:NAME]      With `/rule-show' use details [and rule NAME]\n\
/grep             With `/rule-show' prefix each row with rule name + `==' (for easy grep parsing)\n\
/sep              Separate rules in rule list with `===='\n\
",

MORE="\n\
`/rule-add' parameters\n\
/act-block        packets matching rule criteria rule are blocked\n\
/act-allow        packets matching rule criteria rule are permitted\n\
/app:APPNAME      traffic generated by APPNAME matches this rule. \n\
                  If `/app' is not given, any program matches this rule.\n\
/desc:NAME        the rule long decription\n\
/dir-in           matches inbound network traffic (See Inbound Rules of Advanced Firewall snap-in)\n\
/dir-out          matches outbound network traffic(See Outbound Rules of Advanced Firewall snap-in)\n\
/edge             traffic that traverses an edge device, such as a NAT enabled router between\n\
                  the local and remote computer matches this rule. Valid only with /dir-in.\n\
                  Cf. `Allow edge traversal` checkbox in the  Advanced Firewall  snap-in.\n\
/enab             is the rule is currently enabled?\n\
/group:NAME       Specifies a group name for a set of rules to modify together \n\
/icmptype:LIST    list of ICMP types and codes separated by semicolon.\n\
                  \"*\" indicates all ICMP types and codes.\n\
/interf:LIST      The connectio/interface list as from `/con-show' or the related Windows folder\n\
                  Separate multiple values with a comma without extra space\n\
/itype-remote     packets passing through a RAS interface types match this rule     \n\
/itype-lan        packets passing through a lan interface types match this rule     \n\
/itype-wless      packets passing through a wireless interface types match this rule \n\
/itype-all        packets passing through any interface types match this rule (default)\n\
/local-addr:ADDR  packets matching ADDR match this rule.\n\
                  For inbound packets ADDR is matched againist the Destination IP field.\n\
                  For outbound packets ADDR is matched againist the Source IP field.\n\
                  ADDR can be\n\
                  any:              matches any IP address\n\
                  IPAddress:        matches only the exact IPv4 or IPv6 IP\n\
                  \"SUBNET/MASK\":    matches any IPv4/IPv6 part of the SUBNET (mandatory quotes)\n\
                                    MASK is the number of bits in the subnet mask or the subnet mask itself.\n\
                  IPStart-IPEnd:     matches any IPv4/IPv6 falling within this range\n\
                  Multiple entries can be specified in quotes and separating them with a comma and no spaces.\n\
                  If `/local-addr' is not given the default is any.\n\
/local-port:PORT  packets with matching IP port numbers match this rule.\n\
                  For inbound packets PORT is matched againist the Destination Port IP field.\n\
                  For outbound packets PORT is matched againist the Source Port IP field.\n\
                  PORT can be:\n\
                  any:         matches any value in the port field of the IP packet.\n\
                  Integer(s):  individual numbers from 0 through 65535, a range,\n\
                               or a comma-separated list of numbers and ranges.\n\
                  rpc:         matches inbound TCP packets that are addressed to the listening socket\n\
                               of an application that correctly registers the port as an RPC listening\n\
                               port. A rule with this option must also give /prot-*, dir-* options\n\
                               and possibly /app or /service options\n\
                  rpc-epmap:   matches inbound TCP packets that are addressed to the dynamic RPC\n\
                               endpoint mapper service.\n\
                               It needs the same companion options as `rpc' value' In paricular,\n\
                               (to ensure only the RPC service can send/receive data) use:,\n\
                               `/app:%windir%\system32\svchost.exe /service:rpcss'\n\
                               If you create a rule /local-port:rpc, then you must also create a rule\n\
                               with `/local-port:rpc-epmap` enabled, to allow both the incoming request\n\
                               to the mapper, and the subsequent packets to the ephemeral ports\n\
                               assigned by the RPC service.\n\
                  Teredo:      Matches inbound UDP packets that contain Teredo packets.\n\
                  iphttps:     Matches inbound TCP packets containing HTTPS with embedded IPv6 packets.\n\
                               iphttps allows IPv6 packets that would otherwise be blocked if sent by\n\
                               using Teredo, 6to4, or native IPv6.\n\
                  Multiple entries can be specified in quotes and separating them with a comma and no spaces\n\
                  If `/local-port' is not specified, the default is any\n\
/name:NAME        Specifies the name of this firewall rule. \n\
/prof-domain      The rule is assigned to the domain profile (*)\n\
/prof-private     The rule is assigned to the private profile(*)\n\
/prof-public      The rule is assigned to the public profile (*)\n\
                  (*) The rule will be active if/when  the related  profile is such.\n\
                      If a profile is not specified, the rule is active on any profile.\n\
/prot-tcp         packets whose protocol field tcp match this rule\n\
/prot-udp         packets whose protocol field udp match this rule\n\
/prot-icmpv4      packets whose protocol field icmpv4 match this rule\n\
/prot-icmpv6      packets whose protocol field icmpv6 match this rule\n\
/remo-addr:ADDR   packets matching remote ADDR match this rule.\n\
                  for outbound packets ADDR is compared to the Destination IP address field\n\
                  for inbound packets ADDR is compared to the Source IP address field\n\
                  ADDR can be\n\
                  any:          Matches any IP address\n\
                  localsubnet:  Matches any IP address on the same IP subnet as the local computer\n\
                  dns|dhcp|wins|defaultgateway: Matches the IP address of any computer configured as\n\
                                                dns, dhcp, wins, default gateway on the local computer\n\
                  IPAddress, \"SUBNET/MASK\", IPStart-IPEnd:  See `/local-addr'\n\
                  Multiple entries can be specified as with `/local-addr'\n\
/remo-port:PORT   packets with matching IP port numbers match this rule.\n\
                  For inbound packets PORT is matched againist the Source Port IP field.\n\
                  For outbound packets PORT is matched againist the Destination Port IP field.\n\
                  PORT can be:\n\
                  any:  Matches any value in the port field of the IP packet\n\
                  Integer(s):  individual numbers from 0 through 65535, a range,\n\
                               or a comma-separated list of numbers and ranges.\n\
                  Multiple entries can be specified in quotes and separating them with a comma and no spaces\n\
                  If `/remo-port' is not specified, the default is any\n\
/service:SERVICE  traffic generated by service SERVICE matches this rule.\n\
                  SERVICE is the short name from Services snap-in\n\
                  If `/service' is not given, any service matches this rule.\n\
                  If SERVICE is \"*\", then any service, but  not an application, matches this rule\n\
";


var conShow=false,
    profShow=false,
    ruleAdd=false,
    ruleDel=false,
    ruleShow=false,
    userConn=null,
    conSub=null,
    userRule=null,
    o_long=false,
    o_grep=false,
    o_sep=false,

    o_actBlock=false,      
    o_actAllow=false,     
    o_app="",  
    o_desc="",
    o_dirIn=false,        
    o_dirOut=false,       
    o_edge=false,
    o_enab=false,          
    o_group="",         
    o_icmptype="",      
    o_interf="",
    o_itypeRemote=false,
    o_itypeLan=false,
    o_itypeAll=false,
    o_itypeWless=false,
    o_localAddr="",    
    o_localPort="",   
    o_name="",          
    o_profDomain=false,   
    o_profPrivate=false,  
    o_profPublic=false,   
    o_protTcp=false,      
    o_protUdp=false,      
    o_protIcmpv4=false,   
    o_protIcmpv6=false,   
    o_remoAddr="",     
    o_remoPort="",     
    o_service="";  


//Constants
var
                                                                  
// Action            
NET_FW_ACTION_BLOCK = 0         , 
NET_FW_ACTION_ALLOW = 1         ,
NET_FW_ACTION_MAX = 2           ,
//ApplicationName: string
//Description: string
//Direction 
NET_FW_RULE_DIR_IN= 1,
NET_FW_RULE_DIR_OUT=  NET_FW_RULE_DIR_IN + 1  ,
NET_FW_RULE_DIR_MAX=  NET_FW_RULE_DIR_OUT + 1 ,
//EdgeTraversal: bool
//Enabled: bool 
//Grouping: string
//IcmpTypesAndCode: strings
//Interfaces:  list of interfaces.
//InterfaceTypes= "RemoteAccess", "Wireless", "Lan",  "All"
//LocalAddresses: string
//LocalPorts: string
//Name: string
//Profiles: 
NET_FW_PROFILE2_DOMAIN = 1  , 
NET_FW_PROFILE2_PRIVATE = 2 , 
NET_FW_PROFILE2_PUBLIC = 4  , 
// Protocol
NET_FW_IP_PROTOCOL_TCP = 6      , 
NET_FW_IP_PROTOCOL_UDP = 17     , 
NET_FW_IP_PROTOCOL_ICMPv4 = 1   , 
NET_FW_IP_PROTOCOL_ICMPv6 = 58  
//RemoteAddresses: string
//RemotePorts: string
//ServiceName: string 
;



Main();


function Main(){

  ParseArgs();

  if(conShow){
    showConnections(true);
    return; 
  }

  if(profShow){
    showRules(userConn, userRule);  
    return; 
  }

  if(ruleAdd){
    addRule();
    return; 
  }

  if(ruleDel){
    removeRule(userRule);
    return; 
  }

  if(ruleShow){
    if(!showConnections(false, userConn)) ShowUsage("Connection" + userConn + " does not exist");
    showRules(userConn, userRule);      
    return; 
  }
  
}


function ParseArgs(){
	 
  // No named args triggers help
  if(WScript.Arguments.named.Count==0)
    ShowUsage() ;

  // UnNamed args
  if(WScript.Arguments.Unnamed.Count>0)
    ShowUsage("Wrong arguments. Note: options start with a leading `/\'.") ;



  // Named args
  var argsNamed=WScript.Arguments.Named;
  for (var e =new Enumerator(argsNamed); !e.atEnd(); e.moveNext()) {
    var val=argsNamed(e.item());    
    switch (e.item()){

      case "con-show":   conShow=true;   conSub=val;     break;
      case "prof-show":  profShow=true;                  break;
      case "rule-add":   ruleAdd=true;   userConn=val;    break;
      case "rule-del":   ruleDel=true;   userRule=val;   break;
      case "rule-show":  ruleShow=true;  userConn=val;    break;
      case "long":       o_long=true;    userRule=val;   break;
      case "grep":       o_grep=true;                    break;
      case "sep":        o_sep=true;                     break;

      case "h":    ShowUsage();   break;
      case "help": ShowUsage();   break;

      //rule-add parameters 
      case "act-block":      o_actBlock=true;       break; 
      case "act-allow":      o_actAllow=true;       break; 
      case "app":            o_app=val;             break; 
      case "desc":           o_desc=val;            break; 
      case "dir-in":         o_dirIn=true;          break; 
      case "dir-out":        o_dirOut=true;         break; 
      case "edge":           o_edge=true;           break; 
      case "enab":           o_enab=true;           break; 
      case "group":          o_group=val;           break; 
      case "icmptype":       o_icmptype=val;        break; 
      case "interf":         o_interf=val;         break; 
      case "itype-remote":   o_itypeRemote=true;    break; 
      case "itype-lan":      o_itypeLan=true;       break; 
      case "itype-all":      o_itypeAll=true;       break; 
      case "itype-wless":    o_itypeWless=true;     break; 
      case "local-addr":     o_localAddr=val;      break; 
      case "local-port":     o_localPort=val;      break; 
      case "name":           o_name=val;            break; 
      case "prof-domain":    o_profDomain=true;     break; 
      case "prof-private":   o_profPrivate=true;    break; 
      case "prof-public":    o_profPublic=true;     break; 
      case "prot-tcp":       o_protTcp=true;        break; 
      case "prot-udp":       o_protUdp=true;        break; 
      case "prot-icmpv4":    o_protIcmpv4=true;     break; 
      case "prot-icmpv6":    o_protIcmpv6=true;     break; 
      case "remo-addr":      o_remoAddr=val;        break; 
      case "remo-port":      o_remoPort=val;        break; 
      case "service":        o_service=val;         break; 
      
      default:  ShowUsage("Unused option: " +  e.item());   
    }
  }
}


function ShowUsage(error){

  var out=(error ==null) ? WScript.StdOut : WScript.StdErr ;
  if(error !=null) {
    out.WriteLine(error + "\n");
    MORE="";
  }
  out.Write(HEAD + WScript.ScriptName + HELP + MORE);
  WScript.Quit();

}


//With null argument print con names, else check if argument is an existing con name
function showConnections (bPrint, sCon)
{

  var isCon=false;
  if(sCon=="" || sCon==null) isCon=true;
  
  var NETWORK_CONNECTIONS = 0x31;
  var oShell = new ActiveXObject("shell.application");
  var oFolder = oShell .namespace(NETWORK_CONNECTIONS);
  var cFolder = oFolder.items();  
  for (var e = new Enumerator(cFolder); !e.atEnd(); e.moveNext()) {
    var name = e.item().name;      
    //print or check 
    if(bPrint) {
      //If specific substring was asked and is not present skip next
      if(conSub!=null && !RegExp(conSub, "i").test(name)) continue;
      WScript.Echo(name);
    }
    else if(name==sCon) isCon=true ;  
  }

    return(isCon);
}	


function showRules(userConn, userRule){


  // Create the FwPolicy2 object
  var oFwPolicy2= new ActiveXObject("HNetCfg.FwPolicy2");


  if(profShow){
  
    // The returned 'CurrentProfiles' bitmask can have more than 1 bit set if multiple profiles 
    //   are active or current at the same time
    var CurrentProfiles = oFwPolicy2.CurrentProfileTypes;

    if(CurrentProfiles &&  NET_FW_PROFILE2_DOMAIN )
      WScript.Echo("Domain Firewall Profile is active");

    if(CurrentProfiles && NET_FW_PROFILE2_PRIVATE ) 
      WScript.Echo("Private Firewall Profile is active");
  
    if(CurrentProfiles && NET_FW_PROFILE2_PUBLIC ) 
      WScript.Echo("Public Firewall Profile is active");

    return;

  }

  // Does Connection or Rule match user? 
  var isUsrCon,   //True if a) user did not required a specific connection 
                  //        b) this rule is relative to the user asked connection 
                  
      isUsrRule; //True if a) user did not required a specific rule
                 //        b) this rule is the user asked ruel


  // Get the Rules object
  var oRules= oFwPolicy2.Rules;

  //loop over rules 
  for (var e = new Enumerator(oRules); !e.atEnd(); e.moveNext()) {

    isUsrCon=false;  isUsrRule=false;

    var rule=e.item(),
        str= rule.name,
        name= "",

        // If the rule is per interface(s) set them in array 
        InterfaceArray= (rule.Interfaces==null) ? null : JSArray(rule.Interfaces) ;


    //If user didn't ask for a rule or this is the asked rule  => show current rule 
    if(userRule==null || userRule==rule.Name) isUsrRule=true;

    //If user didn't ask for conn => show current rule
    isUsrCon= userConn==null;

    //if user asked for conn => check if it is in current rule
    if(userConn!="")
      for(var i in InterfaceArray){
        if(userConn==InterfaceArray[i]) {
          isUsrCon=true;
          break;
        }
      }

    // If this is not user compatible skip to next
    if(!isUsrCon || !isUsrRule) continue;

    //Prefix rows with "<rulename>=="
    if(o_grep) {
      str+="=="
      name=str;
    }

    //long rule listing
    if(o_long){
      str+=
      "\n"+name+ "Description:\t" + rule.Description +     
      "\n"+name+ "Application Name:\t" + rule.ApplicationName + 
      "\n"+name+ "Service Name:\t" + rule.ServiceName +
      "\n"+name+ "Protocol:\t" ; //...

      switch (rule.Protocol){
        case NET_FW_IP_PROTOCOL_TCP:    str+="TCP"; break; 
        case NET_FW_IP_PROTOCOL_UDP:    str+="UDP"; break; 
        case NET_FW_IP_PROTOCOL_ICMPv4: str+="UDP4"; break; 
        case NET_FW_IP_PROTOCOL_ICMPv6: str+="UDP6"; break; 
        default:  str+=rule.Protocol; break; 
      }

      // showports
      if(rule.Protocol == NET_FW_IP_PROTOCOL_TCP || rule.Protocol == NET_FW_IP_PROTOCOL_UDP){
        str+=
        "\n"+name+ "Local Ports:\t" + rule.LocalPorts + 
        "\n"+name+ "Remote Ports:\t" + rule.RemotePorts +
        "\n"+name+ "LocalAddresses:\t" + rule.LocalAddresses +
        "\n"+name+ "RemoteAddresses:\t" + rule.RemoteAddresses ;
      }


      if(rule.Protocol == NET_FW_IP_PROTOCOL_ICMPv4 || rule.Protocol == NET_FW_IP_PROTOCOL_ICMPv6)
        str+="\n"+name+ "ICMP Type and Code:\t" + rule.IcmpTypesAndCodes;

      switch(rule.Direction){
            case NET_FW_RULE_DIR_IN: str+="\n"+name+ "Direction:\tIn"; break;
            case NET_FW_RULE_DIR_OUT: str+="\n"+name+ "Direction:\tOut"; break;
      }

      str+=
      "\n"+name+ "Enabled:\t" + rule.Enabled +
      "\n"+name+ "Edge:\t" + rule.EdgeTraversal;

      switch(rule.Action){
            case NET_FW_ACTION_ALLOW: str+="\n"+name+ "Action:\tAllow"; break;
            case NET_FW_ACTION_BLOCK: str+="\n"+name+ "Action:\tBlock";
      }
  

      str+=
      "\n"+name+ "Grouping:\t" + rule.Grouping + 
      "\n"+name+ "Edge:\t" + rule.EdgeTraversal + 
      "\n"+name+ "Interface Types:\t" + rule.InterfaceTypes ;

      //Print conn/interface names if available
      if(InterfaceArray!=null){
        str+="\n"+name+ "Interfaces:\t" + InterfaceArray.join();
      }
      else
        str+="\n"+name+ "Interfaces:\tAll"; 

    }

    WScript.Echo(str);
    if(o_sep) WScript.Echo("=====");
   }
}
  


function addRule(){

  var oFwPolicy= new ActiveXObject("HNetCfg.FwPolicy2"),
      oFWRule= new ActiveXObject("HNetCfg.FWRule"),
      CurrentProfiles = oFwPolicy.CurrentProfileTypes,
      oRules = oFwPolicy.Rules;


  if(o_name=="")
    ShowUsage("/rule-add requires /name");


  oFWRule.Name = o_name;
  if(o_desc!="")
    oFWRule.Description = o_desc;

  //Note Protocol property must be set before the LocalPorts or RemotePorts!
  if(o_protTcp)
    oFWRule.Protocol = NET_FW_IP_PROTOCOL_TCP;
  if(o_protUdp)
    oFWRule.Protocol = NET_FW_IP_PROTOCOL_UDP;
  if(o_protIcmpv4)
    oFWRule.Protocol = NET_FW_IP_PROTOCOL_ICMPv4;
   if(o_protIcmpv6)
     oFWRule.Protocol = NET_FW_IP_PROTOCOL_ICMPv6;    

  if(o_localAddr!="")
    oFWRule.LocalAddresses = o_localAddr;
  if(o_localPort!="")
    oFWRule.LocalPorts = o_localPort;

  if(o_remoAddr!="")
    oFWRule.RemoteAddresses = o_remoAddr;
  if(o_remoPort!="")
    oFWRule.RemotePorts = o_remoPort;

  if(o_group!="")
    oFWRule.Grouping = o_group;

  if(o_profDomain)
    oFWRule.Profiles =NET_FW_PROFILE2_DOMAIN ;
  else if(o_profPrivate)
    oFWRule.Profiles =NET_FW_PROFILE2_PRIVATE;
  else if(o_profPublic)
    oFWRule.Profiles =NET_FW_PROFILE2_PUBLIC ;
  else
    oFWRule.Profiles = CurrentProfiles   ;


  if(o_interf!=""){
    var InterfaceArray = VArray(o_interf.split(","));    
    oFWRule.Interfaces =  InterfaceArray ; 
  }

  var itype="";
  if(o_itypeRemote)
    itype=",RemoteAccess";
  if(o_itypeLan)    
    itype=",Lan";
  if(o_itypeWless)  
    itype=",Wireless";
  if(o_itypeAll)
    itype=",All";
  oFWRule.InterfaceTypes=itype.substr(1);

  if(o_app!="")
    oFWRule.ApplicationName = o_app;

  if(o_service!="")
    oFWRule.ServiceName = o_service;


  if(o_edge)
    oFWRule.EdgeTraversal = true;

  if(o_icmptype!="")
    oFWRule.IcmpTypesAndCodes = o_icmptype;
    

  if(o_dirIn)
    oFWRule.Direction = NET_FW_RULE_DIR_IN ;
  if(o_dirOut)          
    oFWRule.Direction = NET_FW_RULE_DIR_OUT ;

  if(o_actAllow)
    oFWRule.Action = NET_FW_ACTION_ALLOW ;
  if(o_actBlock)
    oFWRule.Action = NET_FW_ACTION_BLOCK ;

  if(o_enab)
    oFWRule.Enabled = true ;


  //Add the new rule
  oRules.Add(oFWRule);

}


function removeRule(sRule){

  var oFwPolicy= new ActiveXObject("HNetCfg.FwPolicy2"),
      oRules = oFwPolicy.Rules,
      countRules=0;

  for(var e = new Enumerator(oRules); !e.atEnd(); e.moveNext()) 
    if(e.item().Name==sRule) countRules++;
  
  if(countRules!=0){
    WScript.Echo("Found " + countRules + " time(s) " +  sRule);
    oRules.Remove(sRule);
    WScript.Echo("Removed one: " +  sRule);
  }
  else
    WScript.Echo("Unable to find any rule: " +  sRule);

}


//Convert jscript array to VARIANT SAFEARRAY 
function VArray(jsArray){
  var oDict = new ActiveXObject( "Scripting.Dictionary" );
  for(var i = 0; i < jsArray.length; i++)
      oDict.add(i, jsArray[i]);
    return oDict.Items();
}

//Convert VARIANT SAFEARRAY to jscript array 
function JSArray(vsArray){
    return new VBArray(vsArray).toArray();
}
