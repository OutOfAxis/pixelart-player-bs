'no local storage
Sub Main(args)
 print "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% SCRIPTS STARTS HERE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
  contentUrl$ = "file:///content/index.html"
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

  CreateHtmlWidget(url$, contentUrl$)

  HandleEvents()
End Sub
Function DoCanonicalInit()

  gaa =  GetGlobalAA()

  EnableZoneSupport(1)
  OpenOrCreateCurrentLog()

  ' Enable mouse cursor
  ' gaa.touchScreen = CreateObject("roTouchScreen")
  ' gaa.touchScreen.EnableCursor(true)

  gaa.mp = CreateObject("roMessagePort")

  gaa.gpioPort = CreateObject("roGpioControlPort")
  gaa.gpioPort.SetPort(gaa.mp)

  gaa.vm = CreateObject("roVideoMode")
  gaa.vm.setMode("auto")

  ' set DWS on device
  nc = CreateObject("roNetworkConfiguration", 0)
  if type(nc) <> "roNetworkConfiguration" then
    nc = CreateObject("roNetworkConfiguration", 1)
  endif
  if type(nc) = "roNetworkConfiguration" then
    dwsAA = CreateObject("roAssociativeArray")
    dwsAA["port"] = "80"
    nc.SetupDWS(dwsAA)
    nc.Apply()
  endif

  gaa.hp = CreateObject("roNetworkHotplug")
  gaa.hp.setPort(gaa.mp)

  gaa.syslog = CreateObject("roSystemLog")

  gaa.config = ParseJson(ReadAsciiFile("/bs-player-config.json"))

  gaa.screenshotTimer = CreateObject("roTimer")
  gaa.screenshotTimer.SetPort(gaa.mp)
  gaa.screenshotTimer.SetElapsed(5, 0)
  gaa.screenshotTimer.SetUserData({msgtype:"takeScreenshot"})
  gaa.screenshotTimer.Start()

End Function
Sub CreateHtmlWidget(url$ as String, contentUrl$ as String)

  ga =  GetGlobalAA()
  width=ga.vm.GetResX()
  height=ga.vm.GetResY()
  rect=CreateObject("roRectangle", 0, 0, width, height)

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
    hwz_default: "on"
    url: url$
    storage_path: "SD:"
    storage_quota: 1073741824
  }
  'end new

  ga.nodeWidget = CreateObject("roHtmlWidget", rect, config)	'new added config object after rect 5-16-17
  ga.nodeWidget.Show()

  rect=CreateObject("roRectangle", 0, 0, width, height)

  'new node 5-16-17
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
    url: contentUrl$
    storage_path: "SD:"
    storage_quota: 1073741824
  }
  'end new

  ga.htmlWidget = CreateObject("roHtmlWidget", rect, config)	'new added config object after rect 5-16-17
  ga.htmlWidget.Show()

End Sub
Sub HandleEvents()

  gaa =  GetGlobalAA()
  receivedIpAddr = false
  nc = CreateObject("roNetworkConfiguration", 0)
  currentConfig = nc.GetCurrentConfig()
  if currentConfig.ip4_address <> "" then
    ' We already have an IP addr
    receivedIpAddr = true
    print "=== BS: already have an IP addr: ";currentConfig.ip4_address
  end if

  receivedLoadFinished = false
  while true
    ev = wait(0, gaa.mp)
    print "=== BS: Received event ";type(ev)
    if type(ev) = "roNetworkAttached" then
      print "=== BS: Received roNetworkAttached"
      receivedIpAddr = true
    else if type(ev) = "roHtmlWidgetEvent" then
      eventData = ev.GetData()
      if type(eventData) = "roAssociativeArray" and type(eventData.reason) = "roString" then
        if eventData.reason = "load-error" then
          print "=== BS: HTML load error: "; eventData.message
        else if eventData.reason = "load-finished" then
          print "=== BS: Received load finished"
          receivedLoadFinished = true
        else if eventData.reason = "message" then
          ' To use this: msgPort.PostBSMessage({text: "my message"});
              'm.logFile.SendLine(eventData.message.text)
              'm.logFile.AsyncFlush()
        endif
      else
        print "=== BS: Unknown eventData: "; type(eventData)
      endif
    else if type(ev) = "roGpioButton" then
      if ev.GetInt() = 12 then stop
    else if type(ev) = "roTimerEvent" then
      print "=== BS: Timer Event at "; Uptime(0)
      print "=== BS: User Data:"; ev.GetUserData()
      ' Saving screenshot
      screenshotIsSaved = gaa.vm.Screenshot({
        filename: "SD:/screenshot.jpeg"
        width: gaa.vm.GetOutputResX()
        height: gaa.vm.GetOutputResY()
        filetype: "JPEG"
        async: 0
      })
      if screenshotIsSaved
        print "=== BS: Screenshot has been saved"
      else
        print "=== BS: Error saving screenshot"
      end if
      ' Sending screenshot
      print "=== BS: Sending screenshot for playerId="; gaa.config.id
      ut = CreateObject("roUrlTransfer")
      ut.SetUrl("http://b.pixelart.ge:5111/log-data/android/screenshot/" + gaa.config.id)
      statusCode = ut.PutFromFile("/screenshot.jpeg")
      print "=== BS: Screenshot sent: "; statusCode
      gaa.screenshotTimer.Start()
      ' Sending system log
      st = CreateObject("roSystemTime")
      di = CreateObject("roDeviceInfo")
      si = CreateObject("roStorageInfo", "SD:")
      nc = CreateObject("roNetworkConfiguration", 0)
      ut = CreateObject("roUrlTransfer")
      ut.SetUrl("http://b.pixelart.ge:5111/log-data/android/system-report")
      ut.AddHeader("Content-Type", "application/json")
      loadavg = di.GetLoadStatistics({item:"loadavg"})
      meminfo = di.GetLoadStatistics({item:"meminfo"})
      netconf = nc.GetCurrentConfig()
      time = st.GetLocalDateTime().ToSecondsSinceEpoch()
      cpuRe = CreateObject("roRegex", "^([0-9.]+)", "")
      memRe = CreateObject("roRegex", "MemTotal:\s*(\d+).*MemFree:\s*(\d+).*MemAvailable:\s*(\d+).*", "ms")
      memusage = memRe.Match(meminfo)
      cpuload = (val(cpuRe.Match(loadavg)[1])*100) MOD 101
      logData = CreateObject("roAssociativeArray")
      logData["playerId"] = gaa.config.id
      logData["modelName"] = di.GetModel()
      logData["systemVersion"] = di.GetVersion()
      logData["appVersion"] = "0.1"
      logData["systemStartTime"] = di.GetDeviceLifetime()
      logData["totalCapacity"] = si.GetSizeInMegabytes() * 1024 * 1024
      logData["totalFreeSpace"] = si.GetFreeInMegabytes() * 1024 * 1024
      logData["cpuUsage"] = str(cpuload) + "%"
      logData["memoryTotal"] = val(memusage[1])
      logData["memoryUsed"] = val(memusage[1]) - val(memusage[2])
      logData["ipAddress"] = netconf.ip4_address
      logData["lastOnline"] = time * 1000
      payload = FormatJson(logData, 0)
      print payload
      statusCode = ut.PutFromString(payload)
      print "=== BS: System log sent: "; statusCode
    else
      print "=== BS: Unhandled event: "; type(ev)
    end if
    if receivedIpAddr and receivedLoadFinished then
      print "=== BS: OK to show HTML, showing widget now"
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
