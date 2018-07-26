'no local storage
Sub Main(args)
 print "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% SCRIPTS STARTS HERE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
  url$ = "file:///index.html"

  'url$ = "http://www.mysitehere.com" disabled
  if args <> invalid and args.Count() > 0 then
    url$ = args[0]
  end if
  print "url = ";url$

  reg = CreateObject("roRegistrySection", "networking")
  reg.write("ssh","22")

  n=CreateObject("roNetworkConfiguration", 0)

  n.SetLoginPassword("password")
  n.Apply()
  reg.flush()

  'reboots if html node not already enabled
  rs = createobject("roregistrysection", "html")
  mp = rs.read("mp")
  if mp <> "1" then
      rs.write("mp","1")
      rs.flush()
      RebootSystem()
  endif


  DoCanonicalInit()

  CreateNodeWidget(url$)
  DefaultHtmlWidget()

  HandleEvents()
End Sub
Sub ReloadConfig()
  gaa = GetGlobalAA()
  gaa.config = ParseJson(ReadAsciiFile("/bs-player-config.json"))
  if type(gaa.syslog) = "roSystemLog" then
    gaa.syslog.SendLine("BS: BSPlayer configuration loaded")
  endif
End Sub
Sub DefaultHtmlWidget()
  contentUrl$ = "file:///content/index.html"
  CreateHtmlWidget(contentUrl$)
End Sub
Function DoCanonicalInit()

  gaa =  GetGlobalAA()
  gaa.syslog = CreateObject("roSystemLog")

  gaa.syslog.SendLine("BS: Start Initialization")

  EnableZoneSupport(1)
  OpenOrCreateCurrentLog()

  ' Enable mouse cursor
  ' gaa.touchScreen = CreateObject("roTouchScreen")
  ' gaa.touchScreen.EnableCursor(true)

  gaa.mp = CreateObject("roMessagePort")

  gaa.gpioPort = CreateObject("roGpioControlPort")
  gaa.gpioPort.SetPort(gaa.mp)

  gaa.vm = CreateObject("roVideoMode")
  gaa.vm.setMode("1920x1080x60p")

  gaa.hp = CreateObject("roNetworkHotplug")
  gaa.hp.setPort(gaa.mp)

  ' Load BS Player configuration
  ReloadConfig()

  sysTime = CreateObject("roSystemTime")
  sysTime.SetTimeZone("GMT+4")

  ' Configure networking

  if gaa.config.wifi then
    gaa.syslog.SendLine("BS: Configuring WiFi network")
    nc = CreateObject("roNetworkConfiguration", 1)
  else
    gaa.syslog.SendLine("BS: Configuring Ethernet network")
    nc = CreateObject("roNetworkConfiguration", 0)
  endif

  if type(nc) = "roNetworkConfiguration" then
    gaa.syslog.SendLine("BS: Setup DWS")
    dwsAA = CreateObject("roAssociativeArray")
    dwsAA["port"] = "80"
    nc.SetupDWS(dwsAA)

    if gaa.config.wifi then
      nc.SetWiFiESSID(gaa.config.ssid)
      nc.SetWiFiPassphrase(gaa.config.passphrase)
    endif

    if gaa.config.dhcp then
      gaa.syslog.SendLine("BS: Enabling DHCP")
      nc.SetDHCP()
    else
      gaa.syslog.SendLine("BS: Setting static network configuration")
      nc.SetIP4Address(gaa.config.ip)
      nc.SetIP4Netmask(gaa.config.netmask)
      nc.SetIP4Gateway(gaa.config.gateway)
    endif

    if gaa.config.timeServer <> "" then
      gaa.syslog.SendLine("BS: Setting timeserver address")
      nc.SetTimeServer(gaa.config.timeServer)
    endif

    if gaa.config.dns1 <> "" or gaa.config.dns2 <> "" or gaa.config.dns3 <> "" then
      gaa.syslog.SendLine("BS: Adding DNS servers")
    endif
    if gaa.config.dns1 <> "" then nc.AddDNSServer(gaa.config.dns1)
    if gaa.config.dns2 <> "" then nc.AddDNSServer(gaa.config.dns2)
    if gaa.config.dns3 <> "" then nc.AddDNSServer(gaa.config.dns3)

    success = nc.Apply()
    if not success then
      gaa.syslog.SendLine("BS: Applying network configuration failure")
    endif
  else
    gaa.syslog.SendLine("BS: Network interface initialization failure")
  endif

  ' Start timer
  gaa.syslog.SendLine("BS: Starting screenshot timer")
  gaa.screenshotTimer = CreateObject("roTimer")
  gaa.screenshotTimer.SetPort(gaa.mp)
  gaa.screenshotTimer.SetElapsed(5, 0)
  gaa.screenshotTimer.SetUserData({msgtype:"takeScreenshot"})
  gaa.screenshotTimer.Start()

  gaa.syslog.SendLine("BS: Initialization completed")

