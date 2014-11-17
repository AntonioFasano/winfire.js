
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
Manage Windows Firewall rules per interface   \n\
by Antonio FASANO   \n\
https://github.com/AntonioFasano/winfire.js   \n\
\n",

HELP=" [options]\n\
Use double quotations for option values containing spaces: /opt:\"my val\"\n\
\n\
/h[elp]                 This help\n\
/cs | /con-show[:SUB]   Show connection names [containing the substring SUB (ignoring case)]\n\
/ps | /prof-show        Show active profiles\n\
/ra | /rule-add:NAME    Add rule NAME       \n\
/rd | /rule-del:NAME    Remove rule NAME\n\
/rs | /rule-show[:NAME] Without NAME show rules names, else show details for rule NAME\n\
/long                   With `/rule-show' use details \n\
/grep                   With `/rule-show' use details and prefix each row with rule name + `=='\n\
/sep                    Separate rules in rule list with `===='\n\
",

MORE="\n\
`/rule-add' parameters:\n\
/blk|/act-block   packets matching rule criteria rule are blocked\n\
/act-allow        packets matching rule criteria rule are permitted (default)\n\
/app:APPPATH      traffic generated by app with APPPATH matches this rule. \n\
                  If `/app' is not given, any program matches this rule.\n\
/desc:DESC        the rule long decription. Defaults to 'Created by winfire'\n\
/dir-in           matches inbound network traffic (See Inbound Rules of Advanced Firewall snap-in)\n\
/dir-out          matches outbound network traffic(See Outbound Rules of Advanced Firewall snap-in)\n\
/edge             traffic that traverses an edge device, such as a NAT enabled router between\n\
                  the local and remote computer matches this rule. Valid only with /dir-in.\n\
                  Cf. `Allow edge traversal` checkbox in the  Advanced Firewall  snap-in.\n\
/enab             is the rule is currently enabled?\n\
/group:NAME       Specifies a group name for a set of rules to modify together \n\
/icmptype:LIST    list of ICMP types and codes separated by semicolon.\n\
                  \"*\" indicates all ICMP types and codes.\n\
/if|/interf:LIST  Cnnection/interface list as from `/con-show' to which the rule applies\n\
                  Separate multiple values with a comma without extra space\n\
                  If used with `/rule-show', only rules applying to LIST are shown\n\
/itype-remote     packets passing through a RAS interface types match this rule     \n\
/itype-lan        packets passing through a lan interface types match this rule     \n\
/itype-wless      packets passing through a wireless interface types match this rule \n\
/itype-all        packets passing through any interface types match this rule (default)\n\
/la|/local-addr:ADDR  packets matching ADDR match this rule.\n\
                  For inbound packets ADDR is matched againist the Destination IP field.\n\
                  For outbound packets ADDR is matched againist the Source IP field.\n\
                  ADDR can be\n\
                  any:              matches any IP address\n\
                  IPAddress:        matches only the exact IPv4 or IPv6 IP\n\
                  \"SUBNET/MASK\":  matches any IPv4/IPv6 part of the SUBNET (mandatory quotes)\n\
                                    MASK is the number of bits in the subnet mask or the subnet mask itself.\n\
                  IPStart-IPEnd:     matches any IPv4/IPv6 falling within this range\n\
                  Multiple entries can be specified in quotes and separating them with a comma and no spaces.\n\
                  If `/local-addr' is not given the default is any.\n\
/lp|/local-port:PORT  packets with matching IP port numbers match this rule.\n\
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
/prof-domain      The rule is assigned to the domain profile (*)\n\
/prof-private     The rule is assigned to the private profile(*)\n\
/prof-public      The rule is assigned to the public profile (*)\n\
                  (*) You can use more `/prof-*' options\n\
                      The rule will be active when the related profiles are active.\n\
                      If a profile is not specified, the rule is active on any profile.\n\
/tcp|/prot-tcp    packets whose protocol field tcp match this rule\n\
/udp|/prot-udp    packets whose protocol field udp match this rule\n\
/icmp4|/prot-icmpv4 packets whose protocol field icmpv4 match this rule\n\
/icmp6|/prot-icmpv6 packets whose protocol field icmpv6 match this rule\n\
/ra|/remo-addr:ADDR  packets matching remote ADDR match this rule.\n\
                  for outbound packets ADDR is compared to the Destination IP address field\n\
                  for inbound packets ADDR is compared to the Source IP address field\n\
                  ADDR can be\n\
                  any:          Matches any IP address\n\
                  localsubnet:  Matches any IP address on the same IP subnet as the local computer\n\
                  dns|dhcp|wins|defaultgateway: Matches the IP address of any computer configured as\n\
                                                dns, dhcp, wins, default gateway on the local computer\n\
                  IPAddress, \"SUBNET/MASK\", IPStart-IPEnd:  See `/local-addr'\n\
                  Multiple entries can be specified as with `/local-addr'\n\
