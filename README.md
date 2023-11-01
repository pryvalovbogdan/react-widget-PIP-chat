# react-widget-PIP-chat
### React chat widget with document picture in picture API/Socket.io

![react](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat)
![Typescript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)
![Socket.io](https://img.shields.io/badge/-Socket.io-010101?logo=socket.io&logoColor=white&style=flat)

![React Chat PIP](https://github.com/pryvalovbogdan/react-widget-PIP-chat/blob/main/assets/pip.gif)


## Installation:

### First of all generate openssl certificate to be able to use https protocole on localhost

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-privkey.pem -out localhost-cert.pem
```

### Then install dependencies.
```bash
yarn install
```

## Usage:

### Start backend server
```bash
yarn server
```

### Start client
```bash
yarn dev
```

### Run tests
```bash
yarn test
```

## If you want to support

Give a ⭐️ to project if you like it!

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to help improve this project.

## License
This project is licensed under the MIT License - see the LICENSE file for details.