End Function
Function FormatDateTime(dt)
  ' 2010-06-30T01:20
  pad = Function(s)
    st = s.Trim()
    if st.Len() = 2 then
      Return st
    else
      Return "0" + st
    end if
  End Function
  Return dt.GetYear().ToStr() + "-" + pad(strI(dt.GetMonth())) + "-" + pad(strI(dt.GetDay())) + "T" + pad(strI(dt.GetHour())) + ":" + pad(strI(dt.GetMinute())) + ":" + pad(strI(dt.GetSecond())) + "+04:00"
End Function
Sub CreateNodeWidget(url$ as String)

  ga =  GetGlobalAA()
  width=ga.vm.GetResX()
  height=ga.vm.GetResY()
  rect=CreateObject("roRectangle", 0, 0, width, height)

  ga.syslog.SendLine("BS: Creating Node Widget")

  'new node 5-16-17
  is = {
      port: 2998
  }
  config = {
    nodejs_enabled: true
    inspector_server: is
    brightsign_js_objects_enabled: true
    focus_enabled: true
    javascript_enabled: true
    url: url$
    storage_path: "SD:"
    storage_quota: 1073741824
  }
  'end new

  ga.nodeWidget = CreateObject("roHtmlWidget", rect, config)	'new added config object after rect 5-16-17
  ga.nodeWidget.SetPort(ga.mp)
  ga.nodeWidget.Show()

End Sub
Function OrientationToTransform(orientation as String)
  transform = "identity"
  if orientation = "90" then transform = "rot90"
  if orientation = "270" then transform = "rot270"
  Return transform
End Function
Sub CreateHtmlWidget(url$ as String)

  ga =  GetGlobalAA()
  width=ga.vm.GetResX()
  height=ga.vm.GetResY()

  ga.syslog.SendLine("BS: Creating HTML Widget")

  if ga.htmlWidget <> invalid then
    ga.htmlWidget.Hide()
  endif

  rect=CreateObject("roRectangle", 0, 0, width, height)

  'new node 5-16-17
  transform = OrientationToTransform(ga.config.orientation)
  is = {
      port: 2999
  }
  config = {
    nodejs_enabled: true
    inspector_server: is
    brightsign_js_objects_enabled: true
    focus_enabled: true
    javascript_enabled: true
    hwz_default: "on"
    url: url$
    transform: transform
    storage_path: "SD:"
    storage_quota: 1073741824
  }
  'end new

  ga.htmlWidget = CreateObject("roHtmlWidget", rect, config)	'new added config object after rect 5-16-17
  ga.htmlWidget.Show()

  if type(ga.syslog) = "roSystemLog" then
    ga.syslog.SendLine("BS: HTML widget loaded: " + url$)
  endif