/rp|/remo-port:PORT  packets with matching IP port numbers match this rule.\n\
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
\nExamples in PowerShell:\n\
## Add and show LAN TCP rule for a given application\n\
$lan=.\\winfire /cs:local\n\
.\\winfire /ra:myrule /app:\"app path\" /tcp /lp:2300 /enab /if:$lan\n\
.\\winfire /rs:myrule\n\n\
";

//Globals: options
var
    InterfaceArray=[],
    //options and values
    o_conShow=false,
    usrConsub=null,
    o_profShow=false,
    o_ruleAdd=false,
    o_ruleDel=false,
    o_ruleShow=false,
    usrRule=null,
    o_long=false,
    o_grep=false,
    o_sep=false,
    o_actBlock=false,      
    o_actAllow=false,     
    o_app="",  
    o_desc="Created by winfire",
    o_dirIn=false,        
    o_dirOut=false,       
    o_edge=false,
    o_enab=false,          
    o_group="",         
    o_icmptype="",      
    o_interf="",
    usrInterfaceArray=[],    
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


// API Constants
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


//Globals: Cross Language
var Args=[], ArgsKey=[], ArgsKeyVal=[], ArgsUnnamed=[], 
    ScriptPath, ScriptName,
    StdOut, StdErr;
    initCross();


//Let's start
Main();


function Main(){

  interface2array();
  ParseArgs();

  if(o_conShow){
    conShow();
    return; 
  }

  if(o_profShow){
    ruleShow();  
    return; 
  }

  if(o_ruleAdd){
    ruleAdd();
    return; 
  }

  if(o_ruleDel){
    ruleDel(usrRule);
    return; 
  }

  if(o_ruleShow){
    ruleShow();      
    return; 
  }
  
}



function ParseArgs(){


  // No named args triggers help
  //if(WScript.Arguments.named.Count==0)
  if(ArgsKey.length==0)
    ShowUsage(null) ;

  // UnNamed args
  //if(WScript.Arguments.Unnamed.Count>0)
   if(ArgsUnnamed.length>0)
    ShowUsage("Wrong arguments. Note: options start with a leading `/\'.") ;

  // Named args
  //var argsNamed=WScript.Arguments.Named;
  //for (var e =new Enumerator(argsNamed); !e.atEnd(); e.moveNext()) {
  //  var val=argsNamed(e.item());    
  //  switch (e.item()){
  for (var i = 0; i < ArgsKey.length; i++){
    var val=ArgsKeyVal[i];    
    switch (ArgsKey[i]){
    
      case "cs" : case "con-show":   o_conShow=true;   usrConsub=val;  break;
      case "ps" : case "prof-show":  o_profShow=true;                  break;
      case "ra" : case "rule-add":   o_ruleAdd=true;   o_name=val;     break;
      case "rd" : case "rule-del":   o_ruleDel=true;   usrRule=val;    break;
      case "rs" : case "rule-show":  o_ruleShow=true;  usrRule=val; o_long=true; break;

      case "long":       o_long=true;                    break;
      case "grep":       o_grep=true;    o_long=true;    break;
      case "sep":        o_sep=true;                     break;

      case "h":    ShowUsage(null);   break;
      case "help": ShowUsage(null);   break;

      //rule-add parameters 
      case "blk" : case "act-block":    o_actBlock=true;       break; 
      case "act-allow":                 o_actAllow=true;       break; 
      case "app":                       o_app=val;             break; 
      case "desc":                      o_desc=val;            break; 
      case "dir-in":                    o_dirIn=true;          break; 
      case "dir-out":                   o_dirOut=true;         break; 
      case "edge":                      o_edge=true;           break; 
      case "enab":                      o_enab=true;           break; 
      case "group":                     o_group=val;           break; 
      case "icmptype":                  o_icmptype=val;        break; 
      case "if": case "interf":         o_interf=val;          break; 
      case "itype-remote":              o_itypeRemote=true;    break; 
      case "itype-lan":                 o_itypeLan=true;       break; 
      case "itype-all":                 o_itypeAll=true;       break; 
      case "itype-wless":               o_itypeWless=true;     break; 
      case "la": case "local-addr":     o_localAddr=val;       break; 
      case "lp": case "local-port":     o_localPort=val;       break; 
      case "prof-domain":               o_profDomain=true;     break; 
      case "prof-private":              o_profPrivate=true;    break; 
      case "prof-public":               o_profPublic=true;     break; 
      case "tcp": case "prot-tcp":      o_protTcp=true;        break; 
      case "udp": case "prot-udp":      o_protUdp=true;        break; 
      case "icmp4": case "prot-icmpv4": o_protIcmpv4=true;     break; 
      case "icmp6": case "prot-icmpv6": o_protIcmpv6=true;     break; 
      case "ra": case "remo-addr":      o_remoAddr=val;        break; 
      case "rp": case "remo-port":      o_remoPort=val;        break; 
      case "service":                   o_service=val;         break; 
      
      //default:  ShowUsage("Unused option: " +  e.item());
      default:  ShowUsage("Unused option: " +  ArgsKey[i]);

    }
  }

  //Check conn/inter if asked
  if(o_interf!="") isConn(o_interf)

}


