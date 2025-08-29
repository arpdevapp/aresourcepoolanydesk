const os = require('os');

function getLocalIPAddresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (interface.family === 'IPv4' && !interface.internal) {
                addresses.push({
                    name: name,
                    address: interface.address,
                    port: 3000
                });
            }
        }
    }
    
    return addresses;
}

console.log('Your server is configured to run on:');
console.log('=====================================');
console.log('WiFi IP: http://192.168.1.19:3000');
console.log('WebSocket: ws://192.168.1.19:3000');
console.log('');

console.log('All available network interfaces:');
console.log('=================================');
const addresses = getLocalIPAddresses();
if (addresses.length === 0) {
    console.log('No external network interfaces found.');
    console.log('Make sure you are connected to a network (WiFi/LAN).');
} else {
    addresses.forEach(addr => {
        console.log(`${addr.name}: http://${addr.address}:3000`);
        console.log(`WebSocket: ws://${addr.address}:3000`);
        console.log('---');
    });
}

console.log('\nTo test from your Android device:');
console.log('1. Make sure your device is on the same WiFi network');
console.log('2. Use one of the IP addresses above in your Kotlin app');
console.log('3. Test the connection with: curl http://YOUR_IP:3000');
console.log('\nCommon issues:');
console.log('- Firewall blocking port 3000');
console.log('- Router blocking local network access');
console.log('- Device not on same network');
