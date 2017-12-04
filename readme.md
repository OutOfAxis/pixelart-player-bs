# Deploying node.js app for Bright Sign device

Since we have no CI or build server, work arround is required to successfully play campaign and application on device. 

## Getting Started

In repository, on dev branch you can find ``` build.zip ``` file which contains necessary files. 

### Prerequisites

SD Card should be formatted with FAT32 file system, that is Bright Sign recommendation. You can do it on MacOS by command

```
sudo diskutil eraseDisk FAT32 BBS MBRFormat /dev/disk2
```
where `/dev/disk2` should be replace by path to SD Card which can be found by running command and `BBS` is name (note: only chars allowed in name field)

```
sudo diskutil
```

### Deploying

All files from `build.zip` file should be in root directory on SD Card, after extracting directory should look like:

![](https://image.ibb.co/n3neqG/Zrzut_ekranu_2017_12_04_o_17_58_49.png)

_Creating folder content with empty file index.html will avoid rebooting device after firs use and registering player._

### Let's start

Create new Screen Group and new Pixel Art* Player in CMS on test environment, which is available right [here](https://outofaxis.github.io/pixelart-cms-client/#/login?redirect=campaigns&_k=kp00iz).

Register token should be replaced with this one in `registrationService.js`. As long as Bright Sign device is using `Node.js 5.11.1` we are deploying files interpreted by Babel. It might be confusing, but at line 34 is variable you are looking for. That's how it looks like:

        switch (_context.prev = _context.next) {
          case 0:
            token = '0ee3821';
            options = {
              method: 'PUT',
              uri: '' + communication.REST_API_URL + token,
              formData: {
                secret: getAndSetUniversallyUniqueIdentifier()
              },
              json: false
            };

### Publishing campaign
On first run, device will be registered automatically and connection with WebSocket will be established. Then you are ready to publish your first campaign. After publishing, when nothing appear on screen reboot might be required.

### Console and logs

`Administration Panel` is available on device listening IP. You can check IP via local network router or by running device without SD card, look at following image:
![](https://i.imgur.com/06KLgN1.jpg)

Username: **admin**

Password: **serial number**

_Under the device or line under IP address you can find serial number._

Moreover, on SD card device is logging into files `log.txt` and node.js app is logging into file `all-the-logs.log`\