function ShowUsage(error){

  var out=(error ==null) ? StdOut : StdErr ;
  if(error !=null) {
    out.WriteLine(error + "\n");
    MORE="";
  }
  out.Write(HEAD + ScriptName + HELP + MORE);
  echo("JScript major version: " + ScriptEngineMajorVersion() );
  quit();

}


//Create array of interface names
function interface2array (){
  var NETWORK_CONNECTIONS = 0x31;
  var oShell = new ActiveXObject("shell.application");
  var oFolder = oShell.Namespace(int(NETWORK_CONNECTIONS));
  var cFolder = oFolder.items();  
  for (var e = new Enumerator(cFolder); !e.atEnd(); e.moveNext()) 
    InterfaceArray.push(e.item().name);
}

//Check if all elements of the array of connections/interfs exists 
//Case sensitive
function isConn (sCons){
  usrInterfaceArray = sCons.split(",");
  forEach(usrInterfaceArray, function(item) {
    if(indexOf(InterfaceArray, item)==-1)
      ShowUsage("Connection/Interface " + item + " does not exist");
  })
}

//Show cons/interfs. The list should be similar to that of the Windows network folder
//If usrConsub is not null print only items matching the substring (non case)
function conShow (){
  Map(InterfaceArray, function(item){
//XXXXX consider to join next lines
    if(usrConsub==null) echo(item);
//    else if(RegExp(usrConsub, "i").test(item)) echo("\"\"" + item + "\"\"" );
    else if(RegExp(usrConsub, "i").test(item)) echo( item  );
  });
}