End Sub
Sub HandleEvents()

  gaa =  GetGlobalAA()

  di = CreateObject("roDeviceInfo")
  si = CreateObject("roStorageInfo", "SD:")
  nc = CreateObject("roNetworkConfiguration", 0)

  receivedIpAddr = false
  currentConfig = nc.GetCurrentConfig()
  if currentConfig.ip4_address <> "" then
    ' We already have an IP addr
    receivedIpAddr = true
    gaa.syslog.SendLine("BS: already have an IP addr: "+currentConfig.ip4_address)
  end if

  gaa.syslog.SendLine("BS: Running handle events loop")

  receivedLoadFinished = false
  while true
    ev = wait(0, gaa.mp)
    ' print "BS: Received event ";type(ev)
    ' print "BS: Event data ";ev.GetData()
    gaa.syslog.SendLine("BS: Received event: " + type(ev))
    if type(ev) = "roNetworkAttached" then
      gaa.syslog.SendLine("BS: Received roNetworkAttached")
      receivedIpAddr = true
    else if type(ev) = "roHtmlWidgetEvent" then
      eventData = ev.GetData()
      if type(eventData) = "roAssociativeArray" and type(eventData.reason) = "roString" then
        gaa.syslog.SendLine("BS: Event data: " + FormatJson(ev.GetData(), 0))
        if eventData.reason = "load-error" then
          gaa.syslog.SendLine("BS: HTML load error: " + eventData.message)
        else if eventData.reason = "load-finished" then
          gaa.syslog.SendLine("BS: Received load finished")
          receivedLoadFinished = true
        else if eventData.reason = "message" then
          ' To use this: msgPort.PostBSMessage({text: "my message"});
              'm.logFile.SendLine(eventData.message.text)
              'm.logFile.AsyncFlush()
          if eventData.message.msgtype = "loadurl" then
            gaa.syslog.SendLine("BS: Loading URL: " + eventData.message.url)
            CreateHtmlWidget(eventData.message.url)
          else if eventData.message.msgtype = "orientationChanged" then
            gaa.syslog.SendLine("BS: Updating orientation")
            ReloadConfig()
            DefaultHtmlWidget()
          else if eventData.message.msgtype = "reboot" then
            gaa.syslog.SendLine("BS: Rebooting player")
            RebootSystem()
          endif
        endif
      else
        print "BS: Unknown eventData: "; type(eventData)
      endif
    else if type(ev) = "roGpioButton" then
      if ev.GetInt() = 12 then stop
    else if type(ev) = "roTimerEvent" then
      print "BS: Timer Event at "; Uptime(0)
      print "BS: User Data:"; ev.GetUserData()
      ' Saving screenshot
      screenshotIsSaved = gaa.vm.Screenshot({
        filename: "SD:/screenshot.jpeg"
        width: 320
        height: 200
        filetype: "JPEG"
        async: 0
      })
      if screenshotIsSaved
        print "BS: Screenshot has been saved"
      else
        print "BS: Error saving screenshot"
      end if
      ' Sending screenshot
      print "BS: Sending screenshot for playerId="; gaa.config.id
      ut = CreateObject("roUrlTransfer")
      ut.SetUrl("http://" + gaa.config.logServerUri + "/log-data/android/screenshot/" + gaa.config.id)
      statusCode = ut.PutFromFile("/screenshot.jpeg")
      print "BS: Screenshot sent: "; statusCode
      ' Sending system log
      ut = CreateObject("roUrlTransfer")
      ut.SetUrl("http://" + gaa.config.logServerUri + "/log-data/android/system-report")
      ut.AddHeader("Content-Type", "application/json")
      st = CreateObject("roSystemTime")
      lastOnline = CreateObject("roDateTime")
      systemStartTime = CreateObject("roDateTime")
      loadavg = di.GetLoadStatistics({item:"loadavg"})
      meminfo = di.GetLoadStatistics({item:"meminfo"})
      netconf = nc.GetCurrentConfig()
      timestamp = st.GetLocalDateTime().ToSecondsSinceEpoch()
      lastOnline.FromSecondsSinceEpoch(timestamp)
      systemStartTime.FromSecondsSinceEpoch(timestamp - di.GetDeviceUptime())
      cpuRe = CreateObject("roRegex", "^([0-9.]+)", "")
      memRe = CreateObject("roRegex", "MemTotal:\s*(\d+).*MemFree:\s*(\d+).*MemAvailable:\s*(\d+).*", "ms")
      memusage = memRe.Match(meminfo)
      cpuload = (val(cpuRe.Match(loadavg)[1])*100) MOD 101
      logData = CreateObject("roAssociativeArray")
      logData["playerId"] = gaa.config.id
      logData["modelName"] = di.GetModel()
      logData["systemVersion"] = di.GetVersion()
      logData["appVersion"] = "0.1"
      logData["systemStartTime"] = FormatDateTime(systemStartTime)
      logData["totalCapacity"] = si.GetSizeInMegabytes()
      logData["totalFreeSpace"] = si.GetFreeInMegabytes()
      logData["cpuUsage"] = strI(cpuload).Trim() + "%"
      logData["memoryTotal"] = val(memusage[1])
      logData["memoryUsed"] = val(memusage[1]) - val(memusage[2])
      logData["ipAddress"] = netconf.ip4_address
      logData["lastOnline"] = FormatDateTime(lastOnline)
      payload = FormatJson(logData, 0)
      print payload
      statusCode = ut.PutFromString(payload)
      print "BS: System log sent: "; statusCode
      print "BS: Cleaning up memory"
      ut = invalid
      netconf = invalid
      logData = invalid
      RunGarbageCollector()
      gaa.screenshotTimer.Start()
    else
      gaa.syslog.SendLine("BS: Unhandled event: " + type(ev))
    end if
    if receivedIpAddr and receivedLoadFinished then
      gaa.syslog.SendLine("BS: OK to show HTML, showing widget now")
      gaa.htmlWidget.Show()
      gaa.nodeWidget.Show()
      gaa.htmlWidget.PostJSMessage({msgtype:"htmlloaded"})
      receivedIpAddr = false
      receivedLoadFinished = false
    endif
  endwhile

End Sub
Sub OpenOrCreateCurrentLog()

  ' if there is an existing log file for today, just append to it. otherwise, create a new one to use

        fileName$ = "log.txt"
        m.logFile = CreateObject("roAppendFile", fileName$)
        if type(m.logFile) = "roAppendFile" then
            return
        endif

    m.logFile = CreateObject("roCreateFile", fileName$)

End Sub