function ruleShow(){

  // Create the FwPolicy2 object
  var oFwPolicy2= new ActiveXObject("HNetCfg.FwPolicy2");


  // The returned 'CurrentProfiles' bitmask can have more than 1 bit set if multiple profiles 
  //   are active or current at the same time
  if(o_profShow){
    echo("Active profile(s): " +  getProfiles(oFwPolicy2.CurrentProfileTypes)  );
    return;
  }

  // Does Connection or Rule match user? 
  var isUsrCon,   //True if a) user did not required a specific connection 
                  //        b) this rule is relative to the user asked connection 
                  
      isUsrRule; //True if a) user did not required a specific rule
                 //        b) this rule is the user asked rule


  // Get the Rules object
  var oRules= oFwPolicy2.Rules;

  //loop over rules 
  for (var e = new Enumerator(oRules); !e.atEnd(); e.moveNext()) {

    isUsrCon=false;  isUsrRule=false;

    var rule=e.item(),
        str= rule.name,
        name= "",

        // If the rule is per interface(s) set them in array 
        arRuleInterfaces= (rule.Interfaces==null) ? null : JSArray(rule.Interfaces) ;


    //If user didn't ask for a rule or this is the asked rule  => show current rule 
    if(usrRule==null || usrRule==rule.Name) isUsrRule=true;

    //If user didn't ask for conn => show current rule
    if(!o_interf) isUsrCon=true;

    //if user asked for conn, but rule is general => do not show it 
    else if(o_interf && !arRuleInterfaces) isUsrCon=false;
    //else => check if con is relative to current rule
    else 
      for (var i = 0; i < usrInterfaceArray.length; i++) {
        if(indexOf(arRuleInterfaces, usrInterfaceArray[i])>-1) {
        isUsrCon=true;
        break;
      }}
    


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
      "\n"+name+ "Description:\t\t" + rule.Description +
      "\n"+name+ "Profiles:\t\t" + getProfiles(rule.Profiles) +
      "\n"+name+ "Application Name:\t" + rule.ApplicationName + 
      "\n"+name+ "Service Name:\t\t" + rule.ServiceName +
      "\n"+name+ "Protocol:\t\t" ; //...

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
        "\n"+name+ "Local Ports:\t\t" + rule.LocalPorts + 
        "\n"+name+ "Remote Ports:\t\t" + rule.RemotePorts +
        "\n"+name+ "LocalAddresses:\t\t" + rule.LocalAddresses +
        "\n"+name+ "RemoteAddresses:\t" + rule.RemoteAddresses ;
      }


      if(rule.Protocol == NET_FW_IP_PROTOCOL_ICMPv4 || rule.Protocol == NET_FW_IP_PROTOCOL_ICMPv6)
        str+="\n"+name+ "ICMP Type and Code:\t\t" + rule.IcmpTypesAndCodes;

      switch(rule.Direction){
            case NET_FW_RULE_DIR_IN: str+="\n"+name+ "Direction:\t\tIn"; break;
            case NET_FW_RULE_DIR_OUT: str+="\n"+name+ "Direction:\t\tOut"; break;
      }

      str+=
      "\n"+name+ "Enabled:\t\t" + rule.Enabled +
      "\n"+name+ "Edge Traversal:\t\t" + rule.EdgeTraversal;

      switch(rule.Action){
            case NET_FW_ACTION_ALLOW: str+="\n"+name+ "Action:\t\t\tAllow"; break;
            case NET_FW_ACTION_BLOCK: str+="\n"+name+ "Action:\t\t\tBlock";
      }
  

      str+=
      "\n"+name+ "Grouping:\t\t" + rule.Grouping + 
      "\n"+name+ "Interface Types:\t" + rule.InterfaceTypes ;

      //Print conn/interface names if available
      if(arRuleInterfaces!=null){
        str+="\n"+name+ "Interfaces:\t\t" + arRuleInterfaces.join();
      }
      else
        str+="\n"+name+ "Interfaces:\t\tAll"; 

    }

    echo(str);
    if(o_sep) echo("=====");
   }
}
  


function ruleAdd(){

  var oFwPolicy       = new ActiveXObject("HNetCfg.FwPolicy2"),
      oFWRule         = new ActiveXObject("HNetCfg.FWRule"),
      oRules = oFwPolicy.Rules;

  if(o_name=="")
    ShowUsage("/rule-add requires /name");

  oFWRule.Name = o_name;
  //if(o_desc!="")
  oFWRule.Description = o_desc;

  //Note: A Protocol property must be set before the LocalPorts or RemotePorts!
  if(o_protTcp)
    oFWRule.Protocol  = NET_FW_IP_PROTOCOL_TCP;
  if(o_protUdp)        
    oFWRule.Protocol  = NET_FW_IP_PROTOCOL_UDP;
  if(o_protIcmpv4)     
    oFWRule.Protocol  = NET_FW_IP_PROTOCOL_ICMPv4;
   if(o_protIcmpv6)
     oFWRule.Protocol = NET_FW_IP_PROTOCOL_ICMPv6;    



  //Local address/port
  try {
    if(o_localAddr!="")
      oFWRule.LocalAddresses = o_localAddr;
    if(o_localPort!="")
      oFWRule.LocalPorts = o_localPort;
  } catch(err) {
    ShowUsage(err.name + " -- " + err.message + "\nDid you add a proper /prot-* option?" );
  }


  if(o_remoAddr!="")
    oFWRule.RemoteAddresses = o_remoAddr;
  if(o_remoPort!="")
    oFWRule.RemotePorts = o_remoPort;

  if(o_group!="")
    oFWRule.Grouping = o_group;

  //Profiles
  var lProf=0;
  if(o_profDomain)  lProf+= NET_FW_PROFILE2_DOMAIN  ;
  if(o_profPrivate) lProf+= NET_FW_PROFILE2_PRIVATE ;
  if(o_profPublic)  lProf+= NET_FW_PROFILE2_PUBLIC  ;

  if(lProf>0)  oFWRule.Profiles = lProf ;
  else {
    oFWRule.Profiles = oFwPolicy.CurrentProfileTypes;
    echo("Using profile: " + getProfiles(oFwPolicy.CurrentProfileTypes));
  }

  if(o_interf!="")
    oFWRule.Interfaces = VArray(o_interf.split(",")); 
  echo("if: "+o_interf);

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


function ruleDel(sRule){

  var oFwPolicy= new ActiveXObject("HNetCfg.FwPolicy2"),
      oRules = oFwPolicy.Rules,
      countRules=0;

  for(var e = new Enumerator(oRules); !e.atEnd(); e.moveNext()) 
    if(e.item().Name==sRule) countRules++;
  
  if(countRules!=0){
    echo("Found " + countRules + " time(s) " +  sRule);
    oRules.Remove(sRule);
    echo("Removed one: " +  sRule);
  }
  else
    echo("Unable to find any rule: " +  sRule);

}


function getProfiles(CurrentProfiles){
// The Profiles properties is a bitmask which can have more than 1 bit set if multiple profiles 
//   are active or current at the same time


    var  strProfiles="";
    if(CurrentProfiles & NET_FW_PROFILE2_DOMAIN)
      strProfiles+=", Domain Profile";

    if(CurrentProfiles & NET_FW_PROFILE2_PRIVATE)
      strProfiles+=", Private Profile";
  
    if(CurrentProfiles & NET_FW_PROFILE2_PUBLIC)
      strProfiles+=", Public Profile";

    return(strProfiles.substring(2));

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




// similEcma 5

function Map (arr, fun){
  var newarr=Array();
  for (var i = 0; i < arr.length; i++)
    newarr.push (fun.call(arr, arr[i], i, arr));
  return newarr;   
}
//echo(Map([10,20,30], function (x) {return x;}));

function forEach (arr, fun){
  for (var i = 0; i < arr.length; i++)
    fun.call(arr, arr[i], i, arr  );
}
//forEach ([10,20,30], function(x) {myarr.push (x);});

function indexOf (arr, item){
  for (var i = 0; i < arr.length; i++)
    if (arr[i]===item) return i;
  return -1;
}

//end  similEcma 5


// Manage cross-language JScript/JScript.Net
// -----------------------------------------

//Global Cross Functions  
@if( @_jscript_version < 6 ) //JScript
  //WScript.Echo(@_jscript_version);
  function echo(str) {WScript.Echo(str)};
  function quit() {WScript.Quit()};
  function exit(n) {WScript.Quit(n)};
  function int (x) {return x} 

@else  //JScript.Net
  //print(@_jscript_version);  
  function echo(str) {print(str)};
  import System;
  function quit() {Environment.Exit(0)};
  function exit(n) {Environment.Exit(n)};
@end

//Initialise Global cross objects
function initCross() {

  //Arguments
  @if( @_jscript_version < 6 ) //JScript
    ScriptPath =WScript.ScriptFullName;
    for (var i = 0; i < WScript.Arguments.length; i++)
      Args.push (WScript.Arguments(i));
  @else   //JScript.Net
    ScriptPath =Environment.GetCommandLineArgs()[0];
    Args = Environment.GetCommandLineArgs().slice(1); 
  @end



  ScriptName=ScriptPath.slice(ScriptPath.lastIndexOf('\\')+1);
  for (var i = 0; i < Args.length; i++){
    var col=Args[i].indexOf(":")
    if(Args[i].charAt(0) == '/'){
      ArgsKey.push(col<0 ? Args[i].slice(1) : Args[i].slice(1, col));
      ArgsKeyVal.push(col<0 ? undefined  : Args[i].slice(col+1));
    }
    else 
      ArgsUnnamed.push(Args[i]);
    
  }



  //Console  
  @if( @_jscript_version < 6 ) //JScript
    StdOut=WScript.StdOut;
    StdErr=WScript.StdErr;

  @else  //JScript.Net
    StdOut=Console.Out;
    StdErr=Console.Error;
  @end

}

//end Manage cross-language